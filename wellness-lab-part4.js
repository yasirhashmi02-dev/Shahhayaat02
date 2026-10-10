'use strict';

window.mod_hormonalRhythm = function () {
  LAB.showDemo({
    title: '🌸 Hormonal Rhythm',
    txt: '5 short questions about your monthly cycle. <strong>Completely private</strong> — nothing is stored anywhere. Takes under 2 minutes.',
    hint: 'Private · Results stay on your device',
    voiceEN: 'Hormonal rhythm check. Five quick questions about your monthly cycle. All completely private.',
    btnLabel: 'Begin Hormonal Check →',
    vis: `<div style="text-align:center">
      <div id="hrDemoIcon" style="font-size:2.4rem;transition:all .5s">🌸</div>
      <div style="font-size:.75rem;color:var(--tq);margin-top:.35rem">Private · Results stay on your device</div>
    </div>`,
    anim(vis) {
      const icons=['🌸','🌙','💫','🌿','🌸'];
      let i=0; const el=vis.querySelector('#hrDemoIcon');
      const id=setInterval(()=>{ i=(i+1)%icons.length; if(el){ el.style.opacity='0'; setTimeout(()=>{ el.textContent=icons[i]; el.style.opacity='1'; },250); } },1000);
      return id;
    }
  }, () => {
    LAB.render(`<div class="mwrap"><div class="card card--gd card--pop" style="border-color:rgba(201,120,0,.2)">
      <div class="step-head">
        <div class="tag tag--pk">🌸 Female · 1 of 3</div>
        <h2 class="h2" style="margin-top:.75rem;margin-bottom:.35rem">Hormonal Rhythm Check</h2>
        <p class="pg">5 quick questions. All answers stay on your device only.</p>
      </div>

      <div class="fld">
        <label class="lbl">How regular is your monthly cycle?</label>
        ${LAB.optGrid('hrReg',[
          {l:'Very regular (±2 days)',v:100},
          {l:'Mostly regular (±5 days)',v:75},
          {l:'Somewhat irregular',v:45},
          {l:'Very irregular / absent',v:20}
        ])}
      </div>

      <div class="fld">
        <label class="lbl">How severe are your pre-period symptoms (cramps, mood, bloating)?</label>
        ${LAB.optGrid('hrSymp',[
          {l:'Mild — barely noticeable',v:100},
          {l:'Moderate — manageable',v:72},
          {l:'Severe — affects daily life',v:40},
          {l:'Very severe / debilitating',v:18}
        ])}
      </div>

      <div class="fld">
        <label class="lbl">How is your energy in the week before your period?</label>
        ${LAB.optGrid('hrEnPre',[
          {l:'Normal — no change',v:100},
          {l:'Slightly lower',v:75},
          {l:'Noticeably lower',v:50},
          {l:'Very low / exhausted',v:25}
        ])}
      </div>

      <div class="fld">
        <label class="lbl">How is your mood across your cycle?</label>
        ${LAB.optGrid('hrMood',[
          {l:'Stable throughout',v:100},
          {l:'Minor changes',v:78},
          {l:'Notable mood swings',v:48},
          {l:'Significant mood changes',v:22}
        ])}
      </div>

      <div class="fld">
        <label class="lbl">How long does your period typically last?</label>
        ${LAB.optGrid('hrDur',[
          {l:'3–5 days (typical)',v:100},
          {l:'2–3 days or 5–7 days',v:78},
          {l:'Under 2 days',v:55},
          {l:'Over 7 days',v:35}
        ])}
      </div>

      <div class="btn-row">
        <button class="btn btn--gd btn--lg" onclick="_hrCalc()">Calculate →</button>
      </div>
    </div></div>`);

    LAB.say('Tap your answer for each question. Health results stay on your device.');
  });

  window._hrCalc = function () {
    const ids=['hrReg','hrSymp','hrEnPre','hrMood','hrDur'];
    const vals=ids.map(id=>LAB.fval(id,60));
    const sc=LAB.clamp(Math.round(LAB.avg(vals)),10,100);
    LAB.raw.hormonalScore=sc; LAB.raw.hormonalBreakdown=vals;
    LAB.celebrate();
    LAB.say(`Hormonal rhythm check done. Score: ${sc}. ${LAB.scoreLbl(sc)}.`);
    setTimeout(()=>{ LAB.idx++; LAB.next(); },1800);
  };
};

window.mod_energyIron = function () {
  LAB.showDemo({
    title: '⚡ Energy & Iron Check',
    txt: '4 quick questions about energy, fatigue and common iron-deficiency signs. Gets you a simple score and practical advice.',
    hint: 'Iron deficiency is very common — worth checking',
    voiceEN: 'Energy and iron check. Four questions about your energy levels and iron deficiency symptoms.',
    btnLabel: 'Begin Energy & Iron Assessment →',
    vis: `<div style="text-align:center">
      <div style="font-size:2rem" id="eiIcon">⚡</div>
      <div style="font-size:.75rem;color:var(--tq);margin-top:.3rem">Energy · Iron · Fatigue</div>
    </div>`,
    anim(vis) {
      const icons=['⚡','🩸','😴','💪'];
      let i=0; const el=vis.querySelector('#eiIcon');
      const id=setInterval(()=>{ i=(i+1)%4; if(el) el.textContent=icons[i]; },800);
      return id;
    }
  }, () => {
    LAB.render(`<div class="mwrap"><div class="card card--gd card--pop" style="border-color:rgba(201,120,0,.2)">
      <div class="step-head">
        <div class="tag tag--pk">🌸 Female · 2 of 3</div>
        <h2 class="h2" style="margin-top:.75rem;margin-bottom:.35rem">Energy & Iron</h2>
        <p class="pg">4 questions about fatigue and iron symptoms. Honest answers give the best result.</p>
      </div>

      <div class="fld">
        <label class="lbl">How is your energy level on most days?</label>
        ${LAB.optGrid('eiEn',[
          {l:'High — feel great',v:100},
          {l:'Moderate — okay',v:72},
          {l:'Low — often tired',v:42},
          {l:'Very low — exhausted daily',v:15}
        ])}
      </div>

      <div class="fld">
        <label class="lbl">Do you experience any of these? (pick closest)</label>
        ${LAB.optGrid('eiSymp',[
          {l:'None of these',v:100},
          {l:'Occasional cold hands/feet or dizziness',v:68},
          {l:'Frequent headaches or pale skin',v:42},
          {l:'Hair loss, brittle nails, or breathlessness',v:18}
        ])}
      </div>

      <div class="fld">
        <label class="lbl">How heavy is your monthly flow?</label>
        ${LAB.optGrid('eiFlow',[
          {l:'Light to normal',v:100},
          {l:'Slightly heavy',v:72},
          {l:'Heavy — changes frequently',v:45},
          {l:'Very heavy / flooding',v:18}
        ])}
      </div>

      <div class="fld">
        <label class="lbl">How is your diet in iron-rich foods? (meat, beans, spinach, lentils)</label>
        ${LAB.optGrid('eiDiet',[
          {l:'Rich — eat these regularly',v:100},
          {l:'Moderate',v:70},
          {l:'Low — rarely eat these',v:40},
          {l:'Very low / vegetarian with no iron focus',v:22}
        ])}
      </div>

      <div class="btn-row">
        <button class="btn btn--gd btn--lg" onclick="_eiCalc()">Calculate →</button>
      </div>
    </div></div>`);

    LAB.say('Answer 4 questions about your energy and iron levels.');
  });

  window._eiCalc = function () {
    const ids=['eiEn','eiSymp','eiFlow','eiDiet'];
    const vals=ids.map(id=>LAB.fval(id,60));
    const sc=LAB.clamp(Math.round(LAB.avg(vals)),10,100);
    LAB.raw.ironScore=sc;
    LAB.celebrate();
    LAB.say(`Energy and iron check done. Score: ${sc}.`);
    setTimeout(()=>{ LAB.idx++; LAB.next(); },1800);
  };
};

window.mod_femCombined = function () {
  LAB.showDemo({
    title: '🌙 Sleep & Comfort',
    txt: '5 questions combining sleep-cycle quality and physical comfort — specific to female health patterns.',
    hint: 'Combines sleep cycle + comfort in one short check',
    voiceEN: 'Sleep and comfort check. Five questions about sleep quality linked to your cycle and physical comfort.',
    btnLabel: 'Begin Sleep & Comfort Assessment →',
    vis: `<div style="text-align:center;font-size:1.8rem" id="fcIcon">🌙</div>`,
    anim(vis) {
      const icons=['🌙','🛌','🌸','💆','🌙'];
      let i=0; const el=vis.querySelector('#fcIcon');
      const id=setInterval(()=>{ i=(i+1)%icons.length; if(el) el.textContent=icons[i]; },900);
      return id;
    }
  }, () => {
    LAB.render(`<div class="mwrap"><div class="card card--gd card--pop" style="border-color:rgba(201,120,0,.2)">
      <div class="step-head">
        <div class="tag tag--pk">🌸 Female · 3 of 3</div>
        <h2 class="h2" style="margin-top:.75rem;margin-bottom:.35rem">Sleep & Comfort</h2>
        <p class="pg">Final female module — 5 questions, under 2 minutes.</p>
      </div>

      <div class="fld">
        <label class="lbl">Does your sleep quality change with your cycle?</label>
        ${LAB.optGrid('fcSlCyc',[
          {l:'No change — stable sleep',v:100},
          {l:'Slight changes',v:78},
          {l:'Noticeable worsening before period',v:48},
          {l:'Significant disruption for many days',v:22}
        ])}
      </div>

      <div class="fld">
        <label class="lbl">How often do you experience pelvic pain or discomfort?</label>
        ${LAB.optGrid('fcPelv',[
          {l:'Rarely or never',v:100},
          {l:'Only during period — mild',v:75},
          {l:'Often during period — moderate',v:45},
          {l:'Frequent or severe / outside period too',v:18}
        ])}
      </div>

      <div class="fld">
        <label class="lbl">How is your bladder comfort? (urgency, leaks, pain)</label>
        ${LAB.optGrid('fcBlad',[
          {l:'No issues',v:100},
          {l:'Occasional urgency',v:75},
          {l:'Frequent urgency or mild leaks',v:48},
          {l:'Pain, frequent leaks, or infections',v:22}
        ])}
      </div>

      <div class="fld">
        <label class="lbl">How often do you feel bloated or have digestive discomfort?</label>
        ${LAB.optGrid('fcBloa',[
          {l:'Rarely',v:100},
          {l:'Around my period only',v:75},
          {l:'Several days per month',v:50},
          {l:'Most days',v:25}
        ])}
      </div>

      <div class="fld">
        <label class="lbl">Overall, how would you rate your physical wellbeing this month?</label>
        <input type="range" class="rng" id="fcWell" min="1" max="10" value="7"
               oninput="document.getElementById('fcWellV').textContent=this.value+'/10'">
        <div class="rng-l"><span>Very poor</span><span id="fcWellV" style="color:var(--gd);font-weight:700">7/10</span><span>Excellent</span></div>
      </div>

      <div class="btn-row">
        <button class="btn btn--gd btn--lg" onclick="_fcCalc()">Calculate & See Results →</button>
      </div>
    </div></div>`);

    LAB.say('Answer 5 final questions. After this, your full results will appear.');
  });

  window._fcCalc = function () {
    const ids=['fcSlCyc','fcPelv','fcBlad','fcBloa'];
    const vals=ids.map(id=>LAB.fval(id,65));
    const well=(parseInt(document.getElementById('fcWell')?.value||'7')/10)*100;
    vals.push(well);
    const sc=LAB.clamp(Math.round(LAB.avg(vals)),10,100);
    LAB.raw.femCombinedScore=sc;
    const femScores=[LAB.raw.hormonalScore,LAB.raw.ironScore,sc].filter(x=>x!=null);
    LAB.scores.hormonal=Math.round(LAB.avg(femScores));
    LAB.celebrate();
    LAB.say('Female modules complete! Loading your full results now.');
    setTimeout(()=>{ LAB.idx++; LAB.next(); },1800);
  };
};


/* ═══════════════════════════════════════════════════════
   NEW MODULE — WORD RECALL
   Show 8 words for 10s, hide them, user types recalled words
═══════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════
   NEW MODULE — PERIPHERAL VISION
   Dots flash at screen edges; user taps when they see them
═══════════════════════════════════════════════════════ */
window.mod_peripheralVision = function () {
  const ROUNDS = 10;
  let hits = 0, misses = 0, round = 0, waiting = false, dotTimer = null, roundTimer = null;

  LAB.showDemo({
    title: '🔍 Peripheral Vision',
    txt: 'A dot flashes <strong>at the edges</strong> of the screen — top, bottom, left or right. Tap the screen <strong>as soon as you see it</strong>. Keep your eyes on the centre cross.',
    hint: 'Eyes 4 of 5 — tests edge awareness',
    voiceEN: "Peripheral vision test! A dot will flash at the edge of your screen. Keep your eyes on the centre cross — and tap the moment you see any dot appear at the edges.",
    btnLabel: 'Begin Peripheral Vision Assessment →',
    vis: `<div style="position:relative;width:130px;height:110px;margin:0 auto" id="pvDemoArea">
      <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:1.1rem;color:var(--tq)">+</div>
      <div id="pvDemoDot" style="position:absolute;width:14px;height:14px;border-radius:50%;background:var(--g);opacity:0;transition:opacity .15s"></div>
    </div>`,
    anim(vis) {
      const dot = vis.querySelector('#pvDemoDot');
      const positions = [
        {top:'4px',left:'50%',transform:'translateX(-50%)'},
        {bottom:'4px',left:'50%',transform:'translateX(-50%)'},
        {left:'4px',top:'50%',transform:'translateY(-50%)'},
        {right:'4px',top:'50%',transform:'translateY(-50%)'},
      ];
      let pi = 0;
      const id = setInterval(() => {
        if (!dot) return;
        const p = positions[pi % positions.length]; pi++;
        Object.assign(dot.style, {top:'',bottom:'',left:'',right:'',transform:''});
        Object.assign(dot.style, p);
        dot.style.opacity = '1';
        setTimeout(() => { if(dot) dot.style.opacity = '0'; }, 600);
      }, 1400);
      return id;
    }
  }, () => {
    LAB.render(`<div class="mwrap"><div class="card card--pop" style="border-color:rgba(37,99,235,.2);background:linear-gradient(135deg,#EEF4FF,#fff)">
      <div class="step-head">
        <div class="tag" style="background:#EEF4FF;border-color:rgba(37,99,235,.28);color:#2563EB">👁 Eyes · 4 of 5</div>
        <h2 class="h2" style="margin-top:.75rem;margin-bottom:.35rem">Peripheral Vision</h2>
        <p class="pg">Keep your eyes on the <strong style="font-size:1.1rem">+</strong> centre. Tap anywhere when you see a dot flash at the edges.</p>
      </div>
      <div id="pvArena" onclick="_pvTap()"
           style="position:relative;width:100%;height:240px;background:#F8F9FA;border:2px solid var(--b);border-radius:var(--rs);cursor:pointer;overflow:hidden;user-select:none;touch-action:none">
        <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:2rem;color:var(--tq);pointer-events:none">+</div>
        <div id="pvDot" style="position:absolute;width:18px;height:18px;border-radius:50%;background:#2563EB;opacity:0;transition:opacity .1s;pointer-events:none"></div>
      </div>
      <div class="sc-row" style="justify-content:center;margin-top:.75rem">
        <div class="scb"><span class="v" id="pvHits">0</span><span class="l">Hits</span></div>
        <div class="scb"><span class="v" id="pvRound">0/${ROUNDS}</span><span class="l">Round</span></div>
        <div class="scb"><span class="v" id="pvMiss">0</span><span class="l">Missed</span></div>
      </div>
    </div></div>`);
    LAB.say("Eyes on the centre cross — tap the moment you see a dot at the edges. Go!");
    setTimeout(_pvNext, 800);
  });

  function _pvNext() {
    if (round >= ROUNDS) { _pvDone(); return; }
    round++;
    const rEl = document.getElementById('pvRound'); if(rEl) rEl.textContent = round+'/'+ROUNDS;
    const arena = document.getElementById('pvArena');
    if (!arena) return;
    const aW = arena.offsetWidth, aH = arena.offsetHeight;
    const dot = document.getElementById('pvDot'); if (!dot) return;
    // Place dot at a random edge position
    const edge = Math.floor(Math.random() * 4);
    const margin = 14;
    let dx, dy;
    if (edge === 0) { dx = margin + Math.random()*(aW-2*margin-18); dy = margin; }
    else if (edge === 1) { dx = margin + Math.random()*(aW-2*margin-18); dy = aH-margin-18; }
    else if (edge === 2) { dx = margin; dy = margin + Math.random()*(aH-2*margin-18); }
    else { dx = aW-margin-18; dy = margin + Math.random()*(aH-2*margin-18); }
    dot.style.left = Math.round(dx)+'px'; dot.style.top = Math.round(dy)+'px';
    dot.style.opacity = '1';
    waiting = true;
    clearTimeout(roundTimer);
    roundTimer = setTimeout(() => {
      if (waiting) { waiting = false; misses++; dot.style.opacity='0'; const m=document.getElementById('pvMiss');if(m)m.textContent=misses; setTimeout(_pvNext,400); }
    }, 900);
  }

  window._pvTap = function () {
    if (!waiting) return;
    waiting = false;
    clearTimeout(roundTimer);
    hits++;
    const dot = document.getElementById('pvDot'); if(dot) dot.style.opacity = '0';
    const hEl = document.getElementById('pvHits'); if(hEl) hEl.textContent = hits;
    LAB.flash('hit');
    setTimeout(_pvNext, 350);
  };

  function _pvDone() {
    const sc = LAB.clamp(Math.round((hits / ROUNDS) * 100), 5, 100);
    LAB.raw.peripheralHits = hits; LAB.raw.peripheralScore = sc;
    const eyeScores = ['cbScore','acuityScore','csScore','peripheralScore'].map(k=>LAB.raw[k]).filter(x=>x!=null);
    if (eyeScores.length) LAB.scores.eye = Math.round(LAB.avg(eyeScores));
    LAB.celebrate();
    LAB.say(`Peripheral vision done! You spotted ${hits} out of ${ROUNDS} dots — that is ${LAB.scoreLbl(sc)}! One more eye check!`);
    setTimeout(() => { LAB.idx++; LAB.next(); }, 1900);
  }
};

/* ═══════════════════════════════════════════════════════
   NEW MODULE — EYE TRACKING
   A dot moves slowly; user keeps finger on it; accuracy scored
═══════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════
   NEW MODULE — CALM TIMER
   60s relaxation: user taps when they feel calm; HRV-style
═══════════════════════════════════════════════════════ */

/* ── Cognitive Stamina: build performance timeline from raw scores ── */
LAB._buildCogTimeline = function() {
  const seq = [
    {key:'rxScore',          label:'Reaction'},
    {key:'memScore',         label:'Spatial Mem'},
    {key:'stroopScore',      label:'Stroop'},
      ];
  return seq.map(s => ({label: s.label, score: this.raw[s.key] ?? null}))
            .filter(s => s.score !== null);
};

LAB._buildStaminaCard = function() {
  const tl = this._buildCogTimeline();
  if(tl.length < 3) return '';
  const W=320, H=110, PAD=32, RPAD=16;
  const pts = tl.map((p,i) => {
    const x = PAD + (i / (tl.length-1||1)) * (W - PAD - RPAD);
    const y = H - 18 - (p.score / 100) * (H - 32);
    return {x:Math.round(x), y:Math.round(y), label:p.label, score:p.score};
  });
  const polyStr = pts.map(p => p.x+','+p.y).join(' ');
  const areaStr = 'M '+pts[0].x+' '+(H-10)+' L '+pts.map(p=>p.x+' '+p.y).join(' L ')+' L '+pts[pts.length-1].x+' '+(H-10)+' Z';
  const dotsHtml = pts.map(p =>
    '<circle cx="'+p.x+'" cy="'+p.y+'" r="5" fill="'+LAB.scoreCol(p.score)+'" stroke="#fff" stroke-width="2"><title>'+p.label+': '+p.score+'</title></circle>'
  ).join('');
  const lblHtml = pts.filter((_,i) => i===0 || i===pts.length-1 || pts.length<=6).map(p =>
    '<text x="'+p.x+'" y="'+(H+2)+'" text-anchor="middle" font-size="9" fill="#888">'+p.label.split(' ')[0]+'</text>'
  ).join('');
  const half = Math.floor(pts.length/2);
  const earlyAvg = Math.round(pts.slice(0,half).reduce((s,p)=>s+p.score,0)/half);
  const lateAvg  = Math.round(pts.slice(-half).reduce((s,p)=>s+p.score,0)/half);
  const drift = lateAvg - earlyAvg;
  const driftMsg = drift >= 5  ? '<span style="color:#1A8C52;font-weight:600">▲ Improving</span>'
                 : drift <= -8 ? '<span style="color:#C0392B;font-weight:600">▼ Fatigue detected</span>'
                 :               '<span style="color:#C97010;font-weight:600">→ Stable</span>';
  return '<div class="card" style="margin-bottom:2rem">'
    +'<h3 class="h3" style="margin-bottom:.35rem">🧠 Cognitive Stamina</h3>'
    +'<p class="pg" style="margin-bottom:.8rem;font-size:.8rem">Performance trend across brain tests — shows if your mind stayed sharp or fatigued.</p>'
    +'<div style="overflow-x:auto">'
    +'<svg viewBox="0 0 '+W+' '+(H+8)+'" width="100%" style="max-width:'+W+'px;display:block;margin:0 auto">'
    +'<defs><linearGradient id="stGrad" x1="0" y1="0" x2="0" y2="1">'
    +'<stop offset="0%" stop-color="#2A7A5A" stop-opacity=".18"/>'
    +'<stop offset="100%" stop-color="#2A7A5A" stop-opacity="0"/></linearGradient></defs>'
    +'<path d="'+areaStr+'" fill="url(#stGrad)"/>'
    +'<polyline points="'+polyStr+'" fill="none" stroke="#2A7A5A" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>'
    +dotsHtml+lblHtml
    +'</svg></div>'
    +'<div style="display:flex;justify-content:space-between;align-items:center;margin-top:.5rem;padding:.5rem .75rem;background:#F8FAF9;border-radius:10px;font-size:.78rem">'
    +'<span style="color:var(--tq)">Early avg: <strong>'+earlyAvg+'</strong></span>'
    +'<span>'+driftMsg+'</span>'
    +'<span style="color:var(--tq)">Late avg: <strong>'+lateAvg+'</strong></span>'
    +'</div></div>';
};

