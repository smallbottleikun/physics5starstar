import type { Formula, FormulaSheetEntry, KeyPoint, SymbolDef, Topic } from "./physics-content";

const point = (en: string, zh: string): KeyPoint => ({ en, zh });
const symbol = (symbol: string, meaning: string, meaningZh: string, unit: string): SymbolDef => ({ symbol, meaning, meaningZh, unit });

interface NamedFormula extends Formula {
  name: string;
  nameZh: string;
}

const formula = (
  name: string,
  nameZh: string,
  latex: string,
  description: string,
  descriptionZh: string,
  symbols: SymbolDef[],
): NamedFormula => ({ name, nameZh, latex, description, descriptionZh, symbols });

const mechanics = (
  id: string,
  title: string,
  titleZh: string,
  icon: string,
  summary: string,
  summaryZh: string,
  keyPoints: KeyPoint[],
  formulas: NamedFormula[],
  examTips: KeyPoint[],
): Topic => ({
  id,
  title,
  titleZh,
  category: "Mechanics",
  categoryZh: "力學",
  color: "orange",
  accentColor: "#f97316",
  icon,
  summary,
  summaryZh,
  keyPoints,
  formulas,
  examTips,
});

const heat = (
  id: string,
  title: string,
  titleZh: string,
  icon: string,
  summary: string,
  summaryZh: string,
  keyPoints: KeyPoint[],
  formulas: NamedFormula[],
  examTips: KeyPoint[],
): Topic => ({
  id,
  title,
  titleZh,
  category: "Heat",
  categoryZh: "熱學",
  color: "red",
  accentColor: "#ef4444",
  icon,
  summary,
  summaryZh,
  keyPoints,
  formulas,
  examTips,
});

const newtonMomentumFormula = formula(
  "Newton's Second Law in Momentum Form",
  "動量形式的牛頓第二定律",
  "\\sum F = \\frac{\\Delta p}{\\Delta t}",
  "Resultant force equals the rate of change of momentum.",
  "合力等於動量的變化率。",
  [
    symbol("ΣF", "Resultant external force", "合外力", "N"),
    symbol("Δp", "Change in momentum", "動量變化", "kg·m/s or N·s"),
    symbol("Δt", "Time interval", "時間間隔", "s"),
  ],
);

const componentEquationFormula = formula(
  "Component Form of Newton's Second Law",
  "牛頓第二定律的分量形式",
  "\\sum F_x = ma_x, \\quad \\sum F_y = ma_y",
  "Apply Newton's Second Law separately along two chosen perpendicular axes.",
  "沿兩條選定的垂直座標軸分別應用牛頓第二定律。",
  [
    symbol("ΣFₓ, ΣFᵧ", "Resultant force in each direction", "各方向的合力", "N"),
    symbol("m", "Mass", "質量", "kg"),
    symbol("aₓ, aᵧ", "Acceleration components", "加速度分量", "m/s²"),
  ],
);

const angledPowerFormula = formula(
  "Power for an Angled Force",
  "斜向力的功率",
  "P = Fv\\cos\\theta",
  "Instantaneous power when a force makes an angle with velocity.",
  "當力與速度成夾角時的瞬時功率。",
  [
    symbol("P", "Power", "功率", "W"),
    symbol("F", "Applied force", "施加的力", "N"),
    symbol("v", "Speed in the direction of motion", "沿運動方向的速度", "m/s"),
    symbol("θ", "Angle between force and velocity", "力與速度的夾角", "degrees (°)"),
  ],
);

const heatCapacityFormula = formula(
  "Heat Capacity",
  "熱容",
  "E = C\\Delta T",
  "Energy transferred for a temperature change of a whole object.",
  "使整個物體產生溫度改變的能量轉移。",
  [
    symbol("E", "Energy transferred", "轉移的能量", "J"),
    symbol("C", "Heat capacity of the whole object", "整個物體的熱容", "J/K"),
    symbol("ΔT", "Temperature change", "溫度改變", "K or °C"),
  ],
);

const electricalHeatingFormula = formula(
  "Electrical Heating Energy",
  "電加熱能量",
  "E = Pt",
  "Electrical energy supplied by a heater of constant power.",
  "由恆定功率加熱器供應的電能。",
  [
    symbol("E", "Electrical energy supplied", "供應的電能", "J"),
    symbol("P", "Power rating", "額定功率", "W"),
    symbol("t", "Heating time", "加熱時間", "s"),
  ],
);

