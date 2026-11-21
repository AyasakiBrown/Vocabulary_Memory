/* GRE 数学核心词汇 — term bank and GRE-style practice problems for quant.html.
   Terms, Chinese meanings, chapter notes, typical expressions, traps and the 20-term
   checklist come from the user's handbook 《GRE 数学考试核心词汇手册 · 中英对照速查版》
   (10 pages, 2026-11). The problems are written for this app: every answer is
   computed in code (loops / enumeration where possible), and the wrong choices are
   the misreadings the handbook warns about (inclusive vs exclusive, percent vs
   percentage point, with vs without replacement, …). */
(function(root){
'use strict';

/* ---------- chapters ---------- */
const CHAPTERS = [
  {id:1, icon:'🧭', name:'题干指令与逻辑', en:'Reading the question',
   lead:'这些词决定题目要求。优先识别范围、是否允许等号，以及题目要求“必然”还是“可能”。',
   tip:'Must be true：必须对所有满足条件的情况成立。Could be：找到一个满足条件的例子即可。',
   ex:[['At least 3','3 或更多；包括 3'],['At most 3','3 或更少；包括 3'],['Exactly 3','只允许 3'],['Between 3 and 8, inclusive','包括 3 和 8']]},
  {id:2, icon:'🔢', name:'整数与数论', en:'Number Properties',
   lead:'余数题、整除题最容易在“能被整除”与“是某数的倍数”之间发生方向性误读。',
   tip:'数论题看见 remainder，先将整数写成“除数 × 整数 + 余数”。看见 must be divisible，考虑质因数指数或反例。',
   ex:[['3 is a factor of 12.','3 是 12 的因数'],['12 is a multiple of 3.','12 是 3 的倍数'],['What is the remainder when … ?','……相除的余数是多少？']]},
  {id:3, icon:'𝑥', name:'代数与函数', en:'Algebra',
   lead:'优先识别操作动词与符号限制：expand、factor、substitute 与 solve 不是同一件事。',
   tip:'不等式两边乘或除以负数时，不等号方向要反转；两边乘以正数时方向不变。',
   ex:[['the square of x','x²'],['the square root of x','√x'],['the reciprocal of x','1/x（x ≠ 0）'],['Solve for x.','求解 x 的值']]},
  {id:4, icon:'🎲', name:'概率与排列组合', en:'Probability & Counting',
   lead:'优先检查 given that（条件）、without replacement（不放回）和 sample space（样本空间）。',
   tip:'条件概率的分母是“已知条件成立”的情况数，不一定是全部情况数；排列与组合是否计入顺序是另一关键。',
   ex:[['without replacement','抽取后不放回；剩余总数减少'],['given that at least one is red','先限制在“至少一个红球”的样本空间'],['exactly one red','只允许一个红球；两个红球不算']]},
  {id:5, icon:'📊', name:'统计与数据变换', en:'Statistics',
   lead:'区分 mean、median、variance、standard deviation；特别注意平移与缩放的不同影响。',
   tip:'若 y = a + bx：新平均数 = a + b × 原平均数；新标准差 = |b| × 原标准差；新方差 = b² × 原方差。',
   ex:[['Add 4 to every observation','平均数 +4；标准差不变'],['Multiply every observation by −2','标准差 ×2；方差 ×4'],['Increase by 20%','原值乘以 1.2'],['Increase to 20%','最终达到 20%']]},
  {id:6, icon:'📐', name:'几何', en:'Geometry',
   lead:'几何题先辨认图形类型与边界条件；acute、right、obtuse 指角的性质。',
   tip:'判断三角形类型：先核查三边能否组成三角形，再比较最长边平方与其余两边平方之和。',
   ex:[['Acute triangle','三个角都小于 90°'],['Right triangle','一个角等于 90°'],['Obtuse triangle','一个角大于 90°']]},
  {id:7, icon:'📈', name:'图表与应用题', en:'Data Interpretation',
   lead:'遇到图表与商业场景，先确认总量、单位和比较基准，尤其留意 percent 与 percentage point。',
   tip:'若比例从 20% 增至 25%，是“增加 5 个百分点”，不是“增加 5%”。实际百分比增幅为 (25−20)/20 = 25%。',
   ex:[['From 20% to 25%','增加 5 个百分点，增幅是 25%'],['Average speed','总路程 ÷ 总时间'],['Profit','收入 − 成本']]},
  {id:8, icon:'⚠️', name:'高频陷阱', en:'Important Traps',
   lead:'不仅记住译法，还要理解它改变了什么数学条件。可用于每次错题复盘。',
   tip:'Exactly one：只保留满足其中一个条件的结果。Given that：已知条件会改变可用的样本空间。Must be true：需要证明普遍成立；一个反例就能推翻。',
   ex:[]}
];

/* ---------- terms (en|zh, one per line; chapter 8 adds |易错提醒) ---------- */
const RAW = {
1:`at least|至少；≥
at most|至多；≤
exactly|恰好
greater than|大于；>
less than|小于；<
no more than|不超过；≤
no less than|不少于；≥
more than|超过
fewer than|少于（可数）
inclusive|包括端点
exclusive|不包括端点
must be true|一定成立
could be true|可能成立
cannot be|不可能是
except|除了……以外
distinct|互不相同
consecutive|连续的
respectively|分别地；依次对应
approximately|约、大约
rounded to|四舍五入至
nearest integer|最接近的整数
indicate all that apply|选出所有符合项
select one answer choice|选择一个答案
quantity A / quantity B|数量 A / 数量 B
cannot be determined|无法由条件确定
given that|已知……；在……条件下
such that|使得；满足……条件
regardless of|无论
in terms of|用……表示
positive / negative|正的 / 负的
nonzero|非零
greater than or equal to|大于或等于；≥
less than or equal to|小于或等于；≤`,
2:`integer|整数
positive integer|正整数（不含 0）
negative integer|负整数
nonnegative integer|非负整数（含 0）
even number|偶数
odd number|奇数
prime number|质数
composite number|合数
factor / divisor|因数、约数
multiple|倍数
divisible by|能被……整除
remainder|余数
quotient|商
dividend|被除数
least common multiple (LCM)|最小公倍数
greatest common factor (GCF)|最大公因数
prime factorization|质因数分解
relatively prime|互质
perfect square|完全平方数
perfect cube|完全立方数
consecutive integers|连续整数
consecutive even integers|连续偶数
consecutive odd integers|连续奇数
units digit|个位数字
tens digit|十位数字
digit|数位上的数字
absolute value|绝对值
positive factor|正因数
integer multiple|整数倍
divisibility|整除性质`,
3:`variable|变量
constant|常数
coefficient|系数
expression|代数表达式
equation|方程
inequality|不等式
linear equation|一次方程
quadratic equation|二次方程
system of equations|方程组
solution|解
root / zero|根；零点
substitute|代入
simplify|化简
expand|展开
factor (verb)|因式分解
exponent|指数
base|底数
square root|平方根
cube root|立方根
reciprocal|倒数
function|函数
domain|定义域
range (of a function)|值域
slope|斜率
intercept|截距
x-intercept|x 轴截距
y-intercept|y 轴截距
increasing function|递增函数
decreasing function|递减函数
linear inequality|一次不等式
absolute value inequality|绝对值不等式
compound inequality|双重／复合不等式`,
4:`probability|概率
randomly selected|随机选取
uniformly at random|等概率随机选取
equally likely|可能性相等
independent events|独立事件
dependent events|非独立事件
conditional probability|条件概率
given that|在已知……条件下
without replacement|不放回抽取
with replacement|放回抽取
mutually exclusive|互斥的
sample space|样本空间
outcome|结果
event|事件
favorable outcomes|有利结果
at least one|至少一个
exactly one|恰好一个
both|两者都
neither|两者都不
either … or …|二者之一或其一；注意语境
intersection|交集
union|并集
permutation|排列
combination|组合
arrangement|排列方式、安排
factorial|阶乘
draw / select|抽取／选取
at random|随机地
simultaneously|同时
complementary event|对立（补）事件`,
5:`data set|数据集
observation|观测值
arithmetic mean / average|算术平均数
median|中位数
mode|众数
range (of a data set)|极差
variance|方差
standard deviation|标准差
population variance|总体方差
population standard deviation|总体标准差
weighted average|加权平均数
frequency|频数
relative frequency|相对频率
distribution|分布
normal distribution|正态分布
symmetric distribution|对称分布
skewed distribution|偏态分布
percentile|百分位数
quartile|四分位数
interquartile range (IQR)|四分位距
outlier|异常值
spread / dispersion|离散程度
transformed data set|变换后的数据集
increase by|增加了……
increase to|增加到……
twice as large as|是……的两倍
remain unchanged|保持不变
weighted sum|加权和`,
6:`triangle|三角形
acute triangle|锐角三角形
obtuse triangle|钝角三角形
right triangle|直角三角形
isosceles triangle|等腰三角形
equilateral triangle|等边三角形
scalene triangle|不等边三角形
hypotenuse|斜边
leg|直角边（在直角三角形中）
altitude|高
base|底边
vertex / vertices|顶点（单／复）
interior angle|内角
exterior angle|外角
adjacent angles|相邻角
complementary angles|互余角（合计 90°）
supplementary angles|互补角（合计 180°）
congruent|全等的
similar|相似的
perpendicular|垂直的
parallel|平行的
circle|圆
radius / radii|半径（单／复）
diameter|直径
circumference|圆周长
arc|圆弧
chord|弦
tangent|切线
sector|扇形
central angle|圆心角
inscribed angle|圆周角
polygon|多边形
rectangle|长方形
square|正方形
parallelogram|平行四边形
trapezoid|梯形
diagonal|对角线
perimeter|周长
area|面积
surface area|表面积
volume|体积
cube|立方体
cylinder|圆柱体
cone|圆锥体
sphere|球体`,
7:`bar graph / bar chart|柱状图
line graph|折线图
pie chart|饼图
scatterplot|散点图
horizontal axis|横轴
vertical axis|纵轴
table|表格
total|总数；合计
percentage|百分比
percentage point|百分点
percent increase|百分比增长
percent decrease|百分比下降
ratio|比
proportion|比例
rate|速率／比率
average speed|平均速度
distance|距离
elapsed time|经过的时间
work rate|工作效率
profit|利润
loss|亏损
revenue|收入
expense / cost|费用／成本
discount|折扣
markup|加价
principal|本金
simple interest|单利
compound interest|复利
taxable income|应税收入
concentration|浓度
units|单位
per|每；每单位
average per|平均每……`,
8:`at least one|至少一个|不能只算恰好一个
exactly one|恰好一个|同时满足两个条件者不算
different / distinct|互不相同|不能重复计数或取相同元素
without replacement|不放回|条件概率分母会变化
must be true|必然成立|只举一个例子不够证明
could be|可能成立|找到一个有效例子即可
not necessarily|不一定成立|不等于“一定错误”
standard deviation|标准差|不是 variance（方差）
percent increase|百分比增长|通常以原值为基数
perimeter|周长|不是面积 area
similar|相似|不等于 congruent（全等）
positive integer|正整数|不包含零
less than|严格小于|不包括等号
at most|至多|包括等号
between … inclusive|两端均包含|不要漏算端点
range|极差／值域|根据统计或函数语境判别`
};
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const TERMS = [], BYID = {};
for (const ch of [1,2,3,4,5,6,7,8]) RAW[ch].split('\n').forEach((line, i) => {
  const [en, zh, trap] = line.split('|');
  const t = {id: ch + '.' + slug(en), ch, n: i, en, zh};
  if (trap) t.trap = trap;
  if (BYID[t.id]) throw Error('duplicate term ' + t.id);
  TERMS.push(t); BYID[t.id] = t;
});

/* Terms that mean the same thing (or one is the other plus a detail) never stand in as
   each other's wrong choice. Matched on the English text, any chapter. */
const SAME = [
  ['at least','no less than','greater than or equal to','at least one'],
  ['at most','no more than','less than or equal to'],
  ['greater than','more than'], ['less than','fewer than'],
  ['exactly','exactly one'], ['distinct','different / distinct'],
  ['must be true'], ['could be true','could be'], ['cannot be','cannot be determined','not necessarily'],
  ['given that','conditional probability','such that'],
  ['consecutive','consecutive integers','consecutive even integers','consecutive odd integers'],
  ['randomly selected','uniformly at random','at random','draw / select','equally likely'],
  ['outcome','favorable outcomes','event'],
  ['factor / divisor','positive factor'], ['multiple','integer multiple'], ['divisible by','divisibility'],
  ['integer','positive integer','negative integer','nonnegative integer'],
  ['digit','units digit','tens digit'],
  ['equation','linear equation','quadratic equation','system of equations'],
  ['inequality','linear inequality','absolute value inequality','compound inequality'],
  ['intercept','x-intercept','y-intercept'], ['root / zero','solution'],
  ['range (of a function)','range (of a data set)','range','interquartile range (IQR)'],
  ['variance','population variance'], ['standard deviation','population standard deviation','spread / dispersion'],
  ['arithmetic mean / average','weighted average','average per'],
  ['distribution','normal distribution','symmetric distribution','skewed distribution'],
  ['percentile','quartile'],
  ['triangle','acute triangle','obtuse triangle','right triangle','isosceles triangle','equilateral triangle','scalene triangle'],
  ['ratio','proportion','rate'], ['percentage','percent increase','percent decrease'],
  ['expense / cost','loss'], ['between … inclusive','inclusive']
];
const GROUP = {};
SAME.forEach((g, i) => g.forEach(en => { GROUP[en] = i; }));
function clash(a, b) {
  if (a.en.toLowerCase() === b.en.toLowerCase() || a.zh === b.zh) return true;
  const ga = GROUP[a.en], gb = GROUP[b.en];
  return ga !== undefined && ga === gb;
}

/* 考前高优先级 20 词 — t: the term(s) a 「不会」 sends back to review */
const CHECK = [
  ['given that','已知……条件下',['1.given-that','4.given-that']], ['at least','至少',['1.at-least']],
  ['at most','至多',['1.at-most']], ['exactly','恰好',['1.exactly']],
  ['without replacement','不放回',['4.without-replacement']], ['independent','独立的',['4.independent-events']],
  ['mutually exclusive','互斥的',['4.mutually-exclusive']], ['conditional probability','条件概率',['4.conditional-probability']],
  ['sample space','样本空间',['4.sample-space']], ['standard deviation','标准差',['5.standard-deviation']],
  ['variance','方差',['5.variance']], ['population','总体',['5.population-variance','5.population-standard-deviation']],
  ['weighted average','加权平均数',['5.weighted-average']], ['range','极差／值域',['5.range-of-a-data-set','3.range-of-a-function']],
  ['transformed','经过变换的',['5.transformed-data-set']], ['acute','锐角的',['6.acute-triangle']],
  ['obtuse','钝角的',['6.obtuse-triangle']], ['divisible by','能被……整除',['2.divisible-by']],
  ['must be true','一定成立',['1.must-be-true']], ['cannot be determined','无法确定',['1.cannot-be-determined']]
].map(([en, zh, t]) => ({en, zh, t}));

/* 五个高价值 GRE 句型 */
const SENTENCES = [
  ['Indicate all that apply.','全部正确选项都要选，漏选通常不得分。'],
  ['Given that at least one is red, …','先限定“至少有一个红色”的情况。'],
  ['The value must be divisible by 6.','必须对所有允许的情况均是 6 的倍数。'],
  ['The relationship cannot be determined.','不同合法取值产生不同关系时才选择此项。'],
  ['The standard deviation remains unchanged.','标准差保持不变；与平均数移动无关。']
];

/* ---------- number helpers ---------- */
const MINUS = '−';
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const lcm = (a, b) => a / gcd(a, b) * b;
const isPrime = n => { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; };
const N = n => (n < 0 ? MINUS : '') + Math.abs(n);
const Np = n => n < 0 ? '(' + N(n) + ')' : N(n);       // −5 inside a subtraction: (−5)
const C = n => (n < 0 ? MINUS : '') + Math.abs(n).toLocaleString('en-US');      // 4,371
function F(n, d) {                       // reduced fraction n/d as text
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(n, d) || 1; n /= g; d /= g;
  return d === 1 ? N(n) : N(n) + '/' + d;
}
function PI(n, d) {                      // (n/d)·π as text: 25π, 3π/2, π
  d = d || 1; if (d < 0) { n = -n; d = -d; }
  const g = gcd(n, d) || 1; n /= g; d /= g;
  if (n === 0) return '0';
  const k = Math.abs(n) === 1 ? '' : Math.abs(n);
  return (n < 0 ? MINUS : '') + k + 'π' + (d === 1 ? '' : '/' + d);
}
const SUP = {0:'⁰',1:'¹',2:'²',3:'³',4:'⁴',5:'⁵',6:'⁶',7:'⁷',8:'⁸',9:'⁹'};
const sup = n => String(n).split('').map(c => SUP[c]).join('');
function term(c, v, first) {             // one term of a polynomial: c·v with its sign
  if (!c) return '';
  const a = Math.abs(c), body = (a === 1 && v ? '' : a) + v;
  return first ? (c < 0 ? MINUS : '') + body : (c < 0 ? ' ' + MINUS + ' ' : ' + ') + body;
}
const poly = (a, b, c) => (term(a, 'x²', true) + term(b, 'x', !a) + term(c, '', !a && !b)) || '0';
const lin = (m, b) => term(m, 'x', true) + term(b, '', !m);         // mx + b
const xm = c => c === 0 ? 'x' : c > 0 ? 'x ' + MINUS + ' ' + c : 'x + ' + (-c);   // x − c
const list = a => a.map(N).join(', ');
const fact = n => { let p = 1; for (let i = 2; i <= n; i++) p *= i; return p; };
const sum = a => a.reduce((s, x) => s + x, 0);
function count(lo, hi, f) { let n = 0; for (let k = lo; k <= hi; k++) if (f(k)) n++; return n; }
function divisors(n) { const d = []; for (let k = 1; k <= n; k++) if (n % k === 0) d.push(k); return d; }
function primeFactors(n) { const f = []; for (let p = 2; n > 1; p++) while (n % p === 0) { f.push(p); n /= p; } return f; }
const fr = (n, d) => { const g = gcd(n, d) || 1; return [n / g, d / g]; };           // exact fractions [n,d]
const fmul = (a, b) => fr(a[0] * b[0], a[1] * b[1]);
const fadd = (a, b) => fr(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
const fsub = (a, b) => fr(a[0] * b[1] - b[0] * a[1], a[1] * b[1]);
const FT = a => F(a[0], a[1]);
// population standard deviation (exact when the variance is a perfect square)
const mean = a => sum(a) / a.length;
const variance = a => { const m = mean(a); return sum(a.map(x => (x - m) * (x - m))) / a.length; };

/* ---------- the problem bank ----------
   gen(r) → {q, a, w:[wrong…], why, t?}: q is HTML (built here, never from input), a the
   right choice, w the misreadings (the page keeps three distinct ones), t the terms the
   question exercises when it differs per variant. */
const PROBLEMS = [];
const P = (id, ch, t, gen) => PROBLEMS.push({id, ch, t, gen});
const S = (id, ch, t, q, a, w, why) => PROBLEMS.push({id, ch, t, fixed: true, gen: () => ({q, a, w, why})});
const QA = 'Quantity A is greater.', QB = 'Quantity B is greater.', EQ = 'The two quantities are equal.',
      CD = 'The relationship cannot be determined from the information given.';
const QC = (cond, A, B) => `${cond ? cond + '<br>' : ''}<b>Quantity A:</b> ${A}<br><b>Quantity B:</b> ${B}`;

/* ===== 1 题干指令与逻辑 ===== */
P('incl', 1, ['1.inclusive','1.exclusive','8.between-inclusive'], r => {
  const a = r.int(3, 20), b = a + r.int(6, 15), incl = r.chance(.5);
  const n = count(a, b, k => incl || (k !== a && k !== b));
  return {q: `How many integers are between ${a} and ${b}, ${incl ? 'inclusive' : 'exclusive'}?`,
    a: N(n), w: [b - a + 1, b - a, b - a - 1, b - a + 2].map(N),
    why: incl ? `inclusive 包括端点：${a} 和 ${b} 都算，共 ${b} − ${a} + 1 = ${n} 个。` : `exclusive 不包括端点：${a} 和 ${b} 都不算，共 ${b} − ${a} − 1 = ${n} 个。`,
    t: [incl ? '1.inclusive' : '1.exclusive', incl ? '8.between-inclusive' : '1.exclusive']};
});
const REL = [
  ['less than', '<', (k, n) => k < n, ['1.less-than','8.less-than']],
  ['no more than', '≤', (k, n) => k <= n, ['1.no-more-than']],
  ['at most', '≤', (k, n) => k <= n, ['1.at-most','8.at-most']],
  ['less than or equal to', '≤', (k, n) => k <= n, ['1.less-than-or-equal-to']],
  ['greater than', '>', (k, n) => k > n, ['1.greater-than']],
  ['more than', '>', (k, n) => k > n, ['1.more-than']],
  ['at least', '≥', (k, n) => k >= n, ['1.at-least']],
  ['no less than', '≥', (k, n) => k >= n, ['1.no-less-than']],
  ['greater than or equal to', '≥', (k, n) => k >= n, ['1.greater-than-or-equal-to']]
];
P('rel', 1, REL.flatMap(x => x[3]), r => {
  const [ph, sym, f, t] = r.pick(REL), m = r.int(20, 60), n = r.int(5, m - 5);
  const c = g => count(1, m, k => g(k, n));
  return {q: `How many integers from 1 to ${m}, inclusive, are ${ph} ${n}?`,
    a: N(c(f)), w: REL.map(x => N(c(x[2]))).concat([N(c(f) + 1), N(c(f) - 1)]),
    why: `${ph} ${n} 即 ${sym} ${n}${sym.length > 1 || sym === '≤' || sym === '≥' ? '（含 ' + n + '）' : '（不含 ' + n + '）'}，1 到 ${m} 中共 ${c(f)} 个。`, t};
});
const BOUND = [
  ['fewer than', 'greatest', n => n - 1, '少于 n 最多只能是 n − 1', ['1.fewer-than']],
  ['no more than', 'greatest', n => n, '不超过 n，最多可以等于 n', ['1.no-more-than']],
  ['at most', 'greatest', n => n, '至多 n，可以等于 n', ['1.at-most','8.at-most']],
  ['at least', 'least', n => n, '至少 n，最少可以等于 n', ['1.at-least']],
  ['more than', 'least', n => n + 1, '超过 n，最少是 n + 1', ['1.more-than']],
  ['no less than', 'least', n => n, '不少于 n，最少可以等于 n', ['1.no-less-than']]
];
P('bound', 1, BOUND.flatMap(x => x[4]), r => {
  const [ph, ext, f, why, t] = r.pick(BOUND), n = r.int(12, 40);
  return {q: `A club has ${ph} ${n} members. What is the ${ext} possible number of members?`,
    a: N(f(n)), w: [n - 1, n, n + 1, n - 2, n + 2].map(N), why: why.replace(/n/g, n) + '。', t};
});
P('consec', 1, ['1.consecutive','2.consecutive-integers','2.consecutive-even-integers','2.consecutive-odd-integers'], r => {
  const k = r.pick([3, 4, 5]), kind = r.pick(['', 'even ', 'odd ']), step = kind ? 2 : 1;
  const s = kind === 'even ' ? 2 * r.int(2, 20) : kind === 'odd ' ? 2 * r.int(2, 20) + 1 : r.int(3, 40);
  const arr = Array.from({length: k}, (_, i) => s + i * step), tot = sum(arr), big = r.chance(.5);
  return {q: `The sum of ${k} consecutive ${kind}integers is ${tot}. What is the ${big ? 'greatest' : 'least'} of these integers?`,
    a: N(big ? arr[k - 1] : arr[0]), w: [arr[0], arr[k - 1], arr[k - 1] + step, arr[0] - step, s + k - 1, Math.round(tot / k)].map(N),
    why: `${k} 个连续${kind === 'even ' ? '偶数' : kind === 'odd ' ? '奇数' : '整数'}（相邻差 ${step}）：${list(arr)}，和为 ${tot}。`,
    t: ['1.consecutive', kind === 'even ' ? '2.consecutive-even-integers' : kind === 'odd ' ? '2.consecutive-odd-integers' : '2.consecutive-integers']};
});
P('resp', 1, ['1.respectively'], r => {
  const a = r.int(2, 9); let b = r.int(2, 9); if (b === a) b = a === 9 ? 2 : a + 1;
  const c = r.int(2, 4);
  return {q: `The values of x and y are ${a} and ${b}, respectively. What is the value of x ${MINUS} ${c}y?`,
    a: N(a - c * b), w: [b - c * a, a + c * b, c * a - b].map(N),
    why: `respectively 依次对应：x = ${a}，y = ${b}，所以 x − ${c}y = ${a} − ${c * b} = ${N(a - c * b)}。`};
});
P('round', 1, ['1.rounded-to','1.nearest-integer','1.approximately'], r => {
  if (r.chance(.5)) {
    const i = r.int(2, 98); let h = r.int(1, 99); if (h === 50) h = 51;
    const v = (i + h / 100).toFixed(2), ans = h >= 50 ? i + 1 : i;
    return {q: `What is ${v} rounded to the nearest integer?`, a: N(ans), w: [i, i + 1, i - 1, i + 2].map(N).concat([(i + 0.5).toFixed(1)]),
      why: `nearest integer 最接近的整数：看小数第一位，${v} → ${ans}。`, t: ['1.nearest-integer','1.rounded-to']};
  }
  let T = r.int(1000, 99999); if (T % 100 === 50) T += 1;
  const tenths = Math.floor(T / 100) + (T % 100 >= 50 ? 1 : 0), v = (T / 1000).toFixed(3);
  return {q: `What is ${v} rounded to the nearest tenth?`, a: (tenths / 10).toFixed(1),
    w: [(Math.floor(T / 100) / 10).toFixed(1), ((Math.floor(T / 100) + 1) / 10).toFixed(1), (Math.round(T / 10) / 100).toFixed(2), String(Math.round(T / 1000))],
    why: `rounded to the nearest tenth 四舍五入到十分位（小数点后一位）：看百分位，${v} → ${(tenths / 10).toFixed(1)}。`, t: ['1.rounded-to','1.approximately']};
});
P('except', 1, ['1.except','1.inclusive'], r => {
  const n = r.int(8, 20), k = r.int(2, n - 1), tot = sum(Array.from({length: n}, (_, i) => i + 1));
  return {q: `What is the sum of all the integers from 1 to ${n}, inclusive, except ${k}?`, a: N(tot - k), w: [tot, tot + k, tot - 2 * k, tot - k - n].map(N),
    why: `1 到 ${n} 的和是 ${tot}，except 除去 ${k}：${tot} − ${k} = ${tot - k}。`};
});
P('interms', 1, ['1.in-terms-of'], r => {
  const a = r.int(2, 7), b = r.int(1, 12);
  return {q: `If y = ${a}x + ${b}, what is x in terms of y?`, a: `(y ${MINUS} ${b})/${a}`,
    w: [`(y + ${b})/${a}`, `${a}y + ${b}`, `y/${a} ${MINUS} ${b}`, `${a}(y ${MINUS} ${b})`],
    why: `in terms of y 用 y 表示 x：y − ${b} = ${a}x，所以 x = (y − ${b})/${a}。`};
});
P('distinctpf', 1, ['1.distinct','8.different-distinct','2.prime-factorization'], r => {
  let n, f;
  do { n = r.pick([2, 3]) ** r.int(1, 3) * r.pick([1, 3, 5, 7, 9, 25]) * r.pick([1, 5, 7, 11, 49]); f = primeFactors(n); }
  while (n > 3000 || n < 20 || new Set(f).size === f.length || new Set(f).size < 2);
  const d = new Set(f).size;
  return {q: `How many distinct prime factors does ${C(n)} have?`, a: N(d), w: [f.length, divisors(n).length, d + 1, d - 1].map(N),
    why: `${C(n)} = ${f.join(' × ')}；distinct 互不相同 → 只数不同的质数 {${[...new Set(f)].join(', ')}}，共 ${d} 个。`, t: ['1.distinct','8.different-distinct','2.prime-factorization']};
});
// Quantitative comparison and must / could — hand-written, each checked by hand
S('qc-sq-nonzero', 1, ['1.nonzero','1.cannot-be-determined','1.quantity-a-quantity-b'], QC('x is a nonzero integer.', 'x²', 'x'), CD, [QA, QB, EQ],
  'x = 1 时两者相等，x = 2 或 x = −1 时 A 更大：不同合法取值给出不同关系 → cannot be determined。');
S('qc-sq-big', 1, ['1.quantity-a-quantity-b','1.greater-than'], QC('x is greater than 1.', 'x²', 'x'), QA, [QB, EQ, CD],
  'x > 1 时 x² = x · x > x，A 总是更大。');
S('qc-sq-frac', 1, ['1.quantity-a-quantity-b','1.positive-negative'], QC('0 &lt; x &lt; 1', 'x²', 'x'), QB, [QA, EQ, CD],
  '0 < x < 1 时乘以一个小于 1 的正数会变小：x² < x，B 总是更大。');
S('qc-nn1', 1, ['1.cannot-be-determined','1.quantity-a-quantity-b','2.integer'], QC('n is an integer.', 'n² + n', '0'), CD, [QA, QB, EQ],
  'n² + n = n(n + 1)：n = 0 或 −1 时等于 0，n = 1 时等于 2 > 0。不止一种关系 → cannot be determined。');
S('qc-prime', 1, ['2.prime-number','1.cannot-be-determined'], QC('p is a prime number.', 'p', '2'), CD, [QA, QB, EQ],
  '最小的质数是 2：p = 2 时相等，p = 3 时 A 更大 → cannot be determined。');
S('qc-consec', 1, ['2.consecutive-integers','1.quantity-a-quantity-b'], QC('x and y are consecutive integers, and x &lt; y.', 'y ' + MINUS + ' x', '1'), EQ, [QA, QB, CD],
  'consecutive integers 连续整数相差 1，x < y → y − x = 1，两者相等。');
S('qc-abs', 1, ['2.absolute-value','1.cannot-be-determined'], QC('|x| = 3', 'x', '0'), CD, [QA, QB, EQ],
  '|x| = 3 → x = 3 或 x = −3，可能大于也可能小于 0 → cannot be determined。');
S('qc-meanmed', 1, ['5.arithmetic-mean-average','5.median','1.quantity-a-quantity-b'], QC('Data set: 2, 4, 6, 8', 'the arithmetic mean of the data set', 'the median of the data set'), EQ, [QA, QB, CD],
  '平均数 = 20 ÷ 4 = 5；中位数 = (4 + 6) ÷ 2 = 5，两者相等。');
S('must-odd', 1, ['1.must-be-true','8.must-be-true','2.odd-number'], 'n is an odd integer. Which of the following <b>must be true</b>?', 'n + 1 is even.', ['n is a prime number.', 'n &gt; 0', 'n² is even.'],
  'must be true 要对所有奇数成立：n + 1 一定是偶数。反例：n = 9 不是质数；n = −1 不大于 0；奇数的平方是奇数。');
S('must-sq16', 1, ['1.must-be-true','2.absolute-value'], 'x is an integer and x² = 16. Which of the following <b>must be true</b>?', '|x| = 4', ['x = 4', 'x &gt; 0', 'x is odd.'],
  'x² = 16 → x = 4 或 x = −4。只有 |x| = 4 对两种情况都成立；x = 4 只是“可能”。');
S('must-even-product', 1, ['1.must-be-true','4.at-least-one','8.at-least-one'], 'x and y are integers, and xy is even. Which of the following <b>must be true</b>?', 'At least one of x and y is even.', ['x is even.', 'y is even.', 'x + y is even.'],
  '两个奇数的乘积是奇数，所以 xy 为偶数 → 至少一个是偶数。x 不一定是偶数（x = 1，y = 2）；x + y 也不一定是偶数（1 + 2 = 3）。');
S('must-div6', 1, ['1.must-be-true','2.divisible-by'], 'n is a positive integer that is divisible by 6. Which of the following <b>must be true</b>?', 'n is divisible by 3.', ['n is divisible by 12.', 'n is odd.', 'n &gt; 6'],
  '6 = 2 × 3，能被 6 整除就一定能被 3 整除。反例：n = 6 不能被 12 整除、不是奇数、也不大于 6。');
S('could-neg', 1, ['1.could-be-true','8.could-be','1.positive-negative'], 'x &lt; 0. Which of the following <b>could be true</b>?', '|x| = ' + MINUS + 'x', ['x² &lt; 0', 'x³ &gt; 0', 'x + |x| &gt; 0'],
  'x < 0 时 |x| = −x（成立，当然也“可能成立”）。x² 不会小于 0；负数的立方仍是负数；x + |x| = 0，不会大于 0。');
S('could-sum7', 1, ['1.could-be-true','2.positive-integer'], 'a and b are positive integers, and a + b = 7. Which of the following <b>could be true</b>?', 'ab = 12', ['a = b', 'ab = 7', 'a + 2b = 7'],
  'could be 找到一个例子即可：a = 3，b = 4 时 ab = 12。a = b 需要 3.5；ab 只能是 6、10、12；a + 2b = 7 需要 b = 0，但 b 是正整数。');
S('could-range', 1, ['1.less-than-or-equal-to','1.greater-than'], 'x is an integer, and 3 &lt; x ≤ 7. Which of the following could be the value of x?', '7', ['3', '8', '2'],
  '3 < x 不含 3；x ≤ 7 含 7 → x 可以是 4、5、6、7。');
S('not-nec', 8, ['8.not-necessarily','1.must-be-true'], 'If n is divisible by 4, is n <b>necessarily</b> divisible by 8?', 'No — n is not necessarily divisible by 8 (n = 4 is a counterexample).', ['Yes — every multiple of 4 is divisible by 8.', 'No — n can never be divisible by 8.', 'It cannot be checked without knowing n.'],
  'not necessarily 不一定成立 ≠ 一定错误：n = 8 能被 8 整除，n = 4 不能。一个反例就推翻“必然”。');

/* ===== 2 整数与数论 ===== */
P('intkinds', 2, ['2.positive-integer','2.nonnegative-integer','2.negative-integer','2.absolute-value','8.positive-integer','2.integer'], r => {
  const n = r.int(4, 12), v = r.int(0, 3), f = [
    ['positive integers less than ' + n, k => k > 0 && k < n, '正整数不含 0：1 到 ' + (n - 1), ['2.positive-integer','8.positive-integer']],
    ['nonnegative integers less than ' + n, k => k >= 0 && k < n, '非负整数含 0：0 到 ' + (n - 1), ['2.nonnegative-integer']],
    ['negative integers greater than ' + MINUS + n, k => k < 0 && k > -n, '负整数：−' + (n - 1) + ' 到 −1', ['2.negative-integer']],
    ['integers whose absolute value is less than ' + n, k => Math.abs(k) < n, '|k| < ' + n + '：−' + (n - 1) + ' 到 ' + (n - 1) + '（含 0）', ['2.absolute-value','2.integer']]][v];
  const c = count(-50, 50, f[1]);
  return {q: `How many ${f[0]} are there?`, a: N(c), w: [n - 1, n, n + 1, 2 * n - 1, 2 * n + 1, 2 * n - 2].map(N), why: f[2] + `，共 ${c} 个。`, t: f[3]};
});
P('evenodd', 2, ['2.odd-number','2.even-number','1.inclusive'], r => {
  const a = r.int(5, 30), b = a + r.int(8, 20), odd = r.chance(.5);
  const c = count(a, b, k => (k % 2 !== 0) === odd), o = count(a, b, k => (k % 2 !== 0) !== odd);
  return {q: `How many ${odd ? 'odd' : 'even'} numbers are there between ${a} and ${b}, inclusive?`, a: N(c), w: [o, b - a + 1, c + 1, c - 1].map(N),
    why: `${odd ? 'odd number 奇数' : 'even number 偶数'}，从 ${a} 到 ${b}（inclusive 含两端）共 ${c} 个。`, t: [odd ? '2.odd-number' : '2.even-number','1.inclusive']};
});
P('primes', 2, ['2.prime-number','1.less-than'], r => {
  const n = r.int(12, 50), c = count(1, n - 1, isPrime), le = count(1, n, isPrime);
  return {q: `How many prime numbers are less than ${n}?`, a: N(c), w: [c + 1, c - 1, le === c ? c + 2 : le].map(N),
    why: `prime number 质数（1 不是质数，2 是）：${Array.from({length: n - 1}, (_, i) => i + 1).filter(isPrime).join(', ')}，共 ${c} 个。`, t: ['2.prime-number','1.less-than']};
});
P('composite', 2, ['2.composite-number'], r => {
  const n = r.int(10, 60); let c = n + 1; while (isPrime(c)) c++;
  let p = n + 1; while (!isPrime(p)) p++;
  return {q: `What is the least composite number greater than ${n}?`, a: N(c), w: [p, n, c + 1, c + 2].map(N),
    why: `composite number 合数 = 有 1 和自身以外因数的数；大于 ${n} 的第一个合数是 ${c}${p < c ? '（' + p + ' 是质数）' : ''}。`};
});
P('nfactors', 2, ['2.factor-divisor','2.positive-factor'], r => {
  const n = r.pick([12, 18, 20, 24, 28, 30, 36, 40, 45, 48, 50, 60, 72, 80, 84, 90, 96, 100]), d = divisors(n);
  return {q: `How many positive factors does ${n} have?`, a: N(d.length), w: [d.length - 1, d.length - 2, new Set(primeFactors(n)).size, d.length + 1].map(N),
    why: `positive factor 正因数（含 1 和 ${n} 本身）：${d.join(', ')}，共 ${d.length} 个。`};
});
P('multiples', 2, ['2.multiple','1.less-than-or-equal-to'], r => {
  const k = r.int(3, 9), n = r.int(30, 99), c = count(1, n, x => x % k === 0);
  return {q: `How many positive multiples of ${k} are less than or equal to ${n}?`, a: N(c), w: [c + 1, c - 1, divisors(n).length, Math.ceil(n / k) + 1].map(N),
    why: `multiple 倍数：${k}, ${2 * k}, …, ${c * k}（≤ ${n}），共 ${c} 个。`, t: ['2.multiple','1.less-than-or-equal-to']};
});
P('divisible', 2, ['2.divisible-by','2.divisibility'], r => {
  const k = r.pick([3, 4, 6, 8, 9, 12]), right = k * r.int(8, 40), sub = divisors(k).filter(d => d > 1 && d < k), wrong = [];
  while (wrong.length < 3) {
    const base = sub.length ? r.pick(sub) : 1, x = base * r.int(Math.ceil(40 / base), Math.floor(480 / base));
    if (x % k !== 0 && !wrong.includes(x)) wrong.push(x);
  }
  return {q: `Which of the following integers is divisible by ${k}?`, a: N(right), w: wrong.map(N),
    why: `divisible by ${k} 能被 ${k} 整除：${right} = ${k} × ${right / k}。其余各数除以 ${k} 都有余数（${wrong.map(x => x + ' 余 ' + x % k).join('，')}）。`};
});
P('remainder', 2, ['2.remainder','2.quotient','2.dividend'], r => {
  const b = r.int(3, 12), q0 = r.int(3, 15), rem = r.int(1, b - 1), a = b * q0 + rem, v = r.int(0, 3);
  if (v === 0) return {q: `What is the remainder when ${a} is divided by ${b}?`, a: N(a % b), w: [q0, b - rem, rem + 1, b].map(N),
    why: `remainder 余数：${a} = ${b} × ${q0} + ${rem}，余数是 ${rem}（商是 ${q0}）。`, t: ['2.remainder']};
  if (v === 1) return {q: `When ${a} is divided by ${b}, the result is a quotient and a remainder. What is the quotient?`, a: N(Math.floor(a / b)), w: [rem, q0 + 1, q0 - 1, b].map(N),
    why: `quotient 商：${a} = ${b} × ${q0} + ${rem}，商是 ${q0}，余数是 ${rem}。`, t: ['2.quotient','2.remainder']};
  if (v === 2) return {q: `In the division ${a} ÷ ${b} = ${q0} remainder ${rem}, which number is the dividend?`, a: N(a), w: [b, q0, rem].map(N),
    why: `dividend 被除数 = 被分的那个数 ${a}；${b} 是除数（divisor），${q0} 是商（quotient），${rem} 是余数。`, t: ['2.dividend','2.quotient']};
  const c = r.int(2, 20), n = b * 5 + rem;
  return {q: `When the positive integer n is divided by ${b}, the remainder is ${rem}. What is the remainder when n + ${c} is divided by ${b}?`,
    a: N((n + c) % b), w: [rem + c, rem, c % b, (rem + c) % b + 1].map(N),
    why: `写成 n = ${b}k + ${rem}，则 n + ${c} = ${b}k + ${rem + c}，${rem + c} 除以 ${b} 余 ${(rem + c) % b}。（例：n = ${n}，${n + c} ÷ ${b} 余 ${(n + c) % b}）`, t: ['2.remainder']};
});
P('lcmgcf', 2, ['2.least-common-multiple-lcm','2.greatest-common-factor-gcf'], r => {
  let a, b; do { a = r.int(4, 30); b = r.int(4, 40); } while (a === b || gcd(a, b) === 1 || a % b === 0 || b % a === 0);
  let L = 0; for (let m = Math.max(a, b); !L; m++) if (m % a === 0 && m % b === 0) L = m;
  let G = 1; for (let d = 1; d <= Math.min(a, b); d++) if (a % d === 0 && b % d === 0) G = d;
  const isL = r.chance(.5);
  return {q: `What is the ${isL ? 'least common multiple' : 'greatest common factor'} of ${a} and ${b}?`,
    a: N(isL ? L : G), w: [isL ? G : L, a * b, isL ? L * 2 : Math.min(a, b), isL ? Math.max(a, b) : G * 2].map(N),
    why: `${isL ? 'LCM 最小公倍数' : 'GCF 最大公因数'}：${a} = ${primeFactors(a).join('×')}，${b} = ${primeFactors(b).join('×')}；最小公倍数 ${L}，最大公因数 ${G}。`,
    t: [isL ? '2.least-common-multiple-lcm' : '2.greatest-common-factor-gcf']};
});
P('pfact', 2, ['2.prime-factorization'], r => {
  let e; do { e = [r.int(1, 4), r.int(0, 3), r.int(0, 2)]; } while (e.filter(Boolean).length < 2 || 2 ** e[0] * 3 ** e[1] * 5 ** e[2] > 3000);
  const show = x => [2, 3, 5].map((p, i) => x[i] ? p + (x[i] > 1 ? sup(x[i]) : '') : '').filter(Boolean).join(' × ');
  const n = 2 ** e[0] * 3 ** e[1] * 5 ** e[2], w = [];
  [[1, 0, 0], [0, 1, 0], [0, 0, 1], [-1, 0, 0], [0, -1, 0], [1, -1, 0], [-1, 1, 0]].forEach(d => {
    const x = e.map((v, i) => v + d[i]); if (x.every(v => v >= 0) && x.some(Boolean)) w.push(show(x));
  });
  if (e[0] >= 2) w.unshift('4' + (e[0] - 2 ? ' × 2' + (e[0] - 2 > 1 ? sup(e[0] - 2) : '') : '') + (e[1] ? ' × 3' + (e[1] > 1 ? sup(e[1]) : '') : '') + (e[2] ? ' × 5' + (e[2] > 1 ? sup(e[2]) : '') : ''));
  return {q: `What is the prime factorization of ${C(n)}?`, a: show(e), w,
    why: `prime factorization 质因数分解：只能用质数相乘，${C(n)} = ${show(e)}。${e[0] >= 2 ? '写成 4 × … 虽然乘积对，但 4 不是质数。' : ''}`};
});
P('relprime', 2, ['2.relatively-prime'], r => {
  const comp = Array.from({length: 37}, (_, i) => i + 4).filter(x => !isPrime(x));
  let a, b; do { a = r.pick(comp); b = r.pick(comp); } while (a >= b || gcd(a, b) !== 1);
  const w = [];
  while (w.length < 3) { const x = r.pick(comp), y = r.pick(comp); if (x < y && gcd(x, y) > 1 && !w.includes(x + ' and ' + y)) w.push(x + ' and ' + y); }
  return {q: 'Which of the following pairs of numbers are relatively prime?', a: a + ' and ' + b, w,
    why: `relatively prime 互质 = 最大公因数是 1（两个数本身不必是质数）：gcd(${a}, ${b}) = 1。其余各组都有大于 1 的公因数。`};
});
P('perfect', 2, ['2.perfect-square','2.perfect-cube'], r => {
  const sq = r.chance(.5), k = sq ? r.int(6, 30) : r.int(3, 12), v = sq ? k * k : k * k * k;
  const is = x => sq ? Math.round(Math.sqrt(x)) ** 2 === x : Math.round(Math.cbrt(x)) ** 3 === x;
  const w = [v - 1, v + 1, 2 * v, v + k, v - k, sq ? k * k * k : k * k].filter(x => x > 1 && !is(x));
  return {q: `Which of the following is a perfect ${sq ? 'square' : 'cube'}?`, a: C(v), w: w.map(C),
    why: `perfect ${sq ? 'square 完全平方数' : 'cube 完全立方数'}：${C(v)} = ${k}${sq ? '²' : '³'}。`, t: [sq ? '2.perfect-square' : '2.perfect-cube']};
});
P('digits', 2, ['2.units-digit','2.tens-digit','2.digit'], r => {
  let n; do { n = r.int(1000, 9999); } while (new Set(String(n)).size < 4);
  const d = String(n).split('').map(Number), tens = r.chance(.5);
  return {q: `What is the ${tens ? 'tens' : 'units'} digit of ${C(n)}?`, a: N(tens ? d[2] : d[3]), w: [d[3], d[2], d[1], d[0]].map(N),
    why: `${C(n)}：千位 ${d[0]}，百位 ${d[1]}，十位（tens digit）${d[2]}，个位（units digit）${d[3]}。`, t: [tens ? '2.tens-digit' : '2.units-digit', '2.digit']};
});
P('absval', 2, ['2.absolute-value'], r => {
  const a = -r.int(2, 15); let b = r.int(2, 15); if (b === -a) b++;
  if (r.chance(.5)) return {q: `What is the value of |${N(a)}| ${MINUS} |${b}|?`, a: N(-a - b), w: [a - b, -a + b, a + b].map(N),
    why: `absolute value 绝对值：|${N(a)}| = ${-a}，|${b}| = ${b}，${-a} − ${b} = ${N(-a - b)}。`};
  return {q: `What is the value of |${N(a)} + ${b}|?`, a: N(Math.abs(a + b)), w: [-a + b, a + b === 0 ? 1 : -Math.abs(a + b), a - b].map(N),
    why: `先算括号里：${N(a)} + ${b} = ${N(a + b)}，再取绝对值 = ${Math.abs(a + b)}。|a + b| 一般不等于 |a| + |b|。`};
});
P('unitspow', 2, ['2.units-digit','3.exponent'], r => {
  const b = r.pick([2, 3, 4, 7, 8, 9]), e = r.int(11, 49); let u = 1; for (let i = 0; i < e; i++) u = u * b % 10;
  const cyc = []; let x = b % 10; while (!cyc.includes(x)) { cyc.push(x); x = x * b % 10; }
  return {q: `What is the units digit of ${b}<sup>${e}</sup>?`, a: N(u), w: cyc.filter(c => c !== u).concat([b, 0, 1, 5]).map(N),
    why: `units digit 个位数字：${b} 的乘方个位按 ${cyc.join(' → ')} 循环（周期 ${cyc.length}），${e} 除以 ${cyc.length} 余 ${e % cyc.length || cyc.length}，个位是 ${u}。`};
});

/* ===== 3 代数与函数 ===== */
P('coef', 3, ['3.coefficient','3.constant','3.expression'], r => {
  const a = r.int(2, 9), b = r.int(2, 9), c = r.int(1, 12), v = r.int(0, 2), e = poly(a, -b, c);
  const ask = ['the coefficient of x', 'the coefficient of x²', 'the constant term'][v], ans = [-b, a, c][v];
  return {q: `In the expression ${e}, what is ${ask}?`, a: N(ans), w: [b, -b, a, c, -c].map(N),
    why: `coefficient 系数 = 变量前的数（连同符号）：x² 的系数 ${a}，x 的系数 ${N(-b)}；constant 常数项 ${c}。`, t: [v === 2 ? '3.constant' : '3.coefficient', '3.expression']};
});
P('subst', 3, ['3.substitute'], r => {
  const v = r.pick([-3, -2, 2, 3, 4]), a = r.int(2, 5), b = r.int(1, 9);
  return {q: `If x = ${N(v)}, what is the value of ${a}x² ${MINUS} ${b}?`, a: N(a * v * v - b), w: [(a * v) ** 2 - b, a * v * v + b, 2 * a * v - b, a * v - b].map(N),
    why: `substitute 代入：${a} × (${N(v)})² − ${b} = ${a} × ${v * v} − ${b} = ${N(a * v * v - b)}（先平方再乘系数）。`};
});
P('lineq', 3, ['3.linear-equation','3.solution'], r => {
  let x0 = r.int(-6, 12); if (!x0) x0 = 3;
  const a = r.int(2, 9), b = r.int(1, 15), c = a * x0 + b, w = [c - b, x0 + 1, x0 - 1, -x0];
  if ((c + b) % a === 0) w.unshift((c + b) / a);
  return {q: `If ${a}x + ${b} = ${N(c)}, what is the value of x?`, a: N(x0), w: w.map(N),
    why: `solve the linear equation 解一次方程：${a}x = ${N(c)} − ${b} = ${N(c - b)}，x = ${N(x0)}。`};
});
P('quadroots', 3, ['3.quadratic-equation','3.root-zero'], r => {
  const r1 = r.int(1, 8); let r2 = r.int(2, 9); if (r2 <= r1) r2 = r1 + 1;
  const s = r1 + r2, p = r1 * r2, f = x => x * x - s * x + p, w = [];
  [[-r1, -r2], [r1, -r2], [1, p], [r1, r2 + 1], [r1 - 1, r2]].forEach(([u, v]) => { if (!(f(u) === 0 && f(v) === 0) && u !== v) w.push(N(u) + ' and ' + N(v)); });
  return {q: `What are the roots of the quadratic equation ${poly(1, -s, p)} = 0?`, a: r1 + ' and ' + r2, w,
    why: `root 根 = 使方程为 0 的 x：${poly(1, -s, p)} = (${xm(r1)})(${xm(r2)})，根是 ${r1} 和 ${r2}（不是 −${r1}、−${r2}）。`};
});
P('system', 3, ['3.system-of-equations'], r => {
  const x0 = r.int(2, 15); let y0 = r.int(1, 14); if (y0 === x0) y0 = x0 - 1;
  const s = x0 + y0, d = x0 - y0, askX = r.chance(.5);
  return {q: `If x + y = ${s} and x ${MINUS} y = ${N(d)}, what is the value of ${askX ? 'x' : 'y'}?`, a: N(askX ? x0 : y0), w: [askX ? y0 : x0, s + d, s - d, s].map(N),
    why: `system of equations 方程组：两式相加 2x = ${s + d}，x = ${x0}；代回 y = ${y0}。`};
});
P('expand', 3, ['3.expand'], r => {
  const a = r.int(1, 9); let b = r.int(1, 9); if (b === a) b = a === 9 ? 1 : a + 1;
  return {q: `Expand (x + ${a})(x ${MINUS} ${b}).`, a: poly(1, a - b, -a * b), w: [poly(1, b - a, -a * b), poly(1, a - b, a * b), poly(1, 0, -a * b), poly(1, a + b, -a * b)],
    why: `expand 展开 = 乘开：x² ${MINUS} ${b === 1 ? '' : b}x + ${a === 1 ? '' : a}x ${MINUS} ${a * b} = ${poly(1, a - b, -a * b)}。`};
});
P('factor', 3, ['3.factor-verb'], r => {
  if (r.chance(.5)) {
    const k = r.int(2, 12);
    return {q: `Factor ${poly(1, 0, -k * k)}.`, a: `(x + ${k})(x ${MINUS} ${k})`, w: [`(x ${MINUS} ${k})²`, `(x + ${k})²`, `(x ${MINUS} ${k * k})(x + 1)`],
      why: `factor 因式分解（与 expand 相反）：平方差 x² − ${k * k} = (x + ${k})(x − ${k})。`};
  }
  const a = r.int(1, 7); let b = r.int(2, 9); if (b === a) b++;
  return {q: `Factor ${poly(1, a + b, a * b)}.`, a: `(x + ${a})(x + ${b})`, w: [`(x ${MINUS} ${a})(x ${MINUS} ${b})`, `(x + ${a})(x ${MINUS} ${b})`, `(x + ${a * b})(x + 1)`],
    why: `factor 因式分解：找两个数相乘得 ${a * b}、相加得 ${a + b} → ${a} 和 ${b}，所以 = (x + ${a})(x + ${b})。`};
});
P('expbase', 3, ['3.exponent','3.base'], r => {
  if (r.chance(.5)) {
    const b = r.pick([2, 3]), n = b === 2 ? r.int(3, 10) : r.int(2, 6), v = b ** n;
    return {q: `If ${b}<sup>n</sup> = ${C(v)}, what is the value of the exponent n?`, a: N(n), w: [v / b, n + 1, n - 1, v / n === Math.floor(v / n) ? v / n : n + 2].map(N),
      why: `exponent 指数 = 右上角的数：${b} 乘 ${n} 次等于 ${C(v)}，n = ${n}。`, t: ['3.exponent']};
  }
  const b = r.int(2, 9); let e = r.int(2, 5); if (e === b) e = b === 2 ? 3 : 2;
  return {q: `In the expression ${b}<sup>${e}</sup>, which number is the base?`, a: N(b), w: [e, b ** e, b * e].map(N),
    why: `base 底数 = 被乘的那个数 ${b}；${e} 是 exponent 指数；${b}${sup(e)} = ${b ** e}。`, t: ['3.base','3.exponent']};
});
P('roots', 3, ['3.square-root','3.cube-root'], r => {
  const k = r.int(2, 15), m = r.int(2, 6);
  return {q: `What is the positive square root of ${k * k} plus the cube root of ${m ** 3}?`, a: N(k + m), w: [k + m * m, k * m, k + m + 1, k * k + m].map(N),
    why: `square root 平方根：√${k * k} = ${k}；cube root 立方根：∛${m ** 3} = ${m}；和为 ${k + m}。`};
});
P('recip', 3, ['3.reciprocal'], r => {
  let p, q; do { p = r.int(2, 9); q = r.int(2, 9); } while (p === q || gcd(p, q) !== 1);
  if (r.chance(.6)) return {q: `What is the reciprocal of ${p}/${q}?`, a: F(q, p), w: [F(-p, q), F(-q, p), F(p, q)],
    why: `reciprocal 倒数：分子分母对调，${p}/${q} → ${q}/${p}（乘积为 1）。加负号是相反数（opposite），不是倒数。`};
  return {q: `What is the reciprocal of ${MINUS}${p}?`, a: F(-1, p), w: [F(1, p), N(p), N(-p)],
    why: `reciprocal 倒数：−${p} 的倒数是 −1/${p}（符号不变）。`};
});
P('func', 3, ['3.function'], r => {
  const a = r.int(2, 6), b = r.int(1, 9), v = r.pick([-3, -2, -1, 2, 3, 4, 5, 6]);
  return {q: `If f(x) = ${a}x ${MINUS} ${b}, what is f(${N(v)})?`, a: N(a * v - b), w: [a * v + b, a + v - b, a * (v - b), a * v].map(N),
    why: `function 函数：把 x = ${N(v)} 代入，f(${N(v)}) = ${a} × ${N(v)} − ${b} = ${N(a * v - b)}。`};
});
P('domain', 3, ['3.domain','3.range-of-a-function','8.range'], r => {
  const c = r.int(1, 9);
  if (r.chance(.5)) return {q: `What is the domain of the function f(x) = √(x ${MINUS} ${c})?`, a: `x ≥ ${c}`, w: [`x &gt; ${c}`, 'x ≥ 0', `x ≤ ${c}`],
    why: `domain 定义域 = x 允许取的值：根号内 x − ${c} ≥ 0 → x ≥ ${c}（可以等于 ${c}，√0 = 0）。`, t: ['3.domain']};
  return {q: `What is the range of the function f(x) = x² + ${c}?`, a: `f(x) ≥ ${c}`, w: ['f(x) ≥ 0', 'all real numbers', `f(x) &gt; ${c}`],
    why: `range (of a function) 值域 = 函数值能取到的范围：x² ≥ 0，所以 f(x) ≥ ${c}（x = 0 时取到 ${c}）。`, t: ['3.range-of-a-function','8.range']};
});
P('slope', 3, ['3.slope'], r => {
  let x1, y1, x2, y2;
  do { x1 = r.int(-5, 6); y1 = r.int(-5, 9); x2 = r.int(-5, 8); y2 = r.int(-5, 12); }
  while (x1 === x2 || y1 === y2 || Math.abs(y2 - y1) === Math.abs(x2 - x1));
  return {q: `What is the slope of the line that passes through the points (${N(x1)}, ${N(y1)}) and (${N(x2)}, ${N(y2)})?`,
    a: F(y2 - y1, x2 - x1), w: [F(x2 - x1, y2 - y1), F(y1 - y2, x2 - x1), F(y2 + y1, x2 + x1 || 1)],
    why: `slope 斜率 = 纵坐标变化 ÷ 横坐标变化 = (${Np(y2)} − ${Np(y1)}) / (${Np(x2)} − ${Np(x1)}) = ${F(y2 - y1, x2 - x1)}（不是横 ÷ 纵）。`};
});
P('intercepts', 3, ['3.x-intercept','3.y-intercept','3.intercept'], r => {
  let m = r.int(-5, 5); if (!m) m = 2; let b; do { b = r.int(-9, 9); } while (!b || b === m || b === -m);
  const eq = 'y = ' + lin(m, b);
  if (r.chance(.5)) return {q: `For the line ${eq}, what is the y-intercept?`, a: N(b), w: [F(-b, m), N(m), N(-b)],
    why: `y-intercept y 轴截距 = 直线与 y 轴交点的 y 值（令 x = 0）：y = ${N(b)}。`, t: ['3.y-intercept','3.intercept']};
  return {q: `For the line ${eq}, what is the x-intercept?`, a: F(-b, m), w: [N(b), F(b, m), F(-m, b)],
    why: `x-intercept x 轴截距 = 令 y = 0：${lin(m, b)} = 0 → x = ${F(-b, m)}。`, t: ['3.x-intercept','3.intercept']};
});
P('incdec', 3, ['3.increasing-function','3.decreasing-function'], r => {
  const dec = r.chance(.5), s = dec ? -1 : 1, k = () => r.int(2, 6), c = () => r.int(1, 9);
  return {q: `Which of the following functions is ${dec ? 'decreasing' : 'increasing'} for all x?`, a: 'f(x) = ' + lin(s * k(), c()),
    w: ['f(x) = ' + lin(-s * k(), c()), 'f(x) = ' + lin(-s * k(), -c()), 'f(x) = ' + c()],
    why: `${dec ? 'decreasing function 递减函数：x 增大 f(x) 变小，一次函数斜率为负' : 'increasing function 递增函数：x 增大 f(x) 变大，一次函数斜率为正'}；常数函数既不增也不减。`,
    t: [dec ? '3.decreasing-function' : '3.increasing-function']};
});
P('ineqflip', 3, ['3.inequality','3.linear-inequality'], r => {
  const a = r.int(2, 6), b = r.int(1, 20);
  return {q: `Which of the following is equivalent to ${MINUS}${a}x &gt; ${b}?`, a: `x &lt; ${F(-b, a)}`, w: [`x &gt; ${F(-b, a)}`, `x &lt; ${F(b, a)}`, `x &gt; ${F(b, a)}`],
    why: `linear inequality 一次不等式：两边除以 −${a}（负数）时不等号要反转 → x < ${F(-b, a)}。`};
});
P('absineq', 3, ['3.absolute-value-inequality','3.compound-inequality'], r => {
  let c = r.int(-3, 8); if (!c) c = 2; const d = r.int(1, 6);
  return {q: `Which of the following describes all values of x such that |${xm(c)}| &lt; ${d}?`, a: `${N(c - d)} &lt; x &lt; ${N(c + d)}`,
    w: [`x &lt; ${N(c - d)} or x &gt; ${N(c + d)}`, `${N(-d)} &lt; x &lt; ${N(d)}`, `${N(c - d)} ≤ x ≤ ${N(c + d)}`],
    why: `absolute value inequality：|x − (${N(c)})| < ${d} 表示 x 到 ${N(c)} 的距离小于 ${d} → compound inequality ${N(c - d)} < x < ${N(c + d)}（严格小于，不含端点）。`};
});

/* ===== 4 概率与排列组合 ===== */
const DICE = []; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) DICE.push([a, b]);
const coins = n => Array.from({length: 2 ** n}, (_, m) => Array.from({length: n}, (_, i) => (m >> i) & 1));   // 1 = heads
P('pbasic', 4, ['4.probability','4.randomly-selected','4.favorable-outcomes','4.event'], r => {
  const red = r.int(2, 7), blue = r.int(2, 7), green = r.int(1, 5), n = red + blue + green;
  return {q: `A bag contains ${red} red, ${blue} blue, and ${green} green marbles. One marble is randomly selected. What is the probability that it is red?`,
    a: F(red, n), w: [F(red, n - red), F(n - red, n), F(1, 3), F(red, blue + green + 1)],
    why: `probability 概率 = favorable outcomes 有利结果 ÷ 全部结果 = ${red} / ${n} = ${F(red, n)}。`};
});
P('repl', 4, ['4.without-replacement','4.with-replacement','4.draw-select','8.without-replacement','4.dependent-events','4.independent-events'], r => {
  const red = r.int(2, 6), blue = r.int(2, 6), n = red + blue, bag = Array.from({length: n}, (_, i) => i < red);
  let fav = [0, 0], all = [0, 0];
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const k = i === j ? 1 : 0; all[0]++; if (bag[i] && bag[j]) fav[0]++; if (!k) { all[1]++; if (bag[i] && bag[j]) fav[1]++; } }
  const repl = r.chance(.45), ans = repl ? F(fav[0], all[0]) : F(fav[1], all[1]);
  return {q: `A box contains ${red} red balls and ${blue} blue balls. Two balls are drawn at random ${repl ? 'with' : 'without'} replacement. What is the probability that both balls are red?`,
    a: ans, w: [repl ? F(fav[1], all[1]) : F(fav[0], all[0]), F(red, n), F(red * (red - 1), n * n), F(2 * red, n * 2 + 1)],
    why: repl ? `with replacement 放回：两次抽取互不影响（independent），都是 ${red}/${n}，(${red}/${n})² = ${ans}。` : `without replacement 不放回：第二次受第一次影响（dependent events），总数和红球都少 1，${red}/${n} × ${red - 1}/${n - 1} = ${ans}。`,
    t: repl ? ['4.with-replacement', '4.independent-events', '4.draw-select'] : ['4.without-replacement', '4.dependent-events', '8.without-replacement']};
});
P('conddice', 4, ['4.conditional-probability','4.given-that','1.given-that','4.at-least-one'], r => {
  let s, k, den, num;
  do { s = r.int(4, 10); k = r.int(1, 6); const g = DICE.filter(d => d[0] + d[1] === s); den = g.length; num = g.filter(d => d[0] === k || d[1] === k).length; } while (!num || num === den);
  const all = DICE.filter(d => d[0] === k || d[1] === k).length;
  return {q: `Two fair six-sided dice are rolled. Given that the sum of the two numbers is ${s}, what is the probability that at least one die shows a ${k}?`,
    a: F(num, den), w: [F(num, 36), F(all, 36), F(1, 6), F(num, den + 1)],
    why: `given that 条件概率：样本空间缩小为“和为 ${s}”的 ${den} 种（${DICE.filter(d => d[0] + d[1] === s).map(d => '(' + d + ')').join(' ')}），其中至少一个 ${k} 的有 ${num} 种 → ${F(num, den)}。分母不是 36。`};
});
P('condcoins', 4, ['4.given-that','1.given-that','4.at-least-one','4.conditional-probability','4.exactly-one'], r => {
  const n = r.pick([2, 3]), all = coins(n), given = all.filter(c => sum(c) >= 1), ex = r.chance(.5) && n === 3;
  const f = ex ? (c => sum(c) === 1) : (c => sum(c) === n), num = given.filter(f).length;
  return {q: `${n === 2 ? 'Two' : 'Three'} fair coins are tossed. Given that at least one coin shows heads, what is the probability that ${ex ? 'exactly one coin shows' : 'all ' + (n === 2 ? 'both coins show' : 'three coins show')} heads?`.replace('all both', 'both'),
    a: F(num, given.length), w: [F(all.filter(f).length, all.length), F(1, 2), F(given.length - num, given.length), F(num, given.length + 1), F(1, n)],
    why: `given that at least one heads：先把 ${all.length} 种结果里“全是反面”的 1 种去掉，剩 ${given.length} 种；其中符合的有 ${num} 种 → ${F(num, given.length)}。`,
    t: ['4.given-that','4.at-least-one'].concat(ex ? ['4.exactly-one'] : ['4.conditional-probability'], ['1.given-that'])};
});
P('complement', 4, ['4.complementary-event','4.at-least-one'], r => {
  if (r.chance(.5)) {
    const n = r.int(3, 5), all = coins(n), c = all.filter(x => sum(x) >= 1).length;
    return {q: `A fair coin is tossed ${n} times. What is the probability of getting at least one head?`, a: F(c, all.length), w: [F(1, all.length), F(n, all.length), F(1, 2), F(n, 2 * n)],
      why: `complementary event 对立事件：P(至少一次正面) = 1 − P(全是反面) = 1 − 1/${all.length} = ${F(c, all.length)}。`};
  }
  const c = DICE.filter(d => d[0] === 6 || d[1] === 6).length, one = DICE.filter(d => (d[0] === 6) !== (d[1] === 6)).length;
  return {q: 'A fair six-sided die is rolled twice. What is the probability that at least one of the rolls is a 6?', a: F(c, 36), w: [F(2, 6), F(1, 36), F(25, 36), F(one, 36)],
    why: `complementary event：1 − P(两次都不是 6) = 1 − 25/36 = 11/36。直接把 1/6 + 1/6 会把 (6,6) 算两次。`};
});
P('exone', 4, ['4.exactly-one','8.exactly-one'], r => {
  const n = r.int(3, 5), all = coins(n), c = all.filter(x => sum(x) === 1).length;
  return {q: `A fair coin is tossed ${n} times. What is the probability of getting exactly one head?`, a: F(c, all.length),
    w: [F(all.length - 1, all.length), F(1, all.length), F(1, 2), F(n + 1, all.length), F(1, n)],
    why: `exactly one 恰好一个：${n} 次里只有一次正面的情况有 ${c} 种，共 ${all.length} 种 → ${F(c, all.length)}。两次及以上正面不算。`};
});
P('indmut', 4, ['4.independent-events','4.mutually-exclusive','4.both','4.either-or'], r => {
  let pa, pb, or; do { pa = fr(r.int(1, 2), r.pick([3, 4, 5])); pb = fr(1, r.pick([2, 3, 4, 6])); or = fadd(pa, pb); } while (or[0] >= or[1]);
  const both = fmul(pa, pb), inc = fsub(or, both);
  const v = r.int(0, 2);
  if (v === 0) return {q: `Events A and B are independent, P(A) = ${FT(pa)}, and P(B) = ${FT(pb)}. What is the probability that both A and B occur?`,
    a: FT(both), w: [FT(or), FT(inc), '0'], why: `independent events 独立事件：P(A 且 B) = P(A) × P(B) = ${FT(both)}。`, t: ['4.independent-events','4.both']};
  if (v === 1) return {q: `Events A and B are mutually exclusive, P(A) = ${FT(pa)}, and P(B) = ${FT(pb)}. What is the probability that A or B occurs?`,
    a: FT(or), w: [FT(both), FT(inc), '1'], why: `mutually exclusive 互斥：不会同时发生，P(A 或 B) = P(A) + P(B) = ${FT(or)}。`, t: ['4.mutually-exclusive','4.either-or']};
  return {q: `Events A and B are mutually exclusive, P(A) = ${FT(pa)}, and P(B) = ${FT(pb)}. What is the probability that both A and B occur?`,
    a: '0', w: [FT(both), FT(or), FT(inc)], why: '互斥事件不能同时发生，P(A 且 B) = 0。把 mutually exclusive 当成 independent 才会去乘。', t: ['4.mutually-exclusive','4.independent-events']};
});
P('permcomb', 4, ['4.permutation','4.combination','4.arrangement'], r => {
  const n = r.int(5, 10), k = r.pick([2, 3]), P_ = fact(n) / fact(n - k), C_ = P_ / fact(k), comb = r.chance(.5);
  if (comb) return {q: `In how many different ways can a committee of ${k} people be selected from a group of ${n} people?`, a: C(C_),
    w: [C(P_), C(n * k), C(fact(n) / fact(n - k + 1) / fact(k - 1)), C(n ** k)],
    why: `combination 组合（不计顺序，委员会里没有职位）：C(${n}, ${k}) = ${C(P_)} ÷ ${k}! = ${C(C_)}。`, t: ['4.combination']};
  return {q: `In how many different ways can a president${k === 3 ? ', a vice president, and a treasurer' : ' and a vice president'} be chosen from a group of ${n} people, if no person can hold more than one position?`,
    a: C(P_), w: [C(C_), C(n * k), C(n ** k), C(fact(n))],
    why: `permutation 排列（职位不同 → 顺序有关）：${Array.from({length: k}, (_, i) => n - i).join(' × ')} = ${C(P_)}。`, t: ['4.permutation','4.arrangement']};
});
P('fact', 4, ['4.factorial','4.arrangement'], r => {
  if (r.chance(.5)) {
    const n = r.int(4, 7);
    return {q: `In how many different ways can ${n} different books be arranged in a row on a shelf?`, a: C(fact(n)), w: [C(n * n), C(n * (n - 1)), C(fact(n - 1)), C(2 ** n)],
      why: `arrangement 排列方式：${n} 本不同的书排成一排 = ${n}! = ${Array.from({length: n}, (_, i) => n - i).join(' × ')} = ${C(fact(n))}。`, t: ['4.arrangement','4.factorial']};
  }
  const n = r.int(6, 10), m = n - r.int(1, 3); let p = 1; for (let i = m + 1; i <= n; i++) p *= i;
  return {q: `What is the value of ${n}!/${m}!?`, a: C(p), w: [C(fact(n - m)), F(n, m), C(n * m), C(p / n)],
    why: `factorial 阶乘：${n}! / ${m}! = ${Array.from({length: n - m}, (_, i) => n - i).join(' × ')} = ${C(p)}（不是 (${n} − ${m})!）。`, t: ['4.factorial']};
});
P('venn', 4, ['4.neither','4.both','4.union','4.exactly-one'], r => {
  let T, a, b, c; do { T = r.int(40, 100); a = r.int(10, 50); b = r.int(10, 50); c = r.int(3, Math.min(a, b) - 2); } while (a + b - c >= T);
  const v = r.int(0, 2), u = a + b - c, ex1 = a + b - 2 * c;
  const stem = `Of the ${T} students in a club, ${a} study French, ${b} study Spanish, and ${c} study both languages. `;
  if (v === 0) return {q: stem + 'How many of the students study neither language?', a: N(T - u), w: [T - a - b, c, u, T - a - b + 2 * c].map(N),
    why: `neither 两者都不：先算至少学一门的 ${a} + ${b} − ${c} = ${u}（both 被算了两次要减一次），${T} − ${u} = ${T - u}。`, t: ['4.neither','4.both']};
  if (v === 1) return {q: stem + 'How many of the students study French or Spanish, or both?', a: N(u), w: [a + b, ex1, T - u].map(N),
    why: `union 并集：${a} + ${b} − ${c} = ${u}（交集 both 只能算一次）。`, t: ['4.union','4.both']};
  return {q: stem + 'How many of the students study exactly one of the two languages?', a: N(ex1), w: [u, a + b, c, a - c].map(N),
    why: `exactly one 恰好一门：只学法语 ${a - c} + 只学西语 ${b - c} = ${ex1}（两门都学的不算）。`, t: ['4.exactly-one','4.both']};
});
P('sets', 4, ['4.union','4.intersection'], r => {
  let A, B, I;
  do { const pool = r.shuffle(Array.from({length: 14}, (_, i) => i + 1)); A = pool.slice(0, r.int(4, 6)).sort((x, y) => x - y); B = r.shuffle(pool.slice(0, 10)).slice(0, r.int(4, 6)).sort((x, y) => x - y); I = A.filter(x => B.includes(x)); } while (I.length < 1 || I.length === A.length || I.length === B.length);
  const U = new Set([...A, ...B]).size, un = r.chance(.5);
  return {q: `Set A = {${A.join(', ')}} and set B = {${B.join(', ')}}. How many elements are in ${un ? 'the union of A and B' : 'the intersection of A and B'}?`,
    a: N(un ? U : I.length), w: [A.length + B.length, un ? I.length : U, A.length + B.length - 2 * I.length, Math.max(A.length, B.length)].map(N),
    why: `${un ? 'union 并集 A ∪ B：属于 A 或 B 的元素，重复的只算一次' : 'intersection 交集 A ∩ B：同时属于 A 和 B'}。交集 = {${I.join(', ')}}，并集共 ${U} 个。`, t: [un ? '4.union' : '4.intersection']};
});
P('space', 4, ['4.sample-space','4.outcome','4.simultaneously'], r => {
  const v = r.int(0, 2);
  if (v === 0) { const n = r.int(2, 4); return {q: `${['', '', 'Two', 'Three', 'Four'][n]} fair coins are tossed simultaneously. How many outcomes are in the sample space?`, a: N(coins(n).length), w: [2 * n, n + 1, n * n, 2 ** n + 2].map(N),
    why: `sample space 样本空间 = 所有可能结果：每枚 2 种，${n} 枚同时抛 = 2${sup(n)} = ${2 ** n}。`}; }
  if (v === 1) return {q: 'Two fair six-sided dice are rolled simultaneously. How many outcomes are in the sample space?', a: N(DICE.length), w: [12, 11, 21, 6].map(N),
    why: 'sample space：6 × 6 = 36 种有序结果（(1,2) 和 (2,1) 是不同的结果）。'};
  return {q: 'A fair coin is tossed and a fair six-sided die is rolled simultaneously. How many outcomes are in the sample space?', a: '12', w: ['8', '6', '36', '2'],
    why: 'sample space：硬币 2 种 × 骰子 6 种 = 12 种结果。'};
});

/* ===== 5 统计与数据变换 ===== */
P('mmmr', 5, ['5.arithmetic-mean-average','5.median','5.mode','5.range-of-a-data-set','5.data-set','8.range'], r => {
  let vals, sorted;
  for (;;) {
    const pool = r.shuffle(Array.from({length: 38}, (_, i) => i + 2)).slice(0, 6).sort((x, y) => x - y);
    const dup = pool[r.int(0, 4)]; vals = pool.concat([dup]);
    const add = (7 - sum(vals) % 7) % 7; vals[5] += add;          // pool[5] is the largest: stays largest and distinct
    sorted = vals.slice().sort((x, y) => x - y);
    if (sorted[6] <= 45) break;
  }
  const shown = r.shuffle(vals.slice()), dupv = sorted.find((x, i) => sorted[i + 1] === x);
  const st = {mean: sum(vals) / 7, median: sorted[3], mode: dupv, range: sorted[6] - sorted[0]};
  const k = r.pick(['mean', 'median', 'mode', 'range']), name = {mean: 'arithmetic mean', median: 'median', mode: 'mode', range: 'range'}[k];
  return {q: `What is the ${name} of the data set ${list(shown)}?`, a: N(st[k]), w: ['mean', 'median', 'mode', 'range'].filter(x => x !== k).map(x => N(st[x])).concat([N(shown[3]), N(sorted[6]), N(st[k] + 1)]),
    why: `排序：${list(sorted)}。mean 平均数 ${st.mean}，median 中位数（第 4 个）${st.median}，mode 众数 ${st.mode}，range 极差 ${sorted[6]} − ${sorted[0]} = ${st.range}。`,
    t: [{mean: '5.arithmetic-mean-average', median: '5.median', mode: '5.mode', range: '5.range-of-a-data-set'}[k], '5.data-set'].concat(k === 'range' ? ['8.range'] : [])};
});
P('wavg', 5, ['5.weighted-average','5.weighted-sum'], r => {
  let na, nb, ma, mb; do { na = r.int(10, 30); nb = r.int(10, 30); ma = r.int(60, 95); mb = r.int(60, 95); } while (na === nb || ma === mb || (na * ma + nb * mb) % (na + nb) || (ma + mb) % 2);
  const w = (na * ma + nb * mb) / (na + nb);
  return {q: `In a class, ${na} students have an average score of ${ma}, and the other ${nb} students have an average score of ${mb}. What is the average score of all the students in the class?`,
    a: N(w), w: [N((ma + mb) / 2), N(ma), N(mb), N(w + 1)],
    why: `weighted average 加权平均：weighted sum 加权和 ${na}×${ma} + ${nb}×${mb} = ${na * ma + nb * mb}，除以总人数 ${na + nb} = ${w}。人数不同，不能直接 (${ma} + ${mb}) ÷ 2。`};
});
P('transform', 5, ['5.standard-deviation','5.transformed-data-set','5.remain-unchanged','5.variance','5.arithmetic-mean-average','5.observation','8.standard-deviation'], r => {
  const m = r.int(10, 50), s = r.int(2, 9), v = r.int(0, 3);
  if (v === 0) { const c = r.int(3, 12), sdq = r.chance(.6);
    return {q: `A data set has an arithmetic mean of ${m} and a standard deviation of ${s}. If ${c} is added to every observation, what is the ${sdq ? 'standard deviation' : 'arithmetic mean'} of the transformed data set?`,
      a: N(sdq ? s : m + c), w: sdq ? [s + c, s * c, 0, m + c].map(N) : [m, m * c, s + c, m + c + 1].map(N),
      why: sdq ? `每个数都加 ${c} 只是整体平移：standard deviation 标准差 remains unchanged 保持不变 = ${s}。` : `每个数加 ${c}，平均数也加 ${c}：${m} + ${c} = ${m + c}。`,
      t: (sdq ? ['5.standard-deviation','5.remain-unchanged','5.transformed-data-set'] : ['5.arithmetic-mean-average','5.transformed-data-set']).concat(['5.observation'])}; }
  const b = r.pick([-3, -2, 2, 3]), a = r.int(1, 9);
  if (v === 1) return {q: `A data set has an arithmetic mean of ${m} and a standard deviation of ${s}. If every observation is multiplied by ${N(b)} and then ${a} is added, what is the standard deviation of the transformed data set?`,
    a: N(Math.abs(b) * s), w: [b * s, Math.abs(b) * s + a, s, b * b * s, Math.abs(b) * s + 1].map(N),
    why: `y = ${a} + (${N(b)})x：新标准差 = |b| × 原标准差 = ${Math.abs(b)} × ${s} = ${Math.abs(b) * s}（加 ${a} 不影响；标准差不会是负数）。`, t: ['5.standard-deviation','5.transformed-data-set','8.standard-deviation']};
  if (v === 2) return {q: `A data set has an arithmetic mean of ${m} and a variance of ${s * s}. If every observation is multiplied by ${N(b)}, what is the variance of the transformed data set?`,
    a: N(b * b * s * s), w: [Math.abs(b) * s * s, b * s * s, s * s, Math.abs(b) * s].map(N),
    why: `variance 方差 = 标准差²：乘以 ${N(b)} 后方差 × b² = ${b * b}，${s * s} × ${b * b} = ${b * b * s * s}。`, t: ['5.variance','5.transformed-data-set']};
  return {q: `A data set has an arithmetic mean of ${m} and a standard deviation of ${s}. If every observation is multiplied by ${N(b)} and then ${a} is added, what is the arithmetic mean of the transformed data set?`,
    a: N(b * m + a), w: [m * Math.abs(b) + a, b * m, m + a, b * (m + a)].map(N),
    why: `新平均数 = a + b × 原平均数 = ${a} + (${N(b)}) × ${m} = ${N(b * m + a)}。`, t: ['5.arithmetic-mean-average','5.transformed-data-set']};
});
P('sdcompare', 5, ['5.standard-deviation','5.spread-dispersion'], r => {
  const c = r.int(5, 20), big = r.chance(.6), sets = [[c + 50, c + 50, c + 50, c + 50], [c - 1, c, c, c + 1], [c - 2, c, c, c + 2], [c - 5, c, c, c + 5]];
  const sd = sets.map(variance), pick = big ? sd.indexOf(Math.max(...sd)) : sd.indexOf(Math.min(...sd));
  const show = s => '{' + list(s) + '}';
  return {q: `Which of the following data sets has the ${big ? 'greatest' : 'least'} standard deviation?`, a: show(sets[pick]), w: sets.filter((_, i) => i !== pick).map(show),
    why: `standard deviation 标准差衡量 spread 离散程度（离平均数有多远），与数值本身大小无关：{${list(sets[0])}} 全部相同，标准差为 0；{${list(sets[3])}} 最分散。`};
});
P('sdvalue', 5, ['5.population-standard-deviation','5.population-variance','5.standard-deviation','5.variance'], r => {
  const k = r.int(1, 3), c = r.int(0, 10), vals = [2, 4, 4, 4, 5, 5, 7, 9].map(x => k * x + c), V = variance(vals), sd = Math.sqrt(V), varq = r.chance(.4);
  return {q: `What is the population ${varq ? 'variance' : 'standard deviation'} of the data set ${list(vals)}?`,
    a: N(varq ? V : sd), w: (varq ? [sd, 2 * V, V / 2, V + 4, 4 * V] : [V, 7 * k, mean(vals), sd + 1]).map(N),
    why: `平均数 ${mean(vals)}；各数与平均数之差的平方的平均 = ${V}（population variance 总体方差）；开方得 population standard deviation 总体标准差 ${sd}。`,
    t: varq ? ['5.population-variance','5.variance'] : ['5.population-standard-deviation','5.standard-deviation']};
});
P('iqr', 5, ['5.interquartile-range-iqr','5.quartile'], r => {
  let v; do { const s = new Set(); while (s.size < 8) s.add(r.int(1, 60)); v = [...s].sort((x, y) => x - y); } while ((v[1] + v[2]) % 2 || (v[5] + v[6]) % 2);
  const q1 = (v[1] + v[2]) / 2, q3 = (v[5] + v[6]) / 2, k = r.int(0, 2);
  const ask = ['the interquartile range', 'the first quartile', 'the third quartile'][k], ans = [q3 - q1, q1, q3][k];
  return {q: `For the data set ${list(v)}, what is ${ask}?`, a: N(ans), w: [v[7] - v[0], q3, q1, q3 - q1, v[6] - v[1], (v[3] + v[4]) / 2 === Math.floor((v[3] + v[4]) / 2) ? (v[3] + v[4]) / 2 : v[3]].map(N),
    why: `quartile 四分位数（8 个数分成前后两半）：Q1 = 前一半 ${list(v.slice(0, 4))} 的中位数 ${q1}，Q3 = 后一半 ${list(v.slice(4))} 的中位数 ${q3}；IQR 四分位距 = Q3 − Q1 = ${q3 - q1}。`,
    t: k ? ['5.quartile'] : ['5.interquartile-range-iqr','5.quartile']};
});
P('incby', 5, ['5.increase-by','5.increase-to','5.twice-as-large-as'], r => {
  const v = r.int(0, 2);
  if (v === 0) { let x, p; do { x = r.pick([40, 50, 60, 80, 120, 150, 200, 250]); p = r.pick([10, 20, 25, 50]); } while (x * p % 100);
    return {q: `A quantity of ${x} is increased by ${p}%. What is the new quantity?`, a: N(x + x * p / 100), w: [x * p / 100, x + p, x - x * p / 100, x * (100 + p) / 10].map(N),
      why: `increase by ${p}% 增加了 ${p}%：${x} × ${1 + p / 100} = ${x + x * p / 100}。`, t: ['5.increase-by']}; }
  if (v === 1) { let x, p; do { x = r.pick([40, 50, 60, 80, 120, 150, 200]); p = r.pick([120, 150, 200, 250, 300]); } while (x * p % 100);
    return {q: `A quantity of ${x} is increased to ${p}% of its original value. What is the new quantity?`, a: N(x * p / 100), w: [x + x * p / 100, x + p, x * (p - 100) / 100].map(N),
      why: `increase to ${p}% 增加到原来的 ${p}%：${x} × ${p / 100} = ${x * p / 100}（不是再加 ${p}%）。`, t: ['5.increase-to']}; }
  const y = r.int(6, 40);
  return {q: `x is twice as large as y. If x = ${2 * y}, what is the value of y?`, a: N(y), w: [4 * y, 2 * y - 2, 2 * y + 2].map(N),
    why: `twice as large as 是……的两倍：x = 2y，${2 * y} = 2y → y = ${y}。`, t: ['5.twice-as-large-as']};
});
P('relfreq', 5, ['5.relative-frequency','5.frequency'], r => {
  const cats = ['A', 'B', 'C', 'D'], f = cats.map(() => r.int(2, 15)), T = sum(f), i = r.int(0, 3);
  const table = `<table class="qt"><tr><th>Category</th>${cats.map(c => `<td>${c}</td>`).join('')}</tr><tr><th>Frequency</th>${f.map(x => `<td>${x}</td>`).join('')}</tr></table>`;
  return {q: `${table}What is the relative frequency of category ${cats[i]}?`, a: F(f[i], T), w: [N(f[i]), F(f[i], T - f[i]), F(1, 4), F(f[i], 100)],
    why: `frequency 频数 = 出现次数 ${f[i]}；relative frequency 相对频率 = 频数 ÷ 总数 = ${f[i]} / ${T} = ${F(f[i], T)}。`};
});
S('normal68', 5, ['5.normal-distribution','5.standard-deviation'], 'In a normal distribution, approximately what percent of the data lie within one standard deviation of the mean?', '68%', ['50%', '95%', '34%'],
  'normal distribution 正态分布：约 68% 在平均数 ±1 个标准差内，约 95% 在 ±2 个标准差内（34% 只是一侧）。');
S('normal95', 5, ['5.normal-distribution','5.standard-deviation'], 'In a normal distribution, approximately what percent of the data lie within two standard deviations of the mean?', '95%', ['68%', '99%', '47.5%'],
  'normal distribution 正态分布：±2 个标准差内约 95%（±1 个约 68%）。');
S('symmetric', 5, ['5.symmetric-distribution','5.median','5.arithmetic-mean-average'], 'For a data set with a perfectly symmetric distribution, how do the mean and the median compare?', 'The mean is equal to the median.', ['The mean is greater than the median.', 'The mean is less than the median.', 'The relationship cannot be determined.'],
  'symmetric distribution 对称分布：数据关于中心左右对称，平均数 = 中位数。');
S('outlier', 5, ['5.outlier','5.arithmetic-mean-average','5.median'], 'The data set 3, 4, 4, 5, 40 contains an outlier. If the outlier is removed, which of the following changes the most?', 'the arithmetic mean', ['the median', 'the mode', 'none of them changes'],
  'outlier 异常值 40：去掉后平均数从 11.2 变为 4；中位数 4 → 4，众数 4 → 4 不变。平均数受异常值影响最大。');
S('skew', 5, ['5.skewed-distribution','5.distribution'], 'Which word describes a distribution that is not symmetric, with a long tail on one side?', 'skewed', ['normal', 'uniform', 'symmetric'],
  'skewed distribution 偏态分布：一侧拖着长尾，不对称。');
S('percentile', 5, ['5.percentile'], 'A score is at the 80th percentile of a large group of scores. Which statement is correct?', 'About 80% of the scores are at or below that score.', ['The score is 80 points.', 'The student answered 80% of the questions correctly.', 'About 80% of the scores are above that score.'],
  'percentile 百分位数：第 80 百分位 = 约 80% 的数据小于或等于它，与分数本身或正确率无关。');

/* ===== 6 几何 ===== */
const TRI = ['acute triangle', 'right triangle', 'obtuse triangle'], art = t => (t[0] === 'r' ? 'a ' : 'an ') + t;
P('triangles', 6, ['6.acute-triangle','6.right-triangle','6.obtuse-triangle','6.interior-angle'], r => {
  const kind = r.int(0, 2); let A, B;
  if (kind === 1) { A = r.int(20, 70); B = 90 - A; }
  else if (kind === 0) { do { A = r.int(35, 85); B = r.int(35, 85); } while (A + B <= 90 || A + B >= 180 || (A === 60 && B === 60) || A === 90 || B === 90); }
  else { A = r.int(10, 60); B = r.int(10, 80 - A); }
  const Cg = 180 - A - B, real = Math.max(A, B, Cg) < 90 ? 0 : Math.max(A, B, Cg) === 90 ? 1 : 2;
  return {q: `Two angles of a triangle measure ${A}° and ${B}°. The triangle is`, a: art(TRI[real]),
    w: TRI.filter((_, i) => i !== real).map(art).concat(['an equilateral triangle']),
    why: `interior angles 内角和 180°：第三个角 = 180 − ${A} − ${B} = ${Cg}°。${['三个角都小于 90° → acute 锐角三角形', '有一个角等于 90° → right 直角三角形', '有一个角大于 90° → obtuse 钝角三角形'][real]}。`,
    t: ['6.' + TRI[real].replace(' ', '-'), '6.interior-angle']};
});
P('trisides', 6, ['6.acute-triangle','6.right-triangle','6.obtuse-triangle','6.triangle'], r => {
  const sets = [[4, 5, 6], [5, 6, 7], [6, 7, 8], [7, 8, 9], [5, 5, 6], [3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [7, 24, 25], [4, 5, 7], [3, 5, 7], [2, 4, 5], [5, 7, 10], [4, 6, 9]];
  const [a, b, c] = r.pick(sets), lhs = a * a + b * b, rhs = c * c, k = rhs < lhs ? 0 : rhs === lhs ? 1 : 2;
  if (!(a + b > c)) throw Error('not a triangle');
  return {q: `A triangle has sides of lengths ${a}, ${b}, and ${c}. The triangle is`, a: art(TRI[k]), w: TRI.filter((_, i) => i !== k).map(art).concat(['not a possible triangle']),
    why: `先查能否组成三角形：${a} + ${b} > ${c} ✓。再比较最长边平方与其余两边平方和：${c}² = ${rhs}，${a}² + ${b}² = ${lhs} → ${['小于 → acute 锐角', '相等 → right 直角', '大于 → obtuse 钝角'][k]}三角形。`,
    t: ['6.' + TRI[k].replace(' ', '-'), '6.triangle']};
});
P('trinames', 6, ['6.isosceles-triangle','6.equilateral-triangle','6.scalene-triangle'], r => {
  const k = r.int(0, 2);
  let sides;
  if (k === 0) { const a = r.int(4, 12); let b = r.int(2, 2 * a - 1); if (b === a) b = a + 1; sides = [a, a, b]; }
  else if (k === 1) { const a = r.int(3, 15); sides = [a, a, a]; }
  else { sides = r.pick([[4, 5, 6], [5, 6, 8], [3, 5, 7], [6, 7, 9], [4, 7, 9], [5, 8, 11]]); }
  const names = ['an isosceles triangle', 'an equilateral triangle', 'a scalene triangle'];
  // ETS: isosceles = at least two equal sides, so an equilateral triangle is isosceles too — never offer it as wrong there
  const w = k === 1 ? ['a scalene triangle', 'a right triangle', 'not a possible triangle'] : names.filter((_, i) => i !== k).concat(['not a possible triangle']);
  return {q: `A triangle has sides of lengths ${sides.join(', ')}. Which term best describes it?`, a: names[k], w,
    why: ['isosceles 等腰：至少两边相等（这里恰好两边相等）。', 'equilateral 等边：三边都相等。', 'scalene 不等边：三边都不相等。'][k],
    t: ['6.' + ['isosceles-triangle', 'equilateral-triangle', 'scalene-triangle'][k]]};
});
P('pyth', 6, ['6.hypotenuse','6.leg','6.right-triangle'], r => {
  const [a0, b0, c0] = r.pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]]), k = r.int(1, c0 > 13 ? 2 : 3), a = a0 * k, b = b0 * k, c = c0 * k;
  if (r.chance(.5)) return {q: `The legs of a right triangle have lengths ${a} and ${b}. What is the length of the hypotenuse?`, a: N(c), w: [a + b, c + 1, c - 1, b + 1].map(N),
    why: `hypotenuse 斜边（直角对面最长的边）：√(${a}² + ${b}²) = √${c * c} = ${c}。`, t: ['6.hypotenuse','6.leg','6.right-triangle']};
  return {q: `A right triangle has a hypotenuse of length ${c} and one leg of length ${a}. What is the length of the other leg?`, a: N(b), w: [c - a, c + a, b + 1, b - 1].map(N),
    why: `leg 直角边：√(${c}² − ${a}²) = √${b * b} = ${b}。`, t: ['6.leg','6.hypotenuse']};
});
P('triarea', 6, ['6.altitude','6.base','6.area'], r => {
  const b = 2 * r.int(2, 10), h = r.int(3, 15);
  return {q: `A triangle has a base of length ${b} and an altitude of ${h} drawn to that base. What is the area of the triangle?`, a: N(b * h / 2), w: [b * h, b + h, b * h / 4, 2 * (b + h)].map(N),
    why: `area 面积 = ½ × base 底边 × altitude 高 = ½ × ${b} × ${h} = ${b * h / 2}。`};
});
P('compsupp', 6, ['6.complementary-angles','6.supplementary-angles','6.adjacent-angles'], r => {
  const x = r.int(12, 78), v = r.int(0, 2);
  if (v === 0) return {q: `What is the measure of an angle that is complementary to a ${x}° angle?`, a: (90 - x) + '°', w: [180 - x, 360 - x, x, 90 + x].map(d => d + '°'),
    why: `complementary angles 互余角：合计 90°，90 − ${x} = ${90 - x}°。`, t: ['6.complementary-angles']};
  if (v === 1) return {q: `What is the measure of an angle that is supplementary to a ${x}° angle?`, a: (180 - x) + '°', w: [90 - x, 360 - x, x, 180 + x].map(d => d + '°'),
    why: `supplementary angles 互补角：合计 180°，180 − ${x} = ${180 - x}°。`, t: ['6.supplementary-angles']};
  return {q: `Two adjacent angles together form a straight line. One of them measures ${x}°. What does the other measure?`, a: (180 - x) + '°', w: [90 - x, x, 360 - x].map(d => d + '°'),
    why: `adjacent angles 相邻角拼成一条直线（平角 180°）：180 − ${x} = ${180 - x}°，它们也是一对 supplementary angles。`, t: ['6.adjacent-angles','6.supplementary-angles']};
});
P('polyang', 6, ['6.polygon','6.interior-angle','6.exterior-angle'], r => {
  const v = r.int(0, 2);
  if (v === 0) { const n = r.int(5, 12); return {q: `What is the sum of the measures of the interior angles of a polygon with ${n} sides?`, a: C((n - 2) * 180) + '°', w: [n * 180, (n - 1) * 180, 360, (n - 2) * 90].map(d => C(d) + '°'),
    why: `polygon 多边形内角和 = (n − 2) × 180° = (${n} − 2) × 180° = ${C((n - 2) * 180)}°。`, t: ['6.polygon','6.interior-angle']}; }
  const n = r.pick([5, 6, 8, 9, 10, 12]), ext = 360 / n, inn = 180 - ext;
  if (v === 1) return {q: `What is the measure of each exterior angle of a regular polygon with ${n} sides?`, a: ext + '°', w: [inn, 180 / n, 360, (n - 2) * 180].map(d => C(d) + '°'),
    why: `exterior angle 外角：任何多边形外角和都是 360°，正 ${n} 边形每个外角 = 360 ÷ ${n} = ${ext}°。`, t: ['6.exterior-angle','6.polygon']};
  return {q: `What is the measure of each interior angle of a regular polygon with ${n} sides?`, a: inn + '°', w: [ext, (n - 2) * 180, 180 - 180 / n].map(d => C(d) + '°'),
    why: `interior angle 内角 = 180° − 外角 = 180 − ${ext} = ${inn}°（或 (n − 2) × 180 ÷ n）。`, t: ['6.interior-angle','6.polygon']};
});
P('simcong', 6, ['6.similar','6.congruent','1.respectively','8.similar'], r => {
  const a = r.int(2, 8), bc = r.int(3, 12), k = r.pick([2, 3]), sim = r.chance(.6);
  const head = `Triangle ABC is ${sim ? 'similar' : 'congruent'} to triangle DEF, with vertices A, B, and C corresponding to D, E, and F, respectively. `;
  if (sim) return {q: head + `If AB = ${a}, BC = ${bc}, and DE = ${a * k}, what is the length of EF?`, a: N(bc * k), w: [bc, bc + a * k - a, a * k, bc * k + 1].map(N),
    why: `similar 相似 = 形状相同、对应边成比例（不是全等）：DE / AB = ${k}，EF = ${k} × ${bc} = ${bc * k}。`, t: ['6.similar','8.similar','1.respectively']};
  return {q: head + `If AB = ${a} and BC = ${bc}, what is the length of EF?`, a: N(bc), w: [a, bc * 2, a + bc].map(N),
    why: `congruent 全等 = 形状和大小都相同，对应边相等：EF 对应 BC = ${bc}。`, t: ['6.congruent','1.respectively']};
});
P('perppar', 6, ['6.perpendicular','6.parallel','3.slope'], r => {
  let p, q; do { p = r.int(1, 7); q = r.int(1, 7); } while (p === q || gcd(p, q) !== 1);
  if (r.chance(.5)) p = -p;
  const perp = r.chance(.6), all = [F(p, q), F(-p, q), F(q, p), F(-q, p)], ans = perp ? F(-q, p) : F(p, q);
  return {q: `Line ℓ has slope ${F(p, q)}. What is the slope of a line ${perp ? 'perpendicular' : 'parallel'} to ℓ?`, a: ans, w: all.filter(x => x !== ans),
    why: perp ? `perpendicular 垂直：斜率乘积为 −1 → 取倒数再变号，${F(p, q)} → ${ans}。` : `parallel 平行：斜率相同 = ${ans}。`, t: [perp ? '6.perpendicular' : '6.parallel', '3.slope']};
});
P('circle', 6, ['6.circle','6.radius-radii','6.diameter','6.circumference','6.area'], r => {
  const v = r.int(0, 3), rad = r.int(2, 12);
  if (v === 0) return {q: `A circle has a radius of ${rad}. What is its circumference?`, a: PI(2 * rad), w: [PI(rad * rad), PI(rad), PI(4 * rad), N(2 * rad)],
    why: `circumference 圆周长 = 2πr = 2π × ${rad} = ${PI(2 * rad)}。`, t: ['6.circumference','6.radius-radii']};
  if (v === 1) return {q: `A circle has a radius of ${rad}. What is its area?`, a: PI(rad * rad), w: [PI(2 * rad), PI(4 * rad * rad), PI(rad), N(rad * rad)],
    why: `area 面积 = πr² = π × ${rad}² = ${PI(rad * rad)}。`, t: ['6.area','6.radius-radii','6.circle']};
  if (v === 2) { const d = 2 * rad; return {q: `A circle has a diameter of ${d}. What is its area?`, a: PI(rad * rad), w: [PI(d * d), PI(d), PI(2 * d), PI(rad)],
    why: `diameter 直径 = 2 × 半径，所以 r = ${rad}；area = π × ${rad}² = ${PI(rad * rad)}（不能直接用 ${d}²）。`, t: ['6.diameter','6.area']}; }
  return {q: `A circle has a circumference of ${PI(2 * rad)}. What is its radius?`, a: N(rad), w: [2 * rad, rad * rad, rad + 1, rad - 1].map(N),
    why: `circumference = 2πr = ${PI(2 * rad)} → radius 半径 r = ${rad}。`, t: ['6.radius-radii','6.circumference']};
});
P('arcsector', 6, ['6.arc','6.sector','6.central-angle'], r => {
  const th = r.pick([30, 45, 60, 72, 90, 120, 135, 150, 180, 240, 270]), rad = r.int(2, 12), arc = r.chance(.5);
  const A = fr(th * 2 * rad, 360), Sx = fr(th * rad * rad, 360);
  return {q: `In a circle with radius ${rad}, a central angle measures ${th}°. What is the ${arc ? 'length of the arc' : 'area of the sector'} formed by this angle?`,
    a: PI(...(arc ? A : Sx)), w: [PI(...(arc ? Sx : A)), PI(arc ? 2 * rad : rad * rad), PI(...fr(th * rad, 360)), PI(...fr(th * 4 * rad * rad, 360))],
    why: arc ? `arc 弧长 = (圆心角/360) × 2πr = (${th}/360) × ${PI(2 * rad)} = ${PI(...A)}。` : `sector 扇形面积 = (圆心角/360) × πr² = (${th}/360) × ${PI(rad * rad)} = ${PI(...Sx)}。`,
    t: [arc ? '6.arc' : '6.sector', '6.central-angle']};
});
P('inscribed', 6, ['6.inscribed-angle','6.central-angle'], r => {
  const x = r.int(20, 80);
  if (r.chance(.5)) return {q: `In a circle, central angle AOB measures ${2 * x}°. Inscribed angle ACB intercepts the same arc AB. What is the measure of angle ACB?`, a: x + '°', w: [2 * x, 4 * x, 180 - 2 * x].map(d => d + '°'),
    why: `inscribed angle 圆周角 = 同弧所对 central angle 圆心角的一半：${2 * x} ÷ 2 = ${x}°。`};
  return {q: `In a circle, inscribed angle ACB measures ${x}°. What is the measure of the central angle AOB that intercepts the same arc AB?`, a: 2 * x + '°', w: [x, 180 - x, 4 * x].map(d => d + '°'),
    why: `central angle 圆心角 = 同弧圆周角的 2 倍：2 × ${x} = ${2 * x}°。`};
});
P('rect', 6, ['6.perimeter','6.area','6.rectangle','8.perimeter'], r => {
  const l = r.int(4, 20); let w = r.int(3, 15); if (w === l) w++;
  if (r.chance(.6)) return {q: `A rectangle has a length of ${l} and a width of ${w}. What is its perimeter?`, a: N(2 * (l + w)), w: [l * w, l + w, 2 * l + w].map(N),
    why: `perimeter 周长 = 一圈边长之和 = 2 × (${l} + ${w}) = ${2 * (l + w)}；不是面积 area ${l * w}。`, t: ['6.perimeter','8.perimeter','6.rectangle']};
  return {q: `A rectangle has a length of ${l} and a width of ${w}. What is its area?`, a: N(l * w), w: [2 * (l + w), l + w, l * w * 2].map(N),
    why: `area 面积 = 长 × 宽 = ${l} × ${w} = ${l * w}；周长才是 ${2 * (l + w)}。`, t: ['6.area','6.rectangle']};
});
P('diag', 6, ['6.diagonal','6.rectangle','6.square'], r => {
  if (r.chance(.6)) { const [a0, b0, c0] = r.pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10]]), k = r.int(1, 2), a = a0 * k, b = b0 * k, c = c0 * k;
    return {q: `A rectangle has a length of ${b} and a width of ${a}. What is the length of its diagonal?`, a: N(c), w: [a + b, c + 1, 2 * (a + b)].map(N),
      why: `diagonal 对角线把长方形分成两个直角三角形：√(${b}² + ${a}²) = ${c}。`, t: ['6.diagonal','6.rectangle']}; }
  const s = r.int(2, 12);
  return {q: `A square has sides of length ${s}. What is the length of its diagonal?`, a: `${s}√2`, w: [N(2 * s), `${s}√3`, N(s * s)],
    why: `square 正方形：diagonal = √(${s}² + ${s}²) = ${s}√2。`, t: ['6.diagonal','6.square']};
});
P('quads', 6, ['6.trapezoid','6.parallelogram','6.area'], r => {
  if (r.chance(.5)) { let a, b, h; do { a = r.int(3, 14); b = r.int(a + 2, 20); h = r.int(2, 10); } while ((a + b) * h % 2);
    return {q: `A trapezoid has parallel sides of lengths ${a} and ${b} and a height of ${h}. What is its area?`, a: N((a + b) * h / 2), w: [(a + b) * h, a * b * h / 2, b * h, a + b + h].map(N),
      why: `trapezoid 梯形面积 = (上底 + 下底) × 高 ÷ 2 = (${a} + ${b}) × ${h} ÷ 2 = ${(a + b) * h / 2}。`, t: ['6.trapezoid','6.area']}; }
  const b = r.int(5, 15), h = r.int(3, 9), s = h + r.int(1, 5);
  return {q: `A parallelogram has a base of length ${b}, slanted sides of length ${s}, and a height of ${h}. What is its area?`, a: N(b * h), w: [b * s, 2 * (b + s), b + h, 2 * b * h].map(N),
    why: `parallelogram 平行四边形面积 = 底 × 高 = ${b} × ${h} = ${b * h}（用高，不用斜边 ${s}）。`, t: ['6.parallelogram','6.area']};
});
P('solids', 6, ['6.cube','6.volume','6.surface-area','6.cylinder','6.sphere','6.cone'], r => {
  const v = r.int(0, 4);
  if (v === 0) { const e = r.int(2, 9); return {q: `A cube has edges of length ${e}. What is its volume?`, a: N(e ** 3), w: [6 * e * e, e * e, 12 * e, 3 * e].map(N),
    why: `cube 立方体 volume 体积 = 棱长³ = ${e}³ = ${e ** 3}。`, t: ['6.cube','6.volume']}; }
  if (v === 1) { const e = r.int(2, 9); return {q: `A cube has edges of length ${e}. What is its surface area?`, a: N(6 * e * e), w: [e ** 3, 4 * e * e, e * e, 12 * e].map(N),
    why: `surface area 表面积 = 6 个面 × 棱长² = 6 × ${e * e} = ${6 * e * e}。`, t: ['6.surface-area','6.cube']}; }
  if (v === 2) { const rad = r.int(2, 6), h = r.int(2, 10); return {q: `A right circular cylinder has a radius of ${rad} and a height of ${h}. What is its volume?`, a: PI(rad * rad * h), w: [PI(2 * rad * h), PI(rad * h * h), N(rad * rad * h), PI(...fr(rad * rad * h, 3))],
    why: `cylinder 圆柱体 volume = πr²h = π × ${rad * rad} × ${h} = ${PI(rad * rad * h)}。`, t: ['6.cylinder','6.volume']}; }
  if (v === 3) { const rad = r.pick([3, 6, 9]); return {q: `A sphere has a radius of ${rad}. What is its volume?`, a: PI(4 * rad ** 3, 3), w: [PI(4 * rad * rad), PI(rad ** 3), PI(4 * rad ** 3), PI(2 * rad ** 3, 3)].filter(x => x !== PI(4 * rad ** 3, 3)),
    why: `sphere 球体 volume = (4/3)πr³ = (4/3)π × ${rad ** 3} = ${PI(4 * rad ** 3, 3)}。`, t: ['6.sphere','6.volume']}; }
  const rad = r.int(2, 6), h = 3 * r.int(1, 4);
  return {q: `A right circular cone has a base radius of ${rad} and a height of ${h}. What is its volume?`, a: PI(rad * rad * h, 3), w: [PI(rad * rad * h), PI(rad * h, 3), PI(2 * rad * h)],
    why: `cone 圆锥体 volume = (1/3)πr²h = (1/3)π × ${rad * rad} × ${h} = ${PI(rad * rad * h, 3)}（是同底同高圆柱的 1/3）。`, t: ['6.cone','6.volume']};
});
S('tangent', 6, ['6.tangent','6.radius-radii','6.perpendicular'], 'Line ℓ is tangent to a circle at point P, and O is the center of the circle. What is the measure of the angle between ℓ and radius OP?', '90°', ['45°', '60°', '180°'],
  'tangent 切线与过切点的 radius 半径垂直（perpendicular），夹角 90°。');
