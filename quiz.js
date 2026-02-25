/* ============================================================
   SHAH HAYAAT — quiz.js  v2.0
   Smart Health Assessment Quiz Engine
   All interactive functions exposed on window.*
   ============================================================ */
'use strict';

/* ── QUIZ DATA ─────────────────────────────────────────────── */
const QUIZ_STEPS = [
  {
    id: 'basics',
    title: 'About You',
    sub: 'Help us understand your profile',
    type: 'inputs',
    fields: [
      { id: 'gender', label: 'Gender', type: 'select', opts: ['Select gender', 'Male', 'Female'] },
      { id: 'age',    label: 'Age (years)', type: 'number', min: 10, max: 90, ph: 'e.g. 30' },
      { id: 'height', label: 'Height (cm)', type: 'number', min: 120, max: 230, ph: 'e.g. 170' },
      { id: 'weight', label: 'Weight (kg)', type: 'number', min: 30, max: 200, ph: 'e.g. 70' },
    ],
  },
  {
    id: 'brain', title: 'Brain & Mental Health', sub: 'How is your cognitive health?', type: 'options',
    qs: [
      { id: 'q_memory',  label: 'Poor memory or forgetfulness?',              cat: 'brain' },
      { id: 'q_stress',  label: 'Stress, anxiety or mental fatigue?',         cat: 'brain' },
      { id: 'q_focus',   label: 'Difficulty concentrating or brain fog?',     cat: 'brain' },
    ],
  },
  {
    id: 'digestion', title: 'Digestive Health', sub: 'How is your gut functioning?', type: 'options',
    qs: [
      { id: 'q_gas',        label: 'Gas or bloating after meals?',            cat: 'digestion' },
      { id: 'q_indigestion', label: 'Difficulty digesting food?',             cat: 'digestion' },
      { id: 'q_acidity',   label: 'Acidity, heartburn or ulcers?',            cat: 'acidity' },
    ],
  },
  {
    id: 'blood', title: 'Energy, Blood & Immunity', sub: 'Tell us about your vitality', type: 'options',
    qs: [
      { id: 'q_weakness', label: 'Weakness, fatigue or low energy?',          cat: 'blood' },
      { id: 'q_anemia',   label: 'Anemia or low hemoglobin?',                 cat: 'blood' },
      { id: 'q_cough',    label: 'Chronic cough or respiratory issues?',      cat: 'respiratory' },
      { id: 'q_fever',    label: 'Frequent fever or recurrent illness?',      cat: 'immunity' },
    ],
  },
  {
    id: 'organs', title: 'Organ Health', sub: 'Any concerns with these areas?', type: 'options',
    qs: [
      { id: 'q_liver',    label: 'Liver issues or high cholesterol?',          cat: 'liver' },
      { id: 'q_diabetes', label: 'High blood sugar or suspected diabetes?',    cat: 'diabetes' },
      { id: 'q_joint',    label: 'Joint pain, arthritis or stiffness?',        cat: 'joint' },
      { id: 'q_skin',     label: 'Chronic skin issues like acne or psoriasis?', cat: 'skin' },
    ],
  },
  {
    id: 'gender_q', title: 'Health Specific to You', sub: 'Based on your profile', type: 'gender',
    female: [
      { id: 'q_periods',    label: 'Irregular or painful menstrual cycles?',  cat: 'female' },
      { id: 'q_leucorrhoea', label: 'Unusual vaginal discharge?',             cat: 'female' },
      { id: 'q_hormonal',   label: 'Hormonal imbalance or PCOD/PCOS?',       cat: 'female' },
    ],
    male: [
      { id: 'q_stamina',  label: 'Low physical stamina or endurance?',        cat: 'male' },
      { id: 'q_libido',   label: 'Low libido or sexual health concerns?',     cat: 'male' },
      { id: 'q_sperm',    label: 'Reproductive health concerns?',             cat: 'male' },
    ],
  },
];

