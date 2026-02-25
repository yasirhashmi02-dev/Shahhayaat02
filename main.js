/* ============================================================
   SHAH HAYAAT — main.js
   Global UI: nav, scroll, animations, carousel, contact form
   ============================================================ */

'use strict';

/* ---------- SHARED DATA ---------- */
const GITHUB = 'https://raw.githubusercontent.com/yasirhashmi02-dev/Shahhayaat02/main/';

const PRODUCTS = [
  { id:'brainchamp',    name:'Brain Champ',     price:175, img:`${GITHUB}brainchamp.jpg`,    category:'brain',       tag:'Brain & Focus',
    desc:'Enhances memory, focus, and cognitive function with powerful Ayurvedic herbs.',
    full:'Brain Champ is a scientifically formulated Ayurvedic supplement that combines the power of Brahmi, Shankhpushpi, Ashwagandha, and other traditional herbs to support optimal brain health. It helps reduce mental fatigue, improve concentration, and enhance memory retention.',
    benefits:['Improves memory and recall','Reduces mental fatigue and brain fog','Supports stress and anxiety management','Enhances focus and concentration','Natural adaptogen blend'],
    ingredients:'Brahmi (Bacopa monnieri), Shankhpushpi, Ashwagandha, Jatamansi, Vacha',
    dosage:'2 tablets twice daily with milk or warm water, preferably after meals.',
    precautions:'Not recommended during pregnancy. Consult a physician if on medication.'
  },
  { id:'shahzyme',     name:'Shah Zyme',        price:165, img:`${GITHUB}shahzyme.jpg`,      category:'digestion',   tag:'Digestion',
    desc:'Effective digestive enzyme syrup for relief from gas, bloating and indigestion.',
    full:'Shah Zyme is a potent herbal digestive enzyme syrup crafted to support healthy digestion. Its unique combination of digestive herbs helps break down food efficiently, relieving uncomfortable symptoms of gas, bloating, and sluggish digestion.',
    benefits:['Relieves gas and bloating','Improves nutrient absorption','Stimulates healthy appetite','Supports digestive enzyme activity','Reduces post-meal heaviness'],
    ingredients:'Ajwain, Saunf (Fennel), Jeera (Cumin), Pudina (Mint), Harad, Baheda, Amla',
    dosage:'10–15 ml after meals, twice daily. Shake well before use.',
    precautions:'Store in a cool, dry place. Not for children under 5 years without medical advice.'
  },
  { id:'bloodstorm',   name:'Blood Storm',      price:165, img:`${GITHUB}bloodstorm.jpg`,    category:'blood',       tag:'Blood & Immunity',
    desc:'Revitalizing blood tonic to combat anemia, weakness, and low hemoglobin.',
    full:'Blood Storm is a premium Ayurvedic blood tonic that combines iron-rich herbs with powerful rejuvenating ingredients. Formulated to naturally raise hemoglobin levels, improve circulation, and restore energy to those suffering from anemia and chronic weakness.',
    benefits:['Raises hemoglobin levels naturally','Combats iron-deficiency anemia','Restores energy and vitality','Improves blood circulation','Strengthens overall immunity'],
    ingredients:'Loha Bhasma, Punarnava, Shatavari, Ashwagandha, Amla, Draksha (Grapes)',
    dosage:'2 tablets twice daily with water or milk after meals.',
    precautions:'Keep out of reach of children. Consult a physician before use during pregnancy.'
  },
  { id:'coughxpro',   name:'Cough X Pro',      price:90,  img:`${GITHUB}coughxpro.jpg`,     category:'respiratory', tag:'Respiratory',
    desc:'Soothing herbal cough syrup for fast, lasting relief from chronic cough.',
    full:'Cough X Pro is a time-tested Ayurvedic formulation that soothes the respiratory tract, reduces inflammation, and provides lasting relief from acute and chronic cough. Its herbal ingredients work synergistically to clear mucus and calm irritated airways.',
    benefits:['Soothes throat irritation','Reduces mucus congestion','Anti-inflammatory action','Provides fast and lasting relief','Safe for adults and children'],
    ingredients:'Tulsi (Holy Basil), Mulethi (Licorice), Adrak (Ginger), Pippali, Vasa, Honey',
    dosage:'10 ml three times daily. Children (5–12): 5 ml three times daily.',
    precautions:'Diabetics should consult physician due to natural honey content. Avoid overdose.'
  },
  { id:'musaffakhoon', name:'Musaffa Khoon',    price:165, img:`${GITHUB}musaffakhoon.jpg`,  category:'skin',        tag:'Skin Care',
    desc:'Traditional blood purifier for clear, glowing skin free from acne and disorders.',
    full:'Musaffa Khoon (Blood Purifier) is a classical Ayurvedic formulation that detoxifies the blood and lymphatic system. By purifying from within, it effectively addresses the root cause of skin disorders including acne, psoriasis, eczema, and dull skin.',
    benefits:['Purifies blood and lymph','Clears acne and pimples','Reduces psoriasis symptoms','Promotes glowing, clear skin','Detoxifies the body naturally'],
    ingredients:'Neem, Manjistha, Khadir (Cutch tree), Sarsaparilla, Giloy, Triphala',
    dosage:'2 tablets twice daily with water before meals.',
    precautions:'Results typically visible after 4–6 weeks of consistent use.'
  },
  { id:'panasip',     name:'PanaSip',           price:165, img:`${GITHUB}panasip.jpg`,       category:'acidity',     tag:'Acidity',
    desc:'Fast-acting Ayurvedic relief from acidity, heartburn, and peptic ulcers.',
    full:'PanaSip is a powerful Ayurvedic antacid syrup that neutralizes excess stomach acid naturally. Its cooling and soothing herbs form a protective layer over the stomach lining, providing rapid relief from acidity, heartburn, and gastric ulcers without harsh chemical side effects.',
    benefits:['Neutralizes stomach acid','Soothes esophageal inflammation','Heals peptic ulcers naturally','Prevents acid reflux','Promotes healthy gastric pH'],
    ingredients:'Mulethi, Shatavari, Amalaki, Guduchi, Yashtimadhu, Shankha Bhasma',
    dosage:'15 ml before meals, three times daily. Shake well before use.',
    precautions:'Take on an empty stomach for best results. Refrigerate after opening.'
  },
  { id:'livohayaat',  name:'Livo Hayaat',       price:349, img:`${GITHUB}livohayaat.jpg`,    category:'liver',       tag:'Liver Health',
    desc:'Premium Ayurvedic formulation for optimal liver health and detoxification.',
    full:'Livo Hayaat is a hepatoprotective Ayurvedic tablet that supports the liver\'s natural detoxification processes. Formulated with powerful liver-protecting herbs, it helps regenerate liver cells, reduce fatty liver, normalize enzyme levels, and improve overall hepatic function.',
    benefits:['Protects and regenerates liver cells','Reduces fatty liver condition','Normalizes liver enzyme levels','Supports bile production and flow','Powerful antioxidant properties'],
    ingredients:'Bhumi Amla, Kalmegh, Kutki, Punarnava, Makoy, Kasni',
    dosage:'2 tablets twice daily with warm water before meals.',
    precautions:'Not for use with other hepatotoxic drugs without physician advice.'
  },
  { id:'diaease',     name:'Dia-Ease',          price:695, img:`${GITHUB}diaease.png`,       category:'diabetes',    tag:'Diabetes Care',
    desc:'Advanced Ayurvedic support for maintaining healthy blood sugar balance.',
    full:'Dia-Ease is a specialized Ayurvedic formulation developed to help manage blood glucose levels naturally. Its multi-herb approach addresses insulin sensitivity, reduces glucose absorption, and supports pancreatic function — providing comprehensive diabetic management support.',
    benefits:['Supports healthy blood sugar levels','Improves insulin sensitivity','Reduces sugar cravings','Supports pancreatic health','Helps prevent diabetic complications'],
    ingredients:'Karela (Bitter Melon), Jamun Seed, Gurmar, Vijaysar, Methi, Neem, Tulsi',
    dosage:'2 tablets twice daily, 30 minutes before meals with warm water.',
    precautions:'Continue monitoring blood sugar regularly. Do not discontinue prescribed medication without physician guidance.'
  },
  { id:'orthohayaat', name:'Ortho Hayaat',      price:649, img:`${GITHUB}orthohayaat.jpg`,   category:'joint',       tag:'Joint Care',
    desc:'Specialized Ayurvedic blend for joint health, pain relief and improved mobility.',
    full:'Ortho Hayaat combines the most potent anti-inflammatory and analgesic Ayurvedic herbs to provide comprehensive joint care. It works to reduce inflammation, lubricate joints, strengthen bones, and improve mobility — making it ideal for arthritis, knee pain, and age-related joint degeneration.',
    benefits:['Reduces joint inflammation and swelling','Relieves chronic joint pain','Improves mobility and flexibility','Strengthens bones and cartilage','Anti-arthritis properties'],
    ingredients:'Shallaki (Boswellia), Guggul, Rasna, Nirgundi, Ashwagandha, Sunthi (Dry Ginger)',
    dosage:'2 tablets twice daily with warm milk or water after meals.',
    precautions:'Results typically noticeable within 4–6 weeks of consistent use.'
  },
  { id:'utrohayaat',  name:'Utro Hayaat',       price:625, img:`${GITHUB}utrohayaat.png`,    category:'female',      tag:'Female Health',
    desc:'Gentle and effective Ayurvedic tonic for women\'s reproductive health and balance.',
    full:'Utro Hayaat is a carefully formulated Ayurvedic uterine tonic that addresses the most common female health concerns. It helps regulate menstrual cycles, relieve period pain, treat leucorrhoea, and support hormonal balance using the safest classical Ayurvedic herbs.',
    benefits:['Regulates menstrual cycles','Relieves painful periods','Treats leucorrhoea effectively','Supports hormonal balance','Strengthens uterine health'],
    ingredients:'Ashoka, Lodhra, Shatavari, Nagkesar, Daruharidra, Kumari (Aloe)',
    dosage:'2 tablets twice daily after meals with milk or water.',
    precautions:'Not recommended during pregnancy or breastfeeding without medical advice.'
  },
  { id:'passionpulse',name:'Passion Pulse',     price:599, img:`${GITHUB}passionpulse.jpg`,  category:'male',        tag:'Male Vitality',
    desc:'Natural vitality booster for men — stamina, libido, and reproductive health.',
    full:'Passion Pulse is a premium Ayurvedic male vitality supplement that draws on centuries of traditional knowledge to support men\'s health. It combines powerful adaptogens and vajikarana herbs to enhance stamina, improve libido, support testosterone levels, and boost overall masculine vitality.',
    benefits:['Enhances physical stamina and endurance','Improves libido and sexual health','Supports healthy testosterone levels','Improves sperm health and motility','Reduces fatigue and boosts energy'],
    ingredients:'Ashwagandha, Shilajit, Safed Musli, Kaunch Beej, Gokshura, Vidarikanda',
    dosage:'2 tablets twice daily with milk or warm water before bedtime.',
    precautions:'Not for use under 18 years. Consult physician if you have existing health conditions.'
  },
  { id:'fevodol',     name:'Fevodol',           price:165, img:`${GITHUB}fevodol.png`,       category:'immunity',    tag:'Immunity',
    desc:'Powerful immunity booster to defend against fever, infections, and illness.',
    full:'Fevodol is an Ayurvedic immune-strengthening formulation that supports the body\'s natural defense mechanisms. Its antipyretic, anti-infective, and immunomodulatory herbs help reduce fever, fight infections, and build long-term immunity against recurrent illness.',
    benefits:['Reduces fever naturally','Fights bacterial and viral infections','Strengthens immune system','Anti-inflammatory properties','Helps prevent recurrent illness'],
    ingredients:'Giloy (Guduchi), Tulsi, Chirayata, Kutki, Dhatura (processed), Sudarshan Churna',
    dosage:'2 tablets three times daily with warm water during fever or illness. For immunity: twice daily.',
    precautions:'Continue medical treatment during severe infections. This is a supportive supplement.'
  },
];

