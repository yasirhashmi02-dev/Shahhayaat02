// ════════════════════════════════════════════════════════════════
// SHAH HAYAAT — Live Reviews API  v2
// Google Apps Script — Replaces previous version
// Changes: IP rate limiting, input validation, spam protection
// ════════════════════════════════════════════════════════════════

const SHEET_NAME_REVIEWS  = 'SiteReviews';
const SHEET_NAME_PROD     = 'ProductRatings';
const SHEET_NAME_RATELIMIT = 'RateLimit';

// ── CORS + JSON response helper ───────────────────────────────────
function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── Rate limiting: max 3 submissions per IP per hour ─────────────
function checkRateLimit(ip) {
  const sheet = getOrCreateSheet(SHEET_NAME_RATELIMIT, ['IP','Timestamp']);
  const now = Date.now();
  const oneHourAgo = now - 3600000;
  const rows = sheet.getDataRange().getValues().slice(1);

  // Count recent submissions from this IP
  const recent = rows.filter(r => r[0] === ip && new Date(r[1]).getTime() > oneHourAgo);
  if (recent.length >= 3) return false; // rate limited

  // Log this submission
  sheet.appendRow([ip, new Date().toISOString()]);

  // Clean up old entries (keep last 500)
  const total = sheet.getLastRow();
  if (total > 501) sheet.deleteRows(2, total - 501);

  return true;
}

// ── Input sanitizer ───────────────────────────────────────────────
function sanitize(str, maxLen) {
  if (typeof str !== 'string') return '';
  return str.replace(/<[^>]*>/g, '').replace(/[<>&"']/g, '').trim().slice(0, maxLen || 300);
}

function validateStars(n) {
  const num = parseInt(n);
  return (!isNaN(num) && num >= 1 && num <= 5) ? num : 0;
}

// ── Sheet helper ──────────────────────────────────────────────────
function getOrCreateSheet(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, headers.length)
         .setBackground('#2A7A5A').setFontColor('#fff').setFontWeight('bold');
  }
  return sheet;
}

// ── GET handler ───────────────────────────────────────────────────
function doGet(e) {
  const type = (e.parameter.type || 'reviews').toLowerCase();
  const pid  = sanitize(e.parameter.pid || '', 30);
  let data;
  try {
    if      (type === 'prod_ratings')              data = getProdRatings();
    else if (type === 'prod_reviews' && pid)       data = getProdReviews(pid);
    else                                            data = getSiteReviews();
    return jsonResponse({ ok: true, data });
  } catch(err) {
    return jsonResponse({ ok: false, error: err.message });
  }
}

// ── POST handler ──────────────────────────────────────────────────
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const type = (body.type || '').toLowerCase();
    const ip   = e.parameter.userIp || 'unknown';

    // Validate type
    const allowed = ['site_review', 'prod_review', 'prod_rating'];
    if (!allowed.includes(type)) return jsonResponse({ ok: false, error: 'Invalid type' });

    // Rate limit check
    if (!checkRateLimit(ip)) return jsonResponse({ ok: false, error: 'Rate limit exceeded. Please try again later.' });

    // Validate stars
    const stars = validateStars(body.stars);
    if (!stars) return jsonResponse({ ok: false, error: 'Invalid star rating' });

    const name = sanitize(body.name || 'Anonymous', 60);
    const text = sanitize(body.text || '', 800);
    const pid  = sanitize(body.pid  || '', 30);

    if      (type === 'site_review')  saveSiteReview({ name, stars, text, ip });
    else if (type === 'prod_review')  saveProdReview({ pid, name, stars, text, ip });
    else if (type === 'prod_rating')  saveProdRating({ pid, stars, name, ip });

    return jsonResponse({ ok: true });
  } catch(err) {
    return jsonResponse({ ok: false, error: err.message });
  }
}

// ── Site Reviews ──────────────────────────────────────────────────
function saveSiteReview(d) {
  const sheet = getOrCreateSheet(SHEET_NAME_REVIEWS,
    ['Timestamp','Name','Stars','Review','IP','Status']);
  sheet.appendRow([new Date().toLocaleString('en-IN'), d.name, d.stars, d.text, d.ip, 'visible']);
}

function getSiteReviews() {
  const sheet = getOrCreateSheet(SHEET_NAME_REVIEWS,
    ['Timestamp','Name','Stars','Review','IP','Status']);
  const rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return [];
  return rows.slice(1)
    .filter(r => r[5] !== 'hidden')          // respect hidden flag
    .map(r => ({ ts: r[0], name: r[1], stars: Number(r[2]), text: r[3] }))
    .reverse().slice(0, 50);
}

// ── Product Reviews ───────────────────────────────────────────────
function saveProdReview(d) {
  if (!d.pid) return;
  const sheetName = 'ProdReview_' + d.pid;
  const sheet = getOrCreateSheet(sheetName,
    ['Timestamp','ProductID','Name','Stars','Review','Helpful','IP','Status']);
  sheet.appendRow([new Date().toLocaleString('en-IN'), d.pid, d.name, d.stars, d.text, 0, d.ip, 'visible']);
}

function getProdReviews(pid) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('ProdReview_' + pid);
  if (!sheet) return [];
  const rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return [];
  return rows.slice(1)
    .filter(r => r[7] !== 'hidden')
    .map(r => ({ ts: r[0], pid: r[1], name: r[2], stars: Number(r[3]), text: r[4], helpful: Number(r[5]) }))
    .reverse();
}

// ── Product Ratings (aggregate) ───────────────────────────────────
function saveProdRating(d) {
  if (!d.pid) return;
  const sheet = getOrCreateSheet(SHEET_NAME_PROD, ['Timestamp','ProductID','Stars','Name','IP']);
  sheet.appendRow([new Date().toLocaleString('en-IN'), d.pid, d.stars, d.name, d.ip]);
}

function getProdRatings() {
  const sheet = getOrCreateSheet(SHEET_NAME_PROD, ['Timestamp','ProductID','Stars','Name','IP']);
  const rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return {};
  const agg = {};
  rows.slice(1).forEach(r => {
    const pid = r[1], stars = Number(r[2]);
    if (!pid || !stars) return;
    if (!agg[pid]) agg[pid] = { total: 0, count: 0 };
    agg[pid].total += stars;
    agg[pid].count += 1;
  });
  Object.keys(agg).forEach(pid => {
    agg[pid].avg = Math.round((agg[pid].total / agg[pid].count) * 10) / 10;
  });
  return agg;
}
