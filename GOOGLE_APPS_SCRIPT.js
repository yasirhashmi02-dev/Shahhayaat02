// ════════════════════════════════════════════════════════════════
// SHAH HAYAAT — GOOGLE APPS SCRIPT
// Deploy as Web App: Execute as Me, Access: Anyone (anonymous)
// ════════════════════════════════════════════════════════════════

const SPREADSHEET_ID = '1JzFvfZRwsk4sfed6r1R0i_5i5wA96UH-wE4VYVY2Se8';

// Sheet tab names — must match exactly what you see at the bottom of the spreadsheet
const SHEETS = {
  reaction : 'Leaderboard',        // reaction speed test
  typing   : 'TypingLeaderboard',  // typing speed test
  math     : 'MathLeaderboard',    // math challenge
  memory   : 'MemoryLeaderboard',  // memory match
  sequence : 'SequenceLeaderboard',// number sequence
  counter  : 'Sheet3'              // anonymous name counter
};

function ss()          { return SpreadsheetApp.openById(SPREADSHEET_ID); }
function jsonOut(data) { return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON); }

function getSheet(key, headers) {
  const s = ss();
  let sheet = s.getSheetByName(SHEETS[key]);
  if (!sheet) {
    sheet = s.insertSheet(SHEETS[key]);
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// ── Anonymous name counter ────────────────────────────────────
function nextAnon() {
  const sheet = getSheet('counter', ['Counter']);
  const n = (parseInt(sheet.getRange(2,1).getValue()) || 0) + 1;
  sheet.getRange(2,1).setValue(n);
  return n;
}
function cleanName(raw) {
  if (!raw || String(raw).trim() === '' || String(raw).startsWith('__auto__'))
    return 'Anonymous ' + nextAnon();
  const c = String(raw).replace(/[^\p{L}\p{N}\s]/gu,'').trim().slice(0,30);
  return c || ('Anonymous ' + nextAnon());
}

// ── Rank helper ───────────────────────────────────────────────
// Returns 1-based rank of `score` in sorted array (higher = better)
function calcRank(rows, score, name) {
  // Try exact name+score match first
  for (let i = 0; i < rows.length; i++) {
    if (Number(rows[i][1]) === score && String(rows[i][0]) === name) return i + 1;
  }
  // Fallback: count entries with strictly higher score
  return rows.filter(r => Number(r[1]) > score).length + 1;
}

// ── Shared save function ──────────────────────────────────────
// cols: array of values for each column (name and score always first two)
// headers: column header names
function saveToSheet(sheetKey, headers, cols, score, displayName) {
  const sheet = getSheet(sheetKey, headers);
  sheet.appendRow(cols);

  let all = sheet.getDataRange().getValues().slice(1);
  all = all.filter(r => !String(r[0]||'').startsWith('__auto__') && !String(r[0]||'').startsWith('Anonymous __'));
  all.sort((a,b) => Number(b[1]) - Number(a[1]));
  const top = all.slice(0, 100);

  sheet.clearContents();
  sheet.appendRow(headers);
  if (top.length) sheet.getRange(2, 1, top.length, headers.length).setValues(top);

  const rank = calcRank(top, score, displayName);
  return { ok:true, rank, score, name: displayName };
}

// ── Shared read function ──────────────────────────────────────
function readSheet(sheetKey, mapFn) {
  const sheet = getSheet(sheetKey, []);
  const rows  = sheet.getDataRange().getValues();
  if (rows.length <= 1) return [];
  const clean = rows.slice(1).filter(r => !String(r[0]||'').startsWith('__auto__'));
  return clean.slice(0,100).map((r,i) => mapFn(r, i+1));
}

// ════════════════════════════════════════════════════════════════
// doGet — all reads
// ════════════════════════════════════════════════════════════════
function doGet(e) {
  try {
    const p    = (e && e.parameter) ? e.parameter : {};
    const type = (p.type || '').toLowerCase();

    if (type === 'reaction_scores')  return jsonOut({ ok:true, data: getScores('reaction') });
    if (type === 'typing_scores')    return jsonOut({ ok:true, data: getScores('typing')   });
    if (type === 'math_scores')      return jsonOut({ ok:true, data: getScores('math')     });
    if (type === 'memory_scores')    return jsonOut({ ok:true, data: getScores('memory')   });
    if (type === 'sequence_scores')  return jsonOut({ ok:true, data: getScores('sequence') });

    return jsonOut({ ok:true, status:'alive' });
  } catch(err) {
    return jsonOut({ ok:false, error:err.message });
  }
}

// ════════════════════════════════════════════════════════════════
// doPost — all saves
// ════════════════════════════════════════════════════════════════
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents)
      return jsonOut({ ok:false, error:'empty body' });
    const d = JSON.parse(e.postData.contents);
    if (d.type === 'reaction_score') return jsonOut(saveReaction(d));
    if (d.type === 'typing_score')   return jsonOut(saveTyping(d));
    if (d.type === 'math_score')     return jsonOut(saveMath(d));
    if (d.type === 'memory_score')   return jsonOut(saveMemory(d));
    if (d.type === 'sequence_score') return jsonOut(saveSequence(d));
    return jsonOut({ ok:false, error:'unknown type: ' + d.type });
  } catch(err) {
    return jsonOut({ ok:false, error:err.message });
  }
}

