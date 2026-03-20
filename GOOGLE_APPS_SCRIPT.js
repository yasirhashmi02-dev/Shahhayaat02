// ════════════════════════════════════════════════════════════════
// SHAH HAYAAT — Live Reviews + Blog Reactions API  v3
// Google Apps Script
// ════════════════════════════════════════════════════════════════

const SHEET_NAME_REVIEWS   = 'SiteReviews';
const SHEET_NAME_PROD      = 'ProductRatings';
const SHEET_NAME_RATELIMIT = 'RateLimit';
const SHEET_NAME_REACTIONS = 'BlogReactions';   // ← NEW

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
  const recent = rows.filter(r => r[0] === ip && new Date(r[1]).getTime() > oneHourAgo);
  if (recent.length >= 3) return false;
  sheet.appendRow([ip, new Date().toISOString()]);
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
    else if (type === 'blog_reactions')            data = getAllReactions();  // ← NEW
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

    const allowed = ['site_review', 'prod_review', 'prod_rating', 'blog_reaction'];  // ← NEW
    if (!allowed.includes(type)) return jsonResponse({ ok: false, error: 'Invalid type' });

    // Blog reactions don't need rate limiting per se — but limit to 1 per post per IP
    if (type === 'blog_reaction') {
      const postId   = sanitize(body.postId || '', 30);
      const reaction = sanitize(body.reaction || '', 10);
      if (!postId || !['love','helpful','leaf'].includes(reaction))
        return jsonResponse({ ok: false, error: 'Invalid reaction data' });
      const result = saveBlogReaction({ postId, reaction, ip });
      return jsonResponse(result);
    }

    // Rate limit all other types
    if (!checkRateLimit(ip)) return jsonResponse({ ok: false, error: 'Rate limit exceeded. Please try again later.' });

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

// ════════════════════════════════════════════════════════════════
// BLOG REACTIONS  (NEW)
// Sheet: BlogReactions
// Columns: PostID | love | helpful | leaf
// One row per post. Reactions are cumulative totals.
// ════════════════════════════════════════════════════════════════

function getReactionSheet() {
  return getOrCreateSheet(SHEET_NAME_REACTIONS, ['PostID', 'love', 'helpful', 'leaf']);
}

function getAllReactions() {
  const sheet = getReactionSheet();
  const rows  = sheet.getDataRange().getValues();
  if (rows.length <= 1) return {};
  const result = {};
  rows.slice(1).forEach(r => {
    if (r[0]) result[r[0]] = { love: Number(r[1])||0, helpful: Number(r[2])||0, leaf: Number(r[3])||0 };
  });
  return result;
}

function saveBlogReaction(d) {
  const sheet = getReactionSheet();
  const rows  = sheet.getDataRange().getValues();

  // Find existing row for this post
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === d.postId) {
      const colMap = { love: 2, helpful: 3, leaf: 4 };
      const col = colMap[d.reaction];
      if (!col) return { ok: false, error: 'Invalid reaction' };
      const current = Number(sheet.getRange(i + 1, col).getValue()) || 0;
      sheet.getRange(i + 1, col).setValue(current + 1);
      // Return updated counts
      const updated = sheet.getRange(i + 1, 1, 1, 4).getValues()[0];
      return { ok: true, counts: { love: Number(updated[1])||0, helpful: Number(updated[2])||0, leaf: Number(updated[3])||0 }};
    }
  }

  // New post — create row
  const newRow = [d.postId, 0, 0, 0];
  const colIdx = { love:1, helpful:2, leaf:3 };
  newRow[colIdx[d.reaction]] = 1;
  sheet.appendRow(newRow);
  return { ok: true, counts: { love: newRow[1], helpful: newRow[2], leaf: newRow[3] }};
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
    .filter(r => r[5] !== 'hidden')
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