const SPECIFIC_CATS = [
  { id:'brain',       label:'Brain & Stress',     icon:'🧠', prodId:'brainchamp',   cat:'brain',
    qs:[{id:'sq1',label:'Poor memory or forgetfulness?'},{id:'sq2',label:'Stress or anxiety?'},{id:'sq3',label:'Difficulty concentrating?'},{id:'sq4',label:'Mental fatigue or brain fog?'}]},
  { id:'digestion',   label:'Digestion',           icon:'🫁', prodId:'shahzyme',     cat:'digestion',
    qs:[{id:'sq1',label:'Gas or bloating after meals?'},{id:'sq2',label:'Slow or difficult digestion?'},{id:'sq3',label:'Poor appetite?'},{id:'sq4',label:'Frequent indigestion?'}]},
  { id:'acidity',     label:'Acidity',             icon:'🔥', prodId:'panasip',      cat:'acidity',
    qs:[{id:'sq1',label:'Heartburn or burning chest sensation?'},{id:'sq2',label:'Acid reflux or regurgitation?'},{id:'sq3',label:'Stomach pain or suspected ulcers?'}]},
  { id:'blood',       label:'Blood & Weakness',    icon:'🩸', prodId:'bloodstorm',   cat:'blood',
    qs:[{id:'sq1',label:'Frequent weakness or tiredness?'},{id:'sq2',label:'Pale skin or breathlessness?'},{id:'sq3',label:'Known or suspected anemia?'}]},
  { id:'respiratory', label:'Cough',               icon:'😮‍💨', prodId:'coughxpro',   cat:'respiratory',
    qs:[{id:'sq1',label:'Chronic or recurring cough?'},{id:'sq2',label:'Excessive phlegm or mucus?'},{id:'sq3',label:'Throat irritation or infection?'}]},
  { id:'skin',        label:'Skin',                icon:'✨', prodId:'musaffakhoon', cat:'skin',
    qs:[{id:'sq1',label:'Acne, pimples or breakouts?'},{id:'sq2',label:'Psoriasis, eczema or rashes?'},{id:'sq3',label:'Dull or blemished skin?'}]},
  { id:'liver',       label:'Liver',               icon:'🟤', prodId:'livohayaat',   cat:'liver',
    qs:[{id:'sq1',label:'Unexplained fatigue or jaundice history?'},{id:'sq2',label:'Diagnosed with fatty liver?'},{id:'sq3',label:'High cholesterol or triglycerides?'}]},
  { id:'diabetes',    label:'Diabetes',            icon:'🍬', prodId:'diaease',      cat:'diabetes',
    qs:[{id:'sq1',label:'High blood sugar levels?'},{id:'sq2',label:'Frequent thirst or urination?'},{id:'sq3',label:'Borderline or pre-diabetic?'}]},
  { id:'joint',       label:'Joint Pain',          icon:'🦴', prodId:'orthohayaat',  cat:'joint',
    qs:[{id:'sq1',label:'Joint pain or arthritis?'},{id:'sq2',label:'Morning stiffness in joints?'},{id:'sq3',label:'Reduced mobility or flexibility?'}]},
  { id:'female',      label:'Female Health',       icon:'🌸', prodId:'utrohayaat',   cat:'female',
    qs:[{id:'sq1',label:'Irregular or painful periods?'},{id:'sq2',label:'Unusual vaginal discharge?'},{id:'sq3',label:'Hormonal imbalance or PCOD?'}]},
  { id:'male',        label:'Male Vitality',       icon:'⚡', prodId:'passionpulse', cat:'male',
    qs:[{id:'sq1',label:'Low physical stamina?'},{id:'sq2',label:'Low libido or sexual concerns?'},{id:'sq3',label:'Reproductive health concerns?'}]},
  { id:'immunity',    label:'Immunity & Fever',    icon:'🛡️', prodId:'fevodol',      cat:'immunity',
    qs:[{id:'sq1',label:'Frequent fever episodes?'},{id:'sq2',label:'Fall sick repeatedly?'},{id:'sq3',label:'Generally weak immune response?'}]},
];

