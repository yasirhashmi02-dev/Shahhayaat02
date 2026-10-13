/* Wellness Lab: first-timer experience layer
   - Quick Check (4 short tests) as the default path
   - step tracker + time left
   - friendly "nice work / what's next" screen between tests
   - gentle skip confirmation + "redo skipped tests" on the results page
   - fixes the lab tiles only routing once per visit
   Loads after wellness-lab-part5.js and only wraps existing LAB methods. */
(function () {
  'use strict';
  if (typeof LAB === 'undefined') return;

  /* ── Plain-language info per test: emoji, what you'll do, rough seconds ── */
  var INFO = {
    mod_reactionSpeed:   { e:'⚡', t:'Tap quickly when the signal turns green.', s:60 },
    mod_spatialMemory:   { e:'🧩', t:'Watch the pattern carefully, then repeat it from memory.', s:60 },
    mod_stroopTest:      { e:'🎨', t:'Pick the colour of the word, not what the word says.', s:60 },
    mod_goNoGo:          { e:'🚦', t:'Tap on green, hold back on red.', s:60 },
    mod_digitSpan:       { e:'🔢', t:'Remember the numbers, then enter them back.', s:60 },
    mod_trailMaking:     { e:'🔗', t:'Tap the numbers in order as fast as you can.', s:60 },
    mod_colourBlindness: { e:'🎨', t:'Look at each picture and tell us what you see.', s:60 },
    mod_peripheralVision:{ e:'🔍', t:'Keep your eyes on the centre and tap when something appears at the side.', s:60 },
    mod_breathSync:      { e:'🌬', t:'Breathe in and out with the circle. Nice and slow.', s:60 },
    mod_stabilityHold:   { e:'📱', t:'Hold your phone steady for a few seconds.', s:45 },
    mod_oneLegStand:     { e:'🧍', t:'Stand on one leg for a few seconds (stay near a wall).', s:45 },
    mod_sleepEfficiency: { e:'💤', t:'Answer a few quick questions about your sleep.', s:45 },
    mod_lifestyleLoad:   { e:'⚖', t:'Answer a few quick questions about your daily habits.', s:45 },
    mod_hydration:       { e:'💧', t:'Answer a few quick questions about your water intake.', s:45 },
    mod_bodySymptoms:    { e:'💪', t:'Tick the options that match how your body feels.', s:60 },
    mod_gutHealth:       { e:'🍽', t:'Tick the options that match your digestion.', s:60 },
    mod_hearingCheck:    { e:'👂', t:'Listen for faint tones (headphones work best).', s:75 },
    mod_hormonalRhythm:  { e:'🌸', t:'Answer a few gentle questions about your cycle.', s:60 },
    mod_energyIron:      { e:'⚡', t:'Answer a few quick questions about your energy.', s:45 },
    mod_femCombined:     { e:'🌙', t:'Answer a few quick questions about sleep and comfort.', s:45 }
  };
  var QUICK = ['mod_reactionSpeed', 'mod_spatialMemory', 'mod_breathSync', 'mod_hydration'];
  var CHEERS = ['Nice work!', 'You\'re doing great!', 'Well done!', 'Smooth!', 'Great job!'];

  function name(m) { return (LAB._mlabels && LAB._mlabels[m]) || m.replace('mod_', ''); }
  function plainName(m) { return name(m).replace(/^[^\w]+/, '').trim(); }
  function secsLeft(from) {
    var s = 0;
    for (var i = from; i < LAB.queue.length; i++) s += (INFO[LAB.queue[i]] || {}).s || 60;
    return s;
  }
  function minsText(sec) {
    var m = Math.max(1, Math.round(sec / 60));
    return 'about ' + m + ' min left';
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }

  /* ── Styles ─────────────────────────────────────────────────────────── */
  var css = document.createElement('style');
  css.id = 'wl-boost-css';
  css.textContent = [
    '.wl2-journey{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:.2rem;margin:.6rem 0 .1rem}',
    '.wl2-dot{display:inline-grid;place-items:center;width:1.9rem;height:1.9rem;border-radius:50%;font-size:.9rem;font-weight:800;border:2px solid #D4E8DC;background:#fff;color:#6A8A6A;transition:all .25s}',
    '.wl2-dot--done{background:#2A7A5A;border-color:#2A7A5A;color:#fff}',
    '.wl2-dot--skip{background:#FFF3DC;border-color:#F0A020;color:#9A6200}',
    '.wl2-dot--now{border-color:#2A7A5A;box-shadow:0 0 0 4px rgba(42,122,90,.18);transform:scale(1.12);animation:wl2dot 1.6s ease-in-out infinite}',
    '.wl2-dash{width:.7rem;height:2px;background:#D4E8DC;display:inline-block}',
    '.wl2-left{width:100%;text-align:center;font-size:.72rem;font-weight:700;color:#2A7A5A;margin-top:.35rem}',
    '@keyframes wl2dot{0%,100%{box-shadow:0 0 0 4px rgba(42,122,90,.18)}50%{box-shadow:0 0 0 8px rgba(42,122,90,.05)}}',
    '.wl2-coach{text-align:center;padding:2rem 1.3rem}',
    '.wl2-check{display:grid;place-items:center;width:4.2rem;height:4.2rem;margin:0 auto .8rem;border-radius:50%;background:linear-gradient(135deg,#2A7A5A,#38A87A);color:#fff;font-size:2.1rem;font-weight:800;animation:wl2pop .5s cubic-bezier(.2,1.4,.4,1) both}',
    '@keyframes wl2pop{from{transform:scale(.2);opacity:0}to{transform:scale(1);opacity:1}}',
    '.wl2-coach h2{margin:.1rem 0 .25rem}',
    '.wl2-coach-sub{font-size:.85rem;color:#6A8A6A;margin:0 0 1.1rem}',
    '.wl2-coach-next{display:flex;align-items:center;gap:.9rem;text-align:left;padding:.9rem 1rem;margin:0 auto 1.2rem;max-width:380px;background:#F0FAF4;border:1.5px solid rgba(42,122,90,.2);border-radius:16px}',
    '.wl2-coach-next .e{display:grid;place-items:center;flex:0 0 auto;width:2.8rem;height:2.8rem;border-radius:50%;background:#fff;font-size:1.5rem}',
    '.wl2-coach-next small{display:block;font-size:.62rem;font-weight:800;letter-spacing:.1em;color:#2A7A5A}',
    '.wl2-coach-next b{display:block;font-size:.95rem;color:#1C2E1C}',
    '.wl2-coach-next span.t{display:block;font-size:.78rem;color:#3A5A3A;line-height:1.45;margin-top:.1rem}',
    '.wl2-auto{height:4px;max-width:380px;margin:.9rem auto .4rem;border-radius:4px;background:#E3EFE7;overflow:hidden}',
    '.wl2-auto i{display:block;height:100%;width:0;background:#38A87A;animation:wl2auto 6.5s linear forwards}',
    '@keyframes wl2auto{to{width:100%}}',
    '.wl2-textbtn{background:none;border:0;font:inherit;font-size:.78rem;color:#6A8A6A;text-decoration:underline;cursor:pointer;padding:.3rem .5rem}',
    '.wl2-modal{position:fixed;inset:0;z-index:99999;background:rgba(10,18,20,.62);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:1rem}',
    '.wl2-modal>div{background:#fff;border-radius:20px;padding:1.8rem 1.5rem;max-width:340px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.3)}',
    '.wl2-modal h3{font-family:"Playfair Display",serif;font-size:1.2rem;margin:.2rem 0 .5rem}',
    '.wl2-modal p{font-size:.85rem;color:#3A5A3A;line-height:1.55;margin:0 0 1.2rem}',
    '.wl2-skipnote{margin:0 0 1rem;padding:1rem 1.1rem;border-radius:16px;background:#FFF8ED;border:1.5px solid rgba(201,120,0,.25);text-align:center}',
    '.wl2-skipnote b{display:block;color:#9A6200;margin-bottom:.2rem}',
    '.wl2-skipnote p{margin:0 0 .7rem;font-size:.82rem;color:#3A5A3A}',
    '@media(prefers-reduced-motion:reduce){.wl2-dot--now,.wl2-check,.wl2-auto i{animation:none}.wl2-auto i{width:100%}}'
  ].join('\n');
  document.head.appendChild(css);

  /* ── Step tracker under the progress bar ───────────────────────────── */
  function ensureJourney() {
    var j = document.getElementById('wl2Journey');
    if (j) return j;
    var meta = document.querySelector('#progBar .prog-meta');
    if (!meta || !meta.parentNode) return null;
    j = document.createElement('div');
    j.id = 'wl2Journey';
    j.className = 'wl2-journey';
    j.setAttribute('aria-hidden', 'true');
    meta.parentNode.appendChild(j);
    return j;
  }
  function renderJourney() {
    var j = ensureJourney();
    if (!j || !LAB.queue || !LAB.queue.length) return;
    var n = LAB.queue.length, i = LAB.idx, skipped = LAB._skippedMods || [], html = '';
    if (n <= 10) {
      html = LAB.queue.map(function (m, k) {
        var st = k < i ? (skipped.indexOf(m) >= 0 ? 'skip' : 'done') : (k === i ? 'now' : 'next');
        var inner = st === 'done' ? '✓' : ((INFO[m] || {}).e || '●');
        return '<span class="wl2-dot wl2-dot--' + st + '" title="' + esc(plainName(m)) + '">' + inner + '</span>';
      }).join('<i class="wl2-dash"></i>');
    }
    html += '<div class="wl2-left">⏱ ' + minsText(secsLeft(i)) + '</div>';
    j.innerHTML = html;
  }
  var _up = LAB._updateProg.bind(LAB);
  LAB._updateProg = function () { var r = _up.apply(null, arguments); try { renderJourney(); } catch (e) {} return r; };

  /* ── Quick Check ────────────────────────────────────────────────────── */
  LAB.beginQuick = function () {
    if (!this.gender) return;
    try { if (typeof trackWL === 'function') trackWL('quick_start'); } catch (e) {}
    this.currentMode = 'full';          /* reuses the normal results/report */
    this._skippedMods = []; this._sumDone = false;
    this.queue = QUICK.slice();
    this.idx = 0;
    var self = this;
    Object.keys(this.scores).forEach(function (k) { self.scores[k] = null; });
    try { localStorage.setItem('wl_progress', JSON.stringify({ mode: 'quick', gender: this.gender, ts: Date.now() })); } catch (e) {}
    this.show('sModules');
    this.say('Let\'s start your quick check. Four short activities, and there are no wrong answers.');
    this.next();
  };

  var _bc = LAB.beginCategory.bind(LAB);
  LAB.beginCategory = function (id) {
    if (id === 'quick') return this.beginQuick();
    this._skippedMods = []; this._sumDone = false;
    return _bc(id);
  };
  var _bm = LAB.beginModules.bind(LAB);
  LAB.beginModules = function () { this._skippedMods = []; this._sumDone = false; return _bm.apply(null, arguments); };

  /* Fix: the lab tiles only routed to their lab the first time per visit. Make routing permanent. */
  var _rcd = LAB.renderCategoryDashboard.bind(LAB);
  LAB.renderCategoryDashboard = function () {
    if (this._pendingCat) { var c = this._pendingCat; this._pendingCat = null; return this.beginCategory(c); }
    return _rcd.apply(null, arguments);
  };

  /* ── Between tests: "Nice work, here's what's next" ────────────────── */
  var _next = LAB.next.bind(LAB);
  LAB.next = function () {
    var viaSkip = this._viaSkip; this._viaSkip = false;
    var n = (this.queue || []).length;
    if (this.idx > 0 && this.idx < n && !viaSkip && this.currentMode !== 'challenge') {
      var self = this;
      return this._coachCard(function () { _next(); });
    }
    return _next();
  };

  LAB._coachCard = function (cb) {
    var n = this.queue.length, i = this.idx, prev = this.queue[i - 1], nxt = this.queue[i];
    var info = INFO[nxt] || { e: '➡', t: 'Follow the on-screen guide.' };
    var msg = i === n - 1 ? 'Last one: you\'re almost done! 🎉'
            : (i / n >= 0.5 ? 'More than halfway there!' : CHEERS[i % CHEERS.length]);
    this._coachToken = (this._coachToken || 0) + 1;
    var tok = this._coachToken, self = this;
    this._coachCB = function () {
      if (self._coachToken !== tok) return; self._coachToken++; clearTimeout(self._coachTimer);
      /* neutral "get ready" card so the old card never lingers behind the next demo popup */
      self.render('<div class="mwrap"><div class="card" style="text-align:center;padding:2.2rem 1.2rem"><div style="font-size:2.6rem">' + info.e + '</div>' +
        '<h2 class="h2" style="margin:.4rem 0 .2rem">' + esc(plainName(nxt)) + '</h2><p class="pg">Get ready…</p></div></div>');
      cb();
    };
    this.render(
      '<div class="mwrap"><div class="card card--pop wl2-coach">' +
        '<div class="wl2-check">✓</div>' +
        '<h2 class="h2">' + esc(msg) + '</h2>' +
        '<p class="wl2-coach-sub">' + esc(plainName(prev)) + ' done · ' + i + ' of ' + n + ' complete · ' + minsText(secsLeft(i)) + '</p>' +
        '<div class="wl2-coach-next"><span class="e">' + info.e + '</span><div><small>NEXT UP</small><b>' + esc(plainName(nxt)) + '</b><span class="t">' + esc(info.t) + '</span></div></div>' +
        '<button class="btn btn--p btn--lg btn--full" onclick="LAB._coachGo()">Continue →</button>' +
        '<div class="wl2-auto" id="wl2AutoWrap"><i></i></div>' +
        '<button class="wl2-textbtn" id="wl2PauseBtn" onclick="LAB._coachPause()">⏸ Take a moment</button>' +
      '</div></div>'
    );
    try { this._updateProg(); } catch (e) {}
    try { this.celebrate(); } catch (e) {}
    clearTimeout(this._coachTimer);
    this._coachTimer = setTimeout(this._coachCB, 6500);
  };
  LAB._coachGo = function () { clearTimeout(this._coachTimer); if (this._coachCB) this._coachCB(); };
  LAB._coachPause = function () {
    clearTimeout(this._coachTimer);
    var w = document.getElementById('wl2AutoWrap'), b = document.getElementById('wl2PauseBtn');
    if (w) w.style.display = 'none';
    if (b) b.style.display = 'none';
  };

  /* ── Skip: gentle nudge first, remember what was skipped ───────────── */
  var _skip = LAB.skip.bind(LAB);
  LAB.skip = function () {
    var m = this.queue[this.idx];
    if (m) { (this._skippedMods = this._skippedMods || []).push(m); }
    this._viaSkip = true;
    return _skip();
  };
  LAB.askSkip = function () {
    if (document.getElementById('wl2SkipModal')) return;
    var m = this.queue[this.idx], nm = m ? plainName(m) : 'this test';
    var el = document.createElement('div');
    el.id = 'wl2SkipModal'; el.className = 'wl2-modal';
    el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true');
    el.innerHTML =
      '<div><div style="font-size:2.2rem">🤔</div><h3>Skip ' + esc(nm) + '?</h3>' +
      '<p>It only takes about a minute and makes your report more accurate. Want to give it a go?</p>' +
      '<button class="btn btn--p btn--lg btn--full" id="wl2KeepBtn">Yes, let\'s do it 💪</button>' +
      '<button class="wl2-textbtn" id="wl2SkipAnyway" style="margin-top:.5rem">Skip anyway</button></div>';
    document.body.appendChild(el);
    var self = this;
    function close() { el.remove(); }
    el.querySelector('#wl2KeepBtn').onclick = close;
    el.addEventListener('click', function (ev) { if (ev.target === el) close(); });
    el.querySelector('#wl2SkipAnyway').onclick = function () {
      close();
      var ov = document.getElementById('demo-ov');
      if (ov && ov.classList.contains('show')) self.closeDemo(true);
      self.skip();
    };
    var kb = el.querySelector('#wl2KeepBtn'); if (kb && kb.focus) kb.focus();
  };

  /* ── Results page: offer to do the skipped tests ───────────────────── */
  function addSkipBanner() {
    var s = LAB._skippedMods || [], c = document.getElementById('modContent');
    if (!s.length || !c || c.querySelector('.wl2-skipnote')) return;
    var names = s.map(plainName).join(', ');
    c.insertAdjacentHTML('afterbegin',
      '<div class="wl2-skipnote"><b>You skipped ' + s.length + (s.length > 1 ? ' tests' : ' test') + '</b>' +
      '<p>' + esc(names) + '. Finish ' + (s.length > 1 ? 'them' : 'it') + ' for a more complete report.</p>' +
      '<button class="btn btn--p btn--sm" onclick="LAB.retrySkipped()">↺ Do ' + (s.length > 1 ? 'them' : 'it') + ' now</button></div>');
  }
  LAB.retrySkipped = function () {
    var q = (this._skippedMods || []).slice();
    if (!q.length) return;
    this._skippedMods = []; this.queue = q; this.idx = 0; this.currentMode = 'full';
    this.show('sModules'); this.next();
  };
  if (typeof LAB.showDashboard === 'function') {
    var _sd = LAB.showDashboard.bind(LAB);
    LAB.showDashboard = function () { var r = _sd.apply(null, arguments); try { addSkipBanner(); } catch (e) {} return r; };
  }
  if (typeof LAB._origDash === 'function') {
    var _od = LAB._origDash;
    LAB._origDash = function () { var r = _od.apply(null, arguments); try { addSkipBanner(); } catch (e) {} return r; };
  }
})();