S('chord', 6, ['6.chord','6.diameter'], 'Which of the following is the longest chord of a circle?', 'a diameter', ['a radius', 'an arc', 'a tangent'],
  'chord 弦 = 连接圆上两点的线段；经过圆心的弦就是 diameter 直径，是最长的弦。radius 只连接圆心和圆上一点，不是弦。');
S('vertices', 6, ['6.vertex-vertices','6.cube'], 'How many vertices does a cube have?', '8', ['6', '12', '4'],
  'vertex / vertices 顶点：立方体有 8 个顶点、6 个面、12 条棱。');
S('vertices-tri', 6, ['6.vertex-vertices','6.polygon'], 'A polygon has 7 sides. How many vertices does it have?', '7', ['14', '5', '9'],
  'polygon 多边形：边数 = 顶点数（vertices），7 边形有 7 个顶点。');

/* ===== 7 图表与应用题 ===== */
P('ratio', 7, ['7.ratio','7.proportion','7.total'], r => {
  let a, b; do { a = r.int(1, 9); b = r.int(1, 9); } while (a === b || gcd(a, b) !== 1);
  const k = r.int(2, 10), T = (a + b) * k, girls = r.chance(.5);
  return {q: `The ratio of boys to girls in a class is ${a} to ${b}. If there are ${T} students in total, how many ${girls ? 'girls' : 'boys'} are in the class?`, a: N((girls ? b : a) * k),
    w: [(girls ? a : b) * k, girls ? b : a, T - (girls ? b : a), (girls ? b : a) * k + k].map(N),
    why: `ratio 比 ${a}:${b} → 共 ${a + b} 份，每份 ${T} ÷ ${a + b} = ${k}，${girls ? '女生' : '男生'} ${girls ? b : a} 份 = ${(girls ? b : a) * k}。`};
});
P('avgspeed', 7, ['7.average-speed','7.distance','7.elapsed-time'], r => {
  if (r.chance(.6)) { let v1, v2; do { v1 = r.pick([20, 24, 30, 36, 40, 45, 48, 60]); v2 = r.pick([30, 40, 45, 60, 72, 80, 90, 120]); } while (v1 >= v2 || (2 * v1 * v2) % (v1 + v2));
    const d = lcm(v1, v2), t = d / v1 + d / v2, avg = 2 * d / t;
    return {q: `A car travels ${d} miles at ${v1} miles per hour and then returns the same ${d} miles at ${v2} miles per hour. What is its average speed, in miles per hour, for the entire trip?`,
      a: N(avg), w: [(v1 + v2) / 2, v2 - v1, avg + 2].map(x => x % 1 ? x.toFixed(1) : N(x)),
      why: `average speed 平均速度 = 总路程 ÷ 总时间 = ${2 * d} ÷ (${d / v1} + ${d / v2}) = ${avg}，不是两个速度的平均 ${(v1 + v2) / 2}。`}; }
  let t1, t2, v1, v2; do { t1 = r.int(1, 4); t2 = r.int(1, 4); v1 = 10 * r.int(3, 7); v2 = 10 * r.int(3, 7); } while (t1 === t2 || v1 === v2 || (v1 * t1 + v2 * t2) % (t1 + t2) || (v1 + v2) % 2);
  const avg = (v1 * t1 + v2 * t2) / (t1 + t2);
  return {q: `A cyclist rides for ${t1} hour${t1 > 1 ? 's' : ''} at ${v1} kilometers per hour and then for ${t2} hour${t2 > 1 ? 's' : ''} at ${v2} kilometers per hour. What is the average speed, in kilometers per hour, for the whole ride?`,
    a: N(avg), w: [(v1 + v2) / 2, v1 * t1 + v2 * t2, avg + 5].map(N),
    why: `average speed = 总距离 ${v1 * t1 + v2 * t2} ÷ elapsed time 总时间 ${t1 + t2} = ${avg}。`};
});
P('work', 7, ['7.work-rate','7.rate'], r => {
  let a, b; do { a = r.int(2, 20); b = r.int(a + 1, 40); } while ((a * b) % (a + b));
  return {q: `Machine A can complete a job in ${a} hours, and machine B can complete the same job in ${b} hours. Working together at their respective constant rates, how many hours will the two machines take to complete the job?`,
    a: N(a * b / (a + b)), w: [(a + b) / 2, a + b, b - a, a * b / (a + b) + 1].map(x => x % 1 ? x.toFixed(1) : N(x)),
    why: `work rate 工作效率：A 每小时完成 1/${a}，B 每小时 1/${b}，合起来 1/${a} + 1/${b} = ${F(a + b, a * b)}，所需时间 = ${a * b / (a + b)} 小时。`};
});
P('profit', 7, ['7.profit','7.revenue','7.expense-cost','7.loss'], r => {
  const c = 20 * r.int(5, 45), p = r.pick([10, 20, 25, 40, 50]), gain = r.chance(.6), R = gain ? c * (100 + p) / 100 : c * (100 - p) / 100;
  if (gain && r.chance(.5)) return {q: `A company's revenue from a product was $${C(R)}, and the cost of producing it was $${C(c)}. The profit was what percent of the cost?`, a: p + '%',
    w: [Math.round((R - c) / R * 1000) / 10 + '%', (R - c) + '%', (p + 5) + '%'],
    why: `profit 利润 = revenue 收入 − cost 成本 = ${C(R - c)}；占成本的 ${C(R - c)} ÷ ${C(c)} = ${p}%（基数是成本，不是收入）。`, t: ['7.profit','7.revenue','7.expense-cost']};
  return {q: `An item that cost $${C(c)} to make was sold for $${C(R)}. What was the ${gain ? 'profit' : 'loss'} on the sale?`, a: '$' + C(Math.abs(R - c)),
    w: ['$' + C(R), '$' + C(c), '$' + C(Math.abs(R - c) + 20), '$' + C(c * p / 50)],
    why: gain ? `profit 利润 = 收入 − 成本 = ${C(R)} − ${C(c)} = ${C(R - c)}。` : `loss 亏损 = 成本 − 收入 = ${C(c)} − ${C(R)} = ${C(c - R)}。`, t: gain ? ['7.profit','7.revenue'] : ['7.loss','7.expense-cost']};
});
P('markdisc', 7, ['7.markup','7.discount'], r => {
  let c, m, d; do { c = r.pick([40, 50, 60, 80, 100, 120, 200, 250]); m = r.pick([20, 25, 50]); d = r.pick([10, 20, 25]); } while ((c * (100 + m) * (100 - d)) % 10000 || m === d);
  const fin = c * (100 + m) * (100 - d) / 10000;
  return {q: `A store buys a jacket for $${c}, marks up the price by ${m}%, and then sells the jacket at a ${d}% discount off the marked price. What is the selling price?`,
    a: '$' + N(fin), w: ['$' + N(c * (100 + m - d) / 100), '$' + N(c * (100 + m) / 100), '$' + N(c * (100 - d) / 100), '$' + N(fin + 5)],
    why: `markup 加价 ${m}%：${c} × ${1 + m / 100} = ${c * (100 + m) / 100}；再 discount 打折 ${d}%（以加价后的价格为基数）：× ${1 - d / 100} = ${fin}。不能直接 +${m}% −${d}%。`};
});
P('interest', 7, ['7.simple-interest','7.compound-interest','7.principal'], r => {
  let P0, rt; do { P0 = r.pick([500, 1000, 2000, 4000, 5000]); rt = r.pick([5, 10, 20]); } while ((P0 * (100 + rt) * (100 + rt)) % 10000);
  const simple = P0 + P0 * rt * 2 / 100, comp = P0 * (100 + rt) * (100 + rt) / 10000, cq = r.chance(.5);
  return {q: `A principal of $${C(P0)} is invested at ${rt}% annual interest ${cq ? 'compounded annually' : '(simple interest)'}. What is the total value of the investment after 2 years?`,
    a: '$' + C(cq ? comp : simple), w: ['$' + C(cq ? simple : comp), '$' + C(P0 + P0 * rt / 100), '$' + C(P0 * rt * 2 / 100), '$' + C((cq ? comp : simple) + 10)],
    why: cq ? `compound interest 复利：利息也生息，${C(P0)} × (1 + ${rt / 100})² = ${C(comp)}。` : `simple interest 单利：只按 principal 本金算，每年 ${C(P0 * rt / 100)}，两年后 ${C(P0)} + ${C(P0 * rt * 2 / 100)} = ${C(simple)}。`,
    t: [cq ? '7.compound-interest' : '7.simple-interest', '7.principal']};
});
P('conc', 7, ['7.concentration'], r => {
  if (r.chance(.5)) { let v, p; do { v = r.int(4, 40); p = r.pick([5, 10, 15, 20, 25, 30, 40, 50]); } while (v * p % 100); return {q: `A ${v}-liter solution is ${p}% salt. How many liters of salt does it contain?`, a: N(v * p / 100), w: [v - v * p / 100, p, v * p / 10].map(N),
    why: `concentration 浓度 ${p}% = 盐占溶液的 ${p}%：${v} × ${p / 100} = ${v * p / 100} 升。`}; }
  let v1, v2, p1, p2; do { v1 = r.int(2, 10); v2 = r.int(2, 10); p1 = r.pick([10, 20, 30, 40]); p2 = r.pick([20, 40, 50, 60, 80]); } while (p1 === p2 || v1 === v2 || (v1 * p1 + v2 * p2) % (v1 + v2) || (p1 + p2) % 2);
  const c = (v1 * p1 + v2 * p2) / (v1 + v2);
  return {q: `${v1} liters of a ${p1}% acid solution are mixed with ${v2} liters of a ${p2}% acid solution. What is the concentration of acid in the mixture?`, a: c + '%', w: [(p1 + p2) / 2 + '%', (p1 + p2) + '%', (c + 5) + '%'],
    why: `concentration 浓度 = 溶质总量 ÷ 溶液总量 = (${v1}×${p1}% + ${v2}×${p2}%) ÷ ${v1 + v2} = ${c}%。体积不同不能直接平均。`};
});
P('pie', 7, ['7.pie-chart','6.central-angle','7.percentage'], r => {
  const p = 5 * r.int(1, 14);
  return {q: `In a pie chart, one category makes up ${p}% of the total. What is the measure of the central angle of that category's sector?`, a: (3.6 * p).toFixed(0) + '°', w: [p, 360 - 3.6 * p, 1.8 * p, 3.6 * p + 10].map(d => (+d.toFixed(1)) + '°'),
    why: `pie chart 饼图整圆 360°：${p}% × 360° = ${(3.6 * p).toFixed(0)}°。`};
});
P('per', 7, ['7.per','7.units','7.average-per'], r => {
  if (r.chance(.5)) { const k = r.int(3, 15), h = r.int(2, 5); return {q: `A machine produces ${k} parts per minute. At this rate, how many parts does it produce in ${h} hours?`, a: C(60 * h * k), w: [C(h * k), C(60 * k), C(60 * h * k / 2), C(h * k * 100)],
    why: `per 每：每分钟 ${k} 个；注意 units 单位，${h} 小时 = ${60 * h} 分钟 → ${C(60 * h * k)} 个。`, t: ['7.per','7.units']}; }
  const days = r.int(4, 12), avg = r.int(8, 40), tot = days * avg;
  return {q: `A store sold ${tot} books in ${days} days. What was the average number of books sold per day?`, a: N(avg), w: [tot - days, tot * days, avg + 1].map(C),
    why: `average per day 平均每天 = 总数 ÷ 天数 = ${tot} ÷ ${days} = ${avg}。`, t: ['7.average-per','7.per']};
});
P('pctchange', 7, ['7.percent-increase','7.percent-decrease','8.percent-increase'], r => {
  let a, p; do { a = r.pick([20, 25, 40, 50, 60, 80, 100, 120, 150, 200, 250, 400]); p = r.pick([5, 10, 20, 25, 30, 40, 50, 60, 75]); } while (a * p % 100);
  const up = r.chance(.6), b = up ? a + a * p / 100 : a - a * p / 100, other = Math.abs(b - a) / b * 100;
  return {q: `The price of an item ${up ? 'increased' : 'decreased'} from $${a} to $${b}. By what percent did the price ${up ? 'increase' : 'decrease'}?`, a: p + '%',
    w: [(other % 1 ? other.toFixed(1) : other) + '%', Math.abs(b - a) + '%', (p + 5) + '%', (p * 2) + '%'],
    why: `percent ${up ? 'increase' : 'decrease'} = 变化量 ÷ 原值 = ${Math.abs(b - a)} ÷ ${a} = ${p}%（以原值 ${a} 为基数，不是新值 ${b}）。`,
    t: up ? ['7.percent-increase','8.percent-increase'] : ['7.percent-decrease']};
});
P('pctpoint', 7, ['7.percentage-point','7.percent-increase','7.percentage'], r => {
  let p, d; do { p = r.pick([10, 12, 15, 20, 25, 30, 40, 50]); d = r.int(1, 15); } while ((d * 100) % p || d * 100 / p === d);
  const q = p + d, pct = d * 100 / p, pts = r.chance(.5);
  return {q: `The unemployment rate in a city rose from ${p}% to ${q}%. ${pts ? 'By how many percentage points did the rate increase?' : 'By what percent did the rate increase?'}`,
    a: pts ? N(d) : pct + '%', w: pts ? [pct, q, d * 2].map(N) : [d + '%', q + '%', (Math.round(d / q * 1000) / 10) + '%'],
    why: `${p}% → ${q}%：增加 ${d} 个 percentage point 百分点；percent increase 百分比增长 = ${d} ÷ ${p} = ${pct}%。`,
    t: pts ? ['7.percentage-point','7.percentage'] : ['7.percent-increase','7.percentage-point']};
});
P('table', 7, ['7.table','7.total','7.percent-increase'], r => {
  const yrs = [2019, 2020, 2021, 2022], i = r.int(0, 2); let v; let p;
  do { v = yrs.map(() => 10 * r.int(4, 30)); p = r.pick([10, 20, 25, 50]); v[i + 1] = v[i] * (100 + p) / 100; } while (v[i + 1] % 1 || v[i + 1] > 600);
  const table = `<table class="qt"><tr><th>Year</th>${yrs.map(y => `<td>${y}</td>`).join('')}</tr><tr><th>Sales (units)</th>${v.map(x => `<td>${x}</td>`).join('')}</tr></table>`;
  if (r.chance(.6)) return {q: `${table}According to the table, by what percent did sales increase from ${yrs[i]} to ${yrs[i + 1]}?`, a: p + '%',
    w: [(v[i + 1] - v[i]) + '%', Math.round((v[i + 1] - v[i]) / v[i + 1] * 1000) / 10 + '%', (p + 10) + '%'],
    why: `table 表格：${yrs[i]} 年 ${v[i]}，${yrs[i + 1]} 年 ${v[i + 1]}；percent increase = ${v[i + 1] - v[i]} ÷ ${v[i]} = ${p}%。`, t: ['7.table','7.percent-increase']};
  return {q: `${table}According to the table, what were the total sales for the four years?`, a: C(sum(v)), w: [C(sum(v) - v[0]), C(sum(v) / 4), C(v[3] - v[0]), C(sum(v) + 10)],
    why: `total 总数：${v.join(' + ')} = ${C(sum(v))}。`, t: ['7.table','7.total']};
});

