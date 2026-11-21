/* 全书逐义改写卡。定义和搭配来自用户提供词书的现有 OCR 词库；
 * 显式 corrections 修正混入释义的例句、缺失词性和已核对的错误。
 * 不改原词头、id、List 或复习键；释义展开不等于可在原句中机械替换。 */
(function(){
  'use strict';
  const fold=s=>String(s||'').toLowerCase().trim();
  const corrections={
    'systematic:0':{e:'done according to a fixed plan or system; methodical',x:[['a systematic approach to solving the problem','有条理地解决问题的方法']]},
    'partiality:0':{e:'unfair support for one person, group, or idea',x:[['Show no partiality in your decisions.','作决定时不要偏心。']]},
    'gargantuan:0':{e:'enormous; extremely large',x:[['a gargantuan appetite','极大的食量']]},
    'override:0':{p:'vt.',z:'以更大的权限撤销；推翻；否决',e:'use greater authority to reverse or reject a decision',x:[['override the earlier decision','推翻先前的决定']]},
    'theatrical:0':{e:'of or relating to acting, actors, or the theatre',x:[['theatrical costumes','戏服']]},
    'clandestine:0':{e:'kept secret or done secretly, especially because it is not allowed',x:[['a clandestine meeting','秘密会议']]},
    'vilify:0':{e:'speak or write about someone in an abusively critical way',x:[['vilify the government','诋毁政府']]},
    'memorable:0':{e:'worth remembering or easily remembered because it is special or unusual',x:[['a memorable day','值得纪念的一天']]},
    'qualitative:0':{e:'concerned with qualities or characteristics rather than numerical quantities'},
    'rustic:0':{e:'relating to the countryside; rural',x:[['rustic life','乡村生活']]},
    'rodent:0':{z:'啮齿目动物，如鼠、松鼠、河狸',e:'a mammal of the order Rodentia, with continuously growing front teeth for gnawing'},
    'formulaic:0':{z:'公式化的；老套的'},
    'flush:0':{x:[['The banks are flush with funds.','银行资金充裕。']]},
    'make sth. up:0':{x:[["I'll make up the time tomorrow.",'我明天把时间补回来。']]},
    'back up:0':{x:[['back up an argument with forceful illustrations','用有力的例证支持论点']]},
    'agenda:0':{p:'n.'},'labor union:0':{p:'n.'},'self-flattery:0':{p:'n.'},'durability:0':{p:'n.'},'demeanor:0':{p:'n.'},
    'comet:0':{e:'an icy body that orbits the sun and can develop a tail of gas and dust when near it'},
    'alga:0':{e:'a photosynthetic organism belonging to the diverse group called algae, including seaweeds and many single-celled forms'},
    'longitude:0':{e:'angular distance east or west of the prime meridian'},
    'unwitting:0':{e:'unaware of something; not realizing what is happening'},
    'characterize:1':{x:[['The newspaper article characterizes the people of the town as poor and uneducated.','报纸把当地人描述得又穷又没有文化。']]},
    'beg the question:0':{z:'（逻辑）把待证结论当作前提；另有“引出问题”的常见用法',e:'assume the truth of the very conclusion that an argument is meant to prove',x:[['Saying that the rule is fair because it is just begs the question.','说这条规则公平，因为它是公正的，属于循环论证。']],exampleSource:'补充例句（另编）'},
    'anatomy:0':{z:'解剖学'},'reaffirm:0':{z:'重申；再次肯定'},'arid:0':{z:'干旱的；干燥的'},
    'in the midst of:0':{z:'在……之中'},'myth:0':{z:'神话'},'ministration:0':{z:'帮助；照料'},
    'subject:2':{x:[['The area is subject to flooding.','这一地区易受洪灾影响。']],exampleSource:'补充例句（另编）'},
    'virtue:1':{x:[['She gained entry by virtue of her membership.','她凭会员资格获得了入场权。']],exampleSource:'补充例句（另编）'},
    'relegation:0':{x:[['relegation to a lower division','降入较低级别的联赛']],exampleSource:'补充搭配（另编）'},
    'tonic:0':{x:[['the tonic quality of sea air','海洋空气滋养身心的性质']]},
    'underemphasize:0':{x:[['History is underemphasized in the curriculum.','这份课程安排对历史重视不足。']]},
    'animadversion:0':{x:[["make animadversions on someone's conduct",'谴责某人的行为']]},
    'oversell:0':{x:[['Bio-engineering was oversold.','生物工程被捧上天了。']]},
    'misapprehend:0':{x:[['The real point at issue is misapprehended.','真正的争议点被误解了。']]},
    'scrape:0':{x:[['She scraped the mud off her shoes.','她把鞋子上的泥擦掉了。']]},
    'seek:0':{x:[['Her parents had never sought to interfere with her freedom.','她的父母从来不试图干涉她的自由。']]}
  };
  // These collocations are newly written, not claimed to be quotes from the book.
  const examples={
    'hedge:0':['a hedge around the garden','围着花园的树篱'],
    'feminism:0':['the history of feminism','女权主义的历史'],
    'undisciplined:0':['an undisciplined team','缺乏纪律的团队'],
    'union:1':['states that remained in the Union','留在联邦的州'],
    'governor:0':['the governor of the state','该州州长'],
    'qualitative:0':['qualitative research','定性研究'],
    'asteroid:0':['an asteroid orbiting the sun','绕太阳运行的小行星'],
    'confederacy:0':['the states of the Confederacy','南部邦联各州'],
    'suffrage:0':['universal suffrage','普选权'],
    'humanism:0':['the principles of humanism','人文主义的原则'],
    'latitude:0':['at a latitude of 30 degrees north','在北纬30度'],
    'longitude:0':['at a longitude of 120 degrees east','在东经120度'],
    'supernova:0':['a supernova explosion','超新星爆发'],
    'comet:0':['the tail of a comet','彗星的尾部'],
    'capitalism:0':['the development of capitalism','资本主义的发展'],
    'alga:0':['a single-celled alga','一种单细胞藻类'],
    'landslide:0':['a landslide after heavy rain','暴雨后的山体滑坡'],
    'mutation:0':['a genetic mutation','一次基因突变'],
    'orbit:1':['The satellite orbits the Earth.','卫星绕地球运行。'],
    'comic strips:0':['read comic strips in a newspaper','阅读报纸上的连环漫画']
  };
  const notes={
    'accessible':'accessible to someone；这里是“易懂”，不是 inaccessible（难懂）的近义词。',
    'flush':'常用 be flush with cash / funds；with 后接拥有的资源。',
    'instrumental':'be instrumental in doing something；强调对结果起关键作用。',
    'ascribe':'ascribe A to B：把 A 归因于 B；不要颠倒原因和结果。',
    'attribute':'attribute A to B；be attributed to B。',
    'impute':'impute something to someone；常指归责或认为某人有不良动机。',
    'substitute':'substitute A for B 表示用 A 代替 B；replace B with A 的宾语顺序相反。',
    'supplant':'supplant something：取代原来的位置，常有使其被淘汰之意。',
    'displace':'既可取代位置，也可迫使人离开家园；两个义项的宾语不同。',
    'cede':'cede something to someone；强调把权力或领土让给另一方。',
    'defer':'defer something / defer doing something 是推迟；defer to someone 是听从，不能混用。',
    'accede':'accede to a request / demand；accede to the throne 是即位。',
    'acquiesce':'acquiesce in something 常表示默许；不是积极赞同。',
    'consent':'consent to something / to do something；表示同意。',
    'concur':'concur with someone；concur in a decision。',
    'comply':'comply with a rule，不直接接 rule 作宾语。',
    'constrain':'constrain someone to do something；限制行为时注意宾语与补语。',
    'deter':'deter someone from doing something：阻止某人做某事。',
    'preclude':'preclude something / preclude someone from doing something；强调使不可能。',
    'prevent':'prevent someone from doing something。',
    'hinder':'hinder progress；hinder someone from doing something。',
    'refrain':'refrain from doing something；是自己克制，不是阻止别人。',
    'forbear':'forbear from doing something / forbear to do something；不要与 forebear（祖先）混淆。',
    'relinquish':'relinquish control / a claim：后接放弃的东西。',
    'forswear':'forswear something：郑重承诺放弃，语气比 forgo 强。',
    'endow':'资助义：endow an institution；赋予义：endow someone / something with a quality。',
    'confer':'confer something on someone；另有 confer with someone（商议）义。',
    'deprive':'deprive someone of something。',
    'disabuse':'disabuse someone of a mistaken belief；不是 abuse（虐待）。',
    'absolve':'absolve someone of / from blame；强调免除责任。',
    'exonerate':'exonerate someone from blame；指证明或认定没有过错。',
    'charge':'charge someone with a duty；其他语境也可指控罪或收费，按本义项区分。',
    'credit':'credit someone with something；credit something to someone。',
    'countenance':'此处作动词，表示容许或支持；不要套用名词“面容”的释义。',
    'assume':'此处常见 assume responsibility（承担责任）；不是每处都译作“假设”。',
    'shoulder':'作动词时 shoulder a burden / responsibility，直接接宾语。',
    'temper':'temper A with B；此处作动词“缓和”，不是名词“脾气”。',
    'qualify':'qualify a statement 是加上限制条件；不等同于赞同该陈述。',
    'sanction':'批准与制裁方向相反；分别看词性、宾语和上下文，不可用同一个替换词概括。',
    'apparent':'既可能表示表面看来，也可能表示明显；不能只凭词形认定已获证实。',
    'ostensible':'强调表面上或声称的，不保证真实。',
    'purport':'purport to do something，常暗示声称尚未获证实。',
    'allege':'allege that… / be alleged to…；指控不等于事实已被证实。',
    'belie':'外表可能掩盖真实情况；也可表示与说法相矛盾，需按义项改写。',
    'refute':'在严谨论证中通常指以理由或证据驳倒；仅否认可用 deny，不能混为一谈。',
    'disinterested':'此处是无私、公正，不是 uninterested（不感兴趣）。',
    'enormity':'原书此处取“巨大”；也常指罪行或恶行极其严重。写大小时用 magnitude / enormous size 更稳妥。',
    'inflammable':'若遇到此词是易燃，不是不可燃；不要按 in- 猜成反义。',
    'sensible':'注意与 sensitive（敏感的）区别，按本词具体义项记。',
    'stationary':'不要与 stationery（文具）混淆。',
    'contemporary':'可指同一时代，也可指当代；时间参照点不同。',
    'historical':'表示与历史有关；historic 通常强调有重大历史意义。',
    'historic':'历史性的重要事件；不泛指一切过去发生的事件。',
    'systematic':'按计划、有条理；systemic 表示涉及整个系统，不能机械互换。',
    'systemic':'涉及整个系统；不等于 systematic（有条理的）。',
    'discrete':'互相分开的；discreet 表示言行审慎，拼写相近但意思不同。',
    'discreet':'言行审慎，避免引人注意或泄密；不是 discrete（分离的）。',
    'complement':'补充、补足；不是 compliment（称赞）。',
    'compliment':'称赞；compliment someone on something。',
    'alternate':'交替或轮流；alternative 是另一个可选方案，不总能互换。',
    'alternative':'可替代的选择；不自动带“轮流交替”的意思。',
    'affect':'此词在书中有“假装”义；affect an accent 是装腔，不是被口音影响。',
    'list':'书中取船体倾斜义；不能用“清单”的释义替换。',
    'arrest':'熟词僻义包括使停止、吸引注意；不只表示逮捕。',
    'brook':'常见 brook no opposition：不容反对；这里不是名词“小溪”。',
    'exact':'exact a price / revenge：索取代价或报复；不要误当形容词“精确的”。',
    'lie':'表示位于或躺的变化：lies / lying / lay / lain；说谎义的过去式另为 lied。',
    'depose':'depose a ruler（罢黜）；法律语境的作证义需另辨。',
    'prey':'prey on 是捕食、利用；prey 是被捕食者，predator 是捕食者。',
    'endemic':'endemic to a place，强调某地特有或当地常见；不等于处处存在。',
    'indigenous':'indigenous to a region；指当地原有，不等于该地区独有。',
    'rodent':'限定啮齿目；不能泛称所有小型哺乳动物，也不能把兔类列为啮齿目。',
    'alga':'单数 alga，复数 algae；是藻类概念，不等于任意水生植物。',
    'flora':'某地区或时期的植物群；fauna 是动物群，两者属于对照概念。',
    'fauna':'某地区或时期的动物群；不是 flora（植物群）的同义词。',
    'velocity':'物理中 velocity 含方向；speed 通常只指速率。日常语境的范围可能较宽。',
    'mutation':'遗传学语境指基因或遗传物质的变化；不等于一切外观变化。',
    'qualitative':'关注性质、特征或质量；quantitative 关注数值与数量，属于对照而非同义。',
    'quantitative':'以数量或数值衡量；不可与 qualitative（定性）互换。',
    'impractical':'偏不切实际或不实用；impracticable 更明确表示难以实施或做不到。',
    'impracticable':'强调无法实施；不要仅仅理解成“不方便”。',
    'proscribe':'禁止，与 prescribe（规定、开处方）不同。',
    'brackish':'常见 brackish water 为微咸水；本书取令人不快的较少见义，不能推广到任何不喜欢的人或事。',
    'beg the question':'原书列“回避问题”；此卡按逻辑义校订。现代英语也可表示引出问题，但用 raise the question 更明确。不可一概当成 avoid the question。'
  };
  const phraseNotes={
    'give way to':'A gives way to B：A 被 B 取代；改用 replace 时主宾方向要调整。',
    'nothing if not':'nothing if not + 形容词：强调非常，整体是肯定意思。',
    'stave sth. off':'stave something off / stave off something；人称代词通常放中间，如 stave it off。',
    'fall short':'可独立使用；接未达到的标准时用 fall short of。',
    'shore up':'shore up something / shore something up；强调支撑可能衰落的事物。',
    'in spite of':'in spite of + 名词或动名词；although 通常接从句，不能原样换。',
    'make a (or no) difference':'make a difference to… 有影响；make no difference to… 没有影响，否定词不能省略。',
    'set in':'多以不良天气、情绪或局面作主语，不及物。',
    'cave in':'建筑坍塌义是不及物；cave in to pressure 可指向压力屈服。',
    'rule sth. out':'rule something out / rule out something；代词放中间：rule it out。',
    'at best':'评价上限：“即使按最好情况”；不是 usually。',
    'put sb./sth. to the test':'put + 人或物 + to the test；改写成 test 时去掉这一介词结构。',
    'turn out':'turn out to be… / it turns out that…；不要把完整从句直接放进单词槽位。',
    'far from':'far from + 名词、形容词或 doing；这里强调远非。',
    'take pains':'take pains to do something；pains 用复数，强调费心尽力。',
    'hold (or keep) sb./sth. at bay':'hold / keep + 对象 + at bay，表示不让其靠近或产生影响。',
    'call for':'后接所需的事物；与 call on someone（拜访或呼吁某人）区别。',
    'all but':'两个不同义项：all but forgotten 是几乎被忘；all but one 是除一个以外全部。',
    'fall short of':'of 后接标准、要求或期望；不足不一定是完全失败。',
    'in the course of':'后接活动名词或 doing；during 后也接名词，但未必含“过程中”的意味。',
    'conjure up':'conjure up images / memories；常指使人联想，不是把记忆“制造”出来。',
    'let alone':'通常在否定或不足的陈述后递进：前一项尚且不行，后一项更不必说。',
    'all the more':'用于比较级式强调程度更甚；常带 because / for 原因。',
    'to be sure':'让步用语，后面常接 but；不等于 be sure to do（务必做）。',
    'anything but':'anything but + 形容词：完全不；与 nothing if not 的方向相反。',
    'make sth. up':'分清 make up（补上、组成）与 make up for（弥补损失）；不同义项不能套同一改写。',
    'lose out':'lose out to someone；竞争中输给某人或被取代。',
    'term':'本书此义对应完整短语 in terms of；不能把裸词 term 换成 with regard to。',
    'be out to do':'be out to + 动词原形：一心要做；out 在这里不是外出。',
    'back up':'back up a claim with evidence；代词可用 back it up。',
    'for all':'让步义后接名词，相当于 despite；不是每处都作“为所有人”。',
    'insofar as':'连接从句，限定成立程度；不可随意删掉范围限制。',
    'be a far (long) cry from':'from 后接比较对象；强调相差很远。',
    'not least':'强调尤其；虽带 not，整体不是“不重要”。',
    'vice versa':'指前述关系反过来也成立；使用时必须有清楚的前项。',
    'in that':'后接从句，说明前述判断成立的具体原因或方面。',
    'in the midst of':'后接名词或 doing，表示在某情况或活动之中。',
    'out of':'动机义后接情绪或原因名词，如 out of curiosity；其他义项需另辨。',
    'on the part of':'后接行为主体；改用 by 或 from 仍要检查整句结构。',
    'as if':'后接从句或省略结构；假设情况可能需要虚拟语气。',
    'at the expense of':'后接被牺牲或受损的事物；不能省去负面代价意味。',
    'in light of':'后接需要考虑的事实或情况；偏正式语域。',
    'with regard to':'to 是介词，后接名词或动名词；谈及某一话题。'
  };
  function grammar(pos){
    if(/vt/.test(pos)&&/vi/.test(pos))return '本义项可及物或不及物；改写时按原例句保留或补出宾语。';
    if(/vt/.test(pos))return '及物动词：连同宾语记忆；改写时保留动作对象并调整时态、语态。';
    if(/vi/.test(pos))return '不及物动词：不要硬加直接宾语；需要对象时按原搭配保留介词。';
    if(/adj/.test(pos))return '形容词：留意所修饰的名词；换成分词或关系从句时需要调整句式。';
    if(/adv/.test(pos))return '副词：注意修饰范围；换成介词短语时通常要调整位置。';
    if(/n\./.test(pos))return '名词：改成解释性名词短语时检查冠词、单复数和可数性；上位词单独使用可能丢失细节。';
    if(/prep/.test(pos))return '介词：后接名词性成分；替换为连词时须重组为从句。';
    if(/conj/.test(pos))return '连词：连接从句；不可与只接名词的介词机械互换。';
    return '固定表达：把整段结构一起记，不能逐词直译；核对后接名词、动名词或从句。';
  }
  const entries=(window.GRE_VOCAB||[]).map(v=>{
    const senses=[];
    (v.bs||[]).forEach((raw,index)=>{
      // This OCR row is morphology, not a second meaning of lie.
      if(v.en==='lie'&&raw.z==='变形')return;
      const key=fold(v.en)+':'+index,patch=corrections[key],s={...raw,...patch};
      const supplied=examples[key];
      const example=(s.x||[])[0]||supplied||null;
      const usage=[s.h?'完整表达：'+s.h:'',s.n?'书中用法：'+s.n:'',phraseNotes[v.en]||notes[fold(v.en)]||'',grammar(s.p)].filter(Boolean);
      senses.push({index,pos:s.p||v.pos,zh:s.z,form:s.h||v.en,gloss:s.e,
        examples:example?[{en:example[0],zh:example[1],source:s.exampleSource||((s.x||[]).length?(patch&&patch.x?'校订书中搭配':'书中搭配'):'补充搭配（另编）')}]:[],
        usage,source:patch&&patch.e?'释义整理 / 校订':'原书英文释义',
        caution:fold(v.en)==='beg the question'?notes['beg the question']:''});
    });
    return {id:v.id,w:v.en,l:v.l,senses};
  });
  const byWord=new Map(entries.map(e=>[fold(e.w),e]));
  // Apply only explicit corrections to ordinary learning displays as well.
  // The underlying GRE_VOCAB and all ids/progress keys remain untouched.
  function correctedWord(v){
    if(!(v.bs||[]).some((s,i)=>corrections[fold(v.en)+':'+i]))return null;
    const bs=v.bs.map((s,i)=>{
      const patch=corrections[fold(v.en)+':'+i];
      return {...s,...patch,exampleSource:patch&&patch.x?(patch.exampleSource||'书中例句（校订）'):s.exampleSource};
    });
    return {bs,pos:bs[0].p||v.pos,zh:bs.map(s=>(s.p||'')+' '+s.z).join('；'),
      zs:bs[0].z.split('；').slice(0,2).join('；'),def:bs.map(s=>(s.p||'')+' '+s.e),corrected:true};
  }
  window.GRE_PARAPHRASES={entries,get:word=>byWord.get(fold(word)),grammar,correctedWord};
})();