LAB.showDashboard = function () {

  const isCategoryMode = this.currentMode && this.currentMode !== 'full' && this.currentMode !== 'challenge';
  const activeCat = isCategoryMode ? this.categories[this.currentMode] : null;

  const domAvg = (...keys) => { const v=keys.map(k=>LAB.raw[k]).filter(x=>x!=null); return v.length?Math.round(LAB.avg(v)):null; };
  if (LAB.scores.cognitive  == null) LAB.scores.cognitive   = domAvg('rxScore','memScore','attScore','wordRecallScore','mathScore','dsScore','tmtScore');
  if (LAB.scores.eye        == null) LAB.scores.eye          = domAvg('cbScore','acuityScore','csScore','peripheralScore','eyeTrackScore');
  if (LAB.scores.respiratory== null) LAB.scores.respiratory = domAvg('breathSyncScore','breathScore');
  if (LAB.scores.stress     == null) LAB.scores.stress       = domAvg('mathScore','patternScore');
  if (LAB.scores.stability  == null) LAB.scores.stability    = domAvg('stabilityScore','tremorScore');
  if (LAB.scores.lifestyle  == null) LAB.scores.lifestyle    = LAB.raw.lifestyleScore ?? null;
  if (LAB.scores.heart      == null) LAB.scores.heart        = LAB.raw.heartScore    ?? null;
  if (LAB.scores.gut        == null) LAB.scores.gut          = LAB.raw.gutScore      ?? null;
  if (LAB.scores.hearing    == null) LAB.scores.hearing      = LAB.raw.hearingScore  ?? null;
  if (LAB.scores.energy     == null) LAB.scores.energy       = domAvg('handSpeedScore','energyScore');

  const recs = LAB._buildRecs();
  LAB._saveScoresForExercises();
  setTimeout(function(){ LAB._buildExerciseRecs(); }, 600);
  const isFem = LAB.gender==='female';
  const hormScore = isFem ? (LAB.scores.hormonal ?? null) : null;

  /* For category mode: compute score only for that domain */
  let overall, completedDomains;
  if (isCategoryMode && activeCat) {
    const catScore = LAB.scores[activeCat.scoreKey];
    overall = catScore;
    completedDomains = catScore != null ? 1 : 0;
  } else {
    /* Weighted overall score — weights are dynamically normalised to 1.0
       so adding or removing categories never inflates/deflates the result */
    const activeWeights = { ...CATEGORY_WEIGHTS };
    if (isFem && hormScore != null) activeWeights.hormonal = 0.10; /* inject female weight */

    const domainKeys = Object.keys(activeWeights);
    let rawWeightSum = 0, weightedTotal = 0, completedCount = 0;
    domainKeys.forEach(k => {
      const sc = k === 'hormonal' ? hormScore : LAB.scores[k];
      if (sc != null) {
        rawWeightSum  += activeWeights[k];
        weightedTotal += sc * activeWeights[k];
        completedCount++;
      }
    });
    /* Divide by rawWeightSum (sum of COMPLETED domains) — normalises to 0–100 */
    overall = rawWeightSum > 0 ? Math.round(weightedTotal / rawWeightSum) : null;
    completedDomains = completedCount;
  }

  const domains=[
    {key:'cognitive',  icon:'🧠', label:'Cognitive',   col:'#2A7A5A'},
    {key:'eye',        icon:'👁',  label:'Eye Health',  col:'#2563EB'},
    {key:'respiratory',icon:'🌬', label:'Respiratory', col:'#059669'},
    {key:'stress',     icon:'🔥', label:'Stress',      col:'#C97010'},
    {key:'stability',  icon:'📱', label:'Stability',   col:'#7C3AED'},
    {key:'lifestyle',  icon:'⚖',  label:'Lifestyle',   col:'#C0392B'},
    ...(isFem&&hormScore?[{key:'hormonal',icon:'🌸',label:'Hormonal',col:'#B83060'}]:[]),
    ...(LAB.scores.heart    != null ? [{key:'heart',   icon:'❤️', label:'Heart',   col:'#E74C3C'}] : []),
    ...(LAB.scores.gut      != null ? [{key:'gut',     icon:'🍽',  label:'Gut',     col:'#F39C12'}] : []),
    ...(LAB.scores.hearing  != null ? [{key:'hearing', icon:'👂',  label:'Hearing', col:'#8E44AD'}] : []),
    ...(LAB.scores.energy   != null ? [{key:'energy',  icon:'⚡',  label:'Energy',  col:'#8B5CF6'}] : []),
  ];

  /* In category mode: only show the relevant domain card(s) */
  const visibleDomains = isCategoryMode && activeCat
    ? domains.filter(d => d.key === activeCat.scoreKey)
    : domains;

  LAB.setStatus('idle','Results Ready');
  LAB.el('progBar').style.display='none';

  /* ── Lab Completion Celebration (full lab only) ── */
  const isFullComplete = !isCategoryMode && completedDomains >= 4 && overall !== null;
  if (isFullComplete) {
    /* Update streak */
    try {
      const today = new Date().toDateString();
      const streakRaw = localStorage.getItem('wl_streak');
      const streakData = streakRaw ? JSON.parse(streakRaw) : { count: 0, lastDate: null };
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (streakData.lastDate === today) {
        /* already recorded today — no change */
      } else if (streakData.lastDate === yesterday) {
        streakData.count = (streakData.count || 0) + 1;
        streakData.lastDate = today;
      } else {
        streakData.count = 1;
        streakData.lastDate = today;
      }
      localStorage.setItem('wl_streak', JSON.stringify(streakData));
    } catch(e) {}
    /* Fire confetti */
    setTimeout(() => {
      if (typeof LAB._fireConfetti === 'function') LAB._fireConfetti();
    }, 400);
  }

  /* Title / subtitle vary by mode */
  const titleBadge = isCategoryMode && activeCat
    ? `<span style="background:${activeCat.color}18;border-color:${activeCat.color}44;color:${activeCat.color}">${activeCat.icon} ${activeCat.name} Complete</span>`
    : `<span>✅ Assessment Complete</span>`;
  const subtitle = isCategoryMode && activeCat
    ? `${activeCat.tests.length} checks completed · ${activeCat.name} assessment<span style="display:inline-flex;align-items:center;gap:.28rem;margin-left:.6rem;padding:.18rem .55rem;background:#2A7A5A12;border:1px solid #2A7A5A28;border-radius:50px;font-size:.68rem;font-family:'JetBrains Mono',monospace;color:#2A7A5A;letter-spacing:.04em">✓ Results saved</span>`
    : (completedDomains > 0 ? 'Based on ' + (isFem?'35':'33') + ' wellness checks across 9 health domains: cognitive, eye, respiratory, stress, stability, lifestyle and more.' : 'You skipped all activities — no data to score. Complete at least one test to see results.');
  const scoreLabel = isCategoryMode && activeCat ? activeCat.name + ' Score' : 'Overall Wellness';

  /* ── Confidence: % of tests actually completed ── */
  const totalPossible = isFem ? 35 : 33; /* updated: 29 tests + 2 female-only */
  const completedTests = Object.values(LAB.scores).filter(x => x != null).length;
  const confidencePct  = Math.round((completedTests / totalPossible) * 100);
  const confidenceLbl  = confidencePct >= 80 ? 'High' : confidencePct >= 50 ? 'Medium' : 'Low';
  const confidenceCol  = confidencePct >= 80 ? '#2A7A5A' : confidencePct >= 50 ? '#C97010' : '#C0392B';

  LAB.render(`
  <div class="mwrap">

    <div style="text-align:center;padding:clamp(2rem,5vw,3.5rem) 0 1.5rem">
      <div style="display:inline-flex;align-items:center;gap:.45rem;padding:.32rem .9rem;
                  background:var(--g3);border:1px solid rgba(42,122,90,.28);border-radius:50px;
                  font-family:'JetBrains Mono',monospace;font-size:.65rem;color:var(--ok);
                  letter-spacing:.09em;text-transform:uppercase;margin-bottom:1.1rem">
        ${titleBadge}
      </div>
      <h2 class="h1" style="margin-bottom:.6rem">${isCategoryMode && activeCat ? activeCat.icon + ' ' + activeCat.name + ' Results' : 'Your Wellness Results'}</h2>
      <p class="pg" style="max-width:400px;margin:0 auto 1.5rem">${subtitle}</p>

      ${isFullComplete ? `
      <div style="background:linear-gradient(135deg,#EAF7EE,#F5FEF7);border:2px solid rgba(42,122,90,.25);
                  border-radius:var(--r);padding:1.5rem 1.8rem;margin-bottom:1.6rem;
                  animation:popIn .5s var(--ease) both;text-align:center">
        <div style="font-size:2.2rem;margin-bottom:.5rem">🎉</div>
        <div style="font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:700;color:var(--t);margin-bottom:.3rem">Wellness Lab Complete!</div>
        <p style="font-size:.84rem;color:var(--tm);line-height:1.6;margin:0 0 .8rem">You have completed all assessments today. Your results are ready below.</p>
        <div style="display:inline-flex;align-items:baseline;gap:.35rem;background:#fff;border:1.5px solid rgba(42,122,90,.2);border-radius:50px;padding:.45rem 1.2rem;margin-bottom:.7rem">
          <span style="font-size:.7rem;color:var(--tq)">Your Wellness Score</span>
          <span style="font-family:'Playfair Display',serif;font-size:1.4rem;font-weight:700;color:${LAB.scoreCol(overall)}">${overall} / 100</span>
          <span style="font-size:.8rem;font-weight:700;color:${LAB.scoreCol(overall)}">${LAB.scoreLbl(overall)}</span>
        </div>
        <p style="font-size:.78rem;color:var(--tq);margin:0">Check your recommended exercises below to improve further →</p>
      </div>` : ''}

      <div style="display:inline-flex;flex-direction:column;align-items:center;gap:.5rem;
                  background:#fff;border:1.5px solid var(--b);border-radius:var(--r);
                  padding:1.6rem 2.2rem;box-shadow:var(--shm);margin-bottom:1.8rem">
        <canvas id="overallRing" width="140" height="140"></canvas>
        <div style="font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:700;color:var(--t);line-height:1"
             id="overallNum">${overall !== null ? overall : '—'}</div>
        <div style="font-size:.65rem;font-family:'JetBrains Mono',monospace;text-transform:uppercase;
                    letter-spacing:.1em;color:var(--tq)">${scoreLabel}</div>
        <div style="font-size:.85rem;font-weight:700;color:${overall !== null ? LAB.scoreCol(overall) : 'var(--tq)'}">
          ${overall !== null ? LAB.scoreLbl(overall) : 'No tests completed'}</div>
        ${!isCategoryMode && overall !== null ? `
        <div style="margin-top:.25rem;padding:.28rem .75rem;background:${confidenceCol}12;border:1px solid ${confidenceCol}33;
                    border-radius:50px;font-size:.62rem;font-family:'JetBrains Mono',monospace;
                    color:${confidenceCol};letter-spacing:.06em">
          Confidence: <strong>${confidenceLbl}</strong> · ${completedTests}/${totalPossible} tests
        </div>` : ''}
      </div>

      ${!isCategoryMode && overall !== null ? (() => {
        const userAge = LAB.raw.userAge || null;
        const wa = LAB.calcWellnessAge(overall, userAge);
        const prevScore = LAB.raw.prevScore || null;
        const scoreDelta = (prevScore !== null && overall !== null) ? overall - prevScore : null;

        /* ── Wellness Score Summary card ── */
        const summaryDomains = [
          {key:'cognitive',  icon:'🧠', label:'Brain Speed'},
          {key:'eye',        icon:'👁',  label:'Eye Health'},
          {key:'respiratory',icon:'🌬', label:'Breathing'},
          {key:'stress',     icon:'🔥', label:'Stress Control'},
          {key:'stability',  icon:'📱', label:'Stability'},
          {key:'lifestyle',  icon:'⚖',  label:'Lifestyle'},
          {key:'energy',     icon:'⚡', label:'Energy'},
          {key:'heart',      icon:'❤️', label:'Heart'},
          {key:'gut',        icon:'🍽',  label:'Gut Health'},
          {key:'hearing',    icon:'👂', label:'Hearing'},
        ].filter(d => LAB.scores[d.key] != null);

        const summaryCard = summaryDomains.length >= 2 ? `
        <div style="background:#fff;border:1.5px solid var(--b);border-radius:var(--r);padding:1.4rem 1.5rem;margin-bottom:1.4rem;text-align:left">
          <div style="font-size:.6rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--tq);margin-bottom:1rem;text-align:center">📊 Your Wellness Score Summary</div>
          <div style="display:flex;flex-direction:column;gap:.5rem">
            ${summaryDomains.map(d => {
              const sc = LAB.scores[d.key];
              const col = LAB.scoreCol(sc);
              const lbl = LAB.scoreLbl(sc);
              const pct = sc + '%';
              return `<div style="display:flex;align-items:center;gap:.75rem">
                <span style="font-size:1rem;width:1.4rem;flex-shrink:0">${d.icon}</span>
                <span style="font-size:.8rem;font-weight:600;color:var(--t);min-width:100px;flex-shrink:0">${d.label}</span>
                <div style="flex:1;height:7px;background:var(--g3);border-radius:4px;overflow:hidden">
                  <div style="height:100%;width:${pct};background:${col};border-radius:4px;transition:width .8s ease"></div>
                </div>
                <span style="font-family:'JetBrains Mono',monospace;font-size:.75rem;font-weight:700;color:${col};min-width:28px;text-align:right">${sc}</span>
                <span style="font-size:.68rem;color:${col};font-weight:600;min-width:55px">${lbl}</span>
              </div>`;
            }).join('')}
          </div>
          <div style="margin-top:1rem;padding:.75rem 1rem;background:linear-gradient(135deg,var(--g4),#F9FEF9);border-radius:var(--rs);text-align:center">
            <span style="font-size:.72rem;color:var(--tq)">Overall Wellness Score — </span>
            <span style="font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:700;color:${LAB.scoreCol(overall)}">${overall} / 100</span>
            <span style="font-size:.75rem;font-weight:700;color:${LAB.scoreCol(overall)};margin-left:.4rem">${LAB.scoreLbl(overall)}</span>
          </div>
        </div>` : '';

        return `
        ${summaryCard}
        <div style="display:flex;flex-wrap:wrap;gap:.9rem;justify-content:center;margin-bottom:1.4rem">
          <div style="background:linear-gradient(135deg,#E8F5EE,#F0FBF5);border:1.5px solid rgba(42,122,90,.28);border-radius:var(--r);padding:1rem 1.4rem;text-align:center;min-width:130px">
            <div style="font-size:.62rem;font-family:'JetBrains Mono',monospace;text-transform:uppercase;letter-spacing:.1em;color:var(--tq);margin-bottom:.3rem">🧬 Wellness Age</div>
            ${wa && wa.wellness ? `
              <div style="font-family:'Playfair Display',serif;font-size:2rem;font-weight:700;color:var(--g);line-height:1">${wa.wellness}</div>
              <div style="font-size:.68rem;color:var(--tq);margin-top:.2rem">Your age: ${wa.actual}</div>
              <div style="font-size:.72rem;font-weight:700;color:${wa.delta <= 0 ? '#2A7A5A' : '#C97010'};margin-top:.15rem">${wa.icon} ${wa.label}</div>
            ` : `
              <div style="font-size:.85rem;font-weight:700;color:var(--g);margin:.25rem 0">${wa ? wa.icon + ' ' + wa.label : '—'}</div>
              <div style="font-size:.68rem;color:var(--tq);margin-top:.15rem">Enter age for exact score</div>
            `}
          </div>
          ${LAB.raw.circadianType ? `<div style="background:#fff;border:1.5px solid var(--b);border-radius:var(--r);padding:1rem 1.4rem;text-align:center;min-width:130px">
            <div style="font-size:.62rem;font-family:'JetBrains Mono',monospace;text-transform:uppercase;letter-spacing:.1em;color:var(--tq);margin-bottom:.3rem">🕐 Circadian Type</div>
            <div style="font-size:1.6rem;line-height:1">${LAB.raw.circadianIcon || '☀️'}</div>
            <div style="font-size:.82rem;font-weight:700;color:var(--t);margin-top:.3rem">${LAB.raw.circadianType}</div>
          </div>` : ''}
          ${scoreDelta !== null ? `<div style="background:#fff;border:1.5px solid var(--b);border-radius:var(--r);padding:1rem 1.4rem;text-align:center;min-width:130px">
            <div style="font-size:.62rem;font-family:'JetBrains Mono',monospace;text-transform:uppercase;letter-spacing:.1em;color:var(--tq);margin-bottom:.3rem">📈 vs Last Session</div>
            <div style="font-family:'Playfair Display',serif;font-size:2rem;font-weight:700;color:${scoreDelta>=0?'#2A7A5A':'#C05050'};line-height:1">${scoreDelta>=0?'+':''}${scoreDelta}</div>
            <div style="font-size:.68rem;color:var(--tq);margin-top:.2rem">prev: ${prevScore} → now: ${overall}</div>
          </div>` : ''}
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:.6rem;justify-content:center;margin-bottom:1.2rem">
          <button onclick="LAB._shareResult(${overall})"
            style="display:inline-flex;align-items:center;gap:.45rem;padding:.6rem 1.2rem;
                   background:linear-gradient(135deg,#25D366,#1DA851);color:#fff;border:none;
                   border-radius:50px;font-weight:700;font-size:.82rem;cursor:pointer;
                   box-shadow:0 4px 14px rgba(37,211,102,.35);transition:all .22s"
            onmouseenter="this.style.transform='translateY(-2px)'" onmouseleave="this.style.transform=''">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Share My Score
          </button>
          <button onclick="LAB._showPersonalBest()"
            style="display:inline-flex;align-items:center;gap:.45rem;padding:.6rem 1.2rem;
                   background:#fff;color:var(--g);border:2px solid rgba(42,122,90,.3);
                   border-radius:50px;font-weight:700;font-size:.82rem;cursor:pointer;transition:all .22s"
            onmouseenter="this.style.background='var(--g3)'" onmouseleave="this.style.background='#fff'">
            🏆 Personal Best
          </button>
        </div>`;
      })() : ''}

      ${isCategoryMode && activeCat ? `
      <div style="display:flex;flex-wrap:wrap;gap:.6rem;justify-content:center;margin-bottom:1.4rem">
        <button class="btn btn--p" style="font-size:.82rem;min-width:160px" onclick="LAB._showAddMoreTests()">
          ➕ Add More Labs
        </button>
        <button class="btn btn--o" style="font-size:.82rem" onclick="LAB.renderCategoryDashboard()">
          ← All Labs
        </button>
        <button class="btn btn--g" style="font-size:.82rem" onclick="LAB.beginModules()">
          ▶ Full Lab
        </button>
      </div>

      <!-- ── POST-LAB INSIGHT ──────────────────────────────── -->
      ${(function() {
        const insights = {
          brain: {
            good: 'Your brain performance is healthy! Regular focus exercises and breathing practices can improve it further.',
            fair: 'Your scores are in the average range. Short daily memory exercises and quality sleep can make a real difference.',
            low:  'Focus and reaction can be trained. Start with daily breathing exercises and short brain games.'
          },
          eye: {
            good: 'Your eyes are performing well. Continue the 20-20-20 rule to maintain good eye health.',
            fair: 'Consider taking more screen breaks and using good lighting. Your eyes may benefit from a clinical check.',
            low:  'Eye health indicators suggest some areas to address. Please consider a professional eye examination.'
          },
          breathing: {
            good: 'Excellent breath control — your nervous system is well regulated. Keep up the practice.',
            fair: 'Your breathing balance is moderate. Daily 5-minute slow breathing exercises can help significantly.',
            low:  'Breath control could be improved. Start with simple inhale-hold-exhale cycles each morning.'
          },
          stress: {
            good: 'Your stress regulation looks healthy. Maintain your calm practices daily.',
            fair: 'Some stress indicators are present. Short meditation and limiting caffeine can help your body recover better.',
            low:  'Stress levels appear elevated. Daily breathing practices and adequate sleep are the most effective starting points.'
          },
          stability: {
            good: 'Your motor stability is excellent. Continue balance exercises to maintain coordination.',
            fair: 'Stability is in the average range. Simple balance poses and grip exercises can help.',
            low:  'Stability exercises like single-leg stands and slow movements can improve coordination over time.'
          },
          lifestyle: {
            good: 'Your lifestyle patterns look healthy. Consistent habits are your greatest wellness asset.',
            fair: 'Some lifestyle areas need attention. A regular sleep schedule can improve many other scores.',
            low:  'Lifestyle factors are impacting your overall wellness. Focus on consistent sleep and hydration first.'
          },
          heart: {
            good: 'Cardiovascular indicators look good. Keep moving regularly and manage stress.',
            fair: 'Heart rate patterns are moderate. Regular gentle exercise and stress reduction can help.',
            low:  'Consider consulting a healthcare provider and focusing on stress reduction and light aerobic exercise.'
          },
          gut: {
            good: 'Digestive health indicators are positive. Your gut microbiome benefits from your current habits.',
            fair: 'Some digestive patterns need attention. Warm water, probiotics and a regular meal schedule can help.',
            low:  'Digestive health needs focus. Consult a healthcare provider and consider dietary improvements.'
          },
          hearing: {
            good: 'Your hearing appears healthy. Protect it by limiting loud noise exposure.',
            fair: 'Some high-frequency detection was reduced. Consider limiting headphone volume and protecting your ears.',
            low:  'Hearing indicators suggest a professional audiological check may be beneficial.'
          },
          energy: {
            good: 'Your energy and motor alertness are strong! Stay active, sleep well, and keep your hydration up.',
            fair: 'Your energy is moderate. Short walks, proper hydration and consistent sleep can make a real difference.',
            low:  'Energy levels appear low today. Focus on sleep quality, hydration, and gentle movement first.'
          }
        };
        const exercises = {
          brain: ['🕯 Candle Focus Exercise', '🃏 Memory Match Game', '🧘 Morning Mindfulness'],
          eye:   ['👁 Eye Roll Exercise', '🌿 Palming Rest', '🎯 Focus Point Practice'],
          breathing: ['🌬 Box Breathing', '🕉 Humming Breath (Bhramari)', '🌙 4-7-8 Relaxation'],
          stress:    ['🧘 Body Scan Meditation', '🌬 Extended Exhale Breathing', '🚶 Mindful Walking'],
          stability: ['🦵 Single-Leg Stand', '✋ Grip Strength Exercise', '🧘 Tree Pose Balance'],
          lifestyle: ['🌅 Morning Sunlight Walk', '📵 Digital Sunset Routine', '💧 Hydration Tracker'],
          heart: ['🚶 Gentle Daily Walk', '🧘 Stress Reduction Practice', '🌬 Slow Breathing'],
          gut:   ['🌿 Warm Water with Ginger', '🥗 Probiotic Foods', '🧘 Abdominal Massage'],
          hearing:['🎧 Volume Awareness', '🌿 Ear Oil Practice', '🔕 Quiet Time Daily'],
          energy: ['⚡ Finger Tap Exercise', '🚶 10-Minute Energising Walk', '🌬 Energising Breath (Kapalabhati)'],
        };
        const herbs = {
          brain:     { product: 'Brain Champ',   id:'brainchamp',   herbs: ['Brahmi (Bacopa monnieri)', 'Shankhpushpi', 'Ashwagandha', 'Jatamansi', 'Vacha'],      dosage: '10–15 ml twice daily with warm milk after meals' },
          stress:    { product: 'Brain Champ',   id:'brainchamp',   herbs: ['Brahmi (Bacopa monnieri)', 'Ashwagandha', 'Shankhpushpi', 'Jatamansi'],               dosage: '10–15 ml twice daily with warm milk after meals' },
          breathing: { product: 'Cough X Pro',   id:'coughxpro',    herbs: ['Tulsi (Holy Basil)', 'Mulethi (Licorice)', 'Adrak (Ginger)', 'Pippali', 'Vasa'],      dosage: '10 ml three times daily' },
          eye:       { product: 'Musaffa Khoon', id:'musaffakhoon', herbs: ['Neem', 'Manjistha', 'Khadir', 'Giloy', 'Triphala', 'Sarsaparilla'],                   dosage: '10–15 ml twice daily with water before meals' },
          heart:     { product: 'Blood Storm',   id:'bloodstorm',   herbs: ['Loha Bhasma', 'Punarnava', 'Shatavari', 'Ashwagandha', 'Amla', 'Draksha'],            dosage: '10–15 ml twice daily with water after meals' },
          lifestyle: { product: 'Livo Hayaat',   id:'livohayaat',   herbs: ['Bhumi Amla', 'Kalmegh', 'Kutki', 'Punarnava', 'Makoy', 'Kasni'],                      dosage: '2 tablets twice daily with warm water before meals' },
          stability: { product: 'Ortho Hayaat',  id:'orthohayaat',  herbs: ['Shallaki (Boswellia)', 'Guggul', 'Rasna', 'Nirgundi', 'Ashwagandha', 'Sunthi'],       dosage: '2 tablets twice daily with warm milk after meals' },
          gut:       { product: 'Shah Zyme',     id:'shahzyme',     herbs: ['Ajwain', 'Saunf (Fennel)', 'Jeera (Cumin)', 'Pudina (Mint)', 'Harad', 'Amla'],        dosage: '10–15 ml after meals, twice daily' },
          hearing:   { product: 'Brain Champ',   id:'brainchamp',   herbs: ['Brahmi (Bacopa monnieri)', 'Shankhpushpi', 'Ashwagandha', 'Jatamansi'],               dosage: '10–15 ml twice daily with warm milk after meals' },
          energy:    { product: 'Blood Storm',   id:'bloodstorm',   herbs: ['Loha Bhasma', 'Shatavari', 'Ashwagandha', 'Punarnava', 'Amla', 'Draksha'],            dosage: '10–15 ml twice daily with water after meals' },
          female:    { product: 'Utro Hayaat',   id:'utrohayaat',   herbs: ['Ashoka', 'Lodhra', 'Shatavari', 'Nagkesar', 'Daruharidra', 'Kumari (Aloe)'],          dosage: '10–15 ml twice daily after meals with milk or water' },
        };
        const catId = activeCat?.id || '';
        const P = LAB.SH_PRODUCTS;
        const ins = insights[catId] || insights.brain;
        const exs = exercises[catId] || exercises.brain;
        const herb = herbs[catId] || herbs.brain;
        const level = overall >= 70 ? 'good' : overall >= 45 ? 'fair' : 'low';
        const insightText = ins[level];
        return `
        <!-- Insight Card -->
        <div style="background:linear-gradient(135deg,var(--g4),#F9FEF9);border:1.5px solid rgba(42,122,90,.18);border-radius:var(--r);padding:1.3rem 1.5rem;margin-bottom:1rem">
          <div style="font-size:.6rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--g);margin-bottom:.5rem">💡 Your Insight</div>
          <p style="font-size:.9rem;color:var(--t);line-height:1.65;margin:0">${insightText}</p>
        </div>

        <!-- Recommended Exercises -->
        <div style="background:#fff;border:1.5px solid var(--b);border-radius:var(--r);padding:1.3rem 1.5rem;margin-bottom:1rem">
          <div style="font-size:.6rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--tq);margin-bottom:.75rem">🏃 Recommended Exercises</div>
          <div style="display:flex;flex-direction:column;gap:.45rem">
            ${exs.map(e => `<div style="display:flex;align-items:center;gap:.6rem;font-size:.85rem;color:var(--t);padding:.45rem .7rem;background:var(--bg);border-radius:var(--rs)">${e}</div>`).join('')}
          </div>
          <a href="exercises.html" style="display:inline-flex;align-items:center;gap:.3rem;margin-top:.8rem;font-size:.78rem;font-weight:600;color:var(--g);text-decoration:none">
            View all exercises on Exercise Page →
          </a>
        </div>

        <!-- Optional Herbal Support -->
        <div style="background:linear-gradient(135deg,#FFFBF0,#fff);border:1.5px solid rgba(201,120,0,.18);border-radius:var(--r);padding:1.3rem 1.5rem;margin-bottom:1rem">
          <div style="font-size:.6rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--gd);margin-bottom:.5rem">🌿 Optional Herbal Support</div>
          <div style="font-size:.78rem;color:var(--tq);margin-bottom:.65rem">Informational only — not a treatment. Always consult a healthcare professional before use.</div>
          <div style="font-weight:700;font-size:.98rem;color:var(--t);margin-bottom:.1rem">${herb.product}</div>
          <div style="font-size:.7rem;color:var(--tq);margin-bottom:.5rem;font-style:italic">${P[herb.id]?.desc || ''}</div>
          <div style="font-size:.68rem;font-weight:700;color:var(--tq);text-transform:uppercase;letter-spacing:.08em;margin-bottom:.3rem">Key Herbs</div>
          <div style="display:flex;flex-wrap:wrap;gap:.3rem;margin-bottom:.65rem">
            ${herb.herbs.map(h => `<span style="background:var(--gd3);border:1px solid rgba(201,120,0,.2);border-radius:50px;padding:.2rem .65rem;font-size:.7rem;color:var(--gd);font-weight:600">${h}</span>`).join('')}
          </div>
          ${herb.dosage ? `<div style="font-size:.72rem;color:var(--tm);background:var(--bg);border-radius:var(--rs);padding:.4rem .7rem;margin-bottom:.6rem">📋 <strong>Suggested Use:</strong> ${herb.dosage}</div>` : ''}
          <a href="${shProductUrl(herb.id)}" style="display:inline-flex;align-items:center;gap:.3rem;font-size:.78rem;font-weight:600;color:var(--gd);text-decoration:none;border:1px solid rgba(201,120,0,.3);padding:.3rem .8rem;border-radius:50px;background:var(--gd3)">
            View Full Product Details →
          </a>
        </div>

        <!-- Recommended Next Step -->
        <div style="background:linear-gradient(135deg,#EBF5F0,#fff);border:1.5px solid rgba(42,122,90,.2);border-radius:var(--r);padding:1.1rem 1.5rem;margin-bottom:1rem;display:flex;align-items:center;gap:1rem;flex-wrap:wrap">
          <div style="font-size:1.6rem;flex-shrink:0">👉</div>
          <div style="flex:1;min-width:160px">
            <div style="font-size:.6rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--g);margin-bottom:.2rem">Recommended Next Step</div>
            <div style="font-size:.85rem;color:var(--t);line-height:1.5">${exs[0]} — <a href="exercises.html" style="color:var(--g);font-weight:600;text-decoration:none">open in Exercise Library →</a></div>
          </div>
        </div>`;
      })()}` : ''}
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:.9rem;margin-bottom:2.5rem" id="scoreGrid">
      ${visibleDomains.map(d=>{
        const sc = LAB.scores[d.key] ?? null;
        const skipped = sc === null;
        return `<div style="background:${skipped?'var(--bg)':'#fff'};border:1.5px solid var(--b);border-radius:var(--r);
                            padding:1.4rem 1rem;text-align:center;box-shadow:var(--sh);
                            transition:all .26s;cursor:default;position:relative;overflow:hidden;
                            opacity:${skipped?'0.55':'1'}"
                     onmouseenter="this.style.transform='translateY(-4px)';this.style.boxShadow='var(--shm)'"
                     onmouseleave="this.style.transform='none';this.style.boxShadow='var(--sh)'">
          <div style="position:absolute;top:0;left:0;right:0;height:3px;background:${skipped?'var(--b)':d.col};border-radius:3px 3px 0 0"></div>
          <canvas id="ring_${d.key}" width="80" height="80" style="display:block;margin:0 auto .7rem"></canvas>
          <div style="font-size:.6rem;font-family:'JetBrains Mono',monospace;font-weight:700;
                      text-transform:uppercase;letter-spacing:.1em;color:var(--tq);margin-bottom:.22rem">${d.icon} ${d.label}</div>
          <div style="font-family:'Playfair Display',serif;font-size:1.55rem;font-weight:700;
                      line-height:1;color:${skipped?'var(--tq)':d.col}">${skipped ? '—' : sc}</div>
          <div style="font-size:.68rem;color:${skipped?'var(--tq)':LAB.scoreCol(sc)};font-weight:600;margin-top:.18rem">
            ${skipped ? 'Skipped' : LAB.scoreLbl(sc)}</div>
        </div>`;
      }).join('')}
    </div>

    ${!isCategoryMode && visibleDomains.filter(d=>LAB.scores[d.key]!=null).length >= 3 ? `
    <div class="card" style="margin-bottom:2rem">
      <h3 class="h3" style="margin-bottom:.5rem">🕸 Health Domain Radar</h3>
      <p class="pg" style="font-size:.78rem;margin-bottom:1rem;color:var(--tq)">Visual overview of your wellness profile across all measured domains.</p>
      <div style="position:relative;width:100%;max-width:340px;margin:0 auto;padding-top:1rem">
        <canvas id="radarChart" width="340" height="300" style="width:100%;height:auto"></canvas>
      </div>
    </div>` : ''}

    ${LAB._buildStaminaCard()}

    <div class="card" style="margin-bottom:2rem">
      <h3 class="h3" style="margin-bottom:1.1rem">📊 Activity Breakdown</h3>
      <div style="display:grid;gap:.5rem">
        ${LAB._buildBreakdownRows()}
      </div>
    </div>

    ${LAB._buildFlagBox()}

    <div style="margin-bottom:2rem">
      <h3 class="h3" style="margin-bottom:.4rem">💡 Personalised Recommendations</h3>
      <p class="pg" style="margin-bottom:1.2rem">Based on your scores — things worth paying attention to.</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:.9rem">
        ${recs.map(r=>`
          <div style="background:#fff;border:1.5px solid var(--b);border-radius:var(--r);
                      overflow:hidden;transition:all .24s"
               onmouseenter="this.style.borderColor='${r.col}';this.style.transform='translateY(-3px)';this.style.boxShadow='var(--shm)'"
               onmouseleave="this.style.borderColor='var(--b)';this.style.transform='none';this.style.boxShadow='none'">
            <div style="height:5px;background:${r.col}"></div>
            <div style="padding:.9rem">
              <div style="font-size:1.5rem;margin-bottom:.4rem">${r.icon}</div>
              <div style="font-weight:700;color:var(--t);font-size:.88rem;margin-bottom:.3rem">${r.title}</div>
              <div style="font-size:.75rem;color:var(--tq);line-height:1.6;margin-bottom:.65rem">${r.body}</div>
              <div style="font-size:.72rem;font-weight:600;color:${r.col};background:${r.col}18;
                          padding:.3rem .65rem;border-radius:50px;display:inline-block">${r.action}</div>
            </div>
          </div>`).join('')}
      </div>
    </div>

    <div class="card" style="margin-bottom:2rem">
      <h3 class="h3" style="margin-bottom:1rem">🌿 General Wellness Tips</h3>
      ${LAB._buildTips(overall)}
    </div>

    <div style="background:var(--g4);border:1px solid rgba(42,122,90,.16);border-radius:var(--rs);
                padding:1rem 1.2rem;font-size:.73rem;color:var(--tq);line-height:1.78;margin-bottom:2rem">
      <strong style="color:var(--g)">Important:</strong> These results are wellness indicators only — they are <strong>not</strong> a medical diagnosis.
      The activities measure performance proxies, not clinical outcomes. If any score concerns you, please speak to a qualified healthcare professional.
      No data has been sent anywhere — everything was calculated on your device.
    </div>

    <div style="margin-bottom:2rem">
      <div style="display:inline-flex;align-items:center;gap:.5rem;padding:.28rem .85rem;
                  background:linear-gradient(90deg,rgba(42,122,90,.12),rgba(201,120,0,.1));
                  border:1px solid rgba(42,122,90,.22);border-radius:50px;
                  font-size:.6rem;font-weight:700;color:var(--g);
                  letter-spacing:.1em;text-transform:uppercase;margin-bottom:.9rem">
        🌿 Shah Hayaat Certified Ayurvedic Products
      </div>
      <h3 class="h3" style="margin-bottom:.35rem">Products Matched to Your Results</h3>
      <p class="pg" style="margin-bottom:1.3rem;font-size:.82rem">
        These products from the Shah Hayaat range are selected based on your specific scores.
        <div style="margin-top:.6rem;padding:.7rem 1rem;background:#FFF8ED;border:1px solid rgba(201,120,0,.25);border-radius:var(--rs);font-size:.72rem;color:#92400E;line-height:1.6">
          ⚠️ <strong>Disclaimer:</strong> These are Ayurvedic supplements. They are not intended to diagnose, treat, cure or prevent any disease. Results may vary. Always consult a qualified healthcare professional before use. Presented for informational purposes only.
        </div>
        WHO-GMP · ISO 9001:2015 · HACCP Certified.
        Tap <strong style="color:#25D366">Order on WhatsApp</strong> to place an order instantly.
      </p>

      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:.85rem" id="shProductGrid">
        ${LAB._buildProductCards()}
      </div>
      <div style="text-align:center;margin-top:1.2rem">
        <a href="https://yasirhashmi02-dev.github.io/Shahhayaat02/products.html"
           target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:.4rem;
           color:var(--g);font-weight:600;font-size:.8rem;text-decoration:none;
           padding:.45rem 1.1rem;border:1.5px solid rgba(42,122,90,.3);border-radius:50px;
           transition:.22s" onmouseenter="this.style.background='var(--g3)'" onmouseleave="this.style.background='transparent'">
          🌿 View all 12 Shah Hayaat products →
        </a>
      </div>
    </div>

    <div style="background:linear-gradient(135deg,#F0FBF5,#E8F5EE);border:1.5px solid rgba(42,122,90,.25);
                border-radius:var(--r);padding:1.4rem 1.6rem;margin-bottom:2rem;
                box-shadow:0 4px 18px rgba(42,122,90,.1)">
      <div style="display:flex;flex-wrap:wrap;align-items:flex-start;gap:1.1rem">
        <div style="font-size:2.4rem;flex-shrink:0;line-height:1">🩺</div>
        <div style="flex:1;min-width:180px">
          <div style="font-weight:700;color:var(--t);font-size:1rem;margin-bottom:.25rem">
            Talk to a Shah Hayaat Expert
          </div>
          <p style="font-size:.8rem;color:var(--tm);line-height:1.65;margin-bottom:.9rem">
            Get your PDF report reviewed by a Shah Hayaat wellness consultant.
            They will guide you on the right products and next steps for your health.
            <strong style="color:var(--g)">Free 15-minute consultation.</strong>
          </p>
          <div style="display:flex;flex-wrap:wrap;gap:.6rem">
            <button onclick="LAB.sharePDFWhatsApp()"
                    style="display:inline-flex;align-items:center;gap:.5rem;
                           background:#25D366;color:#fff;border:none;
                           padding:.7rem 1.3rem;border-radius:50px;font-weight:700;
                           font-size:.9rem;cursor:pointer;box-shadow:0 4px 14px rgba(37,211,102,.35);
                           transition:all .22s;-webkit-tap-highlight-color:transparent"
                    onmouseenter="this.style.transform='translateY(-2px)';this.style.boxShadow='0 8px 22px rgba(37,211,102,.45)'"
                    onmouseleave="this.style.transform='none';this.style.boxShadow='0 4px 14px rgba(37,211,102,.35)'">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Send PDF Report on WhatsApp
            </button>
            <a href="tel:+917051056287"
               style="display:inline-flex;align-items:center;gap:.45rem;
                      background:#fff;color:var(--g);border:2px solid rgba(42,122,90,.3);
                      padding:.65rem 1.2rem;border-radius:50px;font-weight:700;
                      font-size:.85rem;text-decoration:none;
                      transition:all .22s;box-shadow:0 2px 8px rgba(42,122,90,.1)"
               onmouseenter="this.style.borderColor='var(--g)';this.style.background='var(--g3)'"
               onmouseleave="this.style.borderColor='rgba(42,122,90,.3)';this.style.background='#fff'">
              📞 Call Expert
            </a>
          </div>
          <p style="font-size:.72rem;color:var(--tq);margin-top:.55rem;line-height:1.55">
            📎 <strong style="color:var(--tm)">PDF will download automatically.</strong> Please attach it in your WhatsApp chat.
          </p>
        </div>
      </div>
    </div>


    
    <!-- ═══ EXERCISES INTEGRATION BLOCK ═══ -->
    <div id="exercisesBlock" style="background:linear-gradient(135deg,rgba(99,102,241,.12),rgba(212,160,23,.08));border:1.5px solid rgba(99,102,241,.3);border-radius:14px;padding:1.4rem 1.6rem;margin-bottom:1.6rem">
      <div style="display:flex;align-items:flex-start;gap:1rem;flex-wrap:wrap">
        <div style="font-size:2.2rem;flex-shrink:0;line-height:1">🤸</div>
        <div style="flex:1;min-width:180px">
          <div style="font-weight:700;color:var(--t);font-size:1rem;margin-bottom:.3rem">
            Personalised Wellness Exercises for You
          </div>
          <p style="font-size:.82rem;color:var(--tm);line-height:1.65;margin-bottom:.9rem">
            Based on your test results, specific exercises have been selected to address your weak areas.
            Each exercise is guided by a live timer and voice instructions — takes just 2–6 minutes.
          </p>
          <div id="exRecsBlock" style="display:flex;flex-wrap:wrap;gap:.5rem;margin-bottom:.9rem"></div>
          <a href="exercises.html" id="goExercisesBtn"
             onclick="LAB._saveScoresForExercises()"
             style="display:inline-flex;align-items:center;gap:.5rem;padding:.7rem 1.4rem;
                    background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;
                    border-radius:50px;font-size:.86rem;font-weight:700;text-decoration:none;
                    box-shadow:0 4px 16px rgba(99,102,241,.35);transition:all .25s"
             onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 8px 24px rgba(99,102,241,.5)'"
             onmouseout="this.style.transform='none';this.style.boxShadow='0 4px 16px rgba(99,102,241,.35)'">
            🤸 Open My Personalised Exercises →
          </a>
        </div>
      </div>
    </div>
    <!-- ═══ END EXERCISES BLOCK ═══ -->

    <div class="community-banner" style="margin-bottom:1.4rem">
      <div>
        <div class="cb-title">🎉 Assessment Complete — Join Our Community!</div>
        <div class="cb-msg">Share your wellness journey &amp; get daily health tips from Shah Hayaat</div>
        <div class="cb-sub">Connect with thousands of people on their wellness journey</div>
      </div>
      <div class="cb-links">
        <a class="cb-btn cb-btn-wa" href="https://whatsapp.com/channel/0029VadgJDiJUM2VitsAVR1u" target="_blank" rel="noopener noreferrer">
          💬 Join WhatsApp Channel
        </a>
        <a class="cb-btn cb-btn-ig" href="https://www.instagram.com/shahhayaatofficial?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener">
          📸 Follow on Instagram
        </a>
      </div>
    </div>

    <div class="card" style="margin-bottom:1.4rem;padding:1.25rem 1.4rem">
      <h3 class="h3" style="margin-bottom:.5rem;font-size:.95rem">📄 Download Your PDF Report</h3>
      <p class="pg" style="margin-bottom:.85rem;font-size:.82rem">Add your name to appear on the report — or leave it blank.</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin-bottom:.85rem">
        <div class="fld">
          <label class="lbl" for="pdfNameInp">Your name (optional)</label>
          <input class="inp" type="text" id="pdfNameInp" placeholder="e.g. Ahmed Khan"
                 maxlength="60" autocomplete="name" style="font-size:1rem">
        </div>
        <div class="fld">
          <label class="lbl" for="pdfAgeInp">Your age (optional)</label>
          <input class="inp" type="number" id="pdfAgeInp" placeholder="e.g. 34" min="16" max="90"
                 style="font-size:1rem" onchange="LAB.raw.userAge=parseInt(this.value)||null">
        </div>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:.75rem">
        <button class="btn btn--p btn--lg" onclick="LAB.generatePDF()">📄 Save as PDF</button>
        <button class="btn btn--g" onclick="LAB.goWelcome()">↺ New Assessment</button>
        <a href="index.html" class="btn btn--g">← Shah Hayaat Home</a>
      </div>
    </div>

    ${overall !== null ? `
    <!-- ── Shareable Wellness Card ─────────────────────────── -->
    <div class="card" style="margin-bottom:1.4rem;padding:1.25rem 1.4rem">
      <h3 class="h3" style="margin-bottom:.3rem;font-size:.95rem">📤 Share Your Score</h3>
      <p class="pg" style="margin-bottom:1rem;font-size:.82rem">Share your wellness card — or challenge a friend to beat your score!</p>

      <!-- Preview card (the shareable visual) -->
      <div id="_shareCard" style="background:linear-gradient(135deg,#0A1F14 0%,#162E1E 100%);
           border-radius:14px;padding:1.4rem;margin-bottom:1rem;color:#fff;position:relative;overflow:hidden">
        <!-- subtle bg ring -->
        <div style="position:absolute;top:-40px;right:-40px;width:160px;height:160px;border-radius:50%;
                    background:rgba(56,180,140,.08);pointer-events:none"></div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:.58rem;color:#38B48C;
                    text-transform:uppercase;letter-spacing:.12em;margin-bottom:.6rem">
          Shah Hayaat · Wellness Lab
        </div>
        <div style="display:flex;align-items:flex-end;gap:.6rem;margin-bottom:.9rem">
          <div style="font-family:'Playfair Display',serif;font-size:3.2rem;font-weight:700;
                      color:#4EEDB8;line-height:1">${overall}</div>
          <div style="margin-bottom:.35rem">
            <div style="font-size:.72rem;color:rgba(214,234,228,.6)">/ 100</div>
            <div style="font-size:.82rem;font-weight:700;color:#4EEDB8">${LAB.scoreLbl(overall)}</div>
          </div>
        </div>
        <!-- Score breakdown pills -->
        <div style="display:flex;flex-wrap:wrap;gap:.35rem;margin-bottom:.8rem">
          ${Object.entries(LAB.scores).filter(([k,v]) => v !== null && !['hormonal'].includes(k))
            .slice(0,6)
            .map(([k,v]) => {
              const icons={cognitive:'🧠',eye:'👁',respiratory:'🌬',stress:'🔥',
                           stability:'📱',lifestyle:'⚖',heart:'❤️',gut:'🍽',hearing:'👂'};
              return `<div style="padding:.2rem .55rem;background:rgba(56,180,140,.14);
                                  border:1px solid rgba(56,180,140,.25);border-radius:50px;
                                  font-size:.62rem;font-family:'JetBrains Mono',monospace;
                                  color:${v>=80?'#4EEDB8':v>=55?'#F0B929':'#FF8A80'}">
                ${icons[k]||'●'} ${v}
              </div>`;
            }).join('')}
        </div>
        <div style="font-size:.6rem;color:rgba(214,234,228,.35);font-family:'JetBrains Mono',monospace">
          shahhayaat.com/wellness-lab.html
        </div>
      </div>

      <!-- Share buttons -->
      <div style="display:flex;flex-wrap:wrap;gap:.6rem">
        <button onclick="LAB._shareWellnessCard('whatsapp')"
          style="flex:1;min-width:130px;padding:.7rem 1rem;background:#25D366;color:#fff;
                 border:none;border-radius:10px;font-size:.84rem;font-weight:700;cursor:pointer;
                 display:flex;align-items:center;justify-content:center;gap:.4rem">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          WhatsApp
        </button>
        <button onclick="LAB._shareWellnessCard('telegram')"
          style="flex:1;min-width:130px;padding:.7rem 1rem;background:#229ED9;color:#fff;
                 border:none;border-radius:10px;font-size:.84rem;font-weight:700;cursor:pointer;
                 display:flex;align-items:center;justify-content:center;gap:.4rem">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
          Telegram
        </button>
        <button onclick="LAB._shareWellnessCard('copy')"
          style="flex:1;min-width:130px;padding:.7rem 1rem;background:var(--bg-cream);color:var(--t);
                 border:1.5px solid var(--b);border-radius:10px;font-size:.84rem;font-weight:700;cursor:pointer">
          🔗 Copy Link
        </button>
      </div>
    </div>` : ''}

  </div>`);

  setTimeout(()=>{
    if (overall !== null) LAB._drawRing('overallRing', overall, isCategoryMode && activeCat ? activeCat.color : '#2A7A5A', 64);
    else {
      const c=document.getElementById('overallRing'); if(c){const ctx=c.getContext('2d');ctx.beginPath();ctx.arc(70,70,64,0,Math.PI*2);ctx.strokeStyle='#E4EAE4';ctx.lineWidth=10;ctx.stroke();}
    }
    visibleDomains.forEach(d=>{
      const sc=LAB.scores[d.key]??null;
      if(sc!==null) LAB._drawRing('ring_'+d.key, sc, d.col, 36);
      else {
        const c=document.getElementById('ring_'+d.key); if(c){const ctx=c.getContext('2d');ctx.beginPath();ctx.arc(40,40,36,0,Math.PI*2);ctx.strokeStyle='#E4EAE4';ctx.lineWidth=7;ctx.stroke();}
      }
    });
    // Draw radar chart if canvas present
    LAB._drawRadar(visibleDomains);
  },80);

  // Save current score as prevScore for next-session comparison
  if(overall !== null) {
    LAB.raw.prevScore = LAB.raw._lastFinalScore || null;
    LAB.raw._lastFinalScore = overall;
  }
  LAB.celebrate();
  trackWL('wellness_completed');
  LAB.say(overall !== null
    ? `You did it! Congratulations! Your overall wellness score is ${overall} out of a hundred — that is ${LAB.scoreLbl(overall)}! Scroll down to see your full results, personalised tips, and download your free PDF report!`
    : 'You reached the end — well done for trying! Complete at least a few checks to get your wellness score.');
};

LAB._drawRing = function(canvasId, score, color, radius) {
  const canvas=document.getElementById(canvasId); if(!canvas) return;
  const ctx=canvas.getContext('2d');
  const W=canvas.width, H=canvas.height, cx=W/2, cy=H/2;
  const lineW=radius>40?10:7;
  const r=radius;
  ctx.clearRect(0,0,W,H);

  ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2);
  ctx.strokeStyle='#E8F5EE'; ctx.lineWidth=lineW; ctx.stroke();

  const end=-Math.PI/2+((score/100)*Math.PI*2);
  ctx.beginPath(); ctx.arc(cx,cy,r,-Math.PI/2,end);
  ctx.strokeStyle=color; ctx.lineWidth=lineW; ctx.lineCap='round'; ctx.stroke();

  if(radius>40){
    ctx.fillStyle=color; ctx.font=`bold ${Math.round(radius*.48)}px 'JetBrains Mono',monospace`;
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(score,cx,cy);
  }
};

