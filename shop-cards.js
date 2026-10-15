/* Shah Hayaat: shared product data + one consistent product card.
   Used by index.html, products.html and catalogue.html (and by the WhatsApp button on every page).

   EDIT PRODUCTS HERE ONLY. Every card on the site reads from this list.
   size: shown on every card. Lines marked  // CONFIRM  have no pack size stated anywhere on the
   current site, so they show a neutral "Per pack". Replace with the real size, e.g. '200 ml syrup'. */
(function (w, d) {
  'use strict';
  var PHONE = '917051056287';
  var GH = 'https://www.shahhayaat.com/';

  /* ---- slow phone / reduced-motion detection (adds <html class="sh-lite">) ---- */
  function isLite() {
    try {
      if (w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
      var c = navigator.connection || navigator.mozConnection || navigator.webkitConnection || {};
      if (c.saveData) return true;
      if (/^(slow-2g|2g|3g)$/.test(c.effectiveType || '')) return true;
      if (navigator.deviceMemory && navigator.deviceMemory <= 2) return true;
      if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) return true;
    } catch (e) {}
    return false;
  }
  var LITE = isLite();
  if (LITE) d.documentElement.classList.add('sh-lite');

  var P = [
    { id: 'brainchamp',      name: 'Brain Champ',          price: 164, cat: ['brain'],              tag: 'Brain & Focus',       size: 'Per pack',               image: 'brainchamp1.webp',                 url: 'brain-champ-ayurvedic-memory-booster.html',          badge: '#1 Memory',  desc: 'Ayurvedic formulation traditionally used to support memory, focus and mental wellbeing.' }, // CONFIRM size
    { id: 'shahzyme',        name: 'Shah Zyme',            price: 165, cat: ['digestion'],          tag: 'Digestion',           size: '200 ml · also 100 ml',   image: 'images/shah-zyme-200.webp',        url: 'shah-zyme-ayurvedic-digestive-syrup.html',           desc: 'Herbal digestive syrup traditionally used to support comfortable digestion.' },
    { id: 'bloodstorm',      name: 'Blood Storm',          price: 164, cat: ['blood'],              tag: 'Blood & Immunity',    size: '200 ml · also 100 ml',   image: 'images/blood-storm-200.webp',      url: 'blood-storm-ayurvedic-iron-tonic.html',              desc: 'Ayurvedic blood tonic traditionally used to support energy and healthy haemoglobin levels.' },
    { id: 'coughxpro',       name: 'Cough X Pro',          price: 99,  cat: ['respiratory'],        tag: 'Respiratory',         size: 'Per pack',               image: 'coughxpro1.webp',                  url: 'cough-x-pro-ayurvedic-herbal-cough-syrup.html',      desc: 'Herbal cough syrup traditionally used to soothe the throat and support respiratory comfort.' }, // CONFIRM size
    { id: 'musaffakhoon',    name: 'Musaffa Khoon',        price: 165, cat: ['skin'],               tag: 'Skin Health',         size: 'Per pack',               image: 'musaffakhoon1.webp',               url: 'musaffa-khoon-ayurvedic-blood-purifier.html',        desc: 'Traditional blood purifier formulation traditionally used to support skin health.' }, // CONFIRM size
    { id: 'panasip',         name: 'PanaSip',              price: 164, cat: ['acidity'],            tag: 'Acidity',             size: 'Per pack',               image: 'panasip1.webp',                    url: 'panasip-ayurvedic-acidity-heartburn-relief.html',    desc: 'Ayurvedic syrup traditionally used to support comfort from acidity and heartburn.' }, // CONFIRM size
    { id: 'livohayaat',      name: 'Livo Hayaat Combo',    price: 349, cat: ['liver'],              tag: 'Liver Health',        size: 'Combo pack',             image: 'livohayaat1.webp',                 url: 'livo-hayaat-ayurvedic-liver-detox.html',             badge: 'Bestseller', desc: 'Ayurvedic formulation traditionally used to support liver health.' }, // CONFIRM contents
    { id: 'diaease',         name: 'Dia-Ease',             price: 695, cat: ['diabetes'],           tag: 'Blood Sugar Support', size: 'Per pack',               image: 'diaease1.webp',                    url: 'dia-ease-ayurvedic-blood-sugar-control.html',        desc: 'Ayurvedic formulation traditionally used to support healthy blood sugar levels.' }, // CONFIRM size
    { id: 'orthohayaat',     name: 'Ortho Hayaat',         price: 399, cat: ['joint'],              tag: 'Joint Care',          size: 'Per pack',               image: 'orthohayaat1.webp',                url: 'ortho-hayaat-ayurvedic-joint-pain-relief.html',      badge: 'Popular',    desc: 'Ayurvedic formulation traditionally used to support joint comfort and mobility.' }, // CONFIRM size
    { id: 'utrohayaat',      name: 'Utro Hayaat Combo',    price: 625, cat: ['female'],             tag: 'Women’s Wellness',    size: 'Combo pack',             image: 'images/utro-hayaat-combo.webp',    url: 'utro-hayaat-ayurvedic-womens-health.html',           desc: 'Ayurvedic formulation traditionally used to support women’s wellness and hormonal balance.' }, // CONFIRM contents
    { id: 'passionpulse',    name: 'Passion Pulse',        price: 599, cat: ['male'],               tag: 'Male Vitality',       size: 'Per pack',               image: 'passionpulse1.webp',               url: 'passion-pulse-ayurvedic-male-vitality.html',         desc: 'Ayurvedic formulation traditionally used to support stamina and male vitality.' }, // CONFIRM size
    { id: 'fevodol',         name: 'Fevodol',              price: 180, cat: ['immunity'],           tag: 'Immunity',            size: 'Per pack',               image: 'images/fevodol.webp',              url: 'fevodol-ayurvedic-immunity-booster-giloy-tulsi.html', desc: 'Ayurvedic formulation with Giloy and Tulsi, traditionally used to support immunity.' }, // CONFIRM size
    { id: 'bloodstormdrops', name: 'Blood Storm Drops',    price: 70,  cat: ['blood', 'children'],  tag: 'Blood & Wellness',    size: '30 ml drops',            image: 'images/blood-storm-drops.webp',    url: 'blood-storm-drops.html',        isNew: true, desc: 'Ayurvedic drops with selected traditional ingredients, made for children.' },
    { id: 'shahzymejunior',  name: 'Shah Zyme Junior',     price: 60,  cat: ['digestion', 'children'], tag: 'Pediatric Digestion', size: '30 ml pediatric drops', image: 'images/shah-zyme-junior.webp',     url: 'shah-zyme-junior-pediatric-drops.html', isNew: true, desc: 'Pediatric digestive drops in a pineapple-flavoured formulation.' },
    { id: 'painflick',       name: 'PAIN FLICK Capsule',   price: 240, cat: ['joint'],              tag: 'Joint & Muscle Care', size: '3 × 10 capsules',        image: 'images/pain-flick-cap.webp',       url: 'pain-flick-capsule.html',       isNew: true, desc: 'Traditional herbal combination in capsule form, for joint and muscular wellness.' },
    { id: 'orthohayaat_oil', name: 'Ortho Hayaat Oil',     price: 120, cat: ['joint'],              tag: 'Topical Joint Care',  size: '50 ml external oil',     image: 'images/ortho-hayaat-oil.webp',     url: 'ortho-hayaat-oil.html',         isNew: true, desc: 'Herbal oil for external application, traditionally used to support joint and muscle comfort.' },
    { id: 'bloodstormcap',   name: 'Blood Storm Capsules', price: 225, cat: ['blood'],              tag: 'Blood & Wellness',    size: '30 capsules',            image: 'images/blood-storm-cap.webp',      url: 'blood-storm-capsules.html',     isNew: true, desc: 'Traditional formulation with iron, calcium and vitamin C, in capsule form.' },
    { id: 'cardohayaat',     name: 'Cardo Hayaat Tablets', price: 270, cat: ['heart'],              tag: 'Heart Wellness',      size: '3 × 10 tablets',         image: 'images/cardo-hayaat-tab.webp',     url: 'cardo-hayaat-tablets.html',     isNew: true, desc: 'Tablets featuring Arjun, Cinnamon and Black Seed, for heart wellness support.' },
    { id: 'livohayaatds',    name: 'Livo Hayaat DS',       price: 160, cat: ['liver'],              tag: 'Liver Health',        size: '200 ml · also 100 ml',   image: 'images/livo-hayaat-ds-200.webp',   url: 'livo-hayaat-ds-syrup.html',     isNew: true, desc: 'Ayurvedic syrup for liver wellness and digestive support.' },
    { id: 'utrohayaatds',    name: 'Utro Hayaat DS',       price: 160, cat: ['female'],             tag: 'Women’s Wellness',    size: '200 ml syrup',           image: 'images/utro-hayaat-ds.webp',       url: 'utro-hayaat-ds-syrup.html',     isNew: true, desc: 'Ayurvedic syrup for women’s wellness and reproductive health support.' }
  ];

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function byId(id) { for (var i = 0; i < P.length; i++) if (P[i].id === id) return P[i]; return null; }
  function byUrl(file) { for (var i = 0; i < P.length; i++) if (P[i].url === file) return P[i]; return null; }

  /* WhatsApp link with the product name (and price) pre-filled */
  function waLink(p) {
    var msg = p
      ? 'Hi Shah Hayaat! I would like to order ' + p.name + (p.size && p.size !== 'Per pack' ? ' (' + p.size + ')' : '') + ' at ₹' + p.price + '. Please share the details.'
      : 'Hi Shah Hayaat! I would like to order. Please guide me.';
    return 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent(msg);
  }

  /* One card. Same markup everywhere: image (1:1), tag, name, size line, short description, price, ONE button. */
  function card(p, i) {
    var badge = p.badge || (p.isNew ? 'New' : '');
    var fb = GH + p.image;
    return '<article class="sh-pcard reveal delay-' + (((i || 0) % 4) + 1) + '" data-cat="' + esc(p.cat.join(' ')) + '" data-id="' + esc(p.id) + '">' +
      '<a class="sh-pcard-media" href="' + p.url + '" aria-label="' + esc(p.name) + ' details">' +
        '<img src="' + p.image + '" alt="' + esc(p.name) + ' Ayurvedic product" width="400" height="400" loading="lazy" decoding="async" onerror="this.onerror=null;this.src=\'' + fb + '\'">' +
        '<span class="sh-pcard-tag">' + esc(p.tag) + '</span>' +
        (badge ? '<span class="sh-pcard-badge">' + esc(badge) + '</span>' : '') +
      '</a>' +
      '<div class="sh-pcard-body">' +
        '<h3 class="sh-pcard-name"><a href="' + p.url + '">' + esc(p.name) + '</a></h3>' +
        '<p class="sh-pcard-size">' + esc(p.size) + '</p>' +
        '<p class="sh-pcard-desc">' + esc(p.desc) + '</p>' +
        '<div class="sh-pcard-price">₹' + p.price + '</div>' +
        '<a class="sh-pcard-cta" href="' + waLink(p) + '" target="_blank" rel="noopener" aria-label="Order ' + esc(p.name) + ' on WhatsApp"><span aria-hidden="true">💬</span> Order on WhatsApp</a>' +
        '<a class="sh-pcard-more" href="' + p.url + '">View details</a>' +
      '</div>' +
    '</article>';
  }

  function observe(container) {
    var els = Array.prototype.slice.call(container.querySelectorAll('.reveal:not(.in)'));
    if (LITE || !('IntersectionObserver' in w)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } });
    }, { threshold: 0.07 });
    els.forEach(function (e) { io.observe(e); });
  }

  function render(container, list, limit) {
    if (!container) return;
    var items = limit ? list.slice(0, limit) : list;
    container.innerHTML = items.map(card).join('');
    observe(container);
  }

  /* newest products first, as products.html already did */
  function sortNewFirst(list) {
    return list.slice().sort(function (a, b) { return Number(!!b.isNew) - Number(!!a.isNew); });
  }

  w.SH = { PHONE: PHONE, products: P, byId: byId, byUrl: byUrl, waLink: waLink, card: card, render: render, observe: observe, sortNewFirst: sortNewFirst, lite: LITE };
})(window, document);
