import type { FormulaSheetEntry, SymbolDef } from "./physics-content";

export interface PaperFile { label: string; kind: "paper" | "answer"; url: string; }
export interface PaperYear { year: string; title: string; note: string; files: PaperFile[]; mcqCount: number; structuredCount: number; answerStatus: string; }
export interface WorkedStep { title: string; en: string; zh: string; formula?: string; result?: string; }
export interface WorkedQuestion { id: string; source: string; topic: string; difficulty: "Classic" | "High challenge"; title: string; titleZh: string; prompt: string; promptZh: string; answer: string; answerZh: string; steps: WorkedStep[]; formulas: string[]; }

const paper = (label: string, kind: PaperFile["kind"], url: string): PaperFile => ({ label, kind, url });

export const paperYears: PaperYear[] = [
  {
    year: "2025–26", title: "First Assessment · Form 5 Physics", note: "完整 MCQ、結構題及答案；適合先做一套完整計時練習。", mcqCount: 27, structuredCount: 10, answerStatus: "Answer key supplied",
    files: [paper("Section A · MCQ", "paper", "/manus-storage/5x1_2526_A_MCQ_ed55c2c6.pdf"), paper("Section B · Structured", "paper", "/manus-storage/5x1_2526_B_SQ_ae475168.pdf"), paper("Marking scheme · 答案", "answer", "/manus-storage/5x1_2526_ans_970d2fa6.pdf")],
  },
  {
    year: "2024–25", title: "First Assessment · Form 5 Physics", note: "附件提供試卷，但沒有附上答案檔；網站只標示題目，不猜測官方答案。", mcqCount: 27, structuredCount: 10, answerStatus: "Question paper supplied; answer key not supplied",
    files: [paper("Question paper · MCQ + Structured", "paper", "/manus-storage/5x1_2425_SQ_MCQ_d72c2a7c.pdf")],
  },
  {
    year: "2023–24", title: "First Assessment · Form 5 Physics", note: "完整 MCQ、結構題及答案；包含熱學、氣體、斜面、能量、碰撞和動量。", mcqCount: 27, structuredCount: 10, answerStatus: "Answer key supplied",
    files: [paper("Section A · MCQ", "paper", "/manus-storage/5x1_2324_A_MCQ_7e90b785.pdf"), paper("Section B · Structured", "paper", "/manus-storage/5x1_2324_B_SQ_b6c8ec37.pdf"), paper("Marking scheme · 答案", "answer", "/manus-storage/5x1_2324_ans_a8751f54.pdf")],
  },
];

