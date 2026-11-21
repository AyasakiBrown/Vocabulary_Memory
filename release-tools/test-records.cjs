// 📈 学习记录 (records.html) and the home page's 学习记录 module. Requires Playwright and Chrome; synthetic data only.
const {chromium}=require('playwright');
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../src');
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
  // a learner who studied today, yesterday and 3 days ago (answer log), plus one day 40 days ago known only from a mistake
  const seed=()=>{
   const pad=n=>String(n).padStart(2,'0'), key=o=>{ const t=new Date(), d=new Date(t.getFullYear(),t.getMonth(),t.getDate()-o); return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate()); };
   const dn=o=>{ const d=new Date(Date.now()-o*864e5); return Math.floor((d.getTime()-d.getTimezoneOffset()*6e4)/864e5); };
   const ev=(id,o,word,source)=>[id,{word,date:key(o),time:'09:00:00',ts:Date.now()-o*864e5,source,mode:'dict',answer:'x',meaning:word==='abate'?'减轻':''}];
   try{ localStorage.setItem('ielts_nb',JSON.stringify([{w:'cogent'},{w:'old'}])); }catch(e){}   // both are still in 生词本
   window.__INITIAL_STATE__={v:1,decks:{
    stats:{days:{[key(0)]:{dev1:{n:10,ok:8,s:{gre:[10,8]},w:{abate:[9*3600+5,1],cogent:[9*3600+50,0],lucid:[21*3600,1]}}},
                 [key(1)]:{dev1:{n:20,ok:15,s:{notebook:[20,15]},w:{}}},
                 [key(3)]:{dev1:{n:5,ok:5,s:{p1:[5,5]},w:{}}}}},
    gre:{prog:{},settings:{game:{goal:20,day:{d:dn(0),lit:6},exam:key(-30),snap:{t:1,lit:['abate','lucid'],exam:key(-30)}}},daily:{date:key(0),done:14,ok:10},history:{}},
    wrong:{list:[],del:{},events:Object.fromEntries([ev('a',0,'abate','gre'),ev('b',0,'abate','gre'),ev('c',0,'cogent','gre'),ev('d',40,'old','notebook')])},
    srs:{items:{
      abate:{w:'abate',src:['gre'],t:1,d:{lv:4,n:5,due:dn(-2),h:[[dn(7),7,1],[dn(1),1,1]]},m:{lv:1,n:2,due:dn(-1),h:[[dn(2),2,0]]}},
      lucid:{w:'lucid',src:['gre'],t:1,d:{lv:2,n:3,due:dn(-5),h:[[dn(3),3,1]]}},
      cogent:{w:'cogent',src:['notebook'],t:1,d:{lv:0,n:1,due:dn(1),h:[[dn(1),1,0]]}}},meta:{}},
    notebook:{list:[{w:'cogent'},{w:'old'}],del:{}}, p1:{prog:{},history:{}}, vj:{prog:{}}, scene:{prog:{}}, config:{}}};
  };
  const errors=[];
  const ctx=await browser.newContext({viewport:{width:900,height:900}}), page=await ctx.newPage();
  page.on('pageerror',e=>errors.push('records: '+e.message));
  await page.addInitScript(seed);
  await page.goto(base+'/records.html'); await page.waitForTimeout(1100);   // first-paint count-up
  const kpi=await page.evaluate(()=>[...document.querySelectorAll('.kpi')].map(k=>k.querySelector('.l').textContent+'='+k.querySelector('[data-n]').textContent));
  // today = the larger of the answer log (10) and the GRE page's own counter (14); 4 study days incl. the mistake-only one; streak today+yesterday
  assert.deepEqual(kpi,['今日答题=14','连续学习=2','近 7 天答题=39','近 7 天正确率=77','学习天数=4','复习中的词=4']);   // srs.js seeds the ledger with old mistakes, so 'old' joins
  assert.match(await page.locator('.kpi').nth(4).innerText(),/自 \d{4}\/\d{2}\/\d{2} 起/);
  // calendar: one cell per day up to today, today outlined; the mistake-only day explains why it has no count
  const cal=await page.evaluate(()=>({cells:document.querySelectorAll('#cal .cell').length,today:document.querySelectorAll('#cal .cell.today').length,months:document.querySelectorAll('#calMonths .mo').length}));
  assert.ok(cal.cells>=7*11&&cal.today===1&&cal.months===4,JSON.stringify(cal));
  const tipOf=async sel=>{ await page.locator(sel).scrollIntoViewIfNeeded(); await page.waitForTimeout(50); const b=await page.locator(sel).boundingBox(); await page.mouse.move(b.x+b.width/2,b.y+Math.min(b.height/2,20)); await page.waitForTimeout(60); return page.evaluate(()=>document.getElementById('tip').classList.contains('on')?document.getElementById('tip').innerText:''); };
  assert.match(await tipOf('#cal .cell.today'),/答题\s*14[\s\S]*答错\s*3 次/);
  // daily chart: 30 hit columns, stacked 答对/答错, tooltip with sources; the range switch redraws and is remembered
  assert.equal(await page.locator('#daily .hit').count(),30);
  assert.match(await tipOf('#daily .hit >> nth=29'),/答对\s*10[\s\S]*答错\s*4[\s\S]*GRE 14/);
  await page.locator('#rangeSeg button[data-v="14"]').click();
  assert.equal(await page.locator('#daily .hit').count(),14);
  assert.equal(await page.locator('#mis .hit').count(),14);
  assert.match(await page.locator('#dailyHead').innerText(),/最近 14 天学了 3 天，共答 39 题/);
  // memory strength per track, forecast (today = overdue + due), retention by gap, weekly trend
  assert.match(await page.locator('#memHead').innerText(),/共 5 条记录，其中 1 条已隔 2 周以上/);
  assert.match(await page.locator('#fcHead').innerText(),/今天到期 2 条（其中过期 1）/);
  assert.equal(await page.locator('#fc .hit').count(),14);
  assert.match(await page.locator('#retHead').innerText(),/共 5 次，答对 60%/);
  assert.equal(await page.locator('#trend .dot').count(),2);   // the two weeks with data
  // scope: GRE drops the notebook word everywhere it applies
  await page.locator('#scopeSeg button[data-v="gre"]').click();
  assert.match(await page.locator('#memHead').innerText(),/共 3 条记录/);
  assert.match(await page.locator('#fcHead').innerText(),/今天到期 0 条/);
  assert.match(await page.locator('.kpi').nth(5).innerText(),/^复习中的词\s*2/);
  // mistakes: the most-missed word first; study hours from the answer log
  assert.match(await page.locator('#topWrong .hb').first().innerText(),/abate[\s\S]*2 次/);
  assert.match(await page.locator('#hourHead').innerText(),/上午/);
  // GRE card: lit / glimmer / unobserved, today's lighting against the goal, exam pace
  assert.match(await page.locator('#gre').innerText(),/已点亮 2 颗 · 见过 2 词[\s\S]*今日点亮\s*6\s*\/ 20[\s\S]*距考试 30 天/);
  // daily table, and no backup buttons without the app's data bridge
  assert.equal(await page.locator('#table tbody tr').count(),3);
  assert.equal(await page.locator('#dataActs button').count(),0);
  // phone width: nothing wider than the screen
  await page.setViewportSize({width:375,height:800}); await page.waitForTimeout(300);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'no horizontal scroll on a phone');
  await page.close();

  // in the Mac / Windows app (data bridge present): backup buttons post their action; the home page shows the 学习记录 module, not the old injected button
  const p2=await ctx.newPage(); p2.on('pageerror',e=>errors.push('app: '+e.message));
  await p2.addInitScript(seed);
  await p2.addInitScript(()=>{ window.__acts=[]; window.webkit={messageHandlers:{learningData:{postMessage:a=>window.__acts.push(a)},persist:{postMessage(){}}}}; });
  await p2.goto(base+'/records.html');
  await p2.locator('#dataActs [data-a="export"]').click(); await p2.locator('#dataActs [data-a="folder"]').click();
  assert.deepEqual(await p2.evaluate(()=>window.__acts),['export','folder']);
  // a GRE word falls due: 今日计划 offers to review GRE only (the IELTS words stay recorded)
  await p2.evaluate(()=>{ const L=IELTSReview.all(), now=Date.now(); L.lucid.d.due=IELTSReview.dayNo()-1; L.lucid.d.t=now; L.lucid.t=now; localStorage.setItem('ielts_srs',JSON.stringify(L)); });
  await p2.goto(base+'/index.html'); await p2.waitForTimeout(1100);
  const plan=await p2.evaluate(()=>({rows:[...document.querySelectorAll('#hero .prow')].map(r=>r.dataset.plan+':'+r.querySelector('.pgo').textContent),
    light:document.querySelector('#hero [data-plan="light"]').innerText.replace(/\n/g,' '),note:document.querySelector('#hero .pnote').innerText}));
  assert.deepEqual(plan.rows,['review:只复习 GRE →','light:⚡ 极速点亮','rekindle:⚡ 极速重燃','quant:学新词 →']);   // ∑ 数学词汇: nothing met yet, so today's share of new terms
  assert.match(plan.light,/6 \/ 20 颗/); assert.match(plan.note,/雅思 2 条到期词/);
  await p2.locator('#hero [data-plan="review"] .pgo').click(); await p2.waitForURL(/review\.html$/);
  assert.equal(await p2.evaluate(()=>IELTSReview.reviewScope()),'gre');
  await p2.goto(base+'/index.html'); await p2.waitForTimeout(1100);
  assert.match(await p2.locator('#hero .pnote').innerText(),/只看 GRE。雅思还有 2 条到期/);
  await p2.locator('#scopeAll').click();
  assert.equal(await p2.evaluate(()=>IELTSReview.reviewScope()),'all');
  const home=await p2.evaluate(()=>{ const t=document.querySelector('#mod-records [data-records-entry]');
    return {href:t&&t.getAttribute('href'),bars:t?t.querySelectorAll('.spark i').length:0,stats:t&&t.querySelector('.stats').innerText,
      line:document.querySelector('#mod-records .mod-tt p').innerText,old:[...document.querySelectorAll('button')].some(b=>b.textContent==='学习记录与数据转移')}; });
  assert.deepEqual(home,{href:'records.html',bars:14,stats:'近 7 天 39 题 · 正确率 77%\n🔥 连续 2 天',line:'学了 4 天 · 连续 2 天',old:false});
  // 雅思 is paused by default: last, collapsed, progress kept; resuming brings it back to the top, open, and it stays so after a reload
  const mods=()=>p2.evaluate(()=>[...document.querySelectorAll('.mod')].map(m=>m.dataset.mod+(m.classList.contains('closed')?'-':'+')+(m.classList.contains('paused')?'⏸':'')));
  assert.deepEqual(await mods(),['gre+','books+','records+','ielts-⏸']);
  assert.match(await p2.locator('#mod-ielts .mod-head').innerText(),/进度都保留[\s\S]*⏸ 已暂停/);
  await p2.locator('#mod-ielts .mod-head').click(); await p2.locator('#mod-ielts .mod-pause').click();
  assert.deepEqual(await mods(),['ielts+','gre+','books+','records+']);
  await p2.reload(); await p2.waitForTimeout(300);
  assert.deepEqual(await mods(),['ielts+','gre+','books+','records+']);
  await p2.locator('#mod-ielts .mod-pause').click();
  assert.deepEqual(await mods(),['gre+','books+','records+','ielts-⏸']);
  await p2.locator('#mod-records [data-records-entry]').click(); await p2.waitForURL(/records\.html$/);
  // the entrance plays once per app session: coming back shows final numbers at once, no rising cards
  const settled=()=>p2.evaluate(()=>({calm:document.documentElement.classList.contains('calm'),
    counting:[...document.querySelectorAll('[data-n]')].filter(n=>n.textContent!==n.getAttribute('data-n')).length,
    rising:[...document.querySelectorAll('.rise,.enter,.pop')].filter(e=>getComputedStyle(e).animationName!=='none').length}));
  assert.deepEqual(await settled(),{calm:true,counting:0,rising:0});
  await p2.goto(base+'/index.html');
  assert.deepEqual(await settled(),{calm:true,counting:0,rising:0});
  assert.deepEqual(errors,[]);
  console.log('PASS: 学习记录 — KPIs (today takes the larger counter, mistake-only days count), calendar with tooltips and months, daily bars with range switch, memory strength, 14-day forecast, retention by gap, weekly trend, GRE scope, top mistakes, study hours, GRE progress, daily table, backup buttons through the app bridge, phone width; home module replaces the injected button; 今日计划 switches the review to GRE only and back; 雅思 pauses to the end of the home page and resumes; the entrance animation plays once per session.');
 }finally{ if(browser) await browser.close(); await new Promise(r=>server.close(r)); }
})().catch(e=>{console.error(e);process.exitCode=1;});