const BLOGS = [
  { title:'Feeling Bloated? 5 Ayurvedic Secrets for a Happy Gut', category:'Digestion', img:`${GITHUB}image(3).png`, desc:'Tired of that uncomfortable feeling after meals? Discover simple, ancient tips to improve your digestion naturally and feel lighter every day.' },
  { title:"Can't Switch Off? How Ashwagandha Calms Modern Stress",  category:'Wellness',  img:`${GITHUB}image(6).png`, desc:'In a world that never stops, finding peace can feel impossible. Learn how this powerful adaptogen helps your body manage and recover from stress.' },
  { title:'Beat the Afternoon Slump: Ayurvedic Tips for All-Day Energy', category:'Energy', img:`${GITHUB}image(5).png`, desc:'If you rely on coffee to get through the day, there\'s a better way. Discover natural Ayurvedic techniques to maintain vibrant energy from morning to night.' },
  { title:'The Glow-Up from Within: Ayurvedic Secrets for Radiant Skin', category:'Skin', img:`${GITHUB}image(4).png`, desc:'True radiance starts from the inside. Explore the connection between your diet, digestion, and achieving naturally clear, glowing skin.' },
  { title:'Managing Joint Pain Naturally with Ayurveda', category:'Joint Care', img:`${GITHUB}image(1).png`, desc:"Don't let aches and pains hold you back. Learn about traditional Ayurvedic approaches to soothe joint discomfort and improve your mobility." },
];