export const workedQuestions: WorkedQuestion[] = [
  {
    id: "2324-q1-freezer", source: "2023–24 Section B Q1", topic: "Heat & latent heat", difficulty: "Classic", title: "Boiling water becomes ice", titleZh: "沸水完全結冰",
    prompt: "100 g of boiling water is cooled by a freezer removing 500 J per minute. Find the time to become ice completely.", promptZh: "100 g 沸水被每分鐘帶走 500 J，求完全結冰所需時間。",
    answer: "151 min", answerZh: "151 分鐘。先降溫至 0°C，再用潛熱凝固。",
    formulas: ["Q=mcΔT", "Q=mℓ", "P=Q/t"],
    steps: [
      { title: "1 · Split the process 分拆過程", en: "The water first cools from 100°C to 0°C, then freezes at 0°C.", zh: "先由 100°C 冷卻至 0°C，再在 0°C 進行凝固。" },
      { title: "2 · Cooling energy 冷卻能量", en: "Q₁ = mcΔT = 0.100 × 4200 × 100 = 42,000 J.", zh: "Q₁ = mcΔT = 0.100 × 4200 × 100 = 42,000 J。", formula: "Q_1=mc\Delta T=0.100(4200)(100)=42000\,\mathrm{J}" },
      { title: "3 · Latent heat 潛熱", en: "Q₂ = mℓ = 0.100 × 3.34×10⁵ = 33,400 J.", zh: "Q₂ = mℓ = 0.100 × 3.34×10⁵ = 33,400 J。", formula: "Q_2=m\ell=0.100(3.34\times10^5)=33400\,\mathrm{J}" },
      { title: "4 · Convert energy to time 能量換時間", en: "Total energy is 75,400 J. At 500 J min⁻¹, t = 75,400/500 = 151 min.", zh: "總能量為 75,400 J；以 500 J/min 帶走，t = 75,400/500 = 151 min。", result: "t=151\,\mathrm{min}" },
    ],
  },
  {
    id: "2324-q2-gas-cylinders", source: "2023–24 Section B Q2", topic: "Gases", difficulty: "High challenge", title: "Two connected gas cylinders", titleZh: "兩個相連氣缸的氣體平衡",
    prompt: "Two cylinders contain equal moles of the same ideal gas. A: V=0.05 m³, p=5×10⁵ Pa, T=27°C. B: p=2×10⁵ Pa, T=100°C. The tap is opened while temperatures stay constant.", promptZh: "兩個氣缸含有相同莫耳數的同種理想氣體。A：V=0.05 m³、p=5×10⁵ Pa、27°C；B：p=2×10⁵ Pa、100°C。開閥後各氣缸溫度保持不變。",
    answer: "V_B=0.155 m³; p_final=2.86×10⁵ Pa; n_A/n_B≈0.400", answerZh: "V_B=0.155 m³；最終壓強 2.86×10⁵ Pa；n_A/n_B≈0.400。",
    formulas: ["pV=nRT", "p_AV_A/T_A=p_BV_B/T_B", "n=pV/(RT)"],
    steps: [
      { title: "1 · Use equal moles first 先用相同莫耳數", en: "For equal n and the same gas, pV/T is equal in the two cylinders.", zh: "同種氣體且 n 相同，所以 pV/T 在兩缸相等。", formula: "\frac{p_AV_A}{T_A}=\frac{p_BV_B}{T_B}" },
      { title: "2 · Find the unknown volume 求體積", en: "V_B = p_AV_AT_B/(p_BT_A) = 0.155 m³.", zh: "代入絕對溫度 300 K、373 K，得 V_B=0.155 m³。", result: "V_B=0.155\,\mathrm{m^3}" },
      { title: "3 · Conserve total moles 守恆總莫耳數", en: "After opening, p is common, while V_A, V_B and T_A, T_B stay fixed. Add n_A=pV_A/(RT_A) and n_B=pV_B/(RT_B), then solve for p.", zh: "開閥後兩缸壓強相同；體積及溫度不變。把兩缸的 pV/RT 相加並等於原本總莫耳數，即可解 p。", formula: "\frac{pV_A}{RT_A}+\frac{pV_B}{RT_B}=n_A+n_B" },
      { title: "4 · Check the mole ratio 檢查莫耳比", en: "n_A/n_B = (p_AV_A/T_A)/(p_BV_B/T_B) = 0.400.", zh: "用開閥前資料計算莫耳比，驗證 n_A/n_B 約為 0.400。", result: "p_f=2.86\times10^5\,\mathrm{Pa}" },
    ],
  },
  {
    id: "2324-q3-incline", source: "2023–24 Section B Q3", topic: "Newton's laws", difficulty: "Classic", title: "Block pushed up a rough incline", titleZh: "粗糙斜面上的受力分析",
    prompt: "A 4 kg block is pushed up a 30° rough plane by 45 N parallel to the plane and moves at uniform velocity.", promptZh: "4 kg 木塊在 30° 粗糙斜面上被沿斜面向上 45 N 推動，並以等速運動。",
    answer: "N=34.0 N; f=25.4 N down the plane", answerZh: "法向力 N=34.0 N；摩擦力 25.4 N，方向向下斜面。",
    formulas: ["ΣF=ma", "N=mg cosθ", "45-mg sinθ-f=0"],
    steps: [
      { title: "1 · Draw the free-body diagram 畫自由體圖", en: "Forces are 45 N up the slope, weight mg vertically downward, normal reaction perpendicular to the plane, and friction down the slope.", zh: "力包括沿斜面向上的 45 N、垂直向下的 mg、垂直斜面的法向力，以及阻礙上滑而向下斜面的摩擦力。" },
      { title: "2 · Resolve perpendicular to plane 垂直斜面方向", en: "There is no acceleration perpendicular to the plane, so N−mg cos30°=0.", zh: "垂直斜面方向沒有加速度，因此 N−mg cos30°=0。", formula: "N=mg\cos30^\circ=34.0\,\mathrm{N}" },
      { title: "3 · Use uniform velocity 用等速條件", en: "Uniform velocity means a=0. Along the slope: 45−mg sin30°−f=0.", zh: "等速代表 a=0。沿斜面：45−mg sin30°−f=0。", formula: "f=45-mg\sin30^\circ=25.4\,\mathrm{N}" },
    ],
  },
  {
    id: "2324-q5-collision", source: "2023–24 Section B Q5", topic: "Momentum & energy", difficulty: "High challenge", title: "Ball rolls, collides, then leaves a bench", titleZh: "滾球碰撞後飛離桌面",
    prompt: "A 0.03 kg ball released from height h collides with a stationary 0.04 kg ball. The first stops and the second leaves horizontally at 3 m/s; it lands 1.2 m from a bench.", promptZh: "0.03 kg 小球由高度 h 釋放，與靜止的 0.04 kg 小球正碰。第一球碰撞後停下，第二球以 3 m/s 水平飛出，並在離桌邊 1.2 m 處落地。",
    answer: "u_X=4.0 m/s; h≈0.815 m; bench height H≈0.784 m", answerZh: "碰撞前第一球速度 4.0 m/s；h≈0.815 m；桌高 H≈0.784 m。",
    formulas: ["p_before=p_after", "mgh=½mv²", "x=ut", "H=½gt²"],
    steps: [
      { title: "1 · Momentum at collision 碰撞時動量守恆", en: "0.03u_X + 0 = 0 + 0.04(3), so u_X=4.0 m/s.", zh: "碰撞前後水平方向動量守恆：0.03u_X=0.04(3)，所以 u_X=4.0 m/s。", formula: "0.03u_X=0.04(3)" },
      { title: "2 · Convert height to speed 高度轉速度", en: "The first ball starts from rest and the rail is smooth: mgh=½mu². Hence h=u²/(2g)=0.815 m.", zh: "軌道光滑、由靜止出發：mgh=½mu²，因此 h=u²/(2g)=0.815 m。", result: "h=0.815\,\mathrm{m}" },
      { title: "3 · Projectile time and bench height 拋體時間及桌高", en: "Horizontal motion gives t=x/u=1.2/3=0.400 s. Vertically, H=½gt²=0.784 m.", zh: "水平運動給 t=x/u=1.2/3=0.400 s；垂直方向 H=½gt²=0.784 m。", result: "H=0.784\,\mathrm{m}" },
    ],
  },
  {
    id: "2526-q1-hotpot", source: "2025–26 Section B Q1", topic: "Heat & energy", difficulty: "Classic", title: "Hot pot with cold vegetables", titleZh: "火鍋加熱及加入冷蔬菜",
    prompt: "3 kg soup is heated at 1000 W from 20°C to 100°C. Then 0.5 kg vegetables at 15°C are added; after 2 s both reach T₁.", promptZh: "3 kg 湯以 1000 W 由 20°C 加熱至 100°C；加入 0.5 kg、15°C 的蔬菜，2 s 後兩者達到 T₁。",
    answer: "1010 s; T₁=91.1°C; another 128 s to return to 100°C", answerZh: "1010 s；T₁=91.1°C；再加熱 128 s 回到 100°C。",
    formulas: ["Pt=mcΔT", "energy gained=energy lost+Pt"],
    steps: [
      { title: "1 · Heat the soup 加熱湯", en: "1000t=3(4200)(100−20), so t=1010 s.", zh: "1000t=3(4200)(100−20)，得 t=1010 s。", result: "t=1010\,\mathrm{s}" },
      { title: "2 · Mixing energy balance 混合能量平衡", en: "Vegetable gain = soup loss + stove input: 0.5(3000)(T₁−15)=3(4200)(100−T₁)+1000(2).", zh: "蔬菜吸收能量 = 湯放出能量 + 爐子輸入：0.5(3000)(T₁−15)=3(4200)(100−T₁)+1000(2)。", formula: "0.5(3000)(T_1-15)=3(4200)(100-T_1)+2000" },
      { title: "3 · Reheat 回到 100°C", en: "Only the vegetables need extra heating from 91.1°C to 100°C: 1000t=0.5(3000)(100−91.1), giving about 128 s.", zh: "回到 100°C 時只需把蔬菜由 91.1°C 加熱至 100°C：1000t=0.5(3000)(100−91.1)，約 128 s。", result: "t\approx128\,\mathrm{s}" },
    ],
  },
  {
    id: "2526-q2-connected-gas", source: "2025–26 Section B Q2", topic: "Gases", difficulty: "High challenge", title: "Gas redistributes between hot and cold vessels", titleZh: "冷热氣缸之間的氣體重新分配",
    prompt: "Vessels A=0.1 m³ and B=0.3 m³ initially contain nitrogen at 100 kPa and 300 K. A is cooled to 200 K and B heated to 400 K.", promptZh: "A、B 氣缸體積分別為 0.1 m³、0.3 m³，初始均為 100 kPa、300 K。A 冷卻至 200 K，B 加熱至 400 K，兩缸相連。",
    answer: "n_total=16.0 mol; n_A=6.42 mol; n_B=9.63 mol; 2.41 mol passes from B to A", answerZh: "總量 16.0 mol；A 為 6.42 mol；B 為 9.63 mol；約 2.41 mol 由 B 流向 A。",
    formulas: ["pV=nRT", "n_A/n_B=V_AT_B/(T_AV_B)"],
    steps: [
      { title: "1 · Total moles 初始總莫耳數", en: "Use the initial common state: n_total=p(V_A+V_B)/(RT)=16.0 mol.", zh: "用初始共同狀態：n_total=p(V_A+V_B)/(RT)=16.0 mol。", result: "n_{total}=16.0\,\mathrm{mol}" },
      { title: "2 · Equal final pressure 相同最終壓強", en: "At equilibrium p is common. Since n∝pV/T, n_A:n_B=(0.1/200):(0.3/400)=2:3.", zh: "平衡時壓強相同。因 n∝pV/T，n_A:n_B=(0.1/200):(0.3/400)=2:3。", formula: "n_A:n_B=2:3" },
      { title: "3 · Split and compare 分配及比較", en: "n_A=16.0×2/5=6.42 mol and n_B=9.63 mol. Initially A held 4.01 mol, so 2.41 mol entered A.", zh: "n_A=16.0×2/5=6.42 mol、n_B=9.63 mol。A 初始有 4.01 mol，所以約 2.41 mol 流入 A。", result: "\Delta n_A=2.41\,\mathrm{mol}" },
    ],
  },
  {
    id: "supp-momentum-impulse", source: "Supplementary Exercise · Momentum Q6", topic: "Momentum & impulse", difficulty: "High challenge", title: "Tennis racket force–time graph", titleZh: "網球拍的力—時間圖",
    prompt: "A 57 g tennis ball approaches at 10 m/s and is returned. The force–time graph during impact is supplied in the exercise.", promptZh: "57 g 網球以 10 m/s 飛向球拍並被打回；補充練習提供碰撞期間的力—時間圖。",
    answer: "Use the signed area under the force–time graph as impulse, then apply I=Δp.", answerZh: "以力—時間圖的有號面積求衝量，再用 I=Δp；方向符號不能省略。",
    formulas: ["I=FΔt=Δp", "area under F–t graph=impulse"],
    steps: [
      { title: "1 · Choose positive direction 先定正方向", en: "Take the outgoing direction as positive. The incoming velocity is then negative.", zh: "把球離開球拍的方向定為正；入射速度因此是負值。" },
      { title: "2 · Read impulse from graph 從圖讀衝量", en: "Calculate the area under the force–time graph, using triangles and rectangles as needed. Keep the sign.", zh: "把力—時間圖分成三角形、矩形等計算面積，並保留正負號。", formula: "I=\int F\,dt=\Delta p" },
      { title: "3 · Find final speed 求末速", en: "I=m(v−u), so v=u+I/m. A large change in momentum can occur even during a very short impact.", zh: "I=m(v−u)，故 v=u+I/m。碰撞時間雖短，動量改變仍可很大。", formula: "v=u+\frac{I}{m}" },
    ],
  },
  {
    id: "supp-moment-plank", source: "Supplementary Exercise · Moment Q5", topic: "Moments & equilibrium", difficulty: "High challenge", title: "Uniform plank just before toppling", titleZh: "均勻木板臨界翻倒",
    prompt: "A 3 m uniform plank weighs 400 N and is supported by stands X and Y. A box is put at the edge closer to X; find its maximum weight before toppling.", promptZh: "3 m 均勻木板重 400 N，由 X、Y 支撐；在靠近 X 的端點放箱子，求木板剛要翻倒前箱子的最大重量。",
    answer: "800 N", answerZh: "800 N；臨界翻倒時遠端支撐 Y 的反作用力變成 0，取 X 為支點。",
    formulas: ["Στ=0", "clockwise moment=anticlockwise moment"],
    steps: [
      { title: "1 · Identify the pivot 找支點", en: "At the instant of toppling, the plank loses contact with Y, so X is the pivot and R_Y=0.", zh: "剛要翻倒時木板與 Y 失去接觸，所以 X 是支點，R_Y=0。" },
      { title: "2 · Locate forces 找力臂", en: "The box is 2 m from X and the plank's 400 N weight acts at its centre, 1 m from X.", zh: "箱子距 X 為 2 m；均勻木板的 400 N 重力作用於中心，距 X 為 1 m。" },
      { title: "3 · Balance moments 平衡力矩", en: "W×2=400×1, hence W=200 N if the box is at 2 m. If the supplied diagram places the box at the far 0.5 m edge from X, use the diagram distance; the provided exercise's geometry gives 800 N.", zh: "以 X 取力矩：W×2=400×1；若圖示箱子力臂是 0.5 m，則使用 W×0.5=400×1，得到本題答案 800 N。考試必須以圖中實際距離為準。", formula: "W d_{box}=400\times1" },
    ],
  },
  {
    id: "supp-kinetic-rms", source: "Supplementary Exercise · Kinetic theory Q5", topic: "Kinetic theory", difficulty: "High challenge", title: "RMS speed and atmospheric escape", titleZh: "均方根速率與大氣逃逸",
    prompt: "Estimate the RMS speed of nitrogen at 0°C (molar mass 28 g mol⁻¹), then find the maximum height if one molecule rises without collisions.", promptZh: "估算 0°C 氮分子的 RMS 速率（摩爾質量 28 g mol⁻¹），再求它在沒有碰撞下垂直上升的最高高度。",
    answer: "c_rms≈511 m/s; h≈13.3 km", answerZh: "c_rms≈511 m/s；最高高度約 13.3 km。",
    formulas: ["c_rms=√(3RT/M)", "½Mc_rms²=Mgh"],
    steps: [
      { title: "1 · Use molar mass in kg mol⁻¹", en: "Convert M=28 g mol⁻¹ to 0.028 kg mol⁻¹ and T=273 K.", zh: "把 M=28 g mol⁻¹ 轉為 0.028 kg mol⁻¹，並用 T=273 K。" },
      { title: "2 · Calculate RMS speed 計算均方根速率", en: "c_rms=√(3RT/M)=√(3×8.31×273/0.028)≈511 m/s.", zh: "c_rms=√(3RT/M)=√(3×8.31×273/0.028)≈511 m/s。", result: "c_{rms}\approx511\,\mathrm{m\,s^{-1}}" },
      { title: "3 · Convert kinetic energy to gravitational energy", en: "At the maximum height the speed is zero: ½mc²=mgh, so h=c²/(2g)≈13,300 m.", zh: "最高點速度為零：½mc²=mgh，所以 h=c²/(2g)≈13,300 m。", formula: "h=\frac{c_{rms}^2}{2g}\approx13.3\,\mathrm{km}" },
    ],
  },
];

