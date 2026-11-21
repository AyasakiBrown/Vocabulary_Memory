// 错词本 GRE / 雅思 / 全部 range, and the home page's 错词本 tile while 雅思 is paused. Requires Playwright and Chrome; synthetic data only.
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
  const ctx=await browser.newContext(), page=await ctx.newPage(), errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('dialog',d=>{ page.__dlg=d.message(); d.accept(); });
  await page.addInitScript(()=>{
    window.webkit={messageHandlers:{persist:{postMessage(){}}}};
    if(!localStorage.getItem('ielts_wrong')) localStorage.setItem('ielts_wrong',JSON.stringify([
      {en:'abate',zh:'减轻',src:'gre',n:3,ts:3},{en:'cogent',zh:'有说服力的',src:'gre',n:1,ts:2},
      {en:'kiosk',zh:'小亭',src:'scene',n:2,ts:1},{en:'magma',zh:'岩浆',src:'vj',n:1,ts:4},{en:'tent',zh:'帐篷',src:'p1',n:1,ts:5}]));
  });
  const view=()=>page.evaluate(()=>({on:document.querySelector('#scope .on').textContent,
    btns:[...document.querySelectorAll('#scope button')].map(b=>b.textContent),words:[...document.querySelectorAll('#list .w')].map(w=>w.textContent).sort(),
    count:document.getElementById('count').innerText}));
  // 雅思 paused on the home page (the default): the book opens on GRE
  await page.goto(base+'/wrong.html');
  assert.deepEqual(await view(),{on:'GRE 2',btns:['GRE 2','雅思 3','全部 5'],words:['abate','cogent'],count:'GRE 2 个错词　·　错得最多'});
  await page.locator('#scope [data-s="ielts"]').click();
  assert.deepEqual((await view()).words,['kiosk','magma','tent']);
  // the choice is remembered on this device
  await page.reload(); assert.equal((await view()).on,'雅思 3');
  // 重听写 practises only the range on screen
  await page.locator('#scope [data-s="gre"]').click();
  await page.locator('#dictate').click();
  assert.match(await page.locator('#dprog').innerText(),/第 1 \/ 2 个/);
  await page.locator('#dclose').click();
  // 清空 empties only the range on screen, and says so
  await page.locator('#clear').click();
  assert.match(page.__dlg,/清空 GRE 的 2 个错词？其他错词不受影响/);
  assert.deepEqual(await view(),{on:'GRE 0',btns:['GRE 0','雅思 3','全部 3'],words:[],count:'GRE 0 个错词　·　错得最多'});
  assert.match(await page.locator('#list').innerText(),/GRE还没有错词/);
  assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('ielts_wrong')).map(e=>e.en).sort()),['kiosk','magma','tent']);
  // home tile: GRE count first, 雅思 marked as paused
  await page.evaluate(()=>{ localStorage.setItem('ielts_wrong',JSON.stringify([{en:'abate',src:'gre'},{en:'kiosk',src:'scene'},{en:'magma',src:'vj'}])); localStorage.removeItem('ielts_wrong_scope'); });
  await page.goto(base+'/index.html'); await page.waitForTimeout(1000);
  const tile=await page.evaluate(()=>[...document.querySelectorAll('#mod-books .tile')].find(t=>/错词本/.test(t.querySelector('.t-name').textContent)).querySelector('.stats').innerText);
  assert.match(tile,/^GRE 1 词 · 雅思 2（暂停）/);
  assert.match(await page.locator('#mod-books .mod-tt p').innerText(),/GRE 错词 1/);
  // resuming 雅思 restores the whole-book wording; the book then opens on 全部
  await page.locator('#mod-ielts .mod-head').click(); await page.locator('#mod-ielts .mod-pause').click();
  assert.match(await page.locator('#mod-books .mod-tt p').innerText(),/待攻克错词 3/);
  await page.goto(base+'/wrong.html'); assert.equal((await view()).on,'全部 3');
  assert.deepEqual(errors,[]);
  console.log('PASS: 错词本 range — opens on GRE while 雅思 is paused, remembers the choice, 重听写 and 清空 act on the range only; home tile shows GRE first and the paused 雅思 count.');
 }finally{ if(browser) await browser.close(); await new Promise(r=>server.close(r)); }
})().catch(e=>{console.error(e);process.exitCode=1;});