LAB._buildBreakdownRows = function() {
  const rows=[
    {label:'⚡ Reaction Speed',      val:LAB.raw.rxAvg?LAB.raw.rxAvg+'ms avg':'—',      score:LAB.raw.rxScore},
    {label:'🧩 Spatial Memory',        val:LAB.raw.memSpan?'Span '+LAB.raw.memSpan:'—',      score:LAB.raw.memScore},
    {label:'🎨 Stroop Test',           val:LAB.raw.stroopCorrect!=null?LAB.raw.stroopCorrect+'/20 correct':'—', score:LAB.raw.stroopScore},
      {label:'🔢 Digit Span',            val:LAB.raw.dsSpan!=null?LAB.raw.dsSpan+' digits':'—', score:LAB.raw.dsScore},
      {label:'🔗 Trail Making',          val:LAB.raw.tmtTime!=null?LAB.raw.tmtTime+'s, '+LAB.raw.tmtErr+' mistakes':'—', score:LAB.raw.tmtScore},
    {label:'💪 Body Vitality',         val:LAB.raw.bodyVitality!=null?'6 domains':'—',          score:LAB.raw.bodyVitality},
    {label:'🔤 Word Recall',           val:LAB.raw.wordRecallCorrect!==undefined?LAB.raw.wordRecallCorrect+' words recalled':'—', score:LAB.raw.wordRecallScore},
    {label:'🎨 Colour Blindness',     val:LAB.raw.cbCorrect!==undefined?LAB.raw.cbCorrect+'/'+LAB.raw.cbTotal+' correct':'—', score:LAB.raw.cbScore},
    {label:'🔍 Peripheral Vision',     val:LAB.raw.peripheralHits!==undefined?LAB.raw.peripheralHits+' hits':'—', score:LAB.raw.peripheralScore},
    {label:'👀 Eye Tracking',          val:'Accuracy check', score:LAB.raw.eyeTrackScore},
    {label:'🌬 Breath Sync',          val:'Auto-timed',                                  score:LAB.raw.breathSyncScore},
    {label:'⏱ Breath Hold',           val:LAB.raw.breathHold?LAB.raw.breathHold+'s held':'—', score:LAB.raw.breathScore},
    {label:'♻ Recovery (HRV)',        val:LAB.raw.recoveryBPM?LAB.raw.recoveryBPM+' BPM':'—', score:LAB.raw.recoveryScore},
    {label:'📱 Steady Hand',          val:'Motion analysis',                             score:LAB.raw.stabilityScore},
    {label:'✏ Tremor Drawing',        val:LAB.raw.tremorDev!==undefined?LAB.raw.tremorDev+'px dev':'—', score:LAB.raw.tremorScore},
    {label:'💤 Sleep',                val:LAB.raw.sleepHours?LAB.raw.sleepHours+'h':'—', score:LAB.raw.sleepScore},
    {label:'⚖ Lifestyle',            val:'6 dimensions',                                score:LAB.raw.lifestyleScore},
    {label:'💧 Hydration Risk',       val:LAB.raw.hydrationScore!=null?'Completed':'—', score:LAB.raw.hydrationScore},
    {label:'🌅 Circadian Type',       val:LAB.raw.circadianType||'—', score:LAB.raw.circadianLifeScore||null},
    {label:'🔀 Multitask Load',       val:LAB.raw.multitaskScore!=null?(LAB.raw.multitaskStarAcc!=null?'Star acc: '+LAB.raw.multitaskStarAcc+'%':'Completed'):'—', score:LAB.raw.multitaskScore},
    {label:'⚡ Decision Speed',       val:LAB.raw.decisionScore!=null?(LAB.raw.decisionAcc!=null?LAB.raw.decisionAcc+'% acc':'Completed'):'—', score:LAB.raw.decisionScore},
    {label:'⚡ Fatigue Drift',        val:LAB.raw.fatigueDrift!=null?(LAB.raw.fatigueDrift>0?'+'+LAB.raw.fatigueDrift+'ms slower':'Improved ⚡'):'—', score:LAB.raw.fatigueDriftScore},
    {label:'🔢 Number Sequence',      val:LAB.raw.numberSeqTime!=null?LAB.raw.numberSeqTime+'s':'—', score:LAB.raw.numberSeqScore},
  ];
  if(LAB.gender==='female'){
    rows.push(
      {label:'🌸 Hormonal Rhythm',score:LAB.raw.hormonalScore},
      {label:'⚡ Energy & Iron',  score:LAB.raw.ironScore},
      {label:'🌙 Sleep & Comfort',score:LAB.raw.femCombinedScore},
    );
  }
  return rows.map(r=>{
    const sc=r.score!=null?r.score:null;
    return `<div style="display:flex;align-items:center;justify-content:space-between;gap:.5rem;
                        padding:.52rem .2rem;border-bottom:1px solid var(--b)">
      <span style="font-size:.82rem;color:var(--tm);flex:1">${r.label}</span>
      ${r.val?`<span style="font-size:.7rem;color:var(--tq);font-family:'JetBrains Mono',monospace;margin-right:.5rem">${r.val}</span>`:''}
      <span style="font-family:'JetBrains Mono',monospace;font-size:.82rem;font-weight:700;
                   color:${sc!=null?LAB.scoreCol(sc):'var(--tq)'};min-width:30px;text-align:right">
        ${sc!=null?sc:'—'}
      </span>
    </div>`;
  }).join('');
};

LAB._buildFlagBox = function() {
  const flags=[];
  if(LAB.raw.cbFlag) flags.push({icon:'🎨',title:'Colour Perception',msg:'You may have difficulty distinguishing some colours. Consider a clinical colour blindness test.',col:'var(--bl)'});
  if(LAB.raw.acuityFlag) flags.push({icon:'📏',title:'Visual Acuity',msg:'Your near-screen vision appears limited. An eye examination is recommended.',col:'var(--am)'});
  if((LAB.scores.respiratory||100)<45) flags.push({icon:'🌬',title:'Respiratory',msg:'Your breathing scores are lower than ideal. Speak to a doctor if you have breathing difficulties.',col:'var(--am)'});
  if((LAB.scores.cognitive||100)<40) flags.push({icon:'🧠',title:'Cognitive',msg:'Some cognitive scores were low. Fatigue, stress and poor sleep are common causes. See a doctor if persistent.',col:'var(--am)'});
  if(!flags.length) return '';
  return `<div style="margin-bottom:1.8rem">
    <h3 class="h3" style="margin-bottom:.8rem">⚠ Things to Look Into</h3>
    ${flags.map(f=>`<div style="display:flex;align-items:flex-start;gap:.75rem;padding:.85rem 1rem;
                     background:#fff;border:1.5px solid ${f.col};border-radius:var(--rs);margin-bottom:.55rem">
      <span style="font-size:1.1rem">${f.icon}</span>
      <div><strong style="font-size:.85rem;color:var(--t)">${f.title}</strong>
        <p style="font-size:.78rem;color:var(--tm);margin:.15rem 0 0;line-height:1.6">${f.msg}</p></div>
    </div>`).join('')}
  </div>`;
};







