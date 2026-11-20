export interface LongAnswerIndex {
  year: string;
  question: string;
  marks: number;
  title: string;
  titleZh: string;
  topics: string[];
  answerStatus: "available" | "not-supplied";
}

export const longAnswerIndex: LongAnswerIndex[] = [
  { year: "2023–24", question: "Q1", marks: 7, title: "Freezing water and latent heat", titleZh: "結冰與潛熱", topics: ["Heat", "Change of state"], answerStatus: "available" },
  { year: "2023–24", question: "Q2", marks: 7, title: "Connected gas cylinders", titleZh: "相連氣缸", topics: ["Ideal gas", "Moles"], answerStatus: "available" },
  { year: "2023–24", question: "Q3", marks: 6, title: "Rough inclined plane", titleZh: "粗糙斜面", topics: ["Newton's laws", "Friction"], answerStatus: "available" },
  { year: "2023–24", question: "Q4", marks: 8, title: "Bicycle energy and resistance", titleZh: "單車能量與阻力", topics: ["Work", "Energy", "Power"], answerStatus: "available" },
  { year: "2023–24", question: "Q5", marks: 8, title: "Collision and projectile", titleZh: "碰撞與拋體", topics: ["Momentum", "Energy", "Projectile"], answerStatus: "available" },
  { year: "2023–24", question: "Q6", marks: 5, title: "Centre of gravity experiment", titleZh: "重心實驗", topics: ["Moments", "Experimental skills"], answerStatus: "available" },
  { year: "2023–24", question: "Q7", marks: 5, title: "Air bag and impulse", titleZh: "安全氣袋與衝量", topics: ["Momentum", "Force-time"], answerStatus: "available" },
  { year: "2023–24", question: "Q8", marks: 6, title: "Concave lens ray diagram", titleZh: "凹透鏡光線圖", topics: ["Lenses", "Magnification"], answerStatus: "available" },
  { year: "2023–24", question: "Q9", marks: 6, title: "Travelling wave particles", titleZh: "行波粒子與波速", topics: ["Waves", "Frequency"], answerStatus: "available" },
  { year: "2023–24", question: "Q10", marks: 10, title: "Double slit and diffraction grating", titleZh: "雙縫與衍射光柵", topics: ["Interference", "Grating"], answerStatus: "available" },
  { year: "2025–26", question: "Q1", marks: 6, title: "Hot pot and thermal mixing", titleZh: "火鍋與熱混合", topics: ["Heat", "Specific heat capacity"], answerStatus: "available" },
  { year: "2025–26", question: "Q2", marks: 7, title: "Gas redistribution", titleZh: "氣體重新分配", topics: ["Ideal gas", "Moles"], answerStatus: "available" },
  { year: "2025–26", question: "Q3", marks: 5, title: "Wedge and friction", titleZh: "楔形體與摩擦", topics: ["Newton's laws", "Friction"], answerStatus: "available" },
  { year: "2025–26", question: "Q4", marks: 8, title: "Horizontal projectile", titleZh: "水平拋體", topics: ["Energy", "Projectile"], answerStatus: "available" },
  { year: "2025–26", question: "Q5", marks: 5, title: "Centre of gravity experiment", titleZh: "重心實驗", topics: ["Moments", "Experimental skills"], answerStatus: "available" },
  { year: "2025–26", question: "Q6", marks: 6, title: "Mirage and total internal reflection", titleZh: "海市蜃樓與全內反射", topics: ["Refraction", "TIR"], answerStatus: "available" },
  { year: "2025–26", question: "Q7", marks: 8, title: "Earth–Moon orbit", titleZh: "地月軌道", topics: ["Gravitation", "Circular motion"], answerStatus: "available" },
  { year: "2025–26", question: "Q8", marks: 7, title: "Virtual image through a lens", titleZh: "透鏡虛像", topics: ["Lenses", "Ray diagram"], answerStatus: "available" },
  { year: "2025–26", question: "Q9", marks: 8, title: "Boats, collision and throwing blocks", titleZh: "船碰撞與拋木塊", topics: ["Momentum", "Kinetic energy"], answerStatus: "available" },
  { year: "2025–26", question: "Q10", marks: 8, title: "Transmission grating orders", titleZh: "透射光柵級次", topics: ["Grating", "Wavelength"], answerStatus: "available" },
];

export const coverageAudit = [
  { area: "Heat, latent heat & calorimetry", zh: "熱、潛熱與量熱法", status: "covered", note: "已有 Heat、Heat Capacity、Change of State 課節及公式。" },
  { area: "Ideal gases, moles & kinetic theory", zh: "理想氣體、莫耳與動理論", status: "covered", note: "已有 pV=nRT、pV=⅓Nmc²rms、RMS、平均／總動能及文字解說。" },
  { area: "Forces, friction & inclined planes", zh: "力、摩擦與斜面", status: "covered", note: "已有 Newton、Resultant Force、自由體圖及分力。" },
  { area: "Work, energy, power & efficiency", zh: "功、能量、功率與效率", status: "covered", note: "已有 Work Done、Energy 及能量轉移推理。" },
  { area: "Momentum, impulse & collisions", zh: "動量、衝量與碰撞", status: "covered", note: "已有 Momentum & Collisions、I=Δp、碰撞及安全氣袋。" },
  { area: "Moments, equilibrium & centre of gravity", zh: "力矩、平衡與重心", status: "partial", note: "公式及臨界翻倒已覆蓋；重心實驗的掛線操作與作圖需要獨立實驗卡。" },
  { area: "Projectile motion", zh: "拋體運動", status: "covered", note: "已有水平拋體、分解水平／垂直運動及飛行時間。" },
  { area: "Lenses and ray diagrams", zh: "透鏡與光線圖", status: "covered", note: "已有 thin-lens、magnification、凸／凹透鏡及 ray diagram。" },
  { area: "Refraction, TIR & mirage", zh: "折射、全內反射與海市蜃樓", status: "partial", note: "折射及 TIR 已有；多層空氣的海市蜃樓逐步推導需要新增專題。" },
  { area: "Waves, standing waves & wave graphs", zh: "波、駐波與波形圖", status: "covered", note: "已有 travelling／stationary waves、節腹、頻率及波速互動圖。" },
  { area: "Double slit & diffraction grating", zh: "雙縫與衍射光柵", status: "covered", note: "已有 first／second order、光柵方程、線密度及屏幕幾何。" },
  { area: "Gravitation, circular motion & orbits", zh: "萬有引力、圓周運動與軌道", status: "covered", note: "已有 Gravitation & Orbits、向心力及軌道速度公式。" },
  { area: "Experimental skills and graph explanation", zh: "實驗技能與圖像解說", status: "partial", note: "一般實驗思維已有；重心、波形及光柵作圖可再加評分要點。" },
] as const;
