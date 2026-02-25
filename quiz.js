/* ============================================================
   SHAH HAYAAT — quiz.js
   Smart Health Assessment Quiz Engine
   ============================================================ */

'use strict';

/* ---------- QUIZ DATA ---------- */
const QUIZ = {

  completeFlow: [
    {
      id: 'basics',
      title: 'Basic Information',
      subtitle: 'Help us understand your profile',
      type: 'inputs',
      fields: [
        { id: 'gender',  label: 'Gender',           type: 'select', options: ['Select','Male','Female'] },
        { id: 'age',     label: 'Age (years)',       type: 'number', min: 10, max: 90, placeholder: 'e.g. 30' },
        { id: 'height',  label: 'Height (cm)',       type: 'number', min: 120, max: 230, placeholder: 'e.g. 170' },
        { id: 'weight',  label: 'Weight (kg)',       type: 'number', min: 30, max: 200, placeholder: 'e.g. 70' },
      ]
    },
    {
      id: 'brain',
      title: 'Brain & Mental Health',
      subtitle: 'How is your cognitive health?',
      type: 'options',
      questions: [
        { id: 'q_memory',  label: 'Do you experience poor memory or forgetfulness?',       cat: 'brain' },
        { id: 'q_stress',  label: 'Do you suffer from stress, anxiety, or mental fatigue?', cat: 'brain' },
        { id: 'q_focus',   label: 'Do you have difficulty concentrating or brain fog?',     cat: 'brain' },
      ]
    },
    {
      id: 'digestion',
      title: 'Digestive Health',
      subtitle: 'How is your gut functioning?',
      type: 'options',
      questions: [
        { id: 'q_gas',       label: 'Do you frequently experience gas or bloating?',   cat: 'digestion' },
        { id: 'q_indigestion', label: 'Do you have difficulty digesting food?',        cat: 'digestion' },
        { id: 'q_acidity',  label: 'Do you suffer from acidity, heartburn, or ulcers?', cat: 'acidity' },
      ]
    },
    {
      id: 'blood',
      title: 'Blood, Energy & Immunity',
      subtitle: 'Tell us about your energy and immunity',
      type: 'options',
      questions: [
        { id: 'q_weakness',  label: 'Do you feel weak, fatigued, or low on energy?',       cat: 'blood' },
        { id: 'q_anemia',   label: 'Have you been diagnosed with anemia or low hemoglobin?', cat: 'blood' },
        { id: 'q_cough',    label: 'Do you have a chronic cough or respiratory issues?',    cat: 'respiratory' },
        { id: 'q_fever',    label: 'Do you frequently get fever or fall sick easily?',      cat: 'immunity' },
      ]
    },
    {
      id: 'organs',
      title: 'Organ Health',
      subtitle: 'Any concerns with these areas?',
      type: 'options',
      questions: [
        { id: 'q_liver',    label: 'Do you have liver issues or high cholesterol?',          cat: 'liver' },
        { id: 'q_diabetes', label: 'Do you have high blood sugar or suspect diabetes?',      cat: 'diabetes' },
        { id: 'q_joint',    label: 'Do you suffer from joint pain, arthritis, or stiffness?', cat: 'joint' },
        { id: 'q_skin',     label: 'Do you have chronic skin problems like acne or psoriasis?', cat: 'skin' },
      ]
    },
    {
      id: 'gender_specific',
      title: 'Gender-Specific Health',
      subtitle: 'Questions based on your profile',
      type: 'conditional_options',
      female: {
        questions: [
          { id: 'q_periods',    label: 'Do you have irregular or painful menstrual cycles?', cat: 'female' },
          { id: 'q_leucorrhoea', label: 'Do you experience unusual vaginal discharge?',      cat: 'female' },
          { id: 'q_hormonal',   label: 'Do you suspect hormonal imbalance (PCOD/PCOS)?',    cat: 'female' },
        ]
      },
      male: {
        questions: [
          { id: 'q_stamina',   label: 'Do you have low physical stamina or endurance?',   cat: 'male' },
          { id: 'q_libido',    label: 'Do you have concerns about libido or sexual health?', cat: 'male' },
          { id: 'q_sperm',     label: 'Do you have concerns about reproductive health?',   cat: 'male' },
        ]
      }
    }
  ],

  specificCategories: [
    { id:'brain',       label:'Brain & Stress',    icon:'🧠', product:'Brain Champ',   cat:'brain',       questions:[
      { id:'sq_memory',  label:'Poor memory or forgetfulness?' },
      { id:'sq_focus',   label:'Difficulty concentrating?' },
      { id:'sq_anxiety', label:'Stress or anxiety?' },
      { id:'sq_fatigue', label:'Mental fatigue or brain fog?' },
    ]},
    { id:'digestion',   label:'Digestion',          icon:'🫁', product:'Shah Zyme',     cat:'digestion',   questions:[
      { id:'sq_gas',      label:'Gas or bloating after meals?' },
      { id:'sq_heavy',    label:'Feeling heavy or slow digestion?' },
      { id:'sq_appetite', label:'Poor or irregular appetite?' },
      { id:'sq_indigestion', label:'Frequent indigestion?' },
    ]},
    { id:'acidity',     label:'Acidity',            icon:'🔥', product:'PanaSip',       cat:'acidity',     questions:[
      { id:'sq_heartburn', label:'Heartburn or burning chest sensation?' },
      { id:'sq_acidreflux', label:'Acid reflux or regurgitation?' },
      { id:'sq_ulcer',   label:'Stomach pain or suspected ulcers?' },
    ]},
    { id:'blood',       label:'Blood & Weakness',   icon:'🩸', product:'Blood Storm',   cat:'blood',       questions:[
      { id:'sq_weakness', label:'Frequent weakness or tiredness?' },
      { id:'sq_pallor',   label:'Pale skin or breathlessness?' },
      { id:'sq_anemia',   label:'Known or suspected anemia?' },
    ]},
    { id:'respiratory', label:'Cough & Respiratory',icon:'🫂', product:'Cough X Pro',   cat:'respiratory', questions:[
      { id:'sq_cough',    label:'Chronic or recurring cough?' },
      { id:'sq_phlegm',   label:'Excessive phlegm or mucus?' },
      { id:'sq_throat',   label:'Throat irritation or infection?' },
    ]},
    { id:'skin',        label:'Skin',               icon:'✨', product:'Musaffa Khoon', cat:'skin',        questions:[
      { id:'sq_acne',     label:'Acne, pimples, or breakouts?' },
      { id:'sq_psoriasis', label:'Psoriasis, eczema, or rashes?' },
      { id:'sq_dullskin', label:'Dull, uneven, or blemished skin?' },
    ]},
    { id:'liver',       label:'Liver',              icon:'🟤', product:'Livo Hayaat',   cat:'liver',       questions:[
      { id:'sq_fatigue2', label:'Unexplained fatigue or jaundice?' },
      { id:'sq_fatty',    label:'Diagnosed with fatty liver?' },
      { id:'sq_cholesterol', label:'High cholesterol or triglycerides?' },
    ]},
    { id:'diabetes',    label:'Diabetes',           icon:'🍬', product:'Dia-Ease',      cat:'diabetes',    questions:[
      { id:'sq_bloodsugar', label:'High blood sugar levels?' },
      { id:'sq_thirst',   label:'Frequent thirst or urination?' },
      { id:'sq_borderline', label:'Borderline or pre-diabetic?' },
    ]},
    { id:'joint',       label:'Joint Pain',         icon:'🦴', product:'Ortho Hayaat',  cat:'joint',       questions:[
      { id:'sq_jointpain', label:'Joint pain or arthritis?' },
      { id:'sq_stiffness', label:'Morning stiffness in joints?' },
      { id:'sq_mobility',  label:'Reduced mobility or flexibility?' },
    ]},
    { id:'female',      label:'Female Health',      icon:'🌸', product:'Utro Hayaat',   cat:'female',      questions:[
      { id:'sq_periods2',  label:'Irregular or painful periods?' },
      { id:'sq_leucorrhoea2', label:'Unusual vaginal discharge?' },
      { id:'sq_hormonal2', label:'Hormonal imbalance or PCOD?' },
    ]},
    { id:'male',        label:'Male Vitality',      icon:'⚡', product:'Passion Pulse', cat:'male',        questions:[
      { id:'sq_stamina2', label:'Low physical stamina?' },
      { id:'sq_libido2',  label:'Low libido or sexual concerns?' },
      { id:'sq_sperm2',   label:'Reproductive health concerns?' },
    ]},
    { id:'immunity',    label:'Immunity & Fever',   icon:'🛡️', product:'Fevodol',       cat:'immunity',    questions:[
      { id:'sq_fever2',    label:'Frequent fever episodes?' },
      { id:'sq_sick',      label:'Fall sick repeatedly?' },
      { id:'sq_lowimmune', label:'Feeling generally weak or vulnerable?' },
    ]},
  ],

  productMap: {
    brain:       { name: 'Brain Champ',   id: 'brainchamp',   threshold: 2 },
    digestion:   { name: 'Shah Zyme',     id: 'shahzyme',     threshold: 2 },
    acidity:     { name: 'PanaSip',       id: 'panasip',      threshold: 2 },
    blood:       { name: 'Blood Storm',   id: 'bloodstorm',   threshold: 2 },
    respiratory: { name: 'Cough X Pro',   id: 'coughxpro',    threshold: 1 },
    skin:        { name: 'Musaffa Khoon', id: 'musaffakhoon', threshold: 2 },
    liver:       { name: 'Livo Hayaat',   id: 'livohayaat',   threshold: 2 },
    diabetes:    { name: 'Dia-Ease',      id: 'diaease',      threshold: 1 },
    joint:       { name: 'Ortho Hayaat',  id: 'orthohayaat',  threshold: 2 },
    female:      { name: 'Utro Hayaat',   id: 'utrohayaat',   threshold: 2 },
    male:        { name: 'Passion Pulse', id: 'passionpulse', threshold: 2 },
    immunity:    { name: 'Fevodol',       id: 'fevodol',      threshold: 2 },
  }
};

