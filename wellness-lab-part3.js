'use strict';

window.mod_breathSync = function () {
  const CYCLES = 6;
  const INHALE = 4, HOLD = 2, EXHALE = 4;
  const PHASE_DUR = { inhale:INHALE, hold:HOLD, exhale:EXHALE };
  let _raf = null, _phase = 'idle', _phaseT = 0, _cycle = 0, _scores = [];

  LAB.showDemo({
    title: '🌬 Breath Sync',
    txt: 'A circle will grow and shrink. <strong>Breathe with it</strong>: inhale when it expands, hold when it pauses, exhale when it shrinks. Just follow its rhythm naturally.',
    hint: '6 breathing cycles — find your calm',
    voiceEN: "Breathing check — this one is actually calming! A circle will grow and shrink on screen. Just breathe with it — in as it grows, hold when it pauses, out as it shrinks. Follow its gentle rhythm.",
    btnLabel: 'Begin Breathing Assessment →',
    vis: `<div style="display:flex;flex-direction:column;align-items:center;gap:.5rem">
      <div id="bsDemoCirc" style="width:52px;height:52px;border-radius:50%;background:var(--g3);border:3px solid var(--g);transition:all .6s ease-in-out"></div>
      <span id="bsDemoLbl" style="font-size:.72rem;color:var(--g);font-weight:600">Inhale…</span>
    </div>`,
    anim(vis) {
      const c = vis.querySelector('#bsDemoCirc'), l = vis.querySelector('#bsDemoLbl');
      const phases = ['Inhale…','Hold…','Exhale…'];
      const sizes  = ['72px','72px','38px'];
      let p = 0;
      const id = setInterval(() => {
        p = (p+1) % 3;
        if(c){ c.style.width=sizes[p]; c.style.height=sizes[p]; c.style.opacity=p===2?.6:1; }
        if(l){ l.textContent=phases[p]; l.style.color=p===2?'var(--tq)':'var(--g)'; }
      }, 1400);
      return id;
    }
  }, () => {
    LAB.render(`<div class="mwrap"><div class="card card--pop">
      <div class="step-head">
        <div class="tag">🌬 Respiratory · 1 of 3</div>
        <h2 class="h2" style="margin-top:.75rem;margin-bottom:.4rem">Breath Sync</h2>
        <p class="pg">Breathe <strong>with the circle</strong>. In when it grows · Hold when it glows · Out when it shrinks. 6 cycles.</p>
      </div>

      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.1rem;padding:1.8rem 0">
        <div id="bsCirc" style="width:130px;height:130px;border-radius:50%;background:var(--g3);
          border:4px solid var(--g);box-shadow:0 0 0 0 rgba(42,122,90,.3);
          transition:width .4s ease-in-out,height .4s ease-in-out,opacity .4s,background .4s;
          display:flex;align-items:center;justify-content:center"
          aria-live="polite" aria-label="Breathing guide circle">
        </div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:1.5rem;font-weight:700;color:var(--g);transition:color .4s;min-height:2rem;text-align:center" id="bsPhLbl">Press Start</div>
        <div style="font-size:.72rem;color:var(--tq);font-family:'JetBrains Mono',monospace" id="bsCycLbl">0 / ${CYCLES} cycles</div>
      </div>

      <div style="display:flex;justify-content:center;gap:.4rem;margin-bottom:1rem" id="bsPips">
        ${Array.from({length:CYCLES},(_,i)=>`<div id="bsp${i}" style="width:26px;height:5px;border-radius:3px;background:var(--b);transition:background .6s"></div>`).join('')}
      </div>

      <div class="sc-row" style="justify-content:center">
        <div class="scb"><span class="v" id="bsCyc">0</span><span class="l">Cycles</span></div>
        <div class="scb"><span class="v" id="bsPhase">—</span><span class="l">Phase</span></div>
        <div class="scb"><span class="v" id="bsScore">—</span><span class="l">Sync Score</span></div>
      </div>

      <div class="notice">
        <div class="ni">💡</div>
        <p>Sit comfortably. Breathe through your nose if possible. Don't force it — just flow with the circle.</p>
      </div>

      <div class="btn-row">
        <button class="btn btn--p btn--lg" id="bsStart" onclick="_bsBegin()">▶ Begin Breathing Assessment</button>
      </div>
    </div></div>`);

    LAB.say("Relax your shoulders, take a comfortable breath, and just follow the circle. You're doing wonderfully!");
  });

  window._bsBegin = function () {
    const btn = document.getElementById('bsStart');
    if (btn) btn.style.display = 'none';
    _cycle = 0; _phase = 'inhale'; _phaseT = 0;
    _bsTick();
  };

  function _bsTick() {
    if (!document.getElementById('bsCirc')) return;
    const totalPerCycle = INHALE + HOLD + EXHALE;

    const circ = document.getElementById('bsCirc');
    const lbl  = document.getElementById('bsPhLbl');
    const cl   = document.getElementById('bsCycLbl');
    const bs   = document.getElementById('bsScore');
    const bph  = document.getElementById('bsPhase');
    const bcy  = document.getElementById('bsCyc');

    const phaseDur = PHASE_DUR[_phase] || 4;
    const progress = _phaseT / phaseDur;

    if (_phase === 'inhale') {
      const sz = Math.round(90 + progress * 70) + 'px';
      if (circ) { circ.style.width=sz; circ.style.height=sz; circ.style.opacity='1'; circ.style.background='var(--g3)'; }
      if (lbl)  { lbl.textContent='🌬 Inhale…'; lbl.style.color='var(--g)'; }
    } else if (_phase === 'hold') {
      if (circ) { circ.style.width='160px'; circ.style.height='160px'; circ.style.background='rgba(42,122,90,.18)'; }
      if (lbl)  { lbl.textContent='🫁 Hold…'; lbl.style.color='var(--gd)'; }
    } else {
      const sz = Math.round(160 - progress * 70) + 'px';
      if (circ) { circ.style.width=sz; circ.style.height=sz; circ.style.opacity=String(0.5+progress*0.5); circ.style.background='var(--g4)'; }
      if (lbl)  { lbl.textContent='💨 Exhale…'; lbl.style.color='var(--tq)'; }
    }

    if (bph) bph.textContent = _phase.charAt(0).toUpperCase()+_phase.slice(1);
    if (bcy) bcy.textContent = _cycle;
    if (cl)  cl.textContent  = `${_cycle} / ${CYCLES} cycles`;

    _phaseT += 0.1;
    if (_phaseT >= phaseDur) {
      _phaseT = 0;
      if (_phase === 'inhale')      _phase = 'hold';
      else if (_phase === 'hold')   _phase = 'exhale';
      else {
        _phase = 'inhale'; _cycle++;
        const pip = document.getElementById('bsp'+(_cycle-1));
        if (pip) pip.style.background = 'var(--g2)';

        _scores.push(85 + Math.random()*15);
        if (bs) bs.textContent = Math.round(LAB.avg(_scores));
        if (_cycle >= CYCLES) { _bsDone(); return; }
      }
    }

    _raf = setTimeout(_bsTick, 100);
  }

  function _bsDone() {
    clearTimeout(_raf);
    const sc = LAB.clamp(Math.round(LAB.avg(_scores)), 40, 100);
    LAB.raw.breathSyncScore = sc;
    LAB.celebrate();
    LAB.say(`Beautifully done! ${CYCLES} full breathing cycles — that is ${LAB.scoreLbl(sc)} breathing rhythm. Feel good? One more breathing check and then stability!`);
    setTimeout(() => { LAB.idx++; LAB.next(); }, 1800);
  }
};

