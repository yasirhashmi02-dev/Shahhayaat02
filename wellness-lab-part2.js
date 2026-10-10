'use strict';

(function(){
  if (document.getElementById('p2css')) return;
  const s = document.createElement('style');
  s.id = 'p2css';
  s.textContent = `
    .rz{width:100%;border-radius:14px;height:178px;display:flex;align-items:center;
        justify-content:center;flex-direction:column;gap:.4rem;cursor:pointer;
        user-select:none;border:2.5px solid var(--b);transition:background .18s,border-color .18s,box-shadow .18s;
        background:#fff;position:relative;overflow:hidden;-webkit-tap-highlight-color:transparent}
    .rz-l{font-size:clamp(1rem,3vw,1.3rem);font-weight:700;color:var(--tq);transition:color .18s}
    .rz-s{font-size:.68rem;color:var(--tq);transition:opacity .3s}
    .rz.go{background:var(--g4);border-color:var(--g);
           box-shadow:0 0 0 6px rgba(42,120,90,.15),0 0 32px rgba(42,120,90,.12);
           animation:rzPulse 1s ease-in-out infinite}
    .rz.go .rz-l{color:var(--g)}
    .rz.early{background:var(--am2);border-color:var(--am)}
    .rz.early .rz-l{color:var(--am)}
    .rz.done{background:var(--g3);border-color:var(--g2);cursor:default}
    .rz.done .rz-l{color:var(--t)}
    @keyframes rzPulse{0%,100%{box-shadow:0 0 0 6px rgba(42,120,90,.15)}
      50%{box-shadow:0 0 0 14px rgba(42,120,90,.04)}}
    .rxh{display:flex;align-items:flex-end;gap:3px;height:44px;padding:0 .2rem;margin:.5rem 0}
    .rxb{flex:1;border-radius:3px 3px 0 0;min-height:3px;
         transition:height .4s cubic-bezier(.4,0,.2,1),background .3s}
    .timer{font-family:'JetBrains Mono',monospace;font-size:clamp(2.4rem,7vw,3.8rem);
           font-weight:600;line-height:1;text-align:center;color:var(--g);
           display:block;margin:.6rem 0;transition:color .35s}
    .timer.warn{color:var(--am)}
    .timer.crit{color:var(--rd);animation:timerWiggle .45s ease-in-out infinite}
    @keyframes timerWiggle{0%,100%{transform:rotate(0)}
      25%{transform:rotate(-4deg)}75%{transform:rotate(4deg)}}
    .mgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;
           width:min(276px,82vw);margin:0 auto}
    .mcell{aspect-ratio:1;background:#fff;border:2px solid var(--b);
           border-radius:10px;transition:all .2s cubic-bezier(.4,0,.2,1);
           cursor:pointer;display:flex;align-items:center;justify-content:center;
           font-size:1.1rem;-webkit-tap-highlight-color:transparent}
    .mcell.lit{background:var(--g2);border-color:var(--g);
               transform:scale(1.08);box-shadow:0 4px 14px rgba(42,120,90,.25)}
    .mcell.sel{background:#DBEAFE;border-color:#3B82F6}
    .mcell.ok{background:var(--g3);border-color:var(--ok)}
    .mcell.bad{background:var(--rd2);border-color:var(--rd)}
    .ac-row{display:flex;align-items:center;justify-content:center;padding:.75rem;
            background:#fff;border:2px solid var(--b);border-radius:var(--rs);
            margin:.42rem 0;cursor:pointer;transition:all .22s;font-weight:700;
            letter-spacing:.12em;color:var(--t);font-family:'JetBrains Mono',monospace}
    .ac-row:hover{border-color:var(--g);background:var(--g4);transform:translateX(3px)}
    .ac-row.seen{background:var(--g3);border-color:var(--ok)}
    .ac-row.unseen{background:var(--rd2);border-color:var(--rd)}
    .sc-row{display:flex;flex-wrap:wrap;gap:.55rem;margin:.9rem 0}
    .scb{background:var(--bg);border:1.5px solid var(--b);border-radius:var(--rs);
         padding:.55rem .88rem;min-width:76px;transition:border-color .2s}
    .scb:hover{border-color:rgba(42,122,90,.3)}
    .scb .v{font-family:'JetBrains Mono',monospace;font-size:1rem;font-weight:600;
            color:var(--g);display:block;line-height:1}
    .scb .l{font-size:.57rem;color:var(--tq);text-transform:uppercase;
            letter-spacing:.09em;margin-top:.15rem;display:block}

    @keyframes shimmer{0%{opacity:.5}50%{opacity:1}100%{opacity:.5}}
    .dem-shimmer{animation:shimmer 1.6s ease-in-out infinite}

    @keyframes scorePop{0%{transform:scale(.8);opacity:0}
      60%{transform:scale(1.12)}100%{transform:scale(1);opacity:1}}
    .score-pop{animation:scorePop .45s cubic-bezier(.4,0,.2,1) both}
  `;
  document.head.appendChild(s);
})();

