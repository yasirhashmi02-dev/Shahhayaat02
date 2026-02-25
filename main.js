/* ============================================================
   SHAH HAYAAT — main.js  v2.0
   All shared data + UI: nav, scroll, carousel, animations,
   product grid, blog grid, contact form, FAQ
   ============================================================ */
'use strict';

/* ── CONSTANTS ─────────────────────────────────────────────── */
const GH = 'https://raw.githubusercontent.com/yasirhashmi02-dev/Shahhayaat02/main/';

/* Image filename map — exact filenames, case-sensitive */
const IMG = {
  brainchamp:   'brainchamp.jpg',
  shahzyme:     'shahzyme.jpg',
  bloodstorm:   'bloodstorm.jpg',
  coughxpro:    'coughxpro.jpg',
  musaffakhoon: 'musaffakhoon.jpg',
  panasip:      'panasip.jpg',
  livohayaat:   'livohayaat.jpg',
  diaease:      'diaease.png',
  orthohayaat:  'orthohayaat.jpg',
  utrohayaat:   'utrohayaat.png',
  passionpulse: 'passionpulse.jpg',
  fevodol:      'fevodol.png',
};

function imgSrc(id) { return GH + (IMG[id] || id); }

/* ── PRODUCT DATA ───────────────────────────────────────────── */
const PRODUCTS = [
  {
    id: 'brainchamp', name: 'Brain Champ', price: 175, cat: 'brain', tag: 'Brain & Focus',
    desc: 'Enhances memory, focus and cognitive function with powerful Ayurvedic herbs.',
    full: 'Brain Champ is a scientifically formulated Ayurvedic supplement combining Brahmi, Shankhpushpi, Ashwagandha and other classical herbs to support optimal brain health. It helps reduce mental fatigue, improve concentration and enhance memory retention naturally.',
    benefits: ['Improves memory & recall', 'Reduces mental fatigue & brain fog', 'Manages stress & anxiety naturally', 'Enhances focus & concentration', 'Adaptogen blend for long-term brain health'],
    ingredients: 'Brahmi (Bacopa monnieri), Shankhpushpi, Ashwagandha, Jatamansi, Vacha',
    dosage: '2 tablets twice daily with warm milk or water, preferably after meals.',
    precautions: 'Not recommended during pregnancy. Consult a physician if you are on existing medication.',
  },
  {
    id: 'shahzyme', name: 'Shah Zyme', price: 165, cat: 'digestion', tag: 'Digestion',
    desc: 'Effective digestive enzyme syrup for relief from gas, bloating and indigestion.',
    full: 'Shah Zyme is a potent herbal digestive enzyme syrup. Its unique combination of digestive herbs helps break down food efficiently, relieving uncomfortable symptoms of gas, bloating and sluggish digestion after meals.',
    benefits: ['Relieves gas & bloating', 'Improves nutrient absorption', 'Stimulates healthy appetite', 'Supports enzyme activity', 'Reduces post-meal heaviness'],
    ingredients: 'Ajwain, Saunf (Fennel), Jeera (Cumin), Pudina (Mint), Harad, Baheda, Amla',
    dosage: '10–15 ml after meals, twice daily. Shake well before use.',
    precautions: 'Store in a cool, dry place. Not for children under 5 years without medical advice.',
  },
  {
    id: 'bloodstorm', name: 'Blood Storm', price: 165, cat: 'blood', tag: 'Blood & Immunity',
    desc: 'Revitalizing blood tonic to combat anemia, weakness and low hemoglobin.',
    full: 'Blood Storm is a premium Ayurvedic blood tonic combining iron-rich herbs with powerful rejuvenating ingredients. Formulated to naturally raise hemoglobin levels, improve circulation and restore energy to those suffering from anemia and chronic weakness.',
    benefits: ['Raises hemoglobin naturally', 'Combats iron-deficiency anemia', 'Restores energy & vitality', 'Improves blood circulation', 'Strengthens overall immunity'],
    ingredients: 'Loha Bhasma, Punarnava, Shatavari, Ashwagandha, Amla, Draksha',
    dosage: '2 tablets twice daily with water or milk after meals.',
    precautions: 'Keep out of reach of children. Consult a physician before use during pregnancy.',
  },
  {
    id: 'coughxpro', name: 'Cough X Pro', price: 90, cat: 'respiratory', tag: 'Respiratory',
    desc: 'Soothing herbal cough syrup for fast, lasting relief from chronic cough.',
    full: 'Cough X Pro is a time-tested Ayurvedic formulation that soothes the respiratory tract, reduces inflammation and provides lasting relief from acute and chronic cough. Its herbal ingredients work synergistically to clear mucus and calm irritated airways.',
    benefits: ['Soothes throat irritation', 'Reduces mucus congestion', 'Anti-inflammatory action', 'Fast & lasting relief', 'Safe for adults & children'],
    ingredients: 'Tulsi (Holy Basil), Mulethi (Licorice), Adrak (Ginger), Pippali, Vasa, Honey',
    dosage: '10 ml three times daily. Children (5–12): 5 ml three times daily.',
    precautions: 'Diabetics should consult a physician due to natural honey content. Avoid overdose.',
  },
  {
    id: 'musaffakhoon', name: 'Musaffa Khoon', price: 165, cat: 'skin', tag: 'Skin Care',
    desc: 'Traditional blood purifier for clear, glowing skin free from acne and disorders.',
    full: 'Musaffa Khoon is a classical Ayurvedic blood purifier that detoxifies the blood and lymphatic system. By purifying from within it effectively addresses the root cause of skin disorders including acne, psoriasis, eczema and dull skin.',
    benefits: ['Purifies blood & lymph', 'Clears acne & pimples', 'Reduces psoriasis symptoms', 'Promotes glowing clear skin', 'Full-body natural detox'],
    ingredients: 'Neem, Manjistha, Khadir, Sarsaparilla, Giloy, Triphala',
    dosage: '2 tablets twice daily with water before meals.',
    precautions: 'Results typically visible after 4–6 weeks of consistent use.',
  },
  {
    id: 'panasip', name: 'PanaSip', price: 165, cat: 'acidity', tag: 'Acidity',
    desc: 'Fast-acting Ayurvedic relief from acidity, heartburn and peptic ulcers.',
    full: 'PanaSip is a powerful Ayurvedic antacid syrup that neutralises excess stomach acid naturally. Its cooling and soothing herbs form a protective layer over the stomach lining, providing rapid relief from acidity, heartburn and gastric ulcers without harsh chemical side effects.',
    benefits: ['Neutralises stomach acid', 'Soothes esophageal inflammation', 'Heals peptic ulcers naturally', 'Prevents acid reflux', 'Promotes healthy gastric pH'],
    ingredients: 'Mulethi, Shatavari, Amalaki, Guduchi, Yashtimadhu, Shankha Bhasma',
    dosage: '15 ml before meals, three times daily. Shake well before use.',
    precautions: 'Take on an empty stomach for best results. Refrigerate after opening.',
  },
  {
    id: 'livohayaat', name: 'Livo Hayaat', price: 349, cat: 'liver', tag: 'Liver Health',
    desc: 'Premium Ayurvedic formulation for optimal liver health and detoxification.',
    full: 'Livo Hayaat is a hepatoprotective Ayurvedic tablet that supports the liver\'s natural detoxification processes. Formulated with liver-protecting herbs, it helps regenerate liver cells, reduce fatty liver, normalise enzyme levels and improve overall hepatic function.',
    benefits: ['Protects & regenerates liver cells', 'Reduces fatty liver condition', 'Normalises liver enzyme levels', 'Supports bile production', 'Powerful antioxidant properties'],
    ingredients: 'Bhumi Amla, Kalmegh, Kutki, Punarnava, Makoy, Kasni',
    dosage: '2 tablets twice daily with warm water before meals.',
    precautions: 'Not for use with hepatotoxic drugs without physician advice.',
  },
  {
    id: 'diaease', name: 'Dia-Ease', price: 695, cat: 'diabetes', tag: 'Diabetes Care',
    desc: 'Advanced Ayurvedic support for maintaining healthy blood sugar balance.',
    full: 'Dia-Ease is a specialised Ayurvedic formulation to help manage blood glucose levels naturally. Its multi-herb approach addresses insulin sensitivity, reduces glucose absorption and supports pancreatic function for comprehensive diabetic management support.',
    benefits: ['Supports healthy blood sugar', 'Improves insulin sensitivity', 'Reduces sugar cravings', 'Supports pancreatic health', 'Helps prevent diabetic complications'],
    ingredients: 'Karela (Bitter Melon), Jamun Seed, Gurmar, Vijaysar, Methi, Neem, Tulsi',
    dosage: '2 tablets twice daily, 30 minutes before meals with warm water.',
    precautions: 'Monitor blood sugar regularly. Do not discontinue prescribed medication without physician guidance.',
  },
  {
    id: 'orthohayaat', name: 'Ortho Hayaat', price: 649, cat: 'joint', tag: 'Joint Care',
    desc: 'Specialised Ayurvedic blend for joint health, pain relief and improved mobility.',
    full: 'Ortho Hayaat combines the most potent anti-inflammatory and analgesic Ayurvedic herbs for comprehensive joint care. It works to reduce inflammation, lubricate joints, strengthen bones and improve mobility — ideal for arthritis, knee pain and age-related joint degeneration.',
    benefits: ['Reduces joint inflammation', 'Relieves chronic joint pain', 'Improves mobility & flexibility', 'Strengthens bones & cartilage', 'Anti-arthritis properties'],
    ingredients: 'Shallaki (Boswellia), Guggul, Rasna, Nirgundi, Ashwagandha, Sunthi',
    dosage: '2 tablets twice daily with warm milk or water after meals.',
    precautions: 'Results typically noticeable within 4–6 weeks of consistent use.',
  },
  {
    id: 'utrohayaat', name: 'Utro Hayaat', price: 625, cat: 'female', tag: 'Female Health',
    desc: "Gentle Ayurvedic tonic for women's reproductive health and hormonal balance.",
    full: 'Utro Hayaat is a carefully formulated Ayurvedic uterine tonic addressing common female health concerns. It helps regulate menstrual cycles, relieve period pain, treat leucorrhoea and support hormonal balance using the safest classical Ayurvedic herbs.',
    benefits: ['Regulates menstrual cycles', 'Relieves painful periods', 'Treats leucorrhoea', 'Supports hormonal balance', 'Strengthens uterine health'],
    ingredients: 'Ashoka, Lodhra, Shatavari, Nagkesar, Daruharidra, Kumari (Aloe)',
    dosage: '2 tablets twice daily after meals with milk or water.',
    precautions: 'Not recommended during pregnancy or breastfeeding without medical advice.',
  },
  {
    id: 'passionpulse', name: 'Passion Pulse', price: 599, cat: 'male', tag: 'Male Vitality',
    desc: 'Natural vitality booster for men — stamina, libido and reproductive health.',
    full: 'Passion Pulse is a premium Ayurvedic male vitality supplement combining powerful adaptogens and vajikarana herbs to enhance stamina, improve libido, support testosterone levels and boost overall masculine vitality naturally.',
    benefits: ['Enhances stamina & endurance', 'Improves libido & sexual health', 'Supports testosterone levels', 'Improves sperm health & motility', 'Reduces fatigue & boosts energy'],
    ingredients: 'Ashwagandha, Shilajit, Safed Musli, Kaunch Beej, Gokshura, Vidarikanda',
    dosage: '2 tablets twice daily with milk or warm water before bedtime.',
    precautions: 'Not for use under 18 years. Consult physician if you have existing health conditions.',
  },
  {
    id: 'fevodol', name: 'Fevodol', price: 165, cat: 'immunity', tag: 'Immunity',
    desc: "Powerful immunity booster to defend against fever, infections and illness.",
    full: "Fevodol is an Ayurvedic immune-strengthening formulation supporting the body's natural defence mechanisms. Its antipyretic, anti-infective and immunomodulatory herbs help reduce fever, fight infections and build long-term immunity against recurrent illness.",
    benefits: ['Reduces fever naturally', 'Fights infections', 'Strengthens immune system', 'Anti-inflammatory', 'Prevents recurrent illness'],
    ingredients: 'Giloy (Guduchi), Tulsi, Chirayata, Kutki, Sudarshan Churna',
    dosage: '2 tablets three times daily with warm water during illness. For immunity: twice daily.',
    precautions: 'Continue medical treatment during severe infections. This is a supportive supplement.',
  },
];

