import type { LessonBundle, LessonFormula } from '../lesson-types';

// Source findings verified by reading the linked documents, not search snippets.
// [1] HKEAA C2 gives d sin(theta) = n lambda; its small-angle relation is conditional.
// [2] OpenStax explains coherent multi-slit interference, sharp principal maxima,
//     adjacent-ray path difference, and screen trigonometry.
// [3] Brooklyn College specifies a collimator, normal grating alignment, both-side
//     readings, repeated zero readings, and averaging measured diffraction angles.
// [4] Institute of Physics specifies clamping the laser towards a screen and
//     keeping eyes and shiny objects out of the beam path.
// All numerical examples and practice data below are original; values calculated
// with Python. No question or suggested mark allocation is an official past paper.

const formulas: LessonFormula[] = [
  {
    name: 'Normal-incidence grating equation',
    nameZh: '垂直入射的光柵方程',
    latex: 'd\\sin\\theta=n\\lambda,\\qquad n\\in\\mathbb{Z},\\quad |n|\\lambda\\le d',
    description: 'For coherent monochromatic light incident normally on a grating, a principal maximum occurs when the adjacent-slit path difference is an integer number of wavelengths. Here n is a signed, dimensionless order number, NOT amount of substance in moles and NOT refractive index. The angle θ is signed and measured from the central axis (the grating normal); −90° ≤ θ ≤ 90°. For an ordinary downstream screen require |n|λ < d. When discussing a magnitude, write q = |n| and use the positive angle on either side. The zero order has n = 0 and θ = 0, and cannot determine d or λ.',
    descriptionZh: '相干單色光垂直入射光柵時，若相鄰狹縫的光程差為波長的整數倍，便形成主極大。此處 n 是帶正負號且無單位的級數，不是以 mol 為單位的物質的量，也不是折射率。θ 是從中央軸（光柵法線）量起的帶正負號角度，範圍為 −90° 至 90°。普通下游屏幕的光點須滿足 |n|λ < d；等號是掠射界限。討論級數大小時可用 q = |n|，並用任一側的正角度。零級 n = 0 對應 θ = 0，不能用它獨立求 d 或 λ。',
    symbols: [
      { symbol: 'd', meaning: 'Positive centre-to-centre spacing of adjacent grating slits; not the slit width', meaningZh: '相鄰光柵狹縫的正中心間距；不是狹縫闊度', unit: 'm' },
      { symbol: 'θ', meaning: 'Signed diffraction angle from the central axis; n and θ have the same sign for a non-zero order', meaningZh: '從中央軸量起的帶正負號衍射角；非零級時與 n 同號', unit: 'degrees (°), or radians with a consistent calculator mode' },
      { symbol: 'n', meaning: 'Signed integer order: 0, ±1, ±2, …; only orders with |n|λ ≤ d are geometrically allowed', meaningZh: '帶正負號整數級數：0、±1、±2……；只有 |n|λ ≤ d 的級數在幾何上容許', unit: 'dimensionless integer (not mol)' },
      { symbol: 'λ', meaning: 'Positive wavelength of the monochromatic light in the propagation medium', meaningZh: '單色光在傳播介質中的正波長', unit: 'm' },
    ],
    rearrangements: [
      { target: 'θ', latex: '\\theta=\\sin^{-1}\\!\\left(\\frac{n\\lambda}{d}\\right)', note: 'Use a specified integer n and d > 0, λ > 0. A real angle requires |n|λ/d ≤ 1; equality means grazing, not a finite downstream-screen spot. n = 0 gives θ = 0.', noteZh: '須指定整數 n，且 d、λ 均為正值。只有 |n|λ/d ≤ 1 才有實角；等號表示掠射，並非有限下游屏幕上的光點。n = 0 時 θ = 0。' },
      { target: 'λ', latex: '\\lambda=\\frac{d\\sin\\theta}{n}', note: 'Only a known non-zero integer order can determine λ. The angle must be from the central axis, its sign must match n, and the result must be positive and satisfy |n|λ ≤ d.', noteZh: '只有已知的非零整數級數才可求 λ。角度須從中央軸量起，符號須與 n 相同，所得波長須為正並滿足 |n|λ ≤ d。' },
      { target: 'd', latex: 'd=\\frac{n\\lambda}{\\sin\\theta}', note: 'Requires a non-zero integer n and non-zero sin θ, with matching signs. The resulting d must be positive and at least |n|λ; a finite downstream-screen spot requires strict inequality.', noteZh: '須有非零整數 n 及非零 sin θ，兩者須同號。所得 d 須為正且不小於 |n|λ；有限下游屏幕的光點須用嚴格大於。' },
      { target: 'n', latex: 'n=\\frac{d\\sin\\theta}{\\lambda}\\in\\mathbb{Z}', note: 'An exact order is an integer, not a continuously adjustable quantity. With ideal data a non-integer result is not an order. With measured data identify a nearby integer only if uncertainty supports it; do not blindly round. Also require |n|λ ≤ d.', noteZh: '真實級數必須是整數，不是可連續調整的量。理想數據給出非整數時，它不是容許級數；實驗數據只有在不確定度支持時才可判定相近整數，不能盲目四捨五入。仍須滿足 |n|λ ≤ d。' },
    ],
  },
  {
    name: 'Grating spacing from line density',
    nameZh: '由線密度求光柵間距',
    latex: 'd=\\frac{1}{L}',
    description: 'L is the number of grating lines per metre, not the total number of illuminated lines. Convert a quoted numerical density in lines/mm to lines/m by multiplying it by 1000, then take the reciprocal. The constant 1 is dimensionless; line counts are dimensionless. This conversion is independent of order, but a proposed integer order n must still satisfy |n|λ ≤ d in the grating equation.',
    descriptionZh: 'L 是每米的光柵線數，不是被照亮的總線數。若題目以 lines/mm 給出線密度，先把數值乘以 1000 換成 lines/m，再取倒數。常數 1 及線數均無單位。此換算本身不依賴級數，但任何指定整數級數 n 仍須在光柵方程中滿足 |n|λ ≤ d。',
    symbols: [
      { symbol: 'd', meaning: 'Positive centre-to-centre grating spacing', meaningZh: '相鄰光柵線的正中心間距', unit: 'm' },
      { symbol: 'L', meaning: 'Positive line density in SI units; 600 lines/mm is 600000 lines/m', meaningZh: '以 SI 單位表示的正線密度；600 lines/mm 即 600000 lines/m', unit: 'lines/m (m⁻¹)' },
    ],
    rearrangements: [
      { target: 'd', latex: 'd=\\frac{1}{L}', note: 'Use L > 0 in lines/m to obtain d in m. Check each requested integer order separately using |n|λ ≤ d.', noteZh: '用以 lines/m 表示的正 L，才得到以 m 表示的 d。每個指定整數級數均須另行檢查 |n|λ ≤ d。' },
      { target: 'L', latex: 'L=\\frac{1}{d}', note: 'Use d > 0 in m to obtain lines/m; divide the numerical result by 1000 for lines/mm. This identity does not establish which integer orders exist.', noteZh: '用以 m 表示的正 d，便得到 lines/m；數值除以 1000 才是 lines/mm。此倒數關係本身不能決定哪些整數級數存在。' },
    ],
  },
  {
    name: 'Angle from a symmetric opposite-order pair',
    nameZh: '由對稱的正負級光點求角度',
    latex: '\\theta_q=\\frac{\\Delta\\alpha_q}{2},\\qquad q=1,2,3,\\ldots',
    description: 'At normal incidence, the +q and −q maxima of the same wavelength have equal angular magnitudes. Δαq is their full angular separation through the central direction, found by correctly unwrapping instrument readings if they cross 0°/360°. θq is half this separation, not the full separation. This is a symmetry identity, not an independent way to solve d or λ without a known non-zero integer q.',
    descriptionZh: '垂直入射時，同一波長的 +q 與 −q 主極大有相等的角度大小。Δαq 是兩方向經中央方向的完整角距；若儀器讀數跨越 0°/360°，須先正確展開讀數。θq 是此角距的一半，不是完整角距。這是對稱關係；若沒有已知非零整數 q，不能用它獨立求 d 或 λ。',
    symbols: [
      { symbol: 'θq', meaning: 'Positive angle from the central axis to either member of the order-q pair; 0 < θq ≤ 90°', meaningZh: '中央軸至 q 級任一側方向的正角度；0 < θq ≤ 90°', unit: 'degrees (°)' },
      { symbol: 'Δαq', meaning: 'Full angular separation through the central direction between the same-wavelength +q and −q maxima', meaningZh: '同波長 +q 與 −q 主極大經中央方向的完整角距', unit: 'degrees (°)' },
      { symbol: 'q', meaning: 'Known positive integer order magnitude |n|, allowed only when qλ ≤ d', meaningZh: '已知正整數級數大小 |n|；只有 qλ ≤ d 才容許', unit: 'dimensionless positive integer' },
    ],
    rearrangements: [
      { target: 'θq', latex: '\\theta_q=\\frac{\\Delta\\alpha_q}{2}', note: 'Both readings must refer to the same positive integer q and wavelength, under normal incidence. For a finite screen require qλ < d. The 2 is a fixed dimensionless symmetry factor.', noteZh: '兩讀數須屬同一正整數 q 及同一波長，且須垂直入射。有限屏幕須滿足 qλ < d。2 是固定且無單位的對稱因子。' },
      { target: 'Δαq', latex: '\\Delta\\alpha_q=2\\theta_q', note: 'This is the full opposite-pair angle, not the angle to substitute for θ in the grating equation. q is a given discrete label; the identity cannot solve q.', noteZh: '這是正負光點的完整角距，不可當作光柵方程中的 θ。q 是已指定的離散標籤，不能由此恆等關係求出 q。' },
    ],
  },
  {
    name: 'Exact screen geometry',
    nameZh: '精確屏幕幾何關係',
    latex: '\\tan\\theta_q=\\frac{x_q}{D}',
    description: 'For a flat screen perpendicular to the central axis, D is the axial distance from grating to screen and xq is the positive transverse displacement from the zero-order spot to one order-q spot. Use exact trigonometry. This assumes the usual far-field grating pattern, so the order direction is well defined. q is a given positive integer with qλ < d; grazing rays never reach a finite point on this screen. Geometry alone cannot identify q, d, or λ.',
    descriptionZh: '屏幕須是垂直中央軸的平面。D 是光柵至屏幕沿中央軸的距離，xq 是零級光點至單側 q 級光點的正橫向位移。使用精確三角關係，並假設處於通常的遠場光柵條件，級數方向已有明確定義。q 是已指定且滿足 qλ < d 的正整數；掠射光線不能到達此屏幕的有限位置。單靠幾何不能辨認 q，也不能求 d 或 λ。',
    symbols: [
      { symbol: 'θq', meaning: 'Positive diffraction angle of a known order q from the central axis, below 90°', meaningZh: '已知 q 級從中央軸量起且小於 90° 的正衍射角', unit: 'degrees (°)' },
      { symbol: 'xq', meaning: 'Positive centre-to-one-spot transverse displacement, not the full +q to −q distance', meaningZh: '中央光點至單側光點的正橫向位移，不是 +q 至 −q 的完整距離', unit: 'm' },
      { symbol: 'D', meaning: 'Positive axial grating-to-screen distance; not the slant ray length', meaningZh: '光柵至屏幕的正軸向距離，不是斜光路長度', unit: 'm' },
      { symbol: 'q', meaning: 'Given positive integer order with qλ < d for this finite downstream screen', meaningZh: '已指定正整數級數；此有限下游屏幕須有 qλ < d', unit: 'dimensionless positive integer' },
    ],
    rearrangements: [
      { target: 'θq', latex: '\\theta_q=\\tan^{-1}\\!\\left(\\frac{x_q}{D}\\right)', note: 'Use D > 0 and xq > 0 in the same length unit. θq must be below 90° and must agree with a physically available integer q in the grating equation.', noteZh: 'D、xq 均須為正且使用相同長度單位。θq 須小於 90°，並須符合光柵方程中實際容許的整數 q。' },
      { target: 'xq', latex: 'x_q=D\\tan\\theta_q', note: 'For a known available positive integer q and 0 < θq < 90°. Do not replace tan θq by sin θq without a justified small-angle condition.', noteZh: '用於已知且容許的正整數 q，並須有 0 < θq < 90°。沒有合理小角度條件時，不能把 tan θq 換成 sin θq。' },
      { target: 'D', latex: 'D=\\frac{x_q}{\\tan\\theta_q}', note: 'Requires a non-zero spot displacement and a known non-zero angle below 90°. The zero-order identity x = 0 at θ = 0 cannot determine D. q remains a given discrete label.', noteZh: '須有非零位移及已知非零且小於 90° 的角度。零級 x = 0、θ = 0 的關係不能求 D。q 仍是已指定的離散標籤。' },
    ],
  },
  {
    name: 'Highest geometrically allowed order magnitude',
    nameZh: '幾何上容許的最高級數大小',
    latex: 'q_{\\max}=\\left\\lfloor\\frac{d}{\\lambda}\\right\\rfloor',
    description: 'Because |sin θ| cannot exceed 1, an order magnitude q must be a non-negative integer with qλ ≤ d. The floor symbol means take the greatest integer not exceeding d/λ, never round to the nearest integer. This is an ideal geometric bound, not a guarantee that every allowed peak is bright or observable. If d/λ is exactly an integer, that boundary order is at 90° (grazing); exclude it when counting finite spots on a downstream screen. For that screen, only qλ < d is allowed.',
    descriptionZh: '因 |sin θ| 不可大於 1，級數大小 q 必須是滿足 qλ ≤ d 的非負整數。向下取整符號表示取不大於 d/λ 的最大整數，不能四捨五入。這是理想幾何上限，並不保證每個容許主極大都足夠亮或可觀察。若 d/λ 恰為整數，該邊界級數位於 90°，屬掠射；計算下游有限屏幕上的光點數目時須排除它。該屏幕只容許 qλ < d。',
    symbols: [
      { symbol: 'qmax', meaning: 'Greatest non-negative integer order magnitude geometrically allowed, including a possible grazing boundary', meaningZh: '幾何上容許的最大非負整數級數大小，包括可能的掠射邊界', unit: 'dimensionless non-negative integer' },
      { symbol: 'd', meaning: 'Positive grating spacing', meaningZh: '正光柵間距', unit: 'm' },
      { symbol: 'λ', meaning: 'Positive wavelength', meaningZh: '正波長', unit: 'm' },
    ],
    rearrangements: [
      { target: 'qmax', latex: 'q_{\\max}=\\left\\lfloor d/\\lambda\\right\\rfloor', note: 'Use positive d and λ in the same length unit. Check an exact integer ratio for a grazing boundary; actual finite-screen order count may be one lower.', noteZh: 'd、λ 均須為正且使用相同長度單位。若比值恰為整數，須檢查掠射邊界；有限屏幕的最高級數可能低一級。' },
      { target: 'd (range only)', latex: 'q_{\\max}\\lambda\\le d<(q_{\\max}+1)\\lambda', note: 'A given non-negative integer qmax and λ determine a range, not a unique d. Also require d > 0; at the lower equality for qmax ≥ 1 the boundary order grazes the grating.', noteZh: '指定非負整數 qmax 及 λ 只能求出 d 的範圍，不能求唯一 d。另須 d > 0；qmax ≥ 1 時，下界等號對應該級數掠射。' },
      { target: 'λ (range only)', latex: '\\frac{d}{q_{\\max}+1}<\\lambda\\le\\frac{d}{q_{\\max}}\\quad(q_{\\max}\\ge1);\\qquad \\lambda>d\\quad(q_{\\max}=0)', note: 'The floor operation loses information: an integer qmax and d determine only a wavelength interval. qmax = 0 must be handled separately to avoid division by zero. Upper equality for qmax ≥ 1 is the grazing case.', noteZh: '向下取整會失去資訊：整數 qmax 及 d 只能決定波長區間。qmax = 0 須另行處理，以免除以零。qmax ≥ 1 時，上界等號是掠射情況。' },
    ],
  },
  {
    name: 'First–second order comparison',
    nameZh: '第一級與第二級比較',
    latex: '\\sin\\theta_2=2\\sin\\theta_1',
    description: 'For the same wavelength and grating at normal incidence, compare the positive-angle magnitudes of q = 1 and q = 2. It is the sine of the angle that doubles, not generally the angle itself. Both orders must exist: 2λ ≤ d geometrically, or 2λ < d for two finite-screen spots. The fixed dimensionless factor 2 is the second-to-first order ratio. This relation contains no independent d or λ information.',
    descriptionZh: '同一波長、同一光柵且垂直入射時，比較 q = 1 與 q = 2 的正角度大小。加倍的是角度的正弦值，不是一般情況下的角度本身。兩級均須存在：幾何上須有 2λ ≤ d；若要兩個有限屏幕光點，則須 2λ < d。固定且無單位的 2 是第二級與第一級的級數比。此關係沒有獨立的 d 或 λ 資訊。',
    symbols: [
      { symbol: 'θ1', meaning: 'Positive first-order angle (q = 1)', meaningZh: '第一級（q = 1）的正角度', unit: 'degrees (°)' },
      { symbol: 'θ2', meaning: 'Positive second-order angle (q = 2), existing only if 2λ ≤ d', meaningZh: '第二級（q = 2）的正角度；只有 2λ ≤ d 才存在', unit: 'degrees (°)' },
    ],
    rearrangements: [
      { target: 'θ2', latex: '\\theta_2=\\sin^{-1}\\!\\left(2\\sin\\theta_1\\right)', note: 'Requires a genuine first-order angle and 2 sin θ1 ≤ 1. If greater than 1, the second order is unavailable, not an angle to be rounded. Equality gives grazing.', noteZh: 'θ1 須確為第一級角度，且 2 sin θ1 ≤ 1。若大於 1，第二級不存在，不能把結果取整成角度。等號表示掠射。' },
      { target: 'θ1', latex: '\\theta_1=\\sin^{-1}\\!\\left(\\frac{\\sin\\theta_2}{2}\\right)', note: 'Requires a genuine second-order angle for the same wavelength and grating. The order labels 1 and 2 are fixed integers, not independently solvable variables.', noteZh: 'θ2 須確為同一波長、同一光柵的第二級角度。級數標籤 1 與 2 是固定整數，不是可獨立求解的變量。' },
    ],
  },
];

