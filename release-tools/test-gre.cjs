// GRE 核心词汇 page. Run with Playwright on NODE_PATH; isolated browser, synthetic data.
const {chromium}=require('playwright');
const http=require('node:http'), fs=require('node:fs'), path=require('node:path');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../src');

// ---- data file ----
const text=fs.readFileSync(path.join(root,'gre.js'),'utf8');
const V=JSON.parse(text.slice(text.indexOf('=[')+1,text.trimEnd().lastIndexOf(';')));
const vm=require('node:vm');
const scope={window:{GRE_VOCAB:V}};
for(const asset of ['gre-paraphrases.js','gre-synonym-groups.js','gre-synonyms.js'])
  vm.runInNewContext(fs.readFileSync(path.join(root,asset),'utf8'),scope);
const SYN=scope.window.GRE_SYNONYMS;
const PAR=scope.window.GRE_PARAPHRASES;
assert.equal(SYN.groups.length,813);
assert.equal(new Set(SYN.groups.map(g=>g.id)).size,SYN.groups.length);
assert.equal(new Set(SYN.groups.flatMap(g=>g.items.map(i=>i.w))).size,2902);
assert.equal(PAR.entries.length,2902);
assert.equal(PAR.entries.reduce((n,e)=>n+e.senses.length,0),3260);
assert.equal(require('node:crypto').createHash('sha256').update(text).digest('hex'),'e0ac46aebb52ce9092d9155d2d0f0aa35e15c0b35065ea387bd6d71d6cacc78b','source bank must remain unchanged');
for(const v of V){
  const p=PAR.get(v.en);assert.ok(p&&p.id===v.id&&p.l===v.l,'identity retained '+v.en);
  assert.ok(SYN.forWord(v.en).length,'every headword has a specific group '+v.en);
  for(const s of p.senses){
    assert.ok(s.pos&&s.zh&&s.form&&s.gloss&&s.usage.length,s.form+' complete sense');
    assert.ok(!/[一-鿿]/.test(s.gloss)&&s.gloss.length<450,'clean English gloss '+s.form);
    assert.ok(s.examples.length&&s.examples.every(x=>x.en&&x.zh&&x.source),'example for every sense '+s.form);
  }
}
for(let list=1;list<=30;list++)assert.equal(PAR.entries.filter(e=>e.l===list).length,V.filter(v=>v.l===list).length);
assert.equal(PAR.get('lie').senses.length,1,'morphology is not a separate sense');
assert.equal(PAR.get('all but').senses.length,2,'opposite phrase senses stay separate');
assert.equal(PAR.get('term').senses[0].form,'in terms of','retain the full phrase');
assert.match(PAR.get('qualitative').senses[0].gloss,/qualities or characteristics rather than numerical quantities/,'complete definition');
assert.match(PAR.get('beg the question').senses[0].gloss,/assume the truth/);
assert.match(PAR.get('rodent').senses[0].zh,/啮齿目/);
assert.doesNotMatch(PAR.get('rodent').senses[0].zh,/兔/);
assert.equal(SYN.groups.find(g=>g.title==='定量与定性').kind,'contrast');
assert.equal(SYN.groups.find(g=>g.title==='教条不容质疑').kind,'rewrite');
assert.equal(SYN.groups.find(g=>g.title==='清澈与可穿透').kind,'contrast');
assert.equal(SYN.groups.find(g=>g.title==='热衷与渴求').items.find(i=>i.w==='voracious').sense,1);
for(const g of SYN.groups){
  assert.ok(g.items.length>=2&&g.items.length<=12,g.id);
  assert.ok(['near','rewrite','contrast'].includes(g.kind)&&g.note&&g.source);
  assert.equal(new Set(g.items.map(i=>i.w)).size,g.items.length,g.id+' unique words');
  for(const i of g.items){
    assert.ok(V.some(v=>v.en===i.w),g.id+': existing headword '+i.w);
    assert.ok(i.phrase&&i.zh&&i.hint,g.id+': complete collocation');
    if(i.sense!==undefined)assert.ok(PAR.get(i.w).senses.some(s=>s.index===i.sense&&s.gloss===i.gloss));
    assert.ok(!/[<>]/.test(i.phrase));
  }
}
for(const [a,b] of [['accessible','opaque'],['credible','implausible'],['placate','unyielding'],['tractable','stubborn'],['dearth','modicum']]){
  assert.ok(!SYN.related(a).some(r=>r.w===b),a+' must not link to '+b);
}
assert.ok(SYN.related('dwindle').some(r=>r.w==='contract'),'vi. and vi.&vt. share a verbal sense');
// Direct links carry their source; never take a transitive closure.
for(const v of V)for(const r of SYN.related(v.en)){
  assert.ok(r.sources.every(s=>V.some(w=>w.en===s)),'traceable source');
  const peer=V.find(w=>w.en===r.w);
  assert.ok(SYN.bookSynonyms(v).includes(r.w)||(peer&&SYN.bookSynonyms(peer).includes(v.en)),v.en+' direct edge only');
}
// the bank is 新东方《GRE 核心词汇一本通》 alone, in book order
assert.ok(V.length>=2850&&V.length<=3100,'word count '+V.length);
assert.ok(V.every(v=>Number.isInteger(v.l)&&v.l>=1&&v.l<=30),'every word has its List');
assert.ok(V.every((v,i)=>i===0||v.l>=V[i-1].l),'ids follow the book order');
assert.ok(V.every(v=>!('ex' in v)&&!('tv' in v)&&!('eq' in v)&&!('bk' in v)),'no words or fields from the other books');
assert.ok(V.every(v=>v.bs&&v.bs.length&&v.def.length),'every word has the book senses and English definitions');
assert.deepEqual(V.map(v=>v.id),V.map((_,i)=>i),'ids follow array order');
assert.equal(new Set(V.map(v=>v.en)).size,V.length,'no duplicate headwords');
for(const v of V){
  assert.match(v.en,/^[A-Za-z][A-Za-z' .\/()-]*[A-Za-z.)]$/,'headword '+v.en);
  assert.ok(v.zh&&/[一-鿿]/.test(v.zh)&&!/[A-Za-z]{4,}(?![^（]*）)/.test(v.zh.replace(/\b(adj|adv|vt|vi|prep|conj|interj|pron)\b/g,'').replace(/[（(][^）)]*[）)]/g,'')),'meaning '+v.en);
  assert.ok(/^[A-Z]{1,2}$/.test(v.cat));
  for(const s of v.bs||[]){
    assert.ok(/[一-鿿]/.test(s.z),'book sense '+v.en);
    for(const [en,zh] of s.x) assert.ok(en.length>2&&!/[一-鿿]/.test(en)&&!/[A-Za-z]{4,}/.test(zh.replace(/[（(][^）)]*[）)]/g,'').replace(/\b(sb|sth)\b/g,'').replace(/[A-Za-z]+(?=[\s\S]*$)/g,w=>/^[A-Z]/.test(w)||en.toLowerCase().includes(w.toLowerCase())?'':w)),'book example '+v.en+': '+en);
  }
}

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
  await page.goto(base+'/gre.html');
  await page.evaluate(()=>{settings.auto=false;settings.order='seq';saveSettings();});

  // inflected forms in the book's sentences are found; other words are not mistaken for the headword
  const found=await page.evaluate(()=>[
    findWord('the procedure was abandoned, though','abandon'),
    findWord('He abetted the escape','abet'),
    findWord('Brain-bots, initiate the fail-safe.','fail-safe'),
    findWord('the panel was empty','pan'),
    findWord('These diseases are declining','decline'),
  ].map(m=>m&&[m.s,m.e]));
  assert.deepEqual(found,[[18,27],[3,10],[25,34],null,[19,28]]);
  // irregular verbs, sb./sth. phrases, (or X) alternatives, British spellings, Latin plurals, hyphen variants
  const more=await page.evaluate(()=>[
    ['The principal upheld the teacher\'s decision.','uphold'],
    ['The idea struck her as odd.','strike'],
    ['Our company cannot stave bankruptcy off any longer.','stave sth. off'],
    ['The doctor ruled out appendicitis.','rule sth. out'],
    ['The law will make no difference to my business.','make a (or no) difference'],
    ['keep her illness at bay','hold (or keep) sb./sth. at bay'],
    ['Their house is a far cry from what we expected.','be a far (long) cry from'],
    ["You might feel that they're out to use your house as a free hotel.",'be out to do'],
    ['We took great pains not to offend anyone.','take pains'],
    ['In spite of her meagre Hebrew, she was acclimated.','meager'],
    ['the university\'s criteria for admission','criterion'],
    ['She has a talent for mimicking famous actresses.','mimic'],
    ['a warm-hearted, affectionate girl','warmhearted'],
    ['a mean idea','meet'],
    ['the shape of things','ape'],
  ].map(([t,w])=>{const m=findWord(t,w);return m&&t.slice(m.s,m.e);}));
  assert.deepEqual(more,['upheld','struck','stave bankruptcy off','ruled out','make no difference','keep her illness at bay','is a far cry from',
    "'re out to use",'took great pains','meagre','criteria','mimicking','warm-hearted',null,null]);
  const cover=await page.evaluate(()=>VOCAB.filter(v=>contexts(v).length).length);
  assert.ok(cover>=2150,'words usable for 语境填空: '+cover);
  // proofread data: OCR repairs stay in place
  const fixed=await page.evaluate(()=>[VOCAB[5].bs[0].x[0][0],VOCAB[464].en,VOCAB[87].bs[0].z,VOCAB[595].bs[0].z]);
  assert.deepEqual(fixed,['The banks are flush with funds.','succor','不偏不倚的；公正的；无偏见的','独裁的；专制的']);
  // every single-word headword has a clean phonetic; every sense has a part of speech
  const ph=await page.evaluate(()=>({miss:VOCAB.filter(v=>!/[ .(]/.test(v.en)&&!v.ph).map(v=>v.en),
    junk:VOCAB.filter(v=>/[\\^@?]|ɪ|ˈ/.test(v.ph||'')).map(v=>v.en),noPos:VOCAB.filter(v=>v.bs.some(s=>!s.p)).map(v=>v.en),
    pos:[VOCAB[2329].bs[0].p,VOCAB[1896].bs[0].p,VOCAB[1373].bs[0].p,VOCAB[478].bs[1].p]}));
  assert.deepEqual(ph,{miss:[],junk:[],noPos:[],pos:['vt.','vt.','vt.','adj.']});
  // 听写 accepts phrase headwords as heard (sth. read as "something"), abbreviated, without the placeholder, or either "(or X)" choice
  const phr=await page.evaluate(()=>{const g=(en,t)=>{const r=check(t,VOCAB.find(v=>v.en===en));return r.ok&&r.clean;};return [
    g('stave sth. off','stave something off'),g('stave sth. off','stave off'),g('stave sth. off','stave sth off'),
    g('hold (or keep) sb./sth. at bay','keep somebody at bay'),g('make a (or no) difference','make no difference'),
    g('be a far (long) cry from','a far cry from'),g('stave sth. off','stave something'),g('make a (or no) difference','make difference')];});
  assert.deepEqual(phr,[true,true,true,true,true,true,false,false]);

  // 语境填空: the blank hides the word as it appears in the sentence; options share its part of speech
  await page.evaluate(()=>enterMode('cloze',true));
  const q=await page.evaluate(()=>({en:state.list[0].en,text:$('cText').textContent,opts:[...$('cOpts').children].map(b=>VOCAB[+b.dataset.id]),c:curCloze}));
  assert.equal(q.opts.length,5);
  assert.ok(q.opts.some(o=>o.en===q.en));
  assert.ok(!q.text.toLowerCase().includes(q.c.en.slice(q.c.m.s,q.c.m.e).toLowerCase()+' ')||q.text.includes('?'));
  assert.ok(q.opts.every(o=>o.en===q.en||!q.c.en.toLowerCase().includes(' '+o.en+' ')),'distractor already in the sentence');
  // a right answer is recorded in the shared review ledger as a GRE meaning answer
  await page.locator('#cOpts .opt',{hasText:new RegExp('^\\d'+q.en+'$')}).click();
  let st=await page.evaluate(w=>({ok:state.session.ok,idx:state.idx,p:prog[w],rec:JSON.parse(localStorage.getItem('ielts_srs')||'{}')[w]}),q.en);
  assert.equal(st.ok,1); assert.equal(st.p.seen,1); assert.ok(st.p.t>0);
  assert.ok(st.rec&&st.rec.m&&st.rec.src.includes('gre'),'ledger records gre track m');
  // the answered question is not repeated after reopening
  await page.reload();
  assert.deepEqual(await page.evaluate(()=>[state.mode,state.idx,state.session.ok]),['cloze',1,1]);
  // a wrong answer goes to 错词本 (src gre) and the day's mistake log (mode cloze), and comes back 4 questions later
  const w=await page.evaluate(()=>{const it=state.list[state.idx]; const b=[...$('cOpts').children].find(b=>+b.dataset.id!==it.id); b.click(); return it.en;});
  const after=await page.evaluate(w=>({wrong:JSON.parse(localStorage.getItem('ielts_wrong')).find(x=>x.en===w),list:state.list.map(v=>v.en),idx:state.idx,
    ev:JSON.stringify(JSON.parse(localStorage.getItem('ielts_wrong_events')||'{}'))}),w);
  assert.equal(after.wrong.src,'gre');
  assert.equal(after.list[after.idx+4],w);
  assert.match(after.ev,/cloze/);
  await page.keyboard.press('Enter');
  assert.equal(await page.evaluate(()=>state.idx),2);

  // 英释→词: an English definition as the prompt, the word among the options
  await page.evaluate(()=>{settings.quizDir='def2en';enterMode('quiz',true);});
  const dq=await page.evaluate(()=>({it:state.list[0],prompt:$('qPrompt').textContent,opts:[...$('qOpts').children].map(b=>b.textContent)}));
  assert.ok(dq.prompt.includes(dq.it.def[0].replace(/^[a-z]{1,4}\.?\s+/,'').slice(0,20)));
  assert.ok(dq.opts.includes(dq.it.en));

  // the removed 等价词 direction falls back to 英→中 for a saved setting
  await page.evaluate(()=>{settings.quizDir='eq';saveSettings();});
  await page.reload();
  assert.equal(await page.evaluate(()=>settings.quizDir),'en2zh');
  assert.equal(await page.evaluate(()=>document.querySelector('#setQuizDir [data-v="eq"]')),null);
  // a session saved against the previous word list (ids meant other words) is not resumed
  await page.evaluate(()=>{settings.sess={version:2,deck:'all',mode:'quiz',ids:[7,8,9],idx:1,session:{done:1,ok:1,bad:0,wrong:[]},ts:Date.now()};saveSettings();});
  await page.reload();
  const fresh=await page.evaluate(()=>({mode:state.mode,idx:state.idx,first:state.list[0]&&state.list[0].id,ok:state.session.ok}));
  assert.deepEqual([fresh.idx,fresh.ok],[0,0]); assert.notEqual(fresh.first,7);

  // word details: book senses with English definitions, examples and translations, synonyms; a chip opens that word; online dictionaries
  await page.evaluate(()=>{$('search').value='curt';enterMode('browse',false);renderBrowse();});
  await page.locator('#browseBody tr').first().locator('td.en').click();
  const d=await page.evaluate(()=>({show:$('detail').classList.contains('show'),text:$('detailBody').innerText,links:[...$('detailBody').querySelectorAll('a')].map(a=>[a.href,a.target])}));
  assert.ok(d.show); assert.match(d.text,/释义与例句/); assert.match(d.text,/rudely brief/); assert.match(d.text,/His reply was curt/); assert.match(d.text,/他的回复很短/); assert.match(d.text,/近义词/); assert.match(d.text,/List 2/);
  assert.doesNotMatch(d.text,/真题例句|美剧台词|等价词|WordNet/);
  assert.equal(d.links.length,4); assert.ok(d.links.every(([h,t])=>h.startsWith('https://')&&t==='_blank'));
  await page.locator('#detailBody .wlink',{hasText:/^laconic$/}).click();
  assert.match(await page.evaluate(()=>$('detailBody').querySelector('.dhead').innerText),/laconic/);
  await page.keyboard.press('Escape');
  assert.equal(await page.evaluate(()=>$('detail').classList.contains('show')),false);

  // List chips: List 2 in book order; 顺序 starts the whole bank at the book's first word
  const lst=await page.evaluate(()=>{settings.order='seq';state.deck='Y2';renderDecks();enterMode('flash',true);return {ids:state.list.map(v=>v.id),ls:[...new Set(state.list.map(v=>v.l))],chip:document.querySelector('#decks .chip.on').textContent};});
  assert.deepEqual(lst.ls,[2]); assert.deepEqual(lst.ids,[...lst.ids].sort((a,b)=>a-b)); assert.match(lst.chip,/^List 2/);
  assert.equal(await page.evaluate(()=>{state.deck='all';renderDecks();enterMode('flash',true);return state.list[0].en;}),'irrational');

  // flashcards: details appear only after flipping
  await page.evaluate(()=>enterMode('flash',true));
  assert.equal(await page.evaluate(()=>$('fMore').classList.contains('hide')),true);
  await page.evaluate(()=>flipFlash());
  assert.match(await page.evaluate(()=>$('fMore').innerText),/释义与例句/);

  // Chains are a reading aid: revealing and searching never awards mastery.
  const beforeSyn=await page.evaluate(()=>JSON.stringify({prog,daily,srs:localStorage.getItem('ielts_srs')}));
  await page.locator('[data-mode="synonyms"]').click();
  await page.locator('#synSearch').fill('mitigate');
  assert.equal(await page.locator('#synCards [data-group="ease"]').count(),1);
  assert.match(await page.locator('#synCards').innerText(),/alleviate poverty/);
  assert.match(await page.locator('#synCount').innerText(),/813 组覆盖 2902 词/);
  await page.locator('[data-syn-hide="ease"]').click();
  assert.doesNotMatch(await page.locator('[data-group="ease"]').innerText(),/mitigate|alleviate/);
  assert.match(await page.locator('#synCards').innerText(),/缓解贫困/);
  await page.locator('[data-syn-hide="ease"]').click();
  assert.match(await page.locator('#synCards').innerText(),/mitigate the impact/);
  assert.equal(await page.evaluate(()=>JSON.stringify({prog,daily,srs:localStorage.getItem('ielts_srs')})),beforeSyn);

  // Exact five-word group queue, wrong-answer handling and reload resume.
  await page.locator('[data-syn-practice="ease"]').click();
  const queue=await page.evaluate(()=>state.list.map(v=>v.en));
  assert.deepEqual(queue,['alleviate','mitigate','palliate','ameliorate','assuage']);
  await page.locator('#dictInput').fill('unfinished');
  await page.reload();
  assert.equal(await page.locator('#dictInput').inputValue(),'unfinished');
  assert.deepEqual(await page.evaluate(()=>state.list.map(v=>v.en)),queue);
  assert.match(await page.locator('#dDeck').innerText(),/同义串记/);
  await page.evaluate(()=>{$('dictInput').value='wrong';submitDict();});
  assert.equal(await page.evaluate(()=>state.session.bad),1);
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('ielts_wrong')).find(w=>w.en==='alleviate').src),'gre');
  await page.reload();
  assert.equal(await page.evaluate(()=>state.idx),1);
  assert.equal(await page.evaluate(()=>state.list[4].en),'alleviate');

  // Search all headwords, follow source links, empty state, paging and List scope.
  await page.locator('[data-mode="synonyms"]').click();
  await page.locator('#synView').selectOption('book');
  await page.locator('#synSearch').fill('accessible');
  const access=page.locator('#synCards details.syn-card').filter({has:page.locator('summary h3',{hasText:/^accessible$/})});
  assert.equal(await access.count(),1);
  assert.doesNotMatch(await access.innerText(),/opaque|obscure/);
  await page.locator('#synSearch').fill('not-a-real-word');
  assert.match(await page.locator('#synCards').innerText(),/没有匹配结果/);
  await page.locator('#synSearch').fill('');
  assert.match(await page.locator('#synCount').innerText(),/匹配 2902 词/);
  await page.locator('#synNext').click();
  assert.match(await page.locator('#synPage').innerText(),/^2 \/ /);
  await page.evaluate(()=>{state.deck='Y30';renderDecks();renderSynonyms();});
  assert.ok(await page.evaluate(()=>synResults.every(r=>r.v.l===30)));
  await page.evaluate(()=>{state.deck='all';renderDecks();openDetail(BYEN.get('mitigate'));});
  await page.locator('#detailBody [data-chain="ease"]').click();
  assert.equal(await page.evaluate(()=>state.mode),'synonyms');
  assert.equal(await page.locator('#synCards [data-group="ease"]').count(),1);

  // Filters keep contrasts distinct, and direct navigation opens the exact group.
  await page.locator('#synSearch').fill('');
  await page.locator('#synKind').selectOption('contrast');
  assert.ok(await page.evaluate(()=>synResults.length>300&&synResults.every(g=>g.kind==='contrast')));
  await page.evaluate(()=>openSynChain(SYN.groups.find(g=>g.title==='直接与经由中间人').id));
  assert.equal(await page.evaluate(()=>document.querySelector('[data-group="'+SYN.groups.find(g=>g.title==='直接与经由中间人').id+'"]').open),true);

  // Full-book sense cards are substantive, with complete phrase forms and recall.
  const beforeRead=await page.evaluate(()=>JSON.stringify({prog,daily,srs:localStorage.getItem('ielts_srs')}));
  await page.evaluate(()=>openParaphrase(BYEN.get('term').id));
  const termId=V.find(v=>v.en==='term').id;
  assert.match(await page.locator('[data-word="'+termId+'"]').innerText(),/in terms of →/);
  const allButId=V.find(v=>v.en==='all but').id;
  await page.evaluate(id=>openParaphrase(id),allButId);
  const allBut=page.locator('[data-word="'+allButId+'"]');
  assert.match(await allBut.innerText(),/几乎/);assert.match(await allBut.innerText(),/除.*以外全部/);
  await page.locator('[data-para-hide="'+allButId+'"]').click();
  assert.doesNotMatch(await allBut.innerText(),/all but|very nearly|all except/);
  assert.match(await allBut.innerText(),/几乎/);
  await page.locator('[data-para-hide="'+allButId+'"]').click();
  assert.match(await allBut.innerText(),/very nearly/);
  assert.equal(await page.evaluate(()=>JSON.stringify({prog,daily,srs:localStorage.getItem('ielts_srs')})),beforeRead);
  await page.locator('#synCoverage > summary').click();
  assert.equal(await page.locator('[data-syn-list]').count(),30);
  await page.locator('[data-syn-list="30"]').click();
  assert.ok(await page.evaluate(()=>synResults.length>0&&synResults.every(r=>r.v.l===30)));
  const pageWords=await page.evaluate(()=>synPageRows.map(r=>r.v.en));
  await page.locator('#synPracticePage').click();
  assert.deepEqual(await page.evaluate(()=>state.list.map(v=>v.en)),pageWords);
  await page.locator('#dictInput').fill('sense-draft');
  await page.reload();
  assert.equal(await page.locator('#dictInput').inputValue(),'sense-draft');
  assert.deepEqual(await page.evaluate(()=>state.list.map(v=>v.en)),pageWords);
  assert.match(await page.locator('#dDeck').innerText(),/逐义改写/);
  await page.evaluate(()=>openParaphrase(BYEN.get('comet').id));
  const cometId=V.find(v=>v.en==='comet').id;
  assert.match(await page.locator('[data-word="'+cometId+'"]').innerText(),/tail of gas and dust/);
  await page.locator('[data-para-practice="'+cometId+'"]').click();
  assert.deepEqual(await page.evaluate(()=>state.list.map(v=>v.en)),['comet']);

  // mobile width: no horizontal page scroll
  await page.setViewportSize({width:375,height:800});
  for(const m of ['flash','cloze','quiz','browse','plan','synonyms']){
    await page.evaluate(m=>enterMode(m,false),m);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1),'no horizontal scroll in '+m);
  }
  await page.locator('#synView').selectOption('book');
  await page.locator('#synSearch').fill('mitigate');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1),'book index fits mobile');
  await page.locator('#synView').selectOption('paraphrase');
  await page.locator('#synSearch').fill('qualitative');
  assert.equal(await page.evaluate(()=>synResults[0].v.en),'qualitative','exact headword precedes a related definition');
  assert.equal(await page.locator('#synNext').isDisabled(),true,'single result page has no next page');
  assert.equal(await page.evaluate(()=>BYEN.get('rodent').zh.includes('兔')),false,'explicit correction reaches ordinary drills');
  await page.locator('#synSearch').fill('');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1),'sense cards fit mobile');
  assert.deepEqual(errors,[]);
  console.log('PASS: unchanged original GRE bank/order and drills; 813 typed groups / 2902 headwords / 3260 senses; complete per-sense examples and usage; direct source links without transitive equivalence; recall without mastery inflation; group, page and word dictation; draft resume and mistakes; all 30 Lists, exact navigation, filtering and phone layout.');
 }finally{ if(browser) await browser.close(); server.close(); }
})().catch(e=>{console.error(e);process.exit(1);});
