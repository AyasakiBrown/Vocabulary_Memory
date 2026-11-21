// The Windows app for real: stages resources/app the way build_release.py does and runs it in Electron
// (the same Electron on macOS behaves like Windows for navigation, the data bridge and window handling).
// Needs Playwright on NODE_PATH and an Electron binary of the release's version:
//   ELECTRON_BIN=…/Electron.app/Contents/MacOS/Electron node release-tools/test-electron-shell.cjs
// The run keeps its data in a throwaway folder and checks that the real learning data was not touched.
const fs=require('node:fs'), path=require('node:path'), os=require('node:os'), crypto=require('node:crypto');
const assert=require('node:assert/strict');
const bin=process.env.ELECTRON_BIN;
if(!bin||!fs.existsSync(bin)){ console.log('SKIP: set ELECTRON_BIN to an Electron binary to run the Windows shell for real'); process.exit(0); }
const {_electron:electron}=require('playwright');
const ROOT=path.resolve(__dirname,'..');

function stage(){
  const br=fs.readFileSync(path.join(__dirname,'build_release.py'),'utf8');
  const assets=JSON.parse(br.match(/ASSETS = (\[[\s\S]*?\])/)[1].replace(/'/g,'"'));
  const inject='<head>\n<script src="learning-data.js"></script>\n<script src="desktop.js"></script>\n<script src="shortcuts.js"></script>\n<script src="emoji.js"></script>\n<script src="images.js"></script>';
  assert.ok(br.includes(inject.replace(/\n/g,'\\n')),'build_release.py injects different scripts now: update this test');
  const out=fs.mkdtempSync(path.join(os.tmpdir(),'vm-winapp-'));
  fs.mkdirSync(path.join(out,'src'));
  for(const name of assets){
    const t=path.join(out,'src',name); fs.copyFileSync(path.join(ROOT,'src',name),t);
    if(name.endsWith('.html')) fs.writeFileSync(t,fs.readFileSync(t,'utf8').replace('<head>',inject));
  }
  fs.copyFileSync(path.join(__dirname,'desktop.js'),path.join(out,'src','desktop.js'));
  // test only: point the app's data folder at a throwaway directory
  fs.writeFileSync(path.join(out,'main.cjs'),"if(process.env.VM_TEST_APPDATA) require('electron').app.setPath('appData', process.env.VM_TEST_APPDATA);\n"+fs.readFileSync(path.join(__dirname,'main.cjs'),'utf8'));
  for(const n of ['preload.cjs','data-store.cjs']) fs.copyFileSync(path.join(__dirname,n),path.join(out,n));
  fs.writeFileSync(path.join(out,'package.json'),JSON.stringify({name:'ielts-vocab',productName:'Vocabulary Memory',version:'test',main:'main.cjs',private:true}));
  return out;
}
const real=path.join(os.homedir(),process.platform==='darwin'?'Library/Application Support':'.config','IELTSVocab','data.json');
const sum=f=>fs.existsSync(f)?crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex'):'none';
const wait=ms=>new Promise(r=>setTimeout(r,ms));

(async()=>{
  const before=sum(real), appDir=stage(), data=fs.mkdtempSync(path.join(os.tmpdir(),'vm-windata-'));
  const launch=async()=>{ const a=await electron.launch({executablePath:bin,args:[appDir],env:{...process.env,VM_TEST_APPDATA:data}}); await a.firstWindow(); await wait(700); return a; };
  const quit=async a=>{ await a.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0].close()); await wait(500); await a.close().catch(()=>{}); };
  try{
    let a=await launch(), win=await a.firstWindow();
    assert.equal(await a.evaluate(({app})=>app.getPath('userData')),path.join(data,'IELTSVocab'));
    assert.equal(await win.title(),'Vocabulary Memory');
    assert.match(await win.evaluate(()=>document.getElementById('homeNote').textContent),/%APPDATA%\\IELTSVocab\\data\.json/);
    assert.equal(await win.evaluate(()=>[...document.querySelectorAll('button')].some(b=>b.textContent==='学习记录与数据转移')),false);   // replaced by the 学习记录 module
    // the home page's 星图 card opens gre.html#game in the map, and what is learned there is saved through the data bridge
    await win.locator('#starTile').click({noWaitAfter:true}); await wait(2000);
    win=(await a.windows()).slice(-1)[0]; await win.waitForLoadState('domcontentloaded'); await wait(600);
    assert.deepEqual(await win.evaluate(()=>[location.href.split('/').pop(),state.mode,!document.querySelector('[role=alert]')]),['gre.html#game','game',true]);
    const lit=await win.evaluate(()=>{ settings.auto=false; G.sound=false; G.wave=10; gSave(true); gRenderHub(); $('gGoBlitz').click();
      for(let i=0;i<10;i++){ const t=gs.cur; [...$('gOpts').children].find(b=>+b.dataset.id===t.w.id).click(); gNext(); }
      let n=0; while(!gs.finished&&n++<60){ if(gs.answered){ gNext(); continue; } const t=gs.cur; if(t.type==='spell'){ $('gInput').value=t.w.en; gSubmit(); } else [...$('gOpts').children].find(b=>+b.dataset.id===t.w.id).click(); }
      return gs.lit.length; });
    assert.equal(lit,10); await wait(400);
    const saved=JSON.parse(fs.readFileSync(path.join(data,'IELTSVocab','data.json'),'utf8')).decks;
    assert.ok(Object.keys(saved.srs.items).length>=10&&saved.gre.settings.game.day.lit>=10,'saved to data.json');
    // ∑ 数学词汇: the home tile opens quant.html, and its q: records join the GRE deck's prog without
    // dropping what the GRE page saved there (this host replaces a deck's prog wholesale)
    const greKeys=Object.keys(saved.gre.prog).filter(k=>!k.startsWith('q:')).sort();
    await win.evaluate(()=>{ location.href='index.html'; }); await wait(1500);
    win=(await a.windows()).slice(-1)[0];
    await win.locator('a.tile[href="quant.html"]').click({noWaitAfter:true}); await wait(1500);
    win=(await a.windows()).slice(-1)[0]; await win.waitForLoadState('domcontentloaded'); await wait(400);
    assert.equal(await win.evaluate(()=>location.href.split('/').pop()),'quant.html');
    await win.evaluate(async()=>{ document.getElementById('bLearn').click(); const W=ms=>new Promise(r=>setTimeout(r,ms));
      for(let k=0;k<60;k++){ const s=QZ.state().run; if(!s) break; const q=s.queue[s.i];
        if(q.kind!=='card') document.querySelector(`.opt[data-i="${q.ok}"]`).click(); document.getElementById('gNext').click(); await W(5); }
      await W(500); });
    const after=JSON.parse(fs.readFileSync(path.join(data,'IELTSVocab','data.json'),'utf8')).decks.gre;
    assert.deepEqual(Object.keys(after.prog).filter(k=>!k.startsWith('q:')).sort(),greKeys,'GRE page progress kept');
    assert.equal(Object.entries(after.prog).filter(([k,v])=>/^q:\d/.test(k)&&v.lv===1).length,8,'eight math terms lit and saved');
    assert.ok(after.settings.game.day.lit>=10,'星图 state kept');
    // every page of the 词库 menu loads without errors
    const errs=await a.evaluate(async({BrowserWindow})=>{ const w=BrowserWindow.getAllWindows()[0], wc=w.webContents, base=wc.getURL().replace(/[^/]*$/,''), out={};
      for(const p of ['index','review','edef','gre','quant','p1','vj','scene','notebook','wrong','records']){ const e=[]; const on=(ev,level,msg)=>{ const lv=ev&&ev.level!==undefined?ev.level:level, m=ev&&ev.message!==undefined?ev.message:msg; if(lv==='error'||lv===3) e.push(String(m).slice(0,160)); };
        wc.on('console-message',on); await w.loadURL(base+p+'.html'); await new Promise(r=>setTimeout(r,700));
        if(await wc.executeJavaScript(`!!document.querySelector('[role=alert]')`)) e.push('data bridge alert'); wc.off('console-message',on); if(e.length) out[p]=e; }
      return out; });
    assert.deepEqual(errs,{});
    // the window reopens where it was left, maximized or not; a spot off every screen falls back to the default
    await a.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0].setBounds({x:70,y:90,width:900,height:640})); await quit(a);
    a=await launch(); assert.deepEqual(await a.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0].getBounds()),{x:70,y:90,width:900,height:640});
    await a.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0].maximize()); await wait(800); await quit(a);
    a=await launch(); assert.deepEqual(await a.evaluate(({BrowserWindow})=>[BrowserWindow.getAllWindows()[0].isMaximized(),BrowserWindow.getAllWindows()[0].getNormalBounds().width]),[true,900]); await quit(a);
    fs.writeFileSync(path.join(data,'IELTSVocab','window-state.json'),JSON.stringify({x:-5000,y:-5000,width:900,height:640,max:false}));
    a=await launch(); assert.ok(await a.evaluate(({BrowserWindow,screen})=>{ const b=BrowserWindow.getAllWindows()[0].getBounds(), wa=screen.getPrimaryDisplay().workArea; return b.x>=wa.x-10&&b.y>=wa.y-10&&b.height<=wa.height; })); await quit(a);
    assert.equal(sum(real),before,'the real learning data was not touched');
    console.log('PASS: Windows shell in Electron — 星图 card opens gre.html#game, learning saved through the data bridge, ∑ 数学词汇 saves beside it, all 11 pages load cleanly, window size/position/maximize remembered, off-screen spot falls back, real data untouched');
  }finally{ fs.rmSync(appDir,{recursive:true,force:true}); fs.rmSync(data,{recursive:true,force:true}); }
})().catch(e=>{ console.error(e); process.exit(1); });