window.mod_reactionSpeed = function () {
  const ROUNDS = 10;
  const st = { round:0, times:[], waiting:false, startT:0, locked:false };
  let _wait = null;

  LAB.showDemo({
    title: '⚡ Reaction Speed',
    txt: 'The box turns <strong style="color:var(--am)">red → Wait</strong> then suddenly goes <strong style="color:var(--g)">green → TAP!</strong><br>Hit it the instant you see green. <strong>Do NOT tap on Wait or you lose that round.</strong>',
    hint: '10 rounds · try to beat your best each time!',
    voiceEN: "First up — Reaction Speed! A box appears. Red means wait, green means tap as fast as you can. Simple! Ten quick rounds — let's see how sharp you are!",
    btnLabel: 'Begin Reaction Assessment →',
    vis: `<div style="display:flex;flex-direction:column;align-items:center;gap:.8rem;padding:.6rem">
      <div id="dRxBox" class="d3p" style="width:160px;height:58px;border-radius:16px;
           background:#fff;border:2.5px solid #D4E8DC;
           display:flex;align-items:center;justify-content:center;
           font-weight:800;font-size:1rem;color:#6A8A6A;
           box-shadow:0 8px 24px rgba(42,120,90,.12),0 2px 6px rgba(0,0,0,.06);
           transition:all .25s cubic-bezier(.4,0,.2,1);letter-spacing:.03em">⏳ Wait…</div>
      <div style="display:flex;gap:6px;align-items:center">
        <div style="width:10px;height:10px;border-radius:50%;background:#E88080;box-shadow:0 0 8px rgba(220,80,80,.4)"></div>
        <div style="font-size:.65rem;color:var(--tq);font-weight:600">Red = Wait · Green = TAP!</div>
        <div style="width:10px;height:10px;border-radius:50%;background:#38A87A;box-shadow:0 0 8px rgba(42,120,90,.4)"></div>
      </div>
    </div>`,
    anim(vis) {
      let on = false;
      const box = vis.querySelector('#dRxBox');
      const id = setInterval(() => {
        on = !on;
        if (!box) return;
        box.style.background   = on ? '#E8F5EE' : '#FFF5F5';
        box.style.borderColor  = on ? '#2A7A5A' : '#E88080';
        box.style.color        = on ? '#1A8C52' : '#C05050';
        box.style.boxShadow    = on ? '0 0 0 5px rgba(42,120,90,.15)' : 'none';
        box.style.transform    = on ? 'scale(1.04)' : 'scale(1)';
        box.textContent        = on ? '👆 TAP NOW!' : '🔴 Wait…';
      }, 1000);
      return id;
    }
  }, () => {
    LAB.render(`<div class="mwrap"><div class="card card--pop">
      <div class="step-head">
        <div class="tag">⚡ Brain · 1 of 3</div>
        <h2 class="h2" style="margin-top:.75rem;margin-bottom:.4rem">Reaction Speed</h2>
        <p class="pg">Tap the button the <strong>instant</strong> it turns <strong style="color:var(--g)">green</strong>. 10 rounds. Tap on red = lost round!</p>
      </div>
      <div style="display:flex;justify-content:center">
        <div id="rxBox" class="rz rz-wait" onclick="_rxTap()" role="button" tabindex="0"
             onkeydown="if(event.key===' '||event.key==='Enter')_rxTap()"
             aria-label="Reaction tap button">
          <span class="rz-l" id="rxLbl">Getting ready…</span>
          <span class="rz-s" id="rxSub">⬆ one finger only</span>
        </div>
      </div>
      <div class="rxh" id="rxH" aria-hidden="true"></div>
      <div class="sc-row">
        <div class="scb"><span class="v" id="rxRnd">0/${ROUNDS}</span><span class="l">Round</span></div>
        <div class="scb"><span class="v" id="rxLast">—</span><span class="l">Last ms</span></div>
        <div class="scb"><span class="v" id="rxBest">—</span><span class="l">Best ms</span></div>
        <div class="scb"><span class="v" id="rxAvg">—</span><span class="l">Average</span></div>
      </div>
    </div></div>`);
    LAB.say("You're doing great — keep your finger ready! Tap the moment it turns green. Go!");
    setTimeout(_rxSchedule, 900);
  });

  function _rxSchedule() {
    const z=document.getElementById('rxBox'), l=document.getElementById('rxLbl'), s=document.getElementById('rxSub');
    if (!z) return;
    z.className='rz rz-wait'; z.style.cssText='';
    if (l) { l.textContent='🔴 Wait…'; l.style.color=''; }
    if (s) s.textContent='do NOT tap yet';
    st.waiting=false; st.locked=false;
    _wait = setTimeout(() => {
      const z2=document.getElementById('rxBox'), l2=document.getElementById('rxLbl');
      if (!z2) return;
      z2.className='rz go'; z2.style.cssText='';
      if (l2) { l2.textContent='👆 TAP NOW!'; l2.style.color=''; }
      st.waiting=true; st.startT=performance.now();
    }, 1200 + Math.random()*2800);
  }

  window._rxTap = function () {
    if (st.locked) return;
    if (!st.waiting) {
      clearTimeout(_wait); st.locked=true;
      const z=document.getElementById('rxBox'), l=document.getElementById('rxLbl');
      if (z) { z.className='rz early'; z.style.cssText=''; }
      if (l) { l.textContent='⚠ Too early! Wait for green.'; l.style.color=''; }
      LAB.flash('miss');
      setTimeout(_rxSchedule, 1400);
      return;
    }
    const rt = Math.round(performance.now() - st.startT);
    st.times.push(rt); st.round++; st.waiting=false; st.locked=true;
    const col = rt<250?'var(--ok)':rt<400?'var(--am)':'var(--rd)';
    const em  = rt<200?'🚀':rt<280?'⚡':rt<380?'👍':'⏳';
    const z=document.getElementById('rxBox'), l=document.getElementById('rxLbl');
    if (z) { z.className='rz done'; z.style.cssText=''; }
    if (l) { l.textContent=`${em} ${rt} ms`; l.style.color=col; }
    const set=(id,v,c)=>{const e=document.getElementById(id);if(!e)return;e.textContent=v;if(c)e.style.color=c;};
    set('rxRnd',st.round+'/'+ROUNDS);
    set('rxLast',rt+'ms',col);
    set('rxBest',Math.min(...st.times)+'ms','var(--ok)');
    set('rxAvg',Math.round(LAB.avg(st.times))+'ms');
    const h=document.getElementById('rxH');
    if (h) {
      const mx=Math.max(...st.times,400);
      h.innerHTML=st.times.map(t=>{
        const ht=Math.max(4,Math.round(t/mx*40));
        const c=t<250?'var(--ok)':t<400?'var(--am)':'var(--rd)';
        return `<div class="rxb" style="height:${ht}px;background:${c}" title="${t}ms"></div>`;
      }).join('');
    }
    LAB.flash('hit');
    if (st.round>=ROUNDS) setTimeout(_rxDone,700);
    else setTimeout(_rxSchedule,820);
  };

  function _rxDone() {
    const m=LAB.avg(st.times), sd=LAB.sd(st.times), best=Math.min(...st.times);
    const sc=LAB.clamp(Math.round((m<200?100:m<260?92:m<320?82:m<420?70:m<560?55:38) - sd/22),18,100);
    LAB.raw.rxAvg=Math.round(m); LAB.raw.rxBest=best; LAB.raw.rxSD=Math.round(sd); LAB.raw.rxScore=sc;
    if (typeof LAB._saveToHistory === 'function') LAB._saveToHistory('Reaction Speed', Math.round(m), 'ms');
    LAB.celebrate();
    LAB.say(`Nice one! Your average reaction was ${Math.round(m)} milliseconds — that is ${LAB.scoreLbl(sc)}! Keep going, you are doing brilliantly!`);
    /* v2: Show challenge button briefly before auto-advance */
    const mc = LAB.el('modContent');
    if (mc && LAB.currentMode !== 'challenge') {
      const btn = document.createElement('div');
      btn.style.cssText = 'text-align:center;margin-top:1rem';
      btn.innerHTML = `<button class="btn btn--o" style="font-size:.82rem;padding:.55rem 1.2rem"
        onclick="LAB.copyChallengeLink('mod_reactionSpeed',${Math.round(m)})">
        🏆 Challenge a friend &nbsp;<span style="opacity:.7;font-size:.75rem">${Math.round(m)}ms</span>
      </button>`;
      mc.appendChild(btn);
    }
    setTimeout(()=>{ LAB.idx++; LAB.next(); },3500);
  }
};

