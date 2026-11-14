// DSE Physics Revision Content
// English main content with Traditional Chinese annotations

import {
  applyExistingTopicEnhancements,
  expandedFormulaSheet,
  expandedTopics,
  existingFormulaSheetAdditions,
} from "./expanded-physics-content";
import { applyDetailedLessons } from "./lesson-registry";

export interface Formula {
  latex: string;
  description: string;
  descriptionZh: string;
  symbols?: SymbolDef[];
  name?: string;
  nameZh?: string;
  rearrangements?: { target: string; latex: string; note: string; noteZh: string }[];
}

export interface SymbolDef {
  symbol: string;
  meaning: string;
  meaningZh: string;
  unit: string;
}

export interface KeyPoint {
  en: string;
  zh: string;
}

export interface Topic {
  id: string;
  title: string;
  titleZh: string;
  category: string;
  categoryZh: string;
  color: string;
  accentColor: string;
  icon: string;
  summary: string;
  summaryZh: string;
  keyPoints: KeyPoint[];
  formulas: Formula[];
  examTips: KeyPoint[];
}

// ─── ALL FORMULAS REFERENCE (for the bottom formula sheet) ────────────────────
export interface FormulaSheetEntry {
  latex: string;
  name: string;
  nameZh: string;
  topic: string;
  topicZh: string;
  color: string;
  symbols: SymbolDef[];
  rearrangements?: Formula["rearrangements"];
}

