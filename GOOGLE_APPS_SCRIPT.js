// ════════════════════════════════════════════════════════════════
// SHAH HAYAAT — GOOGLE APPS SCRIPT
// Deploy as Web App: Execute as Me, Access: Anyone (anonymous)
// ════════════════════════════════════════════════════════════════

const SPREADSHEET_ID         = '1JzFvfZRwsk4sfed6r1R0i_5i5wA96UH-wE4VYVY2Se8';
const SHEET_NAME_LEADERBOARD = 'Leaderboard';           // reaction tab
const SHEET_NAME_TYPING      = 'TypingLeaderboard';     // typing tab
const SHEET_NAME_ANON_CTR    = 'Sheet3';                // counter tab
const SHEET_NAME_GAMES       = 'GameLeaderboard';        // math/memory/sequence

function getSpreadsheet() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

// ── RUN THIS FIRST to see all tab names in your spreadsheet ──────────────
// Select testSheets in the dropdown and click Run — check the Logs output
function testSheets() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheets = ss.getSheets();
  sheets.forEach(s => Logger.log('Tab name: "' + s.getName() + '"'));
  Logger.log('Total tabs: ' + sheets.length);
}
function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
// Note: GAS automatically handles CORS for web apps deployed as
// "Execute as Me, Access: Anyone". No manual headers needed.
// POST must use Content-Type: text/plain (not application/json)
// and redirect:follow to receive the response correctly.
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

function getNextAnonNumber() {
  const sheet = getOrCreateSheet(SHEET_NAME_ANON_CTR, ['Counter']);
  const val = sheet.getRange(2,1).getValue();
  const next = (parseInt(val) || 0) + 1;
  sheet.getRange(2,1).setValue(next);
  return next;
}

function resolveDisplayName(raw) {
  if (!raw || String(raw).trim() === '' || String(raw).startsWith('__auto__')) {
    return 'Anonymous ' + getNextAnonNumber();
  }
  var clean = String(raw).replace(/[^\p{L}\p{N}\s]/gu, '').trim().slice(0, 30);
  return clean || ('Anonymous ' + getNextAnonNumber());
}

// ── GET — handles reads AND the rename (GET is CORS-safe on GAS) ──────────
function doGet(e) {
  try {
    const p    = (e && e.parameter) ? e.parameter : {};
    const type = (p.type || '').toLowerCase();

    if (type === 'reaction_scores') return jsonResponse({ ok:true, data: getReactionScores() });
    if (type === 'typing_scores')   return jsonResponse({ ok:true, data: getTypingScores() });
    if (type === 'game_scores')     return jsonResponse({ ok:true, data: getGameScores(p.game || '') });

    // Rename by token: ?type=rename_typing&token=XXX&name=John
    if (type === 'rename_typing') {
      const token   = String(p.token || '').trim();
      const newName = String(p.name  || '').replace(/[^\p{L}\p{N}\s]/gu, '').trim().slice(0, 30);
      if (!token)   return jsonResponse({ ok:false, error:'missing token' });
      if (!newName) return jsonResponse({ ok:false, error:'missing name' });
      return jsonResponse(renameTypingEntry(token, newName));
    }

    // Rename by wpm+acc match: ?type=rename_typing_by_match&name=John&wpm=X&acc=Y
    // Rename reaction entry by taps+score match: ?type=rename_reaction_by_match&name=X&taps=Y&score=Z
    if (type === 'rename_reaction_by_match') {
      const newName = String(p.name  || '').replace(/[^\p{L}\p{N}\s]/gu, '').trim().slice(0, 30);
      const taps    = Number(p.taps  || 0);
      const score   = Number(p.score || 0);
      if (!newName) return jsonResponse({ ok:false, error:'missing name' });
      if (!taps)    return jsonResponse({ ok:false, error:'missing taps' });
      return jsonResponse(renameReactionByMatch(taps, score, newName));
    }

    if (type === 'rename_typing_by_match') {
      const newName = String(p.name || '').replace(/[^\p{L}\p{N}\s]/gu, '').trim().slice(0, 30);
      const wpm     = Number(p.wpm || 0);
      const acc     = Number(p.acc || 0);
      if (!newName) return jsonResponse({ ok:false, error:'missing name' });
      if (!wpm)     return jsonResponse({ ok:false, error:'missing wpm' });
      return jsonResponse(renameTypingByMatch(wpm, acc, newName));
    }

    return jsonResponse({ ok:true, status:'alive' });
  } catch(err) {
    return jsonResponse({ ok:false, error:err.message });
  }
}