/* ===== round 2: the terms that had no problem yet ===== */
P('exactlydiv', 1, ['1.exactly','2.factor-divisor','2.prime-number'], r => {
  const k = r.pick([2, 3, 4]), n = k === 3 ? r.int(30, 60) : r.int(20, 50), nd = x => divisors(x).length;
  const c = count(1, n, x => nd(x) === k), ge = count(1, n, x => nd(x) >= k), le = count(1, n, x => nd(x) <= k);
  return {q: `How many integers from 1 to ${n}, inclusive, have exactly ${k} positive divisors?`, a: N(c), w: [ge, le, c + 1, c - 1, c + 2].map(N),
    why: `exactly ${k} 恰好 ${k} 个正因数：${Array.from({length: n}, (_, i) => i + 1).filter(x => nd(x) === k).join(', ')}，共 ${c} 个。“至少 ${k} 个”会有 ${ge} 个，不是本题。${k === 2 ? '（恰好 2 个正因数 = 质数）' : k === 3 ? '（恰好 3 个正因数 = 质数的平方）' : ''}`,
    t: ['1.exactly', '2.factor-divisor'].concat(k === 2 ? ['2.prime-number'] : [])};
});
P('cannotbe', 1, ['1.cannot-be','1.less-than'], r => {
  let k; do { k = r.int(10, 80); } while (Number.isInteger(Math.sqrt(k)));
  const ok = []; for (let n = -20; n <= 20; n++) if (n * n < k) ok.push(n);
  const m = Math.max(...ok), bad = r.chance(.5) ? m + 1 : -(m + 1);
  return {q: `n is an integer and n² &lt; ${k}. Which of the following <b>cannot be</b> the value of n?`, a: N(bad), w: [-m, 0, m, m - 1].map(N),
    why: `n² < ${k} → n 只能是 ${N(-m)} 到 ${m}（${m}² = ${m * m} < ${k}，${m + 1}² = ${(m + 1) ** 2} ≥ ${k}）。cannot be 不可能是：${N(bad)}。负数平方也是正的，${N(-m)} 是可以的。`};
});
P('approx', 1, ['1.approximately','3.square-root','1.nearest-integer'], r => {
  let n, s; do { n = r.int(20, 200); s = Math.sqrt(n); } while (Number.isInteger(s) || Math.abs(s % 1 - .5) < .2);
  const a = Math.round(s);
  return {q: `The value of √${n} is approximately equal to which of the following integers?`, a: N(a), w: [a - 1, a + 1, Math.round(n / 2), a + 2].map(N),
    why: `approximately 约等于：${a - 1}² = ${(a - 1) ** 2}，${a}² = ${a * a}，${a + 1}² = ${(a + 1) ** 2}，${n} 最接近 ${a}² → √${n} ≈ ${a}（≈ ${s.toFixed(2)}）。`};
});
P('suchthat', 1, ['1.such-that','3.exponent'], r => {
  const b = r.pick([2, 3]), v = r.int(b === 2 ? 50 : 30, b === 2 ? 3000 : 2000);
  let n = 1; while (b ** n <= v) n++;
  return {q: `What is the least positive integer n such that ${b}<sup>n</sup> &gt; ${C(v)}?`, a: N(n), w: [n - 1, n + 1, n - 2, Math.floor(v / b)].map(N),
    why: `such that 使得：${b}${sup(n - 1)} = ${C(b ** (n - 1))} ≤ ${C(v)}，${b}${sup(n)} = ${C(b ** n)} > ${C(v)}，满足条件的最小 n = ${n}。`};
});
P('regardless', 1, ['1.regardless-of'], r => {
  const a = r.int(1, 9);
  return {q: 'Which of the following expressions is positive <b>regardless of</b> the value of x?', a: `x² + ${a}`,
    w: [`x + ${a}`, `x³ + ${a}`, `x² ${MINUS} ${a}`, `${a}x`],
    why: `regardless of the value of x 无论 x 取何值：x² ≥ 0，所以 x² + ${a} ≥ ${a} > 0。反例：x = −${a + 1} 时 x + ${a} < 0、x³ + ${a} < 0；x = 0 时 x² − ${a} < 0、${a}x = 0。`};
});
S('instr-all', 1, ['1.indicate-all-that-apply'], 'A GRE question ends with “<b>Indicate all such values.</b>” What should you do?', 'Select every answer choice that satisfies the conditions; there may be one or more.',
  ['Select exactly one answer choice.', 'Enter a single number in the answer box.', 'Select at most two answer choices.'],
  'indicate all that apply 选出所有符合项：可能有一个或多个正确选项，全部选对才得分，漏选通常不得分。');