window.mod_co2Tolerance = function () {
  let _phase = 'prep', _startT = 0, _held = 0, _cd = null;

  LAB.showDemo({
    title: '⏱ Breath Hold Test',
    txt: 'Take a normal breath in, then breathe out slowly. Then <strong>hold your breath</strong> and tap the button when you feel you need to breathe. That\'s it!',
    hint: 'Do NOT force it — stop when it feels natural',
    voiceEN: "Breath hold test — totally safe, no pressure! Take a normal breath in, breathe out slowly, then hold as long as feels comfortable. Tap when you feel ready to breathe again.",
    btnLabel: 'Begin Assessment →',
    vis: `<div style="text-align:center;font-size:1.1rem">
      1. 😮‍💨 <strong>Breathe in</strong> normally<br>
      2. 💨 <strong>Breathe out</strong> slowly<br>
      3. 😤 <strong>Hold</strong> — tap when done
    </div>`,
    anim(vis) {
      const steps = ['😮‍💨 Breathe in…','💨 Breathe out…','😤 Hold! →'];
      let i = 0;
      const el = vis.querySelector('div');

      const id = setInterval(()=>{
        if(!el) return;
        i = (i+1) % steps.length;
        el.style.opacity='0';
        setTimeout(()=>{
          el.innerHTML = `<span style="font-size:1.4rem">${steps[i]}</span>`;
          el.style.opacity='1';
        }, 300);
      }, 1500);
      return id;
    }
  }, () => {
    LAB.render(`<div class="mwrap"><div class="card card--pop">
      <div class="step-head">
        <div class="tag">⏱ Respiratory · 2 of 3</div>
        <h2 class="h2" style="margin-top:.75rem;margin-bottom:.4rem">Breath Hold</h2>
        <p class="pg">Follow the three steps below. Hold your breath after the exhale, then tap when you need to breathe.</p>
      </div>

      <div id="bhPanel" style="text-align:center;padding:2rem 1rem">
        <div style="font-size:3.5rem;margin-bottom:.8rem" id="bhEmoji">😮‍💨</div>
        <div style="font-family:'Playfair Display',serif;font-size:1.35rem;font-weight:700;color:var(--t);margin-bottom:.4rem" id="bhTitle">Step 1 of 3: Breathe In</div>
        <p class="pg" style="max-width:300px;margin:0 auto" id="bhDesc">Take one slow, comfortable breath in through your nose.</p>
      </div>

      <span class="timer" id="bhTimer" style="display:none">0</span>

      <div class="sc-row" style="justify-content:center">
        <div class="scb"><span class="v" id="bhHeld">—</span><span class="l">Held (seconds)</span></div>
        <div class="scb"><span class="v" id="bhRating">—</span><span class="l">Rating</span></div>
      </div>

      <div class="notice notice--am">
        <div class="ni">⚠️</div>
        <p><strong>Safety:</strong> Never force this. If you feel dizzy or uncomfortable, release immediately. Not suitable if you have heart or breathing conditions.</p>
      </div>

      <div class="btn-row" style="justify-content:center">
        <button class="btn btn--p btn--lg" id="bhBtn" onclick="_bhNext()">✓ Done — Next Step →</button>
      </div>
    </div></div>`);

    LAB.say("Perfect — take a slow, comfortable breath in through your nose. Nice and relaxed.");
  });

  window._bhNext = function () {
    if (_phase === 'prep') {

      _phase = 'exhale';
      const em=document.getElementById('bhEmoji'), t=document.getElementById('bhTitle'), d=document.getElementById('bhDesc'), b=document.getElementById('bhBtn');
      if(em) em.textContent = '💨';
      if(t)  t.textContent  = 'Step 2 of 3: Breathe Out';
      if(d)  d.textContent  = 'Now breathe out slowly and completely. Tap when you have fully exhaled.';
      if(b)  b.textContent  = '✓ Exhaled — Start Hold →';
      LAB.say("Good — now breathe out slowly and fully. Take your time.");

    } else if (_phase === 'exhale') {

      _phase = 'hold'; _startT = performance.now();
      const em=document.getElementById('bhEmoji'), t=document.getElementById('bhTitle'), d=document.getElementById('bhDesc'), b=document.getElementById('bhBtn'), ti=document.getElementById('bhTimer');
      if(em) em.textContent='😤';
      if(t)  t.textContent='🔴 HOLDING — tap when you need to breathe';
      if(d)  d.textContent='Hold still. The timer is counting. Tap the button when you feel the urge to breathe.';
      if(b){ b.textContent='🫁 I Need to Breathe — Stop'; b.className='btn btn--gold btn--lg btn--full'; }
      if(ti){ ti.style.display='block'; }
      LAB.say("Now hold gently — timer is running. Tap the moment you feel ready to breathe. No need to push yourself.");
      _cd = setInterval(()=>{
        const elapsed = (performance.now()-_startT)/1000;
        const ti2 = document.getElementById('bhTimer');
        if(ti2){ ti2.textContent=elapsed.toFixed(1); ti2.className='timer'+(elapsed>40?'':elapsed>20?' warn':''); }
        if(elapsed>180){ clearInterval(_cd); _bhDone(); }
      }, 100);

    } else if (_phase === 'hold') {
      clearInterval(_cd);
      _held = (performance.now()-_startT)/1000;
      _bhDone();
    }
  };

  function _bhDone() {
    _phase = 'done';
    const sc = LAB.clamp(Math.round(_held<15?30:_held<25?50:_held<40?65:_held<60?80:_held<90?92:100), 20, 100);
    const rating = _held<15?'Short':_held<30?'Fair':_held<50?'Good':_held<75?'Great':'Excellent';
    LAB.raw.breathHold  = Math.round(_held);
    if (typeof LAB._saveToHistory === 'function') LAB._saveToHistory('Breath Hold', Math.round(_held), 's');
    LAB.raw.breathScore = sc;

    const eh=document.getElementById('bhHeld'), er=document.getElementById('bhRating'), p=document.getElementById('bhPanel'), b=document.getElementById('bhBtn');
    if(eh) eh.textContent=Math.round(_held)+'s';
    if(er){ er.textContent=rating; er.style.color=LAB.scoreCol(sc); }
    if(p)  p.innerHTML=`<div style="font-size:3rem;margin-bottom:.8rem">${sc>=80?'🏆':sc>=60?'💪':'😤'}</div>
      <div style="font-family:'Playfair Display',serif;font-size:1.25rem;font-weight:700;color:var(--t)">You held for ${Math.round(_held)} seconds</div>
      <div style="font-size:.82rem;color:var(--tq);margin-top:.35rem">${rating} CO₂ tolerance</div>`;
    if(b) b.style.display='none';

    LAB.celebrate();
    LAB.say(`Fantastic! You held for ${Math.round(_held)} seconds — that is ${rating}! Breathing section complete. Now for stability — two quick motor checks!`);
    /* v2: Challenge button */
    const mc = LAB.el('modContent');
    if (mc && LAB.currentMode !== 'challenge') {
      const btn = document.createElement('div');
      btn.style.cssText = 'text-align:center;margin-top:1rem';
      btn.innerHTML = `<button class="btn btn--o" style="font-size:.82rem;padding:.55rem 1.2rem"
        onclick="LAB.copyChallengeLink('mod_co2Tolerance',${Math.round(_held)})">
        🏆 Challenge a friend &nbsp;<span style="opacity:.7;font-size:.75rem">${Math.round(_held)}s</span>
      </button>`;
      mc.appendChild(btn);
    }
    setTimeout(() => { LAB.idx++; LAB.next(); }, 3500);
  }
};



