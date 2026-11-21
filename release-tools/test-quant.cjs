// ∑ GRE 数学词汇 (quant.html + gre-quant.js). Part 1 checks the term bank and every problem
// generator in Node (answers recomputed independently from the question text); part 2 plays the
// page in Chrome via Playwright and checks what it saves. Synthetic data only.
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../src');
require(path.join(root,'gre-quant.js'));
const Q=globalThis.GRE_QUANT;

/* ---------- 1. the bank ---------- */
// chapter sizes as printed in the handbook (33/30/32/30/28/45/33 terms + 16 traps)
assert.deepEqual(Q.CHAPTERS.map(c=>Q.TERMS.filter(t=>t.ch===c.id).length),[33,30,32,30,28,45,33,16]);
assert.equal(Q.CHECK.length,20); assert.equal(Q.SENTENCES.length,5);
assert.ok(Q.TERMS.every(t=>t.en&&t.zh&&(t.ch!==8||t.trap)),'every term has English and Chinese; every trap a note');
for(const c of Q.CHECK) for(const id of c.t) assert.ok(Q.BYID[id],'checklist term '+id);
// same-meaning terms never stand in as wrong choices for each other
assert.ok(Q.clash(Q.BYID['1.at-least'],Q.BYID['1.no-less-than'])&&Q.clash(Q.BYID['1.at-most'],Q.BYID['1.less-than-or-equal-to'])&&Q.clash(Q.BYID['3.base'],Q.BYID['6.base']));
assert.ok(!Q.clash(Q.BYID['1.inclusive'],Q.BYID['1.exclusive'])&&!Q.clash(Q.BYID['7.percentage-point'],Q.BYID['7.percent-increase']),'the distinctions the handbook drills stay askable');
const ids=new Set(Q.TERMS.map(t=>t.id));
const isPrime=n=>{ if(n<2) return false; for(let d=2;d*d<=n;d++) if(n%d===0) return false; return true; };
const g=(a,b)=>b?g(b,a%b):Math.abs(a), frac=(n,d)=>{ const k=g(n,d); n/=k; d/=k; return d===1?String(n):n+'/'+d; };
const num=s=>Number(String(s).replace(/−/g,'-').replace(/,/g,''));
const ans=m=>m.opts[m.ok], plain=s=>s.replace(/<[^>]+>/g,' ').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
// independent recomputation for the generators where a slip would hurt most
const CHECKS={
  incl:(q,a)=>{ const [,x,y,k]=/between (\d+) and (\d+), (inclusive|exclusive)/.exec(q); return num(a)===(k==='inclusive'?y-x+1:y-x-1); },
  rel:(q,a)=>{ const [,m,ph,n]=/from 1 to (\d+), inclusive, are (.+) (\d+)\?/.exec(q); const f={'less than':(k)=>k<+n,'no more than':k=>k<=+n,'at most':k=>k<=+n,'less than or equal to':k=>k<=+n,'greater than':k=>k>+n,'more than':k=>k>+n,'at least':k=>k>=+n,'no less than':k=>k>=+n,'greater than or equal to':k=>k>=+n}[ph];
    let c=0; for(let k=1;k<=+m;k++) if(f(k)) c++; return num(a)===c; },
  primes:(q,a)=>{ const n=+/less than (\d+)/.exec(q)[1]; let c=0; for(let k=2;k<n;k++) if(isPrime(k)) c++; return num(a)===c; },
  nfactors:(q,a)=>{ const n=+/does (\d+) have/.exec(q)[1]; let c=0; for(let k=1;k<=n;k++) if(n%k===0) c++; return num(a)===c; },
  lcmgcf:(q,a)=>{ const [,w,x,y]=/the (least common multiple|greatest common factor) of (\d+) and (\d+)/.exec(q); return num(a)===(w[0]==='l'?x*y/g(+x,+y):g(+x,+y)); },
  mmmr:(q,a)=>{ const [,w,l]=/the (arithmetic mean|median|mode|range) of the data set (.+)\?/.exec(q), v=l.split(', ').map(num).sort((p,r)=>p-r);
    const c={}; v.forEach(x=>c[x]=(c[x]||0)+1); const mode=+Object.keys(c).find(k=>c[k]===2);
    return num(a)==={'arithmetic mean':v.reduce((s,x)=>s+x,0)/v.length,median:v[3],mode,range:v[6]-v[0]}[w]; },
  pctchange:(q,a)=>{ const [,x,y]=/from \$(\d+) to \$(\d+)/.exec(q); return num(a.replace('%',''))===Math.abs(y-x)/x*100; },
  pyth:(q,a)=>{ let m=/lengths (\d+) and (\d+)\. What is the length of the hypotenuse/.exec(q); if(m) return num(a)===Math.hypot(+m[1],+m[2]);
    m=/hypotenuse of length (\d+) and one leg of length (\d+)/.exec(q); return num(a)===Math.sqrt(m[1]*m[1]-m[2]*m[2]); },
  conddice:(q,a)=>{ const [,s,k]=/sum of the two numbers is (\d+), what is the probability that at least one die shows a (\d)/.exec(q); let d=0,n=0;
    for(let x=1;x<=6;x++) for(let y=1;y<=6;y++) if(x+y===+s){ d++; if(x===+k||y===+k) n++; } return a===frac(n,d); },
  repl:(q,a)=>{ const [,r,b,w]=/(\d+) red balls and (\d+) blue balls\. Two balls are drawn at random (with|without) replacement/.exec(q), n=+r+ +b;
    return a===(w==='with'?frac(r*r,n*n):frac(r*(r-1),n*(n-1))); },
  venn:(q,a)=>{ const [,T,f,s,b]=/Of the (\d+) students in a club, (\d+) study French, (\d+) study Spanish, and (\d+) study both/.exec(q);
    return num(a)===(/neither/.test(q)?T-(f- -s-b):/exactly one/.test(q)?f- -s-2*b:f- -s-b); },
  trisides:(q,a)=>{ const v=/lengths (\d+), (\d+), and (\d+)/.exec(q).slice(1).map(Number).sort((x,y)=>x-y), l=v[0]**2+v[1]**2, r=v[2]**2;
    return a.includes(r<l?'acute':r===l?'right':'obtuse'); },
  remainder:(q,a)=>{ const m=/What is the remainder when (\d+) is divided by (\d+)\?/.exec(q); return !m||num(a)===m[1]%m[2]; },
  exactlydiv:(q,a)=>{ const [,n,k]=/from 1 to (\d+), inclusive, have exactly (\d) positive divisors/.exec(q); let c=0; for(let x=1;x<=+n;x++){ let d=0; for(let y=1;y<=x;y++) if(x%y===0) d++; if(d===+k) c++; } return num(a)===c; },
  cannotbe:(q,a)=>{ const k=+/n² < (\d+)/.exec(q)[1], v=num(a); return v*v>=k&&(Math.abs(v)-1)**2<k; },
  approx:(q,a)=>{ const n=+/√(\d+)/.exec(q)[1]; return [num(a)-1,num(a)+1].every(o=>Math.abs(o-Math.sqrt(n))>Math.abs(num(a)-Math.sqrt(n))); },
  suchthat:(q,a)=>{ const [,b,v]=/such that (\d)\s*(?:n)?\s*> ([\d,]+)/.exec(q.replace(/\s+/g,' ')); const n=num(a); return b**n>num(v)&&b**(n-1)<=num(v); },
  intmult:(q,a)=>{ const [,k,n]=/multiple of (\d+) that is greater than (\d+)/.exec(q); return num(a)%k===0&&num(a)>+n&&num(a)-k<=+n; },
  unifrand:(q,a)=>{ const [,n,k]=/1 to (\d+), inclusive.*multiple of (\d+)/.exec(q); return a===frac(Math.floor(n/k),+n); },
  taxable:(q,a)=>{ const [,i,d,r]=/income is \$([\d,]+), and \$([\d,]+) of it is deductible\. Tax is (\d+)%/.exec(q); return num(a.slice(1))===(num(i)-num(d))*r/100; },
  wavg:(q,a)=>{ const [,na,ma,nb,mb]=/(\d+) students have an average score of (\d+), and the other (\d+) students have an average score of (\d+)/.exec(q); return num(a)===(na*ma+nb*mb)/(+na+ +nb); }
};
CHECKS.scatter=(q,a,raw)=>{ const pts=[...raw.matchAll(/<circle cx="([\d.]+)" cy="([\d.]+)" r="4"/g)].map(m=>[(m[1]-34)/15,(166-m[2])/15]); return pts.length===8&&num(a)===pts.filter(p=>p[1]>p[0]).length; };
CHECKS.bargraph=(q,a,raw)=>{ const v=[...raw.matchAll(/class="qbar"\/><text[^>]*>(\d+)<\/text>/g)].map(m=>+m[1]); const m=/increase from (\d{4}) to (\d{4})/.exec(q);
  return v.length===4&&(m?num(a)===v[m[2]-2019]-v[m[1]-2019]:num(a)===v.reduce((s,x)=>s+x,0)/4); };
