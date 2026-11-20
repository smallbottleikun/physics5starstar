import type { ReaderSolution } from "./exam-reader-data";
import type { PartVisual } from "./exam-marking-guides";

export type ExamPartGuide = {
  label: string;
  original: string;
  originalZh: string;
  reasoning: string;
  reasoningZh: string;
  formulas: string[];
  visual?: PartVisual;
};

export const examPartGuides: Record<string, ExamPartGuide[]> = {
  "2526-1": [
    { label: "(a)", original: "t = 1010 s.", originalZh: "加熱時間為 1010 s。", reasoning: "Use the heating power as the rate of energy transfer. The required energy is mcΔT, so set Pt = mcΔT.", reasoningZh: "功率就是每秒輸入的能量。先用 Q = mcΔT 求湯吸收的熱能，再用 t = Q/P；溫差是 100 − 20 = 80 °C。", formulas: ["Q=mcΔT", "Pt=mcΔT"] },
    { label: "(b)(i)", original: "T₁ = 91.1 °C.", originalZh: "混合物溫度 T₁ = 91.1 °C。", reasoning: "The soup loses energy while the vegetable gains energy. During the 2 s interval, the stove supplies an additional 1000 × 2 J.", reasoningZh: "以能量守恆列式：蔬菜吸收的熱能 = 湯失去的熱能 + 爐在 2 s 供給的能量。注意兩邊最後到達同一個 T₁。", formulas: ["0.5(3000)(T₁−15)=3(4200)(100−T₁)+1000(2)"] },
    { label: "(b)(ii)", original: "128 s.", originalZh: "再需 128 s 回到 100 °C。", reasoning: "After mixing, use the stove energy to heat the vegetable from 15 °C to 100 °C as specified by the marking scheme model.", reasoningZh: "按照原答案的模型，只計算蔬菜由 15 °C 升至 100 °C 所需的能量，再除以 1000 W；因此 t = 0.5(3000)(100−15)/1000 = 127.5 s ≈ 128 s。", formulas: ["Pt=mcΔT"] },
  ],
  "2526-2": [
    { label: "(a)", original: "n_total = 16.0 mol.", originalZh: "兩個容器共有 16.0 mol 氮氣。", reasoning: "Initially both vessels have the same pressure and temperature, so use the total volume in pV=nRT.", reasoningZh: "初始兩容器同溫同壓，可把總體積 0.1 + 0.3 = 0.4 m³ 一次代入理想氣體方程。", formulas: ["pV=nRT", "n=pV/(RT)"] },
    { label: "(b)", original: "n_A = 6.42 mol; n_B = 9.63 mol.", originalZh: "A 有 6.42 mol，B 有 9.63 mol。", reasoning: "At equilibrium the pressure is common. Since n = pV/RT, n_A:n_B = V_A/T_A : V_B/T_B, then conserve total moles.", reasoningZh: "平衡後兩容器壓強相同，所以莫耳數比例由 V/T 決定，而不是只按體積比例。先求 n_A:n_B = 2:3，再用總莫耳數分配。", formulas: ["n=pV/(RT)", "n_A/n_B=V_AT_B/(T_AV_B)", "n_A+n_B=n_total"] },
    { label: "(c)", original: "2.41 mol passes from B to A.", originalZh: "有 2.41 mol 氮氣由 B 流向 A。", reasoning: "Find the initial amount in A and compare it with the final amount in A. The increase in A must have crossed the capillary tube.", reasoningZh: "先求 A 原本的莫耳數，再用 A 最終莫耳數減去初始莫耳數。正數代表氣體由 B 流向 A。", formulas: ["n_initial,A=pV_A/(RT)", "n_passed=n_final,A−n_initial,A"] },
  ],
  "2526-3": [
    { label: "(a)(i)", original: "Free-body diagram: weight mg vertically downward, normal reaction R perpendicular to the slope, friction f up the slope.", originalZh: "自由體圖包括：垂直向下的重力 mg、垂直斜面的支持力 R，以及沿斜面向上的摩擦力 f。", reasoning: "The car tends to slide down the 30° slope under the component mg sin30°. Static friction therefore acts up the slope. The normal force is perpendicular to the contact surface.", reasoningZh: "未施加水平力時，木車有沿斜面向下滑的趨勢，所以靜摩擦力必須沿斜面向上。支持力一定垂直於斜面，重力則垂直向下。畫力圖時不要把摩擦力畫成水平。", formulas: ["mg", "mg sinθ", "mg cosθ"] },
    { label: "(a)(ii)", original: "f = mg sin30° = 0.491 N; R = mg cos30° = 0.850 N.", originalZh: "摩擦力為 0.491 N，支持力為 0.850 N。", reasoning: "The car is at rest, so the resultant force is zero. Resolve mg parallel and perpendicular to the plane, then balance each component.", reasoningZh: "木車靜止，斜面方向合力為零，因此 f = mg sin30°；垂直斜面方向合力為零，因此 R = mg cos30°。代入 m = 0.100 kg、g = 9.81 m s⁻²。", formulas: ["ΣF_parallel=0", "f=mg sinθ", "R=mg cosθ"] },
    { label: "(b)", original: "The car moves up the wedge.", originalZh: "木車會沿斜面向上移動。", reasoning: "When the wedge accelerates, the car tends to lag behind because of inertia. Relative to the accelerating wedge, this is an upward tendency along the slope.", reasoningZh: "楔塊向左加速時，木車因慣性傾向保持原來的水平運動狀態；相對於向左移動的楔塊，木車會沿斜面向上。因此滑動方向是向上，不是向下。", formulas: ["F=ma", "inertia"] },
  ],
  "2526-4": [
    { label: "(a)", original: "v_Q = 1.88 m s⁻¹.", originalZh: "球離開軌道時速率為 1.88 m s⁻¹。", reasoning: "From P to Q the track is frictionless, so gravitational potential energy lost becomes kinetic energy gained.", reasoningZh: "P 到 Q 沒有摩擦，機械能守恆；球下降 0.18 m，mgh = ½mv²，質量會約掉。", formulas: ["mgh=½mv²", "v=√(2gh)"] },
    { label: "(b)", original: "t = 0.163 s; horizontal distance = 0.306 m.", originalZh: "飛行時間為 0.163 s，水平距離為 0.306 m。", reasoning: "Treat vertical and horizontal motion independently. Vertically, the ball falls 0.13 m from rest; horizontally it travels at constant speed v_Q.", reasoningZh: "飛出 Q 後，垂直方向是初速為零的自由落體，先求 t；水平方向沒有加速度，所以 x = v_Qt。", formulas: ["s_y=½gt²", "x=v_xt"] },
    { label: "(c)", original: "The result in (b) is unchanged.", originalZh: "(b) 的結果不變。", reasoning: "Mass cancels from v=√(2gh), and the gravitational acceleration is independent of the ball's mass.", reasoningZh: "由 v = √(2gh) 可見離開 Q 的速率與質量無關；飛行時間由高度和 g 決定，水平距離 x = vt 也因此不變。", formulas: ["v=√(2gh)", "g is independent of mass"] },
  ],
  "2526-5": [
    { label: "(a)", original: "Suspend the cardboard from one hole, draw the vertical plumb line, repeat using another hole, and take the intersection as the centre of gravity.", originalZh: "從一個孔懸掛紙板並畫鉛垂線，再從另一孔重複；兩條鉛垂線交點就是重心。", reasoning: "A freely suspended object is in rotational equilibrium. Its centre of gravity must lie vertically below the suspension point, so every suspension hole gives a line containing the same centre of gravity.", reasoningZh: "紙板自由懸掛後達到轉動平衡，重心必在懸掛點正下方的鉛垂線上。換另一個孔會得到另一條同樣包含重心的線，交點就是重心。", formulas: ["Στ=0", "centre of gravity lies on the plumb line"] },
  ],
  "2526-6": [
    { label: "(a)", original: "A sufficiently large temperature gradient over a short height and a sufficiently long light path are required.", originalZh: "需要短距離內有足夠大的溫度梯度，以及足夠長的光路。", reasoning: "The refractive-index changes between layers are very small, so the small deviations must accumulate over a long distance to produce a visible mirage.", reasoningZh: "每層空氣的折射率差很小，單次偏折很微弱；只有溫度差夠大而且光走得夠遠，偏折才會累積到肉眼可見。", formulas: ["n varies with temperature"] },
    { label: "(b)(i)", original: "n₁ sinθ₁ = n₄ sinθ₄; for θ₄=90°, θ₁ ≈ 89.49°.", originalZh: "n₁sinθ₁ = n₄sinθ₄；當 θ₄ = 90° 時，θ₁ ≈ 89.49°。", reasoning: "Apply Snell's law at each parallel boundary. The intermediate angles cancel, leaving a relation between the first and last layers. At the limiting ray, the final refracted ray is along the boundary.", reasoningZh: "每個界面都用斯涅耳定律；因為界面互相平行，中間角度逐步消去，只剩 n₁sinθ₁ = n₄sinθ₄。剛好全內反射時折射角是 90°，再代入 n₁、n₄。", formulas: ["n₁sinθ₁=n₄sinθ₄", "θ₄=90°"] },
    { label: "(b)(ii)", original: "L ≈ 168 m.", originalZh: "L 約為 168 m。", reasoning: "Use α+θ₁=90° to obtain α, then use the right-triangle relation tanα=h/L.", reasoningZh: "先用互餘角求 α = 90° − θ₁，再由圖中的直角三角形 tanα = h/L，移項得 L = h/tanα。", formulas: ["α=90°−θ₁", "tanα=h/L"] },
  ],
  "2526-7": [
    { label: "(a)", original: "F = 1.98 × 10²⁰ N.", originalZh: "地球與月球之間的萬有引力為 1.98 × 10²⁰ N。", reasoning: "Substitute the two masses and their separation into Newton's law of universal gravitation.", reasoningZh: "直接使用萬有引力定律，距離 r 要平方，並保持 SI 單位。", formulas: ["F=GMm/r²"] },
    { label: "(b)(i)", original: "v = 1020 m s⁻¹.", originalZh: "月球軌道速率為 1020 m s⁻¹。", reasoning: "Gravity supplies the centripetal force, so set GMm/r² equal to mv²/r and cancel m.", reasoningZh: "月球作圓周運動所需的向心力由地球引力提供；兩個力相等後可約去月球質量。", formulas: ["GMm/r²=mv²/r", "v=√(GM/r)"] },
    { label: "(b)(ii)", original: "T = 27.4 days.", originalZh: "軌道週期為 27.4 days。", reasoning: "One orbit has circumference 2πr. Divide this distance by the orbital speed, then convert seconds to days.", reasoningZh: "一周路程是 2πr，週期 T = 路程／速率；最後把秒除以 60×60×24 轉成日。", formulas: ["T=2πr/v"] },
    { label: "(c)", original: "The gravitational field strength due to Earth at the Moon is larger.", originalZh: "月球位置的地球引力場強度較大。", reasoning: "Compare the field produced by Earth with the field produced by the Moon using g=GM/r²; the relevant distance to Earth is much smaller and Earth's mass is much larger.", reasoningZh: "引力場強度由 g = GM/r² 決定。月球所在位置離地球的距離和質量比例，使地球造成的場強較大。", formulas: ["g=GM/r²"] },
  ],
  "2526-8": [
    { label: "(a)", original: "Concave lens.", originalZh: "凹透鏡。", reasoning: "A real object forming an upright, diminished image is the characteristic result for a concave lens.", reasoningZh: "實物經凹透鏡一定形成正立、縮小、虛像，這是辨認凹透鏡的關鍵。", formulas: ["m=h_i/h_o"] },
    { label: "(b)(i)", original: "Correct position and size of the virtual, upright, diminished image.", originalZh: "畫出位置和大小正確的正立縮小虛像。", reasoning: "Extend the refracted rays backwards; their apparent intersection gives the virtual image position.", reasoningZh: "折射光線實際上不會在物方後方會聚，要把折射光線向後延長，交點就是虛像位置。", formulas: ["m=h_i/h_o"] },
    { label: "(b)(ii)", original: "Correct ray through the optical centre and correct virtual focus.", originalZh: "畫出通過光心的光線及正確的虛焦點。", reasoning: "A ray through the optical centre is approximately undeviated. A ray parallel to the principal axis diverges as if it came from the focus.", reasoningZh: "通過光心的光線近似不偏折；平行主軸的光線折射後向外發散，把它向後延長便可找到虛焦點。", formulas: ["parallel ray appears to come from focus"] },
    { label: "(b)(iii)", original: "Correct ray from the object head to the lens and from the lens to the observer.", originalZh: "由物體頂端到透鏡，再由透鏡到觀察者的光線正確。", reasoning: "The observer sees the image by tracing the emergent ray backwards to the point from which it appears to originate.", reasoningZh: "眼睛接收到的是折射後光線；把這條光線向後反向延長，便能連到虛像頂端，完成作圖。", formulas: ["angle of incidence = angle of refraction only for plane interfaces"] },
  ],
  "2526-9": [
    { label: "(a)(i)", original: "v = 0.167 m s⁻¹.", originalZh: "碰撞後速度為 0.167 m s⁻¹。", reasoning: "Take the original motion of A and James as positive and apply conservation of momentum to the completely inelastic collision.", reasoningZh: "把 A 船及 James 原本的方向定為正，碰撞後兩船黏在一起，使用總動量守恆。", formulas: ["m_Au_A+m_Bu_B=(m_A+m_B)v"] },
    { label: "(a)(ii)", original: "Loss in kinetic energy = 5.00 J.", originalZh: "動能損失為 5.00 J。", reasoning: "Calculate total kinetic energy before and after collision; subtract the final value from the initial value.", reasoningZh: "動能不是碰撞中守恆量，所以分別求碰撞前後總動能，再用前者減後者。", formulas: ["KE=½mv²", "ΔKE=KE_before−KE_after"] },
    { label: "(b)", original: "At least 2 wooden blocks.", originalZh: "至少要拋出 2 塊木塊。", reasoning: "Set the final boat speeds equal for the limiting case, apply momentum conservation to the whole system and then to boat B plus the blocks. The calculated block mass is 9.42 kg, so round up to 2 blocks.", reasoningZh: "臨界不相撞情況是兩船最後速度相同；先對整個系統列動量守恆求共同速度，再只對 B 船和木塊列一次動量守恆，得到所需質量 9.42 kg。每塊 5 kg，因此必須向上取整為 2 塊。", formulas: ["momentum conservation", "M×4=(M+200)×0.18"] },
  ],
  "2526-10": [
    { label: "(a)", original: "d = 3.33 × 10⁻⁶ m.", originalZh: "光柵間距 d = 3.33 × 10⁻⁶ m。", reasoning: "3000 lines per cm means 3000×100 lines per metre. The spacing is the reciprocal of the line density.", reasoningZh: "先把每厘米 3000 條換成每米的條數，再取倒數；不要直接把 0.01 當成間距。", formulas: ["d=1/(line density)"] },
    { label: "(b)", original: "45 cm is the zeroth-order line; 9 cm and 81 cm are first-order lines.", originalZh: "45 cm 是零級明紋；9 cm 和 81 cm 是一級明紋。", reasoning: "The central maximum is at the midpoint of the symmetric pattern. Equal distances on either side correspond to the same order.", reasoningZh: "中央亮紋在對稱圖樣的中點 45 cm；左右等距的 9 cm 和 81 cm 是一對對稱的一級明紋。", formulas: ["central maximum: n=0"] },
    { label: "(c)", original: "λ = 590 nm.", originalZh: "波長 λ = 590 nm。", reasoning: "Use screen geometry to find sinθ for the first order, then substitute into d sinθ=nλ with n=1.", reasoningZh: "由中央到一級明紋的水平距離和光柵到屏幕距離組成直角三角形，求 sinθ；再代入光柵方程求波長。", formulas: ["sinθ=x/√(x²+D²)", "d sinθ=nλ"] },
    { label: "(d)", original: "Maximum order = 5.", originalZh: "最高級次為 5。", reasoning: "A real diffraction order requires sinθ≤1, so nλ≤d. Take the largest integer not greater than d/λ.", reasoningZh: "因為 sinθ 不可大於 1，所以 nλ ≤ d；計算 d/λ = 5.64 後，最高整數級次是 5，不可四捨五入成 6。", formulas: ["n_max≤d/λ"] },
  ],
};

export function getExamPartGuides(solution: ReaderSolution): ExamPartGuide[] | undefined {
  return examPartGuides[`${solution.yearId}-${solution.question}`];
}