/* ---------- DOM Utilities ---------- */
function qs(sel, ctx = document) { return ctx.querySelector(sel); }
function qsa(sel, ctx = document) { return [...ctx.querySelectorAll(sel)]; }

/* ---------- Navigation ---------- */
function initNav() {
  const toggle = qs('.nav-toggle');
  const mobileNav = qs('.nav-mobile');
  if (!toggle) return;

  toggle.addEventListener('click', () => document.body.classList.toggle('nav-open'));
  qsa('.nav-mobile a').forEach(a => a.addEventListener('click', () => {
    setTimeout(() => document.body.classList.remove('nav-open'), 320);
  }));

  // Highlight active page
  const page = location.pathname.split('/').pop() || 'index.html';
  qsa('.nav-desktop a, .nav-mobile a').forEach(a => {
    if (a.getAttribute('href') === page || (page === '' && a.getAttribute('href') === 'index.html')) {
      a.classList.add('active');
    }
  });
}

/* ---------- Scroll Effects ---------- */
function initScrollEffects() {
  const backTop = qs('.back-to-top');
  window.addEventListener('scroll', () => {
    document.body.classList.toggle('scrolled', window.scrollY > 60);
    if (backTop) backTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  // Reveal on scroll
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.1 });
  qsa('.reveal').forEach(el => io.observe(el));
}