CHECKS.linegraph=(q,a,raw)=>{ const v=[...raw.matchAll(/class="qdot"\/><text[^>]*>(\d+)<\/text>/g)].map(m=>+m[1]), d=v.slice(1).map((x,i)=>x-v[i]), mo=['Jan','Feb','Mar','Apr','May'], k=d.indexOf(Math.max(...d)); return v.length===5&&a===mo[k]+' to '+mo[k+1]; };
let made=0;
for(const p of Q.PROBLEMS){
  for(const id of p.t) assert.ok(ids.has(id),p.id+': unknown term '+id);
  const seeds=p.fixed?[1]:Array.from({length:400},(_,i)=>i+1);
  for(const s of seeds){
    const m=Q.make(p,s); assert.ok(m,p.id+' seed '+s+' gave no question');
    assert.equal(new Set(m.opts).size,4,p.id+' needs four different choices');
    assert.ok(m.t.length&&m.t.every(id=>ids.has(id)),p.id+' terms');
    assert.ok(!/NaN|undefined|Infinity|null|\[object/.test(m.q+m.opts.join('|')+m.why),p.id+' text: '+m.q);
    if(CHECKS[p.id]) assert.ok(CHECKS[p.id](plain(m.q),plain(ans(m)),m.q),p.id+' seed '+s+': '+plain(m.q)+' → '+ans(m));
    const o=p.gen(Q.rng(s)); for(const id of (o.t||[])) assert.ok(p.t.includes(id),p.id+' variant term '+id+' missing from its list (the page finds problems by that list)');
    made++;
  }
}
assert.ok(Q.PROBLEMS.length>=130);
const covered=new Set(Q.PROBLEMS.flatMap(p=>p.t));
assert.deepEqual(Q.TERMS.filter(t=>!covered.has(t.id)).map(t=>t.id),[],'every term has at least one problem');
console.log('bank ok: '+Q.TERMS.length+' terms, '+Q.PROBLEMS.length+' problem kinds, '+made+' generated questions checked, '+covered.size+' terms have problems');

/* ---------- 2. the page ---------- */
let chromium; try{ ({chromium}=require('playwright')); }catch(e){ console.log('SKIP page test: Playwright not installed'); process.exit(0); }
(async()=>{
 const server=http.createServer((req,res)=>{
  const file=path.join(root,decodeURIComponent(req.url.split(/[?#]/)[0]));
  if(!file.startsWith(root+path.sep)){res.writeHead(404);return res.end();}
  try{res.setHeader('Content-Type',file.endsWith('.html')?'text/html; charset=utf-8':'application/javascript');res.end(fs.readFileSync(file));}catch{res.writeHead(404);res.end();}
 });await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const base='http://127.0.0.1:'+server.address().port;
 let browser;
 try{
  browser=await chromium.launch({channel:'chrome',headless:true});
  const ctx=await browser.newContext({viewport:{width:900,height:900}}), page=await ctx.newPage(), errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  // the app's data: one GRE word studied on the GRE page; the native bridge records what pages send
  await page.addInitScript(()=>{
    const d=new Date(Date.now()+30*864e5), p2=n=>String(n).padStart(2,'0'), exam=d.getFullYear()+'-'+p2(d.getMonth()+1)+'-'+p2(d.getDate());
    window.__INITIAL_STATE__={v:1,decks:{gre:{prog:{abate:{seen:2,ok:1,bad:1,streak:0,box:1,t:5}},settings:{dark:false,game:{goal:20,exam,snap:{t:1,lit:[],exam}}},daily:{date:'',done:0,ok:0},history:{}}}};
    window.__posts=[]; window.webkit={messageHandlers:{persist:{postMessage:b=>window.__posts.push(JSON.parse(b))}}};
  });
  await page.goto(base+'/quant.html');
  // exam in 30 days: 247 terms over the 23 days before the last week → 11 a day
  assert.match(await page.locator('.gsky').innerText(),/距 GRE 考试 30 天[\s\S]*每天点亮约 11 个新词条/);
  assert.match(await page.locator('.gq').first().innerText(),/0 \/ 11/);
  const play=async(missFirst)=>page.evaluate(async miss=>{
    const W=ms=>new Promise(r=>setTimeout(r,ms)); let missed=null;
    for(let k=0;k<80;k++){
      const s=QZ.state().run; if(!s) break; const q=s.queue[s.i];
      if(q.kind==='card'){ document.getElementById('gNext').click(); continue; }
      const wrong=miss&&!missed&&q.kind==='mean'; if(wrong) missed=q.t.id;
      document.querySelector(`.opt[data-i="${wrong?(q.ok+1)%4:q.ok}"]`).click(); await W(5);
      document.getElementById('gNext').click(); await W(5);
    }
    await W(400); return missed;
  },missFirst);
  // ⭐ learn the first group of chapter 1, missing one meaning question
  await page.click('#bLearn');
  assert.equal(await page.evaluate(()=>QZ.state().run.queue.filter(q=>q.kind==='card').length),8);
  const missed=await play(true);
  const st=await page.evaluate(()=>{ const p=QZ.state().prog; return {q:Object.keys(p).filter(k=>/^q:\d/.test(k)).map(k=>[k,p[k].lv,p[k].due,p[k].wd]),today:Math.floor((Date.now()-new Date().getTimezoneOffset()*6e4)/864e5)}; });
  assert.equal(st.q.length,8,'eight terms met');
  for(const [k,lv,due,wd] of st.q){
    if(k==='q:'+missed){ assert.equal(lv,0,'missed term stays unlit'); assert.equal(due,st.today+1,'answered right again: back tomorrow'); assert.equal(wd,st.today); }
    else { assert.equal(lv,1,k+' lit'); assert.equal(due,st.today+1); }
  }
  assert.match(await page.locator('.gsum .gbig').innerText(),/答对 \d+ \/ \d+/);
  assert.match(await page.locator('.gsum').innerText(),/新点亮 7 个词条/);
  // every answer went into the shared answer log (学习记录, home 今日) under source 'quant'
  const tally=await page.evaluate(()=>({n:IELTSStats.today('quant').done,stats:window.__posts.filter(p=>p.deck==='stats').length}));
  assert.ok(tally.n>=24&&tally.stats>=24,JSON.stringify(tally));
  // saved like gre.html: deck gre, the whole prog map (Windows replaces prog wholesale), nothing else
  const post=await page.evaluate(()=>window.__posts.filter(p=>p.deck==='gre').pop());
  assert.equal(post.deck,'gre'); assert.deepEqual(Object.keys(post.payload),['prog']);
  assert.deepEqual(post.payload.prog.abate,{seen:2,ok:1,bad:1,streak:0,box:1,t:5});
  assert.equal(Object.keys(post.payload.prog).filter(k=>k.startsWith('q:')).length,9);   // 8 terms + meta
  assert.ok(Object.entries(post.payload.prog).every(([k,v])=>!k.startsWith('q:')||(!('seen' in v)&&!('box' in v)&&v.t>0)),'q: records carry t and no seen/box');
  // next day: all eight come back for review
  await page.evaluate(()=>{ QZ.clock=()=>Date.now()+864e5; renderHub(); });
  assert.match(await page.locator('#bReview').innerText(),/复习到期 · 8 个/);
  await page.click('#bReview'); await play(false);
  const lv2=await page.evaluate(()=>Object.entries(QZ.state().prog).filter(([k,v])=>/^q:\d/.test(k)&&v.lv===2).length);
  assert.equal(lv2,7,'reviewed on time: the seven lit terms go up a level');
  // 🧮 boss: a miss costs a heart at once
  await page.evaluate(()=>{ renderHub(); });
  await page.click('#bBoss');
  await page.evaluate(()=>{ const s=QZ.state().run; document.querySelector(`.opt[data-i="${(s.queue[0].ok+1)%4}"]`).click(); });
  assert.equal(await page.locator('#gLives').innerText(),'♥♥♡');
  await page.click('#gExit');
  // ☄️ speed records nothing; ✅ 不会 sends a term back to today's review
  const before=await page.evaluate(()=>JSON.stringify(Object.entries(QZ.state().prog).filter(([k])=>/^q:\d/.test(k))));
  await page.click('#gHub'); await page.click('#bSpeed');
  await page.evaluate(async()=>{ for(let i=0;i<5;i++){ const s=QZ.state().run; document.querySelector(`.opt[data-i="${s.queue[s.i].ok}"]`).click(); await new Promise(r=>setTimeout(r,260)); } });
  assert.equal(await page.evaluate(()=>QZ.state().run.score),5);
  assert.equal(await page.evaluate(()=>JSON.stringify(Object.entries(QZ.state().prog).filter(([k])=>/^q:\d/.test(k)))),before);
  await page.click('#gExit'); await page.click('#gHub'); await page.click('#bCheck');
  await page.click('[data-n="2"]');
  assert.equal(await page.evaluate(()=>{ const r=QZ.state().prog['q:1.at-most']; return r.due-Math.floor((QZ.clock()-new Date().getTimezoneOffset()*6e4)/864e5); }),0);
  // home page: the tile counts the lit terms; the GRE deck's own counters ignore q: records
  await page.goto(base+'/index.html'); await page.waitForTimeout(1200);
  // 今日计划 has a math row; its button opens quant.html straight into the next step
  const row=page.locator('[data-plan="quant"]');
  assert.match(await row.innerText(),/数学词汇/);
  await row.locator('.pgo').click(); await page.waitForURL(/quant\.html/); await page.waitForTimeout(400);
  assert.ok(await page.evaluate(()=>!!QZ.state().run),'opened into a run');
  await page.goto(base+'/index.html'); await page.waitForTimeout(1200);
  const tile=await page.locator('a.tile[href="quant.html"]').innerText();
  assert.match(tile,/GRE 数学词汇[\s\S]*已点亮 8 \/ 247/);   // the missed term was lit by the review
  // the GRE page still loads with the q: records in its prog
  await page.goto(base+'/gre.html'); await page.waitForTimeout(800);
  assert.ok(await page.evaluate(()=>!!document.querySelector('#tabs')));
  assert.deepEqual(errors,[],errors.join('\n'));
  console.log('page ok: learn, review, boss, speed, checklist, home tile, GRE page');
 }finally{ if(browser) await browser.close(); server.close(); }
})().catch(e=>{ console.error(e); process.exit(1); });