/* ── BLOG DATA ─────────────────────────────────────────────── */
const BLOGS = [
  { title: 'Feeling Bloated? 5 Ayurvedic Secrets for a Happy Gut', cat: 'Digestion', img: GH + 'image(3).png', desc: "Tired of that uncomfortable feeling after meals? Discover simple, ancient tips to improve your digestion naturally and feel lighter every day." },
  { title: "Can't Switch Off? How Ashwagandha Calms Modern Stress", cat: 'Wellness', img: GH + 'image(6).png', desc: "In a world that never stops, finding peace can feel impossible. Learn how this powerful adaptogen helps your body manage and recover from stress." },
  { title: 'Beat the Afternoon Slump: Ayurvedic Tips for All-Day Energy', cat: 'Energy', img: GH + 'image(5).png', desc: "If you rely on coffee to get through the day, there's a better way. Discover natural Ayurvedic techniques to maintain vibrant energy from morning to night." },
  { title: 'The Glow-Up from Within: Ayurvedic Secrets for Radiant Skin', cat: 'Skin', img: GH + 'image(4).png', desc: "True radiance starts from the inside. Explore the connection between your diet, digestion and achieving naturally clear, glowing skin." },
  { title: 'Managing Joint Pain Naturally with Ayurveda', cat: 'Joint Care', img: GH + 'image(1).png', desc: "Don't let aches and pains hold you back. Learn about traditional Ayurvedic approaches to soothe joint discomfort and improve your mobility." },
];