/* ---------- STATE ---------- */
let state = {
  mode: null,           // 'complete' | 'specific'
  specificCat: null,
  gender: null,
  age: null, height: null, weight: null,
  scores: {},
  answers: {},
  currentStep: 0,
};

/* ---------- HELPERS ---------- */
const GITHUB = 'https://raw.githubusercontent.com/yasirhashmi02-dev/Shahhayaat02/main/';
function qs(s, c = document) { return c.querySelector(s); }
function qsa(s, c = document) { return [...c.querySelectorAll(s)]; }
function scoreVal(v) { return v === 'yes' ? 2 : v === 'sometimes' ? 1 : 0; }

function bmiCategory(bmi) {
  if (bmi < 18.5) return { label: 'Underweight', color: '#2196F3' };
  if (bmi < 25)   return { label: 'Normal',      color: '#4CAF50' };
  if (bmi < 30)   return { label: 'Overweight',  color: '#FF9800' };
  return           { label: 'Obese',         color: '#F44336' };
}

function getScoreLabel(score, max) {
  const pct = score / max;
  if (pct < 0.33) return 'Healthy';
  if (pct < 0.66) return 'Mild Concern';
  return 'Needs Attention';
}

function getProductData(id) {
  return (window.SHAH?.PRODUCTS || []).find(p => p.id === id);
}