S('instr-one', 1, ['1.select-one-answer-choice'], 'The directions say “<b>Select one answer choice.</b>” How many choices should you select?', 'exactly one', ['one or more', 'every choice that is true', 'at least two'],
  'select one answer choice 选择一个答案：只能选一个。若是 “Select one or more answer choices / Indicate all that apply”，才可能多选。');
P('intmult', 2, ['2.integer-multiple','2.multiple'], r => {
  const k = r.int(3, 13); let n; do { n = r.int(30, 200); } while (n % k === 0);
  let m = n + 1; while (m % k) m++;
  return {q: `What is the least integer multiple of ${k} that is greater than ${n}?`, a: N(m), w: [m - k, n + 1, m + k, n + k].map(N),
    why: `integer multiple 整数倍 = ${k} × 整数：${k} × ${m / k - 1} = ${m - k} ≤ ${n}，${k} × ${m / k} = ${m} > ${n}。`};
});
P('vareq', 3, ['3.variable','3.constant','3.equation','3.expression','3.inequality'], r => {
  const a = r.int(2, 9), b = r.int(1, 12);
  if (r.chance(.5)) return {q: `In the equation y = ${a}x + ${b}, which of the following are the variables?`, a: 'x and y', w: [`${a} and ${b}`, 'only x', `only ${b}`],
    why: `variable 变量 = 可以变化的量（x、y）；${a} 是 x 的系数（coefficient），${b} 是常数（constant）。`, t: ['3.variable', '3.constant']};
  const c = a * r.int(1, 6) + b;
  return {q: 'Which of the following is an equation?', a: `${a}x + ${b} = ${c}`, w: [`${a}x + ${b}`, `${a}x + ${b} &gt; ${c}`, `${a}x ${MINUS} ${b}`],
    why: `equation 方程 = 有等号的式子；${a}x + ${b} 只是 expression 代数表达式，带 > 的是 inequality 不等式。`, t: ['3.equation', '3.expression', '3.inequality']};
});
P('simplify', 3, ['3.simplify','3.expression'], r => {
  const p = r.int(2, 6), q = r.int(1, p - 1), a = r.int(1, 9), b = r.int(1, 9);
  return {q: `Simplify ${p}(x + ${a}) ${MINUS} ${q}(x ${MINUS} ${b}).`, a: lin(p - q, p * a + q * b),
    w: [lin(p - q, p * a - q * b), lin(p + q, p * a + q * b), lin(p - q, a + b), lin(p - q, p * a + b)],
    why: `simplify 化简：${p}x + ${p * a} − ${q}x + ${q * b}（−${q} × −${b} = +${q * b}）= ${lin(p - q, p * a + q * b)}。`};
});
const RAND = [
  [(n, k) => `An integer is selected uniformly at random from the integers 1 to ${n}, inclusive. What is the probability that it is a multiple of ${k}?`, '4.uniformly-at-random', 'uniformly at random 等概率随机选取'],
  [(n, k) => `An integer is chosen at random from the integers 1 to ${n}, inclusive. What is the probability that it is a multiple of ${k}?`, '4.at-random', 'at random 随机地（GRE 默认每个结果等可能）'],
  [(n, k) => `Each of the integers from 1 to ${n}, inclusive, is equally likely to be selected. If one of them is selected, what is the probability that it is a multiple of ${k}?`, '4.equally-likely', 'equally likely 可能性相等']];