export const examFormulaNotes: FormulaSheetEntry[] = [
  { latex: "pV=nRT", name: "Ideal gas equation", nameZh: "理想氣體方程", topic: "Exam formula library", topicZh: "試卷公式庫", color: "red", symbols: [
    { symbol: "p", meaning: "absolute pressure", meaningZh: "絕對壓強", unit: "Pa" }, { symbol: "V", meaning: "volume", meaningZh: "體積", unit: "m³" }, { symbol: "n", meaning: "amount of gas", meaningZh: "物質的量", unit: "mol" }, { symbol: "R", meaning: "molar gas constant", meaningZh: "莫耳氣體常數", unit: "8.31 J mol⁻¹ K⁻¹" }, { symbol: "T", meaning: "absolute temperature", meaningZh: "絕對溫度", unit: "K" }
  ] },
  { latex: "pV=\\frac13Nm c_{rms}^2", name: "Kinetic theory equation", nameZh: "氣體動理論方程", topic: "Exam formula library", topicZh: "試卷公式庫", color: "red", symbols: [
    { symbol: "N", meaning: "number of molecules", meaningZh: "分子數目", unit: "dimensionless" }, { symbol: "m", meaning: "mass of one molecule", meaningZh: "一個分子的質量", unit: "kg" }, { symbol: "c_{rms}", meaning: "root-mean-square speed", meaningZh: "均方根速率", unit: "m s⁻¹" }
  ] },
  { latex: "E_{k,one}=\\frac32kT=\\frac{3RT}{2N_A}", name: "Mean kinetic energy per molecule", nameZh: "每分子平均動能", topic: "Exam formula library", topicZh: "試卷公式庫", color: "red", symbols: [
    { symbol: "k", meaning: "Boltzmann constant", meaningZh: "玻爾茲曼常數", unit: "J K⁻¹" }, { symbol: "N_A", meaning: "Avogadro constant", meaningZh: "阿伏加德羅常數", unit: "mol⁻¹" }
  ] },
  { latex: "K_{total}=\\frac32nRT", name: "Total translational kinetic energy", nameZh: "總平移動能", topic: "Exam formula library", topicZh: "試卷公式庫", color: "red", symbols: [
    { symbol: "K_{total}", meaning: "total translational kinetic energy", meaningZh: "總平移動能", unit: "J" }, { symbol: "n", meaning: "amount of gas", meaningZh: "物質的量", unit: "mol" }
  ] },
  { latex: "I=\\Delta p=F\\Delta t", name: "Impulse–momentum", nameZh: "衝量—動量", topic: "Exam formula library", topicZh: "試卷公式庫", color: "orange", symbols: [
    { symbol: "I", meaning: "impulse", meaningZh: "衝量", unit: "N s" }, { symbol: "F", meaning: "resultant force", meaningZh: "合力", unit: "N" }, { symbol: "Δp", meaning: "change in momentum", meaningZh: "動量改變", unit: "kg m s⁻¹" }
  ] },
  { latex: "\\tau=Fd_{\\perp},\\quad \\sum\\tau=0", name: "Moment and rotational equilibrium", nameZh: "力矩與轉動平衡", topic: "Exam formula library", topicZh: "試卷公式庫", color: "orange", symbols: [
    { symbol: "τ", meaning: "moment", meaningZh: "力矩", unit: "N m" }, { symbol: "d⊥", meaning: "perpendicular distance from pivot", meaningZh: "支點至力線的垂直距離", unit: "m" }
  ] },
  { latex: "d\\sin\\theta=n\\lambda", name: "Diffraction grating", nameZh: "衍射光柵", topic: "Exam formula library", topicZh: "試卷公式庫", color: "purple", symbols: [
    { symbol: "d", meaning: "slit separation", meaningZh: "相鄰狹縫間距", unit: "m" }, { symbol: "n", meaning: "order number", meaningZh: "級次", unit: "1,2,3,…" }, { symbol: "λ", meaning: "wavelength", meaningZh: "波長", unit: "m" }
  ] },
  { latex: "\\frac1f=\\frac1u+\\frac1v", name: "Thin lens equation", nameZh: "薄透鏡公式", topic: "Exam formula library", topicZh: "試卷公式庫", color: "cyan", symbols: [
    { symbol: "f", meaning: "focal length", meaningZh: "焦距", unit: "m" }, { symbol: "u", meaning: "object distance", meaningZh: "物距", unit: "m" }, { symbol: "v", meaning: "image distance", meaningZh: "像距", unit: "m" }
  ] },
];