const PROD_MAP = {
  brain:       { prodId:'brainchamp',   name:'Brain Champ',   thresh:2 },
  digestion:   { prodId:'shahzyme',     name:'Shah Zyme',     thresh:2 },
  acidity:     { prodId:'panasip',      name:'PanaSip',       thresh:2 },
  blood:       { prodId:'bloodstorm',   name:'Blood Storm',   thresh:2 },
  respiratory: { prodId:'coughxpro',   name:'Cough X Pro',   thresh:1 },
  skin:        { prodId:'musaffakhoon', name:'Musaffa Khoon', thresh:2 },
  liver:       { prodId:'livohayaat',   name:'Livo Hayaat',   thresh:2 },
  diabetes:    { prodId:'diaease',      name:'Dia-Ease',      thresh:1 },
  joint:       { prodId:'orthohayaat',  name:'Ortho Hayaat',  thresh:2 },
  female:      { prodId:'utrohayaat',   name:'Utro Hayaat',   thresh:2 },
  male:        { prodId:'passionpulse', name:'Passion Pulse', thresh:2 },
  immunity:    { prodId:'fevodol',      name:'Fevodol',       thresh:2 },
};

/* ── STATE ─────────────────────────────────────────────────── */
let S = {
  mode: null,       // 'complete' | 'specific'
  specCat: null,
  gender: null, age: null, height: null, weight: null, bmi: null,
  scores: {},
  ans: {},
  step: 0,
};

function resetState() {
  S = { mode:null, specCat:null, gender:null, age:null, height:null, weight:null, bmi:null,
        scores:{brain:0,digestion:0,acidity:0,blood:0,respiratory:0,skin:0,liver:0,diabetes:0,joint:0,female:0,male:0,immunity:0},
        ans:{}, step:0 };
}

/* ── HELPERS ───────────────────────────────────────────────── */
const GH = 'https://raw.githubusercontent.com/yasirhashmi02-dev/Shahhayaat02/main/';
const IMG = { brainchamp:'brainchamp.jpg', shahzyme:'shahzyme.jpg', bloodstorm:'bloodstorm.jpg',
  coughxpro:'coughxpro.jpg', musaffakhoon:'musaffakhoon.jpg', panasip:'panasip.jpg',
  livohayaat:'livohayaat.jpg', diaease:'diaease.png', orthohayaat:'orthohayaat.jpg',
  utrohayaat:'utrohayaat.png', passionpulse:'passionpulse.jpg', fevodol:'fevodol.png' };
function imgSrc(id) { return GH + (IMG[id] || id); }
function scoreOf(v) { return v==='yes'?2:v==='sometimes'?1:0; }
function bmiCat(b) {
  if(b<18.5) return {label:'Underweight',color:'#2196F3'};
  if(b<25)   return {label:'Normal',color:'#4CAF50'};
  if(b<30)   return {label:'Overweight',color:'#FF9800'};
  return           {label:'Obese',color:'#F44336'};
}
function scoreLbl(s,mx){ const r=s/mx; return r<0.33?'Healthy':r<0.66?'Mild Concern':'Needs Attention'; }
function getProduct(id){ return (window.SHAH?.PRODUCTS||[]).find(p=>p.id===id); }

/* ── SCREENS ───────────────────────────────────────────────── */
function show(id) {
  ['mode-screen','complete-screen','specific-screen','results-screen']
    .forEach(s => { const el=document.getElementById(s); if(el) el.classList.toggle('hidden', s!==id); });
}