/* ══════════════════════════════════════════════════════════════
   mod_spatialMemory — Simon-style spatial pattern memory test
   Measures: working memory, pattern recognition, visual-spatial recall
   Method: lights up a sequence of squares; user reproduces it.
   Starts at 3 items, increases until failure. Score = max span × accuracy.
   ══════════════════════════════════════════════════════════════ */
window.mod_spatialMemory = function () {
  'use strict';
  const GRID = 9; // 3×3 grid
  let _seq = [], _input = [], _level = 3, _phase = 'idle', _score = 0, _attempts = 0, _correct = 0;
  const COLORS = { lit:'#2A7A5A', idle:'#E8F0E9', wrong:'#C0392B', right:'#38A87A', user:'#2563EB' };

  LAB.showDemo({
    title: '🧩 Spatial Memory',
    txt: 'Watch squares light up in a sequence — then <strong>tap them in the same order</strong>. The sequence gets longer with each round. Tests your working memory and spatial recall.',
    hint: 'Watch carefully · reproduce the pattern · gets harder',
    voiceEN: 'Spatial Memory test! Watch squares light up on a grid, then tap them back in the same order. It starts easy and gets longer. Get ready!',
    btnLabel: 'Begin Spatial Memory Test →',
    vis: `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;width:120px;margin:0 auto">
      ${Array.from({length:9},(_,i)=>`<div id="dSq${i}" style="aspect-ratio:1;background:#E8F0E9;border-radius:8px;border:2px solid #C8DDD0;transition:all .2s"></div>`).join('')}
    </div>`,
    anim(vis) {
      let i=0,on=false;
      const squares=vis.querySelectorAll('[id^=dSq]');
      const id=setInterval(()=>{
        squares.forEach(s=>{s.style.background='#E8F0E9';s.style.boxShadow='none';});
        if(!on&&squares[i]){
          squares[i].style.background='#2A7A5A';
          squares[i].style.boxShadow='0 0 10px rgba(42,120,90,.5)';
        }
        on=!on;
        if(!on){i=(i+1)%squares.length;}
      },450);
      return id;
    }
  }, () => {
    _seq=[]; _input=[]; _level=3; _score=0; _attempts=0; _correct=0; _phase='idle';
    _smRender();
    setTimeout(_smNewRound, 600);
  });

  function _smRender() {
    LAB.render(`<div class="mwrap"><div class="card card--pop">
      <div class="step-head">
        <div class="tag">🧩 Brain · 2 of 3</div>
        <h2 class="h2" style="margin-top:.75rem;margin-bottom:.3rem">Spatial Memory</h2>
        <p class="pg" id="smMsg">Watch the sequence light up…</p>
      </div>
      <div style="display:flex;justify-content:center;margin:1.2rem 0">
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;width:min(240px,72vw)">
          ${Array.from({length:GRID},(_,i)=>`
            <div id="smCell${i}" onclick="window._smTap(${i})" role="button" tabindex="0"
                 onkeydown="if(event.key==='Enter'||event.key===' ')window._smTap(${i})"
                 aria-label="Cell ${i+1}"
                 style="aspect-ratio:1;background:#E8F0E9;border-radius:12px;border:2px solid #C8DDD0;
                        display:flex;align-items:center;justify-content:center;font-size:1.4rem;
                        cursor:pointer;transition:all .18s;-webkit-tap-highlight-color:transparent;
                        box-shadow:0 2px 6px rgba(0,0,0,.06)"></div>`).join('')}
        </div>
      </div>
      <div class="sc-row" style="justify-content:center">
        <div class="scb"><span class="v" id="smLvl">${_level}</span><span class="l">Sequence</span></div>
        <div class="scb"><span class="v" id="smCorrect">0</span><span class="l">✓ Correct</span></div>
        <div class="scb"><span class="v" id="smProgress">—</span><span class="l">Input</span></div>
      </div>
    </div></div>`);
  }

  function _smCell(i) { return document.getElementById('smCell'+i); }
  function _smMsg(t,c) { const e=document.getElementById('smMsg'); if(e){e.textContent=t;if(c)e.style.color=c;else e.style.color='';} }

  function _smNewRound() {
    _phase='show'; _input=[];
    // Build new sequence: keep old + add one random new cell
    if(_seq.length < _level) {
      while(_seq.length < _level) {
        let n; do { n=Math.floor(Math.random()*GRID); } while(_seq.slice(-1)[0]===n);
        _seq.push(n);
      }
    } else {
      let n; do { n=Math.floor(Math.random()*GRID); } while(_seq.slice(-1)[0]===n);
      _seq.push(n);
      _level = _seq.length;
    }
    // Update UI
    const lvl=document.getElementById('smLvl'); if(lvl) lvl.textContent=_seq.length;
    const prog=document.getElementById('smProgress'); if(prog) prog.textContent='Watching…';
    _smMsg('Watch carefully — ' + _seq.length + ' squares will light up');
    // Flash each square in sequence
    let delay=700;
    _seq.forEach((ci,idx)=>{
      setTimeout(()=>{
        const c=_smCell(ci);
        if(c){c.style.background=COLORS.lit;c.style.boxShadow='0 0 18px rgba(42,120,90,.45)';c.style.transform='scale(1.07)';}
      }, delay);
      setTimeout(()=>{
        const c=_smCell(ci);
        if(c){c.style.background='#E8F0E9';c.style.boxShadow='0 2px 6px rgba(0,0,0,.06)';c.style.transform='';}
        if(idx===_seq.length-1) {
          setTimeout(()=>{
            _phase='input';
            _smMsg('Now tap them in the same order! (' + _seq.length + ' taps)', 'var(--g)');
            const prog2=document.getElementById('smProgress'); if(prog2) prog2.textContent='0/'+_seq.length;
          }, 350);
        }
      }, delay+440);
      delay += 650;
    });
  }

  window._smTap = function(i) {
    if(_phase !== 'input') return;
    const c=_smCell(i); if(!c) return;
    _input.push(i);
    const pos=_input.length-1;
    const prog=document.getElementById('smProgress');
    if(prog) prog.textContent=_input.length+'/'+_seq.length;
    if(_input[pos] !== _seq[pos]) {
      // Wrong
      c.style.background=COLORS.wrong; c.style.transform='scale(0.92)';
      setTimeout(()=>{if(c){c.style.background='#E8F0E9';c.style.transform='';}}, 400);
      _phase='feedback'; _attempts++;
      _smMsg('❌ Wrong! ' + (_attempts<3?'Try the next sequence…':''), 'var(--rd)');
      // Flash correct cell briefly
      const correct=_smCell(_seq[pos]);
      if(correct){correct.style.background='#FFF3CD';correct.style.boxShadow='0 0 12px rgba(201,120,0,.4)';setTimeout(()=>{if(correct){correct.style.background='#E8F0E9';correct.style.boxShadow='';}},600);}
      if(_attempts>=3 || _seq.length>8) { setTimeout(_smFinish, 1200); }
      else {
        // Restart same level
        _seq=_seq.slice(0,_level); _input=[];
        setTimeout(_smNewRound, 1400);
      }
    } else {
      // Correct tap
      c.style.background=COLORS.user; c.style.boxShadow='0 0 14px rgba(37,99,235,.4)'; c.style.transform='scale(1.06)';
      setTimeout(()=>{if(c){c.style.background='#E8F0E9';c.style.boxShadow='0 2px 6px rgba(0,0,0,.06)';c.style.transform='';}},300);
      if(_input.length === _seq.length) {
        // Round complete!
        _correct++; _attempts=0; _phase='feedback';
        const corrEl=document.getElementById('smCorrect'); if(corrEl) corrEl.textContent=_correct;
        _smMsg('✅ Perfect! Getting harder…', 'var(--ok)');
        if(_seq.length>=9) { setTimeout(_smFinish,900); return; }
        setTimeout(_smNewRound, 1000);
      }
    }
  };

  function _smFinish() {
    const maxSpan = _seq.length;
    const acc = _correct / Math.max(1, _correct+_attempts);
    // Score: max span drives most of it (longer = better), accuracy multiplier
    const spanScore = Math.min(100, Math.round((maxSpan/9)*80 + (acc*20)));
    const sc = LAB.clamp(spanScore, 15, 100);
    LAB.raw.memSpan=maxSpan; LAB.raw.memScore=sc; LAB.raw.memAcc=Math.round(acc*100);
    // Merge into cognitive
    const cog=[LAB.raw.rxScore,sc,LAB.raw.stroopScore].filter(x=>x!=null);
    if(cog.length) LAB.scores.cognitive=Math.round(LAB.avg(cog));
    LAB.celebrate();
    LAB.say(`Spatial memory done! You reached a sequence of ${maxSpan} — that is ${LAB.scoreLbl(sc)}. Now the Stroop test!`);
    setTimeout(()=>{ LAB.idx++; LAB.next(); }, 2000);
  }
};

/* ══════════════════════════════════════════════════════════════
   mod_stroopTest — Classic Stroop Colour-Word Interference Test
   Measures: cognitive flexibility, executive function, processing speed
   Method: word is a colour name printed in a DIFFERENT colour ink.
   User picks the INK colour (not what the word says).
   Gold-standard neuropsychology test, highly accurate.
   ══════════════════════════════════════════════════════════════ */
window.mod_stroopTest = function () {
  'use strict';
  const COLORS_MAP = {
    RED:   { label:'Red',    hex:'#C0392B', bg:'#FEECEB' },
    GREEN: { label:'Green',  hex:'#1A8C52', bg:'#E8F5EE' },
    BLUE:  { label:'Blue',   hex:'#2563EB', bg:'#EEF4FF' },
    ORANGE:{ label:'Orange', hex:'#C97010', bg:'#FFF8ED' },
  };
  const WORDS = Object.keys(COLORS_MAP);
  const TOTAL = 20; // 20 trials
  let _trial=0, _correct=0, _rts=[], _startT=0, _target=null, _inkKey=null, _active=false;
  let _trialTimer=null;

  LAB.showDemo({
    title: '🎨 Stroop Colour Test',
    txt: 'A colour word appears — but printed in a <strong>different ink colour</strong>.<br>Tap <strong>the ink colour you see</strong> — NOT what the word says. This is trickier than it sounds!',
    hint: '20 trials · speed + accuracy both count',
    voiceEN: 'Stroop test! A colour word appears in a different ink. Tap the colour of the ink — not what the word says. Classic brain test. Ready?',
    btnLabel: 'Begin Stroop Test →',
    vis: `<div style="text-align:center;padding:.5rem">
      <div style="font-size:2.2rem;font-weight:800;color:#2563EB;letter-spacing:.05em;margin-bottom:.5rem">RED</div>
      <div style="font-size:.72rem;color:var(--tq);font-weight:600">The word says RED but the ink is BLUE<br>→ Tap <span style="color:#2563EB;font-weight:700">Blue</span></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:.4rem;max-width:180px;margin:.8rem auto 0">
        ${Object.values({RED:{label:'Red',hex:'#C0392B'},GREEN:{label:'Green',hex:'#1A8C52'},BLUE:{label:'Blue',hex:'#2563EB'},ORANGE:{label:'Orange',hex:'#C97010'}}).map(c=>`
          <div style="padding:.45rem;background:${c.hex}18;border:2px solid ${c.hex}44;border-radius:9px;font-size:.8rem;font-weight:700;color:${c.hex};text-align:center">${c.label}</div>`).join('')}
      </div>
    </div>`,
    anim(vis) { return null; }
  }, () => {
    _trial=0; _correct=0; _rts=[]; _active=false; _target=null; _inkKey=null;
    LAB.render(`<div class="mwrap"><div class="card card--pop">
      <div class="step-head">
        <div class="tag">🎨 Brain · 3 of 3</div>
        <h2 class="h2" style="margin-top:.75rem;margin-bottom:.25rem">Stroop Test</h2>
        <p class="pg" style="font-size:.82rem">Tap the <strong>ink colour</strong> — ignore what the word says</p>
      </div>

      <!-- Trial counter + progress bar -->
      <div style="display:flex;align-items:center;gap:.75rem;margin-bottom:1rem">
        <div style="flex:1;height:5px;background:var(--g3);border-radius:3px;overflow:hidden">
          <div id="strProgress" style="height:100%;background:linear-gradient(90deg,var(--g),var(--g2));border-radius:3px;width:0%;transition:width .4s"></div>
        </div>
        <span style="font-family:'JetBrains Mono',monospace;font-size:.65rem;color:var(--tq);white-space:nowrap" id="strTrialLbl">0 / ${TOTAL}</span>
      </div>

      <!-- The word display -->
      <div style="min-height:90px;display:flex;align-items:center;justify-content:center;margin:.5rem 0 1.2rem">
        <div id="strWord" style="font-size:clamp(2rem,8vw,3rem);font-weight:800;letter-spacing:.06em;
             transition:opacity .15s;opacity:0;text-align:center;line-height:1">
          TAP START
        </div>
      </div>

      <!-- 4-button colour grid -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:.6rem">
        ${Object.entries(COLORS_MAP).map(([key,c])=>`
          <button id="strBtn_${key}" onclick="window._strTap('${key}')"
            style="padding:.9rem .5rem;border-radius:12px;border:2.5px solid ${c.hex}44;
                   background:${c.bg};color:${c.hex};font-size:1rem;font-weight:700;
                   cursor:pointer;transition:all .15s;-webkit-tap-highlight-color:transparent;
                   min-height:52px"
            onmousedown="this.style.transform='scale(.95)'"
            onmouseup="this.style.transform='scale(1)'"
            ontouchstart="this.style.transform='scale(.95)'"
            ontouchend="this.style.transform='scale(1)'">
            ${c.label}
          </button>`).join('')}
      </div>

      <div class="sc-row" style="justify-content:center;margin-top:1.2rem">
        <div class="scb"><span class="v" id="strAcc">—</span><span class="l">Accuracy</span></div>
        <div class="scb"><span class="v" id="strSpeed">—</span><span class="l">Avg ms</span></div>
        <div class="scb"><span class="v" id="strStreak" style="color:var(--g)">0</span><span class="l">Streak 🔥</span></div>
      </div>

      <div style="text-align:center;margin-top:1rem">
        <button class="btn btn--p" id="strStartBtn" onclick="window._strBegin()">▶ Start Stroop Test</button>
      </div>
    </div></div>`);
    LAB.say('Remember — tap the colour the word is printed in, not what the word says!');
  });

  window._strBegin = function() {
    const b=document.getElementById('strStartBtn'); if(b) b.style.display='none';
    _active=true;
    _strNextTrial();
  };

  function _strNextTrial() {
    if(_trial>=TOTAL) { _strFinish(); return; }
    // Pick a word and an INK colour that is different
    const wordKey = WORDS[Math.floor(Math.random()*WORDS.length)];
    let inkKey;
    do { inkKey=WORDS[Math.floor(Math.random()*WORDS.length)]; } while(inkKey===wordKey);
    _target=wordKey; _inkKey=inkKey;
    const inkColor = COLORS_MAP[inkKey].hex;
    const wordEl = document.getElementById('strWord');
    if(wordEl) {
      wordEl.style.opacity='0';
      setTimeout(()=>{
        if(!document.getElementById('strWord')) return;
        wordEl.textContent = COLORS_MAP[wordKey].label.toUpperCase();
        wordEl.style.color = inkColor;
        wordEl.style.opacity='1';
        _startT = performance.now();
        // Timeout: if no answer in 3.5s, count as miss
        _trialTimer=setTimeout(()=>{
          if(!_active) return;
          _strTap(null); // null = timeout
        }, 3500);
      }, 180);
    }
  }

  window._strTap = function(chosenKey) {
    if(!_active || _target===null) return;
    clearTimeout(_trialTimer);
    const rt = Math.round(performance.now()-_startT);
    const isCorrect = chosenKey===_inkKey;
    if(isCorrect) { _correct++; _rts.push(rt); }
    _trial++;

    // Visual flash on chosen button
    if(chosenKey) {
      const btn=document.getElementById('strBtn_'+chosenKey);
      if(btn){
        btn.style.border=`2.5px solid ${isCorrect?'#1A8C52':'#C0392B'}`;
        btn.style.background=isCorrect?'#D4F4E2':'#FEECEB';
        setTimeout(()=>{
          if(!btn) return;
          btn.style.border=`2.5px solid ${COLORS_MAP[chosenKey].hex}44`;
          btn.style.background=COLORS_MAP[chosenKey].bg;
        }, 300);
      }
    }

    // Update stats
    const acc=Math.round((_correct/_trial)*100);
    const avgRT=_rts.length?Math.round(_rts.reduce((a,b)=>a+b,0)/_rts.length):0;
    const s=(id,v,c)=>{const e=document.getElementById(id);if(e){e.textContent=v;if(c)e.style.color=c;}};
    s('strAcc',acc+'%',acc>80?'var(--ok)':acc>60?'var(--am)':'var(--rd)');
    s('strSpeed',avgRT?avgRT+'ms':'—');
    // Streak
    if(!window._strStrk) window._strStrk=0;
    window._strStrk = isCorrect ? window._strStrk+1 : 0;
    s('strStreak',window._strStrk);

    // Progress bar
    const pb=document.getElementById('strProgress'); if(pb) pb.style.width=((_trial/TOTAL)*100)+'%';
    const tl=document.getElementById('strTrialLbl'); if(tl) tl.textContent=_trial+' / '+TOTAL;

    setTimeout(_strNextTrial, isCorrect?280:420);
  };

  function _strFinish() {
    _active=false;
    const acc=_correct/TOTAL;
    const avgRT=_rts.length?_rts.reduce((a,b)=>a+b,0)/_rts.length:1500;
    // Score: accuracy 70%, speed 30% (faster = better, reference 800ms)
    const speedScore=Math.max(0,Math.min(100,Math.round((1-(avgRT-400)/2000)*100)));
    const sc=LAB.clamp(Math.round(acc*70+speedScore*0.30),15,100);
    LAB.raw.stroopCorrect=_correct; LAB.raw.stroopRT=Math.round(avgRT||0);
    LAB.raw.stroopScore=sc;
    // Merge cognitive
    const cog=[LAB.raw.rxScore,LAB.raw.memScore,sc].filter(x=>x!=null);
    if(cog.length) LAB.scores.cognitive=Math.round(LAB.avg(cog));
    LAB.celebrate();
    LAB.say(`Stroop test complete! ${_correct} out of ${TOTAL} correct — ${LAB.scoreLbl(sc)} cognitive flexibility. Brain lab done!`);
    setTimeout(()=>{ LAB.idx++; LAB.next(); },2000);
  }
};

window.mod_colourBlindness = function () {
  const allPlates=[
    {ans:'12',bg:'#E09040',fg:'#C83010'},
    {ans:'8', bg:'#70B070',fg:'#2A6020'},
    {ans:'29',bg:'#CC6060',fg:'#50A050'},
    {ans:'74',bg:'#7080C0',fg:'#D04010'},
    {ans:'5', bg:'#80A8C0',fg:'#E07020'},
    {ans:'6', bg:'#9090CC',fg:'#D0A020'},
    {ans:'45',bg:'#A06050',fg:'#50B050'},
    {ans:'16',bg:'#C08080',fg:'#4080A0'},
    {ans:'73',bg:'#60A870',fg:'#C06020'},
    {ans:'2', bg:'#B870B0',fg:'#70C070'},
    {ans:'3', bg:'#D08050',fg:'#5090D0'},
    {ans:'97',bg:'#90C060',fg:'#E05030'},
  ];
  // Randomise and pick 7 plates each session
  const shuffle=a=>{const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;};
  const plates=shuffle(allPlates).slice(0,7).map((p,i)=>({...p,label:`Plate ${i+1} of 7`}));
  let curr=0,correct=0;

  function mkRng(seed){let s=seed;return()=>{s=(s*9301+49297)%233280;return s/233280;};}

  function makePlate(bgCol,fgCol,numStr){
    const W=240,R=118,cx=120,cy=120;
    const rng=mkRng(numStr.split('').reduce((a,c)=>a+c.charCodeAt(0),0)*17);
    const dots=[];
    for(let i=0;i<340;i++){
      const angle=rng()*Math.PI*2,r=rng()*(R-8)+4;
      const x=cx+r*Math.cos(angle),y=cy+r*Math.sin(angle),sz=3.5+rng()*5.5,op=0.55+rng()*0.45;
      dots.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${sz.toFixed(1)}" fill="${bgCol}" opacity="${op.toFixed(2)}"/>`);
    }
    const glyphs={'0':[[1,1,1],[1,0,1],[1,0,1],[1,0,1],[1,0,1],[1,0,1],[1,1,1]],'1':[[0,1,0],[1,1,0],[0,1,0],[0,1,0],[0,1,0],[0,1,0],[1,1,1]],'2':[[1,1,1],[0,0,1],[0,0,1],[1,1,1],[1,0,0],[1,0,0],[1,1,1]],'3':[[1,1,1],[0,0,1],[0,0,1],[1,1,1],[0,0,1],[0,0,1],[1,1,1]],'4':[[1,0,1],[1,0,1],[1,0,1],[1,1,1],[0,0,1],[0,0,1],[0,0,1]],'5':[[1,1,1],[1,0,0],[1,0,0],[1,1,1],[0,0,1],[0,0,1],[1,1,1]],'6':[[1,1,1],[1,0,0],[1,0,0],[1,1,1],[1,0,1],[1,0,1],[1,1,1]],'7':[[1,1,1],[0,0,1],[0,0,1],[0,1,0],[0,1,0],[0,1,0],[0,1,0]],'8':[[1,1,1],[1,0,1],[1,0,1],[1,1,1],[1,0,1],[1,0,1],[1,1,1]],'9':[[1,1,1],[1,0,1],[1,0,1],[1,1,1],[0,0,1],[0,0,1],[1,1,1]]};
    const digits=numStr.split('').filter(d=>glyphs[d]);
    const cellSize=11,gap=4,totalW=digits.length*(3*cellSize+gap)-gap;
    const startX=cx-totalW/2,startY=cy-3.5*cellSize;
    digits.forEach((d,di)=>{
      const glyph=glyphs[d],ox=startX+di*(3*cellSize+gap);
      glyph.forEach((row,ry)=>row.forEach((pixel,rx)=>{
        if(!pixel)return;
        const px=ox+rx*cellSize+cellSize/2,py=startY+ry*cellSize+cellSize/2;
        const dist=Math.hypot(px-cx,py-cy);
        if(dist>R-6)return;
        const sz=5.5+rng()*3;
        dots.push(`<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${sz.toFixed(1)}" fill="${fgCol}" opacity="${(0.75+rng()*0.25).toFixed(2)}"/>`);
      }));
    });
    return `<svg viewBox="0 0 ${W} ${W}" width="${W}" height="${W}" style="max-width:100%;border-radius:50%;box-shadow:0 4px 20px rgba(0,0,0,.12)"><circle cx="${cx}" cy="${cy}" r="${R}" fill="#E8E0D0"/>${dots.join('')}</svg>`;
  }

  LAB.showDemo({
    title: '🎨 Colour Blindness Check',
    txt: 'You will see a circle packed with coloured dots. <strong>A number is hidden inside</strong> — look carefully. Type the number or tap "Cannot see it".',
    hint: '10 plates — takes about 3 minutes',
    voiceEN: "Eye section! First — colour vision. A circle of coloured dots has a number hidden inside. Try to spot it! Do not worry if you cannot see it — just try your best.",
    btnLabel: 'Begin Colour Perception Check →',
    vis: `<div style="display:flex;flex-direction:column;align-items:center;gap:.6rem;padding:.3rem">
      <div class="d3f" style="border-radius:50%;box-shadow:0 8px 24px rgba(0,0,0,.15),0 2px 8px rgba(0,0,0,.08)">
        <canvas id="cbDemoC" width="90" height="90" style="border-radius:50%;display:block"></canvas>
      </div>
      <div id="cbDemoH" style="font-size:.65rem;color:var(--tq);font-weight:600">Can you spot the hidden number?</div>
    </div>`,
    anim(vis) {
      const canvas=vis.querySelector('#cbDemoC'),hint=vis.querySelector('#cbDemoH');
      if(!canvas)return null;
      const ctx=canvas.getContext('2d');
      const W=88,cx=44,cy=44,R=41;
      function draw(reveal){
        ctx.clearRect(0,0,W,W);
        const rng=(s=>{let x=s;return()=>{x=(x*9301+49297)%233280;return x/233280;}})(42);
        ctx.fillStyle='#E8E0D0';ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);ctx.fill();
        for(let i=0;i<120;i++){
          const a=rng()*Math.PI*2,r=rng()*(R-4)+2;
          const x=cx+r*Math.cos(a),y=cy+r*Math.sin(a),sz=1.5+rng()*2.5;
          ctx.fillStyle=`hsl(${25+rng()*30},${60+rng()*25}%,${45+rng()*25}%)`;
          ctx.beginPath();ctx.arc(x,y,sz,0,Math.PI*2);ctx.fill();
        }
        const pts=[[1,0],[1,1],[1,2],[1,3],[0,2],[0,3],[1,4]];
        pts.forEach(([px,py])=>{
          const nx=cx-10+px*9,ny=cy-20+py*9;
          ctx.fillStyle=reveal?'#C83010':`hsl(${25+Math.random()*30},65%,52%)`;
          ctx.beginPath();ctx.arc(nx,ny,4,0,Math.PI*2);ctx.fill();
        });
      }
      let ph=0; draw(false);
      const id=setInterval(()=>{ph++;draw(ph%6>2);if(hint)hint.textContent=ph%6>2?'Number revealed: "6"!':'Can you spot it?';},700);
      return id;
    }
  }, ()=>_showPlate());

  function _showPlate(){
    if(curr>=plates.length){_cbDone();return;}
    const pl=plates[curr];if(!pl){_cbDone();return;}
    LAB.render(`<div class="mwrap"><div class="card card--pop" style="border-color:rgba(37,99,235,.2);background:linear-gradient(135deg,#EEF4FF,#fff)">
      <div class="step-head">
        <div class="tag" style="background:#EEF4FF;border-color:rgba(37,99,235,.28);color:#2563EB">👁 Eyes · 1 of 5</div>
        <h2 class="h2" style="margin-top:.75rem;margin-bottom:.4rem">Colour Blindness Check</h2>
        <p class="pg">Look at the circle below. <strong>What number can you see inside the dots?</strong></p>
      </div>
      <div style="text-align:center;margin:1rem 0">${makePlate(pl.bg,pl.fg,pl.ans)}</div>
      <p style="text-align:center;font-size:.7rem;color:var(--tq);margin:.3rem 0 1rem" class="mono">${pl.label}</p>
      <div class="fld">
        <label class="lbl" for="cbInp">Type the number you see</label>
        <input class="inp" type="number" id="cbInp" placeholder="e.g. 12"
               inputmode="numeric" min="1" max="99" autocomplete="off"
               onkeydown="if(event.key==='Enter')_cbAnswer()"
               style="text-align:center;font-size:1.4rem;font-weight:700;letter-spacing:.15em">
      </div>
      <div class="btn-row">
        <button class="btn btn--p btn--lg" onclick="_cbAnswer()">Confirm →</button>
        <button class="btn btn--g" onclick="_cbCantSee()">Cannot see a number</button>
      </div>
    </div></div>`);
    setTimeout(()=>{const inp=document.getElementById('cbInp');if(inp)inp.focus();},400);
    LAB.say(`Plate ${curr+1} — look carefully at the dots. Take your time, no rush!`);
  }

  window._cbAnswer=function(){
    if(curr>=plates.length)return;
    const inp=document.getElementById('cbInp'),val=inp?inp.value.trim():'';
    if(!val){_cbCantSee();return;}
    if(plates[curr]&&val===plates[curr].ans)correct++;
    curr++;_showPlate();
  };
  window._cbCantSee=function(){if(curr>=plates.length)return;curr++;_showPlate();};

  function _cbDone(){
    const sc=LAB.clamp(Math.round(correct/plates.length*100),0,100);
    LAB.raw.cbCorrect=correct;LAB.raw.cbTotal=plates.length;LAB.raw.cbScore=sc;
    LAB.raw.cbFlag=correct<Math.ceil(plates.length*0.67);
    LAB.celebrate();
    LAB.say(`All done! You spotted ${correct} out of ${plates.length} numbers correctly.`);
    setTimeout(()=>{LAB.idx++;LAB.next();},1800);
  }
};