P('unifrand', 4, ['4.uniformly-at-random','4.at-random','4.equally-likely','4.probability'], r => {
  const [stem, id, zh] = r.pick(RAND), n = r.int(20, 60), k = r.int(3, 9), c = count(1, n, x => x % k === 0);
  return {q: stem(n, k), a: F(c, n),
    w: [F(1, k), F(c, n - c), F(c + 1, n), F(c - 1, n)],
    why: `${zh}：${n} 个整数被选中的可能性相等；${k} 的倍数有 ${c} 个（${k}, ${2 * k}, …, ${c * k}）→ ${c}/${n} = ${F(c, n)}。${n % k ? '不能直接写 1/' + k + '，因为 ' + n + ' 不是 ' + k + ' 的倍数。' : ''}`, t: [id, '4.probability']};
});
P('taxable', 7, ['7.taxable-income','7.percentage'], r => {
  const I = 1000 * r.int(40, 95), D = 1000 * r.int(5, 18), rt = r.pick([10, 15, 20, 25]), tax = (I - D) * rt / 100;
  return {q: `A person's income is $${C(I)}, and $${C(D)} of it is deductible. Tax is ${rt}% of taxable income. How much tax does the person pay?`,
    a: '$' + C(tax), w: ['$' + C(I * rt / 100), '$' + C(D * rt / 100), '$' + C(tax + D * rt / 100 / 2), '$' + C(I - D)],
    why: `taxable income 应税收入 = 收入 − 可扣除额 = ${C(I)} − ${C(D)} = ${C(I - D)}；税 = ${rt}% × ${C(I - D)} = ${C(tax)}（不是按全部收入算）。`};
});
/* charts: small inline SVGs; every value is printed so nothing depends on reading a scale */
function svgBars(labels, vals, xName, yName) {
  const W = 300, H = 170, L = 34, B = 140, top = 18, mx = Math.max(...vals), bw = (W - L - 10) / labels.length;
  const bars = vals.map((v, i) => { const h = (B - top) * v / mx, x = L + i * bw + bw * .2; return `<rect x="${x.toFixed(1)}" y="${(B - h).toFixed(1)}" width="${(bw * .6).toFixed(1)}" height="${h.toFixed(1)}" class="qbar"/><text x="${(x + bw * .3).toFixed(1)}" y="${(B - h - 4).toFixed(1)}" text-anchor="middle">${v}</text><text x="${(x + bw * .3).toFixed(1)}" y="${B + 14}" text-anchor="middle">${labels[i]}</text>`; }).join('');
  return `<svg class="qchart" viewBox="0 0 ${W} ${H + 14}" role="img" aria-label="bar graph"><line x1="${L}" y1="${B}" x2="${W - 6}" y2="${B}" class="qax"/><line x1="${L}" y1="${top - 8}" x2="${L}" y2="${B}" class="qax"/>${bars}<text x="${(L + W) / 2}" y="${H + 12}" text-anchor="middle" class="qlab">${xName}</text><text x="10" y="${(B + top) / 2}" text-anchor="middle" class="qlab" transform="rotate(-90 10 ${(B + top) / 2})">${yName}</text></svg>`;
}
P('bargraph', 7, ['7.bar-graph-bar-chart','7.vertical-axis','7.horizontal-axis','7.average-per'], r => {
  const yrs = ['2019', '2020', '2021', '2022'];
  let v; do { v = yrs.map(() => 10 * r.int(2, 15)); } while (new Set(v).size < 4 || sum(v) % 4 || v.every((x, i) => !i || x < v[i - 1]));   // some later year must be higher
  const chart = svgBars(yrs, v, 'Year', 'Units sold');
  if (r.chance(.5)) {
    let i, j; do { i = r.int(0, 2); j = r.int(i + 1, 3); } while (v[j] <= v[i]);
    return {q: `${chart}The bar graph shows the number of units sold each year (vertical axis) for four years (horizontal axis). By how many units did sales increase from ${yrs[i]} to ${yrs[j]}?`,
      a: N(v[j] - v[i]), w: [v[j], v[j] + v[i], v[j] - v[i] + 10, v[j] - v[i] - 10].map(N),
      why: `bar graph 柱状图：horizontal axis 横轴是年份，vertical axis 纵轴是销量。${yrs[j]} 年 ${v[j]} − ${yrs[i]} 年 ${v[i]} = ${v[j] - v[i]}。`};
  }
  return {q: `${chart}According to the bar graph, what was the average (arithmetic mean) number of units sold per year over the four years?`,
    a: N(sum(v) / 4), w: [sum(v), (Math.max(...v) + Math.min(...v)) / 2, sum(v) / 4 + 10, v[1]].map(x => x % 1 ? x.toFixed(1) : N(x)),
    why: `bar graph：四根柱子 ${v.join(' + ')} = ${sum(v)}，平均每年 ${sum(v)} ÷ 4 = ${sum(v) / 4}。`, t: ['7.bar-graph-bar-chart','7.average-per']};
});
P('linegraph', 7, ['7.line-graph','7.horizontal-axis'], r => {
  const mo = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
  let v, d; do { v = mo.map(() => 5 * r.int(4, 24)); d = v.slice(1).map((x, i) => x - v[i]); } while (Math.max(...d) <= 0 || d.filter(x => x === Math.max(...d)).length > 1);
  const W = 300, H = 170, L = 30, B = 140, top = 22, mx = Math.max(...v), mn = Math.min(...v), step = (W - L - 24) / 4;
  const pts = v.map((x, i) => [L + 12 + i * step, B - 10 - (B - 10 - top) * (x - mn) / (mx - mn || 1)]);
  const chart = `<svg class="qchart" viewBox="0 0 ${W} ${H + 14}" role="img" aria-label="line graph"><line x1="${L}" y1="${B}" x2="${W - 6}" y2="${B}" class="qax"/><line x1="${L}" y1="${top - 12}" x2="${L}" y2="${B}" class="qax"/>`
    + `<polyline class="qline" points="${pts.map(p => p.map(z => z.toFixed(1)).join(',')).join(' ')}"/>`
    + pts.map((p, i) => `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3.5" class="qdot"/><text x="${p[0].toFixed(1)}" y="${(p[1] - 8).toFixed(1)}" text-anchor="middle">${v[i]}</text><text x="${p[0].toFixed(1)}" y="${B + 14}" text-anchor="middle">${mo[i]}</text>`).join('')
    + `<text x="${(L + W) / 2}" y="${H + 12}" text-anchor="middle" class="qlab">Month</text><text x="10" y="${(B + top) / 2}" text-anchor="middle" class="qlab" transform="rotate(-90 10 ${(B + top) / 2})">Visitors (hundreds)</text></svg>`;
  const k = d.indexOf(Math.max(...d)), pair = i => `${mo[i]} to ${mo[i + 1]}`;
  return {q: `${chart}The line graph shows the number of visitors, in hundreds, for five months. Between which two consecutive months did the number of visitors increase the most?`,
    a: pair(k), w: [0, 1, 2, 3].filter(i => i !== k).map(pair),
    why: `line graph 折线图：横轴是月份，看相邻两点的差：${d.map((x, i) => pair(i) + ' ' + (x >= 0 ? '+' : '') + N(x)).join('，')}；增加最多的是 ${pair(k)}。`};
});
P('scatter', 7, ['7.scatterplot','7.horizontal-axis','7.vertical-axis'], r => {
  const pts = []; while (pts.length < 8) { const x = r.int(1, 9), y = r.int(1, 9); if (x !== y && !pts.some(p => p[0] === x && p[1] === y)) pts.push([x, y]); }
  const above = pts.filter(p => p[1] > p[0]).length, u = 15, L = 34, B = 166, W = 34 + 10 * u + 12, top = B - 10 * u;
  const grid = Array.from({length: 11}, (_, i) => `<line x1="${L + i * u}" y1="${top}" x2="${L + i * u}" y2="${B}" class="qgrid"/><line x1="${L}" y1="${B - i * u}" x2="${L + 10 * u}" y2="${B - i * u}" class="qgrid"/>`).join('')
    + [0, 5, 10].map(i => `<text x="${L + i * u}" y="${B + 13}" text-anchor="middle">${i}</text><text x="${L - 6}" y="${B - i * u + 4}" text-anchor="end">${i}</text>`).join('');
  const chart = `<svg class="qchart" style="max-width:250px" viewBox="0 0 ${W} ${B + 30}" role="img" aria-label="scatterplot">${grid}<line x1="${L}" y1="${B}" x2="${L + 10 * u}" y2="${top}" class="qline"/>`
    + pts.map(p => `<circle cx="${L + p[0] * u}" cy="${B - p[1] * u}" r="4" class="qdot"/>`).join('')
    + `<text x="${L + 5 * u}" y="${B + 27}" text-anchor="middle" class="qlab">x</text><text x="10" y="${(B + top) / 2}" class="qlab">y</text></svg>`;
  return {q: `${chart}The scatterplot shows 8 points and the line y = x (each grid square is 1 unit; x on the horizontal axis, y on the vertical axis). How many of the points lie above the line y = x?`,
    a: N(above), w: [8 - above, above + 1, above - 1, 8].map(N),
    why: `scatterplot 散点图：点在 y = x 上方 ⇔ 纵坐标 y > 横坐标 x。这些点是 ${pts.map(p => '(' + p + ')').join(' ')}，其中 y > x 的有 ${above} 个。`};
});