// ── POST — saves new scores only ─────────────────────────────────────────
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents)
      return jsonResponse({ ok:false, error:'empty body' });
    const body = JSON.parse(e.postData.contents);
    if (body.type === 'reaction_score') return jsonResponse(saveReactionScore(body));
    if (body.type === 'typing_score')   return jsonResponse(saveTypingScore(body));
    if (body.type === 'game_score')     return jsonResponse(saveGameScore(body));
    return jsonResponse({ ok:false, error:'unknown type' });
  } catch(err) {
    return jsonResponse({ ok:false, error:err.message });
  }
}

// ════════════════════════════════════════════════════════════════
// REACTION LEADERBOARD  (ReactionLeaderboard — top 100)
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
  // Purge stale __auto__ entries
  all = all.filter(r => !String(r[0]||'').startsWith('__auto__'));
  all.sort((a,b) => Number(b[1]) - Number(a[1]));
  const top = all.slice(0, 100);

  sheet.clearContents();
  sheet.appendRow(['Name','Score','Timestamp','Token']);
  if (top.length) sheet.getRange(2,1,top.length,4).setValues(top);

  // Rank by score+name match — more reliable than token search
  let rank = 0;
  for (let i = 0; i < top.length; i++) {
    if (Number(top[i][1]) === score && String(top[i][0]) === displayName) {
      rank = i + 1;
      break;
    }
  }
  if (!rank) rank = top.filter(r => Number(r[1]) > score).length + 1;

  return { ok:true, rank, score, token, name: displayName };
}

function getReactionScores() {
  const sheet = getLeaderboardSheet();
  const rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return [];
  // Filter out stale __auto__ entries
  const clean = rows.slice(1).filter(r => !String(r[0]||'').startsWith('__auto__'));
  return clean.slice(0,100).map((r,i) => ({
    rank: i+1, name: r[0], score: Number(r[1])
  }));
}

// ════════════════════════════════════════════════════════════════
// TYPING LEADERBOARD  (Sheet2 — top 100)
// Score = WPM x (acc/100) x 10
// ════════════════════════════════════════════════════════════════
function getTypingSheet() {
  return getOrCreateSheet(SHEET_NAME_TYPING, ['Name','Score','WPM','Accuracy','Timestamp','Token']);
}

function saveTypingScore(d) {
  const wpm = Number(d.wpm || 0);
  const acc = Number(d.acc || 0);
  if (wpm < 1 || wpm > 300) return { ok:false, error:'wpm_out_of_range' };
  if (acc < 0 || acc > 100) return { ok:false, error:'acc_out_of_range' };

  const score       = Math.round(wpm * (acc / 100) * 10);
  const displayName = resolveDisplayName(d.name || '__auto__');
  const token       = Date.now() + '_' + Math.random().toString(36).slice(2,8);
  const timestamp   = new Date().toISOString();

  const sheet = getTypingSheet();
  sheet.appendRow([displayName, score, wpm, acc, timestamp, token]);

  let all = sheet.getDataRange().getValues().slice(1);
  all = all.filter(r => !String(r[0]||'').startsWith('__auto__'));
  all.sort((a,b) => Number(b[1]) - Number(a[1]));
  const top = all.slice(0, 100);

  sheet.clearContents();
  sheet.appendRow(['Name','Score','WPM','Accuracy','Timestamp','Token']);
  if (top.length) sheet.getRange(2,1,top.length,6).setValues(top);

  // Rank = position in sorted list (1-based) — find by score+name match, most reliable
  let rank = 0;
  for (let i = 0; i < top.length; i++) {
    if (Number(top[i][1]) === score && String(top[i][0]) === displayName) {
      rank = i + 1;
      break;
    }
  }
  // Fallback: count how many entries have a higher score
  if (!rank) rank = top.filter(r => Number(r[1]) > score).length + 1;

  return { ok:true, rank, score, token, name: displayName };
}