/* ── HELPERS ───────────────────────────────────────────────── */
function $(sel, ctx) { return (ctx || document).querySelector(sel); }
function $$(sel, ctx) { return [...(ctx || document).querySelectorAll(sel)]; }

function observeReveal(root) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.1 });
  $$(root ? '.reveal' : '.reveal', root).forEach(el => io.observe(el));
}

/* ── NAVIGATION ────────────────────────────────────────────── */
function initNav() {
  const toggle = $('.nav-toggle');
  if (!toggle) return;
  toggle.addEventListener('click', () => document.body.classList.toggle('nav-open'));
  $$('.nav-mobile a').forEach(a => a.addEventListener('click', () => {
    setTimeout(() => document.body.classList.remove('nav-open'), 320);
  }));
  // Mark active link
  const page = location.pathname.split('/').pop() || 'index.html';
  $$('.nav-desktop a, .nav-mobile a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href === page || (page === '' && href === 'index.html')) a.classList.add('active');
  });
}

/* ── SCROLL ────────────────────────────────────────────────── */
function initScroll() {
  const btn = $('.back-top');
  window.addEventListener('scroll', () => {
    document.body.classList.toggle('scrolled', window.scrollY > 55);
    if (btn) btn.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });
  observeReveal();
}

/* ── HERO CAROUSEL ─────────────────────────────────────────── */
function initCarousel() {
  const slides = $$('.hero-slide');
  const bar = $('.hero-progress');
  if (slides.length < 2) return;

  let cur = 0;
  slides[0].classList.add('active');

  function next() {
    slides[cur].classList.remove('active');
    cur = (cur + 1) % slides.length;
    slides[cur].classList.add('active');
    if (bar) { bar.classList.remove('running'); void bar.offsetWidth; bar.classList.add('running'); }
  }
  if (bar) bar.classList.add('running');
  setInterval(next, 5000);
}