export const formulaSheet: FormulaSheetEntry[] = [
  // ── Optics ──
  {
    latex: "\\angle i = \\angle r",
    name: "Law of Reflection",
    nameZh: "反射定律",
    topic: "Reflection",
    topicZh: "反射",
    color: "cyan",
    symbols: [
      { symbol: "i", meaning: "Angle of incidence", meaningZh: "入射角", unit: "degrees (°)" },
      { symbol: "r", meaning: "Angle of reflection", meaningZh: "反射角", unit: "degrees (°)" },
    ],
  },
  {
    latex: "n_1 \\sin\\theta_1 = n_2 \\sin\\theta_2",
    name: "Snell's Law",
    nameZh: "斯涅爾定律",
    topic: "Refraction",
    topicZh: "折射",
    color: "cyan",
    symbols: [
      { symbol: "n₁", meaning: "Refractive index of medium 1", meaningZh: "介質1的折射率", unit: "dimensionless 無單位" },
      { symbol: "n₂", meaning: "Refractive index of medium 2", meaningZh: "介質2的折射率", unit: "dimensionless 無單位" },
      { symbol: "θ₁", meaning: "Angle of incidence (in medium 1)", meaningZh: "入射角（在介質1中）", unit: "degrees (°)" },
      { symbol: "θ₂", meaning: "Angle of refraction (in medium 2)", meaningZh: "折射角（在介質2中）", unit: "degrees (°)" },
    ],
  },
  {
    latex: "n = \\frac{c}{v}",
    name: "Refractive Index",
    nameZh: "折射率",
    topic: "Refraction",
    topicZh: "折射",
    color: "cyan",
    symbols: [
      { symbol: "n", meaning: "Refractive index of the medium", meaningZh: "介質的折射率", unit: "dimensionless 無單位" },
      { symbol: "c", meaning: "Speed of light in vacuum (3 × 10⁸ m/s)", meaningZh: "光在真空中的速度（3 × 10⁸ m/s）", unit: "m/s" },
      { symbol: "v", meaning: "Speed of light in the medium", meaningZh: "光在介質中的速度", unit: "m/s" },
    ],
  },
  {
    latex: "\\sin C = \\frac{n_2}{n_1}",
    name: "Critical Angle",
    nameZh: "臨界角",
    topic: "Total Internal Reflection",
    topicZh: "全內反射",
    color: "cyan",
    symbols: [
      { symbol: "C", meaning: "Critical angle", meaningZh: "臨界角", unit: "degrees (°)" },
      { symbol: "n₁", meaning: "Refractive index of denser medium (light travels from here)", meaningZh: "較密介質的折射率（光從此介質出發）", unit: "dimensionless 無單位" },
      { symbol: "n₂", meaning: "Refractive index of less dense medium", meaningZh: "較疏介質的折射率", unit: "dimensionless 無單位" },
    ],
  },
  // ── Mechanics ──
  {
    latex: "F = ma",
    name: "Newton's Second Law",
    nameZh: "牛頓第二定律",
    topic: "Newton's Laws",
    topicZh: "牛頓定律",
    color: "orange",
    symbols: [
      { symbol: "F", meaning: "Net (resultant) force acting on the object", meaningZh: "作用在物體上的合力（淨力）", unit: "Newton (N)" },
      { symbol: "m", meaning: "Mass of the object", meaningZh: "物體的質量", unit: "kilogram (kg)" },
      { symbol: "a", meaning: "Acceleration of the object", meaningZh: "物體的加速度", unit: "m/s²" },
    ],
  },
  {
    latex: "W = mg",
    name: "Weight",
    nameZh: "重力",
    topic: "Newton's Laws",
    topicZh: "牛頓定律",
    color: "orange",
    symbols: [
      { symbol: "W", meaning: "Weight (gravitational force)", meaningZh: "重力（引力）", unit: "Newton (N)" },
      { symbol: "m", meaning: "Mass of the object", meaningZh: "物體的質量", unit: "kilogram (kg)" },
      { symbol: "g", meaning: "Gravitational field strength (≈ 10 N/kg on Earth)", meaningZh: "重力場強度（地球上 ≈ 10 N/kg）", unit: "N/kg or m/s²" },
    ],
  },
  {
    latex: "R = \\sqrt{F_x^2 + F_y^2}",
    name: "Magnitude of Resultant Force",
    nameZh: "合力大小",
    topic: "Resultant Force",
    topicZh: "合力",
    color: "orange",
    symbols: [
      { symbol: "R", meaning: "Magnitude of resultant force", meaningZh: "合力的大小", unit: "Newton (N)" },
      { symbol: "Fₓ", meaning: "Horizontal component of force", meaningZh: "力的水平分量", unit: "Newton (N)" },
      { symbol: "Fᵧ", meaning: "Vertical component of force", meaningZh: "力的垂直分量", unit: "Newton (N)" },
    ],
  },
  {
    latex: "F_x = F\\cos\\theta, \\quad F_y = F\\sin\\theta",
    name: "Resolution of Forces",
    nameZh: "力的分解",
    topic: "Resultant Force",
    topicZh: "合力與分力",
    color: "orange",
    symbols: [
      { symbol: "F", meaning: "Original force", meaningZh: "原來的力", unit: "Newton (N)" },
      { symbol: "Fₓ", meaning: "Horizontal component", meaningZh: "水平分量", unit: "Newton (N)" },
      { symbol: "Fᵧ", meaning: "Vertical component", meaningZh: "垂直分量", unit: "Newton (N)" },
      { symbol: "θ", meaning: "Angle between force F and horizontal", meaningZh: "力 F 與水平方向的夾角", unit: "degrees (°)" },
    ],
  },
  {
    latex: "W = Fs\\cos\\theta",
    name: "Work Done",
    nameZh: "做功",
    topic: "Work Done",
    topicZh: "做功",
    color: "orange",
    symbols: [
      { symbol: "W", meaning: "Work done", meaningZh: "做的功", unit: "Joule (J)" },
      { symbol: "F", meaning: "Applied force", meaningZh: "施加的力", unit: "Newton (N)" },
      { symbol: "s", meaning: "Displacement in the direction of motion", meaningZh: "沿運動方向的位移", unit: "metre (m)" },
      { symbol: "θ", meaning: "Angle between force and displacement", meaningZh: "力與位移之間的夾角", unit: "degrees (°)" },
    ],
  },
  {
    latex: "KE = \\frac{1}{2}mv^2",
    name: "Kinetic Energy",
    nameZh: "動能",
    topic: "Work Done",
    topicZh: "做功與能量",
    color: "orange",
    symbols: [
      { symbol: "KE", meaning: "Kinetic energy", meaningZh: "動能", unit: "Joule (J)" },
      { symbol: "m", meaning: "Mass of the object", meaningZh: "物體的質量", unit: "kilogram (kg)" },
      { symbol: "v", meaning: "Speed of the object", meaningZh: "物體的速度", unit: "m/s" },
    ],
  },
  {
    latex: "GPE = mgh",
    name: "Gravitational Potential Energy",
    nameZh: "重力勢能",
    topic: "Work Done",
    topicZh: "做功與能量",
    color: "orange",
    symbols: [
      { symbol: "GPE", meaning: "Gravitational potential energy", meaningZh: "重力勢能", unit: "Joule (J)" },
      { symbol: "m", meaning: "Mass of the object", meaningZh: "物體的質量", unit: "kilogram (kg)" },
      { symbol: "g", meaning: "Gravitational field strength (≈ 10 N/kg)", meaningZh: "重力場強度（≈ 10 N/kg）", unit: "N/kg" },
      { symbol: "h", meaning: "Height above the reference level", meaningZh: "距參考水平的高度", unit: "metre (m)" },
    ],
  },
  {
    latex: "P = \\frac{W}{t} = Fv",
    name: "Power",
    nameZh: "功率",
    topic: "Work Done",
    topicZh: "做功與能量",
    color: "orange",
    symbols: [
      { symbol: "P", meaning: "Power", meaningZh: "功率", unit: "Watt (W) = J/s" },
      { symbol: "W", meaning: "Work done (energy transferred)", meaningZh: "做的功（轉移的能量）", unit: "Joule (J)" },
      { symbol: "t", meaning: "Time taken", meaningZh: "所用時間", unit: "second (s)" },
      { symbol: "F", meaning: "Force applied", meaningZh: "施加的力", unit: "Newton (N)" },
      { symbol: "v", meaning: "Velocity of the object", meaningZh: "物體的速度", unit: "m/s" },
    ],
  },
  {
    latex: "\\eta = \\frac{W_{useful}}{W_{input}} \\times 100\\%",
    name: "Efficiency",
    nameZh: "效率",
    topic: "Work Done",
    topicZh: "做功與能量",
    color: "orange",
    symbols: [
      { symbol: "η (eta)", meaning: "Efficiency", meaningZh: "效率", unit: "% (percentage)" },
      { symbol: "W_useful", meaning: "Useful energy/work output", meaningZh: "有用能量/功輸出", unit: "Joule (J)" },
      { symbol: "W_input", meaning: "Total energy/work input", meaningZh: "總能量/功輸入", unit: "Joule (J)" },
    ],
  },
  // ── Heat ──
  {
    latex: "Q = mc\\Delta T",
    name: "Heat Energy (Specific Heat Capacity)",
    nameZh: "熱能（比熱容）",
    topic: "Heat",
    topicZh: "熱學",
    color: "red",
    symbols: [
      { symbol: "Q", meaning: "Heat energy transferred", meaningZh: "傳遞的熱能", unit: "Joule (J)" },
      { symbol: "m", meaning: "Mass of the substance", meaningZh: "物質的質量", unit: "kilogram (kg)" },
      { symbol: "c", meaning: "Specific heat capacity of the substance", meaningZh: "物質的比熱容", unit: "J/(kg·°C)" },
      { symbol: "ΔT", meaning: "Change in temperature (T_final − T_initial)", meaningZh: "溫度變化（末溫 − 初溫）", unit: "°C or K" },
    ],
  },
  {
    latex: "Q = mL",
    name: "Latent Heat",
    nameZh: "潛熱",
    topic: "Heat",
    topicZh: "熱學",
    color: "red",
    symbols: [
      { symbol: "Q", meaning: "Heat energy absorbed or released during change of state", meaningZh: "相變時吸收或釋放的熱能", unit: "Joule (J)" },
      { symbol: "m", meaning: "Mass of the substance changing state", meaningZh: "發生相變的物質質量", unit: "kilogram (kg)" },
      { symbol: "L", meaning: "Specific latent heat (fusion or vaporisation)", meaningZh: "比潛熱（熔化或汽化）", unit: "J/kg" },
    ],
  },
  {
    latex: "T(K) = T(°C) + 273",
    name: "Temperature Conversion",
    nameZh: "溫度換算",
    topic: "Heat",
    topicZh: "熱學",
    color: "red",
    symbols: [
      { symbol: "T(K)", meaning: "Temperature in Kelvin", meaningZh: "開爾文溫度", unit: "Kelvin (K)" },
      { symbol: "T(°C)", meaning: "Temperature in Celsius", meaningZh: "攝氏溫度", unit: "Celsius (°C)" },
      { symbol: "273", meaning: "Offset constant (absolute zero = −273°C)", meaningZh: "偏移常數（絕對零度 = −273°C）", unit: "K" },
    ],
  },
  // ── Waves ──
  {
    latex: "v = f\\lambda",
    name: "Wave Equation",
    nameZh: "波動方程",
    topic: "Waves",
    topicZh: "波動",
    color: "purple",
    symbols: [
      { symbol: "v", meaning: "Wave speed", meaningZh: "波速", unit: "m/s" },
      { symbol: "f", meaning: "Frequency of the wave", meaningZh: "波的頻率", unit: "Hertz (Hz)" },
      { symbol: "λ (lambda)", meaning: "Wavelength", meaningZh: "波長", unit: "metre (m)" },
    ],
  },
  {
    latex: "T = \\frac{1}{f}",
    name: "Period–Frequency Relationship",
    nameZh: "週期與頻率的關係",
    topic: "Waves",
    topicZh: "波動",
    color: "purple",
    symbols: [
      { symbol: "T", meaning: "Period (time for one complete oscillation)", meaningZh: "週期（完成一次完整振動的時間）", unit: "second (s)" },
      { symbol: "f", meaning: "Frequency", meaningZh: "頻率", unit: "Hertz (Hz)" },
    ],
  },
  {
    latex: "\\Delta y = \\frac{\\lambda D}{d}",
    name: "Double Slit Fringe Spacing",
    nameZh: "雙縫條紋間距",
    topic: "Double Slit",
    topicZh: "雙縫實驗",
    color: "purple",
    symbols: [
      { symbol: "Δy", meaning: "Fringe spacing (distance between adjacent bright or dark fringes)", meaningZh: "條紋間距（相鄰亮紋或暗紋之間的距離）", unit: "metre (m)" },
      { symbol: "λ (lambda)", meaning: "Wavelength of light used", meaningZh: "所用光的波長", unit: "metre (m)" },
      { symbol: "D", meaning: "Distance from slits to the screen", meaningZh: "縫到屏幕的距離", unit: "metre (m)" },
      { symbol: "d", meaning: "Slit separation (distance between the two slits)", meaningZh: "縫間距（兩縫之間的距離）", unit: "metre (m)" },
    ],
  },
];

