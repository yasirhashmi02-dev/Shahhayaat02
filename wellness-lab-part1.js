'use strict';

/* ── Central scoring weights configuration ──────────────────────────
   Base weights sum to exactly 1.0 (8 core domains).
   Hormonal is NOT listed here — it is injected dynamically for
   female users and the full set is re-normalised at runtime.
   Adjust weights here without touching any test code. */

/* ── Product URL slug map ─────────────────────────────────────────── */
const SH_PRODUCT_SLUGS = {
  brainchamp:   'brain-champ-ayurvedic-memory-booster.html',
  livohayaat:   'livo-hayaat-ayurvedic-liver-detox.html',
  orthohayaat:  'ortho-hayaat-ayurvedic-joint-pain-relief.html',
  diaease:      'dia-ease-ayurvedic-blood-sugar-control.html',
  shahzyme:     'shah-zyme-ayurvedic-digestive-syrup.html',
  bloodstorm:   'blood-storm-ayurvedic-iron-tonic.html',
  fevodol:      'fevodol-ayurvedic-immunity-booster-giloy-tulsi.html',
  panasip:      'panasip-ayurvedic-acidity-heartburn-relief.html',
  coughxpro:    'cough-x-pro-ayurvedic-herbal-cough-syrup.html',
  musaffakhoon: 'musaffa-khoon-ayurvedic-blood-purifier.html',
  utrohayaat:   'utro-hayaat-ayurvedic-womens-health.html',
  passionpulse: 'passion-pulse-ayurvedic-male-vitality.html',
};
function shProductUrl(id){ return SH_PRODUCT_SLUGS[id] || (id+'.html'); }

const CATEGORY_WEIGHTS = {
  cognitive:   0.25,  /* brain — highest weight */
  eye:         0.16,
  respiratory: 0.15,
  stress:      0.10,
  stability:   0.10,
  lifestyle:   0.14,
  heart:       0.07,
  gut:         0.07,
  hearing:     0.06,
  /* hormonal: injected at 0.10 for female users, then full set re-normalised */
};