/* ── RENDER ROOT ───────────────────────────────────────────── */
function renderQuiz() {
  const root = document.getElementById('quiz-root');
  if (!root) return;
  root.innerHTML = `
    <div class="quiz-wrap">
      <!-- MODE -->
      <div id="mode-screen">
        <div class="quiz-step-hd" style="text-align:center;margin-bottom:2rem">
          <h3>How would you like to proceed?</h3>
          <p>Choose the type of assessment that best fits your needs.</p>
        </div>
        <div class="quiz-mode-grid">
          <div class="quiz-mode-card" onclick="quizSelectMode('complete')">
            <div class="m-icon">🏥</div>
            <h3>Complete Health Analysis</h3>
            <p>Full 5-step assessment covering all health categories. Get a complete health snapshot + personalised product recommendations.</p>
          </div>
          <div class="quiz-mode-card" onclick="quizSelectMode('specific')">
            <div class="m-icon">🎯</div>
            <h3>Check Specific Issue</h3>
            <p>Quick focused assessment for one health concern. Get a direct product recommendation in under 2 minutes.</p>
          </div>
        </div>
      </div>

      <div id="complete-screen" class="hidden"></div>
      <div id="specific-screen" class="hidden"></div>
      <div id="results-screen" class="hidden"></div>
    </div>
  `;
}

/* ── MODE SELECT ───────────────────────────────────────────── */
window.quizSelectMode = function(mode) {
  resetState();
  S.mode = mode;
  if (mode === 'complete') {
    show('complete-screen');
    renderCompleteStep(0);
  } else {
    show('specific-screen');
    renderSpecificCategories();
  }
};

/* ══════════════════════════════════════
   COMPLETE FLOW
══════════════════════════════════════ */
function renderCompleteStep(idx) {
  const step = QUIZ_STEPS[idx];
  const total = QUIZ_STEPS.length;
  const pct = Math.round((idx / total) * 100);

  let content = '';
  if (step.type === 'inputs') {
    content = `<div class="quiz-inputs-grid">${step.fields.map(f => `
      <div class="form-group">
        <label for="qi_${f.id}">${f.label}</label>
        ${f.type==='select'
          ? `<select id="qi_${f.id}">
               ${f.opts.map((o,i)=>`<option value="${i===0?'':o.toLowerCase()}" ${i===0?'disabled':''} ${S[f.id]===o.toLowerCase()?'selected':''}>${o}</option>`).join('')}
             </select>`
          : `<input type="number" id="qi_${f.id}" min="${f.min}" max="${f.max}" placeholder="${f.ph}" value="${S[f.id]||''}">`}
      </div>`).join('')}</div>`;
  } else if (step.type === 'options') {
    content = step.qs.map(q => `
      <div class="opt-row">
        <div class="opt-row-label">${q.label}</div>
        <div class="opt-btns">
          ${['yes','sometimes','no'].map(v=>`
            <button type="button" class="opt-btn${S.ans[q.id]===v?' sel':''}"
              onclick="quizOpt(this,'${q.id}','${v}')">
              ${v==='yes'?'✓ Yes':v==='sometimes'?'~ Sometimes':'✗ No'}
            </button>`).join('')}
        </div>
      </div>`).join('');
  } else if (step.type === 'gender') {
    const g = (S.gender||'').toLowerCase();
    const qs = g==='female' ? step.female : step.male;
    const label = g==='female' ? 'Female Health' : 'Male Vitality';
    content = qs.map(q => `
      <div class="opt-row">
        <div class="opt-row-label">${q.label}</div>
        <div class="opt-btns">
          ${['yes','sometimes','no'].map(v=>`
            <button type="button" class="opt-btn${S.ans[q.id]===v?' sel':''}"
              onclick="quizOpt(this,'${q.id}','${v}')">
              ${v==='yes'?'✓ Yes':v==='sometimes'?'~ Sometimes':'✗ No'}
            </button>`).join('')}
        </div>
      </div>`).join('');
    step._activeLabel = label;
  }

  const stepLabel = step.type==='gender'
    ? ((S.gender||'').toLowerCase()==='female'?'Female Health':'Male Vitality')
    : step.title;

  document.getElementById('complete-screen').innerHTML = `
    <div class="quiz-prog-wrap">
      <div class="quiz-prog-label"><span>Step ${idx+1} of ${total}</span><span>${pct}% complete</span></div>
      <div class="quiz-prog-track"><div class="quiz-prog-fill" style="width:${pct}%"></div></div>
    </div>
    <div class="quiz-step">
      <div class="quiz-step-hd">
        <span>${stepLabel.toUpperCase()}</span>
        <h3>${step.type==='gender'?stepLabel:step.title}</h3>
        <p>${step.sub}</p>
      </div>
      <div>${content}</div>
      <div class="quiz-nav">
        ${idx>0
          ? `<button class="btn btn-outline" onclick="quizBack(${idx})">← Back</button>`
          : '<span></span>'}
        <button class="btn btn-primary" onclick="quizNext(${idx})">
          ${idx<total-1?'Continue →':'See Results →'}
        </button>
      </div>
    </div>`;
}