export const topics: Topic[] = [
  // ─── OPTICS ───────────────────────────────────────────────────────────────
  {
    id: "reflection",
    title: "Reflection of Light",
    titleZh: "光的反射",
    category: "Optics",
    categoryZh: "光學",
    color: "cyan",
    accentColor: "#00d4ff",
    icon: "🔆",
    summary:
      "Reflection occurs when light bounces off a surface. The angle of incidence equals the angle of reflection, both measured from the normal to the surface.",
    summaryZh:
      "反射是光線碰到表面後彈回的現象。入射角等於反射角，兩者均從法線量起。",
    keyPoints: [
      {
        en: "The incident ray, reflected ray, and normal all lie in the same plane.",
        zh: "入射光線、反射光線和法線均在同一平面內。",
      },
      {
        en: "Angle of incidence (i) = Angle of reflection (r), both measured from the normal.",
        zh: "入射角 (i) = 反射角 (r)，均從法線量起。",
      },
      {
        en: "Regular (specular) reflection: parallel rays reflect as parallel rays (smooth surface).",
        zh: "規則反射（鏡面反射）：平行光線反射後仍為平行光線（光滑表面）。",
      },
      {
        en: "Diffuse reflection: parallel rays scatter in different directions (rough surface).",
        zh: "漫反射：平行光線反射後向不同方向散射（粗糙表面）。",
      },
      {
        en: "Plane mirror image: virtual, upright, same size, laterally inverted, same distance behind mirror.",
        zh: "平面鏡像：虛像、正立、等大、左右相反，與物體到鏡面距離相同。",
      },
    ],
    formulas: [
      {
        latex: "\\angle i = \\angle r",
        description: "Law of Reflection: angle of incidence equals angle of reflection",
        descriptionZh: "反射定律：入射角等於反射角",
        symbols: [
          { symbol: "i", meaning: "Angle of incidence (measured from the normal)", meaningZh: "入射角（從法線量起）", unit: "degrees (°)" },
          { symbol: "r", meaning: "Angle of reflection (measured from the normal)", meaningZh: "反射角（從法線量起）", unit: "degrees (°)" },
        ],
      },
    ],
    examTips: [
      {
        en: "Always measure angles from the NORMAL, not from the surface.",
        zh: "角度必須從法線量起，而非從表面量起。",
      },
      {
        en: "For plane mirror problems, the image distance = object distance (behind mirror).",
        zh: "平面鏡問題：像距 = 物距（在鏡後）。",
      },
    ],
  },
  {
    id: "refraction",
    title: "Refraction of Light",
    titleZh: "光的折射",
    category: "Optics",
    categoryZh: "光學",
    color: "cyan",
    accentColor: "#00d4ff",
    icon: "💎",
    summary:
      "Refraction is the bending of light as it passes from one medium to another due to a change in speed. Snell's Law relates the angles of incidence and refraction to the refractive indices of the two media.",
    summaryZh:
      "折射是光線從一種介質進入另一種介質時，因速度改變而彎曲的現象。斯涅爾定律將入射角和折射角與兩種介質的折射率聯繫起來。",
    keyPoints: [
      {
        en: "Light bends towards the normal when entering a denser medium (slower speed).",
        zh: "光線進入較密介質時（速度較慢），向法線方向彎曲。",
      },
      {
        en: "Light bends away from the normal when entering a less dense medium (faster speed).",
        zh: "光線進入較疏介質時（速度較快），遠離法線方向彎曲。",
      },
      {
        en: "Refractive index n = speed of light in vacuum / speed of light in medium.",
        zh: "折射率 n = 光在真空中的速度 / 光在介質中的速度。",
      },
      {
        en: "A higher refractive index means light travels slower in that medium.",
        zh: "折射率越高，光在該介質中傳播越慢。",
      },
      {
        en: "The frequency of light does NOT change during refraction; only wavelength and speed change.",
        zh: "光的頻率在折射過程中不變；只有波長和速度改變。",
      },
    ],
    formulas: [
      {
        latex: "n_1 \\sin\\theta_1 = n_2 \\sin\\theta_2",
        description: "Snell's Law",
        descriptionZh: "斯涅爾定律",
        symbols: [
          { symbol: "n₁", meaning: "Refractive index of medium 1 (where light comes from)", meaningZh: "介質1的折射率（光從此介質出發）", unit: "dimensionless 無單位" },
          { symbol: "n₂", meaning: "Refractive index of medium 2 (where light enters)", meaningZh: "介質2的折射率（光進入此介質）", unit: "dimensionless 無單位" },
          { symbol: "θ₁", meaning: "Angle of incidence in medium 1", meaningZh: "介質1中的入射角", unit: "degrees (°)" },
          { symbol: "θ₂", meaning: "Angle of refraction in medium 2", meaningZh: "介質2中的折射角", unit: "degrees (°)" },
        ],
      },
      {
        latex: "n = \\frac{c}{v}",
        description: "Refractive index: c = speed of light in vacuum, v = speed in medium",
        descriptionZh: "折射率：c = 光在真空中速度，v = 光在介質中速度",
        symbols: [
          { symbol: "n", meaning: "Refractive index of the medium", meaningZh: "介質的折射率", unit: "dimensionless 無單位" },
          { symbol: "c", meaning: "Speed of light in vacuum (3 × 10⁸ m/s)", meaningZh: "光在真空中的速度（3 × 10⁸ m/s）", unit: "m/s" },
          { symbol: "v", meaning: "Speed of light in the medium", meaningZh: "光在介質中的速度", unit: "m/s" },
        ],
      },
      {
        latex: "n = \\frac{\\sin i}{\\sin r}",
        description: "Refractive index from angles (light going from air into medium)",
        descriptionZh: "由角度求折射率（光從空氣進入介質）",
        symbols: [
          { symbol: "n", meaning: "Refractive index of the medium", meaningZh: "介質的折射率", unit: "dimensionless 無單位" },
          { symbol: "i", meaning: "Angle of incidence (in air)", meaningZh: "入射角（在空氣中）", unit: "degrees (°)" },
          { symbol: "r", meaning: "Angle of refraction (in medium)", meaningZh: "折射角（在介質中）", unit: "degrees (°)" },
        ],
      },
    ],
    examTips: [
      {
        en: "n₁ sin θ₁ = n₂ sin θ₂ — always label which medium is 1 and which is 2.",
        zh: "n₁ sin θ₁ = n₂ sin θ₂ — 必須標明哪個是介質1，哪個是介質2。",
      },
      {
        en: "Air has n ≈ 1; glass typically n ≈ 1.5; water n ≈ 1.33.",
        zh: "空氣 n ≈ 1；玻璃通常 n ≈ 1.5；水 n ≈ 1.33。",
      },
    ],
  },
  {
    id: "total-internal-reflection",
    title: "Total Internal Reflection",
    titleZh: "全內反射",
    category: "Optics",
    categoryZh: "光學",
    color: "cyan",
    accentColor: "#00d4ff",
    icon: "🌐",
    summary:
      "Total Internal Reflection (TIR) occurs when light travels from a denser to a less dense medium and the angle of incidence exceeds the critical angle. All light is reflected back into the denser medium.",
    summaryZh:
      "全內反射（TIR）發生於光線從較密介質進入較疏介質，且入射角超過臨界角時。所有光線均被反射回較密介質。",
    keyPoints: [
      {
        en: "Conditions: (1) Light must travel from denser to less dense medium. (2) Angle of incidence must exceed the critical angle.",
        zh: "條件：(1) 光線必須從較密介質進入較疏介質。(2) 入射角必須超過臨界角。",
      },
      {
        en: "At the critical angle (C), the refracted ray travels along the boundary (θ_refracted = 90°).",
        zh: "在臨界角 (C) 時，折射光線沿界面傳播（折射角 = 90°）。",
      },
      {
        en: "When θ > C, no refraction occurs — all light is reflected (TIR).",
        zh: "當 θ > C 時，不發生折射——所有光線均被反射（全內反射）。",
      },
      {
        en: "Applications: optical fibres, diamonds, periscopes using prisms.",
        zh: "應用：光纖、鑽石、使用稜鏡的潛望鏡。",
      },
      {
        en: "Optical fibres use TIR to transmit light signals over long distances with minimal loss.",
        zh: "光纖利用全內反射以極低損耗遠距離傳輸光訊號。",
      },
    ],
    formulas: [
      {
        latex: "\\sin C = \\frac{n_2}{n_1} \\quad (n_1 > n_2)",
        description: "Critical angle formula (light going from medium 1 to medium 2)",
        descriptionZh: "臨界角公式（光從介質1進入介質2）",
        symbols: [
          { symbol: "C", meaning: "Critical angle", meaningZh: "臨界角", unit: "degrees (°)" },
          { symbol: "n₁", meaning: "Refractive index of denser medium (light travels from here)", meaningZh: "較密介質的折射率（光從此介質出發）", unit: "dimensionless 無單位" },
          { symbol: "n₂", meaning: "Refractive index of less dense medium", meaningZh: "較疏介質的折射率", unit: "dimensionless 無單位" },
        ],
      },
      {
        latex: "\\sin C = \\frac{1}{n} \\quad (\\text{from glass to air})",
        description: "Critical angle for glass-air interface (n_air = 1)",
        descriptionZh: "玻璃-空氣界面的臨界角（空氣折射率 = 1）",
        symbols: [
          { symbol: "C", meaning: "Critical angle for glass-air interface", meaningZh: "玻璃-空氣界面的臨界角", unit: "degrees (°)" },
          { symbol: "n", meaning: "Refractive index of glass", meaningZh: "玻璃的折射率", unit: "dimensionless 無單位" },
        ],
      },
    ],
    examTips: [
      {
        en: "TIR only happens when going from DENSE to LESS DENSE medium.",
        zh: "全內反射只在從較密介質進入較疏介質時發生。",
      },
      {
        en: "Higher refractive index → smaller critical angle → TIR occurs more easily.",
        zh: "折射率越高 → 臨界角越小 → 越容易發生全內反射。",
      },
    ],
  },

  // ─── MECHANICS ────────────────────────────────────────────────────────────
  {
    id: "newton-laws",
    title: "Newton's Laws of Motion",
    titleZh: "牛頓運動定律",
    category: "Mechanics",
    categoryZh: "力學",
    color: "orange",
    accentColor: "#f97316",
    icon: "⚡",
    summary:
      "Newton's three laws form the foundation of classical mechanics, describing the relationship between forces and motion of objects.",
    summaryZh:
      "牛頓三大定律是經典力學的基礎，描述力與物體運動之間的關係。",
    keyPoints: [
      {
        en: "1st Law (Inertia): An object remains at rest or in uniform motion unless acted upon by a net external force.",
        zh: "第一定律（慣性定律）：物體保持靜止或勻速直線運動，除非受到合外力作用。",
      },
      {
        en: "2nd Law: The net force on an object equals its mass times its acceleration (F = ma).",
        zh: "第二定律：物體所受合力等於其質量乘以加速度（F = ma）。",
      },
      {
        en: "3rd Law (Action-Reaction): For every action, there is an equal and opposite reaction.",
        zh: "第三定律（作用力與反作用力）：每個作用力都有一個大小相等、方向相反的反作用力。",
      },
      {
        en: "Inertia is the tendency of an object to resist changes in its state of motion.",
        zh: "慣性是物體抵抗其運動狀態改變的傾向。",
      },
      {
        en: "Action-reaction pairs act on DIFFERENT objects — they never cancel each other.",
        zh: "作用力與反作用力作用在不同物體上——它們永遠不會相互抵消。",
      },
      {
        en: "Weight (W = mg) is the gravitational force on an object; g ≈ 10 m/s² on Earth.",
        zh: "重力（W = mg）是作用在物體上的引力；地球上 g ≈ 10 m/s²。",
      },
    ],
    formulas: [
      {
        latex: "\\sum F = 0 \\Rightarrow a = 0",
        description: "Newton's 1st Law: zero net force means zero acceleration (object at rest or constant velocity)",
        descriptionZh: "牛頓第一定律：合力為零則加速度為零（物體靜止或勻速）",
        symbols: [
          { symbol: "ΣF", meaning: "Sum of all forces (net force)", meaningZh: "所有力的總和（合力）", unit: "Newton (N)" },
          { symbol: "a", meaning: "Acceleration", meaningZh: "加速度", unit: "m/s²" },
        ],
      },
      {
        latex: "F = ma",
        description: "Newton's 2nd Law: F = net force (N), m = mass (kg), a = acceleration (m/s²)",
        descriptionZh: "牛頓第二定律：F = 合力（牛頓），m = 質量（千克），a = 加速度（米/秒²）",
        symbols: [
          { symbol: "F", meaning: "Net (resultant) force", meaningZh: "合力（淨力）", unit: "Newton (N)" },
          { symbol: "m", meaning: "Mass of the object", meaningZh: "物體的質量", unit: "kilogram (kg)" },
          { symbol: "a", meaning: "Acceleration produced", meaningZh: "產生的加速度", unit: "m/s²" },
        ],
      },
      {
        latex: "F_{AB} = -F_{BA}",
        description: "Newton's 3rd Law: action and reaction are equal and opposite",
        descriptionZh: "牛頓第三定律：作用力與反作用力大小相等、方向相反",
        symbols: [
          { symbol: "F_AB", meaning: "Force exerted by object A on object B", meaningZh: "物體A對物體B施加的力", unit: "Newton (N)" },
          { symbol: "F_BA", meaning: "Force exerted by object B on object A (reaction)", meaningZh: "物體B對物體A施加的力（反作用力）", unit: "Newton (N)" },
        ],
      },
      {
        latex: "W = mg",
        description: "Weight: m = mass (kg), g = gravitational field strength (≈10 N/kg on Earth)",
        descriptionZh: "重力：m = 質量（千克），g = 重力場強度（地球上 ≈10 N/kg）",
        symbols: [
          { symbol: "W", meaning: "Weight (gravitational force)", meaningZh: "重力", unit: "Newton (N)" },
          { symbol: "m", meaning: "Mass", meaningZh: "質量", unit: "kilogram (kg)" },
          { symbol: "g", meaning: "Gravitational field strength (≈ 10 N/kg on Earth)", meaningZh: "重力場強度（地球上 ≈ 10 N/kg）", unit: "N/kg" },
        ],
      },
    ],
    examTips: [
      {
        en: "F = ma uses NET force — always find the resultant force first.",
        zh: "F = ma 使用合力——必須先求出合力。",
      },
      {
        en: "Action-reaction pairs: same magnitude, opposite direction, act on DIFFERENT bodies.",
        zh: "作用力與反作用力：大小相同、方向相反、作用在不同物體上。",
      },
      {
        en: "Normal force ≠ weight unless the object is on a horizontal surface with no vertical acceleration.",
        zh: "法向力 ≠ 重力，除非物體在水平面上且無垂直加速度。",
      },
    ],
  },
  {
    id: "resultant-force",
    title: "Resultant Force & Resolution",
    titleZh: "合力與分力",
    category: "Mechanics",
    categoryZh: "力學",
    color: "orange",
    accentColor: "#f97316",
    icon: "🎯",
    summary:
      "Forces are vector quantities. The resultant force is the single force that has the same effect as all the individual forces combined. Forces can also be resolved into components along perpendicular axes.",
    summaryZh:
      "力是向量。合力是與所有個別力合效果相同的單一力。力也可以分解為沿垂直軸的分量。",
    keyPoints: [
      {
        en: "Forces are vectors — they have both magnitude and direction.",
        zh: "力是向量——既有大小又有方向。",
      },
      {
        en: "Resultant force: use vector addition (tip-to-tail method or parallelogram law).",
        zh: "合力：使用向量加法（首尾相接法或平行四邊形定律）。",
      },
      {
        en: "For forces at right angles: R = √(F₁² + F₂²), tan θ = F₂/F₁.",
        zh: "對於直角力：R = √(F₁² + F₂²)，tan θ = F₂/F₁。",
      },
      {
        en: "Resolution: any force F at angle θ can be split into F cos θ (horizontal) and F sin θ (vertical).",
        zh: "分力：任何角度為 θ 的力 F 可分解為 F cos θ（水平）和 F sin θ（垂直）。",
      },
      {
        en: "Equilibrium: when the resultant of all forces is zero (object at rest or constant velocity).",
        zh: "平衡：當所有力的合力為零時（物體靜止或勻速）。",
      },
      {
        en: "For equilibrium: ΣFₓ = 0 and ΣFᵧ = 0.",
        zh: "平衡條件：ΣFₓ = 0 且 ΣFᵧ = 0。",
      },
    ],
    formulas: [
      {
        latex: "R = \\sqrt{F_x^2 + F_y^2}",
        description: "Magnitude of resultant force from perpendicular components",
        descriptionZh: "由垂直分量求合力大小",
        symbols: [
          { symbol: "R", meaning: "Magnitude of resultant force", meaningZh: "合力的大小", unit: "Newton (N)" },
          { symbol: "Fₓ", meaning: "Horizontal component of all forces", meaningZh: "所有力的水平分量之和", unit: "Newton (N)" },
          { symbol: "Fᵧ", meaning: "Vertical component of all forces", meaningZh: "所有力的垂直分量之和", unit: "Newton (N)" },
        ],
      },
      {
        latex: "\\theta = \\tan^{-1}\\left(\\frac{F_y}{F_x}\\right)",
        description: "Direction of resultant force (angle from horizontal)",
        descriptionZh: "合力方向（與水平方向的夾角）",
        symbols: [
          { symbol: "θ", meaning: "Angle of resultant force from horizontal", meaningZh: "合力與水平方向的夾角", unit: "degrees (°)" },
          { symbol: "Fᵧ", meaning: "Vertical component", meaningZh: "垂直分量", unit: "Newton (N)" },
          { symbol: "Fₓ", meaning: "Horizontal component", meaningZh: "水平分量", unit: "Newton (N)" },
        ],
      },
      {
        latex: "F_x = F\\cos\\theta, \\quad F_y = F\\sin\\theta",
        description: "Resolving a force F at angle θ into horizontal and vertical components",
        descriptionZh: "將角度為 θ 的力 F 分解為水平和垂直分量",
        symbols: [
          { symbol: "F", meaning: "Original force to be resolved", meaningZh: "需要分解的原力", unit: "Newton (N)" },
          { symbol: "Fₓ", meaning: "Horizontal component (parallel to x-axis)", meaningZh: "水平分量（平行於x軸）", unit: "Newton (N)" },
          { symbol: "Fᵧ", meaning: "Vertical component (parallel to y-axis)", meaningZh: "垂直分量（平行於y軸）", unit: "Newton (N)" },
          { symbol: "θ", meaning: "Angle between force F and the horizontal", meaningZh: "力 F 與水平方向的夾角", unit: "degrees (°)" },
        ],
      },
    ],
    examTips: [
      {
        en: "Always draw a free body diagram first — label ALL forces on the object.",
        zh: "先畫自由體圖——標出物體所受的所有力。",
      },
      {
        en: "For inclined plane problems, resolve forces parallel and perpendicular to the slope.",
        zh: "斜面問題：將力分解為平行和垂直於斜面的分量。",
      },
    ],
  },
  {
    id: "work-done",
    title: "Work Done & Energy",
    titleZh: "做功與能量",
    category: "Mechanics",
    categoryZh: "力學",
    color: "orange",
    accentColor: "#f97316",
    icon: "⚙️",
    summary:
      "Work is done when a force causes displacement in the direction of the force. Energy is the capacity to do work. The work-energy theorem states that the net work done on an object equals its change in kinetic energy.",
    summaryZh:
      "當力使物體沿力的方向產生位移時，即做了功。能量是做功的能力。功能定理指出，對物體做的合功等於其動能的變化。",
    keyPoints: [
      {
        en: "Work done W = Fs cos θ, where θ is the angle between force and displacement.",
        zh: "做功 W = Fs cos θ，其中 θ 是力與位移之間的夾角。",
      },
      {
        en: "If force is perpendicular to displacement (θ = 90°), no work is done.",
        zh: "若力與位移垂直（θ = 90°），則不做功。",
      },
      {
        en: "Kinetic energy (KE) = ½mv², where m = mass, v = speed.",
        zh: "動能（KE）= ½mv²，其中 m = 質量，v = 速度。",
      },
      {
        en: "Gravitational potential energy (GPE) = mgh, where h = height above reference level.",
        zh: "重力勢能（GPE）= mgh，其中 h = 距參考水平的高度。",
      },
      {
        en: "Law of Conservation of Energy: energy cannot be created or destroyed, only converted.",
        zh: "能量守恆定律：能量不能被創造或消滅，只能轉換形式。",
      },
      {
        en: "Power P = W/t = Fv, unit: Watt (W) = J/s.",
        zh: "功率 P = W/t = Fv，單位：瓦特（W）= 焦耳/秒。",
      },
      {
        en: "Efficiency = (useful energy output / total energy input) × 100%.",
        zh: "效率 = （有用能量輸出 / 總能量輸入）× 100%。",
      },
    ],
    formulas: [
      {
        latex: "W = Fs\\cos\\theta",
        description: "Work done: F = force (N), s = displacement (m), θ = angle between F and s",
        descriptionZh: "做功：F = 力（牛頓），s = 位移（米），θ = 力與位移夾角",
        symbols: [
          { symbol: "W", meaning: "Work done", meaningZh: "做的功", unit: "Joule (J)" },
          { symbol: "F", meaning: "Applied force", meaningZh: "施加的力", unit: "Newton (N)" },
          { symbol: "s", meaning: "Displacement (distance moved in direction of motion)", meaningZh: "位移（沿運動方向移動的距離）", unit: "metre (m)" },
          { symbol: "θ", meaning: "Angle between the force F and the displacement s", meaningZh: "力 F 與位移 s 之間的夾角", unit: "degrees (°)" },
        ],
      },
      {
        latex: "KE = \\frac{1}{2}mv^2",
        description: "Kinetic energy of a moving object",
        descriptionZh: "運動物體的動能",
        symbols: [
          { symbol: "KE", meaning: "Kinetic energy", meaningZh: "動能", unit: "Joule (J)" },
          { symbol: "m", meaning: "Mass of the object", meaningZh: "物體的質量", unit: "kilogram (kg)" },
          { symbol: "v", meaning: "Speed of the object", meaningZh: "物體的速度", unit: "m/s" },
        ],
      },
      {
        latex: "GPE = mgh",
        description: "Gravitational potential energy",
        descriptionZh: "重力勢能",
        symbols: [
          { symbol: "GPE", meaning: "Gravitational potential energy", meaningZh: "重力勢能", unit: "Joule (J)" },
          { symbol: "m", meaning: "Mass", meaningZh: "質量", unit: "kilogram (kg)" },
          { symbol: "g", meaning: "Gravitational field strength (≈ 10 N/kg on Earth)", meaningZh: "重力場強度（地球上 ≈ 10 N/kg）", unit: "N/kg" },
          { symbol: "h", meaning: "Height above the chosen reference level", meaningZh: "距所選參考水平的高度", unit: "metre (m)" },
        ],
      },
      {
        latex: "W_{net} = \\Delta KE = KE_f - KE_i",
        description: "Work-energy theorem: net work equals change in kinetic energy",
        descriptionZh: "功能定理：合功等於動能的變化",
        symbols: [
          { symbol: "W_net", meaning: "Net work done on the object", meaningZh: "對物體做的合功", unit: "Joule (J)" },
          { symbol: "ΔKE", meaning: "Change in kinetic energy", meaningZh: "動能的變化", unit: "Joule (J)" },
          { symbol: "KE_f", meaning: "Final kinetic energy", meaningZh: "末動能", unit: "Joule (J)" },
          { symbol: "KE_i", meaning: "Initial kinetic energy", meaningZh: "初動能", unit: "Joule (J)" },
        ],
      },
      {
        latex: "P = \\frac{W}{t} = Fv",
        description: "Power: rate of doing work",
        descriptionZh: "功率：做功的速率",
        symbols: [
          { symbol: "P", meaning: "Power", meaningZh: "功率", unit: "Watt (W) = J/s" },
          { symbol: "W", meaning: "Work done (energy transferred)", meaningZh: "做的功（轉移的能量）", unit: "Joule (J)" },
          { symbol: "t", meaning: "Time taken", meaningZh: "所用時間", unit: "second (s)" },
          { symbol: "F", meaning: "Force applied", meaningZh: "施加的力", unit: "Newton (N)" },
          { symbol: "v", meaning: "Velocity of the object", meaningZh: "物體的速度", unit: "m/s" },
        ],
      },
      {
        latex: "\\eta = \\frac{W_{useful}}{W_{input}} \\times 100\\%",
        description: "Efficiency (always ≤ 100% due to energy losses)",
        descriptionZh: "效率（因能量損耗，永遠 ≤ 100%）",
        symbols: [
          { symbol: "η (eta)", meaning: "Efficiency", meaningZh: "效率", unit: "% (percentage)" },
          { symbol: "W_useful", meaning: "Useful energy/work output", meaningZh: "有用能量/功輸出", unit: "Joule (J)" },
          { symbol: "W_input", meaning: "Total energy/work input", meaningZh: "總能量/功輸入", unit: "Joule (J)" },
        ],
      },
    ],
    examTips: [
      {
        en: "Work done by friction is always negative (opposing motion).",
        zh: "摩擦力做的功永遠是負值（阻礙運動）。",
      },
      {
        en: "When using energy conservation: KE + GPE = constant (if no friction/air resistance).",
        zh: "使用能量守恆時：KE + GPE = 常數（若無摩擦力/空氣阻力）。",
      },
    ],
  },

  // ─── HEAT ─────────────────────────────────────────────────────────────────
  {
    id: "heat",
    title: "Heat & Temperature",
    titleZh: "熱與溫度",
    category: "Heat",
    categoryZh: "熱學",
    color: "red",
    accentColor: "#ef4444",
    icon: "🌡️",
    summary:
      "Heat is a form of energy that flows from a region of higher temperature to lower temperature. Temperature measures the average kinetic energy of particles in a substance.",
    summaryZh:
      "熱是從高溫區域流向低溫區域的能量形式。溫度衡量物質中粒子的平均動能。",
    keyPoints: [
      {
        en: "Heat flows from hot to cold until thermal equilibrium is reached.",
        zh: "熱量從熱處流向冷處，直至達到熱平衡。",
      },
      {
        en: "Specific heat capacity (c): energy needed to raise 1 kg of substance by 1°C.",
        zh: "比熱容（c）：使 1 千克物質升高 1°C 所需的能量。",
      },
      {
        en: "Specific latent heat (L): energy needed to change state of 1 kg without temperature change.",
        zh: "比潛熱（L）：使 1 千克物質改變狀態而溫度不變所需的能量。",
      },
      {
        en: "Three methods of heat transfer: conduction, convection, radiation.",
        zh: "三種熱傳遞方式：傳導、對流、輻射。",
      },
      {
        en: "Conduction: transfer through direct contact (mainly in solids).",
        zh: "傳導：通過直接接觸傳遞（主要在固體中）。",
      },
      {
        en: "Convection: transfer through fluid movement (liquids and gases).",
        zh: "對流：通過流體運動傳遞（液體和氣體）。",
      },
      {
        en: "Radiation: transfer through electromagnetic waves (no medium needed).",
        zh: "輻射：通過電磁波傳遞（不需要介質）。",
      },
      {
        en: "Thermal expansion: most substances expand when heated.",
        zh: "熱膨脹：大多數物質受熱後膨脹。",
      },
    ],
    formulas: [
      {
        latex: "Q = mc\\Delta T",
        description: "Heat energy transferred during temperature change",
        descriptionZh: "溫度變化過程中傳遞的熱能",
        symbols: [
          { symbol: "Q", meaning: "Heat energy transferred", meaningZh: "傳遞的熱能", unit: "Joule (J)" },
          { symbol: "m", meaning: "Mass of the substance", meaningZh: "物質的質量", unit: "kilogram (kg)" },
          { symbol: "c", meaning: "Specific heat capacity of the substance", meaningZh: "物質的比熱容", unit: "J/(kg·°C)" },
          { symbol: "ΔT", meaning: "Change in temperature (T_final − T_initial)", meaningZh: "溫度變化（末溫 − 初溫）", unit: "°C or K" },
        ],
      },
      {
        latex: "Q = mL",
        description: "Heat energy during change of state (temperature stays constant)",
        descriptionZh: "相變過程中的熱能（溫度保持不變）",
        symbols: [
          { symbol: "Q", meaning: "Heat energy absorbed or released", meaningZh: "吸收或釋放的熱能", unit: "Joule (J)" },
          { symbol: "m", meaning: "Mass of substance changing state", meaningZh: "發生相變的物質質量", unit: "kilogram (kg)" },
          { symbol: "L", meaning: "Specific latent heat (of fusion or vaporisation)", meaningZh: "比潛熱（熔化潛熱或汽化潛熱）", unit: "J/kg" },
        ],
      },
      {
        latex: "T(K) = T(°C) + 273",
        description: "Converting Celsius to Kelvin",
        descriptionZh: "攝氏度換算為開爾文",
        symbols: [
          { symbol: "T(K)", meaning: "Temperature in Kelvin (absolute temperature)", meaningZh: "開爾文溫度（絕對溫度）", unit: "Kelvin (K)" },
          { symbol: "T(°C)", meaning: "Temperature in Celsius", meaningZh: "攝氏溫度", unit: "Celsius (°C)" },
          { symbol: "273", meaning: "Conversion constant (0°C = 273 K)", meaningZh: "換算常數（0°C = 273 K）", unit: "K" },
        ],
      },
    ],
    examTips: [
      {
        en: "During a change of state, temperature remains CONSTANT even though heat is being added.",
        zh: "相變過程中，即使持續加熱，溫度保持不變。",
      },
      {
        en: "Heat gained = Heat lost in calorimetry problems (conservation of energy).",
        zh: "量熱法問題：吸收的熱量 = 放出的熱量（能量守恆）。",
      },
    ],
  },

  // ─── WAVES ────────────────────────────────────────────────────────────────
  {
    id: "waves",
    title: "Waves",
    titleZh: "波",
    category: "Waves",
    categoryZh: "波動",
    color: "purple",
    accentColor: "#a855f7",
    icon: "〰️",
    summary:
      "Waves are disturbances that transfer energy without transferring matter. They can be transverse (vibration perpendicular to propagation) or longitudinal (vibration parallel to propagation).",
    summaryZh:
      "波是傳遞能量而不傳遞物質的擾動。波可以是橫波（振動方向垂直於傳播方向）或縱波（振動方向平行於傳播方向）。",
    keyPoints: [
      {
        en: "Transverse waves: vibration perpendicular to direction of propagation (e.g., light, water waves).",
        zh: "橫波：振動方向垂直於傳播方向（如光波、水波）。",
      },
      {
        en: "Longitudinal waves: vibration parallel to direction of propagation (e.g., sound).",
        zh: "縱波：振動方向平行於傳播方向（如聲波）。",
      },
      {
        en: "Amplitude (A): maximum displacement from equilibrium position.",
        zh: "振幅（A）：從平衡位置的最大位移。",
      },
      {
        en: "Wavelength (λ): distance between two adjacent points in phase (e.g., crest to crest).",
        zh: "波長（λ）：兩個相鄰同相位點之間的距離（如波峰到波峰）。",
      },
      {
        en: "Frequency (f): number of complete oscillations per second, unit: Hz.",
        zh: "頻率（f）：每秒完整振動的次數，單位：赫茲（Hz）。",
      },
      {
        en: "Period (T): time for one complete oscillation; T = 1/f.",
        zh: "週期（T）：完成一次完整振動所需的時間；T = 1/f。",
      },
      {
        en: "Wave speed v = fλ — this is the wave equation.",
        zh: "波速 v = fλ——這是波動方程。",
      },
      {
        en: "Reflection, refraction, diffraction, and interference are properties of all waves.",
        zh: "反射、折射、衍射和干涉是所有波的特性。",
      },
    ],
    formulas: [
      {
        latex: "v = f\\lambda",
        description: "Wave equation: relates wave speed, frequency, and wavelength",
        descriptionZh: "波動方程：聯繫波速、頻率和波長",
        symbols: [
          { symbol: "v", meaning: "Wave speed (depends on the medium)", meaningZh: "波速（取決於介質）", unit: "m/s" },
          { symbol: "f", meaning: "Frequency of the wave", meaningZh: "波的頻率", unit: "Hertz (Hz) = s⁻¹" },
          { symbol: "λ (lambda)", meaning: "Wavelength (distance between two consecutive crests)", meaningZh: "波長（兩個相鄰波峰之間的距離）", unit: "metre (m)" },
        ],
      },
      {
        latex: "T = \\frac{1}{f}",
        description: "Period is the reciprocal of frequency",
        descriptionZh: "週期是頻率的倒數",
        symbols: [
          { symbol: "T", meaning: "Period (time for one complete oscillation)", meaningZh: "週期（完成一次完整振動的時間）", unit: "second (s)" },
          { symbol: "f", meaning: "Frequency", meaningZh: "頻率", unit: "Hertz (Hz)" },
        ],
      },
      {
        latex: "f = \\frac{1}{T}",
        description: "Frequency is the reciprocal of period",
        descriptionZh: "頻率是週期的倒數",
        symbols: [
          { symbol: "f", meaning: "Frequency", meaningZh: "頻率", unit: "Hertz (Hz)" },
          { symbol: "T", meaning: "Period", meaningZh: "週期", unit: "second (s)" },
        ],
      },
    ],
    examTips: [
      {
        en: "Wave speed depends on the MEDIUM, not the frequency.",
        zh: "波速取決於介質，而非頻率。",
      },
      {
        en: "When a wave enters a new medium: frequency stays the same; speed and wavelength change.",
        zh: "波進入新介質時：頻率不變；速度和波長改變。",
      },
    ],
  },
  {
    id: "double-slit",
    title: "Double Slit Experiment",
    titleZh: "雙縫實驗",
    category: "Waves",
    categoryZh: "波動",
    color: "purple",
    accentColor: "#a855f7",
    icon: "🔬",
    summary:
      "Young's double slit experiment demonstrates the wave nature of light through interference. Coherent light passing through two narrow slits creates an alternating pattern of bright and dark fringes on a screen.",
    summaryZh:
      "楊氏雙縫實驗通過干涉現象展示光的波動性。相干光通過兩個窄縫後，在屏幕上形成明暗相間的條紋圖案。",
    keyPoints: [
      {
        en: "Constructive interference (bright fringe): path difference = nλ (n = 0, 1, 2, ...).",
        zh: "相長干涉（亮條紋）：路程差 = nλ（n = 0, 1, 2, ...）。",
      },
      {
        en: "Destructive interference (dark fringe): path difference = (n + ½)λ.",
        zh: "相消干涉（暗條紋）：路程差 = (n + ½)λ。",
      },
      {
        en: "Fringe spacing Δy = λD/d, where D = distance to screen, d = slit separation.",
        zh: "條紋間距 Δy = λD/d，其中 D = 到屏幕的距離，d = 縫間距。",
      },
      {
        en: "Increasing wavelength → wider fringe spacing.",
        zh: "增大波長 → 條紋間距增大。",
      },
      {
        en: "Increasing slit separation → narrower fringe spacing.",
        zh: "增大縫間距 → 條紋間距減小。",
      },
      {
        en: "Increasing distance to screen → wider fringe spacing.",
        zh: "增大到屏幕的距離 → 條紋間距增大。",
      },
      {
        en: "Coherent sources required: same frequency, constant phase difference.",
        zh: "需要相干光源：頻率相同，相位差恆定。",
      },
    ],
    formulas: [
      {
        latex: "\\Delta y = \\frac{\\lambda D}{d}",
        description: "Fringe spacing in Young's double slit experiment",
        descriptionZh: "楊氏雙縫實驗的條紋間距",
        symbols: [
          { symbol: "Δy", meaning: "Fringe spacing (distance between adjacent bright fringes)", meaningZh: "條紋間距（相鄰亮條紋之間的距離）", unit: "metre (m)" },
          { symbol: "λ (lambda)", meaning: "Wavelength of the light used", meaningZh: "所用光的波長", unit: "metre (m)" },
          { symbol: "D", meaning: "Distance from the double slits to the screen", meaningZh: "雙縫到屏幕的距離", unit: "metre (m)" },
          { symbol: "d", meaning: "Separation between the two slits", meaningZh: "兩縫之間的間距", unit: "metre (m)" },
        ],
      },
      {
        latex: "\\text{Path difference} = n\\lambda \\quad (\\text{constructive})",
        description: "Condition for bright fringes (constructive interference)",
        descriptionZh: "亮條紋條件（相長干涉）",
        symbols: [
          { symbol: "n", meaning: "Order number (0, 1, 2, 3, ...)", meaningZh: "級次（0, 1, 2, 3, ...）", unit: "dimensionless 無單位" },
          { symbol: "λ", meaning: "Wavelength", meaningZh: "波長", unit: "metre (m)" },
        ],
      },
      {
        latex: "\\text{Path difference} = \\left(n+\\frac{1}{2}\\right)\\lambda \\quad (\\text{destructive})",
        description: "Condition for dark fringes (destructive interference)",
        descriptionZh: "暗條紋條件（相消干涉）",
        symbols: [
          { symbol: "n", meaning: "Order number (0, 1, 2, 3, ...)", meaningZh: "級次（0, 1, 2, 3, ...）", unit: "dimensionless 無單位" },
          { symbol: "λ", meaning: "Wavelength", meaningZh: "波長", unit: "metre (m)" },
        ],
      },
    ],
    examTips: [
      {
        en: "Δy = λD/d — know how each variable affects fringe spacing.",
        zh: "Δy = λD/d——了解每個變量如何影響條紋間距。",
      },
      {
        en: "Central bright fringe is at the centre; bright fringes are equally spaced.",
        zh: "中央亮條紋在中心；亮條紋等間距分佈。",
      },
    ],
  },
  {
    id: "diffraction",
    title: "Diffraction",
    titleZh: "衍射",
    category: "Waves",
    categoryZh: "波動",
    color: "purple",
    accentColor: "#a855f7",
    icon: "🌊",
    summary:
      "Diffraction is the spreading of waves as they pass through a gap or around an obstacle. The effect is most pronounced when the wavelength is comparable to the size of the gap.",
    summaryZh:
      "衍射是波通過縫隙或繞過障礙物時擴散的現象。當波長與縫隙大小相近時，衍射效果最明顯。",
    keyPoints: [
      {
        en: "Diffraction occurs for all types of waves (light, sound, water waves).",
        zh: "所有類型的波都會發生衍射（光波、聲波、水波）。",
      },
      {
        en: "Maximum diffraction occurs when gap width ≈ wavelength.",
        zh: "當縫隙寬度 ≈ 波長時，衍射效果最大。",
      },
      {
        en: "Narrower gap → more diffraction (more spreading).",
        zh: "縫隙越窄 → 衍射越明顯（擴散越多）。",
      },
      {
        en: "Longer wavelength → more diffraction for a given gap size.",
        zh: "波長越長 → 對於給定縫隙大小，衍射越明顯。",
      },
      {
        en: "Single slit diffraction produces a central bright maximum with narrower secondary maxima.",
        zh: "單縫衍射產生一個中央主極大，兩側有較窄的次極大。",
      },
      {
        en: "Sound diffracts easily around corners because its wavelength (cm to m) is comparable to everyday objects.",
        zh: "聲音容易繞過角落衍射，因為其波長（厘米到米）與日常物體大小相近。",
      },
      {
        en: "Light has very short wavelength (~500 nm), so diffraction is only noticeable through very narrow slits.",
        zh: "光的波長很短（約500納米），因此只有通過非常窄的縫隙才能觀察到衍射。",
      },
    ],
    formulas: [
      {
        latex: "\\text{Diffraction} \\propto \\frac{\\lambda}{d}",
        description: "Diffraction effect increases as wavelength (λ) increases or gap width (d) decreases",
        descriptionZh: "衍射效果隨波長（λ）增大或縫隙寬度（d）減小而增強",
        symbols: [
          { symbol: "λ (lambda)", meaning: "Wavelength of the wave", meaningZh: "波的波長", unit: "metre (m)" },
          { symbol: "d", meaning: "Width of the gap or aperture", meaningZh: "縫隙或孔徑的寬度", unit: "metre (m)" },
        ],
      },
    ],
    examTips: [
      {
        en: "Diffraction ≠ refraction. Diffraction = spreading around obstacles; refraction = bending due to speed change.",
        zh: "衍射 ≠ 折射。衍射 = 繞過障礙物擴散；折射 = 因速度改變而彎曲。",
      },
      {
        en: "After diffraction, frequency and speed do NOT change — only the direction of propagation changes.",
        zh: "衍射後，頻率和速度不變——只有傳播方向改變。",
      },
    ],
  },
];

// Expand the original core notes into the complete DSE Force and Motion and
// Heat and Gases coverage. The data is kept in a focused module so that the
// original topics remain easy to maintain.
applyExistingTopicEnhancements(topics);
topics.push(...expandedTopics);
formulaSheet.push(...existingFormulaSheetAdditions, ...expandedFormulaSheet);
applyDetailedLessons(topics, formulaSheet);

export const categories = [
  { id: "all", label: "All Topics", labelZh: "所有主題", color: "white" },
  { id: "Optics", label: "Optics", labelZh: "光學", color: "cyan" },
  { id: "Mechanics", label: "Mechanics", labelZh: "力學", color: "orange" },
  { id: "Heat", label: "Heat", labelZh: "熱學", color: "red" },
  { id: "Waves", label: "Waves", labelZh: "波動", color: "purple" },
];