/* ===== random numbers ===== */
function rng(seed) {
  let s = seed >>> 0 || 1;
  const next = seed === undefined ? Math.random : () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const r = {
    next, int: (a, b) => a + Math.floor(next() * (b - a + 1)), pick: a => a[Math.floor(next() * a.length)], chance: p => next() < p,
    shuffle: a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(next() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  };
  return r;
}

/* One finished question: the stem, four choices (the right one at .ok), why, terms. */
function make(p, seed) {
  const r = rng(seed);
  for (let tries = 0; tries < 30; tries++) {
    let o; try { o = p.gen(r); } catch (e) { continue; }
    const seen = new Set([norm(o.a)]), wrong = [];
    for (const w of o.w) { const k = norm(w); if (!seen.has(k) && w !== '' && w != null) { seen.add(k); wrong.push(String(w)); } if (wrong.length === 3) break; }
    if (wrong.length < 3) continue;
    const opts = r.shuffle([String(o.a)].concat(wrong));
    return {id: p.id, ch: p.ch, q: o.q, opts, ok: opts.indexOf(String(o.a)), why: o.why, t: (o.t || p.t).filter(id => BYID[id])};
  }
  return null;
}
function norm(x) { return String(x).replace(/\s+/g, ' ').trim().toLowerCase(); }
const BYTERM = {};
PROBLEMS.forEach(p => p.t.forEach(id => { (BYTERM[id] = BYTERM[id] || []).push(p); }));

root.GRE_QUANT = {CHAPTERS, TERMS, BYID, CHECK, SENTENCES, PROBLEMS, BYTERM, clash, make, rng, _: {gcd, isPrime, variance, F, PI, poly}};
})(typeof window !== 'undefined' ? window : globalThis);