window.quizOpt = function(el, qId, val) {
  el.closest('.opt-btns').querySelectorAll('.opt-btn').forEach(b=>b.classList.remove('sel'));
  el.classList.add('sel');
  S.ans[qId] = val;
};

window.quizNext = function(idx) {
  const step = QUIZ_STEPS[idx];

  /* --- Validate & collect --- */
  if (step.type === 'inputs') {
    const g = document.getElementById('qi_gender')?.value;
    const a = parseInt(document.getElementById('qi_age')?.value);
    const h = parseFloat(document.getElementById('qi_height')?.value);
    const w = parseFloat(document.getElementById('qi_weight')?.value);
    if (!g) { alert('Please select your gender.'); return; }
    if (!a || a<10||a>90) { alert('Please enter a valid age (10–90).'); return; }
    if (!h || h<120||h>230) { alert('Please enter a valid height in cm (120–230).'); return; }
    if (!w || w<30||w>200) { alert('Please enter a valid weight in kg (30–200).'); return; }
    S.gender=g; S.age=a; S.height=h; S.weight=w;
    S.bmi = +(w/((h/100)**2)).toFixed(1);
    if (S.bmi>=30) { S.scores.diabetes+=1; S.scores.joint+=1; }
  }

  if (step.type === 'options') {
    for (const q of step.qs) {
      if (!S.ans[q.id]) { alert('Please answer all questions before continuing.'); return; }
      S.scores[q.cat] = (S.scores[q.cat]||0) + scoreOf(S.ans[q.id]);
    }
  }

  if (step.type === 'gender') {
    const g = (S.gender||'').toLowerCase();
    const qs = g==='female' ? step.female : step.male;
    for (const q of qs) {
      if (!S.ans[q.id]) { alert('Please answer all questions before continuing.'); return; }
      S.scores[q.cat] = (S.scores[q.cat]||0) + scoreOf(S.ans[q.id]);
    }
  }

  const next = idx + 1;
  if (next >= QUIZ_STEPS.length) {
    showCompleteResults();
  } else {
    S.step = next;
    renderCompleteStep(next);
  }
};

window.quizBack = function(idx) {
  S.step = idx - 1;
  renderCompleteStep(S.step);
};