/* ---------- RENDER HELPERS ---------- */
function optionRow(q) {
  return `
    <div class="quiz-options-grid" style="margin-bottom:1.5rem">
      <p style="font-weight:600;color:var(--green-dark);margin-bottom:0.6rem;font-size:0.97rem;">${q.label}</p>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.5rem">
        ${['yes','sometimes','no'].map(v => `
          <div class="quiz-option" data-q="${q.id}" data-val="${v}" onclick="selectOption(this)">
            <div class="quiz-option-dot"></div>
            <span>${v === 'yes' ? '✓ Yes' : v === 'sometimes' ? '~ Sometimes' : '✗ No'}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/* ---------- MAIN RENDER ---------- */
function renderQuiz() {
  const root = qs('#quiz-root');
  if (!root) return;

  root.innerHTML = `
    <div class="quiz-wrapper">
      <div id="quiz-mode-screen">
        <div class="quiz-step-header" style="text-align:center;margin-bottom:2rem">
          <p style="font-size:0.82rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--accent-gold);margin-bottom:0.5rem">Step 1 of 2</p>
          <h3>How would you like to proceed?</h3>
          <p>Choose the type of assessment that best suits your needs.</p>
        </div>
        <div class="quiz-mode-select">
          <div class="quiz-mode-card" onclick="selectMode('complete')">
            <div class="quiz-mode-icon">🏥</div>
            <h3>Complete Health Analysis</h3>
            <p>Comprehensive 5-step assessment covering all health categories. Get a full health snapshot + relevant product recommendations.</p>
          </div>
          <div class="quiz-mode-card" onclick="selectMode('specific')">
            <div class="quiz-mode-icon">🎯</div>
            <h3>Check Specific Issue</h3>
            <p>Quick 4–6 question assessment for one targeted health concern. Get a direct product recommendation.</p>
          </div>
        </div>
      </div>

      <div id="quiz-complete-screen" class="hidden"></div>
      <div id="quiz-specific-screen" class="hidden"></div>
      <div id="quiz-results-screen" class="hidden"></div>
    </div>
  `;
}

/* ---------- MODE SELECTION ---------- */
window.selectMode = function(mode) {
  state.mode = mode;
  state.currentStep = 0;
  state.scores = { brain:0, digestion:0, acidity:0, blood:0, respiratory:0, skin:0, liver:0, diabetes:0, joint:0, female:0, male:0, immunity:0 };
  state.answers = {};

  qs('#quiz-mode-screen').classList.add('hidden');

  if (mode === 'complete') {
    renderCompleteStep(0);
    qs('#quiz-complete-screen').classList.remove('hidden');
  } else {
    renderSpecificCategorySelect();
    qs('#quiz-specific-screen').classList.remove('hidden');
  }
};

/* ---------- COMPLETE FLOW ---------- */
function renderCompleteStep(stepIdx) {
  const screen = qs('#quiz-complete-screen');
  const steps = QUIZ.completeFlow;
  const step = steps[stepIdx];
  const total = steps.length;

  // Handle gender-specific step
  let actualStep = step;
  if (step.id === 'gender_specific') {
    const g = state.gender?.toLowerCase();
    const data = g === 'female' ? step.female : step.male;
    actualStep = { ...step, questions: data?.questions || [], title: g === 'female' ? 'Female Health' : 'Male Health' };
    if (!actualStep.questions.length) {
      // Skip if no gender data
      finalizeComplete();
      return;
    }
  }

  const pct = Math.round((stepIdx / total) * 100);

  screen.innerHTML = `
    <div class="quiz-progress-wrap">
      <div class="quiz-progress-label">
        <span>Step ${stepIdx + 1} of ${total}</span>
        <span>${pct}% complete</span>
      </div>
      <div class="quiz-progress-track"><div class="quiz-progress-fill" style="width:${pct}%"></div></div>
    </div>

    <div class="quiz-step active" id="step-content">
      <div class="quiz-step-header">
        <p style="font-size:0.8rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--accent-gold);margin-bottom:0.4rem">${actualStep.id.toUpperCase().replace('_',' ')}</p>
        <h3>${actualStep.title}</h3>
        <p>${actualStep.subtitle}</p>
      </div>

      <div id="step-fields">
        ${actualStep.type === 'inputs' ? renderInputStep(actualStep) : renderOptionsStep(actualStep)}
      </div>

      <div class="quiz-nav">
        ${stepIdx > 0 ? `<button class="btn btn-outline" onclick="completeStepBack(${stepIdx})">← Back</button>` : '<span></span>'}
        <button class="btn btn-primary" onclick="completeStepNext(${stepIdx})">
          ${stepIdx < total - 1 ? 'Continue →' : 'See My Results →'}
        </button>
      </div>
    </div>
  `;
}

function renderInputStep(step) {
  return `<div class="quiz-inputs-grid">
    ${step.fields.map(f => `
      <div class="quiz-input-group">
        <label for="${f.id}">${f.label}</label>
        ${f.type === 'select'
          ? `<select id="${f.id}" name="${f.id}">
               ${f.options.map(o => `<option value="${o.toLowerCase()}" ${state[f.id] === o.toLowerCase() ? 'selected' : ''}>${o}</option>`).join('')}
             </select>`
          : `<input type="number" id="${f.id}" name="${f.id}" min="${f.min}" max="${f.max}" placeholder="${f.placeholder}" value="${state[f.id] || ''}">`
        }
      </div>
    `).join('')}
  </div>`;
}

function renderOptionsStep(step) {
  const qs = step.questions || [];
  return qs.map(q => optionRow(q)).join('');
}

window.selectOption = function(el) {
  const q = el.dataset.q;
  const val = el.dataset.val;
  // Deselect siblings
  qsa(`[data-q="${q}"]`).forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  state.answers[q] = val;
};

window.completeStepNext = function(stepIdx) {
  const step = QUIZ.completeFlow[stepIdx];

  // Validate inputs step
  if (step.type === 'inputs') {
    const gender = qs('#gender')?.value;
    const age    = parseInt(qs('#age')?.value);
    const height = parseFloat(qs('#height')?.value);
    const weight = parseFloat(qs('#weight')?.value);

    if (!gender || gender === 'select') { alert('Please select your gender.'); return; }
    if (!age || age < 10 || age > 90)    { alert('Please enter a valid age.'); return; }
    if (!height || height < 120 || height > 230) { alert('Please enter a valid height in cm.'); return; }
    if (!weight || weight < 30 || weight > 200)  { alert('Please enter a valid weight in kg.'); return; }

    state.gender = gender;
    state.age = age;
    state.height = height;
    state.weight = weight;
    state.bmi = +(weight / ((height / 100) ** 2)).toFixed(1);

    // BMI bonus scoring
    const bmi = state.bmi;
    if (bmi >= 30) { state.scores.diabetes += 1; state.scores.joint += 1; }
  }

  // Validate options step
  if (step.type === 'options' || step.type === 'conditional_options') {
    const g = state.gender?.toLowerCase();
    const questions = step.type === 'conditional_options'
      ? (g === 'female' ? step.female?.questions : step.male?.questions) || []
      : step.questions || [];

    let allAnswered = true;
    for (const q of questions) {
      if (!state.answers[q.id]) { allAnswered = false; break; }
    }
    if (!allAnswered) { alert('Please answer all questions before continuing.'); return; }

    // Tally scores
    for (const q of questions) {
      const val = state.answers[q.id];
      if (q.cat) state.scores[q.cat] = (state.scores[q.cat] || 0) + scoreVal(val);
    }
  }

  const nextStep = stepIdx + 1;
  if (nextStep >= QUIZ.completeFlow.length) {
    finalizeComplete();
  } else {
    state.currentStep = nextStep;
    renderCompleteStep(nextStep);
  }
};

window.completeStepBack = function(stepIdx) {
  state.currentStep = stepIdx - 1;
  renderCompleteStep(state.currentStep);
};

function finalizeComplete() {
  qs('#quiz-complete-screen').classList.add('hidden');
  renderCompleteResults();
  qs('#quiz-results-screen').classList.remove('hidden');
}

/* ---------- SPECIFIC ISSUE FLOW ---------- */
function renderSpecificCategorySelect() {
  const screen = qs('#quiz-specific-screen');
  screen.innerHTML = `
    <div class="quiz-step-header" style="text-align:center;margin-bottom:2rem">
      <h3>Select Your Health Concern</h3>
      <p>We'll ask a few focused questions and recommend the right product for you.</p>
    </div>
    <div class="category-select-grid">
      ${QUIZ.specificCategories.map(c => `
        <div class="category-card" onclick="selectSpecificCategory('${c.id}')">
          <div class="category-card-icon">${c.icon}</div>
          <div class="category-card-label">${c.label}</div>
        </div>
      `).join('')}
    </div>
    <div style="margin-top:2rem;text-align:left">
      <button class="btn btn-outline" onclick="goBackToModeSelect()">← Back</button>
    </div>
  `;
}

window.goBackToModeSelect = function() {
  qs('#quiz-specific-screen').classList.add('hidden');
  qs('#quiz-complete-screen').classList.add('hidden');
  qs('#quiz-results-screen').classList.add('hidden');
  qs('#quiz-mode-screen').classList.remove('hidden');
};

window.selectSpecificCategory = function(catId) {
  state.specificCat = catId;
  state.answers = {};
  const cat = QUIZ.specificCategories.find(c => c.id === catId);
  renderSpecificQuestions(cat);
};

function renderSpecificQuestions(cat) {
  const screen = qs('#quiz-specific-screen');
  screen.innerHTML = `
    <div class="quiz-progress-wrap">
      <div class="quiz-progress-label"><span>${cat.icon} ${cat.label}</span><span>Quick Assessment</span></div>
      <div class="quiz-progress-track"><div class="quiz-progress-fill" style="width:50%"></div></div>
    </div>
    <div class="quiz-step active">
      <div class="quiz-step-header">
        <h3>Quick ${cat.label} Assessment</h3>
        <p>Answer honestly for an accurate recommendation.</p>
      </div>
      ${cat.questions.map(q => `
        <div style="margin-bottom:1.5rem">
          <p style="font-weight:600;color:var(--green-dark);margin-bottom:0.6rem;font-size:0.97rem">${q.label}</p>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.5rem">
            ${['yes','sometimes','no'].map(v => `
              <div class="quiz-option" data-q="${q.id}" data-val="${v}" onclick="selectOption(this)">
                <div class="quiz-option-dot"></div>
                <span>${v === 'yes' ? '✓ Yes' : v === 'sometimes' ? '~ Sometimes' : '✗ No'}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}
      <div class="quiz-nav">
        <button class="btn btn-outline" onclick="renderSpecificCategorySelect()">← Back</button>
        <button class="btn btn-primary" onclick="finalizeSpecific('${cat.id}')">Get Recommendation →</button>
      </div>
    </div>
  `;
}

window.finalizeSpecific = function(catId) {
  const cat = QUIZ.specificCategories.find(c => c.id === catId);
  const allAnswered = cat.questions.every(q => state.answers[q.id]);
  if (!allAnswered) { alert('Please answer all questions.'); return; }

  let score = 0;
  cat.questions.forEach(q => { score += scoreVal(state.answers[q.id] || 'no'); });
  state.scores = { [cat.cat]: score };

  qs('#quiz-specific-screen').classList.add('hidden');
  renderSpecificResult(cat, score);
  qs('#quiz-results-screen').classList.remove('hidden');
};

/* ---------- RESULTS: COMPLETE ---------- */
function renderCompleteResults() {
  const screen = qs('#quiz-results-screen');
  const bmi = state.bmi;
  const bmiCat = bmiCategory(bmi);

  // Determine recommendations
  const recs = [];
  for (const [cat, mapping] of Object.entries(QUIZ.productMap)) {
    if ((state.scores[cat] || 0) >= mapping.threshold) {
      recs.push({ ...mapping, cat });
    }
  }
  // Limit to 4 max
  const topRecs = recs.slice(0, 4);

  // Snapshot values
  const brainScore = state.scores.brain || 0;
  const digestScore = (state.scores.digestion || 0) + (state.scores.acidity || 0);
  const immuneScore = state.scores.immunity || 0;

  screen.innerHTML = `
    <div style="animation: fadeSlide 0.5s ease">
      <div style="text-align:center;margin-bottom:2.5rem">
        <div style="font-size:3rem;margin-bottom:0.5rem">🎯</div>
        <h3 style="color:var(--green-dark);font-size:1.5rem;margin-bottom:0.5rem">Your Health Snapshot</h3>
        <p>Based on your ${QUIZ.completeFlow.length}-step assessment</p>
      </div>

      <div class="health-snapshot" style="margin-bottom:2.5rem">
        <div class="snapshot-card">
          <div class="snapshot-icon">⚖️</div>
          <div class="snapshot-label">BMI</div>
          <div class="snapshot-value" style="color:${bmiCat.color}">${bmi}</div>
          <div style="font-size:0.75rem;color:${bmiCat.color};margin-top:0.2rem">${bmiCat.label}</div>
        </div>
        <div class="snapshot-card">
          <div class="snapshot-icon">🧠</div>
          <div class="snapshot-label">Mental Health</div>
          <div class="snapshot-value">${getScoreLabel(brainScore, 6)}</div>
        </div>
        <div class="snapshot-card">
          <div class="snapshot-icon">🫁</div>
          <div class="snapshot-label">Digestion</div>
          <div class="snapshot-value">${getScoreLabel(digestScore, 6)}</div>
        </div>
        <div class="snapshot-card">
          <div class="snapshot-icon">🛡️</div>
          <div class="snapshot-label">Immunity</div>
          <div class="snapshot-value">${getScoreLabel(immuneScore, 4)}</div>
        </div>
      </div>

      ${topRecs.length > 0 ? `
        <h3 style="color:var(--green-dark);font-size:1.2rem;margin-bottom:0.75rem">🌿 Recommended for You</h3>
        <p style="margin-bottom:1.5rem;font-size:0.92rem">These products match your reported health concerns:</p>
        <div class="result-products-grid">
          ${topRecs.map(r => {
            const p = getProductData(r.id);
            return p ? `
              <div class="result-product-card">
                <img src="${GITHUB}${r.id.includes('.') ? r.id : (r.id === 'diaease' ? 'diaease.png' : r.id === 'utrohayaat' ? 'utrohayaat.png' : r.id === 'fevodol' ? 'fevodol.png' : r.id + '.jpg')}" alt="${p.name}" loading="lazy" onerror="this.src='${GITHUB}logo.jpg'">
                <h4>${p.name}</h4>
                <p>${p.desc}</p>
                <a href="product-detail.html?id=${r.id}" class="btn btn-outline btn-sm" style="display:block;text-align:center">Learn More</a>
              </div>
            ` : '';
          }).join('')}
        </div>
      ` : `
        <div style="background:rgba(42,70,51,0.06);border-radius:var(--radius);padding:2rem;text-align:center;margin:1.5rem 0">
          <div style="font-size:2.5rem;margin-bottom:0.5rem">🌟</div>
          <h4 style="color:var(--green-dark);margin-bottom:0.5rem">Great News!</h4>
          <p style="margin:0">Your health indicators look balanced. Explore our full range to maintain your wellbeing.</p>
          <a href="products.html" class="btn btn-primary" style="margin-top:1.2rem">Browse Our Range</a>
        </div>
      `}

      <div class="quiz-disclaimer">
        <strong>⚕️ Medical Disclaimer:</strong> These recommendations are based on your reported symptoms and are for general wellness guidance only. They are NOT a substitute for professional medical advice, diagnosis, or treatment. Please consult a qualified healthcare provider before starting any new supplement.
      </div>

      <div style="text-align:center;margin-top:2rem">
        <button class="btn btn-outline" onclick="resetQuiz()">← Take Quiz Again</button>
      </div>
    </div>
  `;
}

/* ---------- RESULTS: SPECIFIC ---------- */
function renderSpecificResult(cat, score) {
  const screen = qs('#quiz-results-screen');
  const map = QUIZ.productMap[cat.cat];
  const hasIssue = score >= map?.threshold;

  let productHTML = '';
  if (hasIssue && map) {
    const p = getProductData(map.id);
    if (p) {
      const imgFile = ['diaease','utrohayaat','fevodol'].includes(map.id)
        ? map.id + (map.id === 'diaease' ? '.png' : map.id === 'utrohayaat' ? '.png' : '.png')
        : map.id + '.jpg';
      productHTML = `
        <div class="result-product-card" style="max-width:280px;margin:0 auto 1.5rem">
          <img src="${GITHUB}${imgFile}" alt="${p.name}" loading="lazy">
          <h4>${p.name}</h4>
          <p>${p.desc}</p>
          <div style="display:flex;gap:0.5rem;justify-content:center;flex-wrap:wrap">
            <a href="product-detail.html?id=${map.id}" class="btn btn-outline btn-sm">Learn More</a>
            <a href="https://wa.me/917051056287?text=${encodeURIComponent(`I'd like to order ${p.name}`)}" target="_blank" class="btn btn-primary btn-sm">Order Now</a>
          </div>
        </div>
      `;
    }
  }

  screen.innerHTML = `
    <div style="animation:fadeSlide 0.5s ease;text-align:center">
      <div style="font-size:3rem;margin-bottom:0.5rem">${cat.icon}</div>
      <h3 style="color:var(--green-dark);margin-bottom:0.5rem">${cat.label} Assessment</h3>
      ${hasIssue ? `
        <p style="margin-bottom:2rem">Based on your answers, we recommend:</p>
        ${productHTML}
      ` : `
        <div style="background:rgba(42,70,51,0.06);border-radius:var(--radius);padding:2rem;margin:1.5rem 0">
          <div style="font-size:2rem;margin-bottom:0.5rem">✅</div>
          <h4 style="color:var(--green-dark)">Looks Good!</h4>
          <p style="margin:0">Your responses don't indicate significant ${cat.label.toLowerCase()} concerns. Browse our full range to maintain your health.</p>
        </div>
      `}
      <div class="quiz-disclaimer">
        <strong>⚕️ Medical Disclaimer:</strong> This recommendation is based on your reported symptoms and is for general wellness guidance only. It is NOT a substitute for professional medical advice. Please consult a qualified healthcare provider.
      </div>
      <button class="btn btn-outline" onclick="resetQuiz()" style="margin-top:1.5rem">← Take Quiz Again</button>
    </div>
  `;
}

/* ---------- RESET ---------- */
window.resetQuiz = function() {
  state = {
    mode: null, specificCat: null, gender: null,
    age: null, height: null, weight: null,
    scores: {}, answers: {}, currentStep: 0,
  };
  renderQuiz();
};

/* ---------- INIT ---------- */
document.addEventListener('DOMContentLoaded', renderQuiz);