window.mod_visualAcuity = function () {
  // Randomize letter order in each row every session
  const _optLet=['E','F','P','T','Z','D','C','L','O','B','N','K'];
  const _shufLet=a=>{const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;};
  const _rl=(n)=>_shufLet(_optLet).slice(0,n).join('  ');
  const rows=[
    {px:54,text:_rl(3), label:'Row 1 (largest)',  logMAR:1.0},
    {px:40,text:_rl(4), label:'Row 2',            logMAR:0.8},
    {px:30,text:_rl(5), label:'Row 3',            logMAR:0.6},
    {px:22,text:_rl(5), label:'Row 4',            logMAR:0.4},
    {px:16,text:_rl(6), label:'Row 5',            logMAR:0.2},
    {px:11,text:_rl(7), label:'Row 6',            logMAR:0.0},
    {px: 9,text:_rl(7), label:'Row 7',            logMAR:-0.1},
    {px: 8,text:_rl(7), label:'Row 8',            logMAR:-0.2},
    {px: 7,text:_rl(8), label:'Row 9 (finest)',   logMAR:-0.3},
  ];
  let chosen=-1;

  LAB.showDemo({
    title: '📏 Visual Acuity',
    txt: 'Rows of letters appear, getting <strong>smaller and smaller</strong>. Tap the <strong>smallest row you can read clearly</strong> from where you are sitting.',
    hint: '9 rows from large to very fine — keep glasses on',
    voiceEN: "Vision check! You will see rows of letters getting smaller. Just tap the smallest row you can read clearly. Keep your glasses on if you wear them — no trick here!",
    btnLabel: 'Begin Visual Acuity Assessment →',
    vis: `<div style="text-align:center;transform-style:preserve-3d;transform:perspective(300px) rotateX(8deg);padding:.5rem .8rem" id="acDemoWrap">
      <div style="background:#fff;border-radius:10px;padding:.5rem .9rem;box-shadow:0 8px 24px rgba(0,0,0,.1),0 2px 6px rgba(0,0,0,.06);border:1.5px solid #D4E8DC">
        <div id="acDl1" style="font-size:22px;font-weight:800;font-family:'JetBrains Mono',monospace;color:#1C2E1C;letter-spacing:.18em;transition:font-size .5s">E  F  P</div>
        <div id="acDl2" style="font-size:15px;font-weight:700;font-family:'JetBrains Mono',monospace;color:#2A5A2A;letter-spacing:.16em;transition:font-size .5s">F  E  L  P</div>
        <div id="acDl3" style="font-size:10px;font-weight:700;font-family:'JetBrains Mono',monospace;color:#6A8A6A;letter-spacing:.14em;transition:font-size .5s">P  E  C  F…</div>
      </div>
    </div>`,
    anim(vis) {
      const sizes=[[24,17,11],[21,14,9],[18,12,7],[15,10,8]];
      let step=0;
      const id=setInterval(()=>{
        step=(step+1)%sizes.length;
        const s=sizes[step];
        const l1=vis.querySelector('#acDl1'),l2=vis.querySelector('#acDl2'),l3=vis.querySelector('#acDl3');
        if(l1)l1.style.fontSize=s[0]+'px';
        if(l2)l2.style.fontSize=s[1]+'px';
        if(l3)l3.style.fontSize=s[2]+'px';
      },900);
      return id;
    }
  }, () => {
    LAB.render(`<div class="mwrap"><div class="card card--pop" style="border-color:rgba(37,99,235,.2);background:linear-gradient(135deg,#EEF4FF,#fff)">
      <div class="step-head">
        <div class="tag" style="background:#EEF4FF;border-color:rgba(37,99,235,.28);color:#2563EB">👁 Eyes · 2 of 5</div>
        <h2 class="h2" style="margin-top:.75rem;margin-bottom:.4rem">Visual Acuity</h2>
        <p class="pg">Tap the <strong>smallest row you can read clearly</strong>. Everything above is automatically marked as readable too.</p>
      </div>
      <div style="background:#fff;border:1.5px solid var(--b);border-radius:var(--rs);padding:1.1rem .9rem;margin:1rem 0" role="group" aria-label="Letter size chart">
        ${rows.map((r,i)=>`
          <div class="ac-row" id="ar${i}" onclick="_acTap(${i})" role="button" tabindex="0"
               onkeydown="if(event.key==='Enter')_acTap(${i})"
               aria-label="${r.label}" style="font-size:${r.px}px">
            ${r.text}
          </div>`).join('')}
      </div>
      <div class="notice notice--am">
        <div class="ni">👓</div>
        <p><strong>Tip:</strong> Normal screen distance. Glasses on. Tap the last row you can read without squinting.</p>
      </div>
      <div class="btn-row">
        <button class="btn btn--g" onclick="_acNone()">Cannot read any row clearly</button>
      </div>
    </div></div>`);
    LAB.say("Take a moment — look at the chart and tap the smallest row you can read comfortably. No squinting needed!");
  });

  window._acTap=function(i){
    chosen=i;
    rows.forEach((_,j)=>{
      const e=document.getElementById('ar'+j);
      if(!e)return;
      e.classList.remove('seen','unseen');
      if(j<=i)e.classList.add('seen');else e.classList.add('unseen');
    });
    LAB.flash('hit');
    setTimeout(_acDone,650);
  };
  window._acNone=function(){chosen=-1;_acDone();};

  function _acDone(){
    const scArr=[5,18,32,47,60,72,82,90,96,99];
    const sc=LAB.clamp(scArr[Math.max(0,chosen+1)]??10,0,100);
    LAB.raw.acuityRow=chosen;LAB.raw.acuityScore=sc;LAB.raw.acuityFlag=chosen<3;
    LAB.celebrate();
    LAB.say(`Vision check done! You could read down to row ${chosen+1} of 9 — that is ${LAB.scoreLbl(sc)} visual acuity. Great job!`);
    setTimeout(()=>{LAB.idx++;LAB.next();},1800);
  }
};