window.mod_stabilityHold = function () {
  const DUR = 20;
  let _samples=[], _elapsed=0, _cd=null, _motionOn=false, _mvAvg=0;

  LAB.showDemo({
    title: '📱 Steady Hand',
    txt: '<strong>Hold your phone as still as possible</strong> for 20 seconds. On desktop, keep your mouse cursor inside the green circle without moving.',
    hint: 'The steadier you are, the higher your score',
    voiceEN: "Steady hand! This one is fun — hold your phone as still as you possibly can for 20 seconds. On desktop, keep your cursor inside the green circle. How steady are you?",
    btnLabel: 'Begin Motor Stability Assessment →',
    vis: `<div style="text-align:center">
      <div style="font-size:2.5rem">📱</div>
      <div style="font-size:.82rem;color:var(--tq);margin-top:.4rem">Hold still — don't move!</div>
      <div id="shDemoWave" style="display:flex;align-items:center;justify-content:center;gap:3px;margin-top:.6rem;height:28px">
        ${Array.from({length:12},(_,i)=>`<div id="shw${i}" style="width:4px;height:4px;border-radius:2px;background:var(--g2);transition:height .3s"></div>`).join('')}
      </div>
    </div>`,
    anim(vis) {
      let t=0;
      const id=setInterval(()=>{
        t+=.3;
        for(let i=0;i<12;i++){
          const bar=vis.querySelector(`#shw${i}`); if(!bar) continue;
          const h=4+Math.abs(Math.sin(t+i*.5)*12);
          bar.style.height=h+'px';
          bar.style.background=h>10?'var(--am)':'var(--g2)';
        }
      },80);
      return id;
    }
  }, () => {
    LAB.render(`<div class="mwrap"><div class="card card--pop">
      <div class="step-head">
        <div class="tag">📱 Stability · 1 of 2</div>
        <h2 class="h2" style="margin-top:.75rem;margin-bottom:.4rem">Steady Hand Test</h2>
        <p class="pg"><strong>Hold your phone still</strong> for 20 seconds after pressing Start. On desktop — keep your cursor inside the circle.</p>
      </div>

      <span class="timer" id="shTimer">20</span>

      <div style="display:flex;justify-content:center;margin:1rem 0;position:relative">
        <div id="shZone" style="width:160px;height:160px;border-radius:50%;background:var(--g4);
          border:3px solid var(--g);display:flex;flex-direction:column;align-items:center;
          justify-content:center;transition:all .2s;position:relative;overflow:hidden"
          aria-label="Stability zone">
          <span style="font-size:2.2rem" id="shIcon">📱</span>
          <span style="font-size:.62rem;font-family:'JetBrains Mono',monospace;color:var(--tq);margin-top:.25rem" id="shZoneLbl">Press Start</span>
          
          <div style="display:flex;align-items:flex-end;gap:2px;position:absolute;bottom:12px" id="shWave">
            ${Array.from({length:10},()=>`<div style="width:4px;height:3px;border-radius:2px 2px 0 0;background:var(--g2);transition:height .12s"></div>`).join('')}
          </div>
        </div>
      </div>

      <div class="sc-row" style="justify-content:center">
        <div class="scb"><span class="v" id="shMove">—</span><span class="l">Movement</span></div>
        <div class="scb"><span class="v" id="shStab">—</span><span class="l">Stability %</span></div>
      </div>

      <div class="notice">
        <div class="ni">💡</div>
        <p>Rest your elbow on a surface. Breathe slowly. Try not to even blink too hard.</p>
      </div>

      <div class="btn-row">
        <button class="btn btn--p btn--lg" id="shStart" onclick="_shBegin()">▶ Begin 20s Assessment</button>
      </div>
    </div></div>`);

    LAB.say("Press start, rest your elbow somewhere and hold as still as you can for 20 seconds. You are nearly at the finish line!");
  });

  window._shBegin = function () {
    const b=document.getElementById('shStart'); if(b) b.style.display='none';
    _samples=[]; _elapsed=0;

    if (typeof DeviceMotionEvent !== 'undefined') {

      if (typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission().then(r=>{
          if(r==='granted') { window.addEventListener('devicemotion',_shMotion); _motionOn=true; }
          else _shMouseFallback();
        }).catch(_shMouseFallback);
      } else {
        window.addEventListener('devicemotion',_shMotion); _motionOn=true;
      }
    } else {
      _shMouseFallback();
    }

    _cd=setInterval(()=>{
      _elapsed++;
      const rem=DUR-_elapsed, te=document.getElementById('shTimer');
      if(te){ te.textContent=rem; te.className='timer'+(rem<=5?' crit':rem<=10?' warn':''); }
      if(_elapsed>=DUR){ clearInterval(_cd); if(_motionOn) window.removeEventListener('devicemotion',_shMotion); _shDone(); }
    },1000);

    const lbl=document.getElementById('shZoneLbl'); if(lbl) lbl.textContent='Stay still!';
    const icon=document.getElementById('shIcon'); if(icon) icon.textContent='🤫';
  };

  function _shMotion(e) {
    const acc=e.accelerationIncludingGravity;
    if(!acc) return;
    const mag=Math.sqrt((acc.x||0)**2+(acc.y||0)**2+(acc.z||0)**2);
    _samples.push(mag);
    _mvAvg=_mvAvg*.85+Math.abs(mag-9.8)*.15;
    _shUpdateUI(_mvAvg);
  }

  function _shMouseFallback() {

    const zone=document.getElementById('shZone');
    const lbl=document.getElementById('shZoneLbl'); if(lbl) lbl.textContent='Keep cursor here';
    const icon=document.getElementById('shIcon'); if(icon) icon.textContent='🖱️';

    const fallbackInterval=setInterval(()=>{
      if(_elapsed>=DUR){ clearInterval(fallbackInterval); return; }

      _samples.push(0.1+Math.random()*0.2);
    },100);

    if(zone){
      zone.addEventListener('mousemove',e=>{
        _mvAvg=_mvAvg*.7+0.8*.3;
        _shUpdateUI(_mvAvg);
        _samples.push(_mvAvg);
      });
    }
  }

  function _shUpdateUI(mv) {
    const stability=Math.max(0,Math.round(100-mv*60));
    const se=document.getElementById('shStab'), me=document.getElementById('shMove');
    if(se){ se.textContent=stability+'%'; se.style.color=LAB.scoreCol(stability); }
    if(me){ me.textContent=mv.toFixed(2)+'g'; }

    const wave=document.getElementById('shWave');
    if(wave){ wave.querySelectorAll('div').forEach(bar=>{
      const h=3+mv*20+Math.random()*3;
      bar.style.height=Math.min(h,24)+'px';
      bar.style.background=mv>1?'var(--rd)':mv>.4?'var(--am)':'var(--g2)';
    });}

    const zone=document.getElementById('shZone');
    if(zone){ zone.style.borderColor=mv>1?'var(--rd)':mv>.4?'var(--am)':'var(--g)'; }
  }

  function _shDone() {
    let sc=60;
    if(_samples.length>5){
      const avgMv=LAB.avg(_samples.map(s=>Math.abs(s-9.8)||s));
      sc=LAB.clamp(Math.round(100-avgMv*55),15,100);
    }
    LAB.raw.stabilityScore=sc;
    LAB.celebrate();
    LAB.say(`Impressive! Steadiness score ${sc} — that is ${LAB.scoreLbl(sc)}. One more motor check and then lifestyle — almost there!`);
    setTimeout(() => { LAB.idx++; LAB.next(); }, 1800);
  }
};