// ════════════════════════════════════════════════════════════════
// REACTION SPEED TEST  (Leaderboard sheet)
// Cols: Name, Score, Timestamp
// ════════════════════════════════════════════════════════════════
function saveReaction(d) {
  const taps = Number(d.taps || 0);
  const time = Number(d.time || 0);
  if (taps < 1 || taps > 500)   return { ok:false, error:'taps_out_of_range' };
  if (time < 100 || time > 3000) return { ok:false, error:'time_out_of_range' };
  const bonus = Math.max(0, 200 - Math.floor(Math.max(0, time - 100) / 5));
  const score = (taps * 20) + bonus;
  const name  = cleanName(d.name);
  return saveToSheet('reaction', ['Name','Score','Timestamp'],
    [name, score, new Date().toISOString()], score, name);
}

function getScores(key) {
  const maps = {
    reaction : (r,i) => ({ rank:i, name:r[0], score:Number(r[1]) }),
    typing   : (r,i) => ({ rank:i, name:r[0], score:Number(r[1]), wpm:Number(r[2]), acc:Number(r[3]) }),
    math     : (r,i) => ({ rank:i, name:r[0], score:Number(r[1]), correct:Number(r[2]) }),
    memory   : (r,i) => ({ rank:i, name:r[0], score:Number(r[1]), attempts:Number(r[2]), time:Number(r[3]) }),
    sequence : (r,i) => ({ rank:i, name:r[0], score:Number(r[1]), elapsed:Number(r[2]) })
  };
  return readSheet(key, maps[key] || ((r,i) => ({ rank:i, name:r[0], score:Number(r[1]) })));
}

// ════════════════════════════════════════════════════════════════
// TYPING SPEED TEST  (TypingLeaderboard sheet)
// Cols: Name, Score, WPM, Accuracy, Timestamp
// ════════════════════════════════════════════════════════════════
function saveTyping(d) {
  const wpm = Number(d.wpm || 0);
  const acc = Number(d.acc || 0);
  if (wpm < 1 || wpm > 300) return { ok:false, error:'wpm_out_of_range' };
  if (acc < 0 || acc > 100) return { ok:false, error:'acc_out_of_range' };
  const score = Math.round(wpm * (acc / 100) * 10);
  const name  = cleanName(d.name);
  return saveToSheet('typing', ['Name','Score','WPM','Accuracy','Timestamp'],
    [name, score, wpm, acc, new Date().toISOString()], score, name);
}

// ════════════════════════════════════════════════════════════════
// MATH CHALLENGE  (MathLeaderboard sheet)
// Cols: Name, Score, Correct, Wrong, Timestamp
// Score = correct answers (higher = better)
// ════════════════════════════════════════════════════════════════
function saveMath(d) {
  const correct = Number(d.correct || 0);
  const wrong   = Number(d.wrong   || 0);
  if (correct < 0 || correct > 200) return { ok:false, error:'invalid correct' };
  const name = cleanName(d.name);
  return saveToSheet('math', ['Name','Score','Correct','Wrong','Timestamp'],
    [name, correct, correct, wrong, new Date().toISOString()], correct, name);
}

// ════════════════════════════════════════════════════════════════
// MEMORY MATCH  (MemoryLeaderboard sheet)
// Cols: Name, Score, Attempts, TimeSecs, Timestamp
// Score = 1000 - (attempts*30) - (time*3), higher = better
// ════════════════════════════════════════════════════════════════
function saveMemory(d) {
  const attempts = Number(d.attempts || 0);
  const time     = Number(d.time     || 0);
  if (attempts < 8 || attempts > 200) return { ok:false, error:'invalid attempts' };
  const score = Math.max(0, 1000 - (attempts * 30) - (time * 3));
  const name  = cleanName(d.name);
  return saveToSheet('memory', ['Name','Score','Attempts','TimeSecs','Timestamp'],
    [name, score, attempts, time, new Date().toISOString()], score, name);
}

// ════════════════════════════════════════════════════════════════
// NUMBER SEQUENCE  (SequenceLeaderboard sheet)
// Cols: Name, Score, ElapsedSecs, Timestamp
// Score = round(10000 / elapsed), higher = better (faster)
// ════════════════════════════════════════════════════════════════
function saveSequence(d) {
  const elapsed = Number(d.elapsed || 0);
  if (elapsed < 1 || elapsed > 120) return { ok:false, error:'invalid elapsed' };
  const score = Math.round(10000 / elapsed);
  const name  = cleanName(d.name);
  return saveToSheet('sequence', ['Name','Score','ElapsedSecs','Timestamp'],
    [name, score, elapsed, new Date().toISOString()], score, name);
}

// ════════════════════════════════════════════════════════════════
// ONE-TIME SETUP — Run once to create all sheets
// ════════════════════════════════════════════════════════════════
function setupSheets() {
  getSheet('reaction', ['Name','Score','Timestamp']);
  getSheet('typing',   ['Name','Score','WPM','Accuracy','Timestamp']);
  getSheet('math',     ['Name','Score','Correct','Wrong','Timestamp']);
  getSheet('memory',   ['Name','Score','Attempts','TimeSecs','Timestamp']);
  getSheet('sequence', ['Name','Score','ElapsedSecs','Timestamp']);
  Logger.log('All sheets ready. Tab names:');
  Object.entries(SHEETS).forEach(([k,v]) => Logger.log(k + ' → ' + v));
}

// ── Run this to see all current tab names ────────────────────
function listSheets() {
  ss().getSheets().forEach(s => Logger.log('"' + s.getName() + '"'));
}