export const lessonBundle: LessonBundle = {
  topicId: 'diffraction-grating',
  topic: {
    id: 'diffraction-grating',
    title: 'Diffraction Grating',
    titleZh: '衍射光柵',
    category: 'Waves',
    categoryZh: '波動',
    color: 'purple',
    accentColor: '#a855f7',
    icon: '',
    summary: 'A diffraction grating contains many equally spaced parallel slits. Coherent light diffracts at each slit and interferes to form sharp principal maxima at discrete orders. At normal incidence, the grating equation links wavelength, slit spacing, integer order and angle from the central axis; exact trigonometry connects the angles to a screen or spectrometer measurement.',
    summaryZh: '衍射光柵有大量等距且平行的狹縫。相干光在各縫衍射後互相干涉，在離散級數方向形成尖銳主極大。垂直入射時，光柵方程把波長、縫間距、整數級數及從中央軸量起的角度聯繫起來，再用精確三角關係把角度轉為屏幕或分光計的量度。',
    formulas: [],
    keyPoints: [
      { en: 'Diffraction spreads light from each slit; interference between coherent waves from many slits selects the principal maxima.', zh: '衍射使各縫的光向外擴散；許多狹縫發出的相干波互相干涉，選出主極大的方向。' },
      { en: 'At normal incidence, the zero order lies on the central axis, and the +q and −q orders have equal angle magnitudes.', zh: '垂直入射時，零級位於中央軸，+q 與 −q 級的角度大小相等。' },
      { en: 'The order is an integer label: first means magnitude 1 and second means magnitude 2. The symbol n here does not mean moles.', zh: '級數是整數標籤：第一級大小為 1，第二級大小為 2。此處 n 不代表物質的量。' },
      { en: 'More lines per metre means smaller grating spacing and a larger angle for the same available non-zero order and wavelength.', zh: '每米線數越多，光柵間距越小；對同一容許非零級數及波長，衍射角越大。' },
      { en: 'Longer wavelength or higher available order increases the angle magnitude, but may make an order unavailable.', zh: '較長波長或較高容許級數使角度大小增加，但也可能令某級數不再容許。' },
      { en: 'Opposite-pair angular separation is twice the one-sided angle; screen displacement must be measured from the central spot.', zh: '正負光點的完整角距是單側角度的兩倍；屏幕位移須從中央光點量起。' },
      { en: 'The largest allowed order is found by an integer bound, with a separate 90° grazing check; allowed orders need not all be visible.', zh: '最高容許級數由整數上限決定，並須另行檢查 90° 掠射情況；容許級數不一定全部可見。' },
      { en: 'Successive orders are equally spaced in sin θ, not generally in angle or screen distance.', zh: '相鄰級數的 sin θ 等差增加，角度及屏幕距離一般並不等距。' },
    ],
    examTips: [
      { en: 'Before substitution, state normal incidence, identify the integer order, convert all lengths to metres, and distinguish spacing from line density.', zh: '代入前先指出垂直入射，辨認整數級數，把長度換成米，並分清間距與線密度。' },
      { en: 'Check the sine argument before inverse sine. A value above 1 means no such order; never use a fractional order to rescue it.', zh: '取反正弦前先檢查輸入值。大於 1 表示該級數不存在；不能改用分數級數補救。' },
      { en: 'Use half the same-order opposite-pair angle. For a screen use inverse tangent first, not an unjustified small-angle formula.', zh: '使用同級正負光點完整角距的一半。屏幕題先用反正切，不要套用沒有根據的小角度公式。' },
      { en: 'Write explanations as cause → grating law → effect, naming quantities held fixed and checking whether the stated order still exists.', zh: '解釋按「原因 → 光柵定律 → 結果」書寫，指出哪些量不變，並檢查指定級數是否仍存在。' },
      { en: 'These practice sets and suggested marks are original DSE-style learning material, not official HKEAA questions or mark schemes.', zh: '以下練習與建議分數均為原創 DSE 風格教材，並非考評局官方試題或評分參考。' },
    ],
  },
  formulas,
  sections: [
    {
      id: 'grating-mechanism-derivation',
      title: 'From coherent slits to the grating equation',
      titleZh: '由相干狹縫推導光柵方程',
      blocks: [
        { en: 'A transmission grating has many equally spaced parallel slits. The spacing d is measured between adjacent slit centres, not across the opening of one slit. Monochromatic means one wavelength. Coherent waves have the same frequency and a constant phase difference; normal illumination by one coherent beam makes neighbouring slits start in phase. [2]', zh: '透射光柵有很多等距且平行的狹縫。d 是相鄰狹縫中心的距離，不是單一縫口的闊度。單色表示只有一個波長；相干波具有相同頻率及固定相位差。同一相干光束垂直照射時，相鄰狹縫的出射波起初同相。[2]' },
        { en: 'Step 1 — Light spreads by diffraction at each slit, so waves from different slits can overlap. For a common far-field direction at angle θ to the normal, elementary projection geometry gives the signed path difference δ between neighbouring rays. Normal incidence contributes no initial adjacent-slit path difference. Here δ and d are in m, and θ is the angle from the central axis. [2]', zh: '步驟 1——光在每條狹縫衍射並擴散，不同狹縫的波因而可重疊。在遠場沿共同方向傳播且與法線成 θ 角時，投影幾何給出相鄰光線的帶正負號光程差 δ。垂直入射不產生初始相鄰光程差。δ 及 d 的單位為 m；θ 須從中央軸量起。[2]', latex: '\\delta=d\\sin\\theta' },
        { en: 'Step 2 — At a principal maximum, the adjacent-slit path difference is a whole number of wavelengths. Every slit then contributes in phase, so the wave amplitudes reinforce one another by constructive interference. n is a dimensionless integer, while λ is a positive wavelength in m. Negative n labels the opposite side, not a negative wavelength. [2]', zh: '步驟 2——主極大的相鄰光程差是波長的整數倍。各縫的波因而同相到達，波幅因相長干涉而互相增強。n 是無單位整數，λ 是以 m 表示的正波長。負 n 只標示另一側，不代表負波長。[2]', latex: '\\delta=n\\lambda,\\qquad n=0,\\pm1,\\pm2,\\ldots' },
        { en: 'Step 3 — Equate the two expressions for δ. This is the normal-incidence equation printed as C2 in the official HKEAA formula list. Its n is the order number in this context, not the n used for moles in the gas equation. We also use q = |n| when only the order magnitude is needed. [1]', zh: '步驟 3——把 δ 的兩個表示式相等，便得垂直入射的光柵方程。考評局官方公式表把它列為 C2。此處 n 的意思是級數，並非氣體方程中代表物質的量的 n。只需要級數大小時，本課亦用 q = |n|。[1]', latex: 'd\\sin\\theta=n\\lambda,\\qquad |n|\\lambda\\le d' },
        { en: 'Away from a principal-maximum direction, many slit contributions have different phases and largely cancel. With more coherently illuminated slits at the same spacing, principal peaks become narrower, making spectral directions easier to distinguish. A real grating has finite slit widths and a finite number of illuminated slits, so weaker features can occur and some geometrically allowed orders can be suppressed. Do not claim that every region between orders is perfectly dark or that all orders have equal brightness. [2]', zh: '偏離主極大方向時，許多狹縫的波具有不同相位，波幅大部分互相抵消。在間距相同時，增加相干照亮的狹縫數目會令主峰更窄，更容易分辨光譜方向。真實光柵的縫闊及被照亮縫數均有限，因此可有較弱的次級結構，部分幾何上容許的級數亦可受到抑制。不能聲稱級數之間處處完全黑暗，或所有級數亮度相同。[2]' },
      ],
    },
    {
      id: 'grating-orders-boundaries',
      title: 'Zero, first, second and the highest order',
      titleZh: '零級、第一級、第二級與最高級',
      blocks: [
        { en: 'At zero order the adjacent-slit path difference is zero, so the waves reinforce along the undeviated central direction. First order means a path-difference magnitude of one wavelength; second order means two wavelengths. For normal incidence the ideal direction sequence is −2, −1, 0, +1, +2, with higher integer orders added only if allowed. The two sides have equal angle magnitudes because reversing the sign of the angle reverses the sign of the sine. [1] [2]', zh: '零級的相鄰光程差為零，因此各波沿未偏轉的中央方向相長干涉。第一級的光程差大小為一個波長；第二級為兩個波長。垂直入射時，理想方向依次為 −2、−1、0、+1、+2；只有在容許時才加入更高整數級數。角度改變正負號時，正弦亦改變正負號，因此兩側角度大小相等。[1] [2]', latex: 'n=0\\Rightarrow\\theta=0;\\qquad \\theta_{-q}=-\\theta_{+q}' },
        { en: 'To find a possible highest order, impose the sine bound first and then impose the integer restriction. Here q is the non-negative integer magnitude |n|. The floor operation chooses the greatest allowed integer; it does not estimate a continuous order. This conclusion follows directly from the verified grating equation. [1]', zh: '求最高可能級數時，先施加正弦的上限，再施加整數限制。此處 q 是非負整數大小 |n|。向下取整是選擇最大容許整數，不是估算連續級數。此結論直接由已核實的光柵方程推出。[1]', latex: '\\sin\\theta_q=\\frac{q\\lambda}{d}\\le1\\quad\\Rightarrow\\quad q\\le\\frac{d}{\\lambda},\\quad q\\in\\{0,1,2,\\ldots\\}' },
        { en: 'Original worked example — A 600 lines/mm grating with 650 nm light has d = 1.6667 × 10⁻⁶ m. The ratio is about 2.564, so the highest geometrically allowed magnitude is 2, not 3. Third order would require a sine of 1.17, which is impossible. The geometrically allowed principal directions are 0, ±1 and ±2: five directions, although actual visibility also depends on intensity and apparatus.', zh: '原創例題——600 lines/mm 光柵配合 650 nm 光，d = 1.6667 × 10⁻⁶ m。比值約為 2.564，所以幾何上最高級數大小是 2，不是 3。第三級需要正弦值 1.17，故不可能。幾何上容許的主極大方向為 0、±1、±2，共五個；實際能否看見還取決於亮度及儀器。', latex: 'q_{\\max}=\\left\\lfloor\\frac{1.6667\\times10^{-6}}{650\\times10^{-9}}\\right\\rfloor=2,\\qquad \\frac{3\\lambda}{d}=1.17>1' },
        { en: 'Grazing boundary — With d = 1.00 × 10⁻⁶ m and λ = 500 nm, the ratio is exactly 2. The equation allows second order at ±90°, along the grating plane. It does not reach a finite point on a screen perpendicular to the central axis downstream. Such a screen can contain only the central and the two first-order spots (if bright enough and if the screen is wide enough). If asked about possible geometric orders, say 2 with the grazing qualification; if asked about finite-screen orders, say 1.', zh: '掠射邊界——若 d = 1.00 × 10⁻⁶ m、λ = 500 nm，比值恰為 2。方程容許第二級位於 ±90°，即沿光柵平面傳播。它不能到達下游、垂直中央軸屏幕的有限位置。該屏幕只能有中央及兩個第一級光點（還須亮度足夠且屏幕夠闊）。若問幾何上可能級數，答 2 並註明掠射；若問有限屏幕級數，答 1。', latex: '2\\lambda=d\\Rightarrow\\theta_2=90^{\\circ};\\qquad q\\lambda<d\\quad\\text{for finite downstream-screen spots}' },
        { en: 'Counting requires stating what is counted. Each non-zero magnitude contributes two symmetric directions, and the central order is counted only once. If the greatest finite-screen magnitude is Q (a non-negative integer), an ideal sufficiently wide screen has at most 2Q + 1 geometrically permitted principal spots. This does not count colours separately or guarantee detection of each spot.', zh: '計數前須說明所數的是甚麼。每個非零級數大小有兩個對稱方向，而零級只計一次。若有限屏幕最高級數大小為非負整數 Q，理想且足夠闊的屏幕最多有 2Q + 1 個幾何上容許的主極大光點。這並不分開計不同顏色，也不保證每點都可被探測。' },
      ],
    },
    {
      id: 'grating-density-units',
      title: 'Convert line density before calculating spacing',
      titleZh: '先換算線密度，再計算間距',
      blocks: [
        { en: 'Line density counts how many equally spaced lines fit in a unit length. A metre contains 1000 millimetres, so there are 1000 times as many lines per metre as per millimetre. L denotes the SI density in lines/m; taking its reciprocal gives a spacing in metres. Do not confuse a large line density with a large spacing. [2] [3]', zh: '線密度表示單位長度內有多少條等距光柵線。一米有 1000 毫米，所以每米線數是每毫米線數的 1000 倍。L 表示以 lines/m 為單位的 SI 線密度；取倒數後才得到以米表示的間距。不要把高線密度誤認為大間距。[2] [3]' },
        { en: 'Original worked example — Convert 600 lines/mm into SI density, then take the reciprocal. The result is about 1.67 micrometres. If instead the reciprocal is taken while keeping lines/mm, the result is 0.001667 mm, which must still be converted to m. Both routes agree when units are handled correctly.', zh: '原創例題——把 600 lines/mm 換成 SI 線密度，再取倒數，所得約為 1.67 微米。若保留 lines/mm 後直接取倒數，會得到 0.001667 mm，仍須換成 m。只要單位正確，兩種方法結果一致。', latex: 'L=600\\times1000=6.00\\times10^5\\ \\mathrm{m^{-1}},\\qquad d=\\frac{1}{6.00\\times10^5}=1.6667\\times10^{-6}\\ \\mathrm{m}' },
        { en: 'Substitution check — A 500 nm wavelength is 5.00 × 10⁻⁷ m. At first order q = 1, λ/d = 0.300; at second order q = 2, 2λ/d = 0.600. Both are below 1 and both are valid finite-screen directions. A fractional q is not used to match an arbitrary angle.', zh: '代入檢查——500 nm 即 5.00 × 10⁻⁷ m。第一級 q = 1 時 λ/d = 0.300；第二級 q = 2 時 2λ/d = 0.600。兩者都小於 1，均為有效的有限屏幕方向。不可用分數 q 去配合任意角度。', latex: '\\sin\\theta_1=0.300,\\qquad \\sin\\theta_2=0.600' },
      ],
    },
    {
      id: 'grating-angle-screen',
      title: 'Read the correct angle and use exact screen geometry',
      titleZh: '讀取正確角度，使用精確屏幕幾何',
      blocks: [
        { en: 'The grating angle is from the central direction to ONE order, not the full angle between opposite orders. If a symmetric +q/−q pair has full angular separation Δαq, divide by two. With circular scales, unwrap the readings around the central direction before subtracting: a simple raw subtraction across 0°/360° can be wrong. These operations require normal incidence, the same wavelength and the same non-zero integer order. [3]', zh: '光柵角度是中央方向至單側級數的角度，不是正負級數之間的完整夾角。若對稱 +q/−q 光點完整角距為 Δαq，須除以二。圓周刻度若跨越 0°/360°，須先以中央方向為基準展開讀數；直接相減可能錯誤。這些操作須有垂直入射、同一波長及同一非零整數級數。[3]', latex: '\\theta_q=\\frac{\\Delta\\alpha_q}{2}' },
        { en: 'For a flat screen perpendicular to the central axis, draw a right triangle: the axial side is D and the transverse side is xq from the central spot to one spot. The exact ratio is tangent. If a symmetric pair is separated by a total screen distance S, the one-sided displacement is xq = S/2. S and xq are lengths in m; neither is an angle. [2]', zh: '對垂直中央軸的平面屏幕，畫一直角三角形：軸向邊為 D，橫向邊為中央光點至單側光點的 xq。精確比值是正切。若兩個對稱光點的完整屏幕距離為 S，單側位移便是 xq = S/2。S、xq 是以 m 表示的長度，不是角度。[2]', latex: '\\theta_q=\\tan^{-1}\\!\\left(\\frac{x_q}{D}\\right),\\qquad \\sin\\theta_q=\\frac{x_q}{\\sqrt{D^2+x_q^2}}' },
        { en: 'Original worked example, step 1 — A known second-order spot lies 0.900 m from the centre on a screen 1.20 m downstream. The grating has 600 lines/mm. q = 2 is a specified positive integer; use the right triangle rather than identifying the tangent ratio with the sine.', zh: '原創例題，步驟 1——已知第二級光點在中央旁 0.900 m，屏幕位於下游 1.20 m，光柵為 600 lines/mm。q = 2 是已指定正整數。使用直角三角形，不可把正切比值當作正弦。', latex: '\\theta_2=\\tan^{-1}\\!\\left(\\frac{0.900}{1.20}\\right)=36.87^{\\circ},\\qquad \\sin\\theta_2=0.600' },
        { en: 'Step 2 — Convert line density to d and rearrange for wavelength using the non-zero integer q = 2. The positive result is 500 nm. Verify availability: qλ/d = 0.600 < 1, so the measured finite-screen direction is physically allowed.', zh: '步驟 2——把線密度換成 d，再用非零整數 q = 2 重排求波長。正值結果是 500 nm。檢查容許條件：qλ/d = 0.600 < 1，所以所量有限屏幕方向在物理上容許。', latex: '\\lambda=\\frac{d\\sin\\theta_2}{2}=\\frac{(1.6667\\times10^{-6})(0.600)}{2}=5.00\\times10^{-7}\\ \\mathrm{m}=500\\ \\mathrm{nm}' },
        { en: 'Why not use the small-angle approximation? Here x/D = 0.750 while sin θ = 0.600, so substituting x/D for sin θ would give 625 nm, not 500 nm. The approximation is acceptable only when the angle is demonstrably small enough for the required accuracy. If it is used, an angle equated numerically with sine or tangent must be in radians. Grating orders commonly require exact trigonometry; the formula sheet explicitly limits the approximation to small angles. [1]', zh: '為何不用小角度近似？此處 x/D = 0.750，但 sin θ = 0.600；把 x/D 當作 sin θ 會得 625 nm，而不是 500 nm。只有角度確實小至符合所需精度時才可近似。若把角度數值等同其正弦或正切，角度必須用弧度。光柵級數常須精確三角計算；官方公式表亦明確把該近似限制於小角度。[1]' },
      ],
    },
    {
      id: 'grating-comparisons',
      title: 'Predict changes and compare first with second order',
      titleZh: '預測變化並比較第一、第二級',
      blocks: [
        { en: 'Hold the grating spacing and a non-zero integer order fixed. Increasing wavelength increases the required path difference, so the grating equation requires a larger sine and hence a larger angle magnitude within 0° to 90°. If the required sine exceeds 1, that order disappears as a propagating order. At zero order, the angle remains zero for any wavelength. [1] [2]', zh: '保持間距及某非零整數級數不變。波長增加會增加所需光程差，所以光柵方程要求正弦增加，並使 0° 至 90° 範圍內的角度大小增加。若所需正弦超過 1，便不再有該傳播級數。零級的角度則對任何波長都保持為零。[1] [2]' },
        { en: 'Hold wavelength and a non-zero integer order fixed. Increasing line density decreases d. The required sine therefore increases, so available maxima move farther from the central direction. The largest allowed order can decrease because the ratio d/λ decreases. Higher line density does not automatically create more orders. [1] [3]', zh: '保持波長及某非零整數級數不變。線密度增加使 d 減小，所需正弦因而增加，容許主極大會遠離中央方向。由於 d/λ 下降，最高容許級數可能減少。更高線密度並不會自動產生更多級數。[1] [3]' },
        { en: 'Hold wavelength and spacing fixed, then increase the integer order magnitude. The path-difference condition increases in whole-wavelength steps. Successive orders have equal steps in sin θ, but inverse sine is nonlinear, so their angles are not generally equally spaced. Tangent is also nonlinear, so their screen positions are not generally equally spaced. [1] [2]', zh: '保持波長及間距不變，再增加整數級數大小。光程差條件每次增加一個完整波長。相鄰級數的 sin θ 等差增加，但反正弦並非線性，因此角度一般不等距。正切亦非線性，所以屏幕位置一般也不等距。[1] [2]', latex: '\\sin\\theta_{q+1}-\\sin\\theta_q=\\frac{\\lambda}{d},\\qquad q,q+1\\in\\mathbb{Z}_{\\ge0},\\quad(q+1)\\lambda\\le d' },
        { en: 'Original worked comparison — For 600 lines/mm and 500 nm, first order is at 17.46° and second order at 36.87°. Second-order sine is twice first-order sine, but the second angle is not twice 17.46°. The third order, if observable, is at 64.16°: angular gaps of 17.46°, 19.41° and 27.29° from zero outwards are unequal.', zh: '原創比較例題——600 lines/mm、500 nm 時，第一級在 17.46°，第二級在 36.87°。第二級正弦是第一級正弦的兩倍，但第二級角度不是 17.46° 的兩倍。若可觀察，第三級在 64.16°；由零級向外的角距為 17.46°、19.41°、27.29°，並不相等。', latex: '\\theta_1=\\sin^{-1}(0.300)=17.46^{\\circ},\\quad \\theta_2=\\sin^{-1}(0.600)=36.87^{\\circ},\\quad \\theta_3=\\sin^{-1}(0.900)=64.16^{\\circ}' },
        { en: 'On a screen with D = 1.20 m, these first and second orders are 0.377 m and 0.900 m from the centre. The first-to-second gap is 0.523 m, not the central-to-first gap of 0.377 m. Reusing the double-slit small-angle fringe-spacing expression without checking its assumptions would lose this distinction.', zh: '在 D = 1.20 m 屏幕上，第一級及第二級分別距中央 0.377 m 及 0.900 m。第一至第二級距離為 0.523 m，並不等於中央至第一級的 0.377 m。若不檢查假設便套用雙縫小角度條紋間距式，便會忽略此分別。', latex: 'x_1=1.20\\tan17.46^{\\circ}\\approx0.377\\ \\mathrm{m},\\qquad x_2=1.20\\tan36.87^{\\circ}\\approx0.900\\ \\mathrm{m}' },
      ],
    },
    {
      id: 'grating-spectrometer-experiment',
      title: 'Monochromatic spectrometer experiment and safety',
      titleZh: '單色光分光計實驗與安全',
      blocks: [
        { en: 'Use a known-density grating, a spectrometer with collimator and rotating telescope, and a monochromatic source (or one isolated spectral line). Focus the eyepiece on the cross-wires, focus the telescope at infinity, and adjust the collimator to give a sharp narrow slit image and parallel incident light. Keep the grating lines parallel to the slit so diffraction directions can be measured in the intended plane. [3]', zh: '使用已知線密度光柵、有準直管及可旋轉望遠鏡的分光計，以及單色光源（或選定一條獨立譜線）。先把目鏡對焦於十字線，再把望遠鏡對焦於無限遠，並調整準直管，得到清晰窄縫像及平行入射光。光柵線須與狹縫平行，使衍射方向在預期平面內量度。[3]' },
        { en: 'Align the grating plane perpendicular to the incident beam using the instrument’s normal-incidence alignment procedure, then lock its table. Find and record the undeviated zero-order direction. Record repeated central readings rather than assuming that a dial reading of 0° is the physical zero. A large left/right asymmetry is a warning to realign; averaging is not a substitute for normal incidence. [3]', zh: '依儀器的垂直入射校準程序，把光柵平面調至垂直入射光束，再鎖定光柵台。尋找並記錄未偏轉的零級方向。重複記錄中央讀數，不可假定刻度 0° 就是物理上的零級。左右角度若明顯不對稱，應重新校準；取平均不能代替垂直入射。[3]' },
        { en: 'Identify the same wavelength and known non-zero integer order on both sides. Centre the cross-wire on each line, read both verniers where provided, repeat, and average the one-sided angle magnitudes. Alternatively take half the properly unwrapped pair separation. A common additive dial-zero offset cancels in the pair difference; repeated readings reduce random reading scatter. This does not remove errors in grating density or all alignment errors. Use each order’s correct integer in the wavelength calculation and compare independent results. [3]', zh: '在兩側辨認同一波長及已知非零整數級數。把十字線置於譜線中心，若有兩個游標則均讀取，重複量度後取單側角度大小的平均。也可把正確展開的完整角距除以二。共同的刻度零點加性偏移在相減時抵消；重複讀數可減少隨機讀數波動。但這不能消除線密度誤差或所有校準誤差。求波長時須用各級的正確整數，並比較獨立結果。[3]', latex: '\\lambda=\\frac{d\\sin\\theta_q}{q},\\qquad q\\in\\{1,2,3,\\ldots\\},\\quad q\\lambda\\le d' },
        { en: 'Original measurement example — The left and right first-order telescope readings are 128.4° and 171.6°, on one consistently unwrapped scale. The full separation is 43.2°, so the diffraction angle is 21.6°. Their midpoint is 150.0°, which is the symmetry centre for these ideal readings, not an angle to put in the grating equation. With 600 lines/mm, the measured wavelength is approximately 614 nm; q = 1 and λ/d ≈ 0.368 < 1.', zh: '原創量度例題——同一已展開刻度上的左右第一級讀數為 128.4° 及 171.6°。完整角距是 43.2°，所以衍射角是 21.6°。中點 150.0° 是此組理想讀數的對稱中央，不是光柵方程中的角度。用 600 lines/mm 得波長約 614 nm；q = 1 且 λ/d ≈ 0.368 < 1。', latex: '\\theta_1=\\frac{171.6^{\\circ}-128.4^{\\circ}}{2}=21.6^{\\circ},\\qquad \\lambda=\\frac{(1.6667\\times10^{-6})\\sin21.6^{\\circ}}{1}=6.14\\times10^{-7}\\ \\mathrm{m}' },
        { en: 'Laser safety — A low-power educational laser can demonstrate monochromatic grating diffraction on a screen, but do not look into the direct, diffracted or reflected beams, and never view a laser beam through a telescope. Clamp the source securely, keep beams away from eye level, terminate beams on a suitable screen or beam stop, remove shiny objects near the beam, and switch off before changing the arrangement. Use a teacher-approved source and the local risk assessment. Telescope viewing of a suitable discharge-lamp line is a separate method, not permission to telescope-view laser orders. [4]', zh: '雷射安全——低功率教學雷射可在屏幕展示單色光柵衍射，但不可直視直接、衍射或反射光束，更不可透過望遠鏡觀看雷射光束。把光源穩固夾緊，讓光束避開眼睛高度，以合適屏幕或擋光器終止光束，移走光路附近的光亮反射物，改動裝置前先關掉雷射。使用教師批准的光源並依從當地風險評估。望遠鏡觀察合適放電燈譜線是另一方法，不代表可用望遠鏡看雷射級數。[4]' },
      ],
    },
    {
      id: 'grating-answer-method-sources',
      title: 'A reliable calculation and explanation method',
      titleZh: '可靠的計算與解釋方法',
      blocks: [
        { en: 'For a calculation, identify the normal-incidence geometry and the discrete order first. Convert density and wavelength to SI, derive the one-sided angle from the stated measurement, rearrange without dividing by a zero order, and check the sine bound. Report units and explain what the result means. A missing spot can mean an impossible order, insufficient screen width, weak intensity or poor alignment; use the numerical bound before claiming impossibility.', zh: '計算時，先辨認垂直入射幾何及離散級數，再把密度及波長換成 SI 單位。由題目量度求出單側角度，重排時避免除以零級，然後檢查正弦上限。答案須有單位，並說明結果的物理意思。看不到某光點可能因級數不容許、屏幕不夠闊、亮度弱或校準不良；聲稱不可能前須先用數值上限判斷。' },
        { en: 'For a text explanation, write a connected causal chain. Example: “Increasing line density decreases spacing. For the same wavelength and available non-zero order, the grating equation therefore requires a larger sine of the diffraction angle. The maximum moves farther from the central axis.” Include the held-fixed conditions and the order-availability qualification rather than only saying “more diffraction”.', zh: '文字解釋應連成因果鏈。例如：「增加線密度使間距減小。在波長及某容許非零級數不變時，光柵方程因此要求衍射角正弦增加，主極大便遠離中央軸。」須指出不變條件及級數容許限制，而不是只寫「衍射更多」。' },
        { en: 'Source [1]: HKEAA, HKDSE Physics List of Data, Formulae and Relationships, item C2 and conditional small-angle relation. Source [2]: OpenStax, University Physics Volume 3, §4.4, and College Physics 2e, §27.4, for multi-slit interference and geometry. These verify the underlying physics, not the original questions or their suggested marks.', zh: '來源 [1]：考評局《HKDSE Physics List of Data, Formulae and Relationships》的 C2 及有條件小角度關係。來源 [2]：OpenStax《University Physics Volume 3》第 4.4 節及《College Physics 2e》第 27.4 節，支持多縫干涉及幾何。這些來源核實基礎物理，並非原創練習或建議分數的官方來源。' },
        { en: 'Source [3]: Brooklyn College, The Diffraction Grating Spectrometer laboratory guide, for normal alignment, collimation, repeated zero readings and measurements on both sides. Source [4]: Institute of Physics, Diffraction of Light collection, especially its laser-light demonstration, for secure clamping, avoiding eyes and reflective objects. Links and the exact support of each source are recorded in this lesson’s sources.', zh: '來源 [3]：Brooklyn College 的《The Diffraction Grating Spectrometer》實驗指引，支持垂直校準、準直、重複零級讀數及兩側量度。來源 [4]：物理學會《Diffraction of Light》合集，特別是雷射衍射示範，支持穩固夾緊、避開眼睛及反射物。各來源的連結及支持內容已列於本課 sources。' },
      ],
    },
  ],
  explanations: [
    {
      id: 'grating-guide-sharp-maxima',
      question: 'Why does coherent light passing through many grating slits form sharp principal maxima?',
      questionZh: '為何相干光通過光柵的許多狹縫會形成尖銳主極大？',
      reasoning: [
        { en: 'Each slit diffracts the incident coherent light, so waves from neighbouring slits spread into common directions and overlap.', zh: '每條狹縫使入射相干光衍射，因此相鄰狹縫的波擴散至共同方向並重疊。' },
        { en: 'At normal incidence, the neighbouring waves start in phase and their path difference in a direction θ is d sin θ.', zh: '垂直入射時，相鄰波起初同相；沿 θ 方向的光程差為 d sin θ。' },
        { en: 'When that difference is an integer number of wavelengths, all slit contributions are in phase and constructively interfere to give a principal maximum.', zh: '若光程差是波長的整數倍，各縫的波均同相，因相長干涉形成主極大。' },
        { en: 'A small change of direction introduces phase differences across many slits, causing strong cancellation and narrowing the principal peaks.', zh: '方向稍有改變便使許多狹縫的波出現相位差，造成強烈抵消，令主峰變窄。' },
      ],
      modelAnswer: 'Light diffracts at each slit and waves from the coherently illuminated slits overlap. Under normal incidence, adjacent waves start in phase. In a direction where the adjacent-slit path difference is an integer multiple of the wavelength, all slit contributions arrive in phase and their amplitudes reinforce, forming a principal maximum. Away from that direction, phase differences across many slits cause substantial cancellation. Hence a grating produces narrow principal peaks. The integer order must obey |n|λ ≤ d; this condition selects possible directions but does not fix the brightness of every peak.',
      modelAnswerZh: '光在每條狹縫衍射，相干照亮的各縫發出的波互相重疊。垂直入射時，相鄰波起初同相。當某方向的相鄰光程差是波長的整數倍，各縫的波便同相到達，波幅互相增強，形成主極大。偏離該方向時，許多狹縫之間的相位差造成顯著抵消，因此光柵產生窄主峰。整數級數須滿足 |n|λ ≤ d；此條件選出可能方向，但不決定每個主峰的亮度。',
      pitfalls: [
        { en: 'Do not describe the grating as merely bending a single ray; explain both diffraction and interference.', zh: '不要只把光柵說成使單一光線彎曲；須同時解釋衍射及干涉。' },
        { en: 'Do not claim complete darkness at every non-order angle or equal brightness for all orders.', zh: '不要聲稱所有非級數角度均完全黑暗，或所有級數亮度相同。' },
      ],
    },
    {
      id: 'grating-guide-density-change',
      question: 'At a fixed wavelength and available non-zero order, why does increasing line density increase the diffraction angle?',
      questionZh: '波長及某容許非零級數不變時，為何增加線密度會增加衍射角？',
      reasoning: [
        { en: 'Increasing lines per metre decreases the centre-to-centre spacing because spacing is the reciprocal of line density.', zh: '每米線數增加會減小中心間距，因間距是線密度的倒數。' },
        { en: 'The fixed wavelength and fixed integer order require the same adjacent-slit path-difference magnitude.', zh: '波長及整數級數不變，所需相鄰光程差大小亦不變。' },
        { en: 'A smaller spacing must therefore be compensated by a larger sine of the angle in the grating equation.', zh: '因此在光柵方程中，較小間距須以較大角度正弦補償。' },
        { en: 'Sine increases with angle magnitude between 0° and 90°, so the maximum moves farther from the centre until the order reaches its availability limit.', zh: '在 0° 至 90° 內，正弦隨角度大小增加，主極大便遠離中央，直至達到該級數的容許界限。' },
      ],
      modelAnswer: 'Increasing the line density reduces the spacing between neighbouring slits. For the same wavelength and non-zero integer order, the constructive-interference path difference is unchanged. The normal-incidence grating equation therefore requires a larger sine of the diffraction angle, so the angle magnitude increases and the maximum moves away from the central axis. This holds only while qλ ≤ d; at equality the ray is grazing, and beyond it the order is unavailable. Zero order stays on the central axis, and the highest possible order can decrease when the density increases.',
      modelAnswerZh: '增加線密度會減小相鄰狹縫間距。在波長及某非零整數級數相同時，相長干涉所需光程差不變。垂直入射光柵方程因此要求衍射角正弦增加，角度大小便增加，主極大遠離中央軸。這只在 qλ ≤ d 時適用；等號時光線掠射，超過界限便不再有該級數。零級保持在中央軸；密度增加時，最高可能級數反而可減少。',
      pitfalls: [
        { en: 'More lines means smaller d, not larger d. Specify the wavelength and integer order held fixed.', zh: '線數更多表示 d 更小，不是更大。須指出波長及整數級數保持不變。' },
        { en: 'Do not conclude that a larger angle means more orders, or apply this change to zero order.', zh: '不要由角度增加推論級數更多，也不可把此變化套用於零級。' },
      ],
    },
    {
      id: 'grating-guide-unequal-spacing',
      question: 'Why are first and second orders not generally equally spaced in angle, and why is the second-order angle not twice the first?',
      questionZh: '為何第一及第二級一般不按角度等距，而第二級角度不是第一級的兩倍？',
      reasoning: [
        { en: 'Each step in integer order adds one wavelength to the required adjacent-slit path difference.', zh: '整數級數每增加一級，所需相鄰光程差便增加一個波長。' },
        { en: 'At fixed spacing this gives equal increments of sin θ, not of θ itself.', zh: '間距固定時，這使 sin θ 等差增加，而不是 θ 本身等差增加。' },
        { en: 'Inverse sine is nonlinear, so equal changes in sine do not produce equal changes in angle.', zh: '反正弦並非線性，因此正弦的相等變化不會產生角度的相等變化。' },
        { en: 'Screen positions also depend on tangent, so angular non-uniformity is carried into non-uniform screen spacing.', zh: '屏幕位置亦依賴正切，因此角度的不等距會轉為屏幕間距的不等距。' },
      ],
      modelAnswer: 'For a fixed grating and wavelength, the first-order path difference is one wavelength and the second-order path difference is two. The grating equation therefore makes sin θ2 twice sin θ1, not θ2 twice θ1. Equal order increments correspond to equal sine increments, but inverse sine is nonlinear, so the angular gaps are generally unequal. For example, when λ/d = 0.300, the first and second angles are 17.46° and 36.87°. Screen locations must then be calculated with x = D tan θ and are not generally equally spaced either. This comparison requires both integer orders to exist; 2λ > d means there is no second order.',
      modelAnswerZh: '同一光柵及波長下，第一級光程差為一個波長，第二級為兩個波長。光柵方程因此使 sin θ2 是 sin θ1 的兩倍，並非 θ2 是 θ1 的兩倍。級數的相等增量對應正弦的相等增量，但反正弦並非線性，所以角距一般不相等。例如 λ/d = 0.300 時，第一及第二級角度是 17.46° 及 36.87°。屏幕位置須再用 x = D tan θ 求出，也一般不等距。此比較須有兩個整數級數均存在；若 2λ > d，便沒有第二級。',
      pitfalls: [
        { en: 'Doubling the sine is not the same as doubling an angle. A near-zero approximation must be explicitly justified.', zh: '正弦加倍不等於角度加倍；接近零角度的近似須明確說明理由。' },
        { en: 'Do not assume constant screen fringe spacing from the double-slit small-angle result.', zh: '不要由雙縫小角度結果假定屏幕光柵條紋間距固定。' },
      ],
    },
    {
      id: 'grating-guide-paired-measurement',
      question: 'Why measure the same spectral order on both sides and take half the angular separation?',
      questionZh: '為何要量度同一譜線在兩側的同級方向，並取角距的一半？',
      reasoning: [
        { en: 'At normal incidence, the same wavelength and integer order magnitude give equal positive and negative angle magnitudes.', zh: '垂直入射時，相同波長及整數級數大小對應相等的正負角度大小。' },
        { en: 'The full separation therefore contains two copies of the one-sided diffraction angle, so division by two gives the angle needed by the grating equation.', zh: '完整角距因而包含兩個單側衍射角；除以二便得到光柵方程所需角度。' },
        { en: 'A common additive scale offset appears in both readings and cancels in subtraction; repeated readings reduce random scatter.', zh: '共同的刻度加性偏移出現在兩個讀數中，相減時抵消；重複讀數則減少隨機波動。' },
        { en: 'Comparing the one-sided angles also checks symmetry, but a large mismatch requires alignment correction rather than blind averaging.', zh: '比較兩個單側角度也可檢查對稱；若差別大，須修正校準，而非盲目取平均。' },
      ],
      modelAnswer: 'For normal incidence, the +q and −q maxima of one spectral line lie at equal angle magnitudes from the central direction. Their full angular separation is therefore twice the angle used in the grating equation, so take half the correctly unwrapped separation. Subtracting the readings cancels a common additive zero offset, and repeating and averaging reduces random reading scatter. Measuring both sides also tests symmetry. It does not eliminate grating-density errors or justify using the normal-incidence equation when the grating is badly tilted; realign if there is a substantial asymmetry. Use a known non-zero integer q and check that the order is available.',
      modelAnswerZh: '垂直入射時，同一譜線的 +q 及 −q 主極大與中央方向的角度大小相等。兩者完整角距因此是光柵方程所用角度的兩倍，所以應取正確展開角距的一半。讀數相減可抵消共同的加性零點偏移；重複量度並取平均可減少隨機讀數波動。兩側量度亦可檢查對稱。但這不能消除光柵線密度誤差，也不能在光柵嚴重傾斜時仍使用垂直入射方程；明顯不對稱時須重新校準。須使用已知非零整數 q，並檢查該級數是否容許。',
      pitfalls: [
        { en: 'The full +q/−q separation is not θ. Do not mix different orders or different spectral lines.', zh: '完整 +q/−q 角距不是 θ。不可混合不同級數或不同譜線。' },
        { en: 'Averaging reduces some measurement effects, not every systematic error. Never telescope-view laser beams.', zh: '取平均只減少部分量度影響，不是所有系統誤差。絕不可透過望遠鏡觀看雷射光束。' },
      ],
    },
  ],
  questions: [
    {
      id: 'grating-original-first-second',
      topicId: 'diffraction-grating',
      source: 'Original bilingual practice',
      year: 'Original DSE-style',
      isOriginal: true,
      difficulty: 'Core',
      tags: ['first order', 'second order', 'exact screen geometry'],
      scenario: 'Monochromatic light of wavelength 500 nm falls normally on a transmission grating with 600 lines/mm. A sufficiently wide flat screen is perpendicular to the central axis and 1.20 m from the grating. Consider principal maxima in the far-field pattern.',
      scenarioZh: '波長 500 nm 的單色光垂直入射每毫米 600 線的透射光柵。足夠闊的平面屏幕垂直中央軸，距光柵 1.20 m。考慮遠場圖案的主極大。',
      parts: [
        { label: '(a)', question: 'Calculate the spacing and the positive first- and second-order angles. Check that both orders are available.', questionZh: '計算間距及第一、第二級正角度，並檢查兩級是否容許。', answer: 'The density is 600 × 1000 = 6.00 × 10⁵ lines/m, so d = 1/L = 1.6667 × 10⁻⁶ m. For the specified integers q = 1 and 2, the normal-incidence law gives sin θ1 = λ/d = 0.300 and sin θ2 = 2λ/d = 0.600. Both are below 1, so both give finite-screen directions. θ1 = 17.46° and θ2 = 36.87°.', answerZh: '線密度為 600 × 1000 = 6.00 × 10⁵ lines/m，故 d = 1/L = 1.6667 × 10⁻⁶ m。用指定整數 q = 1、2 及垂直入射定律，sin θ1 = λ/d = 0.300，sin θ2 = 2λ/d = 0.600。兩者均小於 1，故兩級均有有限屏幕方向。θ1 = 17.46°，θ2 = 36.87°。', marks: 3 },
        { label: '(b)', question: 'Find the centre-to-spot distances for the first and second orders using exact geometry. Compare the two consecutive screen gaps from zero to first and from first to second.', questionZh: '用精確幾何求第一及第二級距中央光點的距離，並比較零至第一級與第一至第二級的兩個連續屏幕間距。', answer: 'For a perpendicular screen use x = D tan θ, not x = D sin θ. x1 = 1.20 tan 17.46° = 0.377 m and x2 = 1.20 tan 36.87° = 0.900 m. The zero-to-first gap is 0.377 m; the first-to-second gap is 0.900 − 0.377 = 0.523 m. They are unequal because the order law is linear in sine, not in tangent or screen displacement.', answerZh: '垂直屏幕須用 x = D tan θ，而非 x = D sin θ。x1 = 1.20 tan 17.46° = 0.377 m；x2 = 1.20 tan 36.87° = 0.900 m。零至第一級間距是 0.377 m；第一至第二級是 0.900 − 0.377 = 0.523 m。它們不相等，因級數定律對正弦為線性，而非對正切或屏幕位移為線性。', marks: 3 },
        { label: '(c)', question: 'A student claims that second-order angle must be twice first-order angle. Explain the error.', questionZh: '一名學生認為第二級角度必為第一級角度的兩倍，解釋其錯誤。', answer: 'At fixed d and λ, changing the integer order from 1 to 2 doubles the required path difference and therefore doubles sin θ. It does not generally double θ because inverse sine is nonlinear. Here 2θ1 = 34.92°, not θ2 = 36.87°. The comparison also requires the second order to exist, which was checked in (a).', answerZh: 'd、λ 固定時，把整數級數由 1 變成 2 會使所需光程差加倍，因而使 sin θ 加倍。由於反正弦並非線性，θ 一般不會加倍。此處 2θ1 = 34.92°，並非 θ2 = 36.87°。此比較亦須第二級存在，而 (a) 已檢查此條件。', marks: 2 },
      ],
      totalMarks: 8,
    },
    {
      id: 'grating-original-density-change',
      topicId: 'diffraction-grating',
      source: 'Original bilingual practice',
      year: 'Original DSE-style',
      isOriginal: true,
      difficulty: 'Core',
      tags: ['line density', 'units', 'maximum order'],
      scenario: 'A normally incident 650 nm monochromatic beam is used with grating A, which has 400 lines/mm. It is then replaced by grating B, which has 600 lines/mm, without changing the wavelength or incidence direction.',
      scenarioZh: '垂直入射的 650 nm 單色光先照射每毫米 400 線的光柵 A，再換成每毫米 600 線的光柵 B，波長及入射方向不變。',
      parts: [
        { label: '(a)', question: 'Calculate each grating spacing and its first-order angle magnitude.', questionZh: '計算兩光柵的間距及第一級角度大小。', answer: 'Convert first: LA = 4.00 × 10⁵ m⁻¹ and LB = 6.00 × 10⁵ m⁻¹. Hence dA = 2.50 × 10⁻⁶ m and dB = 1.6667 × 10⁻⁶ m. At the specified integer q = 1, sin θA = λ/dA = 0.260 and sin θB = λ/dB = 0.390. Both are below 1. Therefore θA = 15.07° and θB = 22.95°.', answerZh: '先換算：LA = 4.00 × 10⁵ m⁻¹，LB = 6.00 × 10⁵ m⁻¹。故 dA = 2.50 × 10⁻⁶ m，dB = 1.6667 × 10⁻⁶ m。指定整數 q = 1 時，sin θA = λ/dA = 0.260，sin θB = λ/dB = 0.390；兩者均小於 1。因此 θA = 15.07°，θB = 22.95°。', marks: 3 },
        { label: '(b)', question: 'Explain the angle change using a cause → law → effect argument, including the zero order.', questionZh: '以「原因 → 定律 → 結果」解釋角度變化，並包括零級。', answer: 'Increasing line density decreases the adjacent-slit spacing. For the same wavelength and available non-zero integer order, d sin θ = qλ requires a larger sin θ, so the angle magnitude increases and the maximum moves away from the central axis. Zero order has q = 0, requiring sin θ = 0, so it remains central. The argument applies only while qλ ≤ d; at equality the direction is grazing.', answerZh: '線密度增加使相鄰縫間距減小。同一波長及某容許非零整數級數下，d sin θ = qλ 要求 sin θ 增加，所以角度大小增加，主極大遠離中央軸。零級 q = 0 要求 sin θ = 0，故保持在中央。此推論只在 qλ ≤ d 時適用；等號時方向掠射。', marks: 2 },
        { label: '(c)', question: 'Find the highest geometrically allowed order magnitude for A and B. Does the denser grating necessarily produce more orders?', questionZh: '求 A、B 幾何上容許的最高級數大小。線密度較高的光柵是否必產生更多級數？', answer: 'qmax,A = floor(dA/λ) = floor(3.846) = 3, while qmax,B = floor(dB/λ) = floor(2.564) = 2. Neither ratio is an integer, so neither boundary order is grazing. The denser grating has a smaller d/λ and fewer allowed order magnitudes here, despite its larger first-order angle. This is a geometric prediction, not a guarantee of every order’s visibility.', answerZh: 'qmax,A = floor(dA/λ) = floor(3.846) = 3；qmax,B = floor(dB/λ) = floor(2.564) = 2。兩比值均非整數，故邊界級數均非掠射。此處較密光柵的 d/λ 較小，所以容許級數大小較少，即使其第一級角度較大。這是幾何預測，並不保證每級實際可見。', marks: 2 },
      ],
      totalMarks: 7,
    },
    {
      id: 'grating-original-unavailable-grazing',
      topicId: 'diffraction-grating',
      source: 'Original bilingual practice',
      year: 'Original DSE-style',
      isOriginal: true,
      difficulty: 'Challenge',
      tags: ['unavailable order', 'integer restriction', 'grazing boundary'],
      scenario: 'Normal-incidence light of wavelength 650 nm illuminates a 600 lines/mm grating. A student attempts to observe third order. In a separate ideal setup, 500 nm light illuminates a grating with spacing exactly 1.00 × 10⁻⁶ m, followed by a wide screen perpendicular to the central axis.',
      scenarioZh: '波長 650 nm 的光垂直照射每毫米 600 線的光柵，學生嘗試觀察第三級。另一理想裝置中，500 nm 光照射間距恰為 1.00 × 10⁻⁶ m 的光柵，下游設有垂直中央軸的闊屏幕。',
      parts: [
        { label: '(a)', question: 'Show why third order is unavailable in the first setup, and state its highest allowed order magnitude.', questionZh: '證明第一裝置的第三級不容許，並指出最高容許級數大小。', answer: 'd = 1/(600 × 1000) = 1.6667 × 10⁻⁶ m. For the specified integer q = 3, sin θ3 = 3λ/d = 1.17 > 1, so no real diffraction angle exists and third order is unavailable. The highest allowed magnitude is floor(d/λ) = floor(2.564) = 2. It is not legitimate to round 2.564 up to 3.', answerZh: 'd = 1/(600 × 1000) = 1.6667 × 10⁻⁶ m。指定整數 q = 3 時，sin θ3 = 3λ/d = 1.17 > 1，沒有實衍射角，故第三級不容許。最高容許大小是 floor(d/λ) = floor(2.564) = 2，不可把 2.564 向上取成 3。', marks: 3 },
        { label: '(b)', question: 'The student suggests using order 2.5 to avoid a sine larger than 1. Explain why this is not a valid principal order.', questionZh: '學生建議使用 2.5 級以避免正弦大於 1，解釋為何這不是有效主級數。', answer: 'A principal maximum requires all adjacent-slit waves to arrive in phase, so the adjacent-slit path difference must be an integer multiple of λ. An order of 2.5 gives a half-integer path difference, not the integer phase condition for a principal maximum. Order is a discrete dimensionless label, not a variable that can be adjusted continuously to make a calculation possible.', answerZh: '主極大須有所有相鄰縫波同相到達，所以相鄰光程差必須是 λ 的整數倍。2.5 級給出半整數光程差，不滿足主極大的整數相位條件。級數是離散無單位標籤，不能連續調整以使計算可行。', marks: 2 },
        { label: '(c)', question: 'In the separate setup, distinguish the highest geometrically allowed order from the highest order with finite screen spots. Give the maximum number of such principal spots on an ideal sufficiently wide screen.', questionZh: '在另一裝置中，區分幾何上最高容許級數及有有限屏幕光點的最高級數，並求理想且足夠闊屏幕的最多主光點數。', answer: 'd/λ = 2 exactly, so the geometric bound is qmax = 2. But sin θ2 = 2λ/d = 1 gives θ2 = 90°, a grazing ray along the grating plane that never reaches a finite downstream-screen point. First order has sin θ1 = 0.500 and θ1 = 30°, so its finite-screen directions exist. Excluding grazing, the highest magnitude is 1 and the maximum spot count is 2(1) + 1 = 3: −1, 0 and +1. This also assumes sufficient brightness and width.', answerZh: 'd/λ 恰為 2，所以幾何上限 qmax = 2。但 sin θ2 = 2λ/d = 1 給出 θ2 = 90°，光線沿光柵平面掠射，不能到達下游屏幕的有限位置。第一級 sin θ1 = 0.500，θ1 = 30°，故其有限屏幕方向存在。排除掠射後，最高大小為 1，最多光點數為 2(1) + 1 = 3，即 −1、0、+1；亦假設亮度及屏幕闊度足夠。', marks: 3 },
      ],
      totalMarks: 8,
    },
    {
      id: 'grating-original-text-reasoning',
      topicId: 'diffraction-grating',
      source: 'Original bilingual practice',
      year: 'Original DSE-style',
      isOriginal: true,
      difficulty: 'Core',
      tags: ['coherence', 'text explanation', 'wavelength change'],
      scenario: 'A 600 lines/mm transmission grating is illuminated normally by coherent monochromatic light. The original wavelength is 500 nm, and it is changed to 600 nm while the grating remains fixed. A student also asks why principal maxima are narrow.',
      scenarioZh: '相干單色光垂直照射每毫米 600 線的透射光柵。原波長為 500 nm，光柵不變時換成 600 nm。學生亦問為何主極大很窄。',
      parts: [
        { label: '(a)', question: 'Explain how diffraction and coherent interference produce the principal maxima. State the integer condition.', questionZh: '解釋衍射及相干干涉如何產生主極大，並指出整數條件。', answer: 'Light spreads by diffraction from each slit, allowing waves from many slits to overlap. They start in phase under normal coherent illumination. When adjacent-slit path difference d sin θ equals nλ for an integer n, all slit contributions arrive in phase and constructively interfere, forming a principal maximum. Physical orders also require |n|λ ≤ d. At other directions, phase differences cause substantial cancellation, so many slits give narrow principal peaks rather than equal brightness in all directions.', answerZh: '光在各縫衍射並擴散，使許多狹縫的波重疊。垂直相干照射時，各波起初同相。若相鄰光程差 d sin θ 等於整數 n 倍的 λ，各縫的波便同相到達，因相長干涉形成主極大。物理級數亦須滿足 |n|λ ≤ d。其他方向的相位差造成顯著抵消，故多縫產生窄主峰，而非各方向亮度相同。', marks: 3 },
        { label: '(b)', question: 'Explain and calculate the change of the second-order angle when wavelength increases to 600 nm. Check availability and state what happens to zero order.', questionZh: '解釋並計算波長增加至 600 nm 時第二級角度的變化，檢查容許條件並指出零級變化。', answer: 'Spacing remains d = 1.6667 × 10⁻⁶ m and the order stays the integer q = 2. A longer wavelength increases the required path difference, so sin θ2 = 2λ/d increases from 0.600 to 0.720. Both are below 1, so second order remains available on a finite screen. Its angle increases from 36.87° to 46.05° and it moves farther from the central axis. Zero order remains at θ = 0 because its required path difference is zero for either wavelength.', answerZh: '間距仍為 d = 1.6667 × 10⁻⁶ m，級數仍是整數 q = 2。波長增加使所需光程差增加，所以 sin θ2 = 2λ/d 由 0.600 增至 0.720。兩者均小於 1，故第二級仍可在有限屏幕上存在。角度由 36.87° 增至 46.05°，遠離中央軸。零級對兩波長所需光程差均為零，故仍在 θ = 0。', marks: 3 },
        { label: '(c)', question: 'Why does observing no third-order spot after the change not, by itself, prove that the grating is faulty? Use the order bound.', questionZh: '為何改變後看不到第三級光點，本身不能證明光柵損壞？使用級數上限解釋。', answer: 'For 600 nm, third order would require sin θ3 = 3λ/d = 1.08, which exceeds 1 and is physically impossible. The geometric bound is floor(d/λ) = floor(2.778) = 2. Thus absence of third order is predicted by the grating law, not evidence of a fault. Even for an allowed order, weak intensity, limited screen width or alignment could prevent observation.', answerZh: '600 nm 時，第三級需要 sin θ3 = 3λ/d = 1.08，大於 1，物理上不可能。幾何上限為 floor(d/λ) = floor(2.778) = 2，所以缺少第三級是光柵定律的預測，不是損壞證據。即使級數容許，亮度弱、屏幕不夠闊或校準問題亦可令其不可見。', marks: 2 },
      ],
      totalMarks: 8,
    },
    {
      id: 'grating-original-spectrometer-screen',
      topicId: 'diffraction-grating',
      source: 'Original bilingual practice',
      year: 'Original DSE-style',
      isOriginal: true,
      difficulty: 'Application',
      tags: ['spectrometer', 'both sides', 'laser safety', 'exact trigonometry'],
      scenario: 'In a properly aligned normal-incidence spectrometer experiment using an isolated monochromatic lamp line and a 600 lines/mm grating, the same first-order line is read at 128.4° on the left and 171.6° on the right. The readings are already unwrapped on the same scale. In a separate laser-screen experiment with the same grating, the known +2 and −2 spots are 1.80 m apart on a perpendicular screen 1.20 m downstream.',
      scenarioZh: '已正確校準為垂直入射的分光計，用每毫米 600 線光柵及選定的單色燈譜線，同一第一級在左讀 128.4°，在右讀 171.6°。讀數已在同一刻度正確展開。另一雷射屏幕實驗用相同光柵，已知 +2、−2 光點在下游 1.20 m 的垂直屏幕上相距 1.80 m。',
      parts: [
        { label: '(a)', question: 'Determine the diffraction angle and wavelength in the spectrometer experiment. Explain why the full reading difference is not used as θ.', questionZh: '求分光計實驗的衍射角及波長，並解釋為何不把完整讀數差當作 θ。', answer: 'At normal incidence the same +1 and −1 line directions are symmetric, so their 171.6° − 128.4° = 43.2° separation contains two one-sided angles. θ1 = 43.2°/2 = 21.6°. With d = 1/(600000) = 1.6667 × 10⁻⁶ m and the known integer q = 1, λ = d sin 21.6°/1 = 6.14 × 10⁻⁷ m ≈ 614 nm. The ratio qλ/d ≈ 0.368 < 1 checks availability. The full separation is not the angle from the central axis.', answerZh: '垂直入射時，同一 +1、−1 譜線方向對稱，所以 171.6° − 128.4° = 43.2° 的完整角距含兩個單側角度。θ1 = 43.2°/2 = 21.6°。d = 1/(600000) = 1.6667 × 10⁻⁶ m，並用已知整數 q = 1，λ = d sin 21.6°/1 = 6.14 × 10⁻⁷ m ≈ 614 nm。qλ/d ≈ 0.368 < 1，確認容許。完整角距不是從中央軸量起的角度。', marks: 3 },
        { label: '(b)', question: 'Explain two benefits and one limitation of measuring both sides and repeating readings.', questionZh: '解釋量度兩側及重複讀數的兩個好處與一個限制。', answer: 'A common additive dial-zero offset cancels when the two readings are subtracted, and repeating and averaging reduces random reading scatter. The one-sided angles can also be compared to test normal-incidence symmetry. A limitation is that averaging does not remove incorrect grating density or all alignment errors; a large left/right mismatch requires realignment, not blind averaging.', answerZh: '共同的刻度加性零點偏移在兩讀數相減時抵消；重複並取平均可減少隨機讀數波動。兩單側角度亦可比較以檢查垂直入射的對稱。一個限制是取平均不能消除錯誤線密度或所有校準誤差；左右差別大時須重新校準，而非盲目取平均。', marks: 3 },
        { label: '(c)', question: 'Calculate the laser wavelength using exact geometry. Explain why sin θ = 1.80/1.20 is wrong.', questionZh: '用精確幾何求雷射波長，並解釋為何 sin θ = 1.80/1.20 錯誤。', answer: 'The 1.80 m is a full symmetric pair distance, so x2 = 1.80/2 = 0.900 m from the centre. Exact geometry gives tan θ2 = x2/D = 0.750, θ2 = 36.87° and sin θ2 = 0.600. For the known integer q = 2, λ = d sin θ2/2 = 5.00 × 10⁻⁷ m = 500 nm; 2λ/d = 0.600 < 1 verifies a finite-screen order. The proposed ratio uses both the wrong displacement and the wrong trigonometric function: transverse/axial is tangent, not sine.', answerZh: '1.80 m 是完整對稱光點距離，所以中央至單側 x2 = 1.80/2 = 0.900 m。精確幾何給出 tan θ2 = x2/D = 0.750，θ2 = 36.87°，sin θ2 = 0.600。已知整數 q = 2 時，λ = d sin θ2/2 = 5.00 × 10⁻⁷ m = 500 nm；2λ/d = 0.600 < 1，確認有限屏幕級數。所提比值同時用了錯誤位移及三角函數：橫向/軸向是正切，不是正弦。', marks: 3 },
        { label: '(d)', question: 'State two concrete laser-safety precautions and whether the laser orders should be viewed through the spectrometer telescope.', questionZh: '指出兩項具體雷射安全措施，並說明能否透過分光計望遠鏡觀察雷射級數。', answer: 'Clamp the laser securely and direct all beams away from eyes onto a screen or beam stop; remove shiny objects near the beam to avoid hazardous reflections. Do not look into direct, diffracted or reflected beams and never view laser orders through a telescope, which collects the beam into the eye. Switch off before rearranging and follow the teacher-approved risk assessment.', answerZh: '穩固夾緊雷射，把各光束遠離眼睛並導向屏幕或擋光器；移走光路附近的光亮物以避免危險反射。不可直視直接、衍射或反射光束，更不可透過望遠鏡觀看雷射級數，因望遠鏡會把光束收集至眼睛。改動裝置前須關掉光源並依從教師批准的風險評估。', marks: 2 },
      ],
      totalMarks: 11,
    },
  ],
  sources: [
    {
      title: '[1] HKEAA — HKDSE Physics List of Data, Formulae and Relationships',
      url: 'https://www.hkeaa.edu.hk/DocLibrary/HKDSE/Subject_Information/phy/Phy-Formulae-e.pdf',
      supports: 'Official item C2 prints d sin θ = n λ as the diffraction grating equation. The mathematics section explicitly restricts sin θ ≈ tan θ ≈ θ to small angles with θ in radians. Used to verify the equation and approximation condition, not to claim any original practice question or mark allocation is official. The integer-order bound and grazing discussion are mathematical consequences explained in this lesson.',
    },
    {
      title: '[2] OpenStax — University Physics Volume 3, 4.4 Diffraction Gratings',
      url: 'https://openstax.org/books/university-physics-volume-3/pages/4-4-diffraction-gratings',
      supports: 'Reputable textbook account of many equally spaced slits, narrow principal maxima, spectroscopy, reciprocal line density and screen trigonometry. Read alongside College Physics 2e §27.4 for an explicit adjacent-ray path-difference and in-phase constructive-interference explanation. Lesson wording, numerical data and practice sets are original.',
    },
    {
      title: '[2] OpenStax — College Physics 2e, 27.4 Multiple Slit Diffraction',
      url: 'https://openstax.org/books/college-physics-2e/pages/27-4-multiple-slit-diffraction',
      supports: 'Explains that each slit diffracts light, neighbouring rays have path difference d sin θ, and integral wavelength differences make all contributions arrive in phase. Supports the normal-incidence multi-slit mechanism, sharper maxima with more slits, symmetric orders and perpendicular-screen geometry.',
    },
    {
      title: '[3] Brooklyn College — The Diffraction Grating Spectrometer laboratory guide',
      url: 'https://depthome.brooklyn.cuny.edu/physics/lab/phy2/newlabs/Diffraction-grating-ver-2.pdf',
      supports: 'University laboratory instructions specify collimator parallel light, telescope focus at infinity, grating perpendicular to the beam and lines parallel to the slit, repeated undeviated-beam readings, both-side first/second-order measurements and averaged diffraction angles. Supports the experimental method; the additive-offset cancellation explanation follows from subtraction of paired readings under symmetry.',
    },
    {
      title: '[4] Institute of Physics — Diffraction of Light collection',
      url: 'https://spark.iop.org/collections/diffraction-light',
      supports: 'The laser-light demonstration directs teachers to clamp the source firmly towards a screen, avoid students’ eyes, and remove shiny reflective objects near the beam. Supports practical laser precautions. The lesson additionally prohibits telescope viewing of laser beams and requires an approved source and local risk assessment; it does not repeat an unqualified claim that direct laser viewing is harmless.',
    },
  ],
};
