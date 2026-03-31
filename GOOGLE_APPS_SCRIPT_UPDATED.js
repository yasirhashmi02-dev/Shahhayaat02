// ════════════════════════════════════════════════════════════════
// SHAH HAYAAT — GOOGLE APPS SCRIPT (FINAL — Auto-save + Anon numbering + Top 100)
// Deploy as Web App: Execute as Me, Access: Anyone (anonymous)
// Same URL — just paste and re-deploy as new version
// ════════════════════════════════════════════════════════════════

const SPREADSHEET_ID         = '1JzFvfZRwsk4sfed6r1R0i_5i5wA96UH-wE4VYVY2Se8';
const SHEET_NAME_LEADERBOARD = 'ReactionLeaderboard';   // Sheet 1
const SHEET_NAME_TYPING      = 'TypingLeaderboard';     // Sheet 2 (auto-created)
const SHEET_NAME_ANON_CTR    = 'AnonCounter';           // Shared anonymous counter

function getSpreadsheet() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}
function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
function getOrCreateSheet(name, headers) {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// ── GET next anonymous number (shared across both tests) ──────────────────
function getNextAnonNumber() {
  const sheet = getOrCreateSheet(SHEET_NAME_ANON_CTR, ['Counter']);
  const val = sheet.getRange(2,1).getValue();
  const next = (parseInt(val) || 0) + 1;
  sheet.getRange(2,1).setValue(next);
  return next;
}

// ── Resolve display name ──────────────────────────────────────────────────
// __auto__ prefix = auto-saved anon entry → assign "Anonymous N"
// Empty / whitespace → assign "Anonymous N"
// Real name → use as-is (sanitised)
function resolveDisplayName(raw) {
  if (!raw || String(raw).trim() === '' || String(raw).startsWith('__auto__')) {
    return 'Anonymous ' + getNextAnonNumber();
  }
  // Sanitise: strip anything that isn't letter/number/space
  var clean = String(raw).replace(/[^\p{L}\p{N}\s]/gu, '').trim().slice(0, 30);
  return clean || ('Anonymous ' + getNextAnonNumber());
}

// ── CORS preflight ────────────────────────────────────────────────────────
function doOptions() {
  return ContentService.createTextOutput('').setMimeType(ContentService.MimeType.JSON);
}

// ── GET ───────────────────────────────────────────────────────────────────
function doGet(e) {
  try {
    const type = ((e && e.parameter && e.parameter.type) || '').toLowerCase();
    if (type === 'reaction_scores') return jsonResponse({ ok:true, data: getReactionScores() });
    if (type === 'typing_scores')   return jsonResponse({ ok:true, data: getTypingScores() });
    return jsonResponse({ ok:true, status:'alive' });
  } catch(err) {
    return jsonResponse({ ok:false, error:err.message });
  }
}

// ── POST ──────────────────────────────────────────────────────────────────
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents)
      return jsonResponse({ ok:false, error:'empty body' });
    const body = JSON.parse(e.postData.contents);
    if (body.type === 'reaction_score') return jsonResponse(saveReactionScore(body));
    if (body.type === 'typing_score')   return jsonResponse(saveTypingScore(body));
    return jsonResponse({ ok:false, error:'unknown type' });
  } catch(err) {
    return jsonResponse({ ok:false, error:err.message });
  }
}

// ════════════════════════════════════════════════════════════════
// REACTION LEADERBOARD  (Sheet 1 — top 100)
// ════════════════════════════════════════════════════════════════
function getLeaderboardSheet() {
  return getOrCreateSheet(SHEET_NAME_LEADERBOARD, ['Name','Score','Timestamp','Token']);
}

