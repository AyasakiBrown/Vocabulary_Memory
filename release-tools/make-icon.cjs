// Source of the app icon (Vocabulary Memory: a gold V with a spark on a night sky). Run with Playwright on NODE_PATH, then build
// src/AppIcon.icns with sips + iconutil from mac-1024.png, src/icon-512.png from mac-1024.png, src/icon-180.png (iPhone, full-bleed) from full-1024.png.
// release-tools/AppIcon.ico (Windows .exe) is written directly: every size rendered on its own, the smallest ones simplified.
// kind 'mac': macOS grid (824 tile on a 1024 canvas, shadow) · 'full': square full-bleed (iPhone) · 'win': Windows tile filling the square.
const {chromium}=require('playwright'), fs=require('fs'), path=require('path');
function svg(kind,px,simple){
  const full=kind==='full', win=kind==='win';
  const tile=full?'<rect width="1024" height="1024" fill="url(#bg)"/><rect width="1024" height="1024" fill="url(#glow)"/>'
    :win?'<rect x="24" y="24" width="976" height="976" rx="200" fill="url(#bg)"/><rect x="24" y="24" width="976" height="976" rx="200" fill="url(#glow)"/>'
    :'<g filter="url(#sh)"><rect x="100" y="100" width="824" height="824" rx="185" fill="url(#bg)"/></g><rect x="100" y="100" width="824" height="824" rx="185" fill="url(#glow)"/><rect x="101.5" y="101.5" width="821" height="821" rx="184" fill="none" stroke="rgba(255,255,255,.10)" stroke-width="3"/>';
  const s=full?1.16:win?(simple?1.22:1.12):1, o=512-512*s;      // full-bleed / Windows: the mark a little larger
  const spark=(x,y,r,f)=>`<path d="M${x} ${y-r} C${x+r*.16} ${y-r*.16} ${x+r*.16} ${y-r*.16} ${x+r} ${y} C${x+r*.16} ${y+r*.16} ${x+r*.16} ${y+r*.16} ${x} ${y+r} C${x-r*.16} ${y+r*.16} ${x-r*.16} ${y+r*.16} ${x-r} ${y} C${x-r*.16} ${y-r*.16} ${x-r*.16} ${y-r*.16} ${x} ${y-r}Z" fill="${f}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${px||1024}" height="${px||1024}" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1b2470"/><stop offset=".55" stop-color="#151a4f"/><stop offset="1" stop-color="#2a1660"/></linearGradient>
    <radialGradient id="glow" cx=".5" cy=".64" r=".5"><stop offset="0" stop-color="#ffb347" stop-opacity=".30"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/></radialGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe58a"/><stop offset=".6" stop-color="#ffc34d"/><stop offset="1" stop-color="#ff8f3f"/></linearGradient>
    <filter id="sh" x="-10%" y="-10%" width="120%" height="125%"><feDropShadow dx="0" dy="14" stdDeviation="16" flood-color="#000" flood-opacity=".32"/></filter>
    <filter id="gl" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="14" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  ${tile}
  <g transform="translate(${o} ${o}) scale(${s})">
    ${simple?'':`<g fill="#fff">
      <circle cx="268" cy="262" r="7" opacity=".75"/><circle cx="760" cy="246" r="5" opacity=".6"/><circle cx="790" cy="560" r="6" opacity=".55"/>
      <circle cx="232" cy="520" r="4.5" opacity=".5"/><circle cx="356" cy="790" r="4" opacity=".45"/><circle cx="700" cy="790" r="5" opacity=".5"/>
    </g>`}
    <path d="M318 330 L512 724 L706 330" fill="none" stroke="url(#gold)" stroke-width="${simple?150:118}" stroke-linecap="round" stroke-linejoin="round"${simple?'':' filter="url(#gl)"'}/>
    ${spark(512,318,simple?120:104,'#fffaf0')}
    ${simple?'':spark(668,690,34,'#ffe9a8')}
  </g></svg>`;
}
// An .ico holding PNG images (Windows Vista and later read these at every size)
function ico(pngs){
  const head=Buffer.alloc(6); head.writeUInt16LE(0,0); head.writeUInt16LE(1,2); head.writeUInt16LE(pngs.length,4);
  const dir=Buffer.alloc(16*pngs.length); let off=6+dir.length;
  pngs.forEach(([px,data],i)=>{ const e=i*16; dir.writeUInt8(px>=256?0:px,e); dir.writeUInt8(px>=256?0:px,e+1); dir.writeUInt8(0,e+2); dir.writeUInt8(0,e+3);
    dir.writeUInt16LE(1,e+4); dir.writeUInt16LE(32,e+6); dir.writeUInt32LE(data.length,e+8); dir.writeUInt32LE(off,e+12); off+=data.length; });
  return Buffer.concat([head,dir,...pngs.map(x=>x[1])]);
}
(async()=>{
  const out=process.argv[2]||path.join(require('os').tmpdir(),'vm-icon-build');fs.mkdirSync(out,{recursive:true}); fs.writeFileSync(out+'/icon.svg',svg('mac')); fs.writeFileSync(out+'/icon-full.svg',svg('full'));
  const b=await chromium.launch({channel:'chrome'});
  const shot=async(markup,px,file)=>{ const p=await b.newPage({viewport:{width:px,height:px}}); await p.setContent(`<html><body style="margin:0;background:transparent">${markup}</body></html>`);
    const buf=await p.screenshot({omitBackground:true,clip:{x:0,y:0,width:px,height:px}}); await p.close(); if(file) fs.writeFileSync(file,buf); return buf; };
  for(const [name,kind] of [['mac-1024.png','mac'],['full-1024.png','full']]) await shot(svg(kind),1024,out+'/'+name);
  const sizes=[16,20,24,32,40,48,64,96,128,256], pngs=[];
  for(const px of sizes) pngs.push([px,await shot(svg('win',px,px<=32),px,out+'/win-'+px+'.png')]);
  fs.writeFileSync(path.join(out,'AppIcon.ico'),ico(pngs));
  await b.close();
  console.log('wrote',out,'(copy AppIcon.ico to release-tools/)');
})();
