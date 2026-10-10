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
/* ── CLEAN URL SLUG MAP — SEO-friendly product page URLs ── */
const PRODUCT_SLUGS = {
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
function productUrl(id) { return PRODUCT_SLUGS[id] || ('product-detail.html?id=' + id); }

const PRODUCTS = [
  {
    id: 'brainchamp', name: 'Brain Champ', price: 164, cat: 'brain', tag: 'Brain & Focus',
    desc: 'Ayurvedic syrup traditionally used to support memory, focus and mental wellbeing.',
    full: 'Ayurvedic syrup combining Brahmi, Shankhpushpi, Ashwagandha and classical herbs, traditionally used to support brain health, concentration and memory.',
    benefits: ['Traditionally used for memory support', 'Supports focus & concentration', 'Supports a healthy stress response', 'Classical brain-health herbs'],
    ingredients: 'Brahmi (Bacopa monnieri), Shankhpushpi, Ashwagandha, Jatamansi, Vacha',
    dosage: '2 tablets twice daily with warm milk or water, preferably after meals.',
    precautions: 'Not recommended during pregnancy. Consult a physician if you are on existing medication.',
  },
  {
    id: 'shahzyme', name: 'Shah Zyme', price: 165, cat: 'digestion', tag: 'Digestion',
    desc: 'Herbal digestive syrup traditionally used to support comfortable digestion.',
    full: 'Herbal digestive syrup combining Ajwain, Saunf, Jeera, Pudina, Harad and Amla, traditionally used to support digestion and comfort after meals.',
    benefits: ['Traditionally used for gas & bloating comfort', 'Supports digestion', 'Supports healthy appetite', 'Eases post-meal heaviness'],
    ingredients: 'Ajwain, Saunf (Fennel), Jeera (Cumin), Pudina (Mint), Harad, Baheda, Amla',
    dosage: '10–15 ml after meals, twice daily. Shake well before use.',
    precautions: 'Store in a cool, dry place. Not for children under 5 years without medical advice.',
  },
  {
    id: 'bloodstorm', name: 'Blood Storm', price: 164, cat: 'blood', tag: 'Blood & Immunity',
    desc: 'Ayurvedic blood tonic traditionally used to support energy and healthy haemoglobin levels.',
    full: 'Ayurvedic blood tonic combining iron-rich herbs with rejuvenating ingredients, traditionally used to support haemoglobin levels, circulation and energy.',
    benefits: ['Traditionally used to support healthy haemoglobin', 'Supports energy & vitality', 'Supports healthy circulation', 'Supports overall wellbeing'],
    ingredients: 'Loha Bhasma, Punarnava, Shatavari, Ashwagandha, Amla, Draksha',
    dosage: '2 tablets twice daily with water or milk after meals.',
    precautions: 'Keep out of reach of children. Consult a physician before use during pregnancy.',
  },
  {
    id: 'coughxpro', name: 'Cough X Pro', price: 99, cat: 'respiratory', tag: 'Respiratory',
    desc: 'Herbal cough syrup traditionally used to soothe throat irritation and support respiratory comfort.',
    full: 'Ayurvedic formulation traditionally used to soothe the throat and support respiratory comfort during cough.',
    benefits: ['Soothes throat irritation', 'Traditionally used for chest comfort', 'Supports respiratory wellbeing', 'See a doctor for a persistent cough'],
    ingredients: 'Tulsi (Holy Basil), Mulethi (Licorice), Adrak (Ginger), Pippali, Vasa, Honey',
    dosage: '10 ml three times daily. Children (5–12): 5 ml three times daily.',
    precautions: 'Diabetics should consult a physician due to natural honey content. Avoid overdose.',
  },
  {
    id: 'musaffakhoon', name: 'Musaffa Khoon', price: 165, cat: 'skin', tag: 'Skin Care',
    desc: 'Traditional blood purifier traditionally used to support skin health.',
    full: 'Classical Ayurvedic formulation traditionally used to support skin health and the body’s natural cleansing.',
    benefits: ['Traditionally used for skin health', 'Supports natural cleansing', 'Supports clear, healthy-looking skin', 'Classical blood-purifying herbs'],
    ingredients: 'Neem, Manjistha, Khadir, Sarsaparilla, Giloy, Triphala',
    dosage: '2 tablets twice daily with water before meals.',
    precautions: 'Results typically visible after 4–6 weeks of consistent use.',
  },
  {
    id: 'panasip', name: 'PanaSip', price: 164, cat: 'acidity', tag: 'Acidity',
    desc: 'Ayurvedic syrup traditionally used to support comfort from acidity and heartburn.',
    full: 'Ayurvedic syrup with cooling, soothing herbs, traditionally used to support digestive comfort during occasional acidity and heartburn.',
    benefits: ['Traditionally used for acidity comfort', 'Soothes occasional heartburn', 'Supports stomach comfort', 'Supports healthy digestion'],
    ingredients: 'Mulethi, Shatavari, Amalaki, Guduchi, Yashtimadhu, Shankha Bhasma',
    dosage: '15 ml before meals, three times daily. Shake well before use.',
    precautions: 'Take on an empty stomach for best results. Refrigerate after opening.',
  },
  {
    id: 'livohayaat', name: 'Livo Hayaat', price: 349, cat: 'liver', tag: 'Liver Health',
    desc: 'Ayurvedic formulation traditionally used to support liver health.',
    full: 'Hepatoprotective Ayurvedic formulation with Bhumi Amla, Kalmegh and Kutki, traditionally used to support liver function and healthy digestion.',
    benefits: ['Traditionally used to support liver health', 'Supports healthy liver function', 'Supports bile production', 'Antioxidant herbs'],
    ingredients: 'Bhumi Amla, Kalmegh, Kutki, Punarnava, Makoy, Kasni',
    dosage: '2 tablets twice daily with warm water before meals.',
    precautions: 'Not for use with hepatotoxic drugs without physician advice.',
  },
  {
    id: 'diaease', name: 'Dia-Ease', price: 695, cat: 'diabetes', tag: 'Diabetes Care',
    desc: 'Ayurvedic formulation traditionally used to support healthy blood sugar levels.',
    full: 'Multi-herb Ayurvedic formulation traditionally used to support healthy blood sugar levels, alongside diet, exercise and medical care.',
    benefits: ['Supports healthy blood sugar', 'Traditionally used for metabolic balance', 'Helps manage sugar cravings', 'Not a substitute for prescribed diabetes medicines'],
    ingredients: 'Karela (Bitter Melon), Jamun Seed, Gurmar, Vijaysar, Methi, Neem, Tulsi',
    dosage: '2 tablets twice daily, 30 minutes before meals with warm water.',
    precautions: 'Monitor blood sugar regularly. Do not discontinue prescribed medication without physician guidance.',
  },
  {
    id: 'orthohayaat', name: 'Ortho Hayaat', price: 399, cat: 'joint', tag: 'Joint Care',
    desc: 'Ayurvedic formulation traditionally used to support joint comfort and mobility.',
    full: 'Ayurvedic formulation combining Shallaki, Guggul, Rasna and other herbs, traditionally used to support joint comfort, flexibility and mobility.',
    benefits: ['Traditionally used for joint comfort', 'Supports mobility & flexibility', 'Supports healthy joints', 'See a doctor for persistent joint pain'],
    ingredients: 'Shallaki (Boswellia), Guggul, Rasna, Nirgundi, Ashwagandha, Sunthi',
    dosage: '2 tablets twice daily with warm milk or water after meals.',
    precautions: 'Results typically noticeable within 4–6 weeks of consistent use.',
  },
  {
    id: 'utrohayaat', name: 'Utro Hayaat', price: 625, cat: 'female', tag: 'Female Health',
    desc: "Gentle Ayurvedic tonic for women's reproductive health and hormonal balance.",
    full: 'Ayurvedic formulation with Ashoka, Lodhra and Shatavari, traditionally used to support menstrual comfort and hormonal balance.',
    benefits: ['Traditionally used for menstrual comfort', 'Supports regular cycles', 'Supports hormonal balance', 'Supports uterine health'],
    ingredients: 'Ashoka, Lodhra, Shatavari, Nagkesar, Daruharidra, Kumari (Aloe)',
    dosage: '2 tablets twice daily after meals with milk or water.',
    precautions: 'Not recommended during pregnancy or breastfeeding without medical advice.',
  },
  {
    id: 'passionpulse', name: 'Passion Pulse', price: 599, cat: 'male', tag: 'Male Vitality',
    desc: 'Ayurvedic formulation traditionally used to support stamina and male vitality.',
    full: 'Ayurvedic male wellness supplement with adaptogens, traditionally used to support stamina, energy and vitality.',
    benefits: ['Traditionally used to support stamina & endurance', 'Supports male vitality', 'Supports energy levels', 'Supports overall wellbeing'],
    ingredients: 'Ashwagandha, Shilajit, Safed Musli, Kaunch Beej, Gokshura, Vidarikanda',
    dosage: '2 tablets twice daily with milk or warm water before bedtime.',
    precautions: 'Not for use under 18 years. Consult physician if you have existing health conditions.',
  },
  {
    id: 'fevodol', name: 'Fevodol', price: 180, cat: 'immunity', tag: 'Immunity',
    desc: "Ayurvedic support for immunity and everyday wellbeing.",
    full: "Fevodol is an Ayurvedic immune-strengthening formulation supporting the body's natural defence mechanisms. Its antipyretic, anti-infective and immunomodulatory herbs are traditionally used to support immunity and build long-term immunity against recurrent illness.",
    benefits: ['Traditionally used to support immunity', 'Supports the body’s natural defences', 'Giloy & Tulsi herbs', 'See a doctor for a persistent fever'],
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
            <a href="${productUrl(p.id)}" class="btn btn-outline btn-sm">Details</a>
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