function saveReactionScore(d) {
  const taps = Number(d.taps || 0);
  const time = Number(d.time || 0);
  if (taps < 1 || taps > 500) return { ok:false, error:'taps_out_of_range' };
  if (time < 100 || time > 3000) return { ok:false, error:'time_out_of_range' };

  const reactionBonus = Math.max(0, 200 - Math.floor(Math.max(0, time - 100) / 5));
  const score = (taps * 20) + reactionBonus;
  const displayName = resolveDisplayName(d.name);
  const token = Date.now() + '_' + Math.random().toString(36).slice(2,8);

  const sheet = getLeaderboardSheet();
  sheet.appendRow([displayName, score, new Date().toISOString(), token]);

  let all = sheet.getDataRange().getValues().slice(1);
  all.sort((a,b) => Number(b[1]) - Number(a[1]));
  const top = all.slice(0, 100);   // keep top 100

  sheet.clearContents();
  sheet.appendRow(['Name','Score','Timestamp','Token']);
  if (top.length) sheet.getRange(2,1,top.length,4).setValues(top);

  const rank = top.findIndex(r => r[3] === token) + 1;
  return { ok:true, rank: rank||null, score, name: displayName };
}

function getReactionScores() {
  const sheet = getLeaderboardSheet();
  const rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return [];
  return rows.slice(1,101).map((r,i) => ({
    rank: i+1, name: r[0], score: Number(r[1])
  }));
}

// ════════════════════════════════════════════════════════════════
// TYPING LEADERBOARD  (Sheet 2 — top 100)
// Score = WPM × (acc/100) × 10
// ════════════════════════════════════════════════════════════════
function getTypingSheet() {
  return getOrCreateSheet(SHEET_NAME_TYPING, ['Name','Score','WPM','Accuracy','Timestamp','Token']);
}

function saveTypingScore(d) {
  const wpm = Number(d.wpm || 0);
  const acc = Number(d.acc || 0);
  if (wpm < 1 || wpm > 300) return { ok:false, error:'wpm_out_of_range' };
  if (acc < 0 || acc > 100) return { ok:false, error:'acc_out_of_range' };

  const score = Math.round(wpm * (acc / 100) * 10);
  const isAnon = !d.name || String(d.name).startsWith('__auto__') || String(d.name).trim() === '';
  const displayName = resolveDisplayName(d.name);
  const token = Date.now() + '_' + Math.random().toString(36).slice(2,8);

  const sheet = getTypingSheet();

  // If this is a real named entry, remove any existing __auto__/Anonymous row
  // that has the same WPM and accuracy from this session (dedup).
  if (!isAnon) {
    let existing = sheet.getDataRange().getValues().slice(1);
    // Filter out rows where name starts with 'Anonymous' AND wpm+acc match exactly
    const filtered = existing.filter(r => {
      const rowName = String(r[0] || '');
      const rowWpm  = Number(r[2]);
      const rowAcc  = Number(r[3]);
      const isAnonRow = rowName.startsWith('Anonymous');
      return !(isAnonRow && rowWpm === wpm && rowAcc === acc);
    });
    // Rewrite sheet with duplicates removed before appending named entry
    sheet.clearContents();
    sheet.appendRow(['Name','Score','WPM','Accuracy','Timestamp','Token']);
    if (filtered.length) sheet.getRange(2,1,filtered.length,6).setValues(filtered);
  }

  sheet.appendRow([displayName, score, wpm, acc, new Date().toISOString(), token]);

  let all = sheet.getDataRange().getValues().slice(1);
  all.sort((a,b) => Number(b[1]) - Number(a[1]));
  const top = all.slice(0, 100);   // keep top 100

  sheet.clearContents();
  sheet.appendRow(['Name','Score','WPM','Accuracy','Timestamp','Token']);
  if (top.length) sheet.getRange(2,1,top.length,6).setValues(top);

  const rank = top.findIndex(r => r[5] === token) + 1;
  return { ok:true, rank: rank||null, score, name: displayName };
}

function getTypingScores() {
  const sheet = getTypingSheet();
  const rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return [];
  return rows.slice(1,101).map((r,i) => ({
    rank: i+1, name: r[0], score: Number(r[1]), wpm: Number(r[2]), acc: Number(r[3])
  }));
}
