'use strict';
/* New validated brain tests: Digit Span (working memory) and Trail Making (attention / processing speed) */
(function(){
const CARD=(tag,title,msg,body)=>`<div class="mwrap"><div class="card card--pop"><div class="step-head"><div class="tag">${tag}</div><h2 class="h2" style="margin-top:.75rem;margin-bottom:.4rem">${title}</h2><p class="pg" id="nwMsg">${msg}</p></div>${body}</div></div>`;
const finish=()=>setTimeout(()=>{LAB.idx++;LAB.next();},2800);
const $=id=>document.getElementById(id);

window.mod_digitSpan=function(){
  const st={len:3,fails:0,best:0,seq:[],inp:[],busy:true,t:[]};
  LAB.showDemo({title:'🔢 Digit Span',txt:'Watch the numbers appear <strong>one by one</strong>, then tap them back in the <strong>same order</strong>.',hint:'Gets one digit longer each round · about 1 minute',btnLabel:'Start Digit Span →',
    vis:'<div style="font-size:2.2rem;font-weight:800;text-align:center;letter-spacing:.5rem;color:var(--g)">4 · 7 · 2</div>'},start);
  function start(){
    const pad=[1,2,3,4,5,6,7,8,9,0].map(n=>`<button class="btn btn--o" style="font-size:1.4rem;padding:.7rem 0;${n===0?'grid-column:2':''}" onclick="_dsTap(${n})">${n}</button>`).join('');
    LAB.render(CARD('🔢 Brain · 4 of 5','Digit Span','Watch carefully…',
      `<div id="dsDisp" style="font-size:3.4rem;font-weight:800;text-align:center;height:4.6rem;color:var(--g)"></div>
       <div id="dsIn" style="text-align:center;font-size:1.5rem;min-height:2rem;letter-spacing:.35rem"></div>
       <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:.5rem;max-width:270px;margin:.6rem auto">${pad}</div>
       <div class="sc-row"><div class="scb"><span class="v" id="dsLen">3</span><span class="l">Digits</span></div><div class="scb"><span class="v" id="dsBest">0</span><span class="l">Best</span></div></div>`));
    setTimeout(round,900);
  }
  function round(){
    st.seq=[];for(let i=0;i<st.len;i++){let d;do{d=Math.floor(Math.random()*10);}while(i&&d===st.seq[i-1]);st.seq.push(d);}
    st.inp=[];st.busy=true;$('dsIn')&&($('dsIn').textContent='');$('dsLen')&&($('dsLen').textContent=st.len);
    $('nwMsg')&&($('nwMsg').textContent='Watch carefully…');
    st.seq.forEach((d,i)=>{
      st.t.push(setTimeout(()=>{const e=$('dsDisp');if(e)e.textContent=d;},i*1000));
      st.t.push(setTimeout(()=>{const e=$('dsDisp');if(e)e.textContent='';},i*1000+700));
    });
    st.t.push(setTimeout(()=>{st.busy=false;$('nwMsg')&&($('nwMsg').textContent='Now tap the numbers in the same order');},st.len*1000+100));
  }
  window._dsTap=function(n){
    if(st.busy)return;
    st.inp.push(n);const e=$('dsIn');if(e)e.textContent='● '.repeat(st.inp.length).trim();
    const k=st.inp.length-1;
    if(n!==st.seq[k]){st.busy=true;st.fails++;LAB.flash('miss');
      $('nwMsg')&&($('nwMsg').textContent=st.fails>=2?'That is your limit — well done!':'Not quite — try again');
      return st.fails>=2?setTimeout(done,1200):setTimeout(round,1300);}
    if(st.inp.length===st.len){st.busy=true;st.best=st.len;st.fails=0;st.len++;LAB.flash('hit');
      $('dsBest')&&($('dsBest').textContent=st.best);$('nwMsg')&&($('nwMsg').textContent='Correct! One more digit…');
      return st.len>9?setTimeout(done,900):setTimeout(round,1100);}
  };
  function done(){
    st.t.forEach(clearTimeout);
    const span=st.best,sc=LAB.clamp(Math.round(35+(span-2)*13),20,100);
    LAB.raw.dsSpan=span;LAB.raw.dsScore=sc;
    if(typeof LAB._saveToHistory==='function')LAB._saveToHistory('Digit Span',span,'digits');
    LAB.celebrate();LAB.say(`You remembered ${span} digits in a row — that is ${LAB.scoreLbl(sc)}!`);
    $('nwMsg')&&($('nwMsg').innerHTML=`You remembered <strong>${span} digits</strong> in a row 🎉`);
    finish();
  }
};

window.mod_trailMaking=function(){
  const N=12,st={next:1,err:0,t0:0};
  LAB.showDemo({title:'🔗 Trail Making',txt:'Tap the numbers <strong>in order, 1 → 2 → 3 …</strong> as fast as you can.',hint:'12 numbers · about 30 seconds',btnLabel:'Start Trail Making →',
    vis:'<div style="font-size:1.6rem;font-weight:800;text-align:center;color:var(--g)">① → ② → ③ → ④</div>'},start);
  function start(){
    const cells=[...Array(16).keys()].sort(()=>Math.random()-.5).slice(0,N);
    const dots=cells.map((c,i)=>{const x=(c%4)*25+12.5+(Math.random()*6-3),y=Math.floor(c/4)*25+12.5+(Math.random()*6-3);
      return `<button id="tm${i+1}" onclick="_tmTap(${i+1})" style="position:absolute;left:${x}%;top:${y}%;transform:translate(-50%,-50%);width:48px;height:48px;border-radius:50%;border:2.5px solid #2A7A5A;background:#fff;color:#1B5E20;font-weight:800;font-size:1.05rem;cursor:pointer">${i+1}</button>`;}).join('');
    LAB.render(CARD('🔗 Brain · 5 of 5','Trail Making','Tap 1, then 2, then 3 …',
      `<div id="tmArea" style="position:relative;height:300px;max-width:340px;margin:.4rem auto;background:#F4FAF6;border-radius:16px">${dots}</div>
       <div class="sc-row"><div class="scb"><span class="v" id="tmNext">1</span><span class="l">Next</span></div><div class="scb"><span class="v" id="tmErr">0</span><span class="l">Mistakes</span></div></div>`));
    st.t0=performance.now();
  }
  window._tmTap=function(n){
    if(n!==st.next){st.err++;LAB.flash('miss');$('tmErr')&&($('tmErr').textContent=st.err);return;}
    const b=$('tm'+n);if(b){b.style.background='#38A87A';b.style.color='#fff';b.disabled=true;}
    st.next++;$('tmNext')&&($('tmNext').textContent=st.next>N?'✓':st.next);LAB.flash('hit');
    if(st.next>N)done();
  };
  function done(){
    const t=(performance.now()-st.t0)/1000,sc=LAB.clamp(Math.round(100-(t-8)*3-st.err*3),20,100);
    LAB.raw.tmtTime=Math.round(t*10)/10;LAB.raw.tmtErr=st.err;LAB.raw.tmtScore=sc;
    if(typeof LAB._saveToHistory==='function')LAB._saveToHistory('Trail Making',Math.round(t),'s');
    LAB.celebrate();LAB.say(`Finished in ${Math.round(t)} seconds — that is ${LAB.scoreLbl(sc)}!`);
    $('nwMsg')&&($('nwMsg').innerHTML=`Done in <strong>${t.toFixed(1)}s</strong> with ${st.err} mistake${st.err===1?'':'s'} 🎉`);
    finish();
  }
};
})();
