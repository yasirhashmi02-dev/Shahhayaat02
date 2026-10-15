/* Shah Hayaat: shared enhancements. Needs shop-cards.js (window.SH) loaded first.
   1) Floating "Order on WhatsApp" button on mobile, product name pre-filled
   2) Gentle section fade-ins
   3) Count-up on stat numbers ([data-count])
   Slow phones / data-saver / reduced-motion (html.sh-lite, set by shop-cards.js) skip all animation. */
(function (w, d) {
  'use strict';
  var SH = w.SH || { PHONE: '917051056287', lite: false, byUrl: function () { return null; }, byId: function () { return null; }, waLink: null };
  var LITE = !!SH.lite;
  var root = d.documentElement;

  /* ---------- which product is this page about? ---------- */
  function currentProduct() {
    var file = (location.pathname.split('/').pop() || 'index.html');
    var p = SH.byUrl(file);
    if (!p && file === 'product-detail.html') {
      var m = /[?&]id=([^&]+)/.exec(location.search);
      if (m) p = SH.byId(decodeURIComponent(m[1]));
    }
    return p || null;
  }

  function linkFor(p) {
    if (SH.waLink) return SH.waLink(p);
    return 'https://wa.me/' + SH.PHONE + '?text=' + encodeURIComponent('Hi Shah Hayaat! I would like to order' + (p ? ' ' + p.name : '') + '. Please guide me.');
  }

  /* ---------- 1. floating WhatsApp button ---------- */
  function initFab() {
    if (d.querySelector('.sh-wa-fab')) return;
    var p = currentProduct();
    var bar = d.querySelector('.mobile-bottom-bar');
    if (!bar) root.classList.add('sh-no-bar');

    var a = d.createElement('a');
    a.className = 'sh-wa-fab';
    a.href = linkFor(p);
    a.target = '_blank';
    a.rel = 'noopener';
    a.setAttribute('aria-label', p ? 'Order ' + p.name + ' on WhatsApp' : 'Order on WhatsApp');
    a.innerHTML = '<span class="sh-wa-ic" aria-hidden="true">💬</span><span class="sh-wa-tx"><strong>Order on WhatsApp</strong><small></small></span>';
    a.querySelector('small').textContent = p ? p.name + ' · ₹' + p.price : 'Ask about any product';
    d.body.appendChild(a);
    w.setTimeout(function () { a.classList.add('sh-on'); }, LITE ? 0 : 700);

    /* the existing bottom-bar WhatsApp button also gets the product name */
    if (p && bar) {
      var bw = bar.querySelector('.mbb-wa');
      if (bw) bw.href = linkFor(p);
    }
  }

  /* ---------- 2. section fade-ins ---------- */
  function initFades() {
    if (LITE || !('IntersectionObserver' in w)) return;
    var secs = Array.prototype.slice.call(d.querySelectorAll('main > section, body > section'));
    if (!secs.length) return;
    var vh = w.innerHeight || 800;
    var targets = secs.filter(function (s) {
      if (s.classList.contains('reveal') || s.querySelector('.reveal')) return false; /* page already animates its own elements */
      if (s.getBoundingClientRect().top < vh * 0.9) return false;                              /* already on screen: no flash */
      return true;
    });
    if (!targets.length) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('sh-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(function (s) { s.classList.add('sh-fade'); io.observe(s); });
    root.classList.add('sh-fx');
    /* safety net: never leave a section hidden */
    w.setTimeout(function () { targets.forEach(function (s) { s.classList.add('sh-in'); }); }, 12000);
  }

  /* ---------- 3. count-up ---------- */
  function initCounters() {
    var els = Array.prototype.slice.call(d.querySelectorAll('[data-count]'));
    if (!els.length || LITE || !('IntersectionObserver' in w)) return; /* markup already holds the final number */
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        var el = e.target, end = +el.getAttribute('data-count'), suf = el.getAttribute('data-suffix') || '', pre = el.getAttribute('data-prefix') || '', t0 = null;
        if (!isFinite(end)) return;
        function step(t) {
          t0 = t0 || t;
          var p = Math.min((t - t0) / 1100, 1);
          el.textContent = pre + Math.round(end * (1 - Math.pow(1 - p, 3))) + suf;
          if (p < 1) w.requestAnimationFrame(step);
        }
        w.requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });
    els.forEach(function (el) { io.observe(el); });
  }

  function start() { initFab(); initFades(); initCounters(); }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', start); else start();
})(window, document);
