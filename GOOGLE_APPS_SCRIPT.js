// ════════════════════════════════════════════════════════════════
// SHAH HAYAAT — FINAL WORKING VERSION (WEB APP SAFE)
// ════════════════════════════════════════════════════════════════

// 🔥 YOUR GOOGLE SHEET ID
const SPREADSHEET_ID = '1h1ogNP_cjfBwF_Yad2SR7QVgjFxXB1eiI5mSXLDfxLA';

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

// ── GET HANDLER
function doGet(e) {
  try {
    const type = (e.parameter.type || '').toLowerCase();

    if (type === 'reaction_scores') {
      return jsonResponse({ ok:true, data:getReactionScores() });
    }

    return jsonResponse({ ok:false });

  } catch(err) {
    return jsonResponse({ ok:false, error:err.message });
  }
}

// ── POST HANDLER
function doPost(e) {
  try {
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

  if (taps < 5 || taps > 200) return { ok:false };
  if (time < 120 || time > 2000) return { ok:false };

  const score = (taps * 5) + (1000 - time);

  const sheet = getLeaderboardSheet();

  sheet.appendRow([d.name, score, new Date().toISOString(), d.ip]);

  let all = sheet.getDataRange().getValues().slice(1);

  all.sort((a,b)=> Number(b[1]) - Number(a[1]));

  const top = all.slice(0,100);

  sheet.clearContents();
  sheet.appendRow(['Name','Score','Timestamp','IP']);

  if (top.length) {
    sheet.getRange(2,1,top.length,4).setValues(top);
  }

  const rank = top.findIndex(r =>
    Number(r[1]) === score && r[3] === d.ip
  ) + 1;

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
