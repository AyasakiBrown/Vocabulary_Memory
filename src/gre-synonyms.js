/* 同义串记：词头来自《GRE 核心词汇一本通》；搭配、中文提示和辨析为另行编写。
 * 每组只连接指定义项，不表示任意语境等价，不将 A≈B≈C 推导成 A≈C。
 * 原词库的 id / List / 学习记录保持不变。 */
(function(){
  'use strict';
  const groups=[];
  function add(id,topic,title,anchor,note,rows){
    groups.push({id,topic,title,anchor,note,items:rows.map(r=>{const [w,phrase,zh,hint]=r.split('|');return {w,phrase,zh,hint};})});
  }
  add('ease','变化与影响','减轻不良影响','make something less severe','共同方向是“变得没那么糟”；按宾语分别记，不要把改善、缓解症状和消除原因混成一回事。',[
    'alleviate|alleviate poverty|缓解贫困|减轻痛苦、负担或困难',
    'mitigate|mitigate the impact|减轻影响|降低危害或严重程度',
    'palliate|palliate the symptoms|缓解症状|通常强调治标，未消除病因',
    'ameliorate|ameliorate living conditions|改善生活条件|使不良状况好转；正式用语',
    'assuage|assuage fears|缓解恐惧|常搭配情绪、疑虑或欲望'
  ]);
  add('worsen','变化与影响','加重与放大','make something worse or stronger','前两个强调变坏；后两个也能用于中性或积极事物。',[
    'aggravate|aggravate the problem|加重问题|已有的问题更严重',
    'exacerbate|exacerbate tensions|加剧紧张局势|正式用语，常指冲突或不良状况',
    'magnify|magnify the risks|放大风险|放大程度，也可指夸大',
    'intensify|intensify competition|加剧竞争|强度增加，不一定变坏'
  ]);
  add('obstruct','变化与影响','阻碍进展','make progress difficult','阻碍不等于完全阻止；inhibit 还可指抑制反应或使人拘谨。',[
    'hamper|hamper recovery|妨碍恢复|条件或障碍使行动困难',
    'impede|impede progress|阻碍进展|妨碍前进或发展',
    'hinder|hinder development|阻碍发展|通用的妨碍',
    'inhibit|inhibit growth|抑制生长|限制过程、反应或行为'
  ]);
  add('promote','变化与影响','促进过程','help something happen','facilitate 侧重更容易，expedite 侧重更快，foster 侧重逐步培养。',[
    'facilitate|facilitate communication|促进沟通|使过程顺畅',
    'expedite|expedite the process|加快进程|加速处理',
    'foster|foster cooperation|培养合作|鼓励事物发展'
  ]);
  add('support-evidence','论证与表达','用证据支持观点','support a claim with evidence','支持、提供实证、独立印证的力度不同；有证据支持不自动等于已经证明。',[
    'bolster|bolster the argument|加强论点|使论点更有力',
    'buttress|buttress the claim|支撑主张|强调提供支撑',
    'substantiate|substantiate the claim|为主张提供实证|用事实或证据支持',
    'corroborate|corroborate the account|印证叙述|其他证据与原叙述相符'
  ]);
  add('cause','变化与影响','引起与引发','cause something to happen','elicit 常搭配回答、回应或反应；不泛指所有因果。',[
    'trigger|trigger a debate|引发争论|像启动开关一样引起',
    'engender|engender trust|产生信任|产生情绪、状况或结果；正式',
    'elicit|elicit a response|引出回应|通过提问或刺激使对方回应'
  ]);
  add('decline','变化与影响','逐渐减弱或减少','become less','注意及物性：wane、ebb、dwindle 在这些搭配中由事物自身作主语。',[
    'wane|enthusiasm begins to wane|热情开始减退|力量或程度逐渐减弱',
    'ebb|confidence begins to ebb|信心开始消退|像退潮一样消退',
    'dwindle|resources begin to dwindle|资源开始减少|数量逐渐变少',
    'diminish|diminish in importance|重要性降低|大小、程度或价值降低',
    'abate|the storm begins to abate|风暴开始减弱|强度减退；也可作及物动词'
  ]);
  add('increase','变化与影响','增加与扩大','increase something','augment 多指增加数量或规模；amplify 也可指增强声音、效果或补充说明。',[
    'augment|augment the supply|增加供应|增加已有数量',
    'amplify|amplify the effect|放大效果|增强强度或影响'
  ]);
  add('cut','变化与影响','削减与缩短','reduce or shorten something','curtail 是削减；truncate 是截短；retrench 常与削减开支有关。',[
    'curtail|curtail spending|削减开支|减少规模或持续时间',
    'truncate|truncate the speech|截短演讲|截去一部分，常是末尾',
    'retrench|retrench expenditure|紧缩开支|财务上的削减；正式'
  ]);
  add('noticeable','程度与数量','显著与突出','easy to notice','显眼、重要、引人注意各有侧重。',[
    'conspicuous|a conspicuous difference|明显的差异|容易被注意到',
    'salient|the salient features|突出特征|最值得关注的特点',
    'prominent|a prominent feature|突出的特征|位置或重要性突出',
    'striking|a striking contrast|鲜明的对比|强烈吸引注意'
  ]);
  add('small-importance','程度与数量','微不足道','too small to matter much','negligible 强调小到可忽略；trivial 可带“琐碎”的评价。',[
    'trivial|a trivial detail|琐碎细节|不重要的小事',
    'negligible|a negligible effect|可忽略的影响|程度极小',
    'insignificant|an insignificant difference|不显著的差异|影响或重要性小'
  ]);
  add('necessary','程度与数量','必需与不可或缺','absolutely necessary','integral 强调构成整体的重要部分；imperative 常用于迫切必要的行动。',[
    'indispensable|an indispensable tool|不可缺少的工具|没有它不行',
    'imperative|an imperative need|迫切的需要|极有必要；正式',
    'integral|an integral part|不可分割的组成部分|整体必需的部分'
  ]);
  add('shortage','程度与数量','缺乏与不足','not enough of something','dearth / paucity of 后接名词。modicum 只表示少量，不能直接当作“缺乏”。',[
    'dearth|a dearth of evidence|证据不足|强调缺少需要的东西',
    'paucity|a paucity of data|数据匮乏|量少或不足；正式',
    'scarcity|a scarcity of resources|资源短缺|可获得的供应不足'
  ]);
  add('abundance','程度与数量','丰富与过剩','a large amount of something','前三个常含“过多”；profusion 强调丰富，未必贬义。',[
    'surfeit|a surfeit of information|信息过量|超过需要的量',
    'glut|a glut of products|产品过剩|供应超过需求',
    'plethora|a plethora of options|过多的选项|数量很多，常暗示过多',
    'profusion|a profusion of flowers|繁花盛开|大量、丰富'
  ]);
  add('brief','时间与变化','短暂与转瞬即逝','lasting only a short time','按“瞬间—短期—过渡”记差异，不必强排固定时长。',[
    'fleeting|a fleeting glimpse|匆匆一瞥|很快消失',
    'ephemeral|ephemeral fame|短暂的名声|存续时间很短；正式',
    'transitory|a transitory phase|过渡阶段|暂时存在',
    'evanescent|an evanescent glow|转瞬即逝的光辉|逐渐消散；文学用语',
    'momentary|a momentary hesitation|片刻犹豫|只持续一会儿'
  ]);
  add('lasting','时间与变化','长久与不变','lasting or remaining unchanged','长久不等于不变；perennial 还可表示反复出现。',[
    'enduring|an enduring influence|持久的影响|持续很长时间',
    'perennial|a perennial problem|长期反复的问题|长存或反复发生',
    'immutable|an immutable principle|不可改变的原则|不能改变'
  ]);
  add('unclear','论证与表达','含糊不清','not clearly expressed','ambiguous 可有多种解释；equivocal 常含不明确表态；nebulous 是模糊未成形。',[
    'ambiguous|an ambiguous statement|有歧义的陈述|存在多种解读',
    'equivocal|an equivocal answer|模棱两可的回答|未明确承诺或表态',
    'nebulous|a nebulous idea|模糊的想法|界限或细节不清'
  ]);
  add('clear','论证与表达','清楚易懂','easy to understand','这里限于表达清楚；accessible 还可指可进入、可获得。',[
    'comprehensible|a comprehensible explanation|可以理解的解释|能够被理解',
    'intelligible|intelligible speech|听得懂的话|语言或声音可理解',
    'accessible|an accessible introduction|易懂的入门介绍|普通读者也能理解',
    'lucid|a lucid explanation|清晰的解释|表达有条理、易懂',
    'pellucid|pellucid prose|清澈明晰的文笔|非常清晰；文学或正式用语'
  ]);
  add('obscure','论证与表达','晦涩难懂','difficult to understand','cryptic 常指信息隐晦；abstruse 多指思想或学问艰深。',[
    'obscure|an obscure passage|晦涩的段落|意思不清楚',
    'opaque|opaque language|难懂的语言|比喻不透明、难理解',
    'cryptic|a cryptic message|隐晦的信息|简短而神秘、需要解读',
    'abstruse|an abstruse theory|深奥的理论|艰深而难理解'
  ]);
  add('concise','论证与表达','简洁与少言','using few words','concise / succinct 通常褒义；curt 常暗示不礼貌；laconic 强调用词少。',[
    'concise|a concise summary|简明摘要|少而清楚',
    'succinct|a succinct account|简洁的叙述|紧凑而准确',
    'laconic|a laconic reply|寥寥数语的回答|表达很简短',
    'curt|a curt reply|生硬简短的回答|短到显得不友好'
  ]);
  add('wordy','论证与表达','冗长与啰嗦','using too many words','前三个用于表达；后两个常形容人话多。',[
    'verbose|a verbose explanation|啰嗦的解释|不必要的词太多',
    'long-winded|a long-winded speech|冗长的演说|说得太久、让人厌倦',
    'rambling|a rambling account|散漫冗长的叙述|缺乏条理或离题',
    'garrulous|a garrulous guest|喋喋不休的客人|常谈琐事，偏贬义',
    'loquacious|a loquacious host|健谈的主人|说话很多；正式'
  ]);
  add('careful','做事方式','细致认真','taking great care','scrupulous 也可指道德上谨慎正直；这里取认真检查义。',[
    'meticulous|meticulous planning|细致的规划|尤其注意细节',
    'scrupulous|scrupulous attention to detail|对细节一丝不苟|认真而谨慎',
    'painstaking|painstaking research|煞费苦心的研究|花大量时间精力'
  ]);
  add('superficial','做事方式','粗略与敷衍','not examining details fully','粗略不必然是敷衍；perfunctory 带缺乏兴趣或投入的评价。',[
    'cursory|a cursory glance|匆匆一瞥|快速、未仔细看',
    'perfunctory|a perfunctory inspection|敷衍的检查|只为走程序',
    'sketchy|a sketchy account|不详尽的叙述|细节不足'
  ]);
  add('complex','论证与表达','复杂与曲折','complicated and difficult','intricate 可赞叹精细；convoluted 常批评过分复杂；knotty 强调难解决。',[
    'intricate|an intricate pattern|复杂精细的图案|许多部分互相交织',
    'convoluted|a convoluted argument|复杂难懂的论证|曲折得难以理解',
    'tortuous|tortuous reasoning|迂回复杂的推理|过程曲折',
    'knotty|a knotty problem|棘手的问题|难以解开'
  ]);
  add('demanding','做事方式','艰巨与费力','requiring much effort','strenuous 常偏体力；taxing 可偏脑力；onerous 常形容负担。',[
    'arduous|an arduous journey|艰辛的旅程|长期费力',
    'onerous|onerous duties|繁重的职责|负担重',
    'taxing|a taxing task|费神的任务|消耗精力或能力',
    'strenuous|strenuous exercise|剧烈运动|需要较大体力',
    'exacting|exacting standards|严格的标准|要求很高'
  ]);
  add('new','评价与特征','新颖有创意','new and different','original 还可表示最初的；此处只取有独创性义。',[
    'novel|a novel approach|新颖的方法|以前少见的新办法',
    'original|an original idea|独创的想法|非抄袭，有创造性'
  ]);
  add('ordinary','评价与特征','平淡乏味','ordinary or uninteresting','banal 偏老套；vapid 偏无聊空洞；mundane 也可中性地表示日常。',[
    'banal|a banal remark|老套的评论|毫无新意',
    'vapid|vapid conversation|乏味空洞的谈话|无趣、缺乏内容',
    'prosaic|a prosaic explanation|平淡的解释|缺少想象力或诗意',
    'pedestrian|pedestrian prose|平庸的文笔|不够生动或出色',
    'mundane|mundane tasks|日常琐事|普通、日常'
  ]);
  add('outdated','时间与变化','过时与淘汰','no longer modern or useful','obsolete 强调已被替代；archaic / antediluvian 强调古旧。',[
    'obsolete|obsolete technology|淘汰的技术|已不再使用或需要',
    'outmoded|an outmoded method|过时的方法|已不适合当前需要',
    'archaic|archaic language|古旧的语言|属于很早的时代',
    'antediluvian|antediluvian attitudes|陈旧至极的态度|夸张地说老掉牙'
  ]);
  add('fair','人物与态度','公正与客观','not influenced by personal bias','dispassionate 强调不被情绪左右；不等于冷漠。',[
    'impartial|an impartial judge|公正的法官|不偏袒任何一方',
    'evenhanded|an evenhanded assessment|公平的评价|各方一视同仁',
    'dispassionate|a dispassionate analysis|客观冷静的分析|克制个人情绪'
  ]);
  add('trusting','人物与态度','轻信与天真','too ready to trust','ingenuous 也可褒指坦率纯真；gullible 明确强调容易被骗。',[
    'credulous|a credulous audience|轻信的听众|轻易相信说法',
    'gullible|gullible consumers|易受骗的消费者|容易被欺骗',
    'naive|a naive assumption|天真的假设|缺少经验与判断',
    'ingenuous|an ingenuous question|天真坦率的问题|没有城府'
  ]);
  add('credible','论证与表达','可信与有说服力','seeming believable','plausible 只是听起来说得通，未保证为真；cogent 强调论证有力。',[
    'credible|a credible account|可信的叙述|值得相信',
    'plausible|a plausible explanation|看似合理的解释|似乎有可能成立',
    'cogent|a cogent argument|有力的论证|清楚而有说服力',
    'convincing|convincing evidence|令人信服的证据|使人相信'
  ]);
  add('unsupported','论证与表达','没有根据、站不住脚','not supported by good reasons','baseless / unfounded 侧重缺乏依据；untenable 侧重无法维护或辩护。',[
    'baseless|a baseless accusation|无端的指控|没有事实基础',
    'unfounded|unfounded fears|没有根据的担忧|没有证据或理由',
    'untenable|an untenable position|站不住脚的立场|无法合理地辩护'
  ]);
  add('insightful','人物与态度','敏锐与精明','showing good judgment','canny 常见于精明算计；sagacious 偏睿智，不能一律替成聪明。',[
    'canny|a canny investor|精明的投资者|有实际判断力',
    'shrewd|a shrewd decision|精明的决定|判断敏锐、务实',
    'astute|an astute observer|敏锐的观察者|善于迅速看懂局势',
    'perceptive|a perceptive comment|有洞察力的评论|觉察别人没注意到的东西',
    'sagacious|a sagacious adviser|睿智的顾问|明智而有远见；正式'
  ]);
  add('secret','做事方式','秘密与偷偷摸摸','done without being noticed','covert 较中性；furtive 常带心虚感；clandestine 常指不被允许的秘密活动。',[
    'covert|a covert operation|秘密行动|隐蔽进行',
    'clandestine|a clandestine meeting|秘密会面|往往为了隐瞒不当活动',
    'surreptitious|a surreptitious glance|偷偷一瞥|避免被注意到',
    'furtive|a furtive glance|鬼祟的一瞥|怕被发现的样子'
  ]);
  add('frank','论证与表达','坦率直接','speaking openly','forthright 比 candid 更强调直接、有力地表达立场。',[
    'candid|a candid assessment|坦诚的评价|不隐瞒真实想法',
    'forthright|a forthright answer|直截了当的回答|明确而直接'
  ]);
  add('harsh','论证与表达','尖刻的言辞','harsh and hurtful language','vitriolic 的恶毒程度通常更强；cutting 强调伤人。',[
    'acerbic|an acerbic comment|尖刻的评论|辛辣、挖苦',
    'vitriolic|a vitriolic attack|恶毒的抨击|强烈敌意或仇恨',
    'cutting|a cutting remark|伤人的话|尖锐得伤害感情'
  ]);
  add('criticize','论证与表达','严厉批评','criticize severely','censure 常指正式谴责；reprehend 较少见，优先掌握阅读识别。',[
    'chastise|chastise someone for negligence|因疏忽训斥某人|责骂、严厉批评',
    'castigate|castigate officials for corruption|严斥官员腐败|猛烈谴责',
    'censure|censure someone for misconduct|谴责某人的不当行为|正式表示强烈不赞成',
    'reprehend|reprehend irresponsible conduct|斥责不负责的行为|正式或较少见的责备'
  ]);
  add('praise','论证与表达','赞扬与称许','praise someone or something','extol 常搭配 virtues；applaud 还可指鼓掌，不能在所有语境互换。',[
    'laud|laud the achievement|高度赞扬成就|正式赞扬',
    'extol|extol the virtues|赞颂优点|热烈称赞',
    'commend|commend someone for courage|赞扬某人的勇气|表达认可',
    'applaud|applaud the decision|赞许决定|公开表示赞同'
  ]);
  add('endorse','论证与表达','支持与维护','support an idea or principle','champion 强调积极争取；uphold 强调维护；endorse 强调表态认可。',[
    'endorse|endorse the proposal|支持提案|公开认可',
    'uphold|uphold the principle|维护原则|坚持或维持',
    'champion|champion equal rights|积极维护平等权利|为某事业发声'
  ]);
  add('refute','论证与表达','反驳与证伪','show or argue that a claim is wrong','controvert 可以只是提出反驳；disprove 明确强调证明为假。',[
    'refute|refute the claim|反驳主张|通常指用理由或证据驳倒',
    'controvert|controvert the assertion|反驳断言|正式地争辩、反对',
    'disprove|disprove the hypothesis|证伪假说|证明不成立'
  ]);
  add('reject','论证与表达','拒绝与撤回立场','reject or give up a position','recant 必须涉及自己先前的说法或信念；不泛指拒绝别人的提议。',[
    'repudiate|repudiate the allegation|否认指控|断然拒绝接受',
    'recant|recant a statement|撤回声明|公开收回先前所说',
    'renounce|renounce a claim|放弃权利主张|正式放弃或宣布不再支持'
  ]);
  add('admit','论证与表达','让步承认','admit that a point is true','这里 grant 是承认，不是授予；都常用 that 从句。',[
    'concede|concede that the plan has flaws|承认计划有缺陷|常带不情愿的让步',
    'grant|grant that the evidence is limited|姑且承认证据有限|论证中承认对方一点'
  ]);
  add('attribute','论证与表达','归因于','explain something by its cause','固定结构：ascribe / attribute / impute A to B。impute 常用于过错或动机。',[
    'ascribe|ascribe the success to teamwork|把成功归于合作|认为某因素是原因',
    'attribute|attribute the change to policy|把变化归因于政策|中性地指出原因',
    'impute|impute bad motives to someone|认为某人动机不良|常含负面归责'
  ]);
  add('predict','时间与变化','预见与预示','indicate what may happen','foresee / foretell 多以人作主语；presage / portend 常以迹象或事件作主语。',[
    'foresee|foresee future difficulties|预见未来困难|提前看出可能发生的事',
    'foretell|foretell the future|预言未来|事先说出将发生的事',
    'presage|presage a major change|预示重大变化|成为先兆',
    'portend|portend disaster|预示灾难|常指不祥的预兆'
  ]);
  add('bypass','做事方式','绕开障碍或问题','find a way around something','circumvent 可含巧妙规避规则；sidestep 可指回避回答。',[
    'circumvent|circumvent restrictions|规避限制|找到绕开限制的办法',
    'bypass|bypass the obstacle|绕过障碍|不经过原来的路径',
    'sidestep|sidestep the question|回避问题|避免正面处理'
  ]);
  add('avoid','做事方式','主动避免','deliberately avoid','shun 常指避开人或事物；eschew 较正式，常指不采用某种做法。',[
    'shun|shun publicity|避开公众关注|有意远离',
    'eschew|eschew violence|避免使用暴力|有意不做或不采用'
  ]);
  add('calm','人物与态度','安抚与平息怒气','make someone less angry','appease 可含让步讨好的意味；不是所有安抚都等于解决分歧。',[
    'placate|placate angry customers|安抚愤怒的顾客|使怒气平息',
    'appease|appease the critics|安抚批评者|往往通过让步',
    'mollify|mollify an angry colleague|缓和同事的怒气|使不满减轻'
  ]);
  add('persuade','人物与态度','哄劝','gently persuade someone','常用 coax / cajole someone into doing something；cajole 可含花言巧语。',[
    'coax|coax someone into trying again|哄劝某人再试一次|耐心温和地劝',
    'cajole|cajole someone into agreeing|哄得某人同意|用讨好或甜言蜜语劝'
  ]);
  add('puzzle','人物与态度','使困惑','make someone unable to understand','confound 还有推翻预期、混淆等义；此组只取困惑义。',[
    'perplex|perplex the reader|使读者困惑|令人费解',
    'confound|confound the experts|使专家困惑|使人意外而无法理解',
    'flummox|flummox the audience|难住听众|非正式的使困惑',
    'bewilder|bewilder a newcomer|使新来者不知所措|因复杂或陌生而迷惑'
  ]);
  add('brave','人物与态度','勇敢与大胆','willing to face risk','audacious 有时带冒失意味；bold 也可用于计划和想法。',[
    'intrepid|an intrepid explorer|无畏的探险者|面对危险不害怕',
    'audacious|an audacious plan|大胆的计划|敢冒很大风险',
    'bold|a bold decision|大胆的决定|有勇气或信心'
  ]);
  add('cautious','人物与态度','谨慎与警惕','careful about possible risks','prudent 偏审慎决策；wary 常用 be wary of。',[
    'circumspect|a circumspect approach|谨慎的做法|先考虑各种后果',
    'prudent|a prudent investment|审慎的投资|为将来打算、避免风险',
    'wary|wary of strangers|对陌生人警惕|不轻信，留意危险'
  ]);
  add('determined','人物与态度','坚定不移','not giving up easily','tenacious 强调抓住不放；steadfast 强调立场不动摇。',[
    'tenacious|tenacious resistance|顽强的抵抗|坚持到底',
    'steadfast|steadfast support|坚定的支持|忠诚而不动摇'
  ]);
  add('changeable','人物与态度','反复无常','changing unpredictably','erratic 可形容非人的表现；fickle 常指感情或忠诚多变。',[
    'capricious|a capricious leader|反复无常的领导|随心情任性变化',
    'erratic|erratic performance|不稳定的表现|变化无规律',
    'inconstant|an inconstant friend|靠不住的朋友|态度或忠诚不恒定',
    'fickle|fickle loyalties|多变的忠诚|轻易改变喜好或支持'
  ]);
  add('compliant','人物与态度','顺从与愿意接受','willing to cooperate','amenable 常接 to；tractable 还可形容问题易处理。',[
    'tractable|a tractable child|听话的孩子|容易引导',
    'compliant|a compliant employee|顺从的员工|愿意服从要求',
    'amenable|amenable to suggestions|乐于接受建议|愿意配合或受影响'
  ]);
  add('stubborn','人物与态度','顽固不肯改变','refusing to change','obdurate 比一般 stubborn 更强调不为劝说或同情所动。',[
    'stubborn|a stubborn refusal|固执的拒绝|不愿改变',
    'obstinate|an obstinate opponent|顽固的对手|坚持己见，难以说服',
    'obdurate|an obdurate attitude|顽固冷硬的态度|劝说也不动摇'
  ]);
  add('friendly','人物与态度','友好与热情','friendly in manner or relations','affable 常形容人；amicable 常形容关系或协商；convivial 偏社交气氛。',[
    'affable|an affable host|随和的主人|亲切、好交谈',
    'cordial|a cordial welcome|热情的欢迎|真诚友好',
    'convivial|a convivial atmosphere|欢乐友好的气氛|适于社交欢聚',
    'amicable|an amicable settlement|友好的和解|没有敌意地达成一致'
  ]);
  add('arrogant','人物与态度','傲慢与居高临下','acting superior to others','supercilious 特别强调看不起别人。',[
    'arrogant|an arrogant attitude|傲慢的态度|自认为优于别人',
    'supercilious|a supercilious smile|轻蔑高傲的笑|居高临下地看待别人'
  ]);
  add('modest','人物与态度','谦逊不张扬','not boasting about yourself','modest 也可形容数量适中；此处只取人的态度义。',[
    'unassuming|an unassuming manner|谦逊的举止|不摆架子',
    'modest|modest about achievements|不夸耀自己的成就|不自夸'
  ]);
  add('honest','人物与态度','正直与诚实','honest moral character','probity、rectitude 较正式；integrity 还可指完整性。',[
    'probity|financial probity|财务上的廉正|诚实可靠',
    'rectitude|moral rectitude|品行端正|遵守道德原则',
    'integrity|personal integrity|个人操守|诚实并坚持原则'
  ]);
  add('deception','人物与态度','欺骗与不诚实','deliberate dishonesty','mendacity 指撒谎；duplicity 指两面派；disinformation 指故意散布的假信息。',[
    'mendacity|political mendacity|政治上的谎言|虚假不诚实的言行',
    "duplicity|expose someone's duplicity|揭穿某人的两面手法|口是心非的欺骗",
    'disinformation|spread disinformation|散布虚假信息|有意误导的信息'
  ]);
  add('false','评价与特征','虚假与似是而非','not genuine or sound','counterfeit 常指仿冒实物；specious 看似有理但实际上不成立。',[
    'spurious|a spurious claim|虚假的主张|不真实或不可靠',
    'counterfeit|counterfeit currency|假币|仿制以冒充真品',
    'specious|a specious argument|似是而非的论证|表面合理，实则有问题'
  ]);
  add('relevant','论证与表达','相关与切题','relevant to the matter','常用 be germane / pertinent to；语气比 relevant 正式。',[
    'germane|germane to the discussion|与讨论密切相关|紧扣主题',
    'pertinent|pertinent to the question|切合问题|与当前事项相关'
  ]);
  add('irrelevant','论证与表达','无关与不影响结论','not relevant to the issue','immaterial 表示对当前判断不重要，不代表事物本身毫无价值。',[
    'extraneous|extraneous details|无关细节|不属于所需内容',
    'irrelevant|irrelevant information|不相关的信息|与主题无关',
    'immaterial|immaterial to the decision|不影响这项决定|对当前事项无关紧要'
  ]);
  add('different','评价与特征','不同与多样','different in composition or kind','heterogeneous 指一个集合内部多样；disparate 强调差异大。',[
    'heterogeneous|a heterogeneous population|构成多样的人群|成员性质不同',
    'disparate|disparate sources|迥异的来源|很不相同',
    'dissimilar|dissimilar approaches|不同的方法|不相似'
  ]);
  add('compatible','评价与特征','一致与相容','fitting together without conflict','congruent with 偏一致；compatible with 偏能并存。',[
    'congruent|congruent with the evidence|与证据一致|相符合',
    'compatible|compatible with the theory|与理论相容|没有冲突，可并存'
  ]);
  add('similar','评价与特征','相似可比','similar in relevant respects','comparable 不表示完全相同；parallel 也可指相应、类似的发展。',[
    'comparable|comparable results|可比较的结果|在重要方面相似',
    'parallel|parallel developments|类似的发展|存在相似的过程'
  ]);
  add('precursor','时间与变化','前身与先兆','something that comes before','forerunner / precursor 可指前身；harbinger 常指预示未来的迹象。',[
    'precursor|a precursor to modern medicine|现代医学的先驱|先出现并影响后来事物',
    'forerunner|a forerunner of the computer|计算机的前身|后续发展的早期形式',
    'harbinger|a harbinger of change|变化的先兆|预示将发生的事'
  ]);
  add('remains','时间与变化','残余与遗迹','something left behind','relic 常是实物；vestige 常是极少残留；trace 可只是痕迹。',[
    'vestige|a vestige of the past|过去的残迹|残存的一小部分',
    'relic|a relic of the past|昔日的遗物|留存至今的物件或习俗',
    'remnant|a remnant of the forest|森林残存部分|留下的一部分',
    'trace|a trace of resentment|一丝怨恨|很少的迹象或痕迹'
  ]);
  add('inclination','人物与态度','倾向与偏好','a tendency or liking','predilection for 是偏爱；proclivity / propensity 常接 for 或 to do。',[
    'predilection|a predilection for classical music|偏爱古典音乐|特别喜爱',
    'proclivity|a proclivity for risk-taking|冒险倾向|习惯性的倾向，常偏负面',
    'propensity|a propensity to exaggerate|夸大的倾向|容易采取某种行为'
  ]);
  add('difficulty','评价与特征','难题与两难','a difficult problem or choice','dilemma 是两难；quandary 是不知如何选择；conundrum 是费解的难题。',[
    'dilemma|face an ethical dilemma|面临伦理两难|难以取舍',
    'quandary|be in a quandary|陷入无所适从|不知道该怎么办',
    'conundrum|solve a conundrum|解开难题|令人困惑的问题'
  ]);
  add('respect','人物与态度','尊敬与敬重','respect someone highly','venerate 表达尤其深的敬意；honor 还可指以行动表彰。',[
    'venerate|venerate a spiritual leader|崇敬精神领袖|深深敬重',
    'honor|honor a respected teacher|向敬爱的老师致敬|表达尊敬',
    'esteem|esteem someone highly|高度敬重某人|给以很高评价'
  ]);
  add('postpone','时间与变化','推迟到以后','move something to a later time','defer to somebody 是听从，不属于推迟义。',[
    'defer|defer the decision|推迟决定|延后处理；正式',
    'postpone|postpone the meeting|推迟会议|改到以后举行'
  ]);
  add('damage','变化与影响','削弱与损害','make something less effective','undermine / erode 常暗示逐步削弱；vitiate 较正式。',[
    'undermine|undermine confidence|削弱信心|暗中或逐渐破坏基础',
    'impair|impair judgment|损害判断力|使功能变差',
    'vitiate|vitiate the argument|损害论证的效力|削弱价值或有效性',
    'erode|erode public trust|逐渐侵蚀公众信任|一点点消耗'
  ]);
  add('reveal','论证与表达','透露与公开','make hidden information known','divulge 尤其常指秘密或私人信息。',[
    'disclose|disclose the findings|公开调查结果|使此前未知的信息为人所知',
    'divulge|divulge a secret|泄露秘密|透露保密内容'
  ]);
  add('conceal','论证与表达','掩盖与掩饰','hide the true nature','belie 可表示表象与事实不符，或证明说法不实；不等于故意说谎。',[
    'cloak|cloak the plan in secrecy|把计划笼罩在秘密中|用某种外衣掩盖',
    'mask|mask anxiety with a smile|用微笑掩饰焦虑|遮住真实情绪',
    'belie|a smile that belies anxiety|掩盖焦虑的微笑|表象给出与实情不符的印象'
  ]);
  add('give-up','做事方式','放弃与让出','give something up','cede 强调交给别人；forgo 是选择不享用或不行使。',[
    'relinquish|relinquish control|放弃控制权|不再持有',
    'cede|cede territory|割让领土|让给另一方',
    'forgo|forgo an opportunity|放弃一次机会|不去接受或利用'
  ]);
  add('harmful','评价与特征','不利与有害','causing harm or disadvantage','adverse 可指不利条件；pernicious 强调严重、往往渐进的危害。',[
    'adverse|adverse effects|不利影响|负面或不利',
    'deleterious|deleterious effects on health|对健康的有害影响|造成损害；正式',
    'pernicious|a pernicious influence|有害的影响|严重、潜在或逐步的危害'
  ]);
  add('futile','评价与特征','徒劳与无结果','not producing a useful result','fruitless 强调没结果；pointless 强调没有意义或目的。',[
    'futile|a futile attempt|徒劳的尝试|不会达到目的',
    'fruitless|a fruitless search|无果的搜寻|没有得到结果',
    'pointless|a pointless argument|无意义的争论|没有实际用处'
  ]);
  add('respite','时间与变化','暂时平息与缓解','a temporary easing','lull 是活动强度暂降；respite 是喘息机会；relief 是痛苦减轻。',[
    'lull|a lull in the fighting|战斗暂时平息|活动减少的时段',
    'respite|a respite from work|工作之余的喘息|短暂脱离压力',
    'relief|relief from pain|疼痛的缓解|痛苦或压力减轻'
  ]);
  add('awkward','评价与特征','笨重难操作','difficult to handle','两词可用于实物或系统；强调不方便，不仅是重量大。',[
    'cumbersome|a cumbersome procedure|繁琐的程序|复杂笨重而不方便',
    'unwieldy|an unwieldy system|难操作的系统|规模或形状使其难管理'
  ]);
  add('famous','评价与特征','有名与杰出','known and admired','distinguished / illustrious 强调成就与声望；不是所有有名都值得尊敬。',[
    'renowned|a renowned scholar|著名学者|广为人知并受认可',
    'celebrated|a celebrated author|知名作家|因作品或成就闻名',
    'illustrious|an illustrious career|辉煌的职业生涯|卓越而受敬重',
    'distinguished|a distinguished scientist|杰出的科学家|成就突出、受尊敬'
  ]);

  // Exclude suspect OCR attribution, derived-form hints and non-equivalent senses
  // from the headword index. This is not an assertion that the PDF itself is wrong.
  // accessible -> obscure/opaque was checked on PDF page 17 (printed p.4):
  // the synonyms belong to its derivative inaccessible. Keep gre.js untouched.
  const omit={
    accessible:'*', explicable:'*', remarkable:'*', credible:'*', blemish:'*', hearten:'*',
    consequential:'*', perturb:'*', flaw:'*', precedent:'*', inspired:'*', exceptional:'*',
    tactful:'*', ground:'*', perceptible:'*', warrant:'*', qualify:'*', assail:'*', politic:'*',
    dearth:'modicum', modicum:'dearth', palpable:'intangible', tangible:'impalpable',
    placate:'unyielding', parallel:'unprecedented', abate:'undiminished',
    expedite:'exacerbate', controvert:'indubitable', yield:'implacable',
    proscribe:'exacting', plausible:'incredible', tractable:'stubborn', distinguished:'average',
    exacting:'proscriptive', concrete:'conclusive', anonymous:'obscure',
    deplete:'replete', comprehensive:'polymathic', encyclopedic:'polymathic',
    hazard:'perilous|dangerous', apathy:'*', buoy:'*', reflect:'*', tenacious:'endurance',
    zealot:'partisanship', antithesis:'*', pecuniary:'*', totem:'*', parochial:'insularity',
    heterogeneous:'diversity', salient:'prominence', paradigm:'*', speculate:'conjectural',
    concise:'*', intricate:'complexity', realism:'pragmatist', deliberate:'*',
    naive:'ingenuousness', introspection:'*', design:'*', original:'novelty',
    chimera:'illusory', venerate:'reverence|respected', verify:'*', detached:'*',
    exact:'*', peril:'dangerous|hazardous', conjecture:'speculative', partisan:'*',
    enigma:'*', feign:'*', denigrate:'*', hierarchy:'*', denounce:'indictment',
    deplore:'*', irritate:'*', circumspect:'caution', appeal:'*', banal:'triteness',
    reprehend:'deplorable', defend:'*', exasperate:'*', novel:'originality',
    anomaly:'unusual', deprecate:'detracting', confound:'perplexing|enigmatic|flummoxed',
    intrigue:'fascinating'
  };
  const fold=s=>String(s||'').toLowerCase().trim();
  const bank=new Map((window.GRE_VOCAB||[]).map(v=>[fold(v.en),v]));
  const paraphrases=window.GRE_PARAPHRASES;
  groups.forEach(g=>{g.kind='near';g.source='搭配与辨析：学习整理';});
  // Explicit membership only. A thematic contrast is never added to the
  // original-book synonym graph, nor expanded through a transitive closure.
  (window.GRE_EXTRA_GROUPS||[]).forEach(raw=>{
    const items=raw.members.map(ref=>{
      const [word,index='0']=ref.split('@'),v=bank.get(fold(word));
      const s=v&&paraphrases.get(v.en).senses.find(s=>s.index===Number(index));
      if(!s)throw Error('Missing GRE sense: '+ref+' in '+raw.id);
      const ex=s.examples[0];
      return {w:v.en,phrase:ex.en,zh:ex.zh,hint:s.pos+' '+s.zh,gloss:s.gloss,form:s.form,
        sense:s.index,usage:s.usage,source:ex.source};
    });
    const families=new Set(items.map(i=>{
      const p=paraphrases.get(i.w).senses.find(s=>s.index===i.sense).pos;
      return /^(vt|vi|v)\./.test(p)?'v.':p;
    }));
    groups.push({...raw,items,kind:raw.kind==='near'&&families.size>1?'rewrite':raw.kind,
      source:'选词与辨析：学习整理；义项及搭配：原书资料 / 明示校订'});
  });
  const byWord=new Map();
  groups.forEach(g=>g.items.forEach(i=>{
    const key=fold(i.w);if(!byWord.has(key))byWord.set(key,[]);
    if(!byWord.get(key).includes(g))byWord.get(key).push(g);
  }));
  const parts=v=>new Set((v.bs||[]).flatMap(s=>(String(s.p||'').match(/adj\.|adv\.|vt\.|vi\.|v\.|n\.|phr\./g)||[]).map(p=>/^v/.test(p)?'v.':p)));
  function bookSynonyms(v){
    const excluded=omit[fold(v.en)];
    if(excluded==='*') return [];
    return [...new Set((v.sy||[]).map(s=>fold(s)==='hostillity'?'hostility':fold(s)))].filter(s=>{
      if(!/^[a-z][a-z' -]{0,44}$/.test(s)||s===fold(v.en)||(excluded||'').split('|').includes(s)) return false;
      const other=bank.get(s);
      // Derivatives in the scanned book can carry their own synonym hints.
      // Different parts of speech cannot directly replace the headword.
      return !other||[...parts(v)].some(p=>parts(other).has(p));
    });
  }
  const direct=new Map();
  function connect(from,to,source){
    if(!direct.has(from))direct.set(from,new Map());
    const links=direct.get(from);
    if(!links.has(to))links.set(to,new Set());
    links.get(to).add(source);
  }
  bank.forEach(v=>bookSynonyms(v).forEach(w=>{
    connect(fold(v.en),w,v.en);
    connect(w,fold(v.en),v.en);
  }));
  window.GRE_SYNONYMS={groups,bookSynonyms,
    related:word=>[...(direct.get(fold(word))||[])].map(([w,sources])=>({w,sources:[...sources]})),
    forWord:word=>byWord.get(fold(word))||[]
  };
})();
