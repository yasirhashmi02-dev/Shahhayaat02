// ─────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────
const SPREADSHEET_ID = '1h1ogNP_cjfBwF_Yad2SR7QVgjFxXB1eiI5mSXLDfxLA';
const SHEET_NAME_LEADERBOARD = 'ReactionLeaderboard';

// ─────────────────────────────────────────────
// SAFE SPREADSHEET ACCESS
// ─────────────────────────────────────────────
function getSpreadsheetSafe() {
  try {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  } catch (e) {
    throw new Error("Spreadsheet access failed. Please run init once.");
  }
}

// ─────────────────────────────────────────────
// INIT (AUTO CREATE + AUTHORIZE)
// ─────────────────────────────────────────────
function initApp() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  let sheet = ss.getSheetByName(SHEET_NAME_LEADERBOARD);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME_LEADERBOARD);
    sheet.appendRow(['Name','Score','Timestamp','IP']);
  }

  return "Initialized successfully";
}

// ─────────────────────────────────────────────
// GET HANDLER
// ─────────────────────────────────────────────
function doGet(e) {

  try {

    // 🔥 INIT TRIGGER
    if (e.parameter.init === "1") {
      return ContentService
        .createTextOutput(JSON.stringify({ ok:true, msg:initApp() }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const type = e.parameter.type;

    if (type === 'reaction_scores') {
      return ContentService
        .createTextOutput(JSON.stringify({
          ok:true,
          data: getReactionScores()
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ ok:false }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok:false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ─────────────────────────────────────────────
// POST HANDLER
// ─────────────────────────────────────────────
function doPost(e) {

  try {

    const body = JSON.parse(e.postData.contents);

    if (body.type === 'reaction_score') {

      const result = saveReactionScore({
        name: body.name || 'Anonymous',
        taps: body.taps,
        time: body.time,
        ip: e.parameter.userIp || 'unknown'
      });

      return ContentService
        .createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ ok:false }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok:false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ─────────────────────────────────────────────
// LEADERBOARD LOGIC
// ─────────────────────────────────────────────
function getLeaderboardSheet() {

  const ss = getSpreadsheetSafe();

  let sheet = ss.getSheetByName(SHEET_NAME_LEADERBOARD);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME_LEADERBOARD);
    sheet.appendRow(['Name','Score','Timestamp','IP']);
  }

  return sheet;
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
    rank: i+1,
    name: r[0],
    score: Number(r[1])
  }));
}