function showCompleteResults() {
  const recs = [];
  for (const [cat, m] of Object.entries(PROD_MAP)) {
    if ((S.scores[cat]||0) >= m.thresh) recs.push(m);
  }
  const top4 = recs.slice(0,4);
  const bCat = bmiCat(S.bmi);
  const brainS = S.scores.brain||0;
  const digS = (S.scores.digestion||0)+(S.scores.acidity||0);
  const immS = S.scores.immunity||0;

  document.getElementById('results-screen').innerHTML = `
    <div class="quiz-step">
      <div style="text-align:center;margin-bottom:2rem">
        <div style="font-size:2.5rem;margin-bottom:0.5rem">🎯</div>
        <h3 style="color:var(--green-dark)">Your Health Snapshot</h3>
        <p>Based on your complete ${QUIZ_STEPS.length}-step assessment</p>
      </div>
      <div class="health-snapshot">
        <div class="snap-card"><div class="snap-icon">⚖️</div><div class="snap-lbl">BMI</div>
          <div class="snap-val" style="color:${bCat.color}">${S.bmi}</div>
          <div style="font-size:0.72rem;color:${bCat.color};margin-top:0.2rem">${bCat.label}</div></div>
        <div class="snap-card"><div class="snap-icon">🧠</div><div class="snap-lbl">Mental</div>
          <div class="snap-val">${scoreLbl(brainS,6)}</div></div>
        <div class="snap-card"><div class="snap-icon">🫁</div><div class="snap-lbl">Digestion</div>
          <div class="snap-val">${scoreLbl(digS,6)}</div></div>
        <div class="snap-card"><div class="snap-icon">🛡️</div><div class="snap-lbl">Immunity</div>
          <div class="snap-val">${scoreLbl(immS,4)}</div></div>
      </div>

      ${top4.length ? `
        <h3 style="color:var(--green-dark);margin-bottom:0.6rem">🌿 Recommended for You</h3>
        <p style="margin-bottom:1.2rem;font-size:0.9rem">These products match your reported symptoms:</p>
        <div class="result-grid">
          ${top4.map(r=>{
            const p=getProduct(r.prodId);
            return p?`<div class="result-card">
              <img src="${imgSrc(r.prodId)}" alt="${p.name}" loading="lazy">
              <h4>${p.name}</h4>
              <p>${p.desc}</p>
              <a href="product-detail.html?id=${r.prodId}" class="btn btn-outline btn-sm" style="display:block">Learn More</a>
            </div>`:'';
          }).join('')}
        </div>` : `
        <div style="background:rgba(42,70,51,0.06);border-radius:var(--radius);padding:2rem;text-align:center;margin:1.5rem 0">
          <div style="font-size:2.2rem;margin-bottom:0.5rem">🌟</div>
          <h4 style="color:var(--green-dark);margin-bottom:0.4rem">Great News!</h4>
          <p style="margin:0">Your indicators look balanced. Browse our range to maintain your wellbeing.</p>
          <a href="products.html" class="btn btn-primary" style="margin-top:1rem">Browse Products</a>
        </div>`}

      <div class="quiz-disclaimer">
        <strong>⚕️ Medical Disclaimer:</strong> These recommendations are based on reported symptoms and are for general wellness guidance only. They are NOT a substitute for professional medical advice, diagnosis or treatment. Please consult a qualified healthcare provider before starting any supplement.
      </div>
      <div style="text-align:center;margin-top:1.5rem">
        <button class="btn btn-outline" onclick="quizReset()">← Take Quiz Again</button>
      </div>
    </div>`;
  show('results-screen');
}

/* ══════════════════════════════════════
   SPECIFIC ISSUE FLOW
══════════════════════════════════════ */
function renderSpecificCategories() {
  document.getElementById('specific-screen').innerHTML = `
    <div class="quiz-step">
      <div class="quiz-step-hd" style="text-align:center;margin-bottom:1.8rem">
        <h3>Select Your Health Concern</h3>
        <p>We'll ask a few focused questions and recommend the right product for you.</p>
      </div>
      <div class="cat-grid">
        ${SPECIFIC_CATS.map(c=>`
          <div class="cat-card" onclick="quizSelectCat('${c.id}')">
            <div class="cat-icon">${c.icon}</div>
            <div class="cat-label">${c.label}</div>
          </div>`).join('')}
      </div>
      <div class="quiz-nav">
        <button class="btn btn-outline" onclick="quizGoHome()">← Back</button>
        <span></span>
      </div>
    </div>`;
}

/* All onclick functions MUST be on window.* so inline HTML can call them */
window.quizGoHome = function() {
  show('mode-screen');
};

window.quizSelectCat = function(catId) {
  S.specCat = catId;
  S.ans = {};
  const cat = SPECIFIC_CATS.find(c=>c.id===catId);
  renderSpecificQuestions(cat);
};

