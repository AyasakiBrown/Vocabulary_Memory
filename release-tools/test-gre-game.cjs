// GRE 🌌 词汇星图 (game mode). Run with Playwright on NODE_PATH; isolated browser, synthetic progress.
const {chromium}=require('playwright');
const http=require('node:http'), fs=require('node:fs'), path=require('node:path');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../src');

(async()=>{
 const server=http.createServer((req,res)=>{
  const file=path.join(root,decodeURIComponent(req.url.split('?')[0]));
  if(!file.startsWith(root+path.sep)){res.writeHead(404);return res.end();}
  try{res.setHeader('Content-Type',file.endsWith('.html')?'text/html; charset=utf-8':'application/javascript');res.end(fs.readFileSync(file));}catch{res.writeHead(404);res.end();}
 });
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const base='http://127.0.0.1:'+server.address().port;
 let browser;
 try{
  browser=await chromium.launch({channel:'chrome',headless:true});
  const page=await (await browser.newContext()).newPage();
  const errors=[]; page.on('pageerror',e=>errors.push(e.message));
  const day=n=>page.evaluate(n=>{IELTSReview.clock=()=>Date.now()+864e5*n;},n);       // the ledger's clock, n days ahead
  // answer the current question: right, or wrong on purpose
  const answer=(right=true)=>page.evaluate(right=>{
    const t=gs.cur;
    if(t.type==='spell'){ $('gInput').value=right?t.w.en:'zzzz'; gSubmit(); }
    else [...$('gOpts').children].find(b=>(+b.dataset.id===t.w.id)===right).click();
  },right);
  const finish=()=>page.evaluate(()=>{ let n=0; while(gs&&!gs.finished&&n++<400){ if(gs.phaseName==='study'||gs.answered){ gNext(); continue; }
    const t=gs.cur; if(t.type==='spell'){ $('gInput').value=t.w.en; gSubmit(); } else [...$('gOpts').children].find(b=>+b.dataset.id===t.w.id).click(); } return gs&&gs.finished; });

  await page.goto(base+'/gre.html');
  await page.evaluate(()=>{settings.auto=false;saveSettings();});

  // every List brings its own words: no word (ignoring case, punctuation, sth./sb.) is in two Lists of the bank
  const dupes=await page.evaluate(()=>{ const norm=s=>String(s).toLowerCase().replace(/\b(sth|sb)\.?/g,'').replace(/[^a-z]/g,''), seen={}, out=[];
    for(const v of VOCAB){ const k=norm(v.en); if(seen[k]&&seen[k].l!==v.l&&!(/\s/.test(seen[k].en)!==/\s/.test(v.en))) out.push(seen[k].en+' / '+v.en); seen[k]=seen[k]||v; } return out; });
  assert.deepEqual(dupes,[]);   // (turn out, List 9, and turnout, List 29, are a phrasal verb and a noun: different entries)

  // the tab is one of the page's tabs: same element and class as its neighbours, no link styling
  const tab=await page.evaluate(()=>{const t=document.querySelector('.tab[data-mode="game"]'), n=document.querySelector('.tab[data-mode="dict"]'), cs=getComputedStyle(t), ns=getComputedStyle(n);
    return [t.tagName===n.tagName,t.className.replace(' on','')===n.className.replace(' on',''),cs.textDecorationLine,cs.fontSize===ns.fontSize];});
  assert.deepEqual(tab,[true,true,'none',true]);

  // hub: an untouched sky — 30 Lists, one star per word, all dark; the first action is to light new stars
  await page.locator('.tab[data-mode="game"]').click();
  let hub=await page.evaluate(()=>({mode:state.mode,lists:document.querySelectorAll('.glist').length,dots:document.querySelectorAll('.gdots i').length,
    lit:document.querySelectorAll('.gdots i.s1,.gdots i.s2,.gdots i.s3,.gdots i.due').length,decksHidden:$('decks').classList.contains('hide'),
    go:$('gGoNew').textContent,primaryNew:$('gGoBlitz').classList.contains('primary')&&!$('gGoNew').classList.contains('primary'),rekOff:$('gGoRek').disabled,trialOff:$('gPTrial').disabled}));
  assert.deepEqual(hub,{mode:'game',lists:30,dots:2902,lit:0,decksHidden:true,go:'✨ 点亮新星 · List 1（8 颗）',primaryNew:true,rekOff:true,trialOff:true});

  // nothing met yet: the playground is locked and there is no riddle
  assert.deepEqual(await page.evaluate(()=>[...document.querySelectorAll('.gtile')].map(t=>t.disabled)).then(a=>[a.length>=4,a.every(Boolean)]),[true,true]);
  assert.deepEqual(await page.evaluate(()=>[G.badges.length,document.querySelectorAll('#gBadges span.on').length,document.querySelectorAll('#gBadges span').length>=12]),[0,0,true]);

  // prompts never give the word away
  const safe=await page.evaluate(()=>[gMask(BYEN.get('flush'),false),gMask(BYEN.get('flush'),true),gMask(BYEN.get('stave sth. off'),false),
    /virtue/i.test(gZhPrompt(BYEN.get('virtue'))),gDefMasked({en:'flush',def:['a. flush with money']})]);
  assert.deepEqual(safe,['_ _ _ _ _   (5)','f _ _ _ _   (5)','_ _ _ _ _    sth.    _ _ _',false,'～ with money']);

  // a new group: the first eight unspelled words of the List, in book order, through four rounds
  await page.locator('#gGoNew').click();
  let st=await page.evaluate(()=>({kind:gs.kind,words:gs.words.map(w=>w.id),phase:gs.phaseName,steps:[...document.querySelectorAll('.gsteps span')].map(s=>s.textContent)}));
  assert.deepEqual(st,{kind:'new',words:[0,1,2,3,4,5,6,7],phase:'study',steps:['观星','辨认','语境','点亮']});
  for(let i=0;i<8;i++){ assert.match(await page.evaluate(()=>$('gCard').innerText),/释义与例句/); await page.keyboard.press('Enter'); }

  // 辨认: four meanings, at least one from the same group; number keys answer, Enter moves on
  let q=await page.evaluate(()=>({phase:gs.phaseName,type:gs.cur.type,en:gs.cur.w.en,opts:[...$('gOpts').children].map(b=>+b.dataset.id),right:[...$('gOpts').children].findIndex(b=>+b.dataset.id===gs.cur.w.id)}));
  assert.equal(q.phase,'mean'); assert.equal(q.opts.length,4); assert.equal(new Set(q.opts).size,4);
  assert.ok(q.opts.filter(id=>id<8).length>=2,'a group-mate is among the choices');
  // a wrong pick: logged as a mistake, combo reset, and the word comes back three questions later
  await page.keyboard.press(String((q.right+1)%4+1));
  let w=await page.evaluate(en=>({answered:gs.answered,bad:gs.bad,combo:gs.combo,later:gs.queue[gs.qi+3]&&gs.queue[gs.qi+3].w.en,retry:gs.queue[gs.qi+3]&&gs.queue[gs.qi+3].retry,
    wrong:JSON.parse(localStorage.getItem('ielts_wrong')||'[]').some(x=>x.en===en&&x.src==='gre'),ev:localStorage.getItem('ielts_wrong_events')||'',fb:$('gFb').innerText}),q.en);
  assert.deepEqual([w.answered,w.bad,w.combo,w.later,w.retry,w.wrong],[true,1,0,q.en,true,true]);
  assert.match(w.ev,/quiz/); assert.match(w.fb,/记错了/);
  await page.keyboard.press('Enter');
  // the rest of 辨认 and 语境 answered right: the blank hides the word, the combo multiplies XP
  for(let i=0;i<40;i++){
    const s=await page.evaluate(()=>({phase:gs.phaseName,type:gs.cur.type,en:gs.cur.w.en,answered:gs.answered,sent:$('gSent')?$('gSent').textContent:''}));
    if(s.phase==='spell') break;
    if(s.type==='ctx') assert.ok(s.sent.includes('?')&&!new RegExp('\\b'+s.en+'\\b','i').test(s.sent),'blank hides the word: '+s.sent);
    await answer(true); await page.keyboard.press('Enter');
  }
  st=await page.evaluate(()=>({phase:gs.phaseName,combo:gs.combo,queue:gs.queue.length,head:$('gCombo').textContent}));
  assert.equal(st.phase,'spell'); assert.equal(st.queue,8); assert.ok(st.combo>=10&&/×2/.test(st.head),'combo carries across rounds: '+st.head);

  // 点亮: typed from the meaning. Right first time lights the star; a hint or a miss leaves only 微光
  const firstWord=await page.evaluate(()=>gs.cur.w.en);
  await page.locator('#gInput').fill(firstWord); await page.keyboard.press('Enter');
  let lit=await page.evaluate(()=>({answered:gs.answered,lv:gStar(gs.cur.w).lv,s:gStar(gs.cur.w).s,lit:gs.lit.length,fb:$('gFb').innerText,readOnly:$('gInput').readOnly}));
  assert.deepEqual([lit.answered,lit.lv,lit.s,lit.lit,lit.readOnly],[true,1,'s1',1,true]); assert.match(lit.fb,/点亮了/);
  await page.keyboard.press('Enter');
  const hinted=await page.evaluate(()=>{ const w=gs.cur.w; $('gLetter').click(); const mask=$('gMask').textContent; $('gInput').value=w.en; gSubmit(); return {en:w.en,mask,first:w.en[0],s:gStar(w).s,fb:$('gFb').innerText}; });
  assert.ok(hinted.mask.startsWith(hinted.first)); assert.equal(hinted.s,'glim'); assert.match(hinted.fb,/不计入点亮/);
  await page.keyboard.press('Enter');
  const missed=await page.evaluate(()=>gs.cur.w.en);
  await answer(false);
  assert.equal(await page.evaluate(()=>gStar(gs.cur.w).s),'glim');
  assert.ok(await finish());
  let sum=await page.evaluate(([h,m])=>({lit:gs.lit.length,stars:gs.words.map(w=>gStar(w).lv),hs:gStar(BYEN.get(h)).lv,ms:gStar(BYEN.get(m)).lv,xp:G.xp,gsxp:gs.xp,day:G.day.lit,missions:G.day.missions,streak:G.streak.n,
    saved:JSON.parse(localStorage.getItem('ielts_gre_settings')).game.xp,text:$('gPlay').innerText,due:gSky().due,
    led:JSON.parse(localStorage.getItem('ielts_srs'))[h]}),[hinted.en,missed]);
  assert.equal(sum.lit,6); assert.equal(sum.hs,0); assert.equal(sum.ms,0); assert.equal(sum.stars.filter(l=>l===1).length,6);
  assert.ok(sum.xp>60&&sum.xp===sum.gsxp&&sum.saved===sum.xp,'XP saved with the page settings');
  assert.deepEqual([sum.day,sum.missions,sum.streak,sum.due],[6,1,1,0]);
  assert.match(sum.text,/点亮了 6 颗新星/); assert.match(sum.text,/2 颗只有微光/);
  assert.ok(sum.led&&sum.led.d&&sum.led.m&&sum.led.src.includes('gre'),'answers go to the shared review ledger');

  // back on the map: six lit, two glimmering, and the next group starts at the ninth word
  await page.locator('#gBack').click();
  hub=await page.evaluate(()=>({s1:document.querySelectorAll('#gField i.s1').length,glim:document.querySelectorAll('#gField i.glim').length,litN:$('gLitN').textContent,go:$('gGoNew').textContent}));
  assert.deepEqual(hub,{s1:6,glim:2,litN:'6',go:'✨ 点亮新星 · List 1（8 颗）'});
  // eight words met: the playground opens, the first badge is awarded, and today's riddle is fixed
  const open=await page.evaluate(()=>({tiles:[...document.querySelectorAll('.gtile')].every(t=>!t.disabled),badges:G.badges,on:document.querySelectorAll('#gBadges span.on').length,
    riddle:G.day.riddle&&G.day.riddle.id,syn:!!$('gmSyn')===!!window.GRE_SYNONYMS}));
  assert.deepEqual([open.tiles,open.badges,open.on,open.syn],[true,['lit1'],1,true]); assert.ok(open.riddle>=0&&open.riddle<8,'the riddle is a word already met');
  assert.deepEqual(await page.evaluate(()=>{gStart('new',1); const ids=gs.words.map(w=>w.id); gExit(); return ids;}),[8,9,10,11,12,13,14,15]);
  // its first card was shown, so word 8 is no longer "never seen": leaving the group makes it a 微光, not a new star again
  assert.deepEqual(await page.evaluate(()=>{ gRunClear(); return [gStar(VOCAB[8]).s,gStar(VOCAB[8]).met,gStar(VOCAB[9]).met,VOCAB.filter(v=>v.l===1&&!gStar(v).met)[0].id]; }),['glim',true,false,9]);

  // the next day the six lit stars have dimmed (the two glimmers were never lit, so they are not "dimmed"); rekindling asks meanings before spellings
  await day(1);
  await page.evaluate(()=>gRenderHub());
  hub=await page.evaluate(()=>({due:$('gDueN').textContent,dim:document.querySelectorAll('#gField i.due').length,glim:document.querySelectorAll('#gField i.glim').length,primary:$('gGoRekFast').classList.contains('primary')&&!$('gGoRek').classList.contains('primary'),fastBtn:$('gGoRekFast').textContent,
    rek:$('gGoRek').textContent,glimBtn:$('gGoGlim').textContent,goal:document.querySelector('.gq').innerText,day:G.day.lit}));
  assert.deepEqual(hub,{due:'6',dim:6,glim:3,primary:true,fastBtn:'⚡ 极速重燃 6 颗 · 12 题',rek:'🔥 重燃 6 颗变暗的星',glimBtn:'🌫 重新点亮 3 颗微光',goal:'今日目标 ① 重燃变暗的星\n还剩 6 颗',day:0});
  await page.locator('#gGoRek').click();
  const order=await page.evaluate(()=>gs.queue.map(t=>t.type==='spell'?'s':'m').join(''));
  assert.equal(order,'mmmmmmssssss');
  assert.ok(await finish());
  sum=await page.evaluate(([h,m])=>({lv:gs.words.map(w=>gStar(w).lv).join(''),h:gStar(BYEN.get(h)).lv,m:gStar(BYEN.get(m)).lv,streak:G.streak.n,due:gSky().due,text:$('gPlay').innerText,next:$('gAgain').textContent}),[hinted.en,missed]);
  assert.deepEqual([sum.lv,sum.h,sum.m,sum.streak,sum.due],['222222',0,0,2,0]);
  assert.match(sum.text,/重燃完成 · 一次答对 12 \/ 12/); assert.equal(sum.next,'🌫 再重新点亮一组微光');
  // the glimmers are re-taught (the two from the first group, plus word 8 whose card was shown): back through 观星 and the four rounds, and now they light
  await page.locator('#gAgain').click();
  st=await page.evaluate(()=>({kind:gs.kind,words:gs.words.map(w=>w.en).sort(),phases:gs.phases,card:$('gCard').innerText}));
  assert.deepEqual([st.kind,st.words,st.phases],['glim',[hinted.en,missed,'accessible'].sort(),['study','mean','ctx','spell']]); assert.match(st.card,/释义与例句/);
  assert.ok(await finish());
  sum=await page.evaluate(([h,m])=>({h:gStar(BYEN.get(h)).lv,m:gStar(BYEN.get(m)).lv,day:G.day.lit,glim:gSky().glim,text:$('gPlay').innerText}),[hinted.en,missed]);
  assert.deepEqual([sum.h,sum.m,sum.day,sum.glim],[1,1,3,0]); assert.match(sum.text,/点亮了 3 颗微光星/);

  // a wrong answer while rekindling costs a level
  await day(4);
  await page.evaluate(()=>{ gs=null; gStart('rekindle'); });
  const drop=await page.evaluate(()=>{                  // questions are shuffled: answer right until a ★★ word's spelling comes up
    while(!(gs.cur.type==='spell'&&gStar(gs.cur.w).lv===2)){ const t=gs.cur; if(t.type==='spell'){ $('gInput').value=t.w.en; gSubmit(); } else [...$('gOpts').children].find(b=>+b.dataset.id===t.w.id).click(); gNext(); }
    const w=gs.cur.w, before=gStar(w).lv; $('gInput').value='zzzz'; gSubmit(); return [before,gStar(w).lv,gs.dimmed.length,$('gFb').innerText]; });
  assert.deepEqual(drop.slice(0,3),[2,1,1]); assert.match(drop[3],/星光减弱/);
  assert.ok(await finish());

  // a missed day breaks the streak
  await day(9);
  assert.equal(await page.evaluate(()=>{gs=null; gRenderHub(); return gStreak();}),0);

  // goal ① after a long break: at most 30 stars a day are asked for, and 30 rekindled meets the goal
  const cap=await page.evaluate(()=>{ const real=gSky, day=Object.assign({},G.day); gSky=()=>Object.assign(real(),{due:45});
    G.day.rw=12; gRenderHub(); const a=document.querySelector('.gq').innerText;
    G.day.rw=30; gRenderHub(); const b=[document.querySelector('.gq').innerText,document.querySelector('.gq').classList.contains('done')];
    gSky=real; G.day=day; gRenderHub(); return [a,b]; });
  assert.deepEqual(cap,['今日目标 ① 重燃变暗的星\n还剩 18 颗',['今日目标 ① 重燃变暗的星\n✓ 今天已重燃 30 颗',true]]);

  // trial: three misses end it without a crown; a clean run crowns the List
  await page.evaluate(()=>{ gStart('trial',1); });
  assert.deepEqual(await page.evaluate(()=>[gs.queue.length,gs.total,$('gLives').textContent]),[20,20,'❤️❤️❤️']);
  for(let i=0;i<3;i++){ await answer(false); await page.evaluate(()=>gNext()); }
  let trial=await page.evaluate(()=>({done:gs.finished,lives:gs.lives,crown:G.crowns[1]||null,text:$('gPlay').innerText}));
  assert.deepEqual([trial.done,trial.lives,trial.crown],[true,0,null]); assert.match(trial.text,/试炼中断/);
  await page.evaluate(()=>{ gs=null; gStart('trial',1); });
  const xp0=await page.evaluate(()=>G.xp);
  assert.ok(await finish());
  trial=await page.evaluate(()=>({crown:G.crowns[1].best,text:$('gPlay').innerText,xp:G.xp}));
  assert.equal(trial.crown,20); assert.match(trial.text,/试炼通过 · 20 \/ 20/); assert.ok(trial.xp-xp0>=100);
  await page.evaluate(()=>$('gBack').click());
  assert.match(await page.evaluate(()=>document.querySelector('.glist[data-l="1"]').textContent),/👑/);

  // ---------- 星际游乐场 ----------
  const ledger=()=>page.evaluate(()=>localStorage.getItem('ielts_srs'));
  // ☄️ 流星雨: a right answer scores and speeds the next one up; a landing or a wrong pick costs a life; answers reach the ledger
  await page.locator('#gmMeteor').click();
  let me=await page.evaluate(()=>({kind:gm.kind,n:$('gOpts').children.length,has:gm.opts.some(o=>o.id===gm.cur.id),dur:gm.dur,word:$('gmM').textContent===gm.cur.en,pool:gm.pool.every(v=>gStar(v).dOn||gStar(v).mOn)}));
  assert.deepEqual(me,{kind:'meteor',n:4,has:true,dur:9000,word:true,pool:true});
  const led0=await ledger(), mw=await page.evaluate(()=>gm.cur.en);
  await page.keyboard.press(String(await page.evaluate(()=>gm.opts.findIndex(o=>o.id===gm.cur.id)+1)));
  assert.deepEqual(await page.evaluate(()=>[gm.score,gm.lives,gm.xp>=2,$('gmM').classList.contains('boom')]),[1,3,true,true]);
  assert.notEqual(await ledger(),led0,'流星雨 answers are recorded');
  await page.waitForFunction(()=>gm&&!gm.locked&&gm.score===1);
  assert.equal(await page.evaluate(()=>gm.dur),8800);
  const landed=await page.evaluate(()=>{ const w=gm.cur; gMeteorHit(null); return [gm.lives,gStar(w).mDue,$('gmM').classList.contains('crash'),/超时/.test(localStorage.getItem('ielts_wrong_events')||'')]; });
  assert.deepEqual(landed,[2,true,true,true]);
  for(let i=0;i<2;i++){ await page.waitForFunction(()=>gm&&!gm.locked); await page.evaluate(()=>[...$('gOpts').children].find(b=>+b.dataset.id!==gm.cur.id).click()); }
  await page.waitForFunction(()=>gm&&gm.over);
  assert.deepEqual(await page.evaluate(()=>[G.best.meteor,/流星雨 · 1 分 · 新纪录/.test($('gPlay').innerText),/没接住的/.test($('gPlay').innerText)]),[1,true,true]);
  await page.locator('#gBack').click();

  // 🔗 连星: twelve different tiles; a mismatch adds a penalty; a full three-group game sets the record and leaves the ledger alone
  const led1=await ledger();
  await page.locator('#gmMatch').click();
  let mt=await page.evaluate(()=>{ const t=[...$('gGrid').children].map(b=>b.textContent); return {rounds:gm.rounds.length,tiles:t.length,unique:new Set(t).size,pairs:gm.rounds.flat().every(p=>p.b&&p.a===p.v.en)}; });
  assert.deepEqual(mt,{rounds:3,tiles:12,unique:12,pairs:true});
  const tap=(k,s)=>page.evaluate(([k,s])=>gMatchTap([...$('gGrid').children].find(b=>b.dataset.k==k&&b.dataset.s===s)),[k,s]);
  await tap(0,'a'); await tap(1,'b');
  assert.deepEqual(await page.evaluate(()=>[gm.miss,gm.left,document.querySelectorAll('#gGrid .no').length]),[1,6,2]);
  await page.waitForFunction(()=>gm&&!gm.busy);
  for(let r=0;r<3;r++){ for(let k=0;k<6;k++){ await tap(k,'a'); await tap(k,'b'); } await page.waitForFunction(r=>gm&&(gm.over||(gm.r===r+1&&!gm.busy)),r); }
  mt=await page.evaluate(()=>({over:gm.over,best:G.best.match.zh,text:$('gPlay').innerText,xp:gm.xp}));
  assert.ok(mt.over&&mt.best>=3&&mt.xp===18,'18 pairs, one miss, record '+mt.best); assert.match(mt.text,/连星完成/); assert.match(mt.text,/配错 1 次/);
  assert.equal(await ledger(),led1,'连星 never touches the review ledger');
  // the synonym flavour pairs each word with one of its own book synonyms
  await page.evaluate(()=>{ gm=null; gRenderHub(); gMatchStart('syn'); });
  assert.ok(await page.evaluate(()=>gm&&gm.kind==='match'&&gm.rounds.flat().every(p=>p.v.sy.includes(p.b)&&p.b!==p.a)),'synonym pairs come from the word\'s own synonyms');
  await page.evaluate(()=>gMiniExit());

  // 🧩 星尘重组: letter keys fill the word in order; a wrong tile is a miss; three misses or giving up reveals it; no ledger writes
  await page.locator('#gmAna').click();
  let an=await page.evaluate(()=>({n:gm.words.length,ok:gm.words.every(w=>/^[a-z]{4,12}$/.test(w.en)),w:gm.words[0].en,tiles:gm.tiles.map(t=>t.ch).sort().join(''),shown:$('gCard').innerText.toLowerCase().includes(gm.words[0].en)}));
  assert.deepEqual([an.n,an.ok,an.tiles,an.shown],[5,true,[...an.w].sort().join(''),false]);
  const wrongKey=await page.evaluate(()=>{ const need=gm.words[0].en[0]; const t=gm.tiles.find(t=>t.ch!==need); return t?t.ch:''; });
  if(wrongKey){ await page.keyboard.press(wrongKey); assert.deepEqual(await page.evaluate(()=>[gm.miss,gm.got]),[1,'']); }
  await page.keyboard.press('1');                                  // not a letter on the board: ignored
  for(const ch of an.w) await page.keyboard.press(ch);
  assert.deepEqual(await page.evaluate(()=>[gm.phase,gm.solved,gm.got===gm.words[0].en,/拼出来了|一次拼对/.test($('gFb').innerText)]),['done',1,true,true]);
  await page.keyboard.press('Enter');
  assert.deepEqual(await page.evaluate(()=>{ const i=gm.i; $('gGiveUp').click(); return [i,gm.phase,gm.solved,/答案是/.test($('gFb').innerText)]; }),[1,'done',1,true]);
  await page.evaluate(()=>{ for(let k=0;k<12&&gm&&!gm.over;k++){ if(gm.phase==='done'){ $('gNext').click(); continue; } for(const ch of gm.words[gm.i].en) gAnaKey(ch); } });
  an=await page.evaluate(()=>({over:gm.over,solved:gm.solved,best:G.best.ana,text:$('gPlay').innerText}));
  assert.deepEqual([an.over,an.solved,an.best>=3],[true,4,true]); assert.match(an.text,/星尘重组 · 拼出 4 \/ 5/);
  assert.equal(await ledger(),led1,'星尘重组 never touches the review ledger');
  await page.locator('#gBack').click();

  // 🔮 每日星谜: one word for the day; a wrong guess or asking costs a clue; solving pays by clues used and cannot be replayed
  await page.locator('#gmRiddle').click();
  let rd=await page.evaluate(()=>({id:G.day.riddle.id,clues:document.querySelectorAll('.gclue').length,btn:$('gGuess').textContent,leak:$('gCard').innerText.toLowerCase().includes(VOCAB[G.day.riddle.id].en)}));
  assert.deepEqual([rd.clues,rd.leak],[1,false]); assert.match(rd.btn,/\+40 XP/);
  await page.locator('#gInput').fill('zzzz'); await page.keyboard.press('Enter');
  assert.deepEqual(await page.evaluate(()=>[G.day.riddle.clues,document.querySelectorAll('.gclue').length,/不是谜底/.test($('gRMsg').textContent)]),[2,2,true]);
  await page.locator('#gMore').click();
  const rxp=await page.evaluate(()=>G.xp);
  await page.locator('#gInput').fill(await page.evaluate(()=>VOCAB[G.day.riddle.id].en)); await page.keyboard.press('Enter');
  rd=await page.evaluate(id=>({same:G.day.riddle.id===id,r:G.day.riddle,xp:G.xp,best:G.best.riddle,saved:JSON.parse(localStorage.getItem('ielts_gre_settings')).game.day.riddle.done,text:$('gCard').innerText}),rd.id);
  assert.deepEqual([rd.same,rd.r.done,rd.r.won,rd.r.clues,rd.r.xp,rd.xp-rxp,rd.best,rd.saved],[true,true,true,3,20,20,3,true]); assert.match(rd.text,/用了 3 条线索/);
  assert.equal(await ledger(),led1,'每日星谜 never touches the review ledger');
  await page.locator('#gRBack').click();
  assert.deepEqual(await page.evaluate(()=>{ const t=$('gmRiddle').textContent; $('gmRiddle').click(); return [/今天已解开/.test(t),!!$('gInput'),G.day.riddle.xp]; }),[true,false,20]);   // already solved: nothing left to guess
  await page.evaluate(()=>gMiniExit());
  await day(10);
  assert.deepEqual(await page.evaluate(()=>{ gRenderHub(); return [G.day.riddle.done,G.day.riddle.clues]; }),[false,1]);     // a new day, a new riddle
  // badges follow the records
  assert.ok(await page.evaluate(()=>['lit1','crown1','combo20'].every(b=>G.badges.includes(b))&&document.querySelectorAll('#gBadges span.on').length===G.badges.length),'badges');

  // settings: goal and group size are kept; another List can be chosen
  await page.selectOption('#gSize','5'); await page.selectOption('#gGoal','24');
  await page.locator('.glist[data-l="3"]').click();
  assert.deepEqual(await page.evaluate(()=>[G.size,G.goal,gSelList,$('gPNew').textContent]),[5,24,3,'✨ 点亮新星（5 颗）']);

  // reopening returns to the map where the learner left; leaving the tab does not
  await page.reload(); await page.waitForFunction(()=>state.mode==='game');
  assert.deepEqual(await page.evaluate(()=>[G.size,G.goal,G.crowns[1].best,!$('m-game').classList.contains('hide')]),[5,24,20,true]);
  await page.locator('.tab[data-mode="flash"]').click();
  assert.deepEqual(await page.evaluate(()=>[state.mode,$('m-game').classList.contains('hide'),$('decks').classList.contains('hide')]),['flash',true,false]);
  await page.reload(); await page.waitForTimeout(300);
  assert.notEqual(await page.evaluate(()=>state.mode),'game');

  // two copies of the game state keep the further-along part of each
  const merged=await page.evaluate(()=>gMerge({xp:50,goal:24,streak:{n:2,last:10},day:{d:10,lit:3,relit:0,missions:1,bonus:false},crowns:{1:{best:15,t:1}}},
    {xp:80,goal:16,streak:{n:5,last:11},day:{d:10,lit:5,relit:2,missions:1,bonus:true},crowns:{1:{best:18,t:2},2:{best:20,t:3}}}));
  assert.deepEqual([merged.xp,merged.goal,merged.streak,merged.day.lit,merged.day.bonus,merged.crowns[1].best,merged.crowns[2].best],[80,24,{n:5,last:11},5,true,18,20]);
  const rec=await page.evaluate(()=>gMerge({badges:['lit1'],maxStreak:2,best:{meteor:12,ana:2,riddle:3,match:{zh:50}},day:{d:5,riddle:{id:1,done:false}}},
    {badges:['crown1','lit1'],best:{meteor:9,ana:5,riddle:1,match:{zh:62.5,syn:70}},day:{d:5,riddle:{id:1,done:true,won:true}}}));
  assert.deepEqual([rec.badges.sort(),rec.best,rec.day.riddle.done,rec.maxStreak],[['crown1','lit1'],{meteor:12,ana:5,riddle:1,match:{zh:50,syn:70}},true,2]);   // high scores up, times and clue counts down

  // phone width: no sideways scrolling on the map, a question or the summary
  await page.setViewportSize({width:375,height:800});
  const fits=()=>page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1);
  await page.locator('.tab[data-mode="game"]').click(); assert.ok(await fits(),'map');
  await page.evaluate(()=>{ gStart('new',2); for(let i=0;i<gs.words.length;i++) gNext(); }); assert.ok(await fits(),'question');
  await answer(true); assert.ok(await fits(),'feedback');
  assert.ok(await finish()); assert.ok(await fits(),'summary');
  for(const [name,start] of [['meteor','gMeteorStart()'],['match','gMatchStart("zh")'],['anagram','gAnaStart()'],['riddle','gRiddleOpen()']]){
    await page.evaluate(src=>{ gs=null; gm=null; gRenderHub(); eval(src); },start); assert.ok(await fits(),name);
  }
  await page.evaluate(()=>gMiniExit());
  // ---------- 点亮方式：选择题 (a fresh learner who prefers multiple choice) ----------
  const p2=await (await browser.newContext()).newPage(); p2.on('pageerror',e=>errors.push('choice: '+e.message));
  const right2=()=>p2.evaluate(()=>[...$('gOpts').children].find(b=>+b.dataset.id===gs.cur.w.id).click());
  const wrong2=()=>p2.evaluate(()=>[...$('gOpts').children].find(b=>+b.dataset.id!==gs.cur.w.id).click());
  const finish2=()=>p2.evaluate(()=>{ let n=0; while(gs&&!gs.finished&&n++<400){ if(gs.phaseName==='study'||gs.answered){ gNext(); continue; } [...$('gOpts').children].find(b=>+b.dataset.id===gs.cur.w.id).click(); } return gs&&gs.finished; });
  const led2=()=>p2.evaluate(()=>JSON.parse(localStorage.getItem('ielts_srs')||'{}'));
  await p2.goto(base+'/gre.html'); await p2.evaluate(()=>{settings.auto=false;saveSettings();});
  await p2.locator('.tab[data-mode="game"]').click();
  assert.deepEqual(await p2.evaluate(()=>[G.light,$('gMode').querySelector('.on').dataset.v]),['spell','spell']);       // spelling stays the default
  await p2.locator('#gMode button[data-v="choice"]').click();
  assert.deepEqual(await p2.evaluate(()=>[G.light,JSON.parse(localStorage.getItem('ielts_gre_settings')).game.light,/选出它/.test($('gHub').innerText),$('gMode').querySelector('.on').dataset.v]),['choice','choice',true,'choice']);
  await p2.locator('#gGoNew').click();
  assert.deepEqual(await p2.evaluate(()=>[gs.phases,[...document.querySelectorAll('.gsteps span')].map(x=>x.textContent)]),[['study','mean','ctx','pick'],['观星','辨认','语境','点亮']]);
  await p2.evaluate(()=>{ for(let i=0;i<8;i++) gNext(); });
  const slip=await p2.evaluate(()=>gs.cur.w.en); await wrong2(); await p2.evaluate(()=>gNext());                 // one miss in 辨认
  for(let i=0;i<60;i++){ if(await p2.evaluate(()=>gs.phaseName==='pick')) break; await right2(); await p2.evaluate(()=>gNext()); }
  // clean answers in 辨认 / 语境 were practice: only the missed word has an answer so far, and no star is lit yet.
  // The eight cards shown in 观星 only leave a no-proof mark, so the words are never "new" again.
  let L2=await led2();
  assert.deepEqual([Object.keys(L2).filter(k=>L2[k].m&&L2[k].m.n>0),Object.keys(L2).length,Object.values(L2).every(r=>r.m&&(r.m.n>0||r.m.sd===1)&&!r.m.lv),await p2.evaluate(()=>gs.lit.length)],[[slip],8,true,0]);
  if(await p2.evaluate(slip=>gs.cur.w.en===slip,slip)){ await right2(); await p2.evaluate(()=>gNext()); }       // questions are shuffled: step past the word missed earlier
  // the last round is "meaning → pick the word": no typing box, the word is not shown, group-mates among the choices
  let pk=await p2.evaluate(()=>({type:gs.cur.type,input:!!$('gInput'),n:$('gOpts').children.length,leak:$('gCard').querySelector('.gprompt').innerText.toLowerCase().includes(gs.cur.w.en),
    mates:[...$('gOpts').children].filter(b=>+b.dataset.id<8).length,label:$('gCard').innerText}));
  assert.deepEqual([pk.type,pk.input,pk.n,pk.leak,pk.mates>=2],['pick',false,4,false,true]); assert.match(pk.label,/看释义选词/);
  const litWord=await p2.evaluate(()=>gs.cur.w.en); await right2();
  L2=await led2();
  assert.deepEqual([await p2.evaluate(()=>[gStar(gs.cur.w).lv,gs.lit.length,/点亮了/.test($('gFb').innerText)]),L2[litWord].m.lv,!!L2[litWord].d],[[1,1,true],1,false]);   // lit on the meaning record, no spelling record
  await p2.evaluate(()=>gNext());
  const dropped=await p2.evaluate(slip=>{ while(gs.cur.w.en===slip){ [...$('gOpts').children].find(b=>+b.dataset.id===gs.cur.w.id).click(); gNext(); } return gs.cur.w.en; },slip);
  await wrong2();
  assert.ok(await finish2());
  let c2=await p2.evaluate(([a,b])=>({lit:gs.lit.length,a:gStar(BYEN.get(a)).s,b:gStar(BYEN.get(b)).s,text:$('gPlay').innerText,sky:gSky().lit}),[slip,dropped]);
  assert.deepEqual([c2.lit,c2.a,c2.b,c2.sky],[6,'glim','glim',6]); assert.match(c2.text,/独立答对/); assert.doesNotMatch(c2.text,/拼对/);
  // next day: the six lit stars dim; rekindling, relighting and the trial are multiple choice only
  await p2.evaluate(()=>{ IELTSReview.clock=()=>Date.now()+864e5; gs=null; gRenderHub(); });
  assert.deepEqual(await p2.evaluate(()=>[gSky().due,gSky().glim]),[6,2]);
  await p2.locator('#gGoRek').click();
  assert.deepEqual(await p2.evaluate(()=>[gs.queue.length,gs.queue.some(t=>t.type==='spell')]),[6,false]);
  assert.ok(await finish2());
  assert.equal(await p2.evaluate(()=>gs.words.map(w=>gStar(w).lv).join('')),'222222');
  await p2.evaluate(()=>{ gs=null; gStart('glim'); });
  assert.deepEqual(await p2.evaluate(()=>gs.phases),['study','mean','ctx','pick']);
  assert.ok(await finish2());
  assert.deepEqual(await p2.evaluate(()=>[gs.lit.length,gSky().glim]),[2,0]);
  assert.deepEqual(await p2.evaluate(()=>{ gs=null; gStart('trial',1); const t=gs.queue.map(x=>x.type); gExit(); return [t.length,t.includes('spell'),t.includes('pick')]; }),[20,false,true]);
  // the daily riddle offers words to pick from; a wrong pick is struck out and costs a clue
  await p2.locator('#gmRiddle').click();
  let r2=await p2.evaluate(()=>({input:!!$('gInput'),n:$('gROpts').children.length,has:[...$('gROpts').children].some(b=>+b.dataset.id===G.day.riddle.id)}));
  assert.deepEqual([r2.input,r2.n>=4,r2.has],[false,true,true]);
  await p2.evaluate(()=>[...$('gROpts').children].find(b=>+b.dataset.id!==G.day.riddle.id).click());
  assert.deepEqual(await p2.evaluate(()=>[G.day.riddle.clues,[...$('gROpts').children].filter(b=>b.disabled).length,$('gROpts').children.length]),[2,1,r2.n]);
  await p2.evaluate(()=>[...$('gROpts').children].find(b=>+b.dataset.id===G.day.riddle.id).click());
  assert.deepEqual(await p2.evaluate(()=>[G.day.riddle.done,G.day.riddle.won,G.day.riddle.xp]),[true,true,30]);
  await p2.evaluate(()=>gMiniExit());
  // switching back to 拼写: the stricter standard — nothing has been spelled yet, so the same words are only 微光;
  // they are relit by spelling, and never served again as brand-new words
  await p2.locator('#gMode button[data-v="spell"]').click();
  assert.deepEqual(await p2.evaluate(()=>{ const sky=gSky(); gStart('new',1); const ids=gs.words.map(w=>w.id); gExit(); gRunClear(); return [sky.lit,sky.per[1].glim,ids]; }),[0,8,[8,9,10,11,12,13,14,15]]);
  assert.equal(await p2.evaluate(()=>{ gStart('glim',1); const n=gs.words.length; gExit(); return n; }),8);       // and they can be relit by spelling
  await p2.close();

  // ---------- home page card and resuming an interrupted mission (a fresh learner) ----------
  const p3=await (await browser.newContext()).newPage(); p3.on('pageerror',e=>errors.push('resume: '+e.message));
  const starCard=()=>p3.evaluate(()=>{ const c=document.getElementById('starTile'); return c&&{text:c.querySelector('.stats').innerText.replace(/\n/g,' | '),href:c.getAttribute('href'),hot:c.classList.contains('hot'),
    module:c.closest('.mod').dataset.mod,next:c.nextElementSibling&&c.nextElementSibling.querySelector('.t-name').textContent}; });
  await p3.goto(base+'/index.html');
  assert.deepEqual(await starCard(),{text:'还没开始 · 点亮你的第一颗星',href:'gre.html#game',hot:true,module:'gre',next:'GRE 核心词汇'});
  await p3.evaluate(()=>document.getElementById('starTile').click());
  await p3.waitForFunction(()=>typeof state!=='undefined'&&state.mode==='game');
  // the Mac app drops "#game" from local links: the card's one-time note opens the map instead, and is used up
  assert.equal(await p3.evaluate(()=>localStorage.getItem('ielts_gre_open')),null);
  await p3.evaluate(()=>{ enterMode('flash'); localStorage.setItem('ielts_gre_open','game'); });
  await p3.goto(base+'/gre.html'); await p3.waitForFunction(()=>typeof state!=='undefined'&&state.mode==='game');
  assert.equal(await p3.evaluate(()=>localStorage.getItem('ielts_gre_open')),null);
  // the GRE tile's mode chips open that tab directly; the Mac app drops "#quiz", so the one-time note does it there
  await p3.goto(base+'/index.html'); await p3.evaluate(()=>document.querySelector('#mod-gre .chip[data-mode="quiz"]').click());
  await p3.waitForFunction(()=>typeof state!=='undefined'&&state.mode==='quiz');
  await p3.evaluate(()=>localStorage.setItem('ielts_gre_open','cloze')); await p3.goto(base+'/gre.html'); await p3.waitForFunction(()=>typeof state!=='undefined'&&state.mode==='cloze');
  await p3.evaluate(()=>{ enterMode('flash'); localStorage.setItem('ielts_gre_open','nope"]'); }); await p3.goto(base+'/gre.html'); await p3.waitForTimeout(300);
  assert.deepEqual(await p3.evaluate(()=>[state.mode,localStorage.getItem('ielts_gre_open')]),['flash',null]);
  await p3.evaluate(()=>enterMode('flash')); await p3.reload(); await p3.waitForTimeout(300);
  assert.equal(await p3.evaluate(()=>state.mode),'flash');
  await p3.evaluate(()=>enterMode('game'));
  await p3.evaluate(()=>{settings.auto=false;saveSettings();});
  const pick3=()=>p3.evaluate(()=>[...$('gOpts').children].find(b=>+b.dataset.id===gs.cur.w.id).click());
  await p3.locator('#gGoNew').click();
  await p3.evaluate(()=>{ for(let i=0;i<8;i++) gNext(); });
  for(let i=0;i<3;i++){ await pick3(); await p3.evaluate(()=>gNext()); }
  await pick3();                                                    // answered, not yet moved on
  const was=await p3.evaluate(()=>({qi:gs.qi,next:gs.queue[gs.qi+1].w.id,xp:gs.xp,combo:gs.combo,words:gs.words.map(w=>w.id)}));
  await p3.reload(); await p3.waitForFunction(()=>typeof state!=='undefined'&&state.mode==='game');
  let rb=await p3.evaluate(()=>({banner:$('gHub').querySelector('.grun')&&$('gHub').querySelector('.grun').innerText,newPrimary:$('gGoNew').classList.contains('primary')||$('gGoBlitz').classList.contains('primary'),run:!!G.run}));
  assert.ok(rb.run&&/点亮新星 · List 1 · 辨认 4\/8/.test(rb.banner)&&!rb.newPrimary,'banner: '+rb.banner);
  await p3.locator('#gRunGo').click();
  assert.deepEqual(await p3.evaluate(()=>({qi:gs.qi,cur:gs.cur.w.id,xp:gs.xp,combo:gs.combo,words:gs.words.map(w=>w.id),phase:gs.phaseName,answered:gs.answered})),
    {qi:was.qi+1,cur:was.next,xp:was.xp,combo:was.combo,words:was.words,phase:'mean',answered:false});     // the answered question is not asked again
  // closed before answering: the same question comes back
  const q3=await p3.evaluate(()=>gs.cur.w.id);
  await p3.reload(); await p3.waitForFunction(()=>typeof state!=='undefined'&&state.mode==='game');
  await p3.locator('#gRunGo').click();
  assert.equal(await p3.evaluate(()=>gs.cur.w.id),q3);
  // a 语境 question comes back with the same sentence
  await p3.evaluate(()=>{ while(gs.phaseName!=='ctx'){ if(gs.answered){gNext();continue;} [...$('gOpts').children].find(b=>+b.dataset.id===gs.cur.w.id).click(); } });
  const sent=await p3.evaluate(()=>gs.cur.type==='ctx'?gs.cur.c.en:'');
  await p3.reload(); await p3.waitForFunction(()=>typeof state!=='undefined'&&state.mode==='game');
  await p3.locator('#gRunGo').click();
  if(sent) assert.equal(await p3.evaluate(()=>gs.cur.c&&gs.cur.c.en),sent);
  // leaving with ✕ keeps it; finishing clears it
  await p3.evaluate(()=>gExit());
  assert.ok(await p3.evaluate(()=>!!$('gHub').querySelector('.grun')));
  await p3.locator('#gRunGo').click();
  await p3.evaluate(()=>{ let n=0; while(gs&&!gs.finished&&n++<200){ if(gs.answered){gNext();continue;} const t=gs.cur; if(t.type==='spell'){ $('gInput').value=t.w.en; gSubmit(); } else [...$('gOpts').children].find(b=>+b.dataset.id===t.w.id).click(); } });
  assert.deepEqual(await p3.evaluate(()=>[gs.finished,!!G.run,gs.lit.length]),[true,false,8]);
  await p3.evaluate(()=>$('gBack').click());
  assert.equal(await p3.evaluate(()=>!!$('gHub').querySelector('.grun')),false);
  // 放弃 drops it; a run from another day is not offered
  await p3.evaluate(()=>{ gStart('new',1); for(let i=0;i<3;i++) gNext(); gExit(); });
  await p3.locator('#gRunDrop').click();
  assert.deepEqual(await p3.evaluate(()=>[!!G.run,!!$('gHub').querySelector('.grun')]),[false,false]);
  await p3.evaluate(()=>{ gStart('new',1); gExit(); G.run.d=gToday()-1; gRenderHub(); });
  assert.deepEqual(await p3.evaluate(()=>[!!G.run,!!$('gHub').querySelector('.grun')]),[false,false]);
  // the home card follows the stars: lit and kept today; dimmed tomorrow with the streak at risk; streak gone after a missed day
  await p3.goto(base+'/index.html');
  assert.deepEqual(await starCard().then(c=>[c.text,c.hot]),['已点亮 8 颗 · 没有变暗的星 · 今日 8 / 16 | 🔥 连续 1 天 · 今天已续',false]);
  await p3.evaluate(()=>{ IELTSReview.clock=()=>Date.now()+864e5; renderCards(); });
  assert.deepEqual(await starCard().then(c=>[c.text,c.hot]),['8 颗星变暗，等你重燃 · 今日 0 / 16 | 🔥 连续 1 天 · 今天还没续',true]);
  await p3.evaluate(()=>{ IELTSReview.clock=()=>Date.now()+3*864e5; renderCards(); });
  assert.match((await starCard()).text,/^8 颗星变暗，等你重燃 · 今日 0 \/ 16 \| Lv\.\d+$/);
  await p3.close();

  // ---------- 备考计划: exam date → days left and the daily pace that covers the book before the last week ----------
  const p4=await (await browser.newContext()).newPage(); p4.on('pageerror',e=>errors.push('plan: '+e.message));
  await p4.goto(base+'/gre.html'); await p4.evaluate(()=>{settings.auto=false;saveSettings();enterMode('game');});
  const ymd=n=>p4.evaluate(n=>{ const d=new Date(Date.now()+n*864e5); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); },n);
  const planText=()=>p4.evaluate(()=>$('gHub').querySelector('.gplan').innerText.replace(/\n/g,' | '));
  assert.match(await planText(),/设好 GRE 考试日期/);
  const setExam=async n=>{ const v=await ymd(n); await p4.evaluate(()=>{ if($('gExamBox').classList.contains('hide')) $('gExamEdit').click(); }); await p4.locator('#gExam').fill(v); await p4.locator('#gExamSet').click(); return v; };
  const ex=await setExam(37);
  let pt=await planText();
  assert.match(pt,/距 GRE 考试 37 天/); assert.match(pt,/还有 2902 颗星没观测/); assert.match(pt,/每天要点亮 97 颗/);   // ceil(2902 / 30)
  assert.match(pt,/按现在每天 16 颗，考前只能再点亮约 480 颗/);
  await p4.locator('#gPlanGoal').click();
  assert.deepEqual(await p4.evaluate(()=>[G.goal,$('gGoal').value,document.querySelectorAll('.gq')[1].innerText.includes('0 / 97'),!$('gPlanGoal'),$('gHub').querySelector('.gplan').classList.contains('hot')]),[97,'97',true,true,false]);
  // kept across a reload, and the home card counts down
  await p4.reload(); await p4.waitForFunction(()=>typeof state!=='undefined'&&state.mode==='game');
  assert.deepEqual(await p4.evaluate(()=>[G.exam,G.goal]),[ex,97]);
  await p4.goto(base+'/index.html');
  await p4.waitForFunction(()=>/📅 距 GRE 考试 37 天/.test(document.getElementById('hero').innerText),null,{timeout:3000});   // numbers count up on first paint
  // with an exam date the banner is 今日计划: 点亮新星 starts ⚡ 极速点亮 straight away (the Mac app drops "#game": the one-time note carries it)
  assert.deepEqual(await p4.evaluate(()=>[...document.querySelectorAll('#hero .prow')].map(r=>r.dataset.plan+':'+r.querySelector('.pgo').textContent)),
    ['review:查看','light:⚡ 极速点亮','rekindle:⚡ 极速重燃','quant:学新词 →']);
  assert.match(await p4.locator('#hero [data-plan="light"]').innerText(),/0 \/ 97 颗/);
  await p4.locator('#hero [data-plan="light"] .pgo').click();
  await p4.waitForFunction(()=>typeof gs!=='undefined'&&gs&&gs.kind==='blitz'&&!gs.finished);
  assert.equal(await p4.evaluate(()=>localStorage.getItem('ielts_gre_open')),null);
  await p4.evaluate(()=>{ gExit(); if($('gRunDrop')) $('gRunDrop').click(); });
  // only hub buttons on the list can be pressed this way
  await p4.evaluate(()=>localStorage.setItem('ielts_gre_open','game:gExamClear')); await p4.goto(base+'/gre.html');
  await p4.waitForFunction(()=>typeof state!=='undefined'&&state.mode==='game'); await p4.waitForTimeout(200);
  assert.deepEqual(await p4.evaluate(()=>[G.exam,!!gs]),[ex,false]);
  await p4.goto(base+'/gre.html'); await p4.waitForFunction(()=>typeof state!=='undefined'&&state.mode==='game');
  // the last week: no new stars on the bright button, reviews only
  await setExam(5);
  pt=await planText();
  assert.match(pt,/冲刺周/); assert.equal(await p4.evaluate(()=>$('gGoNew').classList.contains('primary')||$('gGoBlitz').classList.contains('primary')),false);
  // a date in the past, then cleared
  await setExam(-2);
  assert.match(await planText(),/已过/);
  await p4.evaluate(()=>{ $('gExamEdit').click(); $('gExamClear').click(); });
  assert.deepEqual(await p4.evaluate(()=>[G.exam===undefined,/设好 GRE 考试日期/.test($('gHub').querySelector('.gplan').innerText)]),[true,true]);
  // a bad saved goal or date falls back safely
  assert.deepEqual(await p4.evaluate(()=>{ const x=gMerge({goal:'abc',exam:'27/12'},null); return [x.goal,'exam' in x]; }),[16,false]);
  await p4.close();

  // ---------- ⚡ 极速点亮: sift → learn in small groups (practice) → one lighting round; 微光速点 lights a glimmer in one answer ----------
  const p5=await (await browser.newContext()).newPage(); p5.on('pageerror',e=>errors.push('blitz: '+e.message));
  await p5.goto(base+'/gre.html'); await p5.evaluate(()=>{settings.auto=false;settings.game.sound=false;G.sound=false;saveSettings();enterMode('game');});
  assert.deepEqual(await p5.evaluate(()=>[$('gGoBlitz').textContent,$('gGoBlitz').classList.contains('primary'),!!$('gGoSpark')]),['⚡ 极速点亮 25 颗新星 · List 1 起',true,false]);
  await p5.evaluate(()=>{ G.wave=10; gSave(true); gRenderHub(); $('gGoBlitz').click(); });
  st=await p5.evaluate(()=>({kind:gs.kind,words:gs.words.map(w=>w.id),phase:gs.phaseName,steps:[...document.querySelectorAll('.gsteps span')].map(s=>s.textContent),skip:!!$('gSkip'),opts:$('gOpts').children.length}));
  assert.deepEqual(st,{kind:'blitz',words:[0,1,2,3,4,5,6,7,8,9],phase:'sift',steps:['速筛','速记','点亮'],skip:true,opts:4});
  // 速筛: the first four are "known" (picked right), word 4 is picked wrong, the rest are skipped — nothing reaches the review record
  const known=new Set([0,1,2,3]);
  for(let i=0;i<10;i++) await p5.evaluate(known=>{ const t=gs.cur, id=t.w.id;
    if(known.includes(id)) [...$('gOpts').children].find(b=>+b.dataset.id===id).click();
    else if(id===4) [...$('gOpts').children].find(b=>+b.dataset.id!==id).click();
    else $('gSkip').click();
    if(gs.answered) gNext(); },[...known]);
  let bz=await p5.evaluate(()=>({phase:gs.phases[gs.pi],learn:gs.learn.map(w=>w.id),known:gs.known.length,rec:VOCAB.slice(0,10).filter(v=>RV.info(v.en,'d').stage!=='new'||RV.info(v.en,'m').stage!=='new').length,
    wrong:(JSON.parse(localStorage.getItem('ielts_wrong_events')||'[]')).length,card:$('gCard').innerText,total:gs.total}));
  assert.deepEqual([bz.phase,bz.learn,bz.known,bz.rec,bz.wrong,bz.total],['learn',[4,5,6,7,8,9],4,5,0,10+12+3+10]);     // no answers recorded; the 4 known words and the first card shown carry a no-proof mark
  assert.match(bz.card,/速记 1 \/ 3 · 第 1 \/ 2 组/);
  // 速记: two groups of three; each group's cards, then its questions at once; a miss here comes back and is not recorded
  for(let g=0;g<2;g++){
    for(let i=0;i<3;i++){ assert.equal(await p5.evaluate(()=>gs.phaseName),'study'); await p5.keyboard.press('Enter'); }
    assert.equal(await p5.evaluate(()=>gs.phaseName),'mean');
    if(g===0){ await p5.evaluate(()=>{ const t=gs.cur; [...$('gOpts').children].find(b=>+b.dataset.id!==t.w.id).click(); }); assert.match(await p5.evaluate(()=>$('gFb').innerText),/练习，不记错/); await p5.evaluate(()=>gNext()); }
    let n=0; while(await p5.evaluate(()=>gs.phases[gs.pi]==='learn'&&gs.phaseName==='mean')&&n++<10){ await p5.evaluate(()=>{ const t=gs.cur; [...$('gOpts').children].find(b=>+b.dataset.id===t.w.id).click(); gNext(); }); }
    if(g===1){      // 滚雪球: after the second group's quiz, the first group comes back once, in sentences where the book has one — still practice
      const rv=await p5.evaluate(()=>({ph:gs.phaseName,ids:gs.queue.map(t=>t.w.id).sort((a,b)=>a-b),types:[...new Set(gs.queue.map(t=>t.type))].every(x=>['ctx','def','mean'].includes(x)),label:$('gCard').innerText}));
      assert.deepEqual([rv.ph,rv.ids,rv.types],['rev',[4,5,6],true]); assert.match(rv.label,/回顾上一组/);
      n=0; while(await p5.evaluate(()=>gs.phaseName==='rev')&&n++<10){ await p5.evaluate(()=>{ const t=gs.cur; [...$('gOpts').children].find(b=>+b.dataset.id===t.w.id).click(); gNext(); }); }
    }
  }
  bz=await p5.evaluate(()=>({phase:gs.phaseName,n:gs.queue.length,type:gs.cur.type,rec:VOCAB.slice(0,10).filter(v=>RV.info(v.en,'d').stage!=='new'||RV.info(v.en,'m').stage!=='new').length,
    last:gs.queue.slice(-3).map(t=>t.w.id).sort((a,b)=>a-b)}));
  assert.deepEqual(bz,{phase:'spell',n:10,type:'spell',rec:10,last:[7,8,9]});      // all ten met (marked), none lit yet     // the group studied last is asked last
  // 点亮: all right except one — nine lit, one glimmer
  for(let i=0;i<10;i++){ const miss=await p5.evaluate(()=>gs.cur.w.id===9); await p5.evaluate(miss=>{ const t=gs.cur; $('gInput').value=miss?'zzzz':t.w.en; gSubmit(); },miss);
    await p5.evaluate(()=>gNext()); }
  await p5.evaluate(()=>{ const t=gs.cur; $('gInput').value=t.w.en; gSubmit(); gNext(); });       // the retried miss: right, but only 微光 today
  sum=await p5.evaluate(()=>({text:$('gPlay').innerText,lit:VOCAB.slice(0,10).filter(v=>gStar(v).lv>=1).length,glim:gStar(VOCAB[9]).s,day:G.day.lit,bz:!!G.day.bz&&G.day.bz.lit,again:$('gAgain').textContent}));
  assert.deepEqual([sum.lit,sum.glim,sum.day,sum.bz,sum.again],[9,'glim',9,9,'⚡ 再冲一波（10 颗）']);
  assert.match(sum.text,/这一波点亮了 9 \/ 10 颗新星/); assert.match(sum.text,/用时/); assert.match(sum.text,/速筛时已经认识 4 颗，速记了 6 颗/); assert.match(sum.text,/微光速点/);
  await p5.evaluate(()=>{ $('gBack').click(); });
  assert.match(await p5.evaluate(()=>$('gHub').querySelector('.gblitz').innerText),/今天用极速点亮了 9 颗/);
  // the next day the glimmer can be lit with one clean answer: 微光速点
  await p5.evaluate(()=>{IELTSReview.clock=()=>Date.now()+864e5;}); await p5.evaluate(()=>gRenderHub());
  assert.equal(await p5.evaluate(()=>$('gGoSpark')&&$('gGoSpark').textContent),'⚡ 微光速点 1 颗 · 答对一题就点亮');
  await p5.evaluate(()=>$('gGoSpark').click());
  assert.deepEqual(await p5.evaluate(()=>[gs.kind,gs.phases,gs.words.map(w=>w.id)]),['spark',['spell'],[9]]);
  await p5.evaluate(()=>{ $('gInput').value=gs.cur.w.en; gSubmit(); gNext(); });
  assert.deepEqual(await p5.evaluate(()=>[gStar(VOCAB[9]).lv,/点亮了 1 \/ 1 颗/.test($('gPlay').innerText)]),[1,true]);
  // ⚡ 极速重燃: the stars lit yesterday have faded; one question each, a clean answer moves on by itself
  await p5.evaluate(()=>{ $('gBack').click(); });
  assert.deepEqual(await p5.evaluate(()=>[$('gGoRekFast').textContent,$('gGoRekFast').classList.contains('primary'),$('gGoBlitz').classList.contains('primary')]),['⚡ 极速重燃 9 颗 · 一星一题',true,false]);
  await p5.evaluate(()=>$('gGoRekFast').click());
  assert.deepEqual(await p5.evaluate(()=>[gs.kind,gs.fast,gs.words.length,gs.queue.length,gs.queue.every(t=>t.type==='spell')]),['rekindle',true,9,9,true]);
  await p5.evaluate(()=>{ $('gInput').value=gs.cur.w.en; gSubmit(); });
  await p5.waitForFunction(()=>gs.qi===1&&!gs.answered,null,{timeout:4000});        // moved on without a click
  await p5.evaluate(()=>{ let n=0; while(!gs.finished&&n++<40){ if(!gs.answered){ $('gInput').value=gs.cur.w.en; gSubmit(); } gNext(); } });
  sum=await p5.evaluate(()=>({text:$('gPlay').innerText,rw:G.day.rw,up:VOCAB.slice(0,9).filter(v=>gStar(v).lv>=2).length}));
  assert.match(sum.text,/⚡ 极速重燃完成 · 一次答对 9 \/ 9/); assert.deepEqual([sum.rw,sum.up],[9,9]);
  // with an exam date the rekindle goal keeps pace with the daily new-star goal
  assert.deepEqual(await p5.evaluate(()=>{ const a=gRekGoal(); G.exam='2099-01-01'; G.goal=139; const b=gRekGoal(); G.goal=16; const c=gRekGoal(); delete G.exam; return [a,b,c]; }),[30,139,30]);

  // a group left unfinished by the old version (cards shown, nothing recorded) is marked when it is dropped — its words come back as 微光, not as new
  const old=await p5.evaluate(()=>{ const fresh=VOCAB.filter(v=>!gStar(v).met).slice(0,3).map(v=>v.id);
    G.run={d:gToday()-1,kind:'new',list:VOCAB[fresh[0]].l,choice:false,words:fresh,phases:['study','mean','ctx','spell'],pi:1,phase:'mean',queue:[],qi:0,si:2,answered:false,n:{},lit:[],up:[],dimmed:[],missed:[]};
    gRenderHub(); return {fresh,run:!!G.run,met:fresh.map(id=>gStar(VOCAB[id]).s),next:VOCAB.filter(v=>!gStar(v).met)[0].id}; });
  assert.deepEqual([old.run,old.met,old.next>old.fresh[2]],[false,['glim','glim','glim'],true]);
  // look-alike words already met are shown on the card of a new one
  assert.deepEqual(await p5.evaluate(()=>[['discriminatory','discriminating'],['credit','discredit'],['settled','unsettle'],['explicate','explicable'],['commend','commence'],['form','inform'],['intimate','timid'],['come about','come']].map(([a,b])=>gLooksLike(a,b))),
    [true,true,true,true,false,false,false,false]);
  const kin=await p5.evaluate(()=>{ const w=BYEN.get('formulate'); gs=null; gMiniStop(); gm=null;
    gStart('new',w.l); gs.words=[w]; gs.si=0; gStudy(); const t=$('gCard').querySelector('.gkin'); const r=[gKin(w).map(v=>v.en),t&&t.innerText]; gExit(); gRunClear(); return r; });
  assert.deepEqual(kin[0],['formulaic']); assert.match(kin[1],/形近词，别混[\s\S]*formulaic/);

  // a 50-word wave: ten groups of five, nine 回顾 rounds, every word lit, the progress bar ends exactly full; the button then estimates the time
  const big=await p5.evaluate(()=>{ gRunClear(); G.wave=50; gSave(true); gRenderHub(); $('gGoBlitz').click();
    const ids=gs.words.map(w=>w.id); let revs=0, n=0, last='';
    while(!gs.finished&&n++<1000){
      if(gs.phaseName==='study'||gs.answered){ gNext(); continue; }
      if(gs.phaseName==='sift'){ $('gSkip').click(); continue; }
      if(gs.phaseName==='rev'&&last!=='rev') revs++; last=gs.phaseName;
      const t=gs.cur; if(t.type==='spell'){ $('gInput').value=t.w.en; gSubmit(); } else [...$('gOpts').children].find(b=>+b.dataset.id===t.w.id).click();
    }
    const r={n:ids.length,chunks:gChunks(gs.learn.length),revs,lit:gs.lit.length,done:gs.done,total:gs.total,text:$('gPlay').innerText};
    $('gBack').click(); r.btn=$('gGoBlitz').textContent; r.per=G.bzPer>0; return r; });
  assert.deepEqual([big.n,big.chunks,big.revs,big.lit,big.done===big.total,big.per],[50,{k:10,size:5},9,50,true,true]);
  assert.match(big.text,/这一波点亮了 50 \/ 50 颗新星/); assert.match(big.btn,/⚡ 极速点亮 50 颗新星 · List \d+ 起 · 约 \d+ 分钟/);
  await p5.evaluate(()=>{ G.wave=10; gSave(true); });

  // 🎧 听词回想: today's words, spoken with a pause to recall; pausing stops it; nothing is recorded unless the misses are sent to review
  await p5.evaluate(()=>{ gs=null; gm=null; gRenderHub(); });
  assert.equal(await p5.evaluate(()=>$('gmListen').disabled),false);
  const lp=await p5.evaluate(()=>{ $('gmListen').click(); return {stage:gm.stage,src:gm.src,chips:[...$('gLSrc').children].map(b=>b.dataset.k+':'+b.querySelector('b').textContent+(b.disabled?'-':'')),today:gListenPool('today').length}; });
  assert.equal(lp.stage,'pick'); assert.equal(lp.src,'today'); assert.ok(lp.today>0,'words touched today');
  const before2=await p5.evaluate(()=>JSON.stringify(JSON.parse(localStorage.getItem('ielts_srs')||'{}')));
  await p5.evaluate(()=>{ window.gTalk=()=>Promise.resolve(); window.gListenWait=()=>new Promise(r=>{ gm.timer=setTimeout(r,25); });
    $('gLGo').click(); window._lw=gm.words[0]; $('gLMiss').click(); });
  assert.equal(await p5.evaluate(()=>[...gm.miss][0]===_lw.id&&/已记下/.test($('gLMiss').textContent)),true);
  await p5.evaluate(()=>gListenToggle());
  const at=await p5.evaluate(()=>gm.i); await p5.waitForTimeout(250);
  assert.deepEqual(await p5.evaluate(()=>[gm.paused,gm.i,/继续/.test($('gLPause').textContent)]),[true,at,true]);
  await p5.evaluate(()=>gListenToggle());
  await p5.waitForFunction(()=>gm&&gm.stage==='end',null,{timeout:20000});
  const le=await p5.evaluate(b=>({text:$('gPlay').innerText,same:JSON.stringify(JSON.parse(localStorage.getItem('ielts_srs')||'{}'))===b,flag:!!$('gLFlag')}),before2);
  assert.match(le.text,/听完了 \d+ 个词/); assert.match(le.text,/1 个没想起来/); assert.deepEqual([le.same,le.flag],[true,true]);
  assert.equal(await p5.evaluate(()=>{ $('gLFlag').click(); return RV.info(_lw.en,G.light==='choice'?'m':'d').isDue&&$('gLFlag').disabled; }),true);
  await p5.evaluate(()=>{ $('gBack').click(); });

  // 🎧 a speech timer left over from a session that was closed cannot drive the next one
  const race=await p5.evaluate(async()=>{ gs=null; gm=null; gRenderHub();
    let release, calls=0; window.gTalk=()=>{ calls++; return new Promise(r=>{ release=r; }); }; window.gListenWait=()=>new Promise(r=>{ gm.timer=setTimeout(r,5); });
    $('gmListen').click(); $('gLGo').click(); const old=release;          // session 1 is waiting on speech
    gMiniExit(); $('gmListen').click(); $('gLGo').click();                   // closed, and session 2 started (also waiting on speech)
    const c=calls; old(); await new Promise(r=>setTimeout(r,150));          // session 1's speech "ends" late
    const r=calls-c; gMiniExit(); return r; });
  assert.equal(race,0,'the old session must not speak again');

  // an interrupted 极速 run resumes inside 速记 with the same group
  await p5.evaluate(()=>{ if($('gBack')) $('gBack').click(); else gRenderHub(); $('gGoBlitz').click(); });
  for(let i=0;i<10;i++) await p5.evaluate(()=>{ $('gSkip').click(); });
  await p5.keyboard.press('Enter');
  const before=await p5.evaluate(()=>({sw:gs.sw.map(w=>w.id),si:gs.si,label:(gExit(),$('gHub').querySelector('.grun').innerText)}));
  assert.match(before.label,/极速点亮 · 速记 2\/5/);
  await p5.evaluate(()=>$('gRunGo').click());
  assert.deepEqual(await p5.evaluate(()=>({sw:gs.sw.map(w=>w.id),si:gs.si,ph:gs.phaseName,learn:gs.learn.length})),{sw:before.sw,si:1,ph:'study',learn:10});
  await p5.close();

  // ---------- on a phone: the page header steps aside during a mission; a typed answer never auto-advances (iOS would drop the keyboard) ----------
  const p6=await (await browser.newContext({viewport:{width:375,height:812},isMobile:true,hasTouch:true})).newPage(); p6.on('pageerror',e=>errors.push('phone: '+e.message));
  await p6.goto(base+'/gre.html'); await p6.evaluate(()=>{settings.auto=false;saveSettings();G.sound=false;enterMode('game');});
  assert.deepEqual(await p6.evaluate(()=>[G_TOUCH,getComputedStyle(document.querySelector('header')).display!=='none']),[true,true]);
  // with words already met, the choices are group-mates or met words — never a List word that has not been taught yet
  const optsMet=await p6.evaluate(()=>{ const answer=()=>{ const t=gs.cur; if(t.type==='spell'){ $('gInput').value=t.w.en; gSubmit(); } else [...$('gOpts').children].find(b=>+b.dataset.id===t.w.id).click(); };
    gStart('new',1); let n=0; while(!gs.finished&&n++<200){ if(gs.phaseName==='study'||gs.answered) gNext(); else answer(); }      // the first eight are met now
    gs=null; gStart('new',1); for(let i=0;i<gs.words.length;i++) gNext();
    const bad=[]; let q=0;
    while(gs.phaseName!=='spell'&&q++<40){ if(gs.answered){ gNext(); continue; }
      [...$('gOpts').children].forEach(b=>{ const v=VOCAB[+b.dataset.id]; if(!gs.words.includes(v)&&!gStar(v).met) bad.push(v.en); }); answer(); }
    gExit(); gRunClear(); return [bad,q]; });
  assert.deepEqual(optsMet[0],[]); assert.ok(optsMet[1]>=16,'checked both 辨认 and 语境');
  // a study card never needs scrolling to reach its button (it is pinned to the bottom), and leaves the dictionary links to the word's detail
  const card=await p6.evaluate(()=>{ gStart('new',1); const out=[]; for(let i=0;i<gs.words.length;i++){ window.scrollTo(0,0); out.push($('gNext').getBoundingClientRect().bottom<=innerHeight&&!/Merriam-Webster/.test($('gCard').innerText)); gNext(); } gExit(); gRunClear(); return out; });
  assert.ok(card.length>=5&&card.every(Boolean),'study cards: '+card);
  await p6.evaluate(()=>{ G.wave=10; gSave(true); gRenderHub(); $('gGoBlitz').click(); });
  assert.deepEqual(await p6.evaluate(()=>[getComputedStyle(document.querySelector('header')).display,getComputedStyle($('tabs')).display,getComputedStyle(document.querySelector('.practice-actions')).display,document.documentElement.scrollWidth<=375,$('gCard').getBoundingClientRect().width>=330,getComputedStyle(document.body).display]),['none','none','none',true,true,'block']);
  await p6.evaluate(()=>{ for(let i=0;i<10;i++){ const t=gs.cur; [...$('gOpts').children].find(b=>+b.dataset.id===t.w.id).click(); gNext(); } });     // all known: straight to 点亮
  assert.equal(await p6.evaluate(()=>gs.cur.type),'spell');
  await p6.evaluate(()=>{ $('gInput').value=gs.cur.w.en; gSubmit(); });
  await p6.waitForTimeout(1600);
  assert.deepEqual(await p6.evaluate(()=>[gs.qi,gs.answered]),[0,true]);      // waits for the keyboard's "go" (Enter)
  await p6.evaluate(()=>{ gExit(); });
  assert.equal(await p6.evaluate(()=>getComputedStyle(document.querySelector('header')).display!=='none'),true);
  await p6.close();

  assert.deepEqual(errors,[]);
  console.log('PASS: 星图 tab matches its neighbours; untouched sky; prompts hide the word; four rounds with group-mates as choices; misses return, are logged and reset the combo; only a clean typed answer lights a star; next-day dimming, rekindle order, brightening and demotion; streak; trial fail and crown; settings, reopen, state merge; 流星雨 scoring, speed-up, lives and ledger writes; 连星 pairs, penalty and record; 星尘重组 keys and misses; 每日星谜 clue ladder, once a day; badges; phone width; 选择题 mode: last round picks the word, stars follow the meaning record, no typing in rekindle, trial or riddle, switching back is stricter; fading lit stars vs glimmers, 重新点亮微光 re-teaches with 观星 first; rekindle capped near 24 questions; an interrupted mission resumes at the right question (answered or not, same sentence), ✕ keeps it, finishing/放弃/a new day drops it; home 星图 card: first-time prompt, lit/dimmed, streak status, opens the map; 备考计划: countdown, pace for the book, one-tap goal, sprint week, past/cleared dates, home countdown; ⚡ 极速点亮: sift without records, practice groups, last-studied asked last, one lighting round, pace note, 微光速点 next day, resume inside 速记; 极速重燃 one question per star with auto-advance, rekindle goal keeps pace with the exam plan; a card once shown never comes back as new (also for old unfinished groups and meaning-only words in 拼写 mode); look-alike words already met are named on the card; 50-word waves with 滚雪球 回顾 of the previous group and a time estimate; no word in two Lists; choices are group-mates or met words; phone: focus mode, no auto-advance after typing; 🎧 听词回想 sources, pause, misses to review only on request; study-card button pinned on phones.');
 }finally{ if(browser) await browser.close(); server.close(); }
})().catch(e=>{console.error(e);process.exit(1);});