/* ── PRODUCT GRID ──────────────────────────────────────────── */
function renderProducts(container, { limit = null, cat = null } = {}) {
  if (!container) return;
  let list = cat && cat !== 'all' ? PRODUCTS.filter(p => p.cat === cat) : PRODUCTS;
  if (limit) list = list.slice(0, limit);

  container.innerHTML = list.map((p, i) => `
    <div class="product-card reveal delay-${(i % 4) + 1}" data-cat="${p.cat}">
      <div class="product-card-img">
        <img src="${imgSrc(p.id)}" alt="${p.name}" loading="lazy">
        <span class="product-cat-tag">${p.tag}</span>
      </div>
      <div class="product-body">
        <h3>${p.name}</h3>
        <p class="product-desc">${p.desc}</p>
        <div class="product-footer">
          <div class="product-price">₹${p.price}</div>
          <div class="product-actions-row">
            <a href="product-detail.html?id=${p.id}" class="btn btn-outline btn-sm">Details</a>
            <a href="https://wa.me/917051056287?text=${encodeURIComponent(`Hi! I'd like to order ${p.name} — ₹${p.price}`)}"
               target="_blank" rel="noopener" class="btn btn-primary btn-sm">Order</a>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  // Observe new cards
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.1 });
  $$('.reveal', container).forEach(el => io.observe(el));
}