export const expandedTopics: Topic[] = [
  mechanics(
    "kinematics",
    "Position, Motion & Graphs",
    "位置、運動與圖像",
    "📈",
    "Kinematics describes motion using position, displacement, velocity and acceleration. Graphs connect the mathematical description of motion with what actually happens to an object.",
    "運動學以位置、位移、速度和加速度描述物體運動；圖像把數學關係與實際運動聯繫起來。",
    [
      point("Distance is a scalar; displacement is a vector with magnitude and direction.", "路程是純量；位移是具有大小和方向的向量。"),
      point("Speed uses distance, while velocity uses displacement. Both can be average or instantaneous.", "速率以路程計算，速度以位移計算；兩者均可分為平均值及瞬時值。"),
      point("Acceleration is the rate of change of velocity. A negative acceleration means acceleration is opposite to the chosen positive direction.", "加速度是速度的變化率；負加速度表示加速度方向與所選正方向相反。"),
      point("The gradient of a displacement–time graph is velocity. The gradient of a velocity–time graph is acceleration.", "位移—時間圖的斜率是速度；速度—時間圖的斜率是加速度。"),
      point("The signed area under a velocity–time graph gives displacement; include areas below the time axis as negative.", "速度—時間圖下的有正負面積代表位移；時間軸下方的面積須視為負值。"),
    ],
    [
      formula("Average Speed", "平均速率", "\\text{average speed} = \\frac{d}{t}", "Distance travelled per unit time.", "每單位時間所走的路程。", [symbol("d", "Distance travelled", "路程", "m"), symbol("t", "Time taken", "所需時間", "s")]),
      formula("Average Velocity", "平均速度", "\\bar{v} = \\frac{\\Delta s}{\\Delta t}", "Displacement change per unit time.", "每單位時間的位移改變。", [symbol("v̄", "Average velocity", "平均速度", "m/s"), symbol("Δs", "Displacement", "位移", "m"), symbol("Δt", "Time interval", "時間間隔", "s")]),
      formula("Acceleration", "加速度", "a = \\frac{v-u}{t}", "Acceleration for motion with a constant acceleration.", "勻加速運動的加速度。", [symbol("a", "Acceleration", "加速度", "m/s²"), symbol("u", "Initial velocity", "初速度", "m/s"), symbol("v", "Final velocity", "末速度", "m/s"), symbol("t", "Time", "時間", "s")]),
      formula("Uniformly Accelerated Motion", "勻加速直線運動", "v=u+at,\\quad s=ut+\\frac{1}{2}at^2,\\quad v^2=u^2+2as", "Three standard equations for constant acceleration in one dimension.", "一維勻加速運動的三條常用方程。", [symbol("s", "Displacement", "位移", "m"), symbol("u, v", "Initial and final velocity", "初速度及末速度", "m/s"), symbol("a", "Constant acceleration", "恆定加速度", "m/s²"), symbol("t", "Time", "時間", "s")]),
    ],
    [
      point("Choose a positive direction before substituting into an equation, then keep every velocity, displacement and acceleration sign consistent.", "代入方程前先選定正方向，並在速度、位移和加速度中保持相同的正負號約定。"),
      point("A horizontal line on a velocity–time graph means constant velocity, not necessarily zero velocity.", "速度—時間圖的水平線代表恆定速度，不一定代表速度為零。"),
    ],
  ),
  mechanics(
    "projectile-motion",
    "Projectile Motion",
    "拋體運動",
    "🏹",
    "Projectile motion combines independent horizontal motion with vertical motion under a constant downward gravitational acceleration, when air resistance is negligible.",
    "在忽略空氣阻力時，拋體運動由獨立的水平運動及受恆定向下重力加速度的垂直運動組成。",
    [
      point("Horizontal and vertical motions are independent, but they share the same time of flight.", "水平及垂直運動互不影響，但共用相同的飛行時間。"),
      point("With negligible air resistance, horizontal velocity remains constant and vertical acceleration is g downward.", "忽略空氣阻力時，水平速度保持不變，垂直加速度為向下的 g。"),
      point("At the highest point of an oblique projection, vertical velocity is zero but acceleration is still g downward.", "斜拋至最高點時垂直速度為零，但加速度仍為向下的 g。"),
      point("Resolve the initial velocity before using separate horizontal and vertical equations.", "使用水平與垂直方程前，先把初速度分解。"),
      point("The final velocity is found by combining perpendicular velocity components as a vector.", "末速度須把互相垂直的速度分量作向量合成。"),
    ],
    [
      formula("Initial Velocity Components", "初速度分量", "u_x=u\\cos\\theta,\\quad u_y=u\\sin\\theta", "Resolve the launch speed into horizontal and vertical components.", "把發射速度分解為水平及垂直分量。", [symbol("u", "Launch speed", "發射速率", "m/s"), symbol("uₓ, uᵧ", "Horizontal and vertical initial components", "水平及垂直初速度分量", "m/s"), symbol("θ", "Angle above the horizontal", "相對水平的仰角", "degrees (°)")]),
      formula("Projectile Displacement", "拋體位移", "x=u_xt,\\quad y=u_yt-\\frac{1}{2}gt^2", "Equations for a projectile when upward is chosen as positive.", "以上方為正方向時的拋體方程。", [symbol("x, y", "Horizontal and vertical displacement", "水平及垂直位移", "m"), symbol("t", "Time of flight", "飛行時間", "s"), symbol("g", "Gravitational acceleration", "重力加速度", "m/s²")]),
      formula("Vertical Velocity", "垂直速度", "v_y=u_y-gt", "Vertical velocity after time t.", "經過時間 t 後的垂直速度。", [symbol("vᵧ", "Vertical velocity", "垂直速度", "m/s"), symbol("uᵧ", "Initial vertical velocity", "初始垂直速度", "m/s"), symbol("g", "Gravitational acceleration", "重力加速度", "m/s²")]),
    ],
    [
      point("Do not use the total speed in a vertical equation. Use the vertical component only.", "不可在垂直方程中使用總速率；只可使用垂直分量。"),
      point("For a horizontal launch, find the flight time from vertical motion first, then use x = uₓt.", "對水平拋射，先由垂直運動求飛行時間，再使用 x = uₓt。"),
    ],
  ),
  mechanics(
    "momentum",
    "Momentum & Collisions",
    "動量與碰撞",
    "💥",
    "Momentum is a vector measure of motion. In an isolated system, total momentum is conserved during a collision even when kinetic energy changes.",
    "動量是描述運動的向量量。在孤立系統中，即使動能改變，碰撞時總動量仍會守恆。",
    [
      point("Momentum has both magnitude and direction, so a one-dimensional question needs a clear sign convention.", "動量既有大小亦有方向，因此一維題目必須清楚設定正負方向。"),
      point("A resultant force acting for a time interval changes momentum; the product FΔt is impulse.", "合力在一段時間內作用會改變動量；FΔt 稱為衝量。"),
      point("For an isolated system, total momentum before a collision equals total momentum after it.", "對孤立系統，碰撞前的總動量等於碰撞後的總動量。"),
      point("In an inelastic collision, momentum is conserved but some kinetic energy changes into internal energy, sound or deformation.", "非彈性碰撞中動量守恆，但部分動能會轉化為內能、聲能或形變能。"),
      point("Increasing impact time reduces the average force for the same change in momentum.", "在相同動量變化下，延長受力時間可減小平均力。"),
    ],
    [
      formula("Linear Momentum", "線動量", "p=mv", "Momentum of an object moving with velocity v.", "物體以速度 v 運動時的動量。", [symbol("p", "Linear momentum", "線動量", "kg·m/s"), symbol("m", "Mass", "質量", "kg"), symbol("v", "Velocity", "速度", "m/s")]),
      formula("Force and Momentum", "力與動量", "F=\\frac{\\Delta p}{\\Delta t}", "Average resultant force from a momentum change.", "由動量變化求平均合力。", [symbol("F", "Resultant force", "合力", "N"), symbol("Δp", "Change in momentum", "動量變化", "kg·m/s"), symbol("Δt", "Time interval", "時間間隔", "s")]),
      formula("Conservation of Momentum", "動量守恆", "\\sum p_{\\text{before}}=\\sum p_{\\text{after}}", "For an isolated system during an interaction.", "適用於相互作用時的孤立系統。", [symbol("Σp", "Total momentum of the system", "系統總動量", "kg·m/s")]),
    ],
    [
      point("Conserve total system momentum, not the momentum of each individual object.", "守恆的是系統總動量，而不是每個物體各自的動量。"),
      point("List every object's momentum before and after a collision, including its sign, before solving.", "解題前先列出每個物體碰撞前後的動量，並保留其正負號。"),
    ],
  ),
  mechanics(
    "moments-equilibrium",
    "Moments & Equilibrium",
    "力矩與平衡",
    "⚖️",
    "A moment is the turning effect of a force about a pivot. Use the perpendicular distance from the pivot and apply the principle of moments for rotational equilibrium.",
    "力矩是力對支點產生的轉動效應。使用支點至力線的垂直距離，並以力矩原理處理轉動平衡。",
    [
      point("The moment of a force about a pivot equals force × perpendicular distance from the pivot to the line of action of the force.", "力對支點的力矩 = 力 × 支點至力作用線的垂直距離。"),
      point("A pivot is the point or axis about which an object tends to rotate; a hinge or knife edge can act as a pivot.", "支點是物體傾向繞其轉動的點或軸；鉸鏈或刀口均可作支點。"),
      point("Take anticlockwise moments and clockwise moments with opposite signs or compare their magnitudes consistently.", "逆時針和順時針力矩要取相反符號，或一致地比較兩者大小。"),
      point("For rotational equilibrium, the sum of clockwise moments about a pivot equals the sum of anticlockwise moments.", "轉動平衡時，繞支點的順時針力矩總和等於逆時針力矩總和。"),
      point("Choosing the pivot at an unknown reaction force can eliminate that reaction from the moment equation because its perpendicular distance is zero.", "把未知反作用力的支點選作取矩點，可因其垂直距離為零而消去該力矩。"),
    ],
    [
      formula("Moment of a Force", "力矩", "\\tau=Fd", "Turning effect of a force about a pivot.", "力對支點的轉動效應。", [symbol("τ", "Moment of the force", "力矩", "N·m"), symbol("F", "Force", "力", "N"), symbol("d", "Perpendicular distance from pivot to line of action", "支點至力作用線的垂直距離", "m")]),
      formula("Principle of Moments", "力矩原理", "\\sum\\tau_{\\rm clockwise}=\\sum\\tau_{\\rm anticlockwise}", "Condition for rotational equilibrium about a pivot.", "繞支點轉動平衡的條件。", [symbol("τ", "Moment of a force", "力矩", "N·m")]),
      formula("Equilibrium of Forces", "力的平衡", "\\sum F=0", "The resultant force is zero for translational equilibrium.", "平移平衡時合力為零。", [symbol("ΣF", "Resultant force", "合力", "N")]),
    ],
    [
      point("Always draw the line of action and use the shortest perpendicular distance, not the distance along the beam.", "必須畫出力作用線，並使用最短的垂直距離，而不是沿樑的距離。"),
      point("Take moments about a convenient pivot and include only forces with a non-zero perpendicular distance.", "在方便的支點取矩，只需計算垂直距離不為零的力。"),
    ],
  ),
  mechanics(
    "uniform-circular-motion",
    "Uniform Circular Motion",
    "勻速圓周運動",
    "🌀",
    "An object moving at constant speed in a circle still accelerates because its velocity direction continuously changes. The resultant force points to the centre.",
    "物體即使以恆定速率作圓周運動，速度方向持續改變，故仍有加速度；合力指向圓心。",
    [
      point("Uniform circular motion has constant speed but changing velocity, so it has centripetal acceleration.", "勻速圓周運動的速率不變但速度改變，因此具有向心加速度。"),
      point("Centripetal force is the name for the inward resultant force, not a separate extra force.", "向心力是指向圓心的合力名稱，並非額外出現的一種力。"),
      point("Tension, friction, gravity or a normal reaction can provide the required inward force.", "張力、摩擦力、重力或法向反力均可提供所需的向心力。"),
      point("If the inward force disappears, the object initially moves along the tangent.", "若向心力消失，物體最初會沿切線方向運動。"),
      point("One revolution takes a period T; frequency f is the number of revolutions per second.", "完成一周所需時間稱為週期 T；頻率 f 為每秒轉動的圈數。"),
    ],
    [
      formula("Centripetal Acceleration", "向心加速度", "a_c=\\frac{v^2}{r}=\\omega^2r", "Acceleration directed towards the centre of a circular path.", "指向圓形路徑中心的加速度。", [symbol("a_c", "Centripetal acceleration", "向心加速度", "m/s²"), symbol("v", "Linear speed", "線速度", "m/s"), symbol("r", "Radius", "半徑", "m"), symbol("ω", "Angular velocity", "角速度", "rad/s")]),
      formula("Centripetal Force", "向心力", "F_c=\\frac{mv^2}{r}", "Resultant inward force needed for uniform circular motion.", "勻速圓周運動所需的向內合力。", [symbol("F_c", "Centripetal/resultant inward force", "向心／向內合力", "N"), symbol("m", "Mass", "質量", "kg"), symbol("v", "Linear speed", "線速度", "m/s"), symbol("r", "Radius", "半徑", "m")]),
      formula("Circular Speed", "圓周運動速率", "v=\\frac{2\\pi r}{T}=2\\pi rf", "Speed for one revolution every period T.", "每隔週期 T 完成一周時的速率。", [symbol("v", "Linear speed", "線速度", "m/s"), symbol("r", "Radius", "半徑", "m"), symbol("T", "Period", "週期", "s"), symbol("f", "Frequency", "頻率", "Hz")]),
    ],
    [
      point("In a free-body diagram, draw only real forces such as tension or friction; their resultant is the centripetal force.", "自由體圖只畫張力或摩擦力等真實力；它們的合力才是向心力。"),
      point("Constant speed does not mean zero acceleration when the direction changes.", "當運動方向改變時，恆定速率不代表加速度為零。"),
    ],
  ),
  mechanics(
    "gravitation",
    "Gravitation & Orbits",
    "萬有引力與軌道",
    "🪐",
    "Gravitation is the universal attraction between masses. It explains the variation of gravitational field strength and provides the inward force for circular orbits.",
    "萬有引力是質量之間的普遍吸引力；它解釋了重力場強度的變化，並為圓形軌道提供向內力。",
    [
      point("Every pair of masses attracts with equal magnitude and opposite direction along the line joining their centres.", "任何兩個質量會沿其中心連線互相吸引，大小相等、方向相反。"),
      point("Gravitational force and field strength both follow an inverse-square relationship with distance from the planet's centre.", "萬有引力及重力場強度均與距星體中心的距離平方成反比。"),
      point("Mass is constant, whereas weight depends on the local gravitational field strength.", "質量保持不變；重量則取決於當地重力場強度。"),
      point("An orbiting satellite is continually in free fall. Gravity supplies its centripetal resultant force.", "軌道衛星持續作自由落體；重力提供其向心合力。"),
      point("An astronaut appears weightless because no supporting normal force is felt, not because gravity is zero.", "太空人看似失重，是因為沒有感受到支持的法向力，而不是因為重力為零。"),
    ],
    [
      formula("Newton's Law of Gravitation", "萬有引力定律", "F=\\frac{GMm}{r^2}", "Attractive force between two point or spherical masses.", "兩個點質量或球對稱質量之間的吸引力。", [symbol("F", "Gravitational force", "萬有引力", "N"), symbol("G", "Universal gravitational constant", "萬有引力常數", "N·m²/kg²"), symbol("M, m", "Masses", "兩個物體的質量", "kg"), symbol("r", "Centre-to-centre distance", "兩中心之間距離", "m")]),
      formula("Gravitational Field Strength", "重力場強度", "g=\\frac{GM}{r^2}", "Gravitational force per unit mass at distance r from mass M.", "距質量 M 中心 r 處每單位質量所受的重力。", [symbol("g", "Gravitational field strength", "重力場強度", "N/kg or m/s²"), symbol("G", "Universal gravitational constant", "萬有引力常數", "N·m²/kg²"), symbol("M", "Planet mass", "星體質量", "kg"), symbol("r", "Distance from centre", "距中心的距離", "m")]),
      formula("Circular Orbital Speed", "圓軌道速度", "v=\\sqrt{\\frac{GM}{r}}", "Speed of a circular orbit when gravity provides centripetal force.", "重力提供向心力時的圓軌道速度。", [symbol("v", "Orbital speed", "軌道速度", "m/s"), symbol("G", "Universal gravitational constant", "萬有引力常數", "N·m²/kg²"), symbol("M", "Planet mass", "星體質量", "kg"), symbol("r", "Orbital radius from centre", "由中心量起的軌道半徑", "m")]),
    ],
    [
      point("In F = GMm/r², r is measured from the centre of the planet, so use planet radius + altitude.", "在 F = GMm/r² 中，r 由行星中心量起，因此應使用行星半徑加高度。"),
      point("For a circular orbit, set gravitational force equal to the required centripetal resultant force.", "對圓形軌道，令萬有引力等於所需的向心合力。"),
    ],
  ),
  heat(
    "heat-capacity-calorimetry",
    "Heat Capacity & Calorimetry",
    "熱容、比熱容與量熱法",
    "🧪",
    "Calorimetry tracks energy transfers during temperature changes. It links the properties of a material to heating, cooling and the efficiency of real devices.",
    "量熱法追蹤物質在溫度變化時的能量轉移，並把材料特性連繫至加熱、冷卻及真實裝置的效率。",
    [
      point("Heat capacity is the energy needed to raise the temperature of a whole object by 1 K; specific heat capacity refers to 1 kg of a material.", "熱容是令整個物體升高 1 K 所需的能量；比熱容則針對 1 kg 某種物質。"),
      point("For an insulated system, total energy lost equals total energy gained.", "對絕熱系統，總失去的能量等於總獲得的能量。"),
      point("Water has a high specific heat capacity, so it is useful for cooling systems and moderates temperatures near large bodies of water.", "水的比熱容高，故適合用於冷卻系統，亦會調節大型水域附近的溫度。"),
      point("In real calorimetry, energy can also heat the container or escape to the surroundings.", "真實量熱實驗中，能量亦可加熱容器或散失至環境。"),
      point("Heating efficiency compares useful energy gained by the target with electrical energy supplied.", "加熱效率比較目標物獲得的有用能量與輸入電能。"),
    ],
    [
      heatCapacityFormula,
      formula("Specific Heat Capacity", "比熱容", "E=mc\\Delta T", "Energy transferred when a mass changes temperature without changing state.", "物質沒有改變狀態時因溫度改變而轉移的能量。", [symbol("E", "Energy transferred", "轉移的能量", "J"), symbol("m", "Mass", "質量", "kg"), symbol("c", "Specific heat capacity", "比熱容", "J/(kg·K)"), symbol("ΔT", "Temperature change", "溫度改變", "K or °C")]),
      electricalHeatingFormula,
      formula("Heating Efficiency", "加熱效率", "\\eta=\\frac{E_{\\text{useful}}}{E_{\\text{input}}}\\times100\\%", "Fraction of input energy transferred usefully to the target.", "輸入能量中有效轉移至目標物的比例。", [symbol("η", "Efficiency", "效率", "%"), symbol("Euseful", "Useful energy gained", "有用能量輸出", "J"), symbol("Einput", "Input energy", "輸入能量", "J")]),
    ],
    [
      point("Use a temperature change ΔT, not the final temperature, in E = mcΔT. Convert every mass to kg.", "在 E = mcΔT 中使用溫度改變 ΔT，而非末溫；所有質量先轉換為 kg。"),
      point("State the system boundary and include every stated object in the energy balance.", "列方程前先說明系統範圍，並在能量平衡中計入題目所述的所有物體。"),
    ],
  ),
  heat(
    "thermal-transfer",
    "Thermal Transfer",
    "熱傳遞",
    "🔥",
    "Thermal energy is transferred by conduction, convection and radiation. Each mechanism has a distinct particle-level explanation and practical methods of control.",
    "熱能可透過傳導、對流及輻射傳遞；每一種機制都有不同的粒子層面解釋及控制方法。",
    [
      point("Conduction transfers energy through interactions between neighbouring particles; in metals, mobile electrons make the process efficient.", "傳導藉相鄰粒子之間的相互作用傳遞能量；金屬中的自由電子令傳導更有效。"),
      point("Convection occurs only in fluids: warmer, less dense fluid rises while cooler, denser fluid sinks.", "對流只會在流體發生：較暖且密度較小的流體上升，較冷且密度較大的流體下沉。"),
      point("Radiation transfers energy by electromagnetic waves, mainly infrared from ordinary hot objects, and needs no medium.", "輻射以電磁波傳遞能量；日常熱物體主要放出紅外線，且輻射不需要介質。"),
      point("Dull black surfaces are good absorbers and emitters of infrared; shiny silver surfaces are poor absorbers and emitters.", "暗黑表面善於吸收及放出紅外線；光亮銀色表面則較差。"),
      point("A vacuum reduces conduction and prevents convection; silvered walls reduce radiative transfer.", "真空減少傳導並阻止對流；鍍銀表面減少輻射傳熱。"),
    ],
    [
      formula("Conduction Rate — Extension", "傳導速率—延伸", "\\dot{E}=\\frac{kA(T_{\\text{hot}}-T_{\\text{cold}})}{d}", "Extension: rate of conduction through a slab.", "延伸：熱能通過平板的傳導速率。", [symbol("Ė", "Rate of energy transfer", "能量轉移率", "W"), symbol("k", "Thermal conductivity", "導熱率", "W/(m·K)"), symbol("A", "Cross-sectional area", "橫截面面積", "m²"), symbol("d", "Thickness", "厚度", "m"), symbol("T", "Temperature", "溫度", "K or °C")]),
    ],
    [
      point("Do not write convection for a solid or a vacuum. A vacuum can still transfer energy by radiation.", "不要在固體或真空中寫對流；真空仍可透過輻射傳遞能量。"),
      point("Name the mechanism and explain it at particle level for full marks.", "爭取滿分時，除列出傳熱方式外，亦要以粒子層面解釋。"),
    ],
  ),
  heat(
    "change-state-evaporation",
    "Change of State & Evaporation",
    "相變與蒸發",
    "🧊",
    "During a change of state, energy changes the arrangement of particles rather than their average kinetic energy. Evaporation is a surface process that cools the remaining liquid.",
    "相變期間，能量改變粒子的排列而非其平均動能；蒸發是令剩餘液體冷卻的液面過程。",
    [
      point("Melting, boiling and sublimation absorb energy; freezing, condensing and deposition release energy.", "熔化、沸騰及昇華吸收能量；凝固、凝結及凝華釋放能量。"),
      point("During a phase change, temperature remains constant because energy changes intermolecular potential energy.", "相變期間溫度保持不變，因為能量改變粒子間的勢能。"),
      point("Specific latent heat of fusion and vaporisation must be distinguished.", "必須區分熔化比潛熱及汽化比潛熱。"),
      point("Evaporation occurs below boiling point at the liquid surface when higher-energy particles escape.", "蒸發可在沸點以下於液面發生，能量較高的粒子會逸出。"),
      point("Evaporation is faster at higher temperature, larger surface area, lower humidity and stronger airflow.", "溫度較高、表面積較大、濕度較低及氣流較強時，蒸發會更快。"),
    ],
    [
      formula("Specific Latent Heat", "比潛熱", "E=\\ell\\Delta m", "Energy transferred when a mass changes state at constant temperature.", "一定質量在恆溫下改變狀態時所轉移的能量。", [symbol("E", "Energy transferred", "轉移的能量", "J"), symbol("ℓ", "Specific latent heat of fusion or vaporisation", "熔化或汽化比潛熱", "J/kg"), symbol("Δm", "Mass changing state", "正在改變狀態的質量", "kg")]),
      formula("Piecewise Heating", "分段加熱", "E_{\\text{total}}=mc\\Delta T+m\\ell", "Add separate energy transfers for temperature changes and phase changes.", "把升降溫及相變各段的能量轉移相加。", [symbol("Etotal", "Total energy transferred", "總轉移能量", "J"), symbol("m", "Mass", "質量", "kg"), symbol("c", "Specific heat capacity", "比熱容", "J/(kg·K)"), symbol("ℓ", "Specific latent heat", "比潛熱", "J/kg")]),
    ],
    [
      point("Use mcΔT only on a sloping heating/cooling section, and use mℓ on a constant-temperature plateau.", "只在斜向的升降溫段使用 mcΔT，在恆溫平台段使用 mℓ。"),
      point("In an ice–water question, first check whether the available energy is enough to melt all the ice.", "在冰水題中，先檢查可供應的能量是否足以熔化所有冰。"),
    ],
  ),
  heat(
    "gases-kinetic-theory",
    "Gases & Kinetic Theory",
    "氣體與動理論",
    "🎈",
    "Gas laws relate pressure, volume and absolute temperature. Kinetic theory explains these relationships through random molecular motion and collisions.",
    "氣體定律聯繫壓力、體積及絕對溫度；動理論以分子的隨機運動及碰撞解釋這些關係。",
    [
      point("Gas pressure is produced by molecular collisions with the walls of its container.", "氣體壓力源於分子撞擊容器壁。"),
      point("For a fixed amount of ideal gas, at constant temperature Boyle's law gives pV = constant; at constant absolute pressure, V/T = constant.", "對固定氣量的理想氣體，溫度不變時波義耳定律給出 pV = 常數；絕對壓強不變時，V/T = 常數。"),
      point("For a fixed amount at constant volume, p/T = constant. Use absolute pressure and kelvin, not gauge pressure or degrees Celsius.", "對固定氣量，體積不變時 p/T = 常數。必須使用絕對壓強及開爾文，不能使用表壓或攝氏度。"),
      point("Absolute zero can be estimated by extrapolating a pressure–Celsius-temperature or volume–Celsius-temperature graph.", "可從壓力—攝氏溫度或體積—攝氏溫度圖外推估計絕對零度。"),
      point("An ideal gas is a useful approximation at high temperature and low pressure.", "在高溫及低壓下，理想氣體是有用的近似模型。"),
    ],
    [
      formula("Ideal Gas Equation", "理想氣體方程", "pV=nRT", "Equation of state for an ideal gas.", "理想氣體的狀態方程。", [symbol("p", "Pressure", "壓力", "Pa"), symbol("V", "Volume", "體積", "m³"), symbol("n", "Amount of gas", "物質的量", "mol"), symbol("R", "Molar gas constant", "莫耳氣體常數", "8.31 J/(mol·K)"), symbol("T", "Absolute temperature", "絕對溫度", "K")]),
      formula("Kinetic Theory Equation", "動理論方程", "pV=\\frac{1}{3}Nmc^2", "Microscopic equation connecting pressure with molecular motion.", "把壓力與分子運動聯繫起來的微觀方程。", [symbol("N", "Number of molecules", "分子數目", "dimensionless"), symbol("m", "Mass of one molecule", "一個分子的質量", "kg"), symbol("c", "Root-mean-square molecular speed", "分子均方根速率", "m/s"), symbol("p, V", "Pressure and volume", "壓力及體積", "Pa, m³")]),
      formula("Total Translational Kinetic Energy", "分子總平移動能", "K_{\\mathrm{total}}=\\frac{3}{2}nRT", "Total random translational kinetic energy of an ideal gas sample, not the mean per molecule.", "理想氣體樣本中分子隨機平移運動的總動能，並非每分子的平均值。", [symbol("K_total", "Total molecular translational kinetic energy", "分子總平移動能", "J"), symbol("n", "Amount of gas", "物質的量", "mol"), symbol("R", "Molar gas constant", "莫耳氣體常數", "8.31 J/(mol·K)"), symbol("T", "Absolute temperature", "絕對溫度", "K")]),
    ],
    [
      point("Convert Celsius temperature to kelvin before substituting into any gas equation or ratio.", "代入任何氣體方程或比值前，必須先把攝氏溫度換為開爾文。"),
      point("Mean kinetic energy per molecule is 3RT/(2N_A); multiplying it by the molecular count gives total translational energy 3nRT/2.", "每分子的平均動能為 3RT/(2N_A)；再乘分子數才得到總平移動能 3nRT/2。"),
      point("State the fixed conditions before explaining collisions. In a sealed rigid container, heating increases RMS speed, collision rate and momentum transfer per collision, so pressure rises.", "先說明固定條件才解釋碰撞。在密封剛性容器內，加熱提高均方根速率、碰撞頻率及每次碰撞的動量傳遞，因此壓強上升。"),
    ],
  ),
];