// Rename existing row by token — ZERO new rows added
function renameTypingEntry(token, newName) {
  const sheet = getTypingSheet();
  const data  = sheet.getDataRange().getValues();
  if (data.length <= 1) return { ok:false, error:'sheet empty' };

  let rank = null, score = null, renamed = false;
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][5]) === token) {
      data[i][0] = newName;
      renamed    = true;
      score      = Number(data[i][1]);
      rank       = i;  // 1-based position in sorted list
      break;
    }
  }
  if (!renamed) return { ok:false, error:'token not found' };

  sheet.clearContents();
  sheet.appendRow(['Name','Score','WPM','Accuracy','Timestamp','Token']);
  const rows = data.slice(1);
  if (rows.length) sheet.getRange(2,1,rows.length,6).setValues(rows);

  return { ok:true, renamed:true, rank, score, name: newName };
}

function getTypingScores() {
  const sheet = getTypingSheet();
  const rows  = sheet.getDataRange().getValues();
  if (rows.length <= 1) return [];
  // Filter out stale __auto__ entries left by old auto-save system
  const clean = rows.slice(1).filter(r => !String(r[0]||'').startsWith('__auto__'));
  return clean.slice(0,100).map((r,i) => ({
    rank: i+1, name: r[0], score: Number(r[1]), wpm: Number(r[2]), acc: Number(r[3])
  }));
}

// ════════════════════════════════════════════════════════════════
// RENAME REACTION ENTRY BY TAPS+SCORE MATCH
// Called via GET ?type=rename_reaction_by_match&name=X&taps=Y&score=Z
// Finds the most recent Anonymous row with matching score and renames it.
// Zero duplicate rows ever.
// ════════════════════════════════════════════════════════════════
function renameReactionByMatch(taps, score, newName) {
  const sheet = getLeaderboardSheet();
  const data  = sheet.getDataRange().getValues();
  if (data.length <= 1) return { ok:false, error:'sheet empty' };

  let rank = null, rScore = null, renamed = false;
  // Search from bottom (most recent) for Anonymous row with matching score
  for (let i = data.length - 1; i >= 1; i--) {
    const rowName  = String(data[i][0] || '');
    const rowScore = Number(data[i][1]);
    if (rowName.startsWith('Anonymous') && rowScore === score) {
      data[i][0] = newName;
      renamed    = true;
      rScore     = rowScore;
      rank       = i;  // 1-based sorted position
      break;
    }
  }
  if (!renamed) return { ok:false, error:'no matching anonymous entry found' };

  sheet.clearContents();
  sheet.appendRow(['Name','Score','Timestamp','Token']);
  const rows = data.slice(1);
  if (rows.length) sheet.getRange(2,1,rows.length,4).setValues(rows);

  return { ok:true, renamed:true, rank, score:rScore, name: newName };
}

// ════════════════════════════════════════════════════════════════
// RENAME BY WPM+ACC MATCH (called when user submits their name)
// Finds the most recent Anonymous row with matching wpm+acc and
// renames it in-place. Zero duplicate rows ever.
// Called via GET ?type=rename_typing_by_match&name=X&wpm=Y&acc=Z
// ════════════════════════════════════════════════════════════════
function renameTypingByMatch(wpm, acc, newName) {
  const sheet = getTypingSheet();
  const data  = sheet.getDataRange().getValues();
  if (data.length <= 1) return { ok:false, error:'sheet empty' };

  let rank = null, score = null, renamed = false;
  // Search from bottom (most recent) for Anonymous row with matching wpm+acc
  for (let i = data.length - 1; i >= 1; i--) {
    const rowName = String(data[i][0] || '');
    const rowWpm  = Number(data[i][2]);
    const rowAcc  = Number(data[i][3]);
    if (rowName.startsWith('Anonymous') && rowWpm === wpm && rowAcc === acc) {
      data[i][0] = newName;
      renamed    = true;
      score      = Number(data[i][1]);
      rank       = i;  // 1-based sorted position
      break;
    }
  }
  if (!renamed) return { ok:false, error:'no matching anonymous entry found' };

  sheet.clearContents();
  sheet.appendRow(['Name','Score','WPM','Accuracy','Timestamp','Token']);
  const rows = data.slice(1);
  if (rows.length) sheet.getRange(2,1,rows.length,6).setValues(rows);

  return { ok:true, renamed:true, rank, score, name: newName };
}