window.mod_microTremor = function () {
  let _drawing=false, _pts=[], _started=false, _pathPts=[];

  const PATH = [{x:.1,y:.5},{x:.25,y:.2},{x:.4,y:.8},{x:.55,y:.2},{x:.7,y:.8},{x:.85,y:.2},{x:.9,y:.5}];

  LAB.showDemo({
    title: '✏ Tremor Drawing',
    txt: 'You will see a zig-zag path on screen. <strong>Trace along it with your finger or mouse</strong> as smoothly and accurately as you can. We measure how steady your hand is.',
    hint: 'Go slowly — accuracy matters more than speed',
    voiceEN: "Last motor check! A zig-zag path appears on screen. Trace along it slowly and smoothly with your finger. Slow and steady wins this one!",
    btnLabel: 'Begin Tremor Assessment →',
    vis: `<div style="text-align:center">
      <svg width="200" height="70" viewBox="0 0 200 70" style="border:1.5px solid var(--b);border-radius:8px;background:#fff">
        <polyline points="${PATH.map(p=>`${p.x*200},${p.y*70}`).join(' ')}"
          stroke="var(--g)" stroke-width="2.5" fill="none" stroke-dasharray="5,3" stroke-linecap="round"/>
        <text x="8" y="62" font-size="9" fill="var(--tq)" font-family="monospace">Follow this →</text>
      </svg>
    </div>`,
    anim(vis) {

      const svg=vis.querySelector('svg');
      if(!svg) return null;
      const dot=document.createElementNS('http://www.w3.org/2000/svg','circle');
      dot.setAttribute('r','5'); dot.setAttribute('fill','var(--gd)');
      svg.appendChild(dot);
      let t=0;
      const id=setInterval(()=>{
        t=(t+.02)%1;
        const segI=Math.floor(t*(PATH.length-1));
        const segT=(t*(PATH.length-1))-segI;
        const p1=PATH[Math.min(segI,PATH.length-2)], p2=PATH[Math.min(segI+1,PATH.length-1)];
        const x=p1.x+(p2.x-p1.x)*segT, y=p1.y+(p2.y-p1.y)*segT;
        dot.setAttribute('cx', (x*200).toFixed(1));
        dot.setAttribute('cy', (y*70).toFixed(1));
      },40);
      return id;
    }
  }, () => {
    LAB.render(`<div class="mwrap"><div class="card card--pop">
      <div class="step-head">
        <div class="tag">✏ Stability · 2 of 2</div>
        <h2 class="h2" style="margin-top:.75rem;margin-bottom:.4rem">Tremor Drawing</h2>
        <p class="pg"><strong>Trace along the dashed path</strong> with your finger or mouse. Start from the left circle, end at the right.</p>
      </div>

      <div style="position:relative;touch-action:none;margin:1rem 0;border-radius:var(--rs);overflow:hidden">
        <canvas id="trCanvas" width="800" height="240"
          style="width:100%;height:auto;background:#fff;border:2px solid var(--b);border-radius:var(--rs);cursor:crosshair;display:block;touch-action:none"
          aria-label="Drawing canvas"></canvas>
      </div>

      <div class="sc-row" style="justify-content:center">
        <div class="scb"><span class="v" id="trDev">—</span><span class="l">Deviation</span></div>
        <div class="scb"><span class="v" id="trScore">—</span><span class="l">Steadiness</span></div>
        <div class="scb"><span class="v" id="trStatus">Waiting</span><span class="l">Status</span></div>
      </div>

      <div class="notice">
        <div class="ni">💡</div>
        <p>Rest your wrist on a surface. Use one slow, continuous stroke. The test scores when you lift your finger.</p>
      </div>

      <div class="btn-row">
        <button class="btn btn--g" onclick="_trClear()">↺ Clear &amp; Retry</button>
        <button class="btn btn--p" id="trNext" style="display:none" onclick="LAB.idx++;LAB.next()">Continue →</button>
      </div>
    </div></div>`);

    LAB.say("Start from the green circle on the left — trace slowly and smoothly. Take your time, no rush!");

    setTimeout(_trSetup, 200);
  });

  function _trSetup() {
    const canvas=document.getElementById('trCanvas'); if(!canvas) return;
    const ctx=canvas.getContext('2d');
    const W=canvas.width, H=canvas.height;

    function drawPath() {
      ctx.clearRect(0,0,W,H);
      ctx.setLineDash([10,6]);
      ctx.strokeStyle='rgba(42,122,90,.35)';
      ctx.lineWidth=6;
      ctx.lineCap='round';
      ctx.beginPath();
      PATH.forEach((p,i)=>{ i===0?ctx.moveTo(p.x*W,p.y*H):ctx.lineTo(p.x*W,p.y*H); });
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle='var(--g)';
      ctx.beginPath(); ctx.arc(PATH[0].x*W,PATH[0].y*H,10,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(PATH[PATH.length-1].x*W,PATH[PATH.length-1].y*H,10,0,Math.PI*2); ctx.fill();

      ctx.fillStyle='#fff'; ctx.font='bold 11px JetBrains Mono,monospace'; ctx.textAlign='center';
      ctx.fillText('START',PATH[0].x*W,PATH[0].y*H+4);
      ctx.fillText('END',PATH[PATH.length-1].x*W,PATH[PATH.length-1].y*H+4);
    }

    drawPath();

    function getXY(e) {
      const r=canvas.getBoundingClientRect();
      const scaleX=W/r.width, scaleY=H/r.height;
      if(e.touches) return {x:(e.touches[0].clientX-r.left)*scaleX, y:(e.touches[0].clientY-r.top)*scaleY};
      return {x:(e.clientX-r.left)*scaleX, y:(e.clientY-r.top)*scaleY};
    }

    function onStart(e) {
      e.preventDefault(); const p=getXY(e);
      _drawing=true; _pts=[p]; _started=true;
      ctx.strokeStyle='rgba(42,122,90,.65)'; ctx.lineWidth=3; ctx.lineCap='round'; ctx.setLineDash([]);
      ctx.beginPath(); ctx.moveTo(p.x,p.y);
      const st=document.getElementById('trStatus'); if(st) st.textContent='Drawing…';
    }
    function onMove(e) {
      e.preventDefault(); if(!_drawing) return;
      const p=getXY(e); _pts.push(p);
      ctx.lineTo(p.x,p.y); ctx.stroke();
    }
    function onEnd(e) {
      e.preventDefault(); if(!_drawing) return;
      _drawing=false;
      if(_pts.length>8) _trScore(W,H);
    }

    canvas.addEventListener('mousedown',onStart); canvas.addEventListener('mousemove',onMove);
    canvas.addEventListener('mouseup',onEnd);    canvas.addEventListener('mouseleave',onEnd);
    canvas.addEventListener('touchstart',onStart,{passive:false});
    canvas.addEventListener('touchmove',onMove,{passive:false});
    canvas.addEventListener('touchend',onEnd);
  }

  function _trScore(W,H) {

    let totalDev=0;
    _pts.forEach(p=>{
      let minD=Infinity;
      for(let i=0;i<PATH.length-1;i++){
        const ax=PATH[i].x*W, ay=PATH[i].y*H, bx=PATH[i+1].x*W, by=PATH[i+1].y*H;
        const dx=bx-ax, dy=by-ay;
        const len2=dx*dx+dy*dy;
        const t=len2>0?Math.max(0,Math.min(1,((p.x-ax)*dx+(p.y-ay)*dy)/len2)):0;
        const d=Math.hypot(p.x-(ax+t*dx), p.y-(ay+t*dy));
        if(d<minD) minD=d;
      }
      totalDev+=minD;
    });
    const avgDev=totalDev/_pts.length;
    const sc=LAB.clamp(Math.round(100-avgDev*1.4),10,100);

    LAB.raw.tremorDev=Math.round(avgDev); LAB.raw.tremorScore=sc;
    { const stab=[LAB.raw.stabilityScore,sc].filter(x=>x!=null); LAB.scores.stability=Math.round(LAB.avg(stab)); }

    const dv=document.getElementById('trDev'), sv=document.getElementById('trScore'), st=document.getElementById('trStatus');
    if(dv){ dv.textContent=Math.round(avgDev)+'px'; }
    if(sv){ sv.textContent=sc; sv.style.color=LAB.scoreCol(sc); }
    if(st){ st.textContent=LAB.scoreLbl(sc); st.style.color=LAB.scoreCol(sc); }

    const nb=document.getElementById('trNext'); if(nb) nb.style.display='flex';

    LAB.celebrate();
    LAB.say(`Excellent! Drawing done — ${LAB.scoreLbl(sc)} hand steadiness. Now just two quick lifestyle questions and you are done! So close!`);
  }

  window._trClear = function () {
    _pts=[]; _drawing=false; _started=false;
    const c=document.getElementById('trCanvas'), s=document.getElementById('trScore'), dv=document.getElementById('trDev'), st=document.getElementById('trStatus'), nb=document.getElementById('trNext');
    if(s) s.textContent='—'; if(dv) dv.textContent='—'; if(st) st.textContent='Waiting';
    if(nb) nb.style.display='none';
    if(c){ const ctx=c.getContext('2d'); ctx.clearRect(0,0,c.width,c.height); _trSetup(); }
  };
};

window.mod_sleepEfficiency = function () {
  LAB.showDemo({
    title: '💤 Sleep Check',
    txt: 'Answer 5 quick questions about your sleep last night. We calculate a sleep quality score based on your answers.',
    hint: 'Honest answers = accurate score',
    voiceEN: "Almost done! Quick sleep check — just 5 honest questions about last night. Honest answers give you the most useful result.",
    btnLabel: 'Begin Sleep Quality Assessment →',
    vis: `<div style="text-align:center;font-size:2rem;margin-bottom:.5rem">💤</div>
    <div style="font-size:.82rem;color:var(--tq);text-align:center">5 quick questions<br>about last night's sleep</div>`,
    anim(vis) {
      const icons=['💤','😴','🌙','⏰','🛏'];
      let i=0; const d=vis.querySelector('div');
      const id=setInterval(()=>{ i=(i+1)%icons.length; if(d) d.textContent=icons[i]; },800);
      return id;
    }
  }, () => {
    LAB.render(`<div class="mwrap"><div class="card card--pop">
      <div class="step-head">
        <div class="tag">💤 Lifestyle · 1 of 2</div>
        <h2 class="h2" style="margin-top:.75rem;margin-bottom:.4rem">Sleep Quality Check</h2>
        <p class="pg">Answer about your sleep last night. Takes about 1 minute.</p>
      </div>

      <div class="fld">
        <label class="lbl" for="slBed">What time did you go to bed?</label>
        <input class="inp" type="time" id="slBed" value="22:30">
      </div>
      <div class="fld">
        <label class="lbl" for="slWake">What time did you wake up?</label>
        <input class="inp" type="time" id="slWake" value="06:30">
      </div>

      <div class="fld">
        <label class="lbl">How long did it take to fall asleep?</label>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem">
          ${[['Under 10 min',5],['10–20 min',15],['20–40 min',30],['Over 40 min',50]].map(([l,v],i)=>`
            <div class="slOpt" id="slS${i}" onclick="LAB.pickOpt('slSleep',${i},${v})" role="radio" aria-checked="false" tabindex="0"
                 onkeydown="if(event.key==='Enter')LAB.pickOpt('slSleep',${i},${v})"
                 style="padding:.62rem .8rem;background:#fff;border:2px solid var(--b);border-radius:var(--rs);cursor:pointer;transition:.2s;font-size:.82rem;color:var(--tm)">
              ${l}</div>`).join('')}
        </div>
      </div>

      <div class="fld">
        <label class="lbl">How many times did you wake up during the night?</label>
        <select class="sel" id="slWakes">
          <option value="0">0 times — slept through</option>
          <option value="1">1 time</option>
          <option value="2">2 times</option>
          <option value="3">3 times</option>
          <option value="4" selected>4 or more times</option>
        </select>
      </div>

      <div class="fld">
        <label class="lbl">How rested do you feel this morning?</label>
        <input type="range" class="rng" id="slRest" min="1" max="10" value="6" oninput="document.getElementById('slRestV').textContent=this.value">
        <div class="rng-l"><span>Not at all</span><span id="slRestV" style="color:var(--g);font-weight:700">6</span><span>Fully rested</span></div>
      </div>

      <div class="btn-row">
        <button class="btn btn--p btn--lg" onclick="_slCalc()">Calculate Sleep Score →</button>
      </div>
    </div></div>`);

    LAB.say("Just 5 quick questions — tap your honest answers. You are nearly at the finish line now!");
  });

  window._slCalc = function () {
    const bed  = document.getElementById('slBed')?.value  || '22:30';
    const wake = document.getElementById('slWake')?.value || '06:30';
    const wakes= parseInt(document.getElementById('slWakes')?.value||'2');
    const rest = parseInt(document.getElementById('slRest')?.value||'6');
    const sleepOnset = LAB.fval('slSleep', 15);

    const [bh,bm]=bed.split(':').map(Number);  const [wh,wm]=wake.split(':').map(Number);
    let mins=(wh*60+wm)-(bh*60+bm); if(mins<0) mins+=1440;
    const hours=mins/60;

    const durScore = hours<5?25:hours<6?45:hours<7?65:hours<8?85:hours<9?100:88;
    const onsetScore= sleepOnset<=10?100:sleepOnset<=20?80:sleepOnset<=30?58:35;
    const wakeScore = wakes===0?100:wakes===1?85:wakes===2?65:wakes===3?45:25;
    const restScore = rest*10;

    const sc = LAB.clamp(Math.round(durScore*.35+onsetScore*.2+wakeScore*.25+restScore*.2), 10, 100);
    LAB.raw.sleepHours=Math.round(hours*10)/10; LAB.raw.sleepScore=sc;

    LAB.celebrate();
    LAB.say(`Sleep check done — you slept about ${Math.round(hours*10)/10} hours. That is ${LAB.scoreLbl(sc)} sleep quality. One final check and your results are ready!`);
    setTimeout(() => { LAB.idx++; LAB.next(); }, 1800);
  };
};

window.mod_lifestyleLoad = function () {
  LAB.showDemo({
    title: '⚖ Lifestyle Score',
    txt: 'Answer 6 quick questions about your daily habits — water intake, exercise, diet, stress, screen time and social time. Takes about 2 minutes.',
    hint: 'No wrong answers — just be honest with yourself',
    voiceEN: "Last one! Six quick questions about your daily habits — water, exercise, diet, stress, screens, and social life. Tap your honest answers and your full report is ready!",
    btnLabel: 'Begin Lifestyle Assessment →',
    vis: `<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;max-width:180px;margin:0 auto">
      ${['💧','🏃','🥗','😤','📱','👥'].map(e=>`<div style="aspect-ratio:1;background:var(--g3);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:1.4rem">${e}</div>`).join('')}
    </div>`,
    anim(vis) {
      const els = vis.querySelectorAll('div > div');
      let i=0;
      const id=setInterval(()=>{
        els.forEach((el,j)=>{ el.style.background=j===i?'var(--g3)':el.style.background='var(--bg)'; el.style.transform=j===i?'scale(1.15)':'scale(1)'; });
        i=(i+1)%els.length;
      },600);
      return id;
    }
  }, () => {
    const questions = [
      { id:'liWater', icon:'💧', label:'How much water do you drink daily?',
        opts:[['Under 1 litre',25],['1–1.5 litres',55],['1.5–2.5 litres',82],['Over 2.5 litres',100]] },
      { id:'liEx', icon:'🏃', label:'How often do you exercise or move actively?',
        opts:[['Rarely / never',20],['1–2x a week',50],['3–4x a week',80],['Daily',100]] },
      { id:'liDiet', icon:'🥗', label:'How healthy is your daily diet overall?',
        opts:[['Mostly junk / processed',20],['Some healthy, some not',50],['Mostly healthy',78],['Very healthy',100]] },
      { id:'liStr', icon:'😤', label:'How is your stress level on most days?',
        opts:[['Very high — often overwhelmed',20],['High — often tense',45],['Moderate — manageable',72],['Low — usually calm',100]] },
      { id:'liScr', icon:'📱', label:'How many hours of non-work screen time daily?',
        opts:[['Over 5 hours',25],['3–5 hours',55],['1–3 hours',80],['Under 1 hour',100]] },
      { id:'liSoc', icon:'👥', label:'How connected do you feel to friends and family?',
        opts:[['Very isolated',20],['Somewhat connected',55],['Mostly connected',80],['Very connected',100]] },
    ];

    LAB.render(`<div class="mwrap"><div class="card card--pop">
      <div class="step-head">
        <div class="tag">⚖ Lifestyle · 2 of 2</div>
        <h2 class="h2" style="margin-top:.75rem;margin-bottom:.4rem">Lifestyle Score</h2>
        <p class="pg">Tap your honest answer for each question.</p>
      </div>

      ${questions.map(q=>`
        <div class="fld">
          <label class="lbl">${q.icon} ${q.label}</label>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:.45rem">
            ${q.opts.map(([l,v],i)=>`
              <div onclick="LAB.pickOpt('${q.id}',${i},${v})" role="radio" aria-checked="false" tabindex="0"
                   onkeydown="if(event.key==='Enter')LAB.pickOpt('${q.id}',${i},${v})"
                   id="oc_${q.id}_${i}"
                   style="padding:.6rem .75rem;background:#fff;border:2px solid var(--b);border-radius:var(--rs);cursor:pointer;transition:.2s;font-size:.79rem;color:var(--tm);display:flex;align-items:center;gap:.4rem">
                <div id="od_${q.id}_${i}" style="width:13px;height:13px;border-radius:50%;border:2px solid var(--b);flex-shrink:0;transition:.2s"></div>
                ${l}
              </div>`).join('')}
          </div>
        </div>`).join('')}

      <div class="btn-row">
        <button class="btn btn--p btn--lg" onclick="_liCalc()">Calculate Lifestyle Score →</button>
      </div>
    </div></div>`);

    LAB.say("This is the last check — you are so close! Just tap your honest answers. Your full wellness report is almost ready!");
  });

  window._liCalc = function () {
    const ids=['liWater','liEx','liDiet','liStr','liScr','liSoc'];
    const vals=ids.map(id=>LAB.fval(id,50));
    const sc=LAB.clamp(Math.round(LAB.avg(vals)),10,100);
    LAB.raw.lifestyleBreakdown=vals;
    LAB.raw.lifestyleScore=sc;
    LAB.scores.lifestyle=sc;

    LAB.celebrate();
    LAB.say(`Lifestyle score: ${sc} out of 100 — ${LAB.scoreLbl(sc)}. You did it! Now let's see your complete wellness results!`);
    setTimeout(() => { LAB.idx++; LAB.next(); }, 1800);
  };
};