/* ---------- Hero Carousel ---------- */
function initHeroCarousel() {
  const slides = qsa('.hero-bg');
  const progress = qs('.hero-progress');
  if (slides.length < 2) return;

  let cur = 0;
  slides[0].classList.add('active');

  function nextSlide() {
    slides[cur].classList.remove('active');
    cur = (cur + 1) % slides.length;
    slides[cur].classList.add('active');
    if (progress) {
      progress.classList.remove('animate');
      void progress.offsetWidth;
      progress.classList.add('animate');
    }
  }

  if (progress) { progress.classList.add('animate'); }
  setInterval(nextSlide, 5000);
}

/* ---------- Product Grid (Homepage preview) ---------- */
function renderProductGrid(container, limit = null, filterCat = null) {
  if (!container) return;
  let products = filterCat && filterCat !== 'all' ? PRODUCTS.filter(p => p.category === filterCat) : PRODUCTS;
  if (limit) products = products.slice(0, limit);

  container.innerHTML = products.map((p, i) => `
    <div class="product-card reveal reveal-delay-${(i % 4) + 1}" data-category="${p.category}">
      <div class="product-img-wrap">
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        <span class="product-tag">${p.tag}</span>
      </div>
      <div class="product-body">
        <h3>${p.name}</h3>
        <p class="product-desc">${p.desc}</p>
        <div class="product-footer">
          <div class="product-price">₹${p.price}</div>
          <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
            <a href="product-detail.html?id=${p.id}" class="btn btn-outline btn-sm">Details</a>
            <a href="https://wa.me/917051056287?text=${encodeURIComponent(`I'd like to order ${p.name} - ₹${p.price}`)}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">Order Now</a>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  // Re-observe new elements
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.1 });
  qsa('.reveal', container).forEach(el => io.observe(el));
}

/* ---------- Blog Grid ---------- */
function renderBlogGrid(container, limit = null) {
  if (!container) return;
  const posts = limit ? BLOGS.slice(0, limit) : BLOGS;
  container.innerHTML = posts.map(b => `
    <a href="blog.html" class="blog-card reveal">
      <div class="blog-card-img"><img src="${b.img}" alt="${b.title}" loading="lazy"></div>
      <div class="blog-card-body">
        <span class="blog-category">${b.category}</span>
        <h3>${b.title}</h3>
        <p>${b.desc}</p>
        <span class="blog-read-more">Read More →</span>
      </div>
    </a>
  `).join('');
}

/* ---------- Contact Form ---------- */
function initContactForm() {
  const form = qs('#contactForm');
  if (!form) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const status = qs('#form-status');
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true; btn.textContent = 'Sending…';
    try {
      const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      if (res.ok) {
        status.textContent = '✓ Message sent! We\'ll get back to you soon.';
        status.className = 'form-status success';
        form.reset();
      } else {
        status.textContent = 'Something went wrong. Please try WhatsApp instead.';
        status.className = 'form-status error';
      }
    } catch {
      status.textContent = 'Network error. Please try WhatsApp instead.';
      status.className = 'form-status error';
    }
    btn.disabled = false; btn.textContent = 'Send Message';
  });
}

/* ---------- Init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScrollEffects();
  initHeroCarousel();
  initContactForm();

  // Homepage product preview
  const productPreview = qs('#product-preview-grid');
  if (productPreview) renderProductGrid(productPreview, 6);

  // Homepage blog preview
  const blogPreview = qs('#blog-preview-grid');
  if (blogPreview) renderBlogGrid(blogPreview, 3);

  // Year
  const yearEl = qs('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

/* Export for other scripts */
window.SHAH = { PRODUCTS, BLOGS, renderProductGrid, renderBlogGrid, qs, qsa };
