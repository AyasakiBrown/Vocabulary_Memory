// Gives the Windows program (Electron's electron.exe, renamed IELTSVocab.exe) the app's own icon and name, so
// Explorer, the Start menu and a pinned taskbar button show Vocabulary Memory instead of Electron.
// Called by build_release.py:  node set-exe-icon.cjs <IELTSVocab.exe> <AppIcon.ico> <version>
// Needs the pure-JavaScript resedit + pe-library (installed into a temporary folder on NODE_PATH by the release script).
const fs=require('node:fs');
(async()=>{
  const [exePath,icoPath,version='1.0.0']=process.argv.slice(2);
  if(!exePath||!icoPath) throw Error('usage: set-exe-icon.cjs <exe> <ico> <version>');
  const ResEdit=await require('resedit/cjs').load(), PE=await require('pe-library/cjs').load();      // (require honours NODE_PATH; import() would not)
  const exe=PE.NtExecutable.from(fs.readFileSync(exePath),{ignoreCert:true});   // the resources change, so any signature would be void anyway
  const res=PE.NtExecutableResource.from(exe);
  // replace the program's own icon group (keeping its id and language) with every size from our .ico
  const groups=ResEdit.Resource.IconGroupEntry.fromEntries(res.entries);
  if(!groups.length) throw Error('no icon group in '+exePath);
  const icons=ResEdit.Data.IconFile.from(fs.readFileSync(icoPath)).icons.map(i=>i.data);
  ResEdit.Resource.IconGroupEntry.replaceIconsForResource(res.entries,groups[0].id,groups[0].lang,icons);
  // the name Windows shows in Task Manager, the file's properties and "Open with"
  const vi=ResEdit.Resource.VersionInfo.fromEntries(res.entries)[0];
  if(vi){
    const nums=String(version).split('.').map(n=>parseInt(n,10)||0).concat(0,0,0,0).slice(0,4);
    const langs=vi.getAllLanguagesForStringValues();
    for(const lang of (langs.length?langs:[{lang:1033,codepage:1200}])){
      vi.setStringValues(lang,{ProductName:'Vocabulary Memory',FileDescription:'Vocabulary Memory',InternalName:'IELTSVocab',OriginalFilename:'IELTSVocab.exe',
        CompanyName:'',LegalCopyright:'',ProductVersion:nums.slice(0,3).join('.'),FileVersion:nums.join('.')});
    }
    vi.setFileVersion(...nums); vi.setProductVersion(...nums);
    vi.outputToResourceEntries(res.entries);
  }
  res.outputResource(exe);
  fs.writeFileSync(exePath,Buffer.from(exe.generate()));
  console.log('IELTSVocab.exe: icon ('+icons.length+' sizes) and name set');
})().catch(e=>{ console.error('set-exe-icon:',e.message); process.exit(1); });
