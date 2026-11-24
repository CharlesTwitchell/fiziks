(function () {
  const { L, fmt, qty, q, C } = FIZIKS;

  FIZIKS.addTopic({
    id: "thermo",
    name: "Heat & Thermodynamics",
    tag: "Temperature, heat and gases",
    symbol: L`Q = mc\Delta T`,
    blurb: "Specific heat, latent heat, thermal equilibrium, thermal expansion and the ideal gas law.",
    problems: [
      {
        title: "Heating water",
        level: 1,
        gen(r) {
          const m = r.num(0.2, 5, 0.1), dT = r.num(5, 80, 5);
          const Q = m * C.cWater * dT;
          return {
            prompt: `How much heat is needed to raise the temperature of ${qty(m, "kg")} of water by ${qty(dT, "C")}? (\\(c_{water} = 4186\\ \\mathrm{J/(kg\\cdot{}^\\circ C)}\\))`,
            answer: Q, unit: "J",
            hints: [L`\(Q = mc\Delta T\)`],
            solution: [L`\[Q = (${fmt(m)})(4186)(${fmt(dT)}) = ${q(Q, "J", 3)}\]`],
          };
        },
      },
      {
        title: "Melting ice",
        level: 1,
        gen(r) {
          const m = r.num(0.1, 3, 0.1);
          const Q = (m * C.LfWater) / 1000;
          return {
            prompt: `How much heat, in kilojoules, is needed to melt ${qty(m, "kg")} of ice that is already at \\(0^\\circ\\mathrm{C}\\)? (\\(L_f = 3.34\\times10^5\\ \\mathrm{J/kg}\\))`,
            answer: Q, unit: "kJ",
            hints: [L`During a phase change the temperature stays constant: \(Q = mL_f\).`],
            solution: [L`\[Q = mL_f = (${fmt(m)})(3.34\times10^5) = ${fmt(Q * 1000, 3)}\ \mathrm{J} = ${q(Q, "kJ", 3)}\]`],
          };
        },
      },
      {
        title: "Temperature rise of a metal",
        level: 2,
        gen(r) {
          const met = r.pick([
            ["aluminum", 900],
            ["copper", 385],
            ["iron", 450],
            ["lead", 128],
          ]);
          const m = r.num(0.2, 3, 0.1), Q = r.num(2000, 50000, 1000);
          const dT = Q / (m * met[1]);
          return {
            prompt: `A ${qty(m, "kg")} block of ${met[0]} (\\(c = ${met[1]}\\ \\mathrm{J/(kg\\cdot{}^\\circ C)}\\)) absorbs ${qty(Q, "J")} of heat. By how many degrees Celsius does its temperature rise?`,
            answer: dT, unit: "C",
            hints: [L`Rearrange \(Q = mc\Delta T\) for \(\Delta T\).`],
            solution: [L`\[\Delta T = \frac{Q}{mc} = \frac{${fmt(Q)}}{(${fmt(m)})(${met[1]})} = ${q(dT, "C", 3)}\]`],
          };
        },
      },
      {
        title: "Mixing water",
        level: 2,
        gen(r) {
          const m1 = r.num(0.1, 2, 0.1), T1 = r.num(5, 40, 1), m2 = r.num(0.1, 2, 0.1), T2 = r.num(50, 95, 1);
          const Tf = (m1 * T1 + m2 * T2) / (m1 + m2);
          return {
            prompt: `${qty(m1, "kg")} of water at ${qty(T1, "C")} is mixed with ${qty(m2, "kg")} of water at ${qty(T2, "C")} in an insulated container. What is the final temperature?`,
            answer: Tf, unit: "C",
            hints: ["Heat lost by the hot water = heat gained by the cold water.", L`Because both are water, \(c\) cancels: \(T_f\) is a mass-weighted average.`],
            solution: [L`\[T_f = \frac{m_1T_1 + m_2T_2}{m_1 + m_2} = \frac{(${fmt(m1)})(${fmt(T1)}) + (${fmt(m2)})(${fmt(T2)})}{${fmt(m1 + m2)}}\]`, L`\[T_f = ${q(Tf, "C", 3)}\]`],
          };
        },
      },
      {
        title: "Thermal expansion of a rail",
        level: 2,
        gen(r) {
          const Lr = r.num(5, 50, 1), dT = r.num(10, 50, 5);
          const alpha = 12e-6, dL = alpha * Lr * dT * 1000;
          return {
            prompt: `A steel rail is ${qty(Lr, "m")} long. By how many millimeters does it lengthen when its temperature rises by ${qty(dT, "C")}? (\\(\\alpha_{steel} = 12\\times10^{-6}\\ ({}^\\circ\\mathrm{C})^{-1}\\))`,
            answer: dL, unit: "mm",
            hints: [L`\(\Delta L = \alpha L_0 \Delta T\)`, "Convert meters to millimeters at the end."],
            solution: [L`\[\Delta L = (12\times10^{-6})(${fmt(Lr)})(${fmt(dT)}) = ${fmt(dL / 1000, 3)}\ \mathrm{m} = ${q(dL, "mm", 3)}\]`],
          };
        },
      },
      {
        title: "Ideal gas pressure",
        level: 2,
        gen(r) {
          const n = r.num(0.5, 5, 0.5), TC = r.num(0, 100, 5), VL = r.num(5, 50, 1);
          const T = TC + 273.15, P = (n * C.R * T) / (VL / 1000) / 1000;
          return {
            prompt: `${qty(n, "mol")} of an ideal gas at ${qty(TC, "C")} occupies a ${qty(VL, "L")} container. What is the pressure in kilopascals? (\\(R = 8.314\\ \\mathrm{J/(mol\\cdot K)}\\))`,
            answer: P, unit: "kPa",
            hints: ["Convert to kelvin and to cubic meters (1 L = 0.001 m³).", L`\(PV = nRT\)`],
            solution: [L`\[T = ${fmt(TC)} + 273.15 = ${fmt(T, 5)}\ \mathrm{K},\quad V = ${fmt(VL / 1000)}\ \mathrm{m^3}\]`, L`\[P = \frac{nRT}{V} = ${fmt(P * 1000, 3)}\ \mathrm{Pa} = ${q(P, "kPa", 3)}\]`],
          };
        },
      },
      {
        title: "Melt and warm",
        level: 3,
        gen(r) {
          const m = r.num(0.1, 2, 0.1), Tf = r.num(10, 60, 5);
          const Q1 = m * C.LfWater, Q2 = m * C.cWater * Tf, Q = (Q1 + Q2) / 1000;
          return {
            prompt: `How much heat, in kilojoules, is needed to turn ${qty(m, "kg")} of ice at \\(0^\\circ\\mathrm{C}\\) into water at ${qty(Tf, "C")}? (\\(L_f = 3.34\\times10^5\\ \\mathrm{J/kg}\\), \\(c_{water} = 4186\\ \\mathrm{J/(kg\\cdot{}^\\circ C)}\\))`,
            answer: Q, unit: "kJ",
            hints: ["There are two stages: melting, then warming the liquid.", L`\(Q = mL_f + mc\Delta T\)`],
            solution: [
              L`\[Q_1 = mL_f = ${fmt(Q1, 3)}\ \mathrm{J}\]`,
              L`\[Q_2 = mc\Delta T = (${fmt(m)})(4186)(${fmt(Tf)}) = ${fmt(Q2, 3)}\ \mathrm{J}\]`,
              L`\[Q = Q_1 + Q_2 = ${q(Q, "kJ", 3)}\]`,
            ],
          };
        },
      },
    ],
  });
})();