const LAB = {

  gender: '',
  lang: 'en',
  voiceOn: true,
  idx: 0,
  queue: [],
  scores: { cognitive:null, eye:null, respiratory:null, stress:null, stability:null, lifestyle:null, hormonal:null, heart:null, gut:null, hearing:null, energy:null },
  raw: {},
  _cogTimeline: [],   // [{label, score}] recorded per brain test for stamina chart
  _demoCB: null,
  _demoAnim: null,

  el: id => document.getElementById(id),
  qs: sel => document.querySelector(sel),

  avg(a){ return a.length ? a.reduce((s,v)=>s+v,0)/a.length : 0; },
  clamp(v,a,b){ return Math.max(a,Math.min(b,v)); },
  sd(a){ const m=this.avg(a); return Math.sqrt(this.avg(a.map(x=>(x-m)**2))); },
  scoreCol(s){ return s>=80?'#1A8C52':s>=55?'#C97010':'#C0392B'; },
  scoreLbl(s){ return s>=80?'Excellent':s>=65?'Good':s>=50?'Fair':s>=35?'Needs Attention':'Low'; },

  _secs: ['sWelcome','sInstr','sGender','sCategory','sModules'],

  show(id) {
    this._secs.forEach(s => {
      const e = this.el(s);
      if (!e) return;
      if (s === 'sModules') { e.style.display = s===id ? 'block' : 'none'; }
      else { e.style.display = s===id ? '' : 'none'; }
    });
    this.el('progBar').style.display = id==='sModules' ? 'block' : 'none';
    window.scrollTo({top:0, behavior:'smooth'});
  },

  /* ── v2: Exit confirmation ─────────────────────────────────────── */
  _confirmExit(e) {
    /* Only intercept when a test session is active */
    const activeSection = this.el('sModules');
    if (!activeSection || activeSection.style.display !== 'block') return true; /* allow normal nav */
    if (e) e.preventDefault();
    /* Show confirm modal */
    const existing = this.el('_exitModal');
    if (existing) return false;
    const m = document.createElement('div');
    m.id = '_exitModal';
    m.style.cssText = 'position:fixed;inset:0;z-index:9900;background:rgba(10,18,20,.62);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:1rem';
    m.innerHTML = `
      <div style="background:#fff;border-radius:var(--r);padding:2rem 1.8rem;max-width:320px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,.28);text-align:center">
        <div style="font-size:2.2rem;margin-bottom:.8rem">🚪</div>
        <h3 style="font-family:'Playfair Display',serif;font-size:1.15rem;margin-bottom:.5rem">Exit Assessment?</h3>
        <p style="font-size:.84rem;color:var(--tq);margin-bottom:1.4rem;line-height:1.5">Your progress will be saved for the PDF, but the current activity will end.</p>
        <div style="display:flex;gap:.7rem;justify-content:center">
          <button class="btn btn--g" style="flex:1" onclick="document.getElementById('_exitModal').remove()">Keep Going</button>
          <button class="btn btn--p" style="flex:1;background:#E74C3C;border-color:#E74C3C" onclick="document.getElementById('_exitModal').remove();window.location.href='index.html'">Exit</button>
        </div>
      </div>`;
    document.body.appendChild(m);
    m.addEventListener('click', ev => { if (ev.target === m) m.remove(); });
    return false;
  },

  goWelcome() {
    /* Clear progress on explicit "new assessment" navigation */
    try { localStorage.removeItem('wl_progress'); } catch(e){}
    this.show('sWelcome');
    this.setStatus('idle','Ready');
    this.say(
      'Welcome to Shah Hayaat Wellness Lab. Press Start My Wellness Check to begin.',
      'شاہ حیات ویلنس لیب میں خوش آمدید۔',
      'शाह हयात वेलनेस लैब में आपका स्वागत है।'
    );
  },

  /* ── v2: Check for a resumable session ──────────────────────── */
  _checkResume() {
    try {
      const raw = localStorage.getItem('wl_progress');
      if (!raw) return;
      const saved = JSON.parse(raw);
      /* Only offer resume if saved within the last 2 hours */
      if (!saved || (Date.now() - saved.ts) > 7200000) { localStorage.removeItem('wl_progress'); return; }
      const catName = saved.mode === 'full'
        ? 'Full Wellness Lab'
        : (this.categories[saved.mode]?.name || saved.mode);
      /* Show resume banner on welcome screen */
      const hero = document.querySelector('#sWelcome .hero');
      if (!hero) return;
      const existing = document.getElementById('_resumeBanner');
      if (existing) existing.remove();
      const banner = document.createElement('div');
      banner.id = '_resumeBanner';
      banner.style.cssText = 'background:#fff;border:1.5px solid rgba(42,122,90,.25);border-radius:var(--r);padding:.85rem 1.1rem;margin-top:1rem;display:flex;align-items:center;justify-content:space-between;gap:.75rem;flex-wrap:wrap;animation:popIn .3s var(--ease) both';
      banner.innerHTML = `
        <div style="display:flex;align-items:center;gap:.6rem">
          <span style="font-size:1.3rem">▶</span>
          <div>
            <div style="font-size:.82rem;font-weight:700;color:var(--t)">Resume: ${catName}</div>
            <div style="font-size:.68rem;color:var(--tq)">Started recently — continue where you left off?</div>
          </div>
        </div>
        <div style="display:flex;gap:.5rem">
          <button class="btn btn--p" style="font-size:.78rem;padding:.45rem 1rem;min-height:36px"
                  onclick="LAB._resumeSession('${saved.mode}','${saved.gender}')">Resume →</button>
          <button class="btn btn--g" style="font-size:.78rem;padding:.45rem .8rem;min-height:36px"
                  onclick="document.getElementById('_resumeBanner').remove();localStorage.removeItem('wl_progress')">Dismiss</button>
        </div>`;
      hero.appendChild(banner);
    } catch(e) {}
  },

  /* ── Daily Reset streak banner ──────────────────────────────── */
  _checkStreak() {
    try {
      const streakRaw = localStorage.getItem('wl_streak');
      if (!streakRaw) return;
      const streakData = JSON.parse(streakRaw);
      if (!streakData || !streakData.lastDate) return;

      const today     = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();

      /* Only show if they completed yesterday or earlier (returning user) */
      if (streakData.lastDate === today) return; /* already done today */

      const isStreak = streakData.lastDate === yesterday;
      const hero = document.querySelector('#sWelcome .hero');
      if (!hero) return;

      const existing = document.getElementById('_streakBanner');
      if (existing) existing.remove();

      const streakCount = streakData.count || 1;
      const msg = isStreak
        ? `Your streak continues: <strong>${streakCount} day${streakCount > 1 ? 's' : ''}</strong> 🔥 — Try today\'s assessments to keep it going.`
        : 'Welcome back! Begin today\'s Wellness Lab to track your improvement.';

      const banner = document.createElement('div');
      banner.id = '_streakBanner';
      banner.style.cssText = 'background:linear-gradient(135deg,#EAF7EE,#F5FEF7);border:1.5px solid rgba(42,122,90,.22);border-radius:var(--r);padding:.85rem 1.1rem;margin-top:1rem;display:flex;align-items:center;justify-content:space-between;gap:.75rem;flex-wrap:wrap;animation:popIn .3s var(--ease) both';
      banner.innerHTML = `
        <div style="display:flex;align-items:center;gap:.65rem">
          <span style="font-size:1.5rem">${isStreak ? '🔥' : '👋'}</span>
          <div>
            <div style="font-size:.82rem;font-weight:700;color:var(--t)">Welcome back!</div>
            <div style="font-size:.72rem;color:var(--tm);line-height:1.5">${msg}</div>
          </div>
        </div>
        <button class="btn btn--p" style="font-size:.78rem;padding:.45rem 1rem;min-height:36px;white-space:nowrap"
                onclick="LAB.goInstr()">Begin Today →</button>`;
      hero.appendChild(banner);
    } catch(e) {}
  },

  _resumeSession(mode, gender) {
    try { localStorage.removeItem('wl_progress'); } catch(e){}
    /* Restore gender and route to the saved mode */
    this.gender = gender || 'male';
    if (mode === 'full') {
      this.beginModules();
    } else if (this.categories[mode]) {
      this.beginCategory(mode);
    }
  },

  goInstr() {
    trackWL('wellness_start');
    this.show('sInstr');
    this.setStatus('idle','Setup');
    this.say("Welcome! I'll guide you through everything. It's really simple — just watch each demo and follow the signals. Let's go!");
  },

  goGender() {
    this.show('sGender');
    this.setStatus('idle','Setup');
    this.say('Almost there! Just tap Male or Female — and your wellness check will begin right away.');
  },

  setGender(g) {
    this.gender = g;
    /* Show/hide female nav row on welcome screen */
    const femRow = document.getElementById('femaleNavRow');
    const femLbl = document.getElementById('femaleNavLabel');
    if (femRow) { femRow.style.display = g === 'female' ? 'grid' : 'none'; }
    if (femLbl) { femLbl.style.display = g === 'female' ? 'flex' : 'none'; }
    ['M','F'].forEach(x => {
      const c = this.el('g'+x);
      if (!c) return;
      const match = (x==='M' && g==='male') || (x==='F' && g==='female');
      c.classList.toggle('sel', match);
      c.setAttribute('aria-checked', String(match));
    });
    const fn = this.el('femNote');
    if (fn) fn.classList.toggle('show', g==='female');
    const gc = this.el('goCont');
    if (gc) gc.disabled = false;
    this.say(
      g==='female' ? "Perfect! Starting your personalised check now — you've got this!" : "Great! Starting your check right now — you've got this!",
      g==='female' ? 'خاتون منتخب کی گئی۔' : 'مرد منتخب کیا گیا۔',
      g==='female' ? 'महिला चुना गया।' : 'पुरुष चुना गया।'
    );
  },

  /* ── v2: Category registry ─────────────────────────────────────────── */
  categories: {
    brain: {
      id:'brain', name:'Brain & Cognitive', icon:'🧠', color:'#2A7A5A',
      tests:['mod_reactionSpeed','mod_spatialMemory','mod_stroopTest','mod_goNoGo','mod_digitSpan','mod_trailMaking'],
      scoreKey:'cognitive', time:'~6 min', desc:'Reaction speed, memory, focus and processing speed'
    },

    eye: {
      id:'eye', name:'Eye Health', icon:'👁', color:'#2563EB',
      tests:['mod_colourBlindness','mod_peripheralVision'],
      scoreKey:'eye', time:'~2 min', desc:'Colour perception and peripheral vision (screening only)'
    },
    breathing: {
      id:'breathing', name:'Breathing & Lungs', icon:'🌬', color:'#059669',
      tests:['mod_breathSync'],
      scoreKey:'respiratory', time:'~1 min', desc:'Guided breathing and calm'
    },
    stability: {
      id:'stability', name:'Motor Stability', icon:'📱', color:'#7C3AED',
      tests:['mod_stabilityHold','mod_oneLegStand'],
      scoreKey:'stability', time:'~2 min', desc:'Hand steadiness and one-leg balance'
    },
    lifestyle: {
      id:'lifestyle', name:'Lifestyle & Recovery', icon:'🌿', color:'#C0392B',
      tests:['mod_sleepEfficiency','mod_lifestyleLoad','mod_hydration'],
      scoreKey:'lifestyle', time:'~3 min', desc:'Sleep quality, daily habits and hydration'
    },
    body: {
      id:'body', name:'Body Vitality', icon:'💪', color:'#E74C3C',
      tests:['mod_bodySymptoms'],
      scoreKey:'heart', time:'~2 min', desc:'Energy, joints, immunity and body systems check'
    },
    gut: {
      id:'gut', name:'Gut Health', icon:'🍽', color:'#F39C12',
      tests:['mod_gutHealth'],
      scoreKey:'gut', time:'~2 min', desc:'Digestive comfort, bloating and bowel health patterns'
    },
    hearing: {
      id:'hearing', name:'Hearing Check', icon:'👂', color:'#8E44AD',
      tests:['mod_hearingCheck'],
      scoreKey:'hearing', time:'~2 min', desc:'High-frequency tone detection — best with headphones'
    },
    female: {
      id:'female', name:"Women's Health", icon:'🌸', color:'#B83060',
      tests:['mod_hormonalRhythm','mod_energyIron','mod_femCombined'],
      scoreKey:'hormonal', time:'~5 min', desc:'Hormonal rhythm, energy & iron, and sleep comfort — female-specific checks'
    }
  },

  currentMode: 'full',   /* 'full' | category id | 'challenge' */

  /* ── v2: Render category dashboard ────────────────────────────────── */
  /* ── v2: "Add More Tests" picker after single-category completion ─ */
  _showAddMoreTests() {
    const done = Object.keys(this.categories).filter(k => this.scores[this.categories[k].scoreKey] != null);
    const available = Object.values(this.categories).filter(c => !done.includes(c.id));
    if (!available.length) {
      /* All categories done — show dashboard */
      this.currentMode = 'full';
      this.showDashboard();
      return;
    }
    const existing = document.getElementById('_addMoreModal');
    if (existing) existing.remove();
    const m = document.createElement('div');
    m.id = '_addMoreModal';
    m.style.cssText = 'position:fixed;inset:0;z-index:9800;background:rgba(10,18,20,.62);backdrop-filter:blur(4px);display:flex;align-items:flex-end;justify-content:center;padding:0';
    m.innerHTML = `
      <div style="background:#fff;border-radius:var(--r) var(--r) 0 0;padding:1.6rem 1.4rem 2rem;max-width:480px;width:100%;box-shadow:0 -12px 40px rgba(0,0,0,.18);animation:popIn .3s var(--ease) both">
        <div style="text-align:center;margin-bottom:1.2rem">
          <div style="width:36px;height:4px;background:var(--b);border-radius:2px;margin:0 auto .9rem"></div>
          <h3 style="font-family:'Playfair Display',serif;font-size:1.1rem;margin-bottom:.3rem">Add More Tests</h3>
          <p style="font-size:.78rem;color:var(--tq)">Pick a category to continue — your previous scores are saved.</p>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:.55rem;margin-bottom:1rem">
          ${available.map(c => `
          <button onclick="document.getElementById('_addMoreModal').remove();LAB.beginCategory('${c.id}')"
                  style="display:flex;align-items:center;gap:.55rem;padding:.7rem .85rem;background:#fff;
                         border:1.5px solid ${c.color}44;border-radius:var(--rs);cursor:pointer;
                         font-size:.82rem;font-weight:600;color:var(--t);text-align:left;transition:.18s"
                  onmouseenter="this.style.background='${c.color}0D';this.style.borderColor='${c.color}'"
                  onmouseleave="this.style.background='#fff';this.style.borderColor='${c.color}44'">
            <span style="font-size:1.2rem">${c.icon}</span>
            <span style="line-height:1.3">${c.name}<br><span style="font-size:.68rem;font-weight:400;color:var(--tq)">${c.time}</span></span>
          </button>`).join('')}
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem">
          <button class="btn btn--p" style="font-size:.82rem" onclick="document.getElementById('_addMoreModal').remove();LAB.showDashboard()">
            📊 See My Results
          </button>
          <button class="btn btn--o" style="font-size:.82rem;color:var(--g)" onclick="document.getElementById('_addMoreModal').remove();LAB.beginModules()">
            ▶ Full Lab
          </button>
        </div>
      </div>`;
    document.body.appendChild(m);
    m.addEventListener('click', ev => { if (ev.target === m) m.remove(); });
  },

  renderCategoryDashboard() {
    if (!this.gender) return;
    trackWL('category_dashboard_view');

    const grid = this.el('catGrid');
    if (grid) {
      grid.innerHTML = Object.values(this.categories)
        .filter(cat => cat.id !== 'female' || this.gender === 'female')
        .map(cat => {
        const isDone = this.scores[cat.scoreKey] != null;
        const sc     = isDone ? this.scores[cat.scoreKey] : null;
        const scCol  = sc != null ? LAB.scoreCol(sc) : cat.color;
        return `
        <button class="cat-card au" style="--cat-col:${isDone ? scCol : cat.color};position:relative"
                onclick="LAB.beginCategory('${cat.id}')"
                aria-label="${isDone ? 'Retake' : 'Start'} ${cat.name} assessment, ${cat.tests.length} tests, ${cat.time}">
          ${isDone ? `<div style="position:absolute;top:.6rem;right:.7rem;background:${scCol}18;
                           border:1px solid ${scCol}44;border-radius:50px;padding:.15rem .5rem;
                           font-size:.6rem;font-family:'JetBrains Mono',monospace;color:${scCol};
                           letter-spacing:.04em;display:flex;align-items:center;gap:.25rem">
                        ✓ Done · <strong>${sc}</strong>
                      </div>` : ''}
          <span class="cat-icon">${cat.icon}</span>
          <div class="cat-name">${cat.name} Lab</div>
          <div class="cat-meta">${cat.tests.length} checks &nbsp;·&nbsp; ${cat.time}${isDone ? ' &nbsp;·&nbsp; <span style="color:'+scCol+'">Retake →</span>' : ''}</div>
          <div class="cat-desc">${cat.desc}</div>
          ${!isDone ? '<span class="cat-arrow">→</span>' : ''}
        </button>`;
      }).join('');
    }

    this.show('sCategory');
    this.setStatus('idle','Choose Assessment');
    this.say(`Choose an area to check, or run the full wellness lab for a complete picture.`);
  },

  /* ── v2: Start a specific category ────────────────────────────────── */
  beginCategory(categoryId) {
    const cat = this.categories[categoryId];
    if (!cat || !this.gender) return;
    trackWL('category_start', cat.name);
    this.currentMode = categoryId;
    this.queue = [...cat.tests];
    this.idx = 0;
    /* Reset only this category's scores so partial re-runs are clean */
    this.scores[cat.scoreKey] = null;
    /* Save minimal progress state (no health scores) */
    try { localStorage.setItem('wl_progress', JSON.stringify({mode:categoryId, gender:this.gender, ts:Date.now()})); } catch(e){}
    this.show('sModules');
    this.say(`Starting ${cat.name}. ${cat.tests.length} checks. ${cat.time}.`);
    this.next();
  },

  /* ── v2: Full lab (enhanced — now driven from category registry) ─── */
  beginModules() {
    if (!this.gender) return;
    trackWL('full_lab_start');
    this.currentMode = 'full';
    /* Build queue from registry to keep it in sync automatically */
    /* Deduplicate so shared tests only run once */
    const _seen = new Set();
    this.queue = Object.values(this.categories)
      .filter(cat => cat.id !== 'female' || this.gender === 'female')
      .flatMap(c => (c.tests || []).filter(Boolean))
      .filter(m => { if (_seen.has(m)) return false; _seen.add(m); return true; });
    this.idx = 0;
    /* Reset all scores for a fresh run */
    Object.keys(this.scores).forEach(k => this.scores[k] = null);
    /* Save minimal progress state */
    try { localStorage.setItem('wl_progress', JSON.stringify({mode:'full', gender:this.gender, ts:Date.now()})); } catch(e){}
    this.show('sModules');
    this.next();
  },

  /* ── v2: Wellness Age calculator ───────────────────────────────────── */
  calcWellnessAge(overall, actualAge) {
    if (overall == null) return null;
    /* Each 5-point deviation from baseline (70) = 2 years */
    const delta = Math.round((70 - overall) / 5) * 2;
    if (!actualAge || actualAge < 16 || actualAge > 90) {
      /* No age entered — return relative label only */
      if (overall >= 80) return { label:'Functionally Younger', delta:-4, icon:'🌱' };
      if (overall >= 65) return { label:'Age-Appropriate',      delta:0,  icon:'✅' };
      return               { label:'Functionally Older',        delta:4,  icon:'⏳' };
    }
    const wellAge = Math.max(16, Math.min(90, actualAge + delta));
    return {
      actual: actualAge,
      wellness: wellAge,
      delta,
      icon: delta < -1 ? '🌱' : delta > 1 ? '⏳' : '✅',
      label: delta < -1 ? `Performing ${Math.abs(delta)} years younger`
           : delta > 1  ? `Performing ${delta} years older`
           : `Matching your age`
    };
  },

  /* ── v2: Domain helpers for PDF ────────────────────────────────────── */
  _domainIcon(k) {
    return {cognitive:'🧠',eye:'👁',respiratory:'🌬',stress:'🔥',
            stability:'📱',lifestyle:'⚖',hormonal:'🌸'}[k] || '●';
  },
  _domainLabel(k) {
    return {cognitive:'Cognitive',eye:'Eye Health',respiratory:'Respiratory',
            stress:'Stress',stability:'Stability',lifestyle:'Lifestyle',
            hormonal:'Hormonal'}[k] || k;
  },
  _improvementTip(k) {
    return ({
      cognitive:   'Try daily brain puzzles, protect sleep quality, stay well hydrated and limit long screen sessions.',
      eye:         'Follow the 20-20-20 rule (every 20 min look 20 ft away for 20 s), reduce glare and get a clinical eye check.',
      respiratory: 'Practice box breathing (4-4-4-4) for 5 min daily, try pranayama, avoid smoke and strong air pollutants.',
      stress:      'Short daily meditation, journaling, and limiting caffeine after noon can meaningfully reduce stress scores.',
      stability:   'Yoga balance poses, grip-strength exercises and a magnesium-rich diet support steadiness.',
      lifestyle:   'Consistent sleep/wake times, 7–9 hours per night and limiting meals within 2 hours of bedtime make a big difference.',
      hormonal:    'Track cycle patterns, ensure adequate iron and vitamin D intake, and consult a gynaecologist for persistent symptoms.'
    })[k] || 'Focus on rest, hydration and consistent daily routines.';
  },

  /* ── v2: Challenge URL helpers ─────────────────────────────────────── */
  _challengeUnits: {
    mod_reactionSpeed:'ms',
    mod_co2Tolerance:'s'
  },
  _challengeTarget: null,

  createChallengeUrl(testId, score) {
    const url = new URL(window.location.href.split('?')[0]);
    url.searchParams.set('challenge', testId);
    url.searchParams.set('score', Math.round(score));
    url.searchParams.set('unit', this._challengeUnits[testId] || 'pts');
    return url.toString();
  },

  copyChallengeLink(testId, score) {
    const url = this.createChallengeUrl(testId, score);
    navigator.clipboard.writeText(url).then(() => {
      this.toast('Challenge link copied! Share it with a friend 🏆');
    }).catch(() => {
      /* Fallback: show the URL */
      prompt('Copy this challenge link:', url);
    });
    trackWL('challenge_created', testId);
  },

  showChallengeResult(testId, myScore) {
    const ct = this._challengeTarget;
    if (!ct) { if(typeof LAB.showDashboard==='function') LAB.showDashboard(); return; }
    const unit = ct.unit;
    const lowerBetter = (unit === 'ms');
    const iWin  = lowerBetter ? myScore < ct.score : myScore > ct.score;
    const isTie = myScore === ct.score;
    const emoji = isTie ? '🤝' : iWin ? '🏆' : '😅';
    const headline = isTie ? "It's a Tie!" : iWin ? 'You Win!' : 'Close Call!';
    const myFmt   = Math.round(myScore) + unit;
    const theirFmt = ct.score + unit;
    trackWL('challenge_completed', testId);
    this.render(`
    <div class="mwrap">
      <div class="card card--pop" style="text-align:center;padding:2.5rem 1.5rem">
        <div style="font-size:3.5rem;margin-bottom:.6rem">${emoji}</div>
        <h2 class="h2" style="margin-bottom:.4rem">${headline}</h2>
        <div style="display:flex;justify-content:center;gap:2rem;margin:1.2rem 0;flex-wrap:wrap">
          <div style="text-align:center">
            <div style="font-size:.65rem;font-family:'JetBrains Mono',monospace;text-transform:uppercase;color:var(--tq);letter-spacing:.08em">Your Score</div>
            <div style="font-size:2.2rem;font-weight:800;color:${iWin?'var(--ok)':'var(--t)'}">${myFmt}</div>
          </div>
          <div style="text-align:center">
            <div style="font-size:.65rem;font-family:'JetBrains Mono',monospace;text-transform:uppercase;color:var(--tq);letter-spacing:.08em">Friend's Score</div>
            <div style="font-size:2.2rem;font-weight:800;color:var(--tm)">${theirFmt}</div>
          </div>
        </div>
        <p class="pg" style="font-size:.82rem;margin-bottom:1.4rem">
          ${lowerBetter ? 'Lower is faster for reaction speed.' : 'Higher score wins.'}
        </p>
        <div class="btn-row" style="justify-content:center;flex-wrap:wrap">
          <button class="btn btn--p" onclick="LAB._rerunChallenge('${testId}')">⟳ Try Again</button>
          <button class="btn btn--g" onclick="LAB.goWelcome()">Run Full Lab</button>
        </div>
      </div>
    </div>`);
  },

  _rerunChallenge(testId) {
    /* Re-run only the challenge test */
    this.queue = [testId];
    this.idx = 0;
    this.currentMode = 'challenge';
    this.show('sModules');
    this.next();
  },

  next() {
    if (this.idx >= this.queue.length) {
      if (typeof LAB.showDashboard === 'function') LAB.showDashboard();
      else this._tempDone();
      return;
    }
    this._updateProg();
    const fn = window[this.queue[this.idx]];
    if (typeof fn === 'function') fn();
    else this._stub(this.queue[this.idx]);
  },

  skip() {

    if (this._demoAnim) { clearInterval(this._demoAnim); clearTimeout(this._demoAnim); this._demoAnim = null; }

    const ov = this.el('demo-ov');
    if (ov && ov.classList.contains('show')) { ov.classList.remove('show'); document.body.style.overflow=''; }
    this.say('Activity skipped.', 'سرگرمی چھوڑ دی گئی۔', 'गतिविधि छोड़ दी।');
    this.idx++;
    this.next();
  },

  _tempDone() {
    this.render(`<div class="mwrap"><div class="card" style="text-align:center;padding:3rem 2rem">
      <div style="font-size:3rem;margin-bottom:1rem">✅</div>
      <h2 class="h2" style="margin-bottom:.75rem">All activities done!</h2>
      <p class="pg" style="max-width:340px;margin:0 auto 2rem">Your dashboard will appear after all parts are loaded.</p>
      <button class="btn btn--p" onclick="LAB.goWelcome()">↺ Restart</button>
    </div></div>`);
  },

  _stub(name) {
    const lbl = name.replace('mod_','').replace(/([A-Z])/g,' $1').trim();
    this.render(`<div class="mwrap"><div class="card">
      <div class="step-head"><div class="tag">📦 Module</div>
        <h2 class="h2" style="margin-top:.75rem">${lbl}</h2></div>
      <p class="pg">This test could not load. Please refresh the page (Ctrl+F5). If it keeps happening, make sure all wellness-lab-part files are uploaded.</p>
      <div class="btn-row"><button class="btn btn--p" onclick="LAB.skip()">Continue →</button></div>
    </div></div>`);
  },

  _mlabels: {
    mod_reactionSpeed:'⚡ Reaction Speed',
    mod_spatialMemory:'🧩 Spatial Memory',
    mod_stroopTest:'🎨 Stroop Test',
    mod_bodySymptoms:'💪 Body Vitality',
    mod_colourBlindness:'🎨 Colour Blindness', mod_visualAcuity:'📏 Visual Acuity',
    mod_contrastSensitivity:'⬜ Contrast Sensitivity',
    mod_peripheralVision:'🔍 Peripheral Vision', mod_eyeTracking:'👀 Eye Tracking',
    mod_breathSync:'🌬 Breath Sync',         mod_co2Tolerance:'⏱ Breath Hold',
    mod_stabilityHold:'📱 Steady Hand',      mod_microTremor:'✏ Tremor Drawing',
    mod_sleepEfficiency:'💤 Sleep Check',    mod_lifestyleLoad:'⚖ Lifestyle Score',
    mod_hormonalRhythm:'🌸 Hormonal Rhythm', mod_energyIron:'⚡ Energy & Iron',
    mod_femCombined:'🌙 Sleep & Comfort',
    mod_hearingCheck:'👂 Hearing Check',
    mod_hydration:'💧 Hydration Risk',
    mod_digitSpan:'🔢 Digit Span',
    mod_goNoGo:'🚦 Go / No-Go',
    mod_oneLegStand:'🧍 One-Leg Stand',
    mod_trailMaking:'🔗 Trail Making',
  },

  _sections: {
    mod_reactionSpeed:      {label:'🧠 Brain',     num:1, of:6},
    mod_spatialMemory:     {label:'🧠 Brain',     num:2, of:6},
    mod_stroopTest:        {label:'🧠 Brain',     num:3, of:6},
    mod_goNoGo:           {label:'🧠 Brain',     num:4, of:6},
    mod_digitSpan:         {label:'🧠 Brain',     num:5, of:6},
    mod_trailMaking:       {label:'🧠 Brain',     num:6, of:6},
    mod_oneLegStand:       {label:'📱 Stability', num:2, of:2},
    mod_bodySymptoms:      {label:'💪 Body',      num:1, of:1},
    mod_colourBlindness:    {label:'👁 Eyes', num:1, of:2},
    mod_peripheralVision:   {label:'👁 Eyes', num:2, of:2},
    mod_breathSync:         {label:'🌬 Breathing', num:1, of:1},
    mod_stabilityHold:      {label:'📱 Stability', num:1, of:2},
    mod_sleepEfficiency:    {label:'🌿 Lifestyle', num:1, of:4},
    mod_lifestyleLoad:      {label:'🌿 Lifestyle', num:2, of:3},
    mod_hydration:          {label:'🌿 Lifestyle', num:3, of:3},
    mod_hormonalRhythm:     {label:'🌸 Female',   num:1, of:3},
    mod_energyIron:         {label:'🌸 Female',   num:2, of:3},
    mod_femCombined:        {label:'🌸 Female',   num:3, of:3},
    mod_gutHealth:          {label:'🍽 Gut',       num:1, of:1},
    mod_hearingCheck:       {label:'👂 Hearing',   num:1, of:1},
  },

  _updateProg() {
    const n=this.queue.length, i=this.idx+1, pct=Math.round(this.idx/n*100);
    const modKey = this.queue[this.idx];
    const sec = this._sections[modKey];
    // Show both domain progress AND overall: e.g. "🧠 Brain 2 of 5 · Test 7 of 22"
    const domainPart = sec ? `${sec.label} ${sec.num} of ${sec.of}` : '';
    const globalPart = `Test ${i} of ${n}`;
    const stepLbl = domainPart ? `${domainPart} · ${globalPart}` : globalPart;
    const actLbl = this._mlabels[modKey] || '—';
    const set=(id,v)=>{const e=this.el(id);if(e)e.textContent=v;};
    set('pStep', stepLbl);
    set('pLbl', actLbl);
    set('pPct', pct+'%');
    const f=this.el('pFill');if(f)f.style.width=pct+'%';
    this.el('progBar').setAttribute('aria-valuenow',pct);
    this.setStatus('active', actLbl);
  },

  render(html) {
    const c = this.el('modContent');
    if (!c) return;
    c.innerHTML = html;
    setTimeout(() => c.scrollIntoView({behavior:'smooth',block:'start'}), 80);
  },

  setStatus(state, text) {
    const d=this.el('hsDot'), s=this.el('hsText');
    if (d) d.className = 'hstat'+(state==='active'?'':' idle');
    if (s) s.textContent = text;
  },

  _synth: window.speechSynthesis || null,

  say(en) {
    if (!this.voiceOn || !this._synth) return;
    this._synth.cancel();
    setTimeout(() => {
      if (!this.voiceOn || !this._synth) return;
      const u = new SpeechSynthesisUtterance(en);
      u.lang = 'en-IN'; u.rate = 0.92; u.pitch = 1.0; u.volume = 1.0;
      const voices = this._synth.getVoices();
      const enVoices = voices.filter(v => v.lang.startsWith('en') && !v.name.toLowerCase().includes('compact'));
      if (enVoices.length) u.voice = enVoices.find(v => !v.localService) || enVoices[0];
      const t = this.el('vtog');
      u.onstart = () => { if(t) t.classList.add('speaking'); };
      u.onend   = () => { if(t) t.classList.remove('speaking'); };
      this._synth.speak(u);
    }, 80);
  },

  toggleVoice() {
    this.voiceOn = !this.voiceOn;
    const t=this.el('vtog'), l=this.el('vlbl');
    if (t) t.textContent = this.voiceOn ? '🔊' : '🔇';
    if (l) l.textContent = this.voiceOn ? 'Voice ON' : 'Voice OFF';
    if (this.voiceOn) {
      this.say("Voice guidance is on! I'll cheer you on and guide you through every check. Let's do this together!");
    } else if (this._synth) {
      this._synth.cancel();
    }
  },

  /* v2: Toast notification ───────────────────────────────────────────── */
  toast(msg, duration = 3000) {
    let t = this.el('labToast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'labToast';
      t.style.cssText = `position:fixed;bottom:5rem;left:50%;transform:translateX(-50%) translateY(20px);
        background:#1A4731;color:#fff;padding:.65rem 1.3rem;border-radius:50px;font-size:.82rem;
        font-weight:600;box-shadow:0 4px 18px rgba(0,0,0,.25);opacity:0;
        transition:all .28s var(--ease);z-index:9999;pointer-events:none;white-space:nowrap`;
      document.body.appendChild(t);
    }
    t.textContent = msg;
    requestAnimationFrame(() => {
      t.style.opacity = '1';
      t.style.transform = 'translateX(-50%) translateY(0)';
      clearTimeout(t._timer);
      t._timer = setTimeout(() => {
        t.style.opacity = '0';
        t.style.transform = 'translateX(-50%) translateY(20px)';
      }, duration);
    });
  },


  showDemo(cfg, cb) {
    this._demoCB = cb;

    if (this._demoAnim) { clearInterval(this._demoAnim); clearTimeout(this._demoAnim); this._demoAnim = null; }

    const set = (id,v,isHTML=false) => { const e=this.el(id); if(e){ isHTML ? e.innerHTML=v : e.textContent=v; } };
    set('demoTitle', cfg.title);
    set('demoTxt',   cfg.txt, true);
    set('demoHint',  cfg.hint || '');

    const ds = this.el('demoStart');
    if (ds) ds.textContent = cfg.btnLabel || 'Begin →';

    const dv = this.el('demoVis');
    if (dv) {
      dv.innerHTML = cfg.vis || '';
      if (typeof cfg.anim === 'function') {
        this._demoAnim = cfg.anim(dv);
      }
    }

    const ov = this.el('demo-ov');
    if (ov) ov.classList.add('show');
    document.body.style.overflow = 'hidden';

    this.say(cfg.voiceEN || cfg.txt.replace(/<[^>]+>/g,''));
  },

  closeDemo(skip) {
    if (this._demoAnim) { clearInterval(this._demoAnim); clearTimeout(this._demoAnim); this._demoAnim = null; }
    clearInterval(this._cdTimer); this._cdTimer = null;
    const cdEl = this.el('demoCountdown');
    if (cdEl) { cdEl.style.display = 'none'; cdEl.textContent = ''; }
    const ov = this.el('demo-ov');
    if (ov) ov.classList.remove('show');
    document.body.style.overflow = '';
    if (typeof this._demoCB === 'function') {
      const cb = this._demoCB;
      this._demoCB = null;
      cb(skip);
    }
  },

  celebrate() {
    const cols=['#2A7A5A','#38A87A','#C97800','#F0A020','#1A4731','#66D4A8'];
    for (let i=0;i<32;i++) {
      const el=document.createElement('div'), sz=5+Math.random()*9;
      el.style.cssText=`position:fixed;top:${Math.random()*28+6}%;left:${Math.random()*100}%;
        width:${sz}px;height:${sz}px;border-radius:${Math.random()>.5?'50%':'2px'};
        background:${cols[Math.floor(Math.random()*cols.length)]};pointer-events:none;z-index:9999;
        animation:confettiFall ${1.3+Math.random()*1.5}s ease-in ${Math.random()*.45}s both`;
      document.body.appendChild(el);
      setTimeout(()=>el.remove(),3200);
    }
  },

  flash(type) {
    let f = this.el('_fl');
    if (!f) {
      f=document.createElement('div'); f.id='_fl';
      f.style.cssText='position:fixed;inset:0;z-index:6999;pointer-events:none;opacity:0;transition:opacity .1s';
      document.body.appendChild(f);
    }
    f.style.background = type==='hit'?'rgba(42,122,90,.1)':'rgba(192,57,43,.1)';
    f.style.opacity='1';
    setTimeout(()=>{f.style.opacity='0';},110);
  },

  rxBars(times) {
    if (!times.length) return '';
    const mx = Math.max(...times, 600);
    return times.map(t => {
      const h = Math.max(3,Math.round(t/mx*38));
      const c = t<250?'var(--ok)':t<400?'var(--am)':'var(--rd)';
      return `<div class="rxb" style="height:${h}px;background:${c}" title="${t}ms"></div>`;
    }).join('');
  },

  _fsel: {},
  optGrid(id, opts) {
    return `<div id="og_${id}">`+
      opts.map((o,i)=>`<div class="ocard" id="oc_${id}_${i}" role="radio" aria-checked="false" tabindex="0"
        onclick="LAB.pickOpt('${id}',${i},${o.v})"
        onkeydown="if(event.key==='Enter'||event.key===' ')LAB.pickOpt('${id}',${i},${o.v})"
        style="display:flex;align-items:center;gap:.75rem;padding:.78rem .95rem;background:#fff;border:2px solid var(--b);border-radius:var(--rs);cursor:pointer;transition:all .2s;margin:.35rem 0">
        <div class="o-dot" id="od_${id}_${i}" style="width:15px;height:15px;border-radius:50%;border:2px solid var(--b);flex-shrink:0;transition:.2s"></div>
        <span style="font-size:.85rem;color:var(--tm)">${o.l}</span>
      </div>`).join('')+'</div>';
  },
  pickOpt(id,idx,val) {
    this._fsel[id]=val;
    for(let i=0;i<20;i++){
      const c=this.el(`oc_${id}_${i}`), d=this.el(`od_${id}_${i}`);
      if(!c) break;
      const sel=i===idx;
      c.style.borderColor=sel?'var(--gd)':'var(--b)';
      c.style.background=sel?'var(--gd3)':'#fff';
      c.setAttribute('aria-checked',String(sel));
      if(d){ d.style.background=sel?'var(--gd)':'transparent'; d.style.borderColor=sel?'var(--gd)':'var(--b)'; }
    }
    this.flash('hit');
  },
  fval(id,def){ return this._fsel[id]!==undefined ? this._fsel[id] : def; },

};

window.LAB = LAB;

(function(){
  let c=0;
  setInterval(()=>{
    document.getElementById('ds'+c)?.classList.remove('on');
    document.getElementById('dd'+c)?.classList.remove('on');
    c=(c+1)%3;
    document.getElementById('ds'+c)?.classList.add('on');
    document.getElementById('dd'+c)?.classList.add('on');
  }, 5000);
})();