const toSheet = (topic: Topic, item: NamedFormula): FormulaSheetEntry => ({
  latex: item.latex,
  name: item.name,
  nameZh: item.nameZh,
  topic: topic.title,
  topicZh: topic.titleZh,
  color: topic.color,
  symbols: item.symbols ?? [],
});

export const expandedFormulaSheet: FormulaSheetEntry[] = expandedTopics.flatMap(topic =>
  topic.formulas.map(item => toSheet(topic, item as NamedFormula)),
);

export const existingFormulaSheetAdditions: FormulaSheetEntry[] = [
  { latex: newtonMomentumFormula.latex, name: newtonMomentumFormula.name, nameZh: newtonMomentumFormula.nameZh, topic: "Newton's Laws", topicZh: "牛頓定律", color: "orange", symbols: newtonMomentumFormula.symbols ?? [] },
  { latex: componentEquationFormula.latex, name: componentEquationFormula.name, nameZh: componentEquationFormula.nameZh, topic: "Resultant Force", topicZh: "合力與分力", color: "orange", symbols: componentEquationFormula.symbols ?? [] },
  { latex: angledPowerFormula.latex, name: angledPowerFormula.name, nameZh: angledPowerFormula.nameZh, topic: "Work Done", topicZh: "做功與能量", color: "orange", symbols: angledPowerFormula.symbols ?? [] },
  { latex: heatCapacityFormula.latex, name: heatCapacityFormula.name, nameZh: heatCapacityFormula.nameZh, topic: "Heat & Temperature", topicZh: "熱與溫度", color: "red", symbols: heatCapacityFormula.symbols ?? [] },
  { latex: electricalHeatingFormula.latex, name: electricalHeatingFormula.name, nameZh: electricalHeatingFormula.nameZh, topic: "Heat & Temperature", topicZh: "熱與溫度", color: "red", symbols: electricalHeatingFormula.symbols ?? [] },
];