function renderSpecificQuestions(cat) {
  document.getElementById('specific-screen').innerHTML = `
    <div class="quiz-step">
      <div class="quiz-prog-wrap">
        <div class="quiz-prog-label"><span>${cat.icon} ${cat.label}</span><span>Quick Check</span></div>
        <div class="quiz-prog-track"><div class="quiz-prog-fill" style="width:50%"></div></div>
      </div>
      <div class="quiz-step-hd">
        <h3>${cat.label} Assessment</h3>
        <p>Answer honestly for the most accurate recommendation.</p>
      </div>
      ${cat.qs.map(q=>`
        <div class="opt-row">
          <div class="opt-row-label">${q.label}</div>
          <div class="opt-btns">
            ${['yes','sometimes','no'].map(v=>`
              <button type="button" class="opt-btn"
                onclick="quizOpt(this,'${q.id}','${v}')">
                ${v==='yes'?'✓ Yes':v==='sometimes'?'~ Sometimes':'✗ No'}
              </button>`).join('')}
          </div>
        </div>`).join('')}
      <div class="quiz-nav">
        <button class="btn btn-outline" onclick="quizBackToCategories()">← Back</button>
        <button class="btn btn-primary" onclick="quizFinalizeSpecific('${cat.id}')">Get Recommendation →</button>
      </div>
    </div>`;
}

window.quizBackToCategories = function() {
  renderSpecificCategories();
};

window.quizFinalizeSpecific = function(catId) {
  const cat = SPECIFIC_CATS.find(c=>c.id===catId);
  for (const q of cat.qs) {
    if (!S.ans[q.id]) { alert('Please answer all questions.'); return; }
  }
  let score = 0;
  cat.qs.forEach(q => { score += scoreOf(S.ans[q.id]||'no'); });
  showSpecificResult(cat, score);
};

function showSpecificResult(cat, score) {
  const map = PROD_MAP[cat.cat];
  const hasIssue = map && score >= map.thresh;
  const p = hasIssue ? getProduct(map.prodId) : null;

  document.getElementById('results-screen').innerHTML = `
    <div class="quiz-step" style="text-align:center">
      <div style="font-size:2.5rem;margin-bottom:0.5rem">${cat.icon}</div>
      <h3 style="color:var(--green-dark);margin-bottom:0.5rem">${cat.label} Result</h3>
      ${hasIssue && p ? `
        <p style="margin-bottom:1.5rem">Based on your answers, we recommend:</p>
        <div class="result-grid" style="max-width:280px;margin:0 auto 1.5rem">
          <div class="result-card">
            <img src="${imgSrc(map.prodId)}" alt="${p.name}" loading="lazy">
            <h4>${p.name}</h4>
            <p>${p.desc}</p>
            <div style="display:flex;gap:0.5rem;justify-content:center;flex-wrap:wrap">
              <a href="product-detail.html?id=${map.prodId}" class="btn btn-outline btn-sm">Learn More</a>
              <a href="https://wa.me/917051056287?text=${encodeURIComponent(`Hi! I'd like to order ${p.name}`)}"
                 target="_blank" rel="noopener" class="btn btn-primary btn-sm">Order Now</a>
            </div>
          </div>
        </div>` : `
        <div style="background:rgba(42,70,51,0.06);border-radius:var(--radius);padding:2rem;margin:1.5rem 0">
          <div style="font-size:2rem;margin-bottom:0.5rem">✅</div>
          <h4 style="color:var(--green-dark)">Looks Good!</h4>
          <p style="margin:0">Your responses don't indicate significant ${cat.label.toLowerCase()} concerns. Browse our full range to maintain your health.</p>
        </div>`}
      <div class="quiz-disclaimer">
        <strong>⚕️ Medical Disclaimer:</strong> This recommendation is based on your reported symptoms and is for general wellness guidance only. It is NOT a substitute for professional medical advice. Please consult a qualified healthcare provider.
      </div>
      <button class="btn btn-outline" onclick="quizReset()" style="margin-top:1.5rem">← Take Quiz Again</button>
    </div>`;
  show('results-screen');
}

/* ── RESET ─────────────────────────────────────────────────── */
window.quizReset = function() {
  resetState();
  renderQuiz();
  show('mode-screen');
};

/* ── INIT ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  resetState();
  renderQuiz();
});