window.mod_hydration = function () {
  LAB.showDemo({
    title: '💧 Hydration Risk',
    txt: 'Answer 5 quick questions about your hydration habits. Dehydration affects mood, cognition and energy — even when mild.',
    hint: 'Takes under 60 seconds · be honest',
    voiceEN: 'Hydration check! Five quick questions about your water intake and related symptoms.',
    btnLabel: 'Begin Hydration Assessment →',
    vis: `<div style="display:flex;gap:.6rem;justify-content:center;flex-wrap:wrap;padding:.5rem">
      ${['💧','🚰','🟡','😴','🤕'].map(e=>`<div style="width:48px;height:48px;background:var(--g3);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.5rem">${e}</div>`).join('')}
    </div>`
  }, () => {
    const questions = [
      { id:'hyWater', icon:'💧', label:'How much water do you drink daily?',
        opts:[['Under 1 litre',20],['1–1.5 litres',50],['1.5–2 litres',78],['Over 2 litres',100]] },
      { id:'hyColor', icon:'🟡', label:'What colour is your urine most of the day?',
        opts:[['Dark yellow / orange',15],['Yellow',50],['Light yellow',85],['Near clear',100]] },
      { id:'hyHead',  icon:'🤕', label:'How often do you get headaches?',
        opts:[['Almost daily',20],['A few times a week',45],['Occasionally',75],['Rarely or never',100]] },
      { id:'hyFatigue', icon:'😴', label:'Do you feel afternoon fatigue not related to sleep?',
        opts:[['Almost every day',20],['Most days',45],['Sometimes',72],['Rarely',100]] },
      { id:'hyDry',   icon:'🚰', label:'Do you experience dry mouth or skin dryness?',
        opts:[['Daily',20],['Often',45],['Occasionally',75],['Rarely',100]] },
    ];

    LAB.render(`<div class="mwrap"><div class="card card--pop">
      <div class="step-head">
        <div class="tag">🌿 Lifestyle · Hydration</div>
        <h2 class="h2" style="margin-top:.75rem;margin-bottom:.4rem">Hydration Risk</h2>
        <p class="pg">Tap your honest answer for each question.</p>
      </div>
      ${questions.map(q=>`
        <div class="fld">
          <label class="lbl">${q.icon} ${q.label}</label>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:.45rem">
            ${q.opts.map(([l,v],i)=>`
              <div onclick="LAB.pickOpt('${q.id}',${i},${v})" role="radio" aria-checked="false" tabindex="0"
                   id="oc_${q.id}_${i}"
                   style="padding:.6rem .75rem;background:#fff;border:2px solid var(--b);border-radius:var(--rs);cursor:pointer;transition:.2s;font-size:.79rem;color:var(--tm);display:flex;align-items:center;gap:.4rem">
                <div id="od_${q.id}_${i}" style="width:13px;height:13px;border-radius:50%;border:2px solid var(--b);flex-shrink:0;transition:.2s"></div>
                ${l}
              </div>`).join('')}
          </div>
        </div>`).join('')}
      <div class="btn-row">
        <button class="btn btn--p btn--lg" onclick="_hyCalc()">Get Hydration Score →</button>
      </div>
    </div></div>`);

    window._hyCalc = function() {
      const ids=['hyWater','hyColor','hyHead','hyFatigue','hyDry'];
      const vals=ids.map(id=>LAB.fval(id,50));
      const sc=LAB.clamp(Math.round(LAB.avg(vals)),10,100);
      LAB.raw.hydrationScore=sc;
      LAB.raw.hydrationLow = LAB.fval('hyWater',50) < 50;
      // Blend into lifestyle
      const lsVals=[LAB.raw.lifestyleScore, sc].filter(x=>x!=null);
      if(lsVals.length) LAB.scores.lifestyle = Math.round(LAB.avg(lsVals));
      LAB.say(`Hydration score: ${sc}. ${sc < 60 ? 'Low hydration detected — try to drink more water daily.' : 'Good hydration habits!'}`);
      setTimeout(()=>{ LAB.idx++; LAB.next(); }, 1500);
    };
  });
};








LAB._drawRadar = function(domains) {
  const canvas = document.getElementById('radarChart');
  if (!canvas) return;
  const filteredDomains = domains.filter(d => LAB.scores[d.key] != null);
  if (filteredDomains.length < 3) return;

  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W/2, cy = H/2 + 10;
  const R = Math.min(W,H)/2 - 55;
  const N = filteredDomains.length;
  ctx.clearRect(0,0,W,H);

  // Grid rings
  [0.25,0.5,0.75,1.0].forEach(pct => {
    ctx.beginPath();
    for(let i=0;i<N;i++){
      const angle = (i/N)*Math.PI*2 - Math.PI/2;
      const x=cx+Math.cos(angle)*R*pct, y=cy+Math.sin(angle)*R*pct;
      i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
    }
    ctx.closePath();
    ctx.strokeStyle=pct===1?'rgba(42,122,90,.22)':'rgba(0,0,0,.07)';
    ctx.lineWidth=pct===1?1.5:1;
    ctx.stroke();
    // Ring label
    if(pct<1){
      const lx=cx+2, ly=cy-R*pct-4;
      ctx.fillStyle='rgba(0,0,0,.3)';ctx.font='9px JetBrains Mono,monospace';
      ctx.textAlign='left';ctx.fillText(Math.round(pct*100),lx,ly);
    }
  });

  // Spokes
  filteredDomains.forEach((_,i)=>{
    const angle=(i/N)*Math.PI*2-Math.PI/2;
    ctx.beginPath();ctx.moveTo(cx,cy);
    ctx.lineTo(cx+Math.cos(angle)*R,cy+Math.sin(angle)*R);
    ctx.strokeStyle='rgba(0,0,0,.1)';ctx.lineWidth=1;ctx.stroke();
  });

  // Data polygon
  ctx.beginPath();
  filteredDomains.forEach((d,i)=>{
    const sc=LAB.scores[d.key]||0;
    const angle=(i/N)*Math.PI*2-Math.PI/2;
    const x=cx+Math.cos(angle)*R*(sc/100), y=cy+Math.sin(angle)*R*(sc/100);
    i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
  });
  ctx.closePath();
  ctx.fillStyle='rgba(42,122,90,.18)';ctx.fill();
  ctx.strokeStyle='#2A7A5A';ctx.lineWidth=2.5;ctx.stroke();

  // Data points + labels
  filteredDomains.forEach((d,i)=>{
    const sc=LAB.scores[d.key]||0;
    const angle=(i/N)*Math.PI*2-Math.PI/2;
    const px=cx+Math.cos(angle)*R*(sc/100), py=cy+Math.sin(angle)*R*(sc/100);
    // Dot
    ctx.beginPath();ctx.arc(px,py,5,0,Math.PI*2);
    ctx.fillStyle=d.col;ctx.fill();
    ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.stroke();
    // Label
    const lx=cx+Math.cos(angle)*(R+30), ly=cy+Math.sin(angle)*(R+30);
    ctx.fillStyle='#333';ctx.font='bold 12px system-ui,sans-serif';ctx.textAlign='center';
    ctx.fillText(d.icon+' '+sc, lx, ly);
  });
};

/* ── Share result ──────────────────────────────────────────── */
LAB._shareResult = function(score) {
  const text = `I just tested my wellness on Shah Hayaat Lab!

My Wellness Score: ${score}/100

Try yours free → https://www.shahhayaat.com/wellness-lab.html`;
  if(navigator.share){navigator.share({title:'My Shah Hayaat Wellness Score',text:text}).catch(()=>{});}
  else {
    navigator.clipboard.writeText(text).then(()=>{
      const btn=event.target.closest('button');
      if(btn){const old=btn.innerHTML;btn.innerHTML='✓ Copied!';btn.style.background='#2A7A5A';setTimeout(()=>{btn.innerHTML=old;btn.style.background='';},2000);}
    }).catch(()=>{
      const wa=`https://wa.me/?text=${encodeURIComponent(text)}`;window.open(wa,'_blank');
    });
  }
};

/* ── Personal Best panel ───────────────────────────────────── */
LAB._showPersonalBest = function() {
  const pb = LAB.raw.personalBest || {};
  const bests = [
    {key:'rxAvg',       label:'⚡ Best Reaction Time', unit:'ms', lower:true},
    {key:'breathHold',  label:'🌬 Longest Breath Hold', unit:'s', lower:false},
    {key:'numberSeq',   label:'🔢 Fastest Number Sequence', unit:'s', lower:true},
  ];

  const rows = bests.map(b=>{
    const val = LAB.raw[b.key] || pb[b.key];
    if(!val) return '';
    return `<div style="display:flex;align-items:center;justify-content:space-between;padding:.7rem .9rem;background:var(--bg);border-radius:var(--rs);margin-bottom:.45rem">
      <span style="font-size:.85rem;font-weight:600;color:var(--t)">${b.label}</span>
      <span style="font-family:'JetBrains Mono',monospace;font-weight:700;color:var(--g);font-size:.95rem">${val} ${b.unit}</span>
    </div>`;
  }).filter(Boolean).join('');

  const overlay=document.createElement('div');
  overlay.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:10000;display:flex;align-items:center;justify-content:center;padding:1rem';
  overlay.innerHTML=`<div style="background:#fff;border-radius:var(--r);padding:1.6rem 1.4rem;max-width:340px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
      <h3 style="margin:0;font-family:'Playfair Display',serif;font-size:1.2rem">🏆 Personal Best</h3>
      <button onclick="this.closest('[style*=fixed]').remove()"
        style="background:none;border:none;font-size:1.3rem;cursor:pointer;color:var(--tq)">✕</button>
    </div>
    ${rows || '<p style="color:var(--tq);font-size:.85rem;text-align:center;padding:1rem">Complete more tests to see your personal bests here.</p>'}
    <p style="font-size:.7rem;color:var(--tq);margin-top:.8rem;text-align:center">Best results from this session</p>
  </div>`;
  document.body.appendChild(overlay);
};

LAB._buildRecs = function() {
  const S=LAB.scores, R=LAB.raw;
  const recs=[];

  // Fatigue Drift
  if(R.fatigueDrift!=null && R.fatigueDrift>30)
    recs.push({icon:'😴',title:'Mental Fatigue Detected',
      body:'Your reaction time slowed by '+R.fatigueDrift+'ms across the test. This signals accumulating mental fatigue — likely from poor sleep, stress or long screen hours.',
      action:'Prioritise 7–9 hrs sleep · take regular screen breaks',col:'#7C3AED'});

  // Go/No-Go impulse control
  if(R.stroopScore!=null && R.stroopScore<65)
    flags.push({
      icon:'🎨',
      title:'Cognitive Flexibility',
      body:'Your Stroop score ('+R.stroopScore+') suggests some difficulty switching between tasks. This is common with mental fatigue, stress or poor sleep.',
      link:null
    });

  // Number sequence speed
  if(R.numberSeqScore!=null && R.numberSeqScore<55)
    recs.push({icon:'🔢',title:'Visual Processing Speed',
      body:'Your number sequence took '+R.numberSeqTime+'s. Slower visual search speed may indicate mental load, visual fatigue or dehydration.',
      action:'Stay hydrated · take eye breaks · brain puzzles daily',col:'#2563EB'});

  if((S.cognitive||100)<60)
    recs.push({icon:'🧩',title:'Brain Training',body:'Daily cognitive challenges — puzzles, memory games, or learning a new skill — can meaningfully improve processing speed and working memory.',action:'Try 10 min/day',col:'#2A7A5A'});
  if((R.rxAvg||0)>400)
    recs.push({icon:'⚡',title:'Faster Reactions',body:'Your reaction time is above average. Regular aerobic exercise and reducing screen fatigue before tests can shorten it.',action:'Aerobic exercise',col:'#059669'});

  if(R.cbFlag)
    recs.push({icon:'🎨',title:'Colour Vision Test',body:'A clinical Ishihara test at an optometrist can confirm colour blindness type and severity in 10 minutes.',action:'Book an eye test',col:'#2563EB'});
  if(R.acuityFlag)
    recs.push({icon:'👓',title:'Eye Examination',body:'Your screen-acuity result was below the typical reading threshold. An optometrist can check for refractive errors.',action:'Book eye exam',col:'#2563EB'});
  if(!R.cbFlag&&!R.acuityFlag&&(S.eye||100)>=70)
    recs.push({icon:'👁',title:'Eye Health',body:'Your eye health indicators look good. Maintain the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds.',action:'20-20-20 rule',col:'#7C3AED'});

  // Eye Strain
  if(R.eyeStrainScore!=null && R.eyeStrainScore<55)
    recs.push({icon:'🖥',title:'Digital Eye Strain Detected',body:'Your blink resistance was '+R.eyeStrainBlinkTime+'s and focus accuracy was '+R.eyeStrainFocusScore+'%. Extended screen use likely causes fatigue. Reduce daily screen time and apply the 20-20-20 rule.',action:'20-20-20 rule daily',col:'#2563EB'});
  else if(R.eyeStrainScore!=null && R.eyeStrainScore>=75)
    recs.push({icon:'🖥',title:'Low Screen Fatigue',body:'Your eye strain score is excellent — good blink rate and focus switching ability indicate healthy visual endurance.',action:'Keep screen habits healthy',col:'#2A7A5A'});

  if((R.breathHold||100)<25)
    recs.push({icon:'🫁',title:'Breathing Exercises',body:'Short breath-hold time can indicate high CO₂ sensitivity or anxiety. Box breathing (4-4-4-4) practiced daily builds tolerance.',action:'Box breathing daily',col:'#059669'});
  if((S.respiratory||100)<55)
    recs.push({icon:'🌬',title:'Lung Capacity',body:'Regular aerobic activity — walking, swimming or cycling — is the most effective way to improve respiratory efficiency over time.',action:'30 min aerobic/day',col:'#059669'});

  if((S.stress||100)<55)
    recs.push({icon:'🔥',title:'Stress Management',body:'High stress reduces cognitive performance under pressure. Mindfulness, consistent sleep and limiting caffeine can improve scores.',action:'Try mindfulness',col:'#C97010'});
  if((R.stressRecoveryScore||100)<50)
    recs.push({icon:'🧘',title:'Poor Stress Recovery',body:'Your body takes longer than average to recover from stressful events. Daily breathwork — even 5 minutes of box breathing (4-4-4-4) — can accelerate recovery speed measurably.',action:'Box breathing 5 min/day',col:'#7C3AED'});

  if((R.tremorDev||0)>35)
    recs.push({icon:'✏',title:'Fine Motor Stability',body:'Higher tremor deviation can result from caffeine, poor sleep or stress. Reducing stimulants and practising steady-hand tasks helps.',action:'Reduce caffeine',col:'#7C3AED'});

  if((R.sleepHours||8)<6)
    recs.push({icon:'💤',title:'Sleep Duration',body:'You slept under 6 hours. Chronic sleep deprivation affects every health dimension measured here. 7–9 hours is the recommended range.',action:'Aim for 7–9 hrs',col:'#0369A1'});
  if((R.sleepScore||100)<55)
    recs.push({icon:'🌙',title:'Sleep Quality',body:'Poor sleep quality affects cognitive, hormonal, and physical health. A consistent bedtime and limiting blue light after 9pm are impactful first steps.',action:'Consistent bedtime',col:'#0369A1'});

  const liBrk=R.lifestyleBreakdown||[];
  if(liBrk[0]<55)
    recs.push({icon:'💧',title:'Hydration',body:'You indicated low water intake. Even mild dehydration reduces cognitive performance, mood and energy. Aim for at least 2 litres per day.',action:'Drink 2L water/day',col:'#0284C7'});
  if(liBrk[1]<55)
    recs.push({icon:'🏃',title:'Physical Activity',body:'Regular movement is the single most evidence-backed intervention for overall health. Even 30 minutes of brisk walking daily makes a measurable difference.',action:'30 min walk daily',col:'#059669'});
  if(liBrk[3]<55)
    recs.push({icon:'😤',title:'Stress Load',body:'You reported high day-to-day stress. Beyond affecting scores, chronic stress has serious long-term health effects. Consider talking to someone you trust.',action:'Talk to someone',col:'#C97010'});

  if(LAB.gender==='female'){
    if((R.hormonalScore||100)<55)
      recs.push({icon:'🌸',title:'Hormonal Balance',body:'Irregular cycles or severe PMS can indicate hormonal imbalances. A gynaecologist or GP can run simple blood panels to check.',action:'See a gynaecologist',col:'#B83060'});
    if((R.ironScore||100)<55)
      recs.push({icon:'🩸',title:'Iron Levels',body:'Your responses suggest possible iron deficiency, which is very common in women. A simple blood test can confirm. Iron-rich foods and vitamin C absorption help.',action:'Get blood test',col:'#B83060'});
  }

  if((S.cognitive||0)>=75)
    recs.push({icon:'🏆',title:'Strong Cognition',body:'Your cognitive scores are excellent! Keep challenging your brain with varied activities — novelty is key to maintaining sharpness.',action:'Keep it up!',col:'#2A7A5A'});

  // Posture Balance
  if(R.postureScore!=null && R.postureScore<50)
    recs.push({icon:'⚖',title:'Postural Instability Detected',body:'High micro-movement was recorded (deviation: '+R.postureStdDev+'). This may be caused by caffeine, fatigue, stress or a neurological factor. Reducing stimulants and practising balance exercises can help.',action:'Balance exercises daily',col:'#7C3AED'});
  else if(R.postureScore!=null && R.postureScore>=80)
    recs.push({icon:'⚖',title:'Excellent Balance',body:'Your postural stability score is very high. This reflects good core strength, proprioception and nervous system control.',action:'Keep it up!',col:'#7C3AED'});

  // Emotional Stress
  if(R.emotionalFalseAlarms!=null && R.emotionalFalseAlarms>2)
    recs.push({icon:'😮',title:'High Emotional Reactivity',body:'You tapped '+R.emotionalFalseAlarms+' stress words accidentally. This suggests your nervous system responds quickly to threatening stimuli — a marker of elevated background stress or anxiety.',action:'Mindfulness · breathing exercises',col:'#C97010'});
  else if(R.emotionalStressScore!=null && R.emotionalStressScore>=75)
    recs.push({icon:'😮',title:'Stable Emotional Response',body:'Your emotional stress response shows good inhibitory control. You can effectively suppress reactions to stressful stimuli.',action:'Maintain stress hygiene',col:'#2A7A5A'});

  // Cognitive Flexibility
  if(R.cogFlexSwitchErrors!=null && R.cogFlexSwitchErrors>3)
    recs.push({icon:'🔄',title:'Cognitive Flexibility Below Average',body:'You made '+R.cogFlexSwitchErrors+' errors on rule-switch trials. Cognitive rigidity often links to sleep deprivation, chronic stress or insufficient mental variety. Brain training and novel activities help.',action:'Try new activities daily',col:'#2563EB'});
  else if(R.cogFlexScore!=null && R.cogFlexScore>=80)
    recs.push({icon:'🔄',title:'High Cognitive Flexibility',body:'Excellent rule-switching ability. Your brain adapts quickly to changing demands — a strong predictor of resilience and problem-solving capacity.',action:'Keep challenging yourself!',col:'#2A7A5A'});

  // Hydration
  if((R.hydrationScore||100)<55)
    recs.push({icon:'💧',title:'Low Hydration Score',body:'Your responses suggest you may be chronically under-hydrated. Even mild dehydration of 2% reduces cognitive performance, focus and energy significantly.',action:'Drink 2–3L water daily',col:'#0284C7'});
  else if((R.hydrationScore||0)>=80)
    recs.push({icon:'💧',title:'Excellent Hydration',body:'Your hydration habits are strong. Well-hydrated brains process information faster and maintain focus better throughout the day.',action:'Keep it up!',col:'#0284C7'});

  // Circadian
  if(R.circadianType==='Night Owl')
    recs.push({icon:'🌙',title:'Night Owl Detected',body:'Your natural rhythm peaks in the evening. If social or work schedules force early waking, this creates "social jetlag" that reduces cognitive performance and mood.',action:'Align schedule to your rhythm',col:'#5B21B6'});
  else if(R.circadianType==='Morning Lark')
    recs.push({icon:'🌅',title:'Morning Lark Profile',body:'Your peak cognitive hours are early. Front-load important decisions and creative work before noon for best results.',action:'Deep work before noon',col:'#92400E'});

  // Multitask divided attention
  if(R.multitaskScore != null && R.multitaskScore < 60)
    recs.push({icon:'🔀',title:'Divided Attention Needs Work',
      body:'Your multitask score ('+R.multitaskScore+') suggests difficulty managing split attention. This is common under chronic stress, sleep debt or high digital load.',
      action:'Single-task more · reduce interruptions',col:'#C97010'});

  // Decision speed
  if(R.decisionScore != null && R.decisionScore < 60)
    recs.push({icon:'⚡',title:'Decision Processing Below Average',
      body:'Your decision speed ('+R.decisionScore+') indicates slower processing. Mental fatigue, dehydration and poor sleep are the main culprits. Address them and retest.',
      action:'Sleep 7–9 hrs · hydrate · retest in 1 week',col:'#2563EB'});

  return recs.slice(0,12);
};

/* ── Save scores to localStorage for exercises page ── */
LAB._saveScoresForExercises = function() {
  try {
    localStorage.setItem('sh_lab_scores', JSON.stringify(LAB.scores || {}));
    localStorage.setItem('sh_lab_raw', JSON.stringify(LAB.raw || {}));
  } catch(e) {}
};

/* ── Build recommended exercises list in dashboard ── */
LAB._buildExerciseRecs = function() {
  const S = LAB.scores, R = LAB.raw || {};
  const tags = [];
  const add = t => { if(!tags.includes(t)) tags.push(t); };
  if((S.cognitive||100)<65){ add('🧠 Brain Exercises'); add('💡 Memory Training'); }
  if((S.eye||100)<65)       add('👁️ Eye Exercises');
  if((S.respiratory||100)<65){ add('🌬️ Breathing Exercises'); }
  if((S.stress||100)<65)   { add('🔥 Stress Reduction'); add('🧘 Calming Exercises'); }
  if((S.stability||100)<65)  add('⚖️ Balance Exercises');
  if((S.lifestyle||100)<65)  add('😴 Wake-Up & Energy Boost');
  if((R.fatigueDrift||0)>25) add('⚡ Anti-Fatigue Exercises');
  if((R.breathScore||100)<55) add('🌬️ Breath Training');
  const block = document.getElementById('exRecsBlock');
  if(!block) return;
  if(tags.length===0){
    block.innerHTML='<span style="font-size:.8rem;color:#2A7A5A;font-weight:600">✓ All domains healthy! Explore exercises to maintain your scores.</span>';
  } else {
    block.innerHTML = tags.map(t=>
      `<span style="display:inline-flex;align-items:center;gap:.3rem;padding:.25rem .7rem;border-radius:50px;font-size:.68rem;font-weight:700;background:rgba(239,68,68,.15);border:1px solid rgba(239,68,68,.28);color:#fca5a5">${t}</span>`
    ).join('');
  }
};

