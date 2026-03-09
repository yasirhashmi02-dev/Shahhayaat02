/* ============================================================
   SHAH HAYAAT — quiz.js  v3.1
   Smart Health Assessment Engine

   Architecture (matches provided spec):
   - Zero inline onclick in rendered HTML
   - All events via addEventListener after each render
   - Single root: #quizContainer
   - Two modes: Complete (multi-step) | Specific Issue (quick)
   - Weighted scoring (Yes=2, Sometimes=1, No=0)
   - BMI auto-calc with live preview
   - Gender-based question filtering
   - Product images + prices in result cards
   - Progress bar on every question step
   - Step-in animations
   - Medical disclaimer on all result screens
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── GUARD ──────────────────────────────────────────────── */
  const ROOT = document.getElementById('quizContainer');
  if (!ROOT) return;

  /* ── CONSTANTS ──────────────────────────────────────────── */
  const GH = 'https://raw.githubusercontent.com/yasirhashmi02-dev/Shahhayaat02/main/';

  const IMG_MAP = {
    brainchamp:'brainchamp.jpg', shahzyme:'shahzyme.jpg',
    bloodstorm:'bloodstorm.jpg', coughxpro:'coughxpro.jpg',
    musaffakhoon:'musaffakhoon.jpg', panasip:'panasip.jpg',
    livohayaat:'livohayaat.jpg', diaease:'diaease.png',
    orthohayaat:'orthohayaat.jpg', utrohayaat:'utrohayaat.png',
    passionpulse:'passionpulse.jpg', fevodol:'fevodol.png',
  };

  const PRODUCTS = {
    brainchamp:   { name:'Brain Champ',   price:175, desc:'Enhances memory, focus and cognitive function.' },
    shahzyme:     { name:'Shah Zyme',     price:165, desc:'Relieves gas, bloating and digestive discomfort.' },
    bloodstorm:   { name:'Blood Storm',   price:165, desc:'Revitalising tonic for anaemia and low energy.' },
    coughxpro:    { name:'Cough X Pro',   price:90,  desc:'Soothing herbal relief for chronic cough.' },
    musaffakhoon: { name:'Musaffa Khoon', price:165, desc:'Blood purifier for clear, glowing skin.' },
    panasip:      { name:'PanaSip',       price:165, desc:'Fast relief from acidity, heartburn and ulcers.' },
    livohayaat:   { name:'Livo Hayaat',   price:349, desc:'Premium liver health and detox support.' },
    diaease:      { name:'Dia-Ease',      price:695, desc:'Natural support for healthy blood sugar balance.' },
    orthohayaat:  { name:'Ortho Hayaat',  price:649, desc:'Joint pain relief and improved mobility.' },
    utrohayaat:   { name:'Utro Hayaat',   price:625, desc:"Women's reproductive health and hormonal balance." },
    passionpulse: { name:'Passion Pulse', price:599, desc:'Stamina, libido and male vitality booster.' },
    fevodol:      { name:'Fevodol',       price:165, desc:'Immunity booster against fever and infections.' },
  };

  const PRODUCT_MAP = {
    brain:       { id:'brainchamp',   thresh:2 },
    digestion:   { id:'shahzyme',     thresh:2 },
    acidity:     { id:'panasip',      thresh:2 },
    blood:       { id:'bloodstorm',   thresh:2 },
    respiratory: { id:'coughxpro',   thresh:1 },
    skin:        { id:'musaffakhoon', thresh:2 },
    liver:       { id:'livohayaat',   thresh:2 },
    diabetes:    { id:'diaease',      thresh:1 },
    joint:       { id:'orthohayaat',  thresh:2 },
    female:      { id:'utrohayaat',   thresh:2 },
    male:        { id:'passionpulse', thresh:2 },
    immunity:    { id:'fevodol',      thresh:2 },
  };

  const SPECIFIC_CATS = [
    { id:'brain',       icon:'🧠', label:'Brain & Stress',
      questions:['Do you have poor memory or forgetfulness?','Do you experience anxiety or mental stress?','Do you struggle to concentrate?','Do you feel mentally exhausted by day-end?'] },
    { id:'digestion',   icon:'🫁', label:'Digestion',
      questions:['Do you feel bloated or gassy after meals?','Is your digestion slow or sluggish?','Do you have a poor or irregular appetite?','Do you experience frequent indigestion?'] },
    { id:'acidity',     icon:'🔥', label:'Acidity',
      questions:['Do you experience heartburn or a burning chest?','Do you suffer from acid reflux?','Do you have stomach pain or suspected ulcers?'] },
    { id:'blood',       icon:'🩸', label:'Blood & Weakness',
      questions:['Do you feel weak or fatigued frequently?','Do you have pale skin or get breathless easily?','Have you been told you have low haemoglobin?'] },
    { id:'respiratory', icon:'😮‍💨', label:'Cough & Respiratory',
      questions:['Do you have a persistent or recurring cough?','Do you produce excess phlegm or mucus?','Do you suffer from throat irritation or infection?'] },
    { id:'skin',        icon:'✨', label:'Skin Health',
      questions:['Do you have acne, pimples or frequent breakouts?','Do you suffer from psoriasis, eczema or rashes?','Is your skin dull, uneven or blemished?'] },
    { id:'liver',       icon:'🟤', label:'Liver Health',
      questions:['Do you have unexplained fatigue or jaundice history?','Have you been diagnosed with fatty liver?','Do you have high cholesterol or triglycerides?'] },
    { id:'diabetes',    icon:'🍬', label:'Blood Sugar',
      questions:['Do you have high blood sugar levels?','Do you feel excessively thirsty or urinate frequently?','Are you borderline or pre-diabetic?'] },
    { id:'joint',       icon:'🦴', label:'Joint & Bone',
      questions:['Do you suffer from joint pain or arthritis?','Do you feel stiff in your joints in the morning?','Has your mobility or flexibility decreased?'] },
    { id:'female',      icon:'🌸', label:'Female Health',
      questions:['Do you have irregular or painful menstrual cycles?','Do you experience unusual vaginal discharge?','Do you suspect hormonal imbalance or PCOD/PCOS?'] },
    { id:'male',        icon:'⚡', label:'Male Vitality',
      questions:['Do you have low physical stamina or endurance?','Do you have concerns about libido or sexual health?','Do you have reproductive health concerns?'] },
    { id:'immunity',    icon:'🛡️', label:'Immunity & Fever',
      questions:['Do you get fevers frequently?','Do you fall sick (colds/infections) repeatedly?','Do you feel your immune system is generally weak?'] },
  ];

  const COMPLETE_QUESTIONS = [
    { q:'Do you experience poor memory or forgetfulness?',          cat:'brain',       w:2 },
    { q:'Do you suffer from stress, anxiety or mental fatigue?',    cat:'brain',       w:2 },
    { q:'Do you have difficulty concentrating or brain fog?',       cat:'brain',       w:1 },
    { q:'Do you frequently experience gas or bloating?',            cat:'digestion',   w:2 },
    { q:'Do you have difficulty digesting food?',                   cat:'digestion',   w:2 },
    { q:'Do you suffer from acidity, heartburn or ulcers?',         cat:'acidity',     w:2 },
    { q:'Do you feel weak, fatigued or low on energy?',             cat:'blood',       w:2 },
    { q:'Have you been told you have anaemia or low haemoglobin?',  cat:'blood',       w:2 },
    { q:'Do you have a chronic cough or respiratory issues?',       cat:'respiratory', w:2 },
    { q:'Do you get fevers or fall sick frequently?',               cat:'immunity',    w:2 },
    { q:'Do you have liver issues or high cholesterol?',            cat:'liver',       w:2 },
    { q:'Do you have high blood sugar or suspect diabetes?',        cat:'diabetes',    w:2 },
    { q:'Do you have joint pain, arthritis or stiffness?',          cat:'joint',       w:2 },
    { q:'Do you have chronic skin issues like acne or psoriasis?',  cat:'skin',        w:2 },
  ];

  const FEMALE_QS = [
    { q:'Do you have irregular or painful menstrual cycles?',       cat:'female', w:2 },
    { q:'Do you experience unusual vaginal discharge?',             cat:'female', w:2 },
    { q:'Do you suspect hormonal imbalance or PCOD/PCOS?',          cat:'female', w:2 },
  ];
  const MALE_QS = [
    { q:'Do you have low physical stamina or endurance?',           cat:'male',   w:2 },
    { q:'Do you have concerns about libido or sexual health?',      cat:'male',   w:2 },
    { q:'Do you have reproductive health concerns?',                cat:'male',   w:2 },
  ];

  const DISCLAIMER = `
    <div style="background:rgba(42,70,51,0.05);border-left:3px solid var(--green-light);
                border-radius:0 8px 8px 0;padding:0.95rem 1.2rem;margin-top:1.8rem;
                font-size:0.82rem;color:var(--text-muted);line-height:1.65">
      <strong>⚕️ Medical Disclaimer:</strong> These recommendations are based on your reported symptoms
      and are for general wellness guidance only. They are <strong>not</strong> a substitute for
      professional medical advice, diagnosis or treatment. Please consult a qualified healthcare
      provider before starting any supplement.
    </div>`;

  /* ── STATE ──────────────────────────────────────────────── */
  let scores = {};
  let userData = {};
  let allQuestions = [];
  let qIndex = 0;

  function resetScores() {
    scores = {
      brain:0, digestion:0, acidity:0, blood:0, respiratory:0,
      skin:0, liver:0, diabetes:0, joint:0, female:0, male:0, immunity:0
    };
    userData = {};
    allQuestions = [];
    qIndex = 0;
  }

  /* ── HELPERS ────────────────────────────────────────────── */
  function setHTML(str) {
    ROOT.innerHTML = str;
    const card = ROOT.querySelector('.qcard');
    if (card) {
      card.style.opacity = '0';
      card.style.transform = 'translateY(16px)';
      requestAnimationFrame(() => {
        card.style.transition = 'opacity 0.36s ease, transform 0.36s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      });
    }
  }

  function imgSrc(id) { return GH + (IMG_MAP[id] || id); }

  function bmiInfo(b) {
    if (b < 18.5) return { cat:'Underweight', color:'#2196F3' };
    if (b < 25)   return { cat:'Normal',      color:'#4CAF50' };
    if (b < 30)   return { cat:'Overweight',  color:'#FF9800' };
    return               { cat:'Obese',        color:'#F44336' };
  }

  function scoreLbl(s, mx) {
    const r = s / mx;
    if (r < 0.33) return { lbl:'Healthy',         c:'#4CAF50' };
    if (r < 0.66) return { lbl:'Mild Concern',    c:'#FF9800' };
    return               { lbl:'Needs Attention', c:'#F44336' };
  }

  function progressBar(cur, total) {
    const pct = Math.round((cur / total) * 100);
    return `
      <div style="margin-bottom:1.6rem">
        <div style="display:flex;justify-content:space-between;font-size:0.76rem;
                    color:var(--text-muted);margin-bottom:0.4rem">
          <span>Question ${cur} of ${total}</span><span>${pct}%</span>
        </div>
        <div style="height:6px;background:var(--border);border-radius:3px;overflow:hidden">
          <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,var(--green-dark),var(--green-light));
                      border-radius:3px;transition:width 0.45s ease"></div>
        </div>
      </div>`;
  }

  const CARD_STYLE = `
    class="qcard"
    style="background:var(--bg-white);border:1px solid var(--border);border-radius:var(--radius);
           padding:clamp(1.6rem,4vw,2.5rem);max-width:720px;margin:0 auto;box-shadow:var(--shadow-sm)"`;

  function optBtn(val, label) {
    return `
      <button data-val="${val}"
        style="border:2px solid var(--border);background:var(--bg-cream);border-radius:var(--radius-sm);
               padding:0.82rem 0.5rem;cursor:pointer;font-size:0.9rem;font-weight:600;
               color:var(--text-mid);transition:all 0.2s;font-family:var(--font-body);
               width:100%;text-align:center">
        ${label}
      </button>`;
  }

  function wireOptBtns(onPick) {
    ROOT.querySelectorAll('[data-val]').forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        btn.style.borderColor = 'var(--green-dark)';
        btn.style.background = 'rgba(42,70,51,0.07)';
        btn.style.transform = 'translateY(-2px)';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.borderColor = 'var(--border)';
        btn.style.background = 'var(--bg-cream)';
        btn.style.transform = '';
      });
      btn.addEventListener('click', () => onPick(btn.dataset.val));
    });
  }

  function modeCardHover(btn) {
    btn.addEventListener('mouseenter', () => {
      btn.style.borderColor = 'var(--green-dark)';
      btn.style.background = 'rgba(42,70,51,0.05)';
      btn.style.transform = 'translateY(-3px)';
      btn.style.boxShadow = 'var(--shadow-md)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.borderColor = 'var(--border)';
      btn.style.background = 'var(--bg-cream)';
      btn.style.transform = '';
      btn.style.boxShadow = '';
    });
  }

  /* ─────────────────────────────────────────
     SCREEN 1 — MODE SELECTION
  ───────────────────────────────────────── */
  function renderModeSelection() {
    resetScores();
    setHTML(`
      <div ${CARD_STYLE}>
        <div style="text-align:center;margin-bottom:2rem">
          <div style="font-size:2.4rem;margin-bottom:0.55rem">🌿</div>
          <h3 style="color:var(--green-dark);margin-bottom:0.4rem">How would you like to proceed?</h3>
          <p style="font-size:0.9rem">Choose the assessment type that fits your needs.</p>
        </div>
        <div style="display:grid;gap:1rem;grid-template-columns:1fr 1fr">
          <button id="completeMode"
            style="background:var(--bg-cream);border:2px solid var(--border);border-radius:var(--radius);
                   padding:1.6rem 1.2rem;cursor:pointer;transition:all 0.25s;text-align:center;
                   font-family:var(--font-body)">
            <div style="font-size:2rem;margin-bottom:0.6rem">🏥</div>
            <strong style="display:block;color:var(--green-dark);font-size:0.97rem;margin-bottom:0.3rem">
              Complete Health Analysis
            </strong>
            <span style="font-size:0.8rem;color:var(--text-muted)">
              All categories · Full snapshot · Up to 4 recommendations
            </span>
          </button>
          <button id="specificMode"
            style="background:var(--bg-cream);border:2px solid var(--border);border-radius:var(--radius);
                   padding:1.6rem 1.2rem;cursor:pointer;transition:all 0.25s;text-align:center;
                   font-family:var(--font-body)">
            <div style="font-size:2rem;margin-bottom:0.6rem">🎯</div>
            <strong style="display:block;color:var(--green-dark);font-size:0.97rem;margin-bottom:0.3rem">
              Check Specific Issue
            </strong>
            <span style="font-size:0.8rem;color:var(--text-muted)">
              3–4 questions · One concern · Instant recommendation
            </span>
          </button>
        </div>
      </div>
    `);

    const cBtn = ROOT.querySelector('#completeMode');
    const sBtn = ROOT.querySelector('#specificMode');
    modeCardHover(cBtn);
    modeCardHover(sBtn);
    cBtn.addEventListener('click', renderBasicInfo);
    sBtn.addEventListener('click', renderSpecificCategorySelect);
  }

  /* ─────────────────────────────────────────
     SCREEN 2A — SPECIFIC CATEGORY SELECT
  ───────────────────────────────────────── */
  function renderSpecificCategorySelect() {
    setHTML(`
      <div ${CARD_STYLE}>
        <div style="margin-bottom:1.8rem">
          <h3 style="color:var(--green-dark);margin-bottom:0.35rem">Select Your Health Concern</h3>
          <p style="font-size:0.88rem">We'll ask a few focused questions and recommend the right product.</p>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(118px,1fr));
                    gap:0.65rem;margin-bottom:2rem" id="cat-grid">
          ${SPECIFIC_CATS.map(c => `
            <button data-cat="${c.id}"
              style="background:var(--bg-cream);border:2px solid var(--border);border-radius:var(--radius-sm);
                     padding:1rem 0.6rem;cursor:pointer;transition:all 0.22s;text-align:center;
                     font-family:var(--font-body)">
              <div style="font-size:1.55rem;margin-bottom:0.32rem">${c.icon}</div>
              <span style="font-size:0.76rem;font-weight:700;color:var(--green-dark)">${c.label}</span>
            </button>`).join('')}
        </div>
        <button id="backToMode"
          style="background:none;border:none;cursor:pointer;font-size:0.88rem;
                 font-weight:600;color:var(--text-muted);font-family:var(--font-body);padding:0">
          ← Back
        </button>
      </div>
    `);

    ROOT.querySelectorAll('[data-cat]').forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        btn.style.borderColor = 'var(--green-dark)';
        btn.style.background = 'rgba(42,70,51,0.05)';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.borderColor = 'var(--border)';
        btn.style.background = 'var(--bg-cream)';
      });
      btn.addEventListener('click', () => {
        const catDef = SPECIFIC_CATS.find(c => c.id === btn.dataset.cat);
        renderSpecificQuestions(catDef, 0);
      });
    });
    ROOT.querySelector('#backToMode').addEventListener('click', renderModeSelection);
  }

  /* ─────────────────────────────────────────
     SCREEN 2B — SPECIFIC QUESTIONS
  ───────────────────────────────────────── */
  function renderSpecificQuestions(catDef, idx) {
    if (idx >= catDef.questions.length) {
      renderSpecificResult(catDef);
      return;
    }

    const q     = catDef.questions[idx];
    const total = catDef.questions.length;

    setHTML(`
      <div ${CARD_STYLE}>
        ${progressBar(idx + 1, total)}
        <div style="margin-bottom:1.5rem">
          <span style="font-size:0.7rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
                       color:var(--gold)">${catDef.icon} ${catDef.label}</span>
          <p style="margin:0.55rem 0 0;font-size:1.04rem;font-weight:600;
                    color:var(--text-dark);line-height:1.55">${q}</p>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.5rem;margin-bottom:1.8rem">
          ${optBtn('yes','✓ Yes')}
          ${optBtn('sometimes','~ Sometimes')}
          ${optBtn('no','✗ No')}
        </div>
        <button id="backBtn"
          style="background:none;border:none;cursor:pointer;font-size:0.88rem;
                 font-weight:600;color:var(--text-muted);font-family:var(--font-body);padding:0">
          ${idx > 0 ? '← Back' : '← Choose different issue'}
        </button>
      </div>
    `);

    wireOptBtns(val => {
      const add = val === 'yes' ? 2 : val === 'sometimes' ? 1 : 0;
      scores[catDef.id] = (scores[catDef.id] || 0) + add;
      renderSpecificQuestions(catDef, idx + 1);
    });

    ROOT.querySelector('#backBtn').addEventListener('click', () => {
      scores[catDef.id] = Math.max(0, (scores[catDef.id] || 0) - 2); // rough undo
      if (idx > 0) renderSpecificQuestions(catDef, idx - 1);
      else renderSpecificCategorySelect();
    });
  }

  /* ─────────────────────────────────────────
     SCREEN 2C — SPECIFIC RESULT
  ───────────────────────────────────────── */
  function renderSpecificResult(catDef) {
    const map      = PRODUCT_MAP[catDef.id];
    const score    = scores[catDef.id] || 0;
    const hasIssue = map && score >= map.thresh;
    const prod     = hasIssue ? PRODUCTS[map.id] : null;

    setHTML(`
      <div ${CARD_STYLE}>
        <div style="text-align:center;margin-bottom:1.8rem">
          <div style="font-size:2.4rem;margin-bottom:0.45rem">${catDef.icon}</div>
          <h3 style="color:var(--green-dark);margin-bottom:0.3rem">${catDef.label} Assessment</h3>
          <p style="font-size:0.86rem">Based on your ${catDef.questions.length} responses</p>
        </div>

        ${hasIssue && prod ? `
          <p style="text-align:center;margin-bottom:1.4rem;font-weight:600;color:var(--green-dark)">
            We recommend the following for you:
          </p>
          <div style="max-width:255px;margin:0 auto 1.6rem">
            <div style="background:var(--bg-cream);border:1px solid var(--border);
                        border-radius:var(--radius);overflow:hidden;text-align:center">
              <img src="${imgSrc(map.id)}" alt="${prod.name}" loading="lazy"
                   style="width:100%;height:168px;object-fit:cover"
                   onerror="this.src='${GH}logo.jpg'">
              <div style="padding:1.1rem 0.9rem">
                <h4 style="color:var(--green-dark);margin-bottom:0.28rem">${prod.name}</h4>
                <p style="font-size:0.8rem;margin-bottom:0.75rem">${prod.desc}</p>
                <div style="font-size:1.18rem;font-weight:800;color:var(--green-dark);margin-bottom:0.75rem">
                  ₹${prod.price}
                </div>
                <div style="display:flex;gap:0.45rem;justify-content:center;flex-wrap:wrap">
                  <a href="product-detail.html?id=${map.id}"
                     style="padding:0.48rem 1.1rem;border-radius:50px;border:2px solid var(--green-dark);
                            color:var(--green-dark);font-size:0.8rem;font-weight:700;
                            text-decoration:none;transition:all 0.2s">
                    Learn More
                  </a>
                  <a href="https://wa.me/917051056287?text=${encodeURIComponent('Hi! I\'d like to order ' + prod.name + ' — ₹' + prod.price)}"
                     target="_blank" rel="noopener"
                     style="padding:0.48rem 1.1rem;border-radius:50px;
                            background:linear-gradient(135deg,#B8860B,#D4A017);color:#fff;
                            font-size:0.8rem;font-weight:700;text-decoration:none">
                    Order Now
                  </a>
                </div>
              </div>
            </div>
          </div>` : `
          <div style="background:rgba(42,70,51,0.06);border-radius:var(--radius);padding:1.8rem;
                      text-align:center;margin-bottom:1.4rem">
            <div style="font-size:1.9rem;margin-bottom:0.45rem">✅</div>
            <h4 style="color:var(--green-dark);margin-bottom:0.35rem">Looking Good!</h4>
            <p style="margin:0">Your responses don't indicate a significant ${catDef.label.toLowerCase()} concern.
               Keep up the good work and browse our range to stay well.</p>
          </div>`}

        ${DISCLAIMER}

        <div style="display:flex;gap:0.8rem;justify-content:center;flex-wrap:wrap;margin-top:1.5rem">
          <button id="checkAnother"
            style="padding:0.68rem 1.5rem;border-radius:50px;border:2px solid var(--green-dark);
                   background:transparent;color:var(--green-dark);font-weight:700;cursor:pointer;
                   font-family:var(--font-body);font-size:0.88rem">
            Check Another Issue
          </button>
          <button id="restartQuiz"
            style="padding:0.68rem 1.5rem;border-radius:50px;border:none;
                   background:linear-gradient(135deg,#B8860B,#D4A017);color:#fff;
                   font-weight:700;cursor:pointer;font-family:var(--font-body);font-size:0.88rem">
            Start Over
          </button>
        </div>
      </div>
    `);

    ROOT.querySelector('#checkAnother').addEventListener('click', renderSpecificCategorySelect);
    ROOT.querySelector('#restartQuiz').addEventListener('click', renderModeSelection);
  }

  /* ─────────────────────────────────────────
     SCREEN 3 — BASIC INFO (COMPLETE MODE)
  ───────────────────────────────────────── */
  function renderBasicInfo() {
    setHTML(`
      <div ${CARD_STYLE}>
        <div style="margin-bottom:1.6rem">
          <span style="font-size:0.7rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
                       color:var(--gold)">Step 1 of 4 — About You</span>
          <h3 style="color:var(--green-dark);margin:0.38rem 0 0.3rem">Basic Information</h3>
          <p style="font-size:0.88rem">Help us personalise your health assessment.</p>
        </div>

        <div style="display:grid;gap:0.95rem;grid-template-columns:1fr 1fr;margin-bottom:0.9rem">
          <div>
            <label for="qi-gender"
              style="display:block;font-size:0.82rem;font-weight:600;color:var(--green-dark);margin-bottom:0.32rem">
              Gender *
            </label>
            <select id="qi-gender"
              style="width:100%;padding:0.72rem 1rem;border:1.5px solid var(--border);
                     border-radius:8px;font-family:var(--font-body);font-size:0.95rem;
                     background:var(--bg-white);color:var(--text-dark);outline:none;cursor:pointer">
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div>
            <label for="qi-age"
              style="display:block;font-size:0.82rem;font-weight:600;color:var(--green-dark);margin-bottom:0.32rem">
              Age (years) *
            </label>
            <input id="qi-age" type="number" min="10" max="90" placeholder="e.g. 30"
              style="width:100%;padding:0.72rem 1rem;border:1.5px solid var(--border);
                     border-radius:8px;font-family:var(--font-body);font-size:0.95rem;
                     background:var(--bg-white);color:var(--text-dark);outline:none">
          </div>
          <div>
            <label for="qi-height"
              style="display:block;font-size:0.82rem;font-weight:600;color:var(--green-dark);margin-bottom:0.32rem">
              Height (cm) *
            </label>
            <input id="qi-height" type="number" min="120" max="230" placeholder="e.g. 165"
              style="width:100%;padding:0.72rem 1rem;border:1.5px solid var(--border);
                     border-radius:8px;font-family:var(--font-body);font-size:0.95rem;
                     background:var(--bg-white);color:var(--text-dark);outline:none">
          </div>
          <div>
            <label for="qi-weight"
              style="display:block;font-size:0.82rem;font-weight:600;color:var(--green-dark);margin-bottom:0.32rem">
              Weight (kg) *
            </label>
            <input id="qi-weight" type="number" min="30" max="200" placeholder="e.g. 68"
              style="width:100%;padding:0.72rem 1rem;border:1.5px solid var(--border);
                     border-radius:8px;font-family:var(--font-body);font-size:0.95rem;
                     background:var(--bg-white);color:var(--text-dark);outline:none">
          </div>
        </div>

        <!-- Live BMI Preview -->
        <div id="bmi-preview" style="display:none;background:rgba(42,70,51,0.07);border-radius:8px;
                                      padding:0.72rem 1rem;margin-bottom:0.9rem;font-size:0.86rem;
                                      color:var(--green-dark)"></div>

        <div style="display:flex;justify-content:space-between;align-items:center;gap:1rem;margin-top:0.4rem">
          <button id="backBtn"
            style="background:none;border:none;cursor:pointer;font-size:0.88rem;font-weight:600;
                   color:var(--text-muted);font-family:var(--font-body);padding:0">
            ← Back
          </button>
          <button id="startQuiz"
            style="padding:0.78rem 2rem;border-radius:50px;border:none;
                   background:linear-gradient(135deg,#B8860B,#D4A017);color:#fff;
                   font-weight:700;cursor:pointer;font-family:var(--font-body);font-size:0.9rem">
            Start Assessment →
          </button>
        </div>
      </div>
    `);

    /* Live BMI */
    const hEl = ROOT.querySelector('#qi-height');
    const wEl = ROOT.querySelector('#qi-weight');
    const bPrev = ROOT.querySelector('#bmi-preview');

    function updateBMI() {
      const h = parseFloat(hEl.value), w = parseFloat(wEl.value);
      if (h > 100 && w > 20) {
        const b = +(w / ((h / 100) ** 2)).toFixed(1);
        const info = bmiInfo(b);
        bPrev.style.display = 'block';
        bPrev.innerHTML = `<strong>BMI Preview:</strong> ${b} —
          <span style="color:${info.color};font-weight:700">${info.cat}</span>`;
      } else {
        bPrev.style.display = 'none';
      }
    }
    hEl.addEventListener('input', updateBMI);
    wEl.addEventListener('input', updateBMI);

    /* Focus ring */
    ['#qi-gender','#qi-age','#qi-height','#qi-weight'].forEach(sel => {
      const el = ROOT.querySelector(sel);
      el.addEventListener('focus', () => { el.style.borderColor='var(--green-light)'; el.style.boxShadow='0 0 0 3px rgba(77,124,93,0.14)'; });
      el.addEventListener('blur',  () => { el.style.borderColor='var(--border)'; el.style.boxShadow=''; });
    });

    ROOT.querySelector('#backBtn').addEventListener('click', renderModeSelection);

    ROOT.querySelector('#startQuiz').addEventListener('click', () => {
      const gender = ROOT.querySelector('#qi-gender').value;
      const age    = parseInt(ROOT.querySelector('#qi-age').value);
      const height = parseFloat(ROOT.querySelector('#qi-height').value);
      const weight = parseFloat(ROOT.querySelector('#qi-weight').value);

      if (!gender)                      { ROOT.querySelector('#qi-gender').focus(); alert('Please select your gender.'); return; }
      if (!age || age < 10 || age > 90) { ROOT.querySelector('#qi-age').focus();    alert('Please enter a valid age (10–90).'); return; }
      if (!height||height<120||height>230){ ROOT.querySelector('#qi-height').focus();alert('Please enter height between 120–230 cm.'); return; }
      if (!weight||weight<30||weight>200) { ROOT.querySelector('#qi-weight').focus();alert('Please enter weight between 30–200 kg.'); return; }

      const bmi = +(weight / ((height / 100) ** 2)).toFixed(1);
      userData = { gender, age, height, weight, bmi, bmiInfo: bmiInfo(bmi) };

      /* BMI bonus scoring */
      if (bmi >= 30) { scores.diabetes += 1; scores.joint += 1; }

      allQuestions = [...COMPLETE_QUESTIONS, ...(gender === 'female' ? FEMALE_QS : MALE_QS)];
      qIndex = 0;
      renderCompleteQuestion();
    });
  }

  /* ─────────────────────────────────────────
     SCREEN 4 — COMPLETE QUESTIONS
  ───────────────────────────────────────── */
  function renderCompleteQuestion() {
    if (qIndex >= allQuestions.length) {
      renderCompleteResults();
      return;
    }

    const q     = allQuestions[qIndex];
    const total = allQuestions.length;

    setHTML(`
      <div ${CARD_STYLE}>
        <span style="font-size:0.7rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
                     color:var(--gold)">Step 2 of 4 — Health Assessment</span>
        ${progressBar(qIndex + 1, total)}
        <p style="font-size:1.04rem;font-weight:600;color:var(--text-dark);
                  line-height:1.55;margin-bottom:1.6rem">${q.q}</p>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.5rem;margin-bottom:1.8rem">
          ${optBtn('yes','✓ Yes')}
          ${optBtn('sometimes','~ Sometimes')}
          ${optBtn('no','✗ No')}
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <button id="backBtn"
            style="background:none;border:none;cursor:pointer;font-size:0.88rem;
                   font-weight:600;color:var(--text-muted);font-family:var(--font-body);padding:0">
            ${qIndex > 0 ? '← Back' : '← Re-enter info'}
          </button>
          <span style="font-size:0.76rem;color:var(--text-muted)">${total - qIndex - 1} remaining</span>
        </div>
      </div>
    `);

    wireOptBtns(val => {
      const add = val === 'yes' ? q.w : val === 'sometimes' ? Math.ceil(q.w / 2) : 0;
      scores[q.cat] = (scores[q.cat] || 0) + add;
      qIndex++;
      renderCompleteQuestion();
    });

    ROOT.querySelector('#backBtn').addEventListener('click', () => {
      if (qIndex > 0) { qIndex--; renderCompleteQuestion(); }
      else renderBasicInfo();
    });
  }

  /* ─────────────────────────────────────────
     SCREEN 5 — COMPLETE RESULTS
  ───────────────────────────────────────── */
  function renderCompleteResults() {
    /* Build recommendations */
    const recs = [];
    for (const [cat, map] of Object.entries(PRODUCT_MAP)) {
      if (cat === 'female' && userData.gender !== 'female') continue;
      if (cat === 'male'   && userData.gender !== 'male')   continue;
      if ((scores[cat] || 0) >= map.thresh) recs.push({ cat, ...map });
    }
    const top4 = recs.slice(0, 4);

    const bi   = userData.bmiInfo;
    const brn  = scoreLbl(scores.brain || 0, 6);
    const dig  = scoreLbl((scores.digestion || 0) + (scores.acidity || 0), 6);
    const nrg  = scoreLbl(scores.blood || 0, 4);
    const imm  = scoreLbl(scores.immunity || 0, 4);

    setHTML(`
      <div ${CARD_STYLE}>
        <div style="text-align:center;margin-bottom:2rem">
          <div style="font-size:2.4rem;margin-bottom:0.45rem">🎯</div>
          <h3 style="color:var(--green-dark);margin-bottom:0.3rem">Your Health Snapshot</h3>
          <p style="font-size:0.86rem">Based on your complete ${allQuestions.length}-question assessment</p>
        </div>

        <!-- Snapshot Grid -->
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));
                    gap:0.8rem;margin-bottom:2.2rem">
          ${[
            { icon:'⚖️', lbl:'BMI',       val:userData.bmi, sub:bi.cat,   c:bi.color },
            { icon:'🧠', lbl:'Mental',    val:brn.lbl,       c:brn.c },
            { icon:'🫁', lbl:'Digestion', val:dig.lbl,       c:dig.c },
            { icon:'⚡', lbl:'Energy',    val:nrg.lbl,       c:nrg.c },
            { icon:'🛡️', lbl:'Immunity',  val:imm.lbl,       c:imm.c },
          ].map(s => `
            <div style="background:var(--bg-cream);border:1px solid var(--border);border-radius:8px;
                        padding:0.85rem 0.6rem;text-align:center">
              <div style="font-size:1.5rem;margin-bottom:0.3rem">${s.icon}</div>
              <div style="font-size:0.64rem;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;
                          color:var(--text-muted);margin-bottom:0.18rem">${s.lbl}</div>
              <div style="font-size:0.88rem;font-weight:800;color:${s.c}">${s.val}</div>
              ${s.sub ? `<div style="font-size:0.68rem;color:${s.c}">${s.sub}</div>` : ''}
            </div>`).join('')}
        </div>

        <!-- Recommended Products -->
        ${top4.length > 0 ? `
          <h4 style="color:var(--green-dark);margin-bottom:0.45rem">🌿 Recommended for You</h4>
          <p style="font-size:0.84rem;margin-bottom:1.2rem">Products matched to your reported health concerns:</p>
          <div style="display:grid;gap:1rem;grid-template-columns:repeat(auto-fill,minmax(165px,1fr));
                      margin-bottom:1.5rem">
            ${top4.map(r => {
              const p = PRODUCTS[r.id];
              return p ? `
                <div style="background:var(--bg-cream);border:1px solid var(--border);
                            border-radius:var(--radius);overflow:hidden;text-align:center">
                  <img src="${imgSrc(r.id)}" alt="${p.name}" loading="lazy"
                       style="width:100%;height:128px;object-fit:cover"
                       onerror="this.src='${GH}logo.jpg'">
                  <div style="padding:0.85rem 0.75rem">
                    <h4 style="color:var(--green-dark);font-size:0.86rem;margin-bottom:0.25rem">${p.name}</h4>
                    <p style="font-size:0.75rem;margin-bottom:0.65rem;line-height:1.5">${p.desc}</p>
                    <a href="product-detail.html?id=${r.id}"
                       style="display:block;padding:0.45rem;border-radius:50px;
                              border:2px solid var(--green-dark);color:var(--green-dark);
                              font-size:0.76rem;font-weight:700;text-decoration:none;text-align:center">
                      Learn More
                    </a>
                  </div>
                </div>` : '';
            }).join('')}
          </div>` : `
          <div style="background:rgba(42,70,51,0.06);border-radius:var(--radius);padding:1.8rem;
                      text-align:center;margin-bottom:1.5rem">
            <div style="font-size:2rem;margin-bottom:0.45rem">🌟</div>
            <h4 style="color:var(--green-dark);margin-bottom:0.35rem">Great News!</h4>
            <p style="margin:0">Your health indicators look well-balanced.
               <a href="products.html" style="color:var(--gold);font-weight:700">Browse our range</a>
               to stay well.</p>
          </div>`}

        ${DISCLAIMER}

        <div style="text-align:center;margin-top:1.5rem">
          <button id="restartQuiz"
            style="padding:0.72rem 1.8rem;border-radius:50px;border:2px solid var(--green-dark);
                   background:transparent;color:var(--green-dark);font-weight:700;cursor:pointer;
                   font-family:var(--font-body);font-size:0.9rem">
            ← Start Over
          </button>
        </div>
      </div>
    `);

    ROOT.querySelector('#restartQuiz').addEventListener('click', renderModeSelection);
  }

  /* ── INIT ───────────────────────────────────────────────── */
  renderModeSelection();

}); /* end DOMContentLoaded */
