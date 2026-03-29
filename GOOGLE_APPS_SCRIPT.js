// ════════════════════════════════════════════════════════════════
// SHAH HAYAAT — FINAL WORKING VERSION (WEB APP SAFE)
// ════════════════════════════════════════════════════════════════

// 🔥 YOUR GOOGLE SHEET ID
const SPREADSHEET_ID = '1JzFvfZRwsk4sfed6r1R0i_5i5wA96UH-wE4VYVY2Se8';

const SHEET_NAME_REVIEWS    = 'SiteReviews';
const SHEET_NAME_PROD       = 'ProductRatings';
const SHEET_NAME_RATELIMIT  = 'RateLimit';
const SHEET_NAME_REACTIONS  = 'BlogReactions';
const SHEET_NAME_LEADERBOARD = 'ReactionLeaderboard';

// ── ALWAYS USE THIS (NO ACTIVE SPREADSHEET)
function getSpreadsheet() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

// ── JSON RESPONSE
function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── SHEET HELPER (FIXED)
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

// ── OPTIONS HANDLER (CORS preflight)
function doOptions() {
  return ContentService.createTextOutput('').setMimeType(ContentService.MimeType.JSON);
}

// ── GET HANDLER
function doGet(e) {
  try {
    const type = ((e && e.parameter && e.parameter.type) || '').toLowerCase();

    if (type === 'reaction_scores') {
      return jsonResponse({ ok:true, data:getReactionScores() });
    }

    return jsonResponse({ ok:true, status:'alive' }); // health check

  } catch(err) {
    return jsonResponse({ ok:false, error:err.message });
  }
}

// ── POST HANDLER
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ ok:false, error:'empty body' });
    }

    const body = JSON.parse(e.postData.contents);

    if (body.type === 'reaction_score') {
      return jsonResponse(saveReactionScore({
        name: body.name || 'Anonymous',
        taps: body.taps,
        time: body.time,
        ip: 'user'
      }));
    }

    return jsonResponse({ ok:false });

  } catch(err) {
    return jsonResponse({ ok:false, error:err.message });
  }
}

// ════════════════════════════════════════════════════════════════
// LEADERBOARD
// ════════════════════════════════════════════════════════════════

function getLeaderboardSheet() {
  return getOrCreateSheet(SHEET_NAME_LEADERBOARD,
    ['Name','Score','Timestamp','IP']);
}

function saveReactionScore(d) {

  const taps = Number(d.taps || 0);
  const time = Number(d.time || 0);

  // Validation — log rejected values for debugging
  if (taps < 1 || taps > 500) return { ok:false, error:'taps_out_of_range', taps:taps };
  if (time < 100 || time > 3000) return { ok:false, error:'time_out_of_range', time:time };

  // Score: taps are the primary metric (weighted 20x), reaction speed is a
  // small bonus (max 200pts) so fast tappers always beat slow tappers.
  // Formula: (taps × 20) + reactionBonus
  // reactionBonus = 200 − clamp((time − 100) / 5, 0, 200)
  //   • time 100ms  → bonus 200  (inhuman fast, theoretical max)
  //   • time 150ms  → bonus 190  (world-class)
  //   • time 200ms  → bonus 180  (excellent)
  //   • time 600ms  → bonus 100  (average)
  //   • time 1100ms → bonus 0    (slow)
  // Example: 100 taps, 150ms → 2000 + 190 = 2190
  //          120 taps, 200ms → 2400 + 180 = 2580
  const reactionBonus = Math.max(0, 200 - Math.floor(Math.max(0, time - 100) / 5));
  const score = (taps * 20) + reactionBonus;

  // Use a unique token per submission so rank detection is unambiguous
  const token = Date.now() + '_' + Math.random().toString(36).slice(2, 8);

  const sheet = getLeaderboardSheet();

  sheet.appendRow([d.name, score, new Date().toISOString(), token]);

  let all = sheet.getDataRange().getValues().slice(1);

  all.sort((a,b)=> Number(b[1]) - Number(a[1]));

  const top = all.slice(0,100);

  sheet.clearContents();
  sheet.appendRow(['Name','Score','Timestamp','Token']);

  if (top.length) {
    sheet.getRange(2,1,top.length,4).setValues(top);
  }

  // Find rank by matching the unique token
  const rank = top.findIndex(r => r[3] === token) + 1;

  return { ok:true, rank: rank || null, score };
}

function getReactionScores() {

  const sheet = getLeaderboardSheet();
  const rows = sheet.getDataRange().getValues();

  if (rows.length <= 1) return [];

  return rows.slice(1).map((r,i)=>({
    rank:i+1,
    name:r[0],
    score:Number(r[1])
  }));
}