LAB.SH_PRODUCTS = {
  brainchamp: {
    name:'Brain Champ', price:175, tag:'🧠 Brain & Focus', tagColor:'#2A7A5A',
    desc:'Ayurvedic syrup traditionally used to support memory, focus and mental wellbeing.',
    full:'Ayurvedic syrup combining Brahmi, Shankhpushpi, Ashwagandha and classical herbs, traditionally used to support brain health, concentration and memory.',
    benefits:'Traditionally used for memory support · Supports focus & concentration · Supports a healthy stress response · Classical brain-health herbs',
    ingredients:'Brahmi (Bacopa monnieri), Shankhpushpi, Ashwagandha, Jatamansi, Vacha',
    dosage:'10–15 ml twice daily with warm milk or water, preferably after meals.',
    precautions:'Not recommended during pregnancy. Consult physician if on existing medication.',
    indication:'Low cognitive score · High reaction time · Low memory span · Stress indicators'
  },
  shahzyme: {
    name:'Shah Zyme', price:165, tag:'🍽 Digestion', tagColor:'#059669',
    desc:'Herbal digestive syrup traditionally used to support comfortable digestion.',
    full:'Herbal digestive syrup combining Ajwain, Saunf, Jeera, Pudina, Harad and Amla, traditionally used to support digestion and comfort after meals.',
    benefits:'Traditionally used for gas & bloating comfort · Supports digestion · Supports healthy appetite · Eases post-meal heaviness',
    ingredients:'Ajwain, Saunf (Fennel), Jeera (Cumin), Pudina (Mint), Harad, Baheda, Amla',
    dosage:'10–15 ml after meals, twice daily.',
    precautions:'Not for children under 5 years without medical advice.',
    indication:'Low gut health score · Digestive discomfort reported'
  },
  bloodstorm: {
    name:'Blood Storm', price:165, tag:'🩸 Blood & Energy', tagColor:'#C0392B',
    desc:'Ayurvedic blood tonic traditionally used to support energy and healthy haemoglobin levels.',
    full:'Ayurvedic blood tonic combining iron-rich herbs with rejuvenating ingredients, traditionally used to support haemoglobin levels, circulation and energy.',
    benefits:'Traditionally used to support healthy haemoglobin · Supports energy & vitality · Supports healthy circulation · Supports overall wellbeing',
    ingredients:'Loha Bhasma, Punarnava, Shatavari, Ashwagandha, Amla, Draksha',
    dosage:'10–15 ml twice daily with water or milk after meals.',
    precautions:'Consult a physician before use during pregnancy.',
    indication:'Low energy score · Low iron indicators · High stress · Heart rate concerns · Low haemoglobin'
  },
  coughxpro: {
    name:'Cough X Pro', price:90, tag:'😮‍💨 Respiratory', tagColor:'#0891B2',
    desc:'Herbal cough syrup traditionally used to soothe throat irritation and support respiratory comfort.',
    full:'Ayurvedic formulation traditionally used to soothe the throat and support respiratory comfort during cough.',
    benefits:'Soothes throat irritation · Traditionally used for chest comfort · Supports respiratory wellbeing · See a doctor for a persistent cough',
    ingredients:'Tulsi (Holy Basil), Mulethi (Licorice), Adrak (Ginger), Pippali, Vasa, Honey',
    dosage:'10 ml three times daily. Children (5–12): 5 ml three times daily.',
    precautions:'Diabetics should consult a physician due to natural honey content.',
    indication:'Low respiratory score · Low breath hold time · Breathing difficulty reported'
  },
  musaffakhoon: {
    name:'Musaffa Khoon', price:165, tag:'✨ Blood Purifier', tagColor:'#7C3AED',
    desc:'Traditional blood purifier traditionally used to support skin health.',
    full:'Classical Ayurvedic formulation traditionally used to support skin health and the body’s natural cleansing.',
    benefits:'Traditionally used for skin health · Supports natural cleansing · Supports clear, healthy-looking skin · Classical blood-purifying herbs',
    ingredients:'Neem, Manjistha, Khadir, Sarsaparilla, Giloy, Triphala',
    dosage:'10–15 ml twice daily with water before meals.',
    precautions:'Individual results may vary with consistent use of consistent use.',
    indication:'Low eye health score · Visual acuity concerns · Skin-related indicators'
  },
  panasip: {
    name:'PanaSip', price:165, tag:'🔥 Acidity Relief', tagColor:'#EA580C',
    desc:'Ayurvedic syrup traditionally used to support comfort from acidity and heartburn.',
    full:'Ayurvedic syrup with cooling, soothing herbs, traditionally used to support digestive comfort during occasional acidity and heartburn.',
    benefits:'Traditionally used for acidity comfort · Soothes occasional heartburn · Supports stomach comfort · Supports healthy digestion',
    ingredients:'Mulethi, Shatavari, Amalaki, Guduchi, Yashtimadhu, Shankha Bhasma',
    dosage:'15 ml before meals, three times daily.',
    precautions:'Take on an empty stomach for best results. Refrigerate after opening.',
    indication:'Low gut health score · Acidity or heartburn reported in lifestyle check'
  },
  livohayaat: {
    name:'Livo Hayaat', price:349, tag:'🟤 Liver Health', tagColor:'#92400E',
    desc:'Ayurvedic tablet traditionally used to support liver health.',
    full:'Hepatoprotective Ayurvedic tablet with Bhumi Amla, Kalmegh and Kutki, traditionally used to support liver function and healthy digestion.',
    benefits:'Traditionally used to support liver health · Supports healthy liver function · Supports bile production · Antioxidant herbs',
    ingredients:'Bhumi Amla, Kalmegh, Kutki, Punarnava, Makoy, Kasni',
    dosage:'2 tablets twice daily with warm water before meals.',
    precautions:'Not for use with hepatotoxic drugs without physician advice.',
    indication:'Poor lifestyle score · Low gut health score · Chronic fatigue indicators'
  },
  diaease: {
    name:'Dia-Ease', price:695, tag:'🍬 Blood Sugar', tagColor:'#0F766E',
    desc:'Ayurvedic formulation traditionally used to support healthy blood sugar levels.',
    full:'Multi-herb Ayurvedic formulation traditionally used to support healthy blood sugar levels and pancreatic function, alongside diet, exercise and medical care.',
    benefits:'Supports healthy blood sugar · Traditionally used for metabolic balance · Helps manage sugar cravings · Not a substitute for prescribed diabetes medicines',
    ingredients:'Karela (Bitter Melon), Jamun Seed, Gurmar, Vijaysar, Methi, Neem, Tulsi',
    dosage:'2 tablets twice daily, 30 minutes before meals with warm water.',
    precautions:'Monitor blood sugar regularly. Do not discontinue prescribed medication without physician guidance.',
    indication:'Blood sugar or diabetes indicators from lifestyle questionnaire'
  },
  orthohayaat: {
    name:'Ortho Hayaat', price:649, tag:'🦴 Joint Care', tagColor:'#7C3AED',
    desc:'Ayurvedic formulation traditionally used to support joint comfort and mobility.',
    full:'Ayurvedic formulation combining Shallaki, Guggul, Rasna and other herbs, traditionally used to support joint comfort, flexibility and mobility.',
    benefits:'Traditionally used for joint comfort · Supports mobility & flexibility · Supports healthy joints · See a doctor for persistent joint pain',
    ingredients:'Shallaki (Boswellia), Guggul, Rasna, Nirgundi, Ashwagandha, Sunthi',
    dosage:'2 tablets twice daily with warm milk or water after meals.',
    precautions:'Individual results may vary with consistent use of consistent use.',
    indication:'Low stability score · High tremor score · Motor coordination concerns'
  },
  utrohayaat: {
    name:'Utro Hayaat', price:625, tag:'🌸 Female Health', tagColor:'#BE185D',
    desc:"Ayurvedic tonic traditionally used to support women’s reproductive health and hormonal balance.",
    full:"Ayurvedic tonic syrup with classical herbs, traditionally used to support menstrual comfort, regular cycles and hormonal balance.",
    benefits:'Traditionally used for menstrual comfort · Supports regular cycles · Supports hormonal balance · Supports uterine health',
    ingredients:'Ashoka, Lodhra, Shatavari, Nagkesar, Daruharidra, Kumari (Aloe)',
    dosage:'10–15 ml twice daily after meals with milk or water.',
    precautions:'Not recommended during pregnancy or breastfeeding without medical advice.',
    indication:'Low hormonal score (female) · Menstrual irregularity reported'
  },
  passionpulse: {
    name:'Passion Pulse', price:599, tag:'⚡ Male Vitality', tagColor:'#1D4ED8',
    desc:'Ayurvedic formulation traditionally used to support stamina and male vitality.',
    full:'Ayurvedic male wellness supplement with adaptogens, traditionally used to support stamina, energy and vitality.',
    benefits:'Traditionally used to support stamina & endurance · Supports male vitality · Supports energy levels · Supports overall wellbeing',
    ingredients:'Ashwagandha, Shilajit, Safed Musli, Kaunch Beej, Gokshura, Vidarikanda',
    dosage:'2 tablets twice daily with milk or warm water before bedtime.',
    precautions:'Not for use under 18 years. Consult physician if you have existing health conditions.',
    indication:'Low stress & energy scores (male) · Chronic fatigue indicators'
  },
  fevodol: {
    name:'Fevodol', price:165, tag:'🛡 Immunity', tagColor:'#2A7A5A',
    desc:'Ayurvedic formulation traditionally used to support immunity.',
    full:"Ayurvedic immune-strengthening formulation supporting the body\'s natural defence mechanisms. Antipyretic, anti-infective and immunomodulatory herbs reduce fever, fight infections and build long-term immunity.",
    benefits:'Traditionally used to support immunity · Supports the body’s natural defences · Giloy & Tulsi herbs · See a doctor for a persistent fever',
    ingredients:'Giloy (Guduchi), Tulsi, Chirayata, Kutki, Sudarshan Churna',
    dosage:'2 tablets three times daily during illness. For immunity maintenance: twice daily.',
    precautions:'Continue medical treatment during severe infections. This is a supportive supplement.',
    indication:'Multiple low scores · Recurring illness indicators · General immunity maintenance'
  }
};

LAB._buildProductCards = function () {
  const S = LAB.scores, R = LAB.raw, P = LAB.SH_PRODUCTS;
  const isFem = LAB.gender === 'female';
  const isMale = LAB.gender === 'male';
  const selected = [];

  // Brain & Cognitive
  if ((S.cognitive ?? 100) < 75 || (R.memSpan ?? 9) < 5 || (R.stroopScore ?? 100) < 65 || (R.rxAvg ?? 0) > 350)
    selected.push({ ...P.brainchamp, id:'brainchamp', reason:'Your cognitive score suggests memory or focus support.' });

  // Respiratory
  if ((S.respiratory ?? 100) < 70 || (R.breathHold ?? 999) < 25)
    selected.push({ ...P.coughxpro, id:'coughxpro', reason:'Breathing scores indicate respiratory support may help.' });

  // Stress & Energy
  if ((S.stress ?? 100) < 70 || (R.sleepHours ?? 8) < 6)
    selected.push({ ...P.bloodstorm, id:'bloodstorm', reason:'Low energy or stress scores detected.' });

  // Lifestyle & Liver
  if ((S.lifestyle ?? 100) < 65)
    selected.push({ ...P.livohayaat, id:'livohayaat', reason:'Lifestyle scores suggest liver detox and digestive support.' });

  // Stability & Joints
  if ((S.stability ?? 100) < 65 || (R.tremorDev ?? 0) > 30)
    selected.push({ ...P.orthohayaat, id:'orthohayaat', reason:'Motor stability scores point to joint and nerve support.' });

  // Eye Health
  if ((S.eye ?? 100) < 70 || R.cbFlag || R.acuityFlag)
    selected.push({ ...P.musaffakhoon, id:'musaffakhoon', reason:'Blood purification supports eye health and clarity.' });

  // Gut Health — shahzyme for digestion, panasip for acidity, livohayaat for liver
  if ((S.gut ?? 100) < 65) {
    selected.push({ ...P.shahzyme, id:'shahzyme', reason:'Gut health scores suggest digestive enzyme support.' });
    selected.push({ ...P.panasip,  id:'panasip',  reason:'Gut health score suggests acidity or gastric discomfort support.' });
    selected.push({ ...P.livohayaat, id:'livohayaat', reason:'Gut health scores suggest digestive and liver support.' });
  }

  // Female Hormonal
  if (isFem && (S.hormonal ?? 100) < 75)
    selected.push({ ...P.utrohayaat, id:'utrohayaat', reason:'Hormonal rhythm scores indicate female tonic support.' });

  // Female Iron / Energy
  if (isFem && (R.ironScore ?? 100) < 70)
    selected.push({ ...P.bloodstorm, id:'bloodstorm', reason:'Iron and energy indicators suggest blood support.' });

  // Male Vitality
  if (isMale && (S.stress ?? 100) < 65)
    selected.push({ ...P.passionpulse, id:'passionpulse', reason:'Stress and energy scores may benefit from vitality support.' });

  // Heart Rate
  if ((S.heart ?? 100) < 75 || (R.heartBPM ?? 72) > 90 || (R.heartBPM ?? 72) < 55)
    selected.push({ ...P.bloodstorm, id:'bloodstorm', reason:'Heart rate indicators suggest cardiovascular and energy support.' });

  // Immunity — any low score
  const anyLow = Object.values(S).some(v => v != null && v < 60);
  if (anyLow)
    selected.push({ ...P.fevodol, id:'fevodol', reason:'Multiple low scores — immunity support recommended.' });

  const seen = new Set();
  const unique = selected.filter(p => { if (seen.has(p.id)) return false; seen.add(p.id); return true; });

  if (unique.length === 0) {
    unique.push({ ...P.brainchamp, id:'brainchamp', reason:'General wellness maintenance.' });
    unique.push({ ...P.fevodol,    id:'fevodol',    reason:'Strengthen your immune defences.' });
  }

  const show = unique.slice(0, 6);
  const WA = '917051056287';

  return show.map(p => {
    const waMsg = encodeURIComponent(`Hi Shah Hayaat! I completed the Wellness Lab assessment and would like to order *${p.name}* (₹${p.price}). Please help me place my order.`);
    return `
    <div style="background:#fff;border:1.5px solid var(--b);border-radius:var(--r);overflow:hidden;
                box-shadow:0 2px 10px rgba(0,0,0,.05);
                transition:transform .22s cubic-bezier(.4,0,.2,1),box-shadow .22s;display:flex;flex-direction:column"
         onmouseenter="this.style.transform='translateY(-5px)';this.style.boxShadow='0 14px 32px rgba(0,0,0,.1)'"
         onmouseleave="this.style.transform='none';this.style.boxShadow='0 2px 10px rgba(0,0,0,.05)'">
      <div style="height:3px;background:${p.tagColor}"></div>
      <div style="padding:.9rem 1rem;flex:1;display:flex;flex-direction:column;gap:.4rem">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:.4rem">
          <span style="font-size:.58rem;font-weight:700;color:${p.tagColor};background:${p.tagColor}18;
                       padding:.2rem .55rem;border-radius:50px;white-space:nowrap">${p.tag}</span>
          <span style="font-family:'JetBrains Mono',monospace;font-size:.8rem;font-weight:700;
                       color:var(--g);white-space:nowrap">₹${p.price}</span>
        </div>
        <div style="font-weight:700;font-size:.92rem;color:var(--t);line-height:1.25">${p.name}</div>
        <div style="font-size:.74rem;color:var(--tq);line-height:1.58;flex:1">${p.desc}</div>
        ${p.ingredients ? `<div style="font-size:.62rem;color:var(--g);margin-top:.1rem">🌿 <em>${p.ingredients}</em></div>` : ''}
        <div style="font-size:.64rem;color:var(--g);font-weight:600;margin-top:.1rem">✓ ${p.benefits.replace(/·/g,'&nbsp;&nbsp;·&nbsp;')}</div>
        ${p.dosage ? `<div style="font-size:.62rem;color:var(--tm);background:var(--bg);border-radius:4px;padding:.3rem .5rem;margin-top:.1rem">📋 ${p.dosage}</div>` : ''}
        ${p.reason ? `<div style="font-size:.62rem;color:var(--am);font-style:italic;margin-top:.15rem">💡 ${p.reason}</div>` : ''}
      </div>
      <div style="padding:.7rem 1rem;border-top:1px solid var(--b);display:flex;gap:.5rem;flex-wrap:wrap">
        <a href="https://wa.me/${WA}?text=${waMsg}" target="_blank" rel="noopener"
           style="flex:1;display:inline-flex;align-items:center;justify-content:center;gap:.35rem;
                  background:#25D366;color:#fff;border-radius:50px;padding:.45rem .7rem;
                  font-size:.72rem;font-weight:700;text-decoration:none;white-space:nowrap;
                  transition:opacity .18s" onmouseenter="this.style.opacity='.85'" onmouseleave="this.style.opacity='1'">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Order on WhatsApp
        </a>
        <a href="${shProductUrl(p.id)}"
           target="_blank" rel="noopener"
           style="display:inline-flex;align-items:center;padding:.45rem .7rem;
                  background:var(--g3);color:var(--g);border-radius:50px;
                  font-size:.72rem;font-weight:700;text-decoration:none;white-space:nowrap;
                  transition:background .18s" onmouseenter="this.style.background='var(--g2)'" onmouseleave="this.style.background='var(--g3)'">
          Details →
        </a>
      </div>
    </div>`;
  }).join('');
};