window.mod_contrastSensitivity = function () {
  const levels=[
    {fg:'#111111',bg:'#FFFFFF',letter:'E',label:'Full contrast'},
    {fg:'#4D4D4D',bg:'#FFFFFF',letter:'F',label:'High contrast'},
    {fg:'#888888',bg:'#FFFFFF',letter:'P',label:'Medium contrast'},
    {fg:'#AAAAAA',bg:'#F5F5F5',letter:'L',label:'Low contrast'},
    {fg:'#C8C8C8',bg:'#F8F8F8',letter:'T',label:'Very low'},
    {fg:'#E0E0E0',bg:'#F9F9F9',letter:'C',label:'Faint'},
  ];
  let curr=0,lastSeen=-1;

  LAB.showDemo({
    title: '⬜ Contrast Sensitivity',
    txt: 'A letter appears on a white background. Each round it gets <strong>harder to see</strong> as the contrast fades. Tap <strong>I Can See It</strong> while you still can. Stop when it becomes too faint.',
    hint: 'The letter gradually fades — tap while visible',
    voiceEN: 'A letter will appear on screen, and each round it will get harder to see as the contrast fades. Keep tapping while you can still see it, and stop when it becomes too faint.',
    btnLabel: 'Begin Contrast Sensitivity Check →',
    vis: `<div style="display:flex;gap:6px;justify-content:center;align-items:flex-end;transform-style:preserve-3d;transform:perspective(300px) rotateX(10deg);padding:.4rem .6rem">
      ${[['#111','#fff',52],['#4D4D4D','#fff',46],['#888','#fff',40],['#BBB','#f5f5f5',34],['#D8D8D8','#f9f9f9',28]].map(([fg,bg,sz],i)=>
        `<div id="csd${i}" style="width:${sz}px;height:${sz}px;background:${bg};border:1.5px solid #D4E8DC;
             border-radius:8px;display:flex;align-items:center;justify-content:center;
             font-size:${Math.round(sz*.65)}px;font-weight:800;color:${fg};font-family:'JetBrains Mono',monospace;
             box-shadow:0 4px 12px rgba(0,0,0,.1);
             transition:transform .25s,box-shadow .25s,border-color .25s">E</div>`
      ).join('')}
    </div>`,
    anim(vis) {
      let cur=0;
      const id=setInterval(()=>{
        for(let i=0;i<5;i++){
          const b=vis.querySelector(`#csd${i}`);if(!b)continue;
          b.style.transform=i===cur?'scale(1.2)':'scale(1)';
          b.style.boxShadow=i===cur?'0 4px 16px rgba(42,122,90,.22)':'none';
          b.style.borderColor=i===cur?'#2A7A5A':'#D4E8DC';
        }
        cur=(cur+1)%5;
      },650);
      return id;
    }
  }, ()=>_showLevel());

  function _showLevel(){
    if(curr>=levels.length){_csDone();return;}
    const lv=levels[curr];
    LAB.render(`<div class="mwrap"><div class="card card--pop" style="border-color:rgba(37,99,235,.2);background:linear-gradient(135deg,#EEF4FF,#fff)">
      <div class="step-head">
        <div class="tag" style="background:#EEF4FF;border-color:rgba(37,99,235,.28);color:#2563EB">👁 Eyes · 3 of 5</div>
        <h2 class="h2" style="margin-top:.75rem;margin-bottom:.4rem">Contrast Sensitivity</h2>
        <p class="pg">Can you see the letter below? Each round it gets harder to see.</p>
      </div>
      <div style="width:100%;height:165px;background:${lv.bg};border:2px solid var(--b);
                  border-radius:var(--rs);display:flex;align-items:center;justify-content:center;
                  margin:1rem 0;cursor:pointer;transition:background .4s;
                  -webkit-tap-highlight-color:transparent"
           onclick="_csSeen()" role="button" tabindex="0"
           onkeydown="if(event.key==='Enter'||event.key===' ')_csSeen()"
           aria-label="Contrast letter — tap if you can see it">
        <span style="font-size:5.5rem;font-weight:700;font-family:'JetBrains Mono',monospace;
                     color:${lv.fg};transition:color .4s;user-select:none">${lv.letter}</span>
      </div>
      <div style="display:flex;justify-content:center;gap:.4rem;margin-bottom:.8rem">
        ${Array.from({length:6},(_,i)=>`<div style="width:26px;height:5px;border-radius:3px;
          background:${i<curr?'var(--ok)':i===curr?'var(--g)':'var(--b)'}"></div>`).join('')}
      </div>
      <p style="text-align:center;font-size:.7rem;color:var(--tq);font-family:'JetBrains Mono',monospace;margin-bottom:1rem">
        Level ${curr+1} of ${levels.length} &nbsp;·&nbsp; ${lv.label}
      </p>
      <div style="display:flex;justify-content:center;gap:.6rem;flex-wrap:wrap">
        <button class="btn btn--p btn--lg" onclick="_csSeen()">✓ I Can See the Letter</button>
        <button class="btn btn--g btn--lg" onclick="_csCant()">✗ Too Faint — Stop</button>
      </div>
    </div></div>`);
    LAB.say(`Level ${curr+1} now. Can you still make out the letter?`);
  }

  window._csSeen=function(){lastSeen=curr;LAB.flash('hit');curr++;_showLevel();};
  window._csCant=function(){_csDone();};

  function _csDone(){
    const sc=LAB.clamp(Math.round((lastSeen+1)/levels.length*100),0,100);
    LAB.raw.csLevel=lastSeen+1;LAB.raw.csScore=sc;
    const eyeScores=[LAB.raw.cbScore,LAB.raw.acuityScore,sc].filter(x=>x!=null);
    LAB.scores.eye=eyeScores.length?Math.round(LAB.avg(eyeScores)):sc;
    LAB.celebrate();
    LAB.say(`Eye checks done — well done! You could see ${lastSeen+1} contrast levels, which is ${LAB.scoreLbl(sc)}. Now let's check your breathing — this one is actually relaxing!`);
    setTimeout(()=>{LAB.idx++;LAB.next();},1900);
  }
};
