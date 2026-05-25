// DSE Physics Practice Questions
// One DSE-style question per topic, with model answers

export interface AnswerPart {
  label: string;       // e.g. "(a)", "(b)(i)"
  question: string;    // sub-question text
  questionZh: string;
  answer: string;      // model answer
  answerZh: string;
  marks: number;
}

export interface PracticeQuestion {
  topicId: string;
  year: string;        // e.g. "DSE 2019 Paper 1"
  source: string;      // exam source label
  scenario: string;    // paragraph describing the situation
  scenarioZh: string;
  diagram?: string;    // optional ASCII / description of diagram
  parts: AnswerPart[];
  totalMarks: number;
}

export const practiceQuestions: PracticeQuestion[] = [
  // ─── Reflection ───────────────────────────────────────────────────────────
  {
    topicId: "reflection",
    year: "DSE 2018 Paper 1 Q3",
    source: "HKDSE Physics 2018",
    scenario:
      "A ray of light strikes a plane mirror at point P. The normal to the mirror at P makes an angle of 35° with the incident ray.",
    scenarioZh:
      "一束光線射到平面鏡上的 P 點。鏡面在 P 點的法線與入射光線成 35° 角。",
    parts: [
      {
        label: "(a)",
        question: "Find the angle of incidence.",
        questionZh: "求入射角。",
        answer:
          "The angle of incidence is the angle between the incident ray and the normal. Since the normal makes 35° with the incident ray, the angle of incidence = 35°.",
        answerZh:
          "入射角是入射光線與法線之間的夾角。由於法線與入射光線成 35°，所以入射角 = 35°。",
        marks: 1,
      },
      {
        label: "(b)",
        question: "Find the angle of reflection.",
        questionZh: "求反射角。",
        answer:
          "By the Law of Reflection, angle of reflection = angle of incidence = 35°.",
        answerZh:
          "根據反射定律，反射角 = 入射角 = 35°。",
        marks: 1,
      },
      {
        label: "(c)",
        question:
          "The mirror is then rotated by 10° about point P (keeping the incident ray fixed). What is the new angle between the incident ray and the reflected ray?",
        questionZh:
          "然後將鏡面繞 P 點旋轉 10°（入射光線保持不變）。入射光線與反射光線之間的新夾角是多少？",
        answer:
          "When the mirror rotates by 10°, the normal also rotates by 10°. New angle of incidence = 35° + 10° = 45°. New angle of reflection = 45°. The angle between incident and reflected ray = 45° + 45° = 90°.\n\nAlternatively: rotating the mirror by θ rotates the reflected ray by 2θ. Original angle between rays = 35° + 35° = 70°. New angle = 70° + 2(10°) = 90°.",
        answerZh:
          "鏡面旋轉 10° 時，法線也旋轉 10°。新入射角 = 35° + 10° = 45°。新反射角 = 45°。入射光線與反射光線之間的夾角 = 45° + 45° = 90°。\n\n另解：鏡面旋轉 θ，反射光線旋轉 2θ。原來夾角 = 70°，新夾角 = 70° + 2(10°) = 90°。",
        marks: 2,
      },
    ],
    totalMarks: 4,
  },

  // ─── Refraction ───────────────────────────────────────────────────────────
  {
    topicId: "refraction",
    year: "DSE 2022 Paper 1 Q4",
    source: "HKDSE Physics 2022",
    scenario:
      "A ray of light travels from air into a glass block. The angle of incidence in air is 50° and the angle of refraction in glass is 30°.",
    scenarioZh:
      "一束光線從空氣射入玻璃塊。空氣中的入射角為 50°，玻璃中的折射角為 30°。",
    parts: [
      {
        label: "(a)",
        question: "Calculate the refractive index of the glass.",
        questionZh: "計算玻璃的折射率。",
        answer:
          "Using Snell's Law: n_air × sin(50°) = n_glass × sin(30°)\n1 × sin(50°) = n_glass × sin(30°)\nn_glass = sin(50°) / sin(30°) = 0.766 / 0.500 ≈ 1.53",
        answerZh:
          "使用斯涅爾定律：n空氣 × sin(50°) = n玻璃 × sin(30°)\n1 × sin(50°) = n玻璃 × sin(30°)\nn玻璃 = sin(50°) / sin(30°) = 0.766 / 0.500 ≈ 1.53",
        marks: 2,
      },
      {
        label: "(b)",
        question:
          "Calculate the speed of light in the glass. (Speed of light in vacuum = 3.0 × 10⁸ m/s)",
        questionZh:
          "計算光在玻璃中的速度。（光在真空中的速度 = 3.0 × 10⁸ m/s）",
        answer:
          "n = c / v  →  v = c / n = (3.0 × 10⁸) / 1.53 ≈ 1.96 × 10⁸ m/s",
        answerZh:
          "n = c / v  →  v = c / n = (3.0 × 10⁸) / 1.53 ≈ 1.96 × 10⁸ m/s",
        marks: 2,
      },
      {
        label: "(c)",
        question:
          "When the light ray enters the glass, state what happens to its (i) frequency, (ii) wavelength.",
        questionZh:
          "光線進入玻璃時，說明其 (i) 頻率，(ii) 波長 的變化。",
        answer:
          "(i) Frequency: remains unchanged. Frequency is determined by the source and does not change when light enters a new medium.\n(ii) Wavelength: decreases. Since v = fλ and v decreases while f stays constant, λ must decrease.",
        answerZh:
          "(i) 頻率：保持不變。頻率由光源決定，進入新介質時不改變。\n(ii) 波長：減小。由於 v = fλ，v 減小而 f 不變，所以 λ 必定減小。",
        marks: 2,
      },
    ],
    totalMarks: 6,
  },

  // ─── Total Internal Reflection ────────────────────────────────────────────
  {
    topicId: "total-internal-reflection",
    year: "DSE 2020 Paper 1 Q5",
    source: "HKDSE Physics 2020",
    scenario:
      "An optical fibre is made of glass with refractive index 1.50. The fibre is surrounded by a cladding material with refractive index 1.40.",
    scenarioZh:
      "一條光纖由折射率為 1.50 的玻璃製成。光纖外包有折射率為 1.40 的包層材料。",
    parts: [
      {
        label: "(a)",
        question:
          "Calculate the critical angle for the glass-cladding interface.",
        questionZh: "計算玻璃-包層界面的臨界角。",
        answer:
          "sin C = n₂/n₁ = 1.40/1.50 = 0.933\nC = sin⁻¹(0.933) ≈ 69.0°",
        answerZh:
          "sin C = n₂/n₁ = 1.40/1.50 = 0.933\nC = sin⁻¹(0.933) ≈ 69.0°",
        marks: 2,
      },
      {
        label: "(b)",
        question:
          "A light ray hits the glass-cladding boundary at an angle of incidence of 72°. State whether total internal reflection occurs and explain why.",
        questionZh:
          "一束光線以 72° 的入射角射到玻璃-包層界面。說明是否發生全內反射並解釋原因。",
        answer:
          "Yes, total internal reflection occurs.\nThe angle of incidence (72°) is greater than the critical angle (69.0°). When the angle of incidence exceeds the critical angle, no refraction occurs and all light is reflected back into the glass.",
        answerZh:
          "是的，發生全內反射。\n入射角（72°）大於臨界角（69.0°）。當入射角超過臨界角時，不發生折射，所有光線均被反射回玻璃中。",
        marks: 2,
      },
      {
        label: "(c)",
        question:
          "State ONE advantage of using optical fibres over copper wires for transmitting information.",
        questionZh:
          "說明光纖比銅線傳輸信息的一個優點。",
        answer:
          "Any ONE of: (1) Much higher bandwidth — can carry more data simultaneously. (2) Lower signal loss over long distances. (3) Not affected by electromagnetic interference. (4) Lighter and thinner than copper cables.",
        answerZh:
          "以下任一：(1) 頻寬更大——可同時傳輸更多數據。(2) 長距離傳輸信號損耗更低。(3) 不受電磁干擾影響。(4) 比銅線更輕更細。",
        marks: 1,
      },
    ],
    totalMarks: 5,
  },

  // ─── Newton's Laws ────────────────────────────────────────────────────────
  {
    topicId: "newton-laws",
    year: "DSE 2019 Paper 1 Q6",
    source: "HKDSE Physics 2019",
    scenario:
      "A car of mass 1200 kg accelerates from rest to 20 m/s in 8.0 s on a straight horizontal road. The driving force from the engine is constant at 4500 N.",
    scenarioZh:
      "一輛質量為 1200 kg 的汽車在平直水平公路上從靜止加速至 20 m/s，歷時 8.0 s。引擎的驅動力恆為 4500 N。",
    parts: [
      {
        label: "(a)",
        question: "Calculate the acceleration of the car.",
        questionZh: "計算汽車的加速度。",
        answer:
          "a = (v - u) / t = (20 - 0) / 8.0 = 2.5 m/s²",
        answerZh:
          "a = (v - u) / t = (20 - 0) / 8.0 = 2.5 m/s²",
        marks: 1,
      },
      {
        label: "(b)",
        question:
          "Calculate the net (resultant) force acting on the car.",
        questionZh: "計算作用在汽車上的合力。",
        answer:
          "F_net = ma = 1200 × 2.5 = 3000 N",
        answerZh:
          "F合 = ma = 1200 × 2.5 = 3000 N",
        marks: 1,
      },
      {
        label: "(c)",
        question:
          "Calculate the friction force (resistive force) acting on the car.",
        questionZh: "計算作用在汽車上的摩擦力（阻力）。",
        answer:
          "F_net = F_drive − F_friction\n3000 = 4500 − F_friction\nF_friction = 4500 − 3000 = 1500 N",
        answerZh:
          "F合 = F驅動 − F摩擦\n3000 = 4500 − F摩擦\nF摩擦 = 4500 − 3000 = 1500 N",
        marks: 2,
      },
      {
        label: "(d)",
        question:
          "The driver then applies the brakes and the car decelerates uniformly to rest in 5.0 s. Using Newton's First Law, explain the effect on a passenger who is not wearing a seatbelt.",
        questionZh:
          "司機隨後踩下剎車，汽車在 5.0 s 內均勻減速至靜止。用牛頓第一定律解釋對一名未繫安全帶乘客的影響。",
        answer:
          "By Newton's First Law, the passenger tends to remain in their state of motion (moving forward at 20 m/s) unless acted upon by a net force. When the car decelerates, there is no seatbelt force to decelerate the passenger. The passenger continues moving forward and is thrown towards the windscreen.",
        answerZh:
          "根據牛頓第一定律，乘客傾向於保持其運動狀態（以 20 m/s 向前運動），除非受到合外力作用。當汽車減速時，沒有安全帶的力使乘客減速。乘客繼續向前運動，被拋向擋風玻璃。",
        marks: 2,
      },
    ],
    totalMarks: 6,
  },

  // ─── Resultant Force ──────────────────────────────────────────────────────
  {
    topicId: "resultant-force",
    year: "DSE 2021 Paper 1 Q5",
    source: "HKDSE Physics 2021",
    scenario:
      "A box of weight 80 N is pulled up a smooth inclined plane (angle 30° to horizontal) by a force F parallel to the slope.",
    scenarioZh:
      "一個重 80 N 的箱子被一個平行於斜面的力 F 沿光滑斜面（與水平面成 30° 角）向上拉。",
    parts: [
      {
        label: "(a)",
        question:
          "Resolve the weight of the box into components parallel and perpendicular to the inclined plane.",
        questionZh:
          "將箱子的重力分解為平行和垂直於斜面的分量。",
        answer:
          "Component parallel to slope (down the slope) = W sin30° = 80 × 0.5 = 40 N\nComponent perpendicular to slope = W cos30° = 80 × 0.866 ≈ 69.3 N",
        answerZh:
          "平行於斜面的分量（沿斜面向下）= W sin30° = 80 × 0.5 = 40 N\n垂直於斜面的分量 = W cos30° = 80 × 0.866 ≈ 69.3 N",
        marks: 2,
      },
      {
        label: "(b)",
        question:
          "The box moves up the slope at constant velocity. Find the magnitude of force F.",
        questionZh:
          "箱子以恆定速度沿斜面向上移動。求力 F 的大小。",
        answer:
          "At constant velocity, net force = 0 (Newton's 1st Law).\nF = component of weight parallel to slope = 40 N",
        answerZh:
          "以恆定速度運動時，合力 = 0（牛頓第一定律）。\nF = 重力平行斜面的分量 = 40 N",
        marks: 2,
      },
      {
        label: "(c)",
        question:
          "Find the normal reaction force N from the slope on the box.",
        questionZh:
          "求斜面對箱子的法向反力 N。",
        answer:
          "Perpendicular to slope, forces are balanced:\nN = W cos30° = 80 × cos30° ≈ 69.3 N",
        answerZh:
          "垂直斜面方向，力平衡：\nN = W cos30° = 80 × cos30° ≈ 69.3 N",
        marks: 1,
      },
    ],
    totalMarks: 5,
  },

  // ─── Work Done ────────────────────────────────────────────────────────────
  {
    topicId: "work-done",
    year: "DSE 2023 Paper 1 Q7",
    source: "HKDSE Physics 2023",
    scenario:
      "A motor lifts a load of mass 50 kg from the ground to a height of 12 m in 30 s. The motor has an efficiency of 60%. (Take g = 10 N/kg)",
    scenarioZh:
      "一台電動機在 30 s 內將質量為 50 kg 的重物從地面提升至 12 m 高處。電動機的效率為 60%。（取 g = 10 N/kg）",
    parts: [
      {
        label: "(a)",
        question: "Calculate the gravitational potential energy gained by the load.",
        questionZh: "計算重物獲得的重力勢能。",
        answer:
          "GPE = mgh = 50 × 10 × 12 = 6000 J",
        answerZh:
          "GPE = mgh = 50 × 10 × 12 = 6000 J",
        marks: 2,
      },
      {
        label: "(b)",
        question: "Calculate the useful power output of the motor.",
        questionZh: "計算電動機的有用功率輸出。",
        answer:
          "Useful power = GPE gained / time = 6000 / 30 = 200 W",
        answerZh:
          "有用功率 = 獲得的重力勢能 / 時間 = 6000 / 30 = 200 W",
        marks: 2,
      },
      {
        label: "(c)",
        question:
          "Calculate the total electrical power input to the motor.",
        questionZh: "計算電動機的總電功率輸入。",
        answer:
          "Efficiency = useful power output / total power input\n0.60 = 200 / P_input\nP_input = 200 / 0.60 ≈ 333 W",
        answerZh:
          "效率 = 有用功率輸出 / 總功率輸入\n0.60 = 200 / P輸入\nP輸入 = 200 / 0.60 ≈ 333 W",
        marks: 2,
      },
      {
        label: "(d)",
        question:
          "State what happens to the 'wasted' energy in the motor.",
        questionZh:
          "說明電動機中「浪費」的能量發生了什麼。",
        answer:
          "The wasted energy is converted to heat (thermal energy) due to electrical resistance in the motor coils and friction in the moving parts. This heat is dissipated to the surroundings.",
        answerZh:
          "浪費的能量因電動機線圈的電阻和運動部件的摩擦而轉化為熱能（熱量），並散發到周圍環境中。",
        marks: 1,
      },
    ],
    totalMarks: 7,
  },

  // ─── Heat ─────────────────────────────────────────────────────────────────
  {
    topicId: "heat",
    year: "DSE 2017 Paper 1 Q8",
    source: "HKDSE Physics 2017",
    scenario:
      "A 0.50 kg block of ice at 0°C is placed into 2.0 kg of water at 25°C in an insulated container. The specific heat capacity of water is 4200 J/(kg·°C) and the specific latent heat of fusion of ice is 3.36 × 10⁵ J/kg.",
    scenarioZh:
      "將 0.50 kg 的冰塊（0°C）放入絕熱容器中 2.0 kg 的水（25°C）中。水的比熱容為 4200 J/(kg·°C)，冰的熔化比潛熱為 3.36 × 10⁵ J/kg。",
    parts: [
      {
        label: "(a)",
        question:
          "Calculate the heat energy needed to melt all the ice at 0°C.",
        questionZh: "計算使所有冰在 0°C 熔化所需的熱能。",
        answer:
          "Q_melt = mL = 0.50 × 3.36 × 10⁵ = 1.68 × 10⁵ J",
        answerZh:
          "Q熔化 = mL = 0.50 × 3.36 × 10⁵ = 1.68 × 10⁵ J",
        marks: 2,
      },
      {
        label: "(b)",
        question:
          "Calculate the maximum heat energy that the warm water can give out if it cools to 0°C.",
        questionZh:
          "計算溫水冷卻至 0°C 時能放出的最大熱能。",
        answer:
          "Q_water = mcΔT = 2.0 × 4200 × (25 − 0) = 2.0 × 4200 × 25 = 210 000 J = 2.1 × 10⁵ J",
        answerZh:
          "Q水 = mcΔT = 2.0 × 4200 × (25 − 0) = 2.0 × 4200 × 25 = 210 000 J = 2.1 × 10⁵ J",
        marks: 2,
      },
      {
        label: "(c)",
        question:
          "Show that all the ice melts and calculate the final temperature of the mixture.",
        questionZh:
          "證明所有冰均會熔化，並計算混合物的最終溫度。",
        answer:
          "Heat available from water cooling to 0°C = 2.1 × 10⁵ J\nHeat needed to melt all ice = 1.68 × 10⁵ J\nSince 2.1 × 10⁵ > 1.68 × 10⁵, all ice melts. ✓\n\nRemaining heat after melting ice = (2.1 − 1.68) × 10⁵ = 0.42 × 10⁵ = 42 000 J\nThis heats the total water (0.50 + 2.0 = 2.5 kg) from 0°C:\nQ = mcΔT → 42 000 = 2.5 × 4200 × ΔT\nΔT = 42 000 / 10 500 = 4.0°C\nFinal temperature = 0 + 4.0 = 4.0°C",
        answerZh:
          "水冷卻至 0°C 可放出的熱量 = 2.1 × 10⁵ J\n熔化所有冰所需熱量 = 1.68 × 10⁵ J\n由於 2.1 × 10⁵ > 1.68 × 10⁵，所有冰均會熔化。✓\n\n熔化冰後剩餘熱量 = (2.1 − 1.68) × 10⁵ = 4.2 × 10⁴ J\n此熱量使總水量（0.50 + 2.0 = 2.5 kg）從 0°C 升溫：\nQ = mcΔT → 42 000 = 2.5 × 4200 × ΔT\nΔT = 42 000 / 10 500 = 4.0°C\n最終溫度 = 0 + 4.0 = 4.0°C",
        marks: 3,
      },
    ],
    totalMarks: 7,
  },

  // ─── Waves ────────────────────────────────────────────────────────────────
  {
    topicId: "waves",
    year: "DSE 2016 Paper 1 Q9",
    source: "HKDSE Physics 2016",
    scenario:
      "A sound wave travels through air at 340 m/s. A loudspeaker produces a sound of frequency 680 Hz.",
    scenarioZh:
      "聲波在空氣中以 340 m/s 的速度傳播。一個揚聲器發出頻率為 680 Hz 的聲音。",
    parts: [
      {
        label: "(a)",
        question: "Calculate the wavelength of the sound wave in air.",
        questionZh: "計算聲波在空氣中的波長。",
        answer:
          "v = fλ  →  λ = v/f = 340 / 680 = 0.50 m",
        answerZh:
          "v = fλ  →  λ = v/f = 340 / 680 = 0.50 m",
        marks: 2,
      },
      {
        label: "(b)",
        question: "Calculate the period of the sound wave.",
        questionZh: "計算聲波的週期。",
        answer:
          "T = 1/f = 1/680 ≈ 1.47 × 10⁻³ s",
        answerZh:
          "T = 1/f = 1/680 ≈ 1.47 × 10⁻³ s",
        marks: 1,
      },
      {
        label: "(c)",
        question:
          "The sound wave enters a room where the speed of sound is 350 m/s. State what happens to the (i) frequency and (ii) wavelength of the sound.",
        questionZh:
          "聲波進入一個房間，房間內聲速為 350 m/s。說明聲音的 (i) 頻率和 (ii) 波長的變化。",
        answer:
          "(i) Frequency: unchanged. The frequency of a wave is determined by the source and remains constant when the wave enters a new medium.\n(ii) Wavelength: increases. λ = v/f = 350/680 ≈ 0.515 m (greater than 0.50 m). Since v increases and f is constant, λ increases.",
        answerZh:
          "(i) 頻率：不變。波的頻率由波源決定，進入新介質時保持不變。\n(ii) 波長：增大。λ = v/f = 350/680 ≈ 0.515 m（大於 0.50 m）。由於 v 增大而 f 不變，λ 增大。",
        marks: 2,
      },
      {
        label: "(d)",
        question:
          "State whether sound is a transverse or longitudinal wave. Explain briefly.",
        questionZh:
          "說明聲波是橫波還是縱波。簡要解釋。",
        answer:
          "Sound is a longitudinal wave. The particles of the medium vibrate parallel to (in the same direction as) the direction of wave propagation, creating compressions and rarefactions.",
        answerZh:
          "聲波是縱波。介質中的粒子沿平行於（即與）波的傳播方向振動，形成疏部和密部。",
        marks: 2,
      },
    ],
    totalMarks: 7,
  },

  // ─── Double Slit ──────────────────────────────────────────────────────────
  {
    topicId: "double-slit",
    year: "DSE 2015 Paper 1 Q10",
    source: "HKDSE Physics 2015",
    scenario:
      "In Young's double slit experiment, monochromatic light of wavelength 600 nm passes through two slits separated by 0.30 mm. The screen is placed 1.5 m from the slits.",
    scenarioZh:
      "在楊氏雙縫實驗中，波長為 600 nm 的單色光通過間距為 0.30 mm 的兩條縫。屏幕放置在距縫 1.5 m 處。",
    parts: [
      {
        label: "(a)",
        question: "Calculate the fringe spacing on the screen.",
        questionZh: "計算屏幕上的條紋間距。",
        answer:
          "Δy = λD/d = (600 × 10⁻⁹ × 1.5) / (0.30 × 10⁻³)\n= (9.0 × 10⁻⁷) / (3.0 × 10⁻⁴)\n= 3.0 × 10⁻³ m = 3.0 mm",
        answerZh:
          "Δy = λD/d = (600 × 10⁻⁹ × 1.5) / (0.30 × 10⁻³)\n= (9.0 × 10⁻⁷) / (3.0 × 10⁻⁴)\n= 3.0 × 10⁻³ m = 3.0 mm",
        marks: 2,
      },
      {
        label: "(b)",
        question:
          "The slit separation is now increased to 0.60 mm (all other conditions unchanged). What is the new fringe spacing?",
        questionZh:
          "縫間距增加至 0.60 mm（其他條件不變）。新的條紋間距是多少？",
        answer:
          "Δy = λD/d = (600 × 10⁻⁹ × 1.5) / (0.60 × 10⁻³) = 1.5 × 10⁻³ m = 1.5 mm\n\nAlternatively: d doubled → Δy halved → 3.0/2 = 1.5 mm",
        answerZh:
          "Δy = λD/d = (600 × 10⁻⁹ × 1.5) / (0.60 × 10⁻³) = 1.5 × 10⁻³ m = 1.5 mm\n\n另解：d 加倍 → Δy 減半 → 3.0/2 = 1.5 mm",
        marks: 2,
      },
      {
        label: "(c)",
        question:
          "The original setup is restored. The monochromatic light is replaced with light of wavelength 400 nm. Describe the change in the fringe pattern.",
        questionZh:
          "恢復原來的設置。單色光換成波長為 400 nm 的光。描述條紋圖案的變化。",
        answer:
          "The fringe spacing decreases. New Δy = (400 × 10⁻⁹ × 1.5) / (0.30 × 10⁻³) = 2.0 mm (compared to original 3.0 mm). The fringes are closer together. Also, the colour of the fringes changes from red/orange to violet/blue.",
        answerZh:
          "條紋間距減小。新 Δy = (400 × 10⁻⁹ × 1.5) / (0.30 × 10⁻³) = 2.0 mm（原來為 3.0 mm）。條紋變得更密。此外，條紋顏色從紅/橙色變為紫/藍色。",
        marks: 2,
      },
    ],
    totalMarks: 6,
  },

  // ─── Diffraction ──────────────────────────────────────────────────────────
  {
    topicId: "diffraction",
    year: "DSE 2014 Paper 1 Q11",
    source: "HKDSE Physics 2014",
    scenario:
      "Waves on the surface of water pass through a gap in a barrier. The wavelength of the water waves is 4.0 cm and the gap width is 4.0 cm.",
    scenarioZh:
      "水面波通過障礙物中的一個縫隙。水波的波長為 4.0 cm，縫隙寬度為 4.0 cm。",
    parts: [
      {
        label: "(a)",
        question:
          "State the condition for maximum diffraction and comment on whether it applies here.",
        questionZh:
          "說明衍射最大的條件，並說明此條件是否適用於本題。",
        answer:
          "Maximum diffraction occurs when the wavelength is approximately equal to the gap width (λ ≈ d). Here, λ = 4.0 cm and d = 4.0 cm, so λ/d = 1. This condition IS satisfied — maximum diffraction will occur and the waves will spread significantly into the region behind the barrier.",
        answerZh:
          "當波長約等於縫隙寬度時（λ ≈ d），衍射最大。此處 λ = 4.0 cm，d = 4.0 cm，λ/d = 1。此條件成立——將發生最大衍射，波將顯著擴散到障礙物後方區域。",
        marks: 2,
      },
      {
        label: "(b)",
        question:
          "The gap width is increased to 20 cm (wavelength unchanged). Describe how the diffraction pattern changes.",
        questionZh:
          "縫隙寬度增加至 20 cm（波長不變）。描述衍射圖案如何變化。",
        answer:
          "The diffraction effect decreases. Since d >> λ (ratio λ/d = 4/20 = 0.2), the waves spread less into the shadow region. The waves mostly travel straight through the gap with only slight spreading at the edges.",
        answerZh:
          "衍射效果減弱。由於 d >> λ（比值 λ/d = 4/20 = 0.2），波向陰影區域的擴散減少。波大部分直接通過縫隙，只在邊緣有輕微擴散。",
        marks: 2,
      },
      {
        label: "(c)",
        question:
          "Explain why sound can be heard around corners but light cannot be seen around corners.",
        questionZh:
          "解釋為什麼聲音可以繞過角落聽到，但光線不能繞過角落看到。",
        answer:
          "Sound has wavelengths in the range of centimetres to metres, which are comparable to the size of everyday objects (doorways, walls). This means sound diffracts significantly around corners.\n\nLight has a very short wavelength (~400–700 nm), which is much smaller than everyday objects. The ratio λ/d is extremely small, so diffraction of light around corners is negligible and light travels in straight lines.",
        answerZh:
          "聲音的波長在厘米到米的範圍內，與日常物體（門口、牆壁）的大小相近。因此聲音能顯著地繞過角落衍射。\n\n光的波長非常短（約 400–700 nm），遠小於日常物體。λ/d 的比值極小，所以光繞過角落的衍射可以忽略不計，光沿直線傳播。",
        marks: 3,
      },
    ],
    totalMarks: 7,
  },
];