export function applyExistingTopicEnhancements(topics: Topic[]): void {
  const find = (id: string) => topics.find(topic => topic.id === id);

  const newton = find("newton-laws");
  if (newton) {
    newton.keyPoints.push(
      point("A free-body diagram shows only forces acting on the chosen object: for example weight, normal reaction, tension and friction.", "自由體圖只畫作用於所選物體的力，例如重量、法向反力、張力及摩擦力。"),
      point("Mass is measured in kg and remains constant; weight is a force W = mg and changes with gravitational field strength.", "質量以 kg 為單位且保持不變；重量是 W = mg 的力，會隨重力場強度改變。"),
      point("An object in equilibrium has zero acceleration, so it may be stationary or move at constant velocity.", "處於平衡的物體加速度為零，因此可靜止或作恆定速度運動。"),
    );
    newton.formulas.push(newtonMomentumFormula);
    newton.examTips.push(point("For every dynamics question, draw a free-body diagram, choose axes, then write ΣF = ma for each axis.", "每道動力學題先畫自由體圖、選取座標軸，然後對每條軸寫 ΣF = ma。"));
  }

  const resultant = find("resultant-force");
  if (resultant) {
    resultant.keyPoints.push(
      point("On an inclined plane, choose axes parallel and perpendicular to the slope; then the weight components are W sin α and W cos α.", "在斜面上選取平行及垂直斜面的座標軸；重量分量分別為 W sin α 及 W cos α。"),
      point("Friction opposes relative motion or the tendency for relative motion between surfaces.", "摩擦力阻礙表面之間的相對運動或相對運動趨勢。"),
    );
    resultant.formulas.push(componentEquationFormula);
    resultant.examTips.push(point("Do not memorise that a horizontal component is always cosine: use the angle between the force and the chosen axis.", "不要死記水平分量必定用 cos：應按力與所選座標軸之間的夾角判斷。"));
  }

  const work = find("work-done");
  if (work) {
    work.keyPoints.push(
      point("Work can be positive, negative or zero. A force perpendicular to displacement does zero work.", "功可為正、負或零；與位移垂直的力不做功。"),
      point("Friction often does negative work on an object, but the energy is transferred to internal energy rather than destroyed.", "摩擦力常對物體做負功，但能量是轉移為內能而非消失。"),
    );
    work.formulas.push(angledPowerFormula);
    work.examTips.push(point("For an energy problem, state the system, compare its initial and final energy stores, then identify any dissipation.", "能量題先說明系統、比較初末能量儲存，再指出任何耗散。"));
  }

  const heatTopic = find("heat");
  if (heatTopic) {
    heatTopic.title = "Temperature, Heat & Internal Energy";
    heatTopic.titleZh = "溫度、熱與內能";
    heatTopic.summary = "Heat is energy transferred because of a temperature difference. Temperature is linked to average molecular kinetic energy, while internal energy includes both random kinetic and intermolecular potential energy.";
    heatTopic.summaryZh = "熱是因溫度差而轉移的能量。溫度與分子的平均動能相關；內能則包括粒子的隨機動能及粒子間勢能。";
    heatTopic.keyPoints.push(
      point("Heat is not stored in an object: it is energy transferred because of a temperature difference. Internal energy is stored by the system.", "熱不是儲存在物體中的量：它是因溫度差而轉移的能量；系統儲存的是內能。"),
      point("Objects at the same temperature can have different internal energies because mass and state of matter also matter.", "即使溫度相同，物體的內能仍可不同，因為質量及物態亦有影響。"),
      point("A thermometer uses a temperature-dependent property such as liquid-column length, resistance or thermocouple e.m.f.", "溫度計利用隨溫度改變的物理性質，例如液柱長度、電阻或熱電偶電動勢。"),
      point("Thermal equilibrium means there is no net heat transfer between objects.", "達至熱平衡表示物體之間沒有淨熱傳遞。"),
    );
    heatTopic.formulas.push(heatCapacityFormula, electricalHeatingFormula);
    heatTopic.examTips.push(point("Use Kelvin for absolute-temperature and gas-law calculations; a temperature change has the same numerical size in K and °C.", "絕對溫度及氣體定律計算使用開爾文；溫度改變以 K 或 °C 表示，數值相同。"));
  }
}
