# GRE 全书串记与逐义改写

入口：应用首页 → GRE 核心词汇 → 🔗 同义串记。

## 覆盖口径

按现有《GRE 核心词汇一本通》原书词库的 **30 个 List、2,902 个主词条**逐词核对，全部都有串记入口和逐义改写卡。不是以 PDF 每个英文单词、派生词或例句中的词作为分母；本次未重新逐页校对扫描版全部文字。

- **813 组**：357 组近义（限定语境）、52 组跨词性改写、404 组辨析对照。
- 保留原先 81 组搭配链，新增 732 组。所有 2,902 个主词条至少出现在一组。
- **3,260 个有效义项**：保留各词在本书的义项划分；`lie` 的一行变形资料不另算义项。每义项包含中文提示、英文释义展开、搭配或例句、中文回忆提示及句式用法。
- “覆盖”包括近义串联和非同义对照，**不表示 2,902 个词都找到了可以互换的同义词**。每组单独标关系类型；专业名词、相反概念、施受方向不同的词等主要用于对照记忆。

## 学习方式

1. **搭配与辨析链**：用中文概念串联词语，可按主题、关系类型、中英文及 List 筛选。List 筛选保留同组其他 List 的词。近义关系仅限指定义项；跨词性组要重组句式；辨析组不能当作全组等价关系。
2. **全书逐义改写**：按书中顺序逐词展开，适合补齐各组中未选用的其他义项。例如 `all but` 的“几乎”与“除……以外全部”分列；`term` 按完整表达 `in terms of` 记忆。英文释义展开本身也不保证能原位塞进原句。
3. **遮住英文**：按中文义项及例句译文回忆；显示答案后核对搭配、介词、词性和语气。此操作不增加掌握度。
4. **听写本组 / 本页 / 本词**：进入原有单词听写，沿用原词 ID、错词、间隔复习和断点。听写练单词拼写；短语和句式通过遮挡回忆练习。
5. **各 List 覆盖情况**：显示该 List 已有串记与逐义卡的主词条数 / 原词条总数；点击可直接学习该 List。
6. **原书近义线索**：保留原书明确提及的直接关联，并标注来源词。它是查阅线索，不推导传递等价；辨析对照组不会混入这张近义关系表。

## 资料与校订

来源为用户提供的《GRE 核心词汇一本通》扫描 PDF（405 页）及现有词库 `src/gre.js`。原先 81 组搭配为另编；扩展组的选词及辨析为学习整理，英文释义和搭配主要来自词库，卡片分别标明原书、校订或另编。

已逐词检查结构完整性、义项引用、搭配/译文缺失、中文混入英文释义，以及部分明显 OCR 截断、错拼和意义错配。对发现的问题采用显式校订，不以自动猜测批量替换：

- 分离 `systematic`、`partiality` 等混入释义的例句；补全 `qualitative`、`longitude` 等截断释义。
- 补充没有搭配的词；替换 `subject`、`virtue`、`relegation` 的截断例句，另编内容明确标注。
- 修正 `scraped`、`oversold`、`underemphasized`、`animadversions` 等明显识别错误。
- `rodent` 限定啮齿目，不把兔类归入；`alga` 不泛化为所有水生植物；`comet` 给出明确释义。
- `beg the question` 按逻辑义校订，并说明现代“引出问题”用法；不把它概括成 `avoid the question`。
- `voracious` 在热衷组明确选第二义项；`review` 在评估组明确选动词义；`contingent` 在条件组明确选取决于义。
- 不是同义的关系保留对照。例如 `qualitative / quantitative`、`predator / prey`、`flora / fauna`，以及 `substitute A for B / replace B with A` 的方向差别。

此前目视核对 PDF 第 17 页（印刷第 4 页）：`accessible` 下的 `obscure / opaque` 跟随派生词 `inaccessible`。索引不再误归为 `accessible` 的近义。`gre-synonyms.js` 的 `omit` 隔离类似的疑似派生词归属、词性错配或 OCR 串行；原文件保留。

核查依据（只用于所列问题，不代表全部 3,260 个义项均经外部词典复核）：

- [Cambridge：beg the question](https://dictionary.cambridge.org/dictionary/english/beg-the-question) 与 [加拿大语言门户：用法辨析](https://our-languages.canada.ca/en/writing-tips-plus/beg-the-question)。
- [Cambridge：qualitative](https://dictionary.cambridge.org/dictionary/english/qualitative)、[override](https://dictionary.cambridge.org/us/dictionary/english/override)、[rodent](https://dictionary.cambridge.org/dictionary/english/rodent)、[brackish](https://dictionary.cambridge.org/us/dictionary/english/brackish)。
- 之前搭配核查：[ameliorate](https://dictionary.cambridge.org/dictionary/english/ameliorate)、[mitigate](https://dictionary.cambridge.org/dictionary/english/mitigate)、[dearth](https://dictionary.cambridge.org/dictionary/english/dearth)、[modicum](https://dictionary.cambridge.org/dictionary/english/modicum)、[defer](https://dictionary.cambridge.org/dictionary/english/defer)。

## 集成与验证

- `gre-paraphrases.js` 提供逐义卡和显式校订；`gre-synonym-groups.js` 保存显式分组和义项选择；`gre-synonyms.js` 合并分组并保持原书直接关联独立。
- 校订同步用于常规词卡、释义及例句展示。**不改 `gre.js` 原词库，不改词 ID，不迁移个人数据，不改同步合并规则。** 源文件 SHA-256：`23a586c25857ac981ce3af88e914aa5b390a8477f364f718297d12571f017944`。
- Mac 内联四份 GRE 资料脚本；Windows 素材清单增加两份新资料；PWA 缓存为 v40，包含全部新增脚本。
- 自动检查覆盖 2,902 词 / 3,260 义项 / 813 组、原数据校验和、各 List 覆盖、完整例句、指定义项、关系类别、遮挡不计分、组/页/词听写、续练与错词、精确跳转、375px 布局。
- 本次验证（2026-11-15）：GRE 全书数据和交互回归、跨词库断点续练、Mac 原生各页面加载、代码签名、运行资源与源码一致性均通过。隔离浏览器安装 v40 缓存后禁用网络，串记和逐义卡仍可搜索使用；桌面、375px 窄屏及深色模式已检查。
- 真实 iPhone 触控、主屏幕离线使用、双向同步及 Windows 真机运行尚未验收；浏览器与 Mac 检查不代替这些检查。