/* ── Shareable Wellness Card ─────────────────────────────────────── */
LAB._shareWellnessCard = function (platform) {
  const S = LAB.scores;
  const overall = (function() {
    const vals = [S.cognitive, S.eye, S.respiratory, S.stress, S.stability, S.lifestyle,
                  S.heart, S.gut, S.hearing].filter(v => v != null);
    return vals.length ? Math.round(vals.reduce((a,b) => a+b, 0) / vals.length) : null;
  })();

  if (overall === null) { LAB.toast('Complete at least one test to share your score.'); return; }

  const icons = {cognitive:'🧠',eye:'👁',respiratory:'🌬',stress:'🔥',
                 stability:'📱',lifestyle:'⚖',heart:'❤️',gut:'🍽',hearing:'👂'};
  const labels = {cognitive:'Brain',eye:'Eyes',respiratory:'Breathing',stress:'Stress',
                  stability:'Balance',lifestyle:'Lifestyle',heart:'Heart',gut:'Gut',hearing:'Hearing'};

  /* Build score breakdown text */
  const breakdown = Object.entries(S)
    .filter(([k,v]) => v !== null && icons[k])
    .map(([k,v]) => `${icons[k]} ${labels[k]}: ${v}`)
    .join(' · ');

  const lbl = LAB.scoreLbl(overall);
  const url  = 'https://www.shahhayaat.com/wellness-lab.html';
  const text = `🏅 My Shah Hayaat Wellness Score: *${overall}/100* — ${lbl}\n\n${breakdown}\n\nTake your free wellness check: ${url}`;
  const encodedText = encodeURIComponent(text);

  trackWL('share_wellness_card', platform);

  if (platform === 'whatsapp') {
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
  } else if (platform === 'telegram') {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodedText}`, '_blank');
  } else if (platform === 'copy') {
    const plain = text.replace(/\*/g, '');
    navigator.clipboard.writeText(plain).then(() => {
      LAB.toast('Score copied to clipboard! 📋');
    }).catch(() => {
      prompt('Copy your wellness score:', plain);
    });
  }
};

LAB.sharePDFWhatsApp = function () {
  trackWL('whatsapp_click');
  const nameEl = document.getElementById('pdfNameInp');
  let name = (nameEl?.value || '').trim().replace(/[<>&"']/g, '');

  if (!name) {
    const entered = prompt('Enter your name to include on the PDF (or tap Cancel to skip):');
    if (entered === null) {

      name = '';
    } else {
      name = entered.trim();
      if (nameEl) nameEl.value = name;
    }
  }

  const S = LAB.scores;
  const domains = [S.cognitive, S.eye, S.respiratory, S.stress, S.stability, S.lifestyle];
  if (LAB.gender === 'female' && S.hormonal != null) domains.push(S.hormonal);
  const completed = domains.filter(x => x != null);
  const overall   = completed.length ? Math.round(LAB.avg(completed)) : null;
  const now       = new Date().toLocaleDateString('en-GB', {day:'numeric', month:'long', year:'numeric'});

  const scoreParts = [
    S.cognitive   != null && `Cognitive ${S.cognitive}`,
    S.eye         != null && `Eye ${S.eye}`,
    S.respiratory != null && `Respiratory ${S.respiratory}`,
    S.stress      != null && `Stress ${S.stress}`,
    S.stability   != null && `Stability ${S.stability}`,
    S.lifestyle   != null && `Lifestyle ${S.lifestyle}`,
    S.hormonal    != null && `Hormonal ${S.hormonal}`,
  ].filter(Boolean);

  let msg = 'Hi Shah Hayaat,\n\n';
  if (name) msg += `My name is ${name}.\n`;
  msg += `I completed the Shah Hayaat Wellness Lab on ${now} and am sharing my PDF report for a consultation.\n\n`;
  if (overall !== null) msg += `Overall score: ${overall}/100.\n`;
  if (scoreParts.length) msg += `Scores: ${scoreParts.join(', ')}.\n\n`;
  msg += 'Please find my full report attached. I would love your expert guidance on which products may help me.';

  const waUrl = 'https://wa.me/917051056287?text=' + encodeURIComponent(msg);

  // Open WA window IMMEDIATELY (in user gesture), then redirect after PDF downloads
  const waWin = window.open('', '_blank', 'noopener,noreferrer');
  LAB.generatePDF();
  setTimeout(function () {
    if (waWin && !waWin.closed) {
      waWin.location.href = waUrl;
    } else {
      // Fallback: direct location change (works on iOS Safari)
      window.location.href = waUrl;
    }
  }, 1200);
};

LAB.whatsappShare = LAB.sharePDFWhatsApp;

LAB._buildTips = function(overall) {
  const tips=[
    {icon:'💧',text:'<strong>Drink water first thing.</strong> Starting the day with 400–500ml of water rehydrates your brain after sleep and improves morning alertness.'},
    {icon:'🚶',text:'<strong>Walk after meals.</strong> A 10-minute walk after eating improves blood sugar regulation, digestion and afternoon energy — no gym required.'},
    {icon:'📵',text:'<strong>No screens 45 min before bed.</strong> Blue light delays melatonin release. This single habit measurably improves sleep depth over 2–3 weeks.'},
    {icon:'🌬',text:'<strong>Box breathing for stress.</strong> Inhale 4s · Hold 4s · Exhale 4s · Hold 4s. Two minutes of this activates the parasympathetic system immediately.'},
    {icon:'🥗',text:'<strong>Eat colourfully.</strong> The most practical nutrition advice: aim for 5–6 different colours of vegetables/fruits per day. Diversity beats quantity.'},
    {icon:'😴',text:'<strong>Consistent wake time.</strong> Waking at the same time every day (even weekends) is the fastest way to fix sleep quality — stronger effect than bedtime.'},
    {icon:'🧠',text:'<strong>Learn something new.</strong> Daily exposure to novel cognitive challenges — a language, an instrument, a puzzle type — builds cognitive reserve that protects brain health long-term.'},
  ];
  if(overall<55) tips.push({icon:'🩺',text:'<strong>Consider a health check-up.</strong> Several of your scores were below average. A general check-up with your doctor is a sensible next step.'});
  return tips.map(t=>`
    <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.72rem 0;border-bottom:1px solid var(--b)">
      <span style="font-size:1.05rem;flex-shrink:0;margin-top:.05rem">${t.icon}</span>
      <p style="font-size:.82rem;color:var(--tm);line-height:1.7;margin:0">${t.text}</p>
    </div>`).join('');
};

LAB.generatePDF = function () {
  trackWL('pdf_generated');
  const S=LAB.scores, R=LAB.raw, isFem=LAB.gender==='female';
  const mainScores=[S.cognitive,S.eye,S.respiratory,S.stress,S.stability,S.lifestyle,...(isFem&&S.hormonal?[S.hormonal]:[])].filter(x=>x!=null);
  const completedForPDF=mainScores.filter(x=>x!=null);
  const overall=completedForPDF.length?Math.round(LAB.avg(completedForPDF)):null;
  const now=new Date();
  const dateStr=now.toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});
  const recs=LAB._buildRecs();
  const _rawName = (document.getElementById('pdfNameInp')?.value||'').trim();
  /* Sanitize: escape HTML chars to prevent XSS in template literal */
  const userName = _rawName.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;').slice(0,60);
  LAB.raw.userAge = parseInt(document.getElementById('pdfAgeInp')?.value||'') || null;

  /* v2: Category-mode PDF title */
  const isCatMode = LAB.currentMode && LAB.currentMode !== 'full' && LAB.currentMode !== 'challenge';
  const pdfCat = isCatMode ? LAB.categories[LAB.currentMode] : null;
  const pdfTitle = pdfCat ? `${pdfCat.icon} ${pdfCat.name} Assessment Report` : 'Personal Wellness Intelligence Report';
  const pdfTestCount = pdfCat ? `${pdfCat.tests.length} Activities` : (isFem?'19':'16') + ' Activities Completed';

  const scoreRows=[
    ['🧠 Cognitive',   S.cognitive||'—'],
    ['👁 Eye Health',  S.eye||'—'],
    ['🌬 Respiratory', S.respiratory||'—'],
    ['🔥 Stress',      S.stress||'—'],
    ['📱 Stability',   S.stability||'—'],
    ['⚖ Lifestyle',   S.lifestyle||'—'],
    ...(isFem&&S.hormonal?[['🌸 Hormonal',S.hormonal]]:[] ),
    ...(S.heart   != null ? [['❤️ Heart & Pulse', S.heart]]   : []),
    ...(S.gut     != null ? [['🍽 Gut Health',    S.gut]]     : []),
    ...(S.hearing != null ? [['👂 Hearing',        S.hearing]] : []),
  ];

  const detailRows=[
    ['⚡ Reaction Speed',     R.rxAvg?R.rxAvg+'ms avg':'Skipped', R.rxScore],
    ['📉 Fatigue Drift',       R.ftDrift!==undefined?R.ftDrift+'ms drift':'Skipped', R.ftScore],
    ['🧩 Memory Span',         R.memSpan?R.memSpan+' items':'Skipped', R.memScore],
    ['👁 Attention',           R.attHits!==undefined?R.attHits+' hits':'Skipped', R.attScore],
    ['🎨 Colour Blindness',    R.cbCorrect!==undefined?R.cbCorrect+'/'+R.cbTotal:'Skipped', R.cbScore],
    ['🌬 Breath Sync',         'Completed', R.breathSyncScore],
    ['⏱ Breath Hold',          R.breathHold?R.breathHold+'s held':'Skipped', R.breathScore],
    ['♻ Recovery (HRV)',       R.recoveryBPM?R.recoveryBPM+' BPM':'Skipped', R.recoveryScore],
    ['🔥 Maths Challenge',     R.mathCorrect!==undefined?R.mathCorrect+'/20':'Skipped', R.mathScore],
    ['🔷 Pattern Search',      R.patternCorrect!==undefined?R.patternCorrect+'/8':'Skipped', R.patternScore],
    ['📱 Steady Hand',         'Completed', R.stabilityScore],
    ['✏ Tremor Drawing',       R.tremorDev!==undefined?R.tremorDev+'px deviation':'Skipped', R.tremorScore],
    ['💤 Sleep Quality',        R.sleepHours?R.sleepHours+'h':'Skipped', R.sleepScore],
    ['⚖ Lifestyle Score',      '6 dimensions', R.lifestyleScore],
    ...(isFem?[
      ['🌸 Hormonal Rhythm','Questionnaire',R.hormonalScore],
      ['⚡ Energy & Iron','Questionnaire',R.ironScore],
      ['🌙 Sleep & Comfort','Questionnaire',R.femCombinedScore],
    ]:[]),
    ...(R.heartBPM    != null ? [['❤️ Heart Rate',   R.heartBPM+'bpm (est.)',  R.heartScore]]  : []),
    ...(R.gutScore    != null ? [['🍽 Gut Health',    '5-question assessment',  R.gutScore]]    : []),
    ...(R.hearingHeard!= null ? [['👂 Hearing',        R.hearingHeard+'/4 tones', R.hearingScore]] : []),
  ];

  const barOf=(sc)=>{
    if(sc==null) return '<span style="color:#888;font-size:11px">Skipped</span>';
    const col=sc>=80?'#1A8C52':sc>=55?'#C97010':'#C0392B';
    return `<div style="display:flex;align-items:center;gap:6px">
      <div style="flex:1;height:8px;background:#E8F5EE;border-radius:4px;overflow:hidden">
        <div style="width:${sc}%;height:100%;background:${col};border-radius:4px"></div>
      </div>
      <span style="font-size:12px;font-weight:700;color:${col};min-width:28px;text-align:right">${sc}</span>
    </div>`;
  };

  const html=`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Shah Hayaat Wellness Report — ${dateStr}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Inter',sans-serif;background:#fff;color:#1C2E1C;line-height:1.7;font-size:14px;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  @page{size:A4;margin:16mm 14mm}
  @media print{.no-print{display:none!important}.page-break{page-break-before:always}}
  .no-print{position:fixed;bottom:20px;right:20px;display:flex;gap:10px;z-index:100}
  .pbtn{padding:10px 22px;border-radius:50px;font-weight:700;font-size:13px;cursor:pointer;border:none}
  .pbtn-p{background:#2A7A5A;color:#fff}
  .pbtn-g{background:#fff;border:2px solid #D4E8DC;color:#3A5A3A}

  .page{max-width:780px;margin:0 auto;padding:0 4px}

  .report-hdr{display:flex;align-items:center;justify-content:space-between;padding:18px 20px;
    background:linear-gradient(135deg,#1A4731,#2A7A5A);border-radius:12px;margin-bottom:22px;color:#fff}
  .hdr-logo{display:flex;align-items:center;gap:12px}
  .hdr-logo img{width:44px;height:44px;border-radius:50%;border:2px solid rgba(255,255,255,.3);object-fit:cover}
  .hdr-title{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;line-height:1.1}
  .hdr-sub{font-size:11px;opacity:.75;letter-spacing:.08em;text-transform:uppercase;margin-top:2px}
  .hdr-meta{text-align:right;font-size:11px;opacity:.8;line-height:1.8}

  .overall-row{display:flex;align-items:center;gap:20px;padding:18px 20px;
    background:#F3F7F3;border:1.5px solid #D4E8DC;border-radius:12px;margin-bottom:22px}
  .overall-num{font-family:'Playfair Display',serif;font-size:52px;font-weight:700;
    color:#2A7A5A;line-height:1;min-width:80px;text-align:center}
  .overall-info{flex:1}
  .overall-lbl{font-size:11px;font-family:'JetBrains Mono',monospace;text-transform:uppercase;
    letter-spacing:.1em;color:#6A8A6A;margin-bottom:4px}
  .overall-rating{font-size:18px;font-weight:700;color:#2A7A5A;margin-bottom:6px}
  .overall-sub{font-size:12px;color:#3A5A3A}

  .sec-hdr{font-family:'Playfair Display',serif;font-size:17px;font-weight:700;color:#1C2E1C;
    border-bottom:2.5px solid #2A7A5A;padding-bottom:6px;margin:22px 0 14px}

  .score-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:22px}
  .score-card{background:#fff;border:1.5px solid #D4E8DC;border-radius:10px;padding:14px;text-align:center;position:relative;overflow:hidden}
  .score-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:var(--c)}
  .sc-icon{font-size:20px;margin-bottom:6px}
  .sc-name{font-size:10px;font-family:'JetBrains Mono',monospace;text-transform:uppercase;
    letter-spacing:.08em;color:#6A8A6A;margin-bottom:4px}
  .sc-num{font-family:'Playfair Display',serif;font-size:28px;font-weight:700;color:var(--c);line-height:1}
  .sc-lbl{font-size:11px;font-weight:600;color:var(--c);margin-top:2px}

  .dtable{width:100%;border-collapse:collapse;font-size:12.5px;margin-bottom:22px}
  .dtable th{background:#F3F7F3;padding:8px 10px;text-align:left;font-size:11px;
    font-family:'JetBrains Mono',monospace;text-transform:uppercase;letter-spacing:.08em;color:#6A8A6A;
    border-bottom:2px solid #D4E8DC}
  .dtable td{padding:7px 10px;border-bottom:1px solid #E8F5EE;vertical-align:middle}
  .dtable tr:hover td{background:#FAFBF8}
  .tag-skip{background:#F5F5F5;color:#888;font-size:11px;padding:2px 8px;border-radius:50px}

  .rec-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:22px}
  .rec-card{background:#fff;border:1.5px solid #D4E8DC;border-radius:10px;overflow:hidden}
  .rec-top{height:4px}
  .rec-body{padding:11px 12px}
  .rec-title{font-weight:700;font-size:13px;margin-bottom:4px;color:#1C2E1C}
  .rec-text{font-size:11.5px;color:#3A5A3A;line-height:1.6;margin-bottom:7px}
  .rec-action{font-size:11px;font-weight:700;padding:3px 10px;border-radius:50px;display:inline-block}

  .tip-row{display:flex;gap:10px;padding:8px 0;border-bottom:1px solid #E8F5EE;font-size:12.5px;color:#3A5A3A;line-height:1.6}
  .tip-icon{font-size:14px;flex-shrink:0;margin-top:2px}

  .disc{background:#F3F7F3;border:1px solid #D4E8DC;border-radius:8px;padding:12px 14px;
    font-size:11px;color:#6A8A6A;line-height:1.75;margin-top:18px}
  .disc strong{color:#2A7A5A}

  .rpt-footer{display:flex;justify-content:space-between;align-items:center;margin-top:16px;
    padding-top:12px;border-top:1px solid #D4E8DC;font-size:10.5px;color:#6A8A6A}

/* ── Featured nav button (larger, 2-col) ────────────────────── */
.lab-nav-btn--featured {
  padding: 1rem 1.1rem;
  flex-direction: row;
  align-items: center;
  gap: .8rem;
  text-align: left;
}
.lab-nav-btn--featured .lnb-ico { font-size: 2rem; }
.lab-nav-btn--featured .lnb-name { font-size: .88rem; }
.lab-nav-btn--featured .lnb-sub { font-size: .67rem; }
</style>
</head>
<body>
<div class="no-print" style="display:flex;gap:8px;flex-wrap:wrap;bottom:16px;right:16px;position:fixed;z-index:100">
  <button class="pbtn pbtn-p" onclick="window.print()">🖨 Print / Save PDF</button>
  <button class="pbtn" style="background:#25D366;color:#fff" onclick="window.opener&&window.opener.LAB&&window.opener.LAB.sharePDFWhatsApp()">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="white" style="vertical-align:middle;margin-right:4px"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
    Share on WhatsApp
  </button>
  <button class="pbtn pbtn-g" onclick="window.close()">✕ Close</button>
</div>
<div class="page">

  <div class="report-hdr">
    <div class="hdr-logo">
      <img loading="lazy" src="https://cdn.jsdelivr.net/gh/yasirhashmi02-dev/Shahhayaat02@main/images/logo.jpg" alt="Shah Hayaat">
      <div>
        <div class="hdr-title">Shah Hayaat Wellness Lab</div>
        <div class="hdr-sub">${pdfTitle}</div>
      </div>
    </div>
    <div class="hdr-meta">
      <div>${dateStr}</div>
      <div>${pdfTestCount}</div>
      <div style="margin-top:4px;font-size:10px;opacity:.6">Private · Health results stay on your device. Analytics may be collected.</div>
    </div>
  </div>

  <div class="overall-row">
    <div class="overall-num">${overall}</div>
    <div class="overall-info">
      ${userName?`<div style="font-size:26px;font-family:'Playfair Display',serif;font-weight:700;color:#B8860B;letter-spacing:.03em;line-height:1.2;margin-bottom:6px;text-shadow:0 1px 3px rgba(184,134,11,.18)">${userName}</div>`:''}
      <div class="overall-lbl">Overall Wellness Score</div>
      <div class="overall-rating">${LAB.scoreLbl(overall)} — ${overall}/100</div>
      <div class="overall-sub">Combined from ${isFem?'7':'6'} health domains across ${isFem?'19':'16'} wellness activities.</div>
      <div style="margin-top:8px;height:10px;background:#D4E8DC;border-radius:5px;overflow:hidden">
        <div style="width:${overall}%;height:100%;background:${LAB.scoreCol(overall)};border-radius:5px"></div>
      </div>
      ${(()=>{
        const wa = LAB.calcWellnessAge(overall, LAB.raw.userAge||null);
        if (!wa) return '';
        return `<div style="margin-top:10px;padding:8px 12px;background:#fff;border:1.5px solid #D4E8DC;
                            border-radius:8px;display:flex;align-items:center;gap:10px">
          <span style="font-size:22px">${wa.icon}</span>
          <div>
            <div style="font-size:10px;text-transform:uppercase;letter-spacing:.1em;color:#6A8A6A;font-family:'JetBrains Mono',monospace">Wellness Age Indicator</div>
            <div style="font-size:14px;font-weight:700;color:${LAB.scoreCol(overall)}">${wa.label}${wa.wellness?' — Wellness Age: '+wa.wellness:''}</div>
            <div style="font-size:9.5px;color:#888;margin-top:1px">Performance indicator only — not a medical measurement</div>
          </div>
        </div>`;
      })()}
    </div>
  </div>

  <div class="sec-hdr">Health Domain Scores</div>
  <div class="score-grid">
    ${scoreRows.map(([name,sc])=>{
      const col=sc!=='—'?LAB.scoreCol(Number(sc)):'#888';
      return `<div class="score-card" style="--c:${col}">
        <div class="sc-name">${name}</div>
        <div class="sc-num">${sc}</div>
        <div class="sc-lbl">${sc!=='—'?LAB.scoreLbl(Number(sc)):'Skipped'}</div>
      </div>`;
    }).join('')}
  </div>

  ${(()=>{
    /* v2: Strongest Areas & Areas to Improve */
    const allDoms = [
      {k:'cognitive',  label:'🧠 Cognitive',   v:S.cognitive},
      {k:'eye',        label:'👁 Eye Health',   v:S.eye},
      {k:'respiratory',label:'🌬 Respiratory',  v:S.respiratory},
      {k:'stress',     label:'🔥 Stress',       v:S.stress},
      {k:'stability',  label:'📱 Stability',    v:S.stability},
      {k:'lifestyle',  label:'⚖ Lifestyle',    v:S.lifestyle},
      ...(isFem&&S.hormonal?[{k:'hormonal',label:'🌸 Hormonal',v:S.hormonal}]:[]),
    ].filter(d => d.v != null && d.v > 0).sort((a,b)=>b.v-a.v);
    if (allDoms.length < 2) return '';
    const strongest = allDoms.slice(0,2);
    const weakest   = allDoms.slice(-2).reverse();
    return `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px">
      <div>
        <div class="sec-hdr" style="margin-top:0">✨ Your Strongest Areas</div>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${strongest.map(d=>`
          <div style="background:#E8F5EE;border:1.5px solid #A8D5B8;border-radius:10px;padding:12px">
            <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#1A4731;margin-bottom:3px">${d.label}</div>
            <div style="font-size:26px;font-weight:800;color:#2A7A5A;line-height:1">${d.v}</div>
            <div style="font-size:11px;color:#2A7A5A">${LAB.scoreLbl(d.v)}</div>
          </div>`).join('')}
        </div>
      </div>
      <div>
        <div class="sec-hdr" style="margin-top:0">🎯 Areas to Improve</div>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${weakest.map(d=>`
          <div style="background:#FFF8ED;border:1.5px solid #F0C860;border-radius:10px;padding:12px">
            <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#8B4000;margin-bottom:3px">${d.label}</div>
            <div style="font-size:26px;font-weight:800;color:#C97010;line-height:1">${d.v}</div>
            <div style="font-size:10.5px;color:#5A3A00;margin-top:4px;line-height:1.5">${LAB._improvementTip(d.k)}</div>
          </div>`).join('')}
        </div>
      </div>
    </div>`;
  })()}

  <div class="sec-hdr">Activity Results</div>
  <table class="dtable">
    <thead><tr>
      <th>Activity</th><th>Result</th><th style="min-width:160px">Score</th>
    </tr></thead>
    <tbody>
      ${detailRows.map(([name,val,sc])=>`
        <tr>
          <td style="font-weight:500">${name}</td>
          <td style="color:#6A8A6A;font-size:12px">${val}</td>
          <td>${barOf(sc)}</td>
        </tr>`).join('')}
    </tbody>
  </table>

  ${(()=>{
    const f=[];
    if(R.cbFlag) f.push('🎨 Colour perception — consider a clinical eye test');
    if(R.acuityFlag) f.push('📏 Visual acuity — screen vision below typical threshold');
    if((S.respiratory||100)<45) f.push('🌬 Respiratory scores are low — speak to a doctor if you have breathing difficulties');
    if(!f.length) return '';
    return `<div style="background:#FFF8ED;border:1.5px solid rgba(201,120,0,.3);border-radius:10px;padding:12px 14px;margin-bottom:18px">
      <div style="font-weight:700;font-size:13px;color:#C97010;margin-bottom:8px">⚠ Items Worth Investigating</div>
      ${f.map(t=>`<div style="font-size:12.5px;color:#3A5A3A;padding:4px 0;border-bottom:1px solid rgba(201,120,0,.15)">${t}</div>`).join('')}
    </div>`;
  })()}

  <div class="page-break"></div>
  <div class="sec-hdr">Personalised Recommendations</div>
  <div class="rec-grid">
    ${recs.map(r=>`
      <div class="rec-card">
        <div class="rec-top" style="background:${r.col}"></div>
        <div class="rec-body">
          <div style="font-size:18px;margin-bottom:5px">${r.icon}</div>
          <div class="rec-title">${r.title}</div>
          <div class="rec-text">${r.body}</div>
          <div class="rec-action" style="background:${r.col}20;color:${r.col}">${r.action}</div>
        </div>
      </div>`).join('')}
  </div>

  <div class="sec-hdr">General Wellness Tips</div>
  ${LAB._buildTips(overall).replace(/<div style="display:flex.*?padding:.72rem 0;border-bottom:1px solid var\(--b\)">/g,
    '<div class="tip-row">').replace(/<span style="font-size:1\.05rem;flex-shrink:0;margin-top:\.05rem">/g,
    '<span class="tip-icon">').replace(/var\(--tm\)/g,'#3A5A3A').replace(/var\(--t\)/g,'#1C2E1C')}

  <div class="disc">
    <strong>Important Disclaimer:</strong> This report is a wellness indicator only and does not constitute medical advice or diagnosis.
    The activities measure performance proxies under screen-based conditions. Results can be affected by fatigue, stress, lighting, device type and many other factors.
    If any result concerns you, please consult a qualified healthcare professional.
    <strong>Health results stay on your device.</strong> All calculations run locally in your browser. This PDF was generated on your device. Anonymous usage analytics may be collected.
  </div>

  <div style="margin:22px 0">
    <div style="font-family:'Playfair Display',serif;font-size:17px;font-weight:700;color:#1C2E1C;border-bottom:2.5px solid #2A7A5A;padding-bottom:6px;margin-bottom:8px">🌿 Products Matched to Your Results</div>
    <p style="font-size:11px;color:#3A5A3A;margin-bottom:6px;line-height:1.6">Based on your scores, these Shah Hayaat Ayurvedic products may support your wellness goals. WHO-GMP · ISO 9001:2015 · HACCP Certified.</p>
    <div style="background:#FFF8ED;border:1px solid #D4A056;border-radius:6px;padding:8px 12px;margin-bottom:12px;font-size:10.5px;color:#7A4A10;line-height:1.6">
      ⚠️ <strong>Disclaimer:</strong> These are Ayurvedic supplements. They are not intended to diagnose, treat, cure or prevent any disease. Results may vary. Please consult a qualified healthcare professional before starting any supplement. Presented for informational purposes only.
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:10px">
      ${(()=>{
        const S=LAB.scores,R=LAB.raw,P=LAB.SH_PRODUCTS,isFem=LAB.gender==='female',isMale=LAB.gender==='male';
        const sel=[];
        if((S.cognitive??100)<75||(R.memSpan??9)<5||(R.rxAvg??0)>350) sel.push({...P.brainchamp,id:'brainchamp',reason:'Cognitive / memory support'});
        if((S.respiratory??100)<70||(R.breathHold??999)<25) sel.push({...P.coughxpro,id:'coughxpro',reason:'Respiratory support'});
        if((S.stress??100)<70||(R.sleepHours??8)<6) sel.push({...P.bloodstorm,id:'bloodstorm',reason:'Energy & stress support'});
        if((S.lifestyle??100)<65) sel.push({...P.livohayaat,id:'livohayaat',reason:'Liver & detox support'});
        if((S.stability??100)<65||(R.tremorDev??0)>30) sel.push({...P.orthohayaat,id:'orthohayaat',reason:'Joint & stability support'});
        if((S.eye??100)<70||R.cbFlag||R.acuityFlag) sel.push({...P.musaffakhoon,id:'musaffakhoon',reason:'Eye & blood health'});
        if(isFem&&(S.hormonal??100)<75) sel.push({...P.utrohayaat,id:'utrohayaat',reason:'Female hormonal support'});
        if(isMale&&(S.stress??100)<65) sel.push({...P.passionpulse,id:'passionpulse',reason:'Male vitality support'});
        if((S.heart??100)<75||(R.heartBPM??72)>90) sel.push({...P.bloodstorm,id:'bloodstorm',reason:'Heart rate & cardiovascular support'});
        if((S.gut??100)<65){ sel.push({...P.shahzyme,id:'shahzyme',reason:'Digestive enzyme support'}); sel.push({...P.livohayaat,id:'livohayaat',reason:'Digestive & gut health support'}); }
        if(Object.values(S).some(v=>v!=null&&v<60)) sel.push({...P.fevodol,id:'fevodol',reason:'Immunity support'});
        const seen=new Set(),unique=sel.filter(p=>{if(seen.has(p.id))return false;seen.add(p.id);return true;});
        if(!unique.length){unique.push({...P.brainchamp,id:'brainchamp',reason:'General wellness'});unique.push({...P.fevodol,id:'fevodol',reason:'Immunity support'});}
        return unique.slice(0,6).map(p=>`
        <div style="background:#fff;border:1.5px solid #D4E8DC;border-radius:10px;overflow:hidden;padding:12px">
          <div style="height:3px;background:${p.tagColor};border-radius:2px;margin-bottom:8px"></div>
          <div style="font-size:10px;font-weight:700;color:${p.tagColor};margin-bottom:4px">${p.tag}</div>
          <div style="font-size:13px;font-weight:700;color:#1C2E1C;margin-bottom:4px">${p.name}</div>
          <div style="font-size:11px;color:#3D3D3D;margin-bottom:4px;line-height:1.5">${p.desc}</div>
          ${p.ingredients ? `<div style="font-size:9.5px;color:#6A8A6A;margin-bottom:4px;line-height:1.5">🌿 ${p.ingredients}</div>` : ''}
          <div style="font-size:10px;color:#C97010;font-style:italic;margin-bottom:8px">💡 ${p.reason}</div>
          <div style="display:flex;align-items:center;justify-content:space-between">
            <span style="font-size:14px;font-weight:800;color:#2A7A5A">₹${p.price}</span>
            <span style="font-size:10px;color:#888">WhatsApp to order →</span>
          </div>
        </div>`).join('');
      })()}
    </div>
    <div style="text-align:center;margin-top:10px;padding:8px 14px;background:#F3F7F3;border-radius:8px;font-size:11px;color:#3A5A3A">
      📱 Order any product: WhatsApp <strong>+91 70510 56287</strong> or visit <strong>shahhayaat.com</strong>
    </div>
  </div>

  <div style="background:linear-gradient(135deg,#0d1f14,#1a3d2a);border-radius:10px;padding:16px 20px;margin:18px 0;text-align:center">
    <div style="font-size:13px;font-weight:700;color:#7ED4A8;letter-spacing:.08em;text-transform:uppercase;margin-bottom:5px">🌿 Join the Shah Hayaat Community</div>
    <div style="font-size:12px;color:rgba(255,255,255,.75);margin-bottom:10px">Get daily wellness tips, product updates &amp; connect with others on their health journey</div>
    <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
      <a href="https://whatsapp.com/channel/0029VadgJDiJUM2VitsAVR1u" style="display:inline-flex;align-items:center;gap:6px;padding:7px 16px;background:#25D366;color:#fff;border-radius:50px;font-size:12px;font-weight:700;text-decoration:none">💬 WhatsApp Channel</a>
      <a href="https://www.instagram.com/shahhayaatofficial" style="display:inline-flex;align-items:center;gap:6px;padding:7px 16px;background:linear-gradient(135deg,#f09433,#dc2743,#bc1888);color:#fff;border-radius:50px;font-size:12px;font-weight:700;text-decoration:none">📸 Instagram</a>
    </div>
  </div>

  <div class="rpt-footer">
    <span>Shah Hayaat Wellness Lab &nbsp;·&nbsp; shahhayaat.com</span>
    <span>Generated ${dateStr} &nbsp;·&nbsp; Confidential &nbsp;·&nbsp; For personal use only</span>
  </div>

</div>
</body>
</html>`;

  // Open report in a new tab and auto-trigger print → Save as PDF
  const win = window.open('', '_blank', 'width=900,height=700,noopener,noreferrer');
  if (!win) {
    // Popup blocked — fallback: blob download as HTML
    try {
      const blob = new Blob([html], {type:'text/html;charset=utf-8'});
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href = url; a.download = 'Shah-Hayaat-Wellness-Report.pdf';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(()=>URL.revokeObjectURL(url), 5000);
    } catch(e) { alert('Please allow pop-ups to download your report.'); }
    return;
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
  // Auto-print once fonts and images have loaded
  win.addEventListener('load', () => {
    setTimeout(() => {
      win.focus();
      win.print();
    }, 800);
  });
};

/* ══════════════════════════════════════════════════════════════════════
   NEW TEST MODULES — Phase 4
   ══════════════════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════════════
   mod_bodySymptoms — Body Vitality Check
   Measures: energy, joint comfort, immunity, skin & physical well-being
   Method: 6-domain interactive symptom map with animated body areas.
   Replaces unreliable tap-based heart rate test.
   ══════════════════════════════════════════════════════════════ */
window.mod_bodySymptoms = function () {
  'use strict';

  const domains = [
    {
      id:'energy', icon:'⚡', label:'Energy & Vitality',
      color:'#F0A020', bg:'#FFF8ED',
      questions:[
        { q:'How is your energy through the day?', opts:[['High & consistent',100],['Good in morning, drops by noon',70],['Low most of the day',40],['Exhausted most of the time',15]] },
        { q:'How quickly do you feel tired after normal activity?', opts:[['I rarely feel tired early',100],['After a few hours',72],['Within an hour',45],['Almost immediately',18]] },
      ]
    },
    {
      id:'joints', icon:'🦴', label:'Joints & Mobility',
      color:'#7C3AED', bg:'#F3EFFE',
      questions:[
        { q:'Do you experience joint stiffness in the morning?', opts:[['No stiffness at all',100],['Mild, clears in 10 min',78],['Moderate, takes 30+ min',48],['Severe, persists long',18]] },
        { q:'Do joints ache during or after movement?', opts:[['Never',100],['Occasionally',72],['Frequently',42],['Almost always',15]] },
      ]
    },
    {
      id:'immunity', icon:'🛡', label:'Immunity & Recovery',
      color:'#059669', bg:'#E8F5EE',
      questions:[
        { q:'How often do you fall ill (cold, flu, infections)?', opts:[['Rarely — once a year or less',100],['2–3 times a year',70],['Every few months',42],['Very often, monthly',15]] },
        { q:'How well do you recover from illness?', opts:[['Quickly — 2–3 days',100],['About a week',70],['Takes 2+ weeks',40],['I seem to stay unwell',15]] },
      ]
    },
    {
      id:'skin', icon:'✨', label:'Skin & Hair',
      color:'#E74C3C', bg:'#FEECEB',
      questions:[
        { q:'How is the general condition of your skin?', opts:[['Healthy, hydrated, even tone',100],['Occasional dryness or blemishes',70],['Often dry, dull or blotchy',42],['Persistent skin problems',15]] },
        { q:'How is your hair health?', opts:[['Thick, strong, minimal loss',100],['Some thinning or dryness',70],['Noticeable thinning / loss',42],['Significant loss or damage',15]] },
      ]
    },
    {
      id:'pain', icon:'🩹', label:'Pain & Discomfort',
      color:'#C0392B', bg:'#FFF0EF',
      questions:[
        { q:'Do you experience recurring headaches?', opts:[['Rarely or never',100],['Once a week',65],['Several times a week',35],['Almost daily',12]] },
        { q:'Do you have persistent body aches or muscle pain?', opts:[['No persistent pain',100],['Mild, occasional',70],['Moderate, frequent',40],['Severe or daily pain',12]] },
      ]
    },
    {
      id:'circulation', icon:'🩸', label:'Circulation & Warmth',
      color:'#E74C3C', bg:'#FEECEB',
      questions:[
        { q:'Do your hands or feet feel cold even in warm weather?', opts:[['Rarely',100],['Sometimes',68],['Often',38],['Almost always',12]] },
        { q:'Do you experience dizziness when standing up quickly?', opts:[['Never',100],['Occasionally',70],['Fairly often',42],['Very often',15]] },
      ]
    },
  ];

  let _di=0, _domScores={}, _qi=0;

  LAB.showDemo({
    title: '💪 Body Vitality Check',
    txt: 'A quick check across <strong>6 body systems</strong> — energy, joints, immunity, skin, pain and circulation. Each section takes under 30 seconds. Honest answers give the most useful score.',
    hint: '6 domains · 12 questions · ~2 minutes',
    voiceEN: 'Body Vitality check! We will look at six areas — energy, joints, immunity, skin, pain, and circulation. Tap your honest answer for each question.',
    btnLabel: 'Begin Body Check →',
    vis: `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;max-width:180px;margin:0 auto">
      ${[['⚡','#F0A020'],['🦴','#7C3AED'],['🛡','#059669'],['✨','#E74C3C'],['🩹','#C0392B'],['🩸','#E74C3C']].map(([ic,col])=>`
        <div style="aspect-ratio:1;background:${col}18;border:2px solid ${col}44;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.4rem">${ic}</div>`).join('')}
    </div>`,
    anim(vis) {
      const cells=vis.querySelectorAll('div>div'); let i=0;
      const id=setInterval(()=>{
        cells.forEach((c,j)=>{ c.style.transform=j===i?'scale(1.15)':'scale(1)'; c.style.opacity=j===i?'1':'.6'; });
        i=(i+1)%cells.length;
      },500);
      return id;
    }
  }, () => {
    _di=0; _domScores={}; _qi=0;
    _bsShowDomain();
  });

  function _bsShowDomain() {
    if(_di>=domains.length) { _bsFinish(); return; }
    const dom=domains[_di]; _qi=0;
    _bsShowQuestion(dom);
  }

  function _bsShowQuestion(dom) {
    if(_qi>=dom.questions.length) {
      // Score this domain
      const vals=dom.questions.map(q=>window['_bs_'+dom.id+'_'+q.q.slice(0,8).replace(/\W/g,'')]||50);
      _domScores[dom.id]=Math.round(vals.reduce((a,b)=>a+b,0)/vals.length);
      _di++; _bsShowDomain(); return;
    }
    const qObj=dom.questions[_qi];
    const total=domains.reduce((a,d)=>a+d.questions.length,0);
    const done=domains.slice(0,_di).reduce((a,d)=>a+d.questions.length,0)+_qi;

    LAB.render(`<div class="mwrap"><div class="card card--pop" style="border-color:${dom.color}44;background:linear-gradient(135deg,${dom.bg},#fff)">
      <div class="step-head">
        <div class="tag" style="background:${dom.color}18;border-color:${dom.color}44;color:${dom.color}">
          ${dom.icon} Body Lab · ${dom.label}
        </div>
        <!-- Overall progress -->
        <div style="margin:.75rem 0 .4rem;height:4px;background:var(--g3);border-radius:2px;overflow:hidden">
          <div style="height:100%;width:${Math.round((done/total)*100)}%;background:${dom.color};border-radius:2px;transition:width .5s"></div>
        </div>
        <div style="font-size:.6rem;color:var(--tq);text-align:right;font-family:'JetBrains Mono',monospace;margin-bottom:.5rem">${done+1} of ${total}</div>
        <h2 class="h2" style="margin-top:.5rem;margin-bottom:.2rem;font-size:1.1rem">${qObj.q}</h2>
      </div>
      <div style="display:grid;gap:.5rem;margin-top:.9rem">
        ${qObj.opts.map(([label,val],oi)=>`
          <button onclick="window._bsAnswer('${dom.id}','${qObj.q.slice(0,8).replace(/\W/g,'')}',${val},this)"
            style="text-align:left;padding:.78rem 1rem;border-radius:10px;
                   background:#fff;border:2px solid ${dom.color}33;
                   font-size:.88rem;color:var(--t);cursor:pointer;transition:all .18s;
                   display:flex;align-items:center;gap:.7rem;font-weight:500"
            onmouseenter="this.style.background='${dom.bg}';this.style.borderColor='${dom.color}'"
            onmouseleave="this.style.background='#fff';this.style.borderColor='${dom.color}33'">
            <div style="width:16px;height:16px;border-radius:50%;border:2px solid ${dom.color}55;flex-shrink:0;background:${dom.color}18" id="bsOpt${oi}"></div>
            ${label}
          </button>`).join('')}
      </div>
    </div></div>`);
    LAB.say(qObj.q);
  }

  window._bsAnswer = function(domId, qKey, val, btn) {
    // Animate selection
    btn.style.background=domains.find(d=>d.id===domId)?.bg||'#f0f0f0';
    btn.style.borderColor=domains.find(d=>d.id===domId)?.color||'#999';
    // Store answer
    window['_bs_'+domId+'_'+qKey]=val;
    setTimeout(()=>{
      _qi++;
      _bsShowQuestion(domains[_di]);
    }, 320);
  };

  function _bsFinish() {
    const vals=Object.values(_domScores);
    const overall=Math.round(vals.reduce((a,b)=>a+b,0)/vals.length);
    const sc=LAB.clamp(overall,10,100);
    LAB.raw.bodyVitality=sc;
    LAB.raw.bodyDomains=_domScores;
    LAB.scores.heart=sc; // uses heart scoreKey slot
    LAB.celebrate();
    const low=Object.entries(_domScores).sort((a,b)=>a[1]-b[1]).slice(0,2).map(([k])=>domains.find(d=>d.id===k)?.label).join(' & ');
    LAB.say(`Body check complete! Overall score ${sc} out of 100. Areas to watch: ${low}.`);

    // Show summary result card
    LAB.render(`<div class="mwrap"><div class="card card--pop">
      <div style="display:flex;align-items:center;gap:.75rem;margin-bottom:1.2rem">
        <span style="font-size:2rem">💪</span>
        <div>
          <div style="font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--tq)">Body Vitality Score</div>
          <div style="font-family:'Playfair Display',serif;font-size:2.2rem;font-weight:700;color:${LAB.scoreCol(sc)};line-height:1">${sc}<span style="font-size:1rem;color:var(--tq)">/100</span></div>
          <div style="font-size:.85rem;font-weight:700;color:${LAB.scoreCol(sc)}">${LAB.scoreLbl(sc)}</div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:.55rem;margin-bottom:1.2rem">
        ${Object.entries(_domScores).map(([id,v])=>{
          const dom=domains.find(d=>d.id===id);
          return `<div style="background:${dom.bg};border:1.5px solid ${dom.color}44;border-radius:10px;padding:.65rem .8rem">
            <div style="font-size:.6rem;text-transform:uppercase;letter-spacing:.08em;color:${dom.color};font-weight:700;margin-bottom:.2rem">${dom.icon} ${dom.label}</div>
            <div style="font-family:'JetBrains Mono',monospace;font-size:1.1rem;font-weight:700;color:${LAB.scoreCol(v)}">${v}</div>
            <div style="font-size:.62rem;color:var(--tq)">${LAB.scoreLbl(v)}</div>
          </div>`;
        }).join('')}
      </div>
      <button class="btn btn--p btn--full" onclick="LAB.idx++;LAB.next()">Continue →</button>
    </div></div>`);
    setTimeout(()=>{ LAB.idx++; LAB.next(); },8000);
  }
};

/* ── Gut Health Questionnaire ─────────────────────────────────────── */
window.mod_gutHealth = function () {
  const questions = [
    { q: 'How often do you experience bloating or gas after meals?',
      opts: ['Rarely or never', '1–2 times a week', 'Most days', 'Every day'] },
    { q: 'How would you describe your usual bowel pattern?',
      opts: ['Regular (daily, comfortable)', 'Slightly irregular', 'Often constipated', 'Often loose / urgent'] },
    { q: 'Do you experience stomach cramps or abdominal discomfort?',
      opts: ['Rarely', 'Occasionally', 'Often (3+ times/week)', 'Almost daily'] },
    { q: 'How is your appetite and ability to digest different foods?',
      opts: ['Good — most foods fine', 'Some foods cause issues', 'Many foods cause discomfort', 'Poor appetite or frequent nausea'] },
    { q: 'Do you notice changes in stool consistency, mucus or undigested food?',
      opts: ['Never', 'Occasionally', 'Often', 'Regularly'] },
  ];
  let answers = [];

  LAB.showDemo({
    title: '🍽 Gut Health Check',
    txt: '5 quick questions about your digestive comfort over the <strong>past month</strong>. No right or wrong answers — just pick what fits best.',
    hint: '5 questions · ~2 min · tap to answer',
    btnLabel: 'Begin Digestive Health Assessment →',
    voiceEN: 'Gut health check. Five quick questions about your digestion over the past month. Tap the answer that best describes you.',
  }, function () { renderQ(0); });

  function renderQ(i) {
    if (i >= questions.length) return _gutDone();
    const q = questions[i];

    /* Progress dots */
    const dots = questions.map((_, j) =>
      `<div style="width:${j === i ? 20 : 8}px;height:8px;border-radius:4px;
           background:${j < i ? '#2A7A5A' : j === i ? '#F39C12' : 'var(--b)'};
           transition:all .25s"></div>`).join('');

    LAB.render(`
    <div class="mwrap">
      <div class="card card--pop">

        <!-- Header -->
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem">
          <div class="cat-run-badge" style="background:#F39C1218;border:1px solid #F39C1244;color:#F39C12;margin:0">🍽 Gut Health</div>
          <div style="font-size:.7rem;color:var(--tq);font-family:'JetBrains Mono',monospace">${i + 1} / ${questions.length}</div>
        </div>

        <!-- Dot progress -->
        <div style="display:flex;gap:4px;align-items:center;margin-bottom:1.2rem">${dots}</div>

        <!-- Question -->
        <p style="font-size:.98rem;font-weight:600;color:var(--t);line-height:1.5;margin-bottom:1.1rem">${q.q}</p>

        <!-- Options — styled choice buttons -->
        <div style="display:flex;flex-direction:column;gap:.55rem">
          ${q.opts.map((opt, j) => `
          <button onclick="window._gutPick(${i},${j})"
            style="text-align:left;padding:.8rem 1rem;background:#fff;
                   border:1.5px solid var(--b);border-radius:10px;
                   font-size:.87rem;color:var(--t);cursor:pointer;line-height:1.4;
                   transition:.15s;display:flex;align-items:center;gap:.6rem"
            onmouseenter="this.style.borderColor='#F39C12';this.style.background='#FFFBF0'"
            onmouseleave="this.style.borderColor='var(--b)';this.style.background='#fff'">
            <span style="min-width:22px;height:22px;border-radius:50%;background:var(--bg-cream);
                         border:1.5px solid var(--b);display:flex;align-items:center;justify-content:center;
                         font-size:.65rem;font-weight:700;color:var(--tq);flex-shrink:0">${String.fromCharCode(65+j)}</span>
            ${opt}
          </button>`).join('')}
        </div>

        <div style="text-align:center;margin-top:.9rem">
          <button class="btn btn--g" style="font-size:.75rem" onclick="LAB.skip()">Skip test →</button>
        </div>
      </div>
    </div>`);
  }

  window._gutPick = function (qi, ai) {
    answers[qi] = ai;
    renderQ(qi + 1);
  };

  function _gutDone() {
    const total = answers.reduce((s, a) => s + a, 0);
    const max   = questions.length * 3;
    const sc    = Math.round(100 - (total / max) * 80);
    LAB.raw.gutScore = sc; LAB.scores.gut = sc; LAB.raw.gutAnswers = answers;

    const lbl = sc >= 80 ? '✅ Healthy gut indicators'
              : sc >= 60 ? 'Mild digestive concerns'
              : sc >= 40 ? 'Moderate digestive issues'
              : '⚠ Significant discomfort — consider consulting a doctor';
    const col = LAB.scoreCol(sc);
    LAB.celebrate();
    LAB.say(`Gut health complete. ${lbl}.`);

    /* Show result inline — no setTimeout wait before rendering */
    LAB.render(`
    <div class="mwrap">
      <div class="card card--pop" style="text-align:center">
        <div class="cat-run-badge" style="background:#F39C1218;border:1px solid #F39C1244;color:#F39C12;margin:0 auto .8rem">🍽 Gut Health Result</div>
        <div style="font-size:2.4rem;margin:.4rem 0 .2rem">🍽</div>
        <div style="font-family:'Playfair Display',serif;font-size:3rem;font-weight:700;color:#F39C12;line-height:1">${sc}</div>
        <div style="font-size:.68rem;font-family:'JetBrains Mono',monospace;text-transform:uppercase;letter-spacing:.12em;color:var(--tq);margin:.3rem 0 .5rem">Gut Health Score</div>
        <div style="font-size:.92rem;font-weight:700;color:${col};margin-bottom:1rem">${lbl}</div>

        <!-- Answer summary -->
        <div style="display:flex;flex-direction:column;gap:.35rem;margin-bottom:.8rem;text-align:left">
          ${questions.map((q, i) => `
          <div style="display:flex;gap:.5rem;padding:.45rem .6rem;background:var(--bg-cream);border-radius:8px;font-size:.74rem">
            <span style="color:var(--tq);flex-shrink:0">Q${i+1}</span>
            <span style="color:${answers[i]===0?'#2A7A5A':answers[i]>=2?'#C97010':'var(--t)'};font-weight:500">${q.opts[answers[i]]}</span>
          </div>`).join('')}
        </div>
        <p style="font-size:.7rem;color:var(--tq)">Self-reported · For wellness guidance only</p>
      </div>
    </div>`);

    setTimeout(() => { LAB.idx++; LAB.next(); }, 3500);
  }
};

/* ── Hearing Check ─────────────────────────────────────────────────── */
/* ══════════════════════════════════════════════════════════
   EYE STRAIN / SCREEN FATIGUE TEST
   Category: Eye Health · measures digital eye strain
   Phase 1: Near-far focus tracking (6 cycles)
   Phase 2: Blink resistance (hold gaze until blink)
   ══════════════════════════════════════════════════════════ */







window.mod_hearingCheck = function () {
  /*
   * Adaptive Threshold Hearing Test — v3
   * ─────────────────────────────────────
   * Method : Modified Hughson–Westlake (simplified):
   *   Heard  → volume −1 step  (harder)
   *   Missed → volume +1 step  (louder)
   *   Threshold = average volume of last 3 reversals
   *
   * Frequencies : 500 Hz, 1 kHz, 2 kHz, 4 kHz, 8 kHz  (both ears = 10 tests)
   * Audio       : ChannelMerger for hard L/R routing (fixes iOS mono bug)
   * Oscillator  : triangle wave (closer to real audiometer tones)
   * Max steps   : 12 per freq to keep test <5 min
   */

  /* 3 frequencies × 2 ears = 6 tests. Max 8 taps per freq → ~2 min total */
  const FREQS = [
    { hz: 1000, label: '1 kHz',  note: 'Speech range' },
    { hz: 3000, label: '3 kHz',  note: 'Clarity range' },
    { hz: 6000, label: '6 kHz',  note: 'High-freq — early decline indicator' },
  ];
  const EARS = [
    { id: 'left',  label: 'Left Ear',  ch: 0, color: '#8E44AD' },
    { id: 'right', label: 'Right Ear', ch: 1, color: '#2563EB' },
  ];

  /* Volume ladder: 0.04 – 0.58, 10 rungs (larger steps = faster convergence) */
  const STEPS = Array.from({length:10}, (_,i) => 0.04 + i*0.06);
  const START_STEP = 4;   /* start just below mid-range */
  const MAX_STEPS  = 8;   /* hard cap — each freq done in ≤8 taps */

  let _ctx = null;
  /* thresholds[earId][freqHz] = estimated volume (lower=better hearing) */
  let thresholds = { left: {}, right: {} };
  /* current state */
  let _curEar, _curFreqIdx, _curStepIdx, _reversals, _lastDir, _stepCount;
  let _headphoneOk = false;  /* set after headphone check passes */

  /* ── Audio context init (must be called from user gesture) ── */
  function _initCtx() {
    if (!_ctx) {
      _ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (_ctx.state === 'suspended') return _ctx.resume();
    return Promise.resolve();
  }

  /* ── Play tone through one channel only (ChannelMerger for reliability) ── */
  function _playTone(hz, earCh, volume, duration) {
    if (!_ctx) return;
    try {
      const osc    = _ctx.createOscillator();
      const gain   = _ctx.createGain();
      const merger = _ctx.createChannelMerger(2);

      osc.type = 'triangle';  /* more realistic than pure sine */
      osc.frequency.value = hz;

      gain.gain.setValueAtTime(0,        _ctx.currentTime);
      gain.gain.linearRampToValueAtTime(volume, _ctx.currentTime + 0.05);
      gain.gain.linearRampToValueAtTime(volume, _ctx.currentTime + duration - 0.1);
      gain.gain.linearRampToValueAtTime(0,       _ctx.currentTime + duration);

      /* Connect osc → gain → one channel of merger → destination */
      osc.connect(gain);
      gain.connect(merger, 0, earCh);  /* earCh: 0=left, 1=right */
      merger.connect(_ctx.destination);

      osc.start(_ctx.currentTime);
      osc.stop(_ctx.currentTime + duration + 0.05);
    } catch(e) { console.warn('Audio error:', e); }
  }

  /* ════════════════════════════════════════════════════════════
     DEMO → HEADPHONE CHECK → EAR INTRO → ADAPTIVE TEST → RESULTS
     ════════════════════════════════════════════════════════════ */

  LAB.showDemo({
    title: '👂 Hearing Check',
    txt: '<strong>Put on headphones or earbuds</strong> — this test measures hearing <em>sensitivity</em> in each ear across 5 frequencies. Tones get quieter when you hear them, louder when you miss, to find your personal threshold.',
    hint: '6 adaptive tones · both ears · ~2 min · headphones recommended',
    btnLabel: 'Begin Hearing Assessment →',
    voiceEN: 'Adaptive hearing test. Put on headphones. We will measure your hearing sensitivity in both ears across five frequencies. Tap yes or no for each tone.',
  }, function () {
    _initCtx().then(() => _headphoneCheck());
  });

  /* ── Step 0: Headphone check ── */
  function _headphoneCheck() {
    LAB.render(`
    <div class="mwrap"><div class="card card--pop" style="text-align:center;padding:2rem 1.5rem">
      <div class="cat-run-badge" style="background:#8E44AD18;border:1px solid #8E44AD44;color:#8E44AD;margin:0 auto .9rem">
        🎧 Headphone Check
      </div>
      <div style="font-size:3.5rem;margin:.5rem 0">🎧</div>
      <h2 class="h2" style="margin-bottom:.4rem">Check Stereo Routing</h2>
      <p class="pg" style="font-size:.85rem;margin-bottom:.5rem">
        You should hear a tone in your <strong>LEFT ear only</strong>.
      </p>
      <p style="font-size:.76rem;color:var(--tq);margin-bottom:1.4rem">
        If you hear it in both ears, please use earbuds or headphones.
      </p>
      <button class="btn btn--p" style="min-width:200px;margin-bottom:.8rem"
              onclick="window._htHpPlay()">🔊 Play Test Tone</button>
      <div id="_htHpBtns" style="display:none;display:flex;flex-direction:column;gap:.6rem;margin-top:.7rem">
        <button class="btn btn--p" style="background:#2A7A5A"
                onclick="window._htHpOk(true)">✅ I hear it in my left ear only</button>
        <button class="btn btn--g"
                onclick="window._htHpOk(false)">🔀 I hear it in both ears</button>
      </div>
      <div style="margin-top:1rem">
        <button class="btn btn--g" style="font-size:.74rem" onclick="LAB.skip()">Skip test →</button>
      </div>
    </div></div>`);

    /* Auto-play after 600ms so button renders first */
    setTimeout(() => { if (typeof window._htHpPlay === 'function') window._htHpPlay(); }, 600);
  }

  window._htHpPlay = function () {
    _initCtx().then(() => {
      _playTone(1000, 0, 0.35, 1.2);  /* ch 0 = left */
      const btns = document.getElementById('_htHpBtns');
      if (btns) { btns.style.display = 'flex'; btns.style.cssText += ';display:flex;flex-direction:column;gap:.6rem;margin-top:.7rem'; }
    });
  };

  window._htHpOk = function (isolated) {
    _headphoneOk = isolated;
    if (!isolated) {
      /* Warn but still continue — don't block the test */
      LAB.render(`
      <div class="mwrap"><div class="card card--pop" style="text-align:center;padding:2rem 1.5rem">
        <div style="font-size:3rem;margin-bottom:.8rem">⚠️</div>
        <h2 class="h2" style="margin-bottom:.4rem">Results May Vary</h2>
        <p class="pg" style="font-size:.85rem;margin-bottom:1.4rem">
          For best accuracy, use <strong>earbuds or headphones</strong>.<br>
          Without them, left/right isolation won't be reliable.
        </p>
        <div style="display:flex;gap:.6rem;justify-content:center;flex-wrap:wrap">
          <button class="btn btn--p" style="min-width:150px" onclick="window._htStartTest()">Continue Anyway →</button>
          <button class="btn btn--g" onclick="LAB.skip()">Skip test</button>
        </div>
      </div></div>`);
    } else {
      _htStartTest();
    }
  };

  window._htStartTest = function () {
    _curEar      = 'left';
    _curFreqIdx  = 0;
    _earIntroScreen('left');
  };

  /* ── Ear intro screens ── */
  function _earIntroScreen(earId) {
    const ear = EARS.find(e => e.id === earId);
    const isRight = earId === 'right';
    LAB.render(`
    <div class="mwrap"><div class="card card--pop" style="text-align:center;padding:2rem 1.5rem">
      <div class="cat-run-badge" style="background:${ear.color}18;border:1px solid ${ear.color}44;color:${ear.color};margin:0 auto .9rem">
        👂 Hearing · ${isRight ? 'Part 2 of 2' : 'Part 1 of 2'}
      </div>
      <div style="font-size:4rem;margin:.6rem 0">${isRight ? '🫱' : '🫲'}</div>
      <h2 class="h2" style="margin-bottom:.5rem">Testing ${ear.label}</h2>
      <p class="pg" style="font-size:.86rem;margin-bottom:.4rem">
        ${isRight
          ? 'Cover your <strong>left ear</strong>, or use only the <strong>right earbud</strong>.'
          : 'Cover your <strong>right ear</strong>, or use only the <strong>left earbud</strong>.'}
      </p>
      <p style="font-size:.76rem;color:var(--tq);margin-bottom:.8rem">
        Tones at <strong>5 frequencies</strong> will play. They'll get quieter when you hear them<br>
        and louder when you miss — to find your personal threshold.
      </p>
      <p style="font-size:.7rem;color:var(--tq);margin-bottom:1.6rem;padding:.5rem .8rem;background:var(--g3);border-radius:8px">
        💡 Tap <strong>Yes</strong> the <em>moment</em> you hear anything — even very faint
      </p>
      <button class="btn btn--p" style="min-width:210px;font-size:.92rem"
              onclick="window._htBeginEar('${earId}')">
        Ready — Start ${ear.label} →
      </button>
      ${isRight ? `<div style="margin-top:.8rem"><button class="btn btn--g" style="font-size:.76rem" onclick="LAB.skip()">Skip remaining →</button></div>` : ''}
    </div></div>`);
  }

  window._htBeginEar = function (earId) {
    _curEar     = earId;
    _curFreqIdx = 0;
    _startFreq();
  };

  /* ── Adaptive test per frequency ── */
  function _startFreq() {
    if (_curFreqIdx >= FREQS.length) {
      /* This ear done — switch or finish */
      if (_curEar === 'left') {
        _earIntroScreen('right');
      } else {
        _hearingDone();
      }
      return;
    }
    _curStepIdx = START_STEP;
    _reversals  = [];
    _lastDir    = null;
    _stepCount  = 0;
    _showToneScreen();
  }

  function _showToneScreen() {
    const ear  = EARS.find(e => e.id === _curEar);
    const freq = FREQS[_curFreqIdx];
    const vol  = STEPS[_curStepIdx];
    const totalFreqs = FREQS.length;
    const earFreqNum = _curFreqIdx + 1;

    /* Progress dots: 5 per ear, colour-coded */
    const dots = FREQS.map((_, j) => {
      const done = (thresholds[_curEar][FREQS[j].hz] !== undefined);
      const active = j === _curFreqIdx;
      const bg = done ? ear.color : active ? ear.color : 'var(--b)';
      return `<div style="width:${active?18:8}px;height:8px;border-radius:4px;background:${bg};
                          opacity:${done||active?1:.35};transition:all .25s"></div>`;
    }).join('');

    /* Volume visual — 5 bars showing relative loudness */
    const volPct = Math.round((vol / 0.60) * 100);
    const bars = Array.from({length:5}, (_,i) => {
      const thr = (i+1)*20;
      const lit  = volPct >= thr;
      return `<div style="width:10px;height:${10+i*6}px;border-radius:3px;
                           background:${lit ? ear.color : 'var(--b)'};opacity:${lit?.9:.3};
                           transition:all .3s"></div>`;
    }).join('');

    LAB.render(`
    <div class="mwrap"><div class="card card--pop">

      <!-- Header -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem">
        <div class="cat-run-badge" style="background:${ear.color}18;border:1px solid ${ear.color}44;color:${ear.color};margin:0">
          👂 ${ear.label} · ${earFreqNum}/${totalFreqs}
        </div>
        <div style="font-size:.66rem;color:var(--tq);font-family:'JetBrains Mono',monospace;text-align:right">
          Adaptive<br>threshold
        </div>
      </div>

      <!-- Freq progress dots -->
      <div style="display:flex;gap:4px;align-items:center;margin-bottom:1.2rem">${dots}</div>

      <!-- Tone visual -->
      <div style="text-align:center;margin-bottom:1.2rem">
        <div style="width:86px;height:86px;border-radius:50%;background:${ear.color}18;
                    border:2.5px solid ${ear.color}55;display:flex;align-items:center;
                    justify-content:center;margin:0 auto .8rem;animation:htRing 1s ease-in-out infinite">
          <span style="font-size:2.2rem">🔊</span>
        </div>
        <div style="font-family:'Playfair Display',serif;font-size:2.4rem;font-weight:700;
                    color:${ear.color};line-height:1">${freq.label}</div>
        <div style="font-size:.75rem;color:var(--tq);margin:.3rem 0 .6rem">${freq.note}</div>

        <!-- Volume bars (gives visual feedback on loudness) -->
        <div style="display:inline-flex;align-items:flex-end;gap:3px;padding:.4rem .8rem;
                    background:var(--bg-cream);border-radius:8px;border:1px solid var(--b)">
          ${bars}
          <span style="font-size:.6rem;color:var(--tq);font-family:'JetBrains Mono',monospace;
                       margin-left:.5rem;line-height:1;align-self:center">${volPct}%</span>
        </div>
        <div style="font-size:.66rem;color:var(--tq);margin-top:.35rem">Tone volume</div>
      </div>

      <!-- Answer buttons -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:.7rem;margin-bottom:.9rem">
        <button id="_htYes"
          onclick="window._htRespond(true)"
          style="padding:1.1rem .8rem;background:#2A7A5A;color:#fff;border:none;border-radius:12px;
                 font-size:.9rem;font-weight:700;cursor:pointer;box-shadow:0 4px 14px rgba(42,122,90,.28);
                 transition:.12s;-webkit-tap-highlight-color:transparent;min-height:52px"
          onmouseenter="this.style.transform='scale(1.03)'" onmouseleave="this.style.transform='scale(1)'"
          ontouchstart="this.style.transform='scale(.97)'" ontouchend="this.style.transform='scale(1)'">
          ✅ Yes, I heard it
        </button>
        <button id="_htNo"
          onclick="window._htRespond(false)"
          style="padding:1.1rem .8rem;background:var(--bg-cream);color:var(--t);
                 border:1.5px solid var(--b);border-radius:12px;
                 font-size:.9rem;font-weight:700;cursor:pointer;transition:.12s;
                 -webkit-tap-highlight-color:transparent;min-height:52px"
          onmouseenter="this.style.transform='scale(1.03)'" onmouseleave="this.style.transform='scale(1)'"
          ontouchstart="this.style.transform='scale(.97)'" ontouchend="this.style.transform='scale(1)'">
          ❌ No, I didn't
        </button>
      </div>

      <div style="text-align:center">
        <button class="btn btn--g" style="font-size:.74rem" onclick="LAB.skip()">Skip test →</button>
      </div>
    </div></div>`);

    /* Play tone after small render delay */
    setTimeout(() => {
      _initCtx().then(() => _playTone(freq.hz, ear.ch, vol, 0.9));
    }, 250);
  }

  window._htRespond = function (heard) {
    /* Flash feedback */
    const btn = document.getElementById(heard ? '_htYes' : '_htNo');
    if (btn) { btn.style.opacity = '.6'; setTimeout(() => btn && (btn.style.opacity = '1'), 120); }

    _stepCount++;
    const prevDir = _lastDir;

    if (heard) {
      /* Step down (quieter) */
      const dir = 'down';
      if (prevDir === 'up') _reversals.push(_curStepIdx);  /* reversal */
      _lastDir = dir;
      _curStepIdx = Math.max(0, _curStepIdx - 1);
    } else {
      /* Step up (louder) */
      const dir = 'up';
      if (prevDir === 'down') _reversals.push(_curStepIdx);  /* reversal */
      _lastDir = dir;
      _curStepIdx = Math.min(STEPS.length - 1, _curStepIdx + 3);  /* +3 up = quick recovery */
    }

    /* Threshold reached: 3+ reversals, or max steps exceeded */
    const converged = _reversals.length >= 2 || _stepCount >= MAX_STEPS;  /* 2 reversals = fast convergence */
    if (converged) {
      /* Threshold = mean of last 3 reversals (or all if fewer) */
      const revSlice = _reversals.slice(-3);
      const threshold = revSlice.length
        ? revSlice.reduce((s, r) => s + STEPS[r], 0) / revSlice.length
        : STEPS[_curStepIdx];
      thresholds[_curEar][FREQS[_curFreqIdx].hz] = threshold;
      _curFreqIdx++;
      /* Brief pause between frequencies */
      setTimeout(() => _startFreq(), 400);
    } else {
      /* Continue adaptive test — brief pause then play next tone */
      setTimeout(() => _showToneScreen(), 300);
    }
  };

  /* ── Results ── */
  function _hearingDone() {
    /* Convert threshold volumes to scores.
       Lower threshold volume = better hearing = higher score.
       Vol 0.02 (quietest heard) → ~100pts;  Vol 0.60 (loudest) → ~0pts */
    function volToScore(v) {
      return Math.round(Math.max(0, Math.min(100, 100 - (v / 0.60) * 100)));
    }

    const lData = thresholds.left;
    const rData = thresholds.right;

    /* Per-frequency scores (both ears averaged for each freq) */
    const freqScores = FREQS.map(f => {
      const l = lData[f.hz] != null ? volToScore(lData[f.hz]) : null;
      const r = rData[f.hz] != null ? volToScore(rData[f.hz]) : null;
      return { hz: f.hz, label: f.label, left: l, right: r };
    });

    const lScores = Object.values(lData).map(volToScore);
    const rScores = Object.values(rData).map(volToScore);
    const lSc  = lScores.length ? Math.round(lScores.reduce((a,b)=>a+b,0)/lScores.length) : null;
    const rSc  = rScores.length ? Math.round(rScores.reduce((a,b)=>a+b,0)/rScores.length) : null;
    const both = [lSc, rSc].filter(x => x != null);
    const sc   = both.length ? Math.round(both.reduce((a,b)=>a+b,0)/both.length) : 50;

    LAB.raw.hearingThresholds     = thresholds;
    LAB.raw.hearingLeftScore      = lSc;
    LAB.raw.hearingRightScore     = rSc;
    LAB.raw.hearingScore          = sc;
    LAB.raw.hearingHeadphoneCheck = _headphoneOk;
    LAB.scores.hearing            = sc;

    const diff = lSc != null && rSc != null ? Math.abs(lSc - rSc) : 0;
    const asymNote = diff > 20
      ? `<div style="background:#FFF3CD;border:1px solid #F39C1266;border-radius:8px;
                     padding:.55rem .8rem;font-size:.76rem;color:#856404;margin:.7rem 0 0">
           ⚠ Noticeable difference between ears (${diff} pts) — consider an audiologist check
         </div>` : '';

    const lbl = sc >= 85 ? '✅ Excellent sensitivity across both ears'
              : sc >= 70 ? 'Good — minor sensitivity gaps detected'
              : sc >= 50 ? 'Moderate — some frequency reduction'
              : '⚠ Low sensitivity — recommend a professional hearing test';

    LAB.celebrate();
    LAB.say(`Adaptive hearing complete. Left ear ${lSc ?? '—'}, right ear ${rSc ?? '—'} out of 100. ${lbl}.`);

    /* ── Audiogram canvas rendering ── */
    const audiogramId = '_htAudiogram';

    LAB.render(`
    <div class="mwrap"><div class="card card--pop">
      <div class="cat-run-badge" style="background:#8E44AD18;border:1px solid #8E44AD44;color:#8E44AD;margin:0 0 1rem">
        👂 Adaptive Hearing Results
      </div>

      <!-- Score summary -->
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:.6rem;margin-bottom:1.1rem;text-align:center">
        <div style="background:var(--bg-cream);border:1.5px solid #8E44AD33;border-radius:10px;padding:.75rem .5rem">
          <div style="font-size:.58rem;text-transform:uppercase;letter-spacing:.08em;color:#8E44AD;font-weight:700;margin-bottom:.25rem">👂 Left</div>
          <div style="font-family:'Playfair Display',serif;font-size:1.7rem;font-weight:700;color:${lSc?LAB.scoreCol(lSc):'var(--tq)'};line-height:1">${lSc??'—'}</div>
          <div style="height:4px;background:var(--b);border-radius:2px;margin-top:.4rem;overflow:hidden">
            <div style="height:100%;width:${lSc??0}%;background:#8E44AD;transition:width 1s ease"></div>
          </div>
        </div>
        <div style="background:#fff;border:2px solid var(--b);border-radius:10px;padding:.75rem .5rem">
          <div style="font-size:.58rem;text-transform:uppercase;letter-spacing:.08em;color:var(--tq);font-weight:700;margin-bottom:.25rem">Overall</div>
          <div style="font-family:'Playfair Display',serif;font-size:1.7rem;font-weight:700;color:${LAB.scoreCol(sc)};line-height:1">${sc}</div>
          <div style="font-size:.65rem;font-weight:700;color:${LAB.scoreCol(sc)};margin-top:.2rem">${LAB.scoreLbl(sc)}</div>
        </div>
        <div style="background:var(--bg-cream);border:1.5px solid #2563EB33;border-radius:10px;padding:.75rem .5rem">
          <div style="font-size:.58rem;text-transform:uppercase;letter-spacing:.08em;color:#2563EB;font-weight:700;margin-bottom:.25rem">👂 Right</div>
          <div style="font-family:'Playfair Display',serif;font-size:1.7rem;font-weight:700;color:${rSc?LAB.scoreCol(rSc):'var(--tq)'};line-height:1">${rSc??'—'}</div>
          <div style="height:4px;background:var(--b);border-radius:2px;margin-top:.4rem;overflow:hidden">
            <div style="height:100%;width:${rSc??0}%;background:#2563EB;transition:width 1s ease"></div>
          </div>
        </div>
      </div>

      <div style="font-size:.85rem;font-weight:700;color:${LAB.scoreCol(sc)};margin-bottom:.7rem;text-align:center">${lbl}</div>

      <!-- Mini audiogram -->
      <div style="background:var(--bg-cream);border:1px solid var(--b);border-radius:10px;padding:.9rem .8rem;margin-bottom:.8rem">
        <div style="font-size:.65rem;font-family:'JetBrains Mono',monospace;text-transform:uppercase;letter-spacing:.08em;color:var(--tq);margin-bottom:.6rem">
          Audiogram · Sensitivity by Frequency
        </div>
        <canvas id="${audiogramId}" width="300" height="130" style="width:100%;max-width:320px;display:block;margin:0 auto"></canvas>
        <div style="display:flex;align-items:center;gap:.8rem;margin-top:.5rem;justify-content:center">
          <div style="display:flex;align-items:center;gap:.3rem;font-size:.65rem;color:var(--tq)">
            <div style="width:14px;height:2px;background:#8E44AD;border-radius:1px"></div>Left
          </div>
          <div style="display:flex;align-items:center;gap:.3rem;font-size:.65rem;color:var(--tq)">
            <div style="width:14px;height:2px;background:#2563EB;border-radius:1px;border-style:dashed"></div>Right
          </div>
        </div>
      </div>

      ${asymNote}

      ${!_headphoneOk ? `<div style="font-size:.7rem;color:#856404;background:#FFF3CD;border-radius:6px;padding:.4rem .7rem;margin-top:.5rem">
        ℹ️ Test run without isolated earbuds — left/right accuracy may be reduced
      </div>` : ''}
      <p style="font-size:.68rem;color:var(--tq);text-align:center;margin-top:.7rem">
        Adaptive threshold estimate · Not a clinical audiogram · Consult an audiologist for medical assessment
      </p>
    </div></div>`);

    /* Draw audiogram after render */
    setTimeout(() => _drawAudiogram(audiogramId, freqScores), 100);
    setTimeout(() => { LAB.idx++; LAB.next(); }, 5000);
  }

  /* ── Audiogram canvas ── */
  function _drawAudiogram(canvasId, freqScores) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx2 = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const PAD = { top: 14, right: 16, bottom: 28, left: 32 };
    const gW = W - PAD.left - PAD.right;
    const gH = H - PAD.top  - PAD.bottom;

    ctx2.clearRect(0, 0, W, H);

    /* Grid lines + Y labels */
    ctx2.font = '9px JetBrains Mono, monospace';
    ctx2.fillStyle = '#9AA89A';
    ctx2.strokeStyle = '#E4EAE4';
    ctx2.lineWidth = 0.8;
    [0, 25, 50, 75, 100].forEach(v => {
      const y = PAD.top + gH - (v / 100) * gH;
      ctx2.beginPath(); ctx2.moveTo(PAD.left, y); ctx2.lineTo(PAD.left + gW, y); ctx2.stroke();
      ctx2.fillText(v, 2, y + 3);
    });

    /* X labels */
    const xs = freqScores.map((f, i) => PAD.left + (i / (freqScores.length - 1)) * gW);
    freqScores.forEach((f, i) => {
      ctx2.fillStyle = '#9AA89A';
      const lbl = f.hz >= 1000 ? (f.hz/1000) + 'k' : f.hz + '';
      ctx2.fillText(lbl, xs[i] - 5, H - 6);
    });

    /* Draw lines */
    const drawLine = (scores, color, dashed) => {
      const pts = freqScores.map((f, i) => ({ x: xs[i], y: PAD.top + gH - ((scores[i] ?? 0) / 100) * gH, v: scores[i] }));
      const valid = pts.filter(p => p.v != null);
      if (valid.length < 2) return;
      ctx2.save();
      ctx2.strokeStyle = color;
      ctx2.lineWidth = 2;
      ctx2.lineCap = 'round';
      ctx2.lineJoin = 'round';
      if (dashed) ctx2.setLineDash([4, 4]);
      ctx2.beginPath();
      valid.forEach((p, i) => i === 0 ? ctx2.moveTo(p.x, p.y) : ctx2.lineTo(p.x, p.y));
      ctx2.stroke();
      /* Dots */
      if (dashed) ctx2.setLineDash([]);
      valid.forEach(p => {
        ctx2.beginPath();
        ctx2.arc(p.x, p.y, 3.5, 0, Math.PI*2);
        ctx2.fillStyle = color;
        ctx2.fill();
      });
      ctx2.restore();
    };

    drawLine(freqScores.map(f => f.left),  '#8E44AD', false);
    drawLine(freqScores.map(f => f.right), '#2563EB', true);
  }
};

/* ── v2: Update _domainLabel and _domainIcon for new domains ────── */
LAB._domainLabel = function(k) {
  return {cognitive:'Cognitive',eye:'Eye Health',respiratory:'Respiratory',
          stress:'Stress',stability:'Stability',lifestyle:'Lifestyle',
          hormonal:'Hormonal',heart:'Heart & Pulse',gut:'Gut Health',
          hearing:'Hearing'}[k] || k;
};
LAB._domainIcon = function(k) {
  return {cognitive:'🧠',eye:'👁',respiratory:'🌬',stress:'🔥',
          stability:'📱',lifestyle:'⚖',hormonal:'🌸',
          heart:'❤️',gut:'🍽',hearing:'👂'}[k] || '●';
};
LAB._improvementTip = function(k) {
  return ({
    cognitive:   'Try daily brain puzzles, protect sleep quality, stay well hydrated and limit long screen sessions.',
    eye:         'Follow the 20-20-20 rule (every 20 min look 20 ft away for 20 s), reduce glare and get a clinical eye check.',
    respiratory: 'Practice box breathing (4-4-4-4) for 5 min daily, try pranayama, avoid smoke and strong air pollutants.',
    stress:      'Short daily meditation, journaling, and limiting caffeine after noon can meaningfully reduce stress scores.',
    stability:   'Yoga balance poses, grip-strength exercises and a magnesium-rich diet support steadiness.',
    lifestyle:   'Consistent sleep/wake times, 7–9 hours per night and limiting meals within 2 hours of bedtime.',
    hormonal:    'Track cycle patterns, ensure adequate iron and vitamin D intake, and consult a gynaecologist for persistent symptoms.',
    heart:       'Regular aerobic exercise 3-4x weekly, reduce salt intake, manage stress levels and avoid smoking.',
    gut:         'Increase dietary fibre, probiotics (yoghurt, fermented foods), stay hydrated and reduce processed foods.',
    hearing:     'Protect ears from loud noise, limit headphone volume, and book an audiologist check if concern persists.'
  })[k] || 'Focus on rest, hydration and consistent daily routines.';
};

/* ── v2: Add new domains to PDF scoreRows ─────────────────────────── */
/* (handled dynamically in generatePDF via the domain loop below) */

/* ── v2: Leaderboard (consent-based) ──────────────────────────────── */
LAB.offerLeaderboard = async function(testId, score, unit) {
  /* Show consent dialog */
  const agreed = await new Promise(resolve => {
    const overlay = document.createElement('div');
    overlay.style.cssText = `position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:10000;
      display:flex;align-items:center;justify-content:center;padding:1rem`;
    overlay.innerHTML = `
      <div style="background:#fff;border-radius:var(--r);padding:1.8rem 1.6rem;max-width:340px;width:100%;
                  box-shadow:0 12px 40px rgba(0,0,0,.2);text-align:center">
        <div style="font-size:2rem;margin-bottom:.5rem">🏅</div>
        <h3 style="font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:700;
                   color:var(--t);margin-bottom:.5rem">Add to Leaderboard?</h3>
        <p style="font-size:.82rem;color:var(--tm);line-height:1.6;margin-bottom:.3rem">
          Your score: <strong>${score}${unit}</strong>
        </p>
        <p style="font-size:.75rem;color:var(--tq);margin-bottom:1.3rem;line-height:1.55">
          Only your score and timestamp will be stored publicly. No name, no device ID, no health data.
        </p>
        <div style="display:flex;gap:.6rem;justify-content:center">
          <button style="padding:.6rem 1.2rem;background:var(--ok);color:#fff;border:none;
                         border-radius:50px;font-weight:700;font-size:.85rem;cursor:pointer"
                  id="_lbYes">Yes, share my score</button>
          <button style="padding:.6rem 1.1rem;background:var(--bg);color:var(--tm);border:1.5px solid var(--b);
                         border-radius:50px;font-size:.85rem;cursor:pointer"
                  id="_lbNo">No thanks</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    document.getElementById('_lbYes').onclick = () => { document.body.removeChild(overlay); resolve(true); };
    document.getElementById('_lbNo').onclick  = () => { document.body.removeChild(overlay); resolve(false); };
  });

  if (!agreed) return;

  try {
    if (typeof window.storage !== 'undefined') {
      await window.storage.set(
        'lb:' + testId + ':' + Date.now(),
        JSON.stringify({ score, unit, ts: Date.now() }),
        true /* shared */
      );
      LAB.toast('Score added to leaderboard! 🏅');
    } else {
      /* storage API not available (GitHub Pages — not in artifact context) */
      LAB.toast('Leaderboard available when running as an embedded app.');
    }
  } catch(e) {
    LAB.toast('Could not save score — leaderboard unavailable right now.');
  }
  trackWL('leaderboard_entry', testId);
};

/* Show leaderboard for a test */
LAB.showLeaderboard = async function(testId, unit) {
  let entries = [];
  try {
    if (typeof window.storage !== 'undefined') {
      const keys = await window.storage.list('lb:' + testId + ':', true);
      for (const key of (keys.keys || [])) {
        try {
          const r = await window.storage.get(key, true);
          if (r) entries.push(JSON.parse(r.value));
        } catch(e) {}
      }
    }
  } catch(e) {}

  const lowerBetter = (unit === 'ms');
  entries.sort((a, b) => lowerBetter ? a.score - b.score : b.score - a.score);
  const top10 = entries.slice(0, 10);

  const html = top10.length === 0
    ? '<p style="text-align:center;color:var(--tq);padding:1rem">No scores yet — be the first!</p>'
    : `<div style="display:flex;flex-direction:column;gap:.5rem">
        ${top10.map((e, i) => `
          <div style="display:flex;align-items:center;gap:.75rem;padding:.7rem .9rem;
                      background:${i===0?'var(--g3)':'var(--bg)'};border-radius:var(--rs);
                      border:1px solid ${i===0?'rgba(42,122,90,.2)':'var(--b)'}">
            <span style="font-size:1.1rem;min-width:1.6rem">${['🥇','🥈','🥉'][i]||`${i+1}.`}</span>
            <span style="flex:1;font-weight:${i<3?'700':'400'};font-size:.88rem;color:var(--t)">${e.score}${e.unit}</span>
            <span style="font-size:.7rem;color:var(--tq)">${new Date(e.ts).toLocaleDateString('en-GB',{day:'numeric',month:'short'})}</span>
          </div>`).join('')}
       </div>`;

  LAB.render(`
  <div class="mwrap">
    <div class="card card--pop">
      <h2 class="h2" style="margin-bottom:1rem">🏅 Top Scores</h2>
      ${html}
      <div class="btn-row" style="justify-content:center;margin-top:1.2rem">
        <button class="btn btn--p" onclick="LAB.idx++;LAB.next()">Continue →</button>
      </div>
    </div>
  </div>`);
};


(function initPage() {
  const params = new URLSearchParams(window.location.search);
  const challengeTest  = params.get('challenge');
  const challengeScore = params.get('score');
  const challengeUnit  = params.get('unit') || 'pts';

  /* Check for resumable session (only when not a challenge URL) */
  if (!challengeTest) {
    /* Small delay so DOM is ready */
    setTimeout(() => { LAB._checkResume(); LAB._checkStreak(); }, 400);
  }

  if (challengeTest && challengeScore) {
    /* Store challenge target on LAB */
    LAB._challengeTarget = {
      test:  challengeTest,
      score: Number(challengeScore),
      unit:  challengeUnit
    };

    /* Override beginModules so it runs only the one challenge test */
    LAB._origBeginModules = LAB.beginModules.bind(LAB);
    LAB.beginModules = function() {
      if (!this.gender) return;
      this.currentMode = 'challenge';
      this.queue = [this._challengeTarget.test];
      this.idx   = 0;
      this.show('sModules');
      this.next();
    };

    /* Override renderCategoryDashboard to skip straight to gender */
    LAB.renderCategoryDashboard = function() {
      this.beginModules();
    };

    /* Override next() completion to show challenge result */
    const _origNext = LAB.next.bind(LAB);
    LAB.next = function() {
      if (this.idx >= this.queue.length && this.currentMode === 'challenge') {
        /* Pick the right raw score for this test */
        const rawMap = {
          mod_reactionSpeed:    LAB.raw.rxAvg,
          mod_co2Tolerance:     LAB.raw.breathHold,
        };
        const myScore = rawMap[this._challengeTarget.test] ?? 0;
        LAB.showChallengeResult(this._challengeTarget.test, myScore);
        return;
      }
      _origNext();
    };

    /* Skip welcome — jump straight to instructions with challenge context */
    const testLabel = {
      mod_reactionSpeed:    'Reaction Speed',
      mod_workingMemory:    'Memory Test',
      mod_co2Tolerance:     'Breath Hold',
      mod_cogUnderPressure: 'Maths Challenge'
    }[challengeTest] || 'Wellness Test';

    LAB.goInstr = (function(_orig) {
      return function() {
        _orig.call(LAB);
        /* Inject challenge banner into the instructions card */
        setTimeout(() => {
          const card = document.querySelector('#sInstr .card');
          if (!card) return;
          const banner = document.createElement('div');
          banner.style.cssText = 'background:var(--g3);border:1.5px solid rgba(42,122,90,.22);border-radius:var(--rs);padding:.85rem 1rem;margin-bottom:1rem;font-size:.83rem;color:var(--t);';
          banner.innerHTML = `<strong>🏆 Challenge Mode!</strong><br>Your friend scored <strong>${challengeScore}${challengeUnit}</strong> on the <strong>${testLabel}</strong>. Beat them!`;
          card.prepend(banner);
        }, 100);
      };
    })(LAB.goInstr.bind(LAB));
  }
})();

/* ── Back-button intercept ──────────────────────────────────────── */
(function() {
  /* Push a state so the back button fires popstate instead of navigating */
  history.pushState({ lab: true }, '');
  window.addEventListener('popstate', function(e) {
    const mod = document.getElementById('sModules');
    if (mod && mod.style.display === 'block') {
      /* Re-push state so back stays catchable next time */
      history.pushState({ lab: true }, '');
      LAB._confirmExit(null);
    }
    /* If not in active test — let normal nav happen */
  });
})();

/* ── Progress History Panel ───────────────────────────────────── */
(function initProgressHistory() {
  try {
    const panel = document.getElementById('labHistoryPanel');
    if (!panel) return;

    const historyItems = [
      { key: 'wl_hist_reaction_speed',  label: 'Reaction Speed',  unit: 'ms',   lowerBetter: true  },
      { key: 'wl_hist_spatial_memory',  label: 'Spatial Memory',  unit: 'pts',  lowerBetter: false },
      { key: 'wl_hist_memory_score',    label: 'Memory Score',    unit: '%',    lowerBetter: false },
      { key: 'wl_hist_typing_wpm',      label: 'Typing Speed',    unit: ' WPM', lowerBetter: false },
      { key: 'wl_hist_hand_speed',      label: 'Hand Speed',      unit: ' taps',lowerBetter: false },
      { key: 'wl_hist_energy_score',    label: 'Energy Score',    unit: '%',    lowerBetter: false },
      { key: 'wl_hist_breath_hold',     label: 'Breath Hold',     unit: 's',    lowerBetter: false },
    ];

    const found = [];
    historyItems.forEach(item => {
      try {
        const raw = localStorage.getItem(item.key);
        if (!raw) return;
        const data = JSON.parse(raw);
        if (data && data.last) found.push({ ...item, last: data.last.val, best: data.best });
      } catch(e) {}
    });

    if (found.length === 0) return; // no history yet — hide panel

    panel.style.display = 'block';
    panel.innerHTML = `
      <div style="padding:1.1rem 0;border-top:1px solid var(--b)">
        <div style="font-size:.63rem;font-weight:700;color:var(--tq);text-transform:uppercase;letter-spacing:.09em;margin-bottom:.75rem">📈 Your Lab History</div>
        <div style="display:flex;flex-wrap:wrap;gap:.6rem">
          ${found.map(item => {
            const isBest = item.lowerBetter ? item.last <= item.best : item.last >= item.best;
            return `<div style="background:#fff;border:1.5px solid ${isBest?'rgba(42,122,90,.3)':'var(--b)'};border-radius:var(--rs);padding:.6rem .95rem;min-width:110px">
              <div style="font-size:.58rem;color:var(--tq);text-transform:uppercase;letter-spacing:.08em;margin-bottom:.25rem">${item.label}</div>
              <div style="font-family:'JetBrains Mono',monospace;font-size:.95rem;font-weight:700;color:var(--g)">Today: ${item.last}${item.unit}</div>
              <div style="font-size:.62rem;color:var(--tq);margin-top:.1rem">Best: <strong>${item.best}${item.unit}</strong>${isBest?' 🏆':''}</div>
            </div>`;
          }).join('')}
        </div>
      </div>`;
  } catch(e) {}
})();

/* ── Wellness Insight of the Day ──────────────────────────────── */
(function initInsightOfDay() {
  const insights = [
    { text: 'Reaction speed often improves when sleep quality and breathing patterns are balanced together.', tag: 'Brain & Sleep' },
    { text: 'Just 5 minutes of slow, deep breathing can reduce stress hormone levels noticeably.', tag: 'Breathing & Stress' },
    { text: 'Short memory exercises done daily — like the memory match test — strengthen focus over time.', tag: 'Brain Health' },
    { text: 'Your eyes need regular breaks. Every 20 minutes, look at something 20 feet away for 20 seconds.', tag: 'Eye Health' },
    { text: 'Energy levels naturally peak twice a day — mid-morning and early afternoon. Use those windows for deep work.', tag: 'Energy Patterns' },
    { text: 'Consistent sleep and wake times are more important than total hours for mental sharpness.', tag: 'Sleep Quality' },
    { text: 'Hydration affects brain performance directly. Even mild dehydration can slow reaction times.', tag: 'Hydration & Brain' },
    { text: 'Your nervous system can be trained to calm faster. Breathing balance exercises are the simplest way.', tag: 'Stress Recovery' },
    { text: 'Herbs like Brahmi and Shankhpushpi have been traditionally used to support memory and mental clarity.', tag: 'Herbal Wisdom' },
    { text: 'Morning sunlight within 30 minutes of waking helps regulate your energy and sleep cycle naturally.', tag: 'Circadian Rhythm' },
    { text: 'Hand tremors are normal — but tracking them weekly can reveal important patterns about rest quality.', tag: 'Motor Stability' },
    { text: 'Your body\'s stress response can be voluntarily slowed through extended exhale breathing.', tag: 'Calm Practice' },
  ];
  const el = document.getElementById('iodText');
  const src = document.getElementById('iodSource');
  if (!el) return;
  /* Pick by day of year so it rotates daily */
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(),0,0)) / 86400000);
  const pick = insights[dayOfYear % insights.length];
  el.textContent = pick.text;
  if (src) src.textContent = '— Topic: ' + pick.tag;
})();

/* ── Lab nav buttons — route to specific category after gender ── */
(function() {
  const btn = document.getElementById('startBrainBtn');
  if (btn) {
    btn.onclick = function() {
      LAB._pendingCat = 'brain';
      LAB.goInstr();
    };
  }

  /* Universal: intercept renderCategoryDashboard once to route to _pendingCat */
  const _origRCD = LAB.renderCategoryDashboard.bind(LAB);
  LAB.renderCategoryDashboard = function() {
    if (this._pendingCat) {
      const cat = this._pendingCat;
      this._pendingCat = null;
      LAB.renderCategoryDashboard = _origRCD;
      this.beginCategory(cat);
    } else {
      _origRCD();
    }
  };
})();

/* ── Lab Progress History on Welcome ─────────────────────────── */
(function initLabHistory() {
  try {
    const history_data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('wl_hist_')) {
        try { history_data[key.replace('wl_hist_','')] = JSON.parse(localStorage.getItem(key)); } catch(e) {}
      }
    }
    /* Will be populated after tests complete — show nothing on first visit */
  } catch(e) {}
})();

/* ── Save lab score to history ───────────────────────────────── */
LAB._saveToHistory = function(label, value, unit) {
  try {
    const key = 'wl_hist_' + label.toLowerCase().replace(/\s+/g,'_');
    const existing = JSON.parse(localStorage.getItem(key) || '{}');
    const today = { val: value, ts: Date.now() };
    if (!existing.best || (unit === 'ms' ? value < existing.best : value > existing.best)) {
      existing.best = value;
    }
    existing.last = today;
    localStorage.setItem(key, JSON.stringify(existing));
  } catch(e) {}
};

/* ── Footer year ───────────────────────────────────────────────── */
(function(){var el=document.getElementById('labYear');if(el)el.textContent=new Date().getFullYear();})();

/* ── Confetti burst on full-lab completion ───────────────────── */
LAB._fireConfetti = function() {
  const colors = ['#2A7A5A','#38A87A','#C97800','#F0A020','#2563EB','#8B5CF6'];
  for (let i = 0; i < 60; i++) {
    const el = document.createElement('div');
    const size = 7 + Math.random() * 8;
    el.style.cssText = `
      position:fixed;top:-12px;
      left:${Math.random() * 100}vw;
      width:${size}px;height:${size * (Math.random() > .5 ? 1 : 2.5)}px;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      border-radius:${Math.random() > .5 ? '50%' : '2px'};
      opacity:.9;z-index:9999;pointer-events:none;
      animation:confettiFall ${1.3 + Math.random() * 1.5}s ease-in ${Math.random() * .6}s both`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3500);
  }
};