// ════════════════════════════════════════════════════════════════
// GAME LEADERBOARD — Math, Memory, Number Sequence (GameLeaderboard)
// Columns: Name, Score, Game, Metric, Timestamp
// ════════════════════════════════════════════════════════════════
function getGameSheet() {
  return getOrCreateSheet(SHEET_NAME_GAMES, ['Name','Score','Game','Metric','Timestamp']);
}

function saveGameScore(d) {
  const game   = String(d.game   || '').slice(0, 30);
  const score  = Number(d.score  || 0);
  const metric = String(d.metric || '').slice(0, 50);
  const name   = String(d.name   || '').trim();

  if (!game)        return { ok:false, error:'missing game'  };
  if (score < 0)    return { ok:false, error:'invalid score' };

  const displayName = resolveDisplayName(name || '__auto__');
  const sheet = getGameSheet();
  sheet.appendRow([displayName, score, game, metric, new Date().toISOString()]);

  // Get all rows for this game, sort by score desc, keep top 100
  let all = sheet.getDataRange().getValues().slice(1);
  all = all.filter(r => String(r[2]) === game && !String(r[0]||'').startsWith('__auto__'));
  all.sort((a,b) => Number(b[1]) - Number(a[1]));
  const top100 = all.slice(0, 100);

  // Rank = position among entries for this game
  let rank = 0;
  for (let i = 0; i < top100.length; i++) {
    if (Number(top100[i][1]) === score && String(top100[i][0]) === displayName) {
      rank = i + 1; break;
    }
  }
  if (!rank) rank = top100.filter(r => Number(r[1]) > score).length + 1;

  return { ok:true, rank, score, name: displayName, game };
}

function getGameScores(game) {
  if (!game) return [];
  const sheet = getGameSheet();
  const rows  = sheet.getDataRange().getValues();
  if (rows.length <= 1) return [];
  const clean = rows.slice(1)
    .filter(r => String(r[2]) === game && !String(r[0]||'').startsWith('__auto__'));
  clean.sort((a,b) => Number(b[1]) - Number(a[1]));
  return clean.slice(0,100).map((r,i) => ({
    rank: i+1, name: r[0], score: Number(r[1]), metric: r[3]
  }));
}


// ════════════════════════════════════════════════════════════════
// ONE-TIME CLEANUP — Run this once from the GAS editor to purge
// all stale __auto__ entries from both sheets.
// Select this function and click Run in the Apps Script editor.
// ════════════════════════════════════════════════════════════════
function purgeAutoEntries() {
  // Clean typing sheet (Sheet2)
  const tySheet = getTypingSheet();
  const tyData  = tySheet.getDataRange().getValues();
  if (tyData.length > 1) {
    const tyClean = tyData.slice(1).filter(r => !String(r[0]||'').startsWith('__auto__'));
    tySheet.clearContents();
    tySheet.appendRow(['Name','Score','WPM','Accuracy','Timestamp','Token']);
    if (tyClean.length) tySheet.getRange(2,1,tyClean.length,6).setValues(tyClean);
  }

  // Clean reaction sheet (ReactionLeaderboard)
  const rxSheet = getLeaderboardSheet();
  const rxData  = rxSheet.getDataRange().getValues();
  if (rxData.length > 1) {
    const rxClean = rxData.slice(1).filter(r => !String(r[0]||'').startsWith('__auto__'));
    rxSheet.clearContents();
    rxSheet.appendRow(['Name','Score','Timestamp','Token']);
    if (rxClean.length) rxSheet.getRange(2,1,rxClean.length,4).setValues(rxClean);
  }

  Logger.log('Cleanup done. Typing rows remaining: ' + (tyData.length - 1) + ', Reaction rows remaining: ' + (rxData.length - 1));
}
