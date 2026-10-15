/* Shah Hayaat: standard header behaviour for pages that don't carry the main site script (Wellness Lab).
   Mobile menu toggle, close on link/Escape, and (on the Lab) the "leave before your score?" check on header links. */
(function (d) {
  'use strict';
  function ready(fn) { if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', fn); else fn(); }
  ready(function () {
    var toggle = d.getElementById('nav-toggle');
    function setOpen(open) {
      d.body.classList.toggle('nav-open', open);
      if (toggle) toggle.setAttribute('aria-expanded', String(open));
    }
    if (toggle) toggle.addEventListener('click', function () { setOpen(!d.body.classList.contains('nav-open')); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });

    var links = d.querySelectorAll('.site-header a[href], .nav-mobile a[href]');
    Array.prototype.forEach.call(links, function (a) {
      a.addEventListener('click', function (e) {
        var href = a.getAttribute('href') || '';
        if (/^https?:\/\/wa\.me/.test(href) || a.target === '_blank') return;
        /* Wellness Lab: ask before leaving mid-assessment, then go to the link the person actually clicked */
        if (typeof LAB !== 'undefined' && LAB && typeof LAB._confirmExit === 'function') {
          LAB._exitTo = a.href;
          LAB._confirmExit(e);
        }
        setTimeout(function () { setOpen(false); }, 300);
      });
    });
  });
})(document);