/* ── BLOG GRID ─────────────────────────────────────────────── */
function renderBlogs(container, { limit = null } = {}) {
  if (!container) return;
  const list = limit ? BLOGS.slice(0, limit) : BLOGS;
  container.innerHTML = list.map(b => `
    <a href="blog.html" class="blog-card reveal">
      <div class="blog-card-img"><img src="${b.img}" alt="${b.title}" loading="lazy"></div>
      <div class="blog-body">
        <span class="blog-cat">${b.cat}</span>
        <h3>${b.title}</h3>
        <p>${b.desc}</p>
        <span class="blog-more">Read More →</span>
      </div>
    </a>
  `).join('');
}

/* ── FAQ ACCORDION ─────────────────────────────────────────── */
function initFAQ() {
  $$('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      $$('.faq-item.open').forEach(el => el.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* ── CONTACT FORM ──────────────────────────────────────────── */
function initContactForm() {
  const form = $('#contactForm');
  if (!form) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const status = $('#form-status');
    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    btn.disabled = true; btn.textContent = 'Sending…';
    try {
      const res = await fetch(form.action, {
        method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' }
      });
      if (res.ok) {
        status.textContent = '✓ Message sent! We\'ll be in touch soon.';
        status.className = 'form-status ok';
        form.reset();
      } else {
        status.textContent = 'Something went wrong — please try WhatsApp instead.';
        status.className = 'form-status err';
      }
    } catch {
      status.textContent = 'Network error — please try WhatsApp instead.';
      status.className = 'form-status err';
    }
    btn.disabled = false; btn.textContent = orig;
  });
}

/* ── YEAR ──────────────────────────────────────────────────── */
function setYear() {
  const el = $('#year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ── INIT ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScroll();
  initCarousel();
  initFAQ();
  initContactForm();
  setYear();

  // Homepage grids
  const productPreview = $('#product-preview-grid');
  if (productPreview) renderProducts(productPreview, { limit: 6 });

  const blogPreview = $('#blog-preview-grid');
  if (blogPreview) renderBlogs(blogPreview, { limit: 3 });

  // Products page full grid
  const allGrid = $('#all-products-grid');
  if (allGrid) renderProducts(allGrid);
});

/* ── PUBLIC API ────────────────────────────────────────────── */
window.SHAH = { PRODUCTS, BLOGS, IMG, GH, imgSrc, renderProducts, renderBlogs, $, $$ };
