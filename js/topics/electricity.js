(function () {
  const { L, fmt, qty, q, C } = FIZIKS;
  const k = C.k;

  FIZIKS.addTopic({
    id: "electricity",
    name: "Electricity",
    tag: "Charge, fields and circuits",
    symbol: L`V = IR`,
    blurb: "Coulomb's law, electric fields, Ohm's law, series and parallel circuits, and electrical power.",
    problems: [
      {
        title: "Ohm's law",
        level: 1,
        gen(r) {
          const V = r.num(1.5, 24, 1.5), R = r.num(2, 100, 2);
          return {
            prompt: `A ${qty(V, "V")} battery is connected across a ${qty(R, "Ohm")} resistor. What current flows?`,
            answer: V / R, unit: "A",
            hints: [L`\(V = IR\), so \(I = V/R\).`],
            solution: [L`\[I = \frac{V}{R} = \frac{${fmt(V)}}{${fmt(R)}} = ${q(V / R, "A", 3)}\]`],
          };
        },
      },
      {
        title: "Electrical power",
        level: 1,
        gen(r) {
          const V = r.pick([12, 120, 230, 9, 24]), I = r.num(0.2, 10, 0.1);
          return {
            prompt: `A device draws ${qty(I, "A")} from a ${qty(V, "V")} supply. How much power does it use?`,
            answer: V * I, unit: "W",
            hints: [L`\(P = IV\)`],
            solution: [L`\[P = IV = (${fmt(I)})(${fmt(V)}) = ${q(V * I, "W", 3)}\]`],
          };
        },
      },
      {
        title: "Cost of electricity",
        level: 1,
        gen(r) {
          const P = r.num(50, 2000, 50), h = r.num(1, 12, 0.5), days = r.pick([7, 30, 365]), price = r.num(0.1, 0.3, 0.01);
          const cost = (P / 1000) * h * days * price;
          return {
            prompt: `A ${qty(P, "W")} appliance runs ${qty(h, "h")} per day for ${days} days. Electricity costs ${price.toFixed(2)} dollars per kWh. What is the total cost, in dollars?`,
            answer: cost, unit: "dollars",
            hints: ["Energy in kWh = (power in kW) × (hours).", "Multiply the energy by the price per kWh."],
            solution: [
              L`\[E = (${fmt(P / 1000)}\ \mathrm{kW})(${fmt(h)}\ \mathrm{h/day})(${days}\ \mathrm{days}) = ${fmt((P / 1000) * h * days, 4)}\ \mathrm{kWh}\]`,
              L`\[\text{cost} = (${fmt((P / 1000) * h * days, 4)})(${price.toFixed(2)}) = ${fmt(cost, 3)}\ \text{dollars}\]`,
            ],
          };
        },
      },
      {
        title: "Series circuit current",
        level: 2,
        gen(r) {
          const V = r.num(3, 24, 1), R1 = r.num(2, 50, 1), R2 = r.num(2, 50, 1), R3 = r.num(2, 50, 1);
          const I = V / (R1 + R2 + R3);
          return {
            prompt: `Resistors of ${qty(R1, "Ohm")}, ${qty(R2, "Ohm")} and ${qty(R3, "Ohm")} are connected in series to a ${qty(V, "V")} battery. What current flows through the circuit?`,
            answer: I, unit: "A",
            hints: [L`Series resistances add: \(R_{eq} = R_1 + R_2 + R_3\).`],
            solution: [L`\[R_{eq} = ${fmt(R1)} + ${fmt(R2)} + ${fmt(R3)} = ${fmt(R1 + R2 + R3)}\ \Omega\]`, L`\[I = \frac{V}{R_{eq}} = ${q(I, "A", 3)}\]`],
          };
        },
      },
      {
        title: "Parallel resistors",
        level: 2,
        gen(r) {
          const R1 = r.num(2, 100, 2), R2 = r.num(2, 100, 2);
          const R = 1 / (1 / R1 + 1 / R2);
          return {
            prompt: `What is the equivalent resistance of a ${qty(R1, "Ohm")} resistor and a ${qty(R2, "Ohm")} resistor connected in parallel?`,
            answer: R, unit: "Ohm",
            hints: [L`\(\dfrac{1}{R_{eq}} = \dfrac{1}{R_1} + \dfrac{1}{R_2}\)`, "Your answer should be smaller than either resistor."],
            solution: [L`\[R_{eq} = \frac{R_1R_2}{R_1 + R_2} = \frac{(${fmt(R1)})(${fmt(R2)})}{${fmt(R1 + R2)}} = ${q(R, "Ohm", 3)}\]`],
          };
        },
      },
      {
        title: "Coulomb's law",
        level: 2,
        gen(r) {
          const q1 = r.num(1, 9, 0.5), q2 = r.num(1, 9, 0.5), dcm = r.num(2, 50, 1);
          const F = (k * q1 * 1e-6 * q2 * 1e-6) / (dcm / 100) ** 2;
          return {
            prompt: `Two point charges of ${qty(q1, "uC")} and ${qty(q2, "uC")} are ${qty(dcm, "cm")} apart. What is the magnitude of the electric force between them? (\\(k = 8.99\\times10^{9}\\ \\mathrm{N\\,m^2/C^2}\\))`,
            answer: F, unit: "N",
            hints: [L`Convert: \(1\ \mu\mathrm{C} = 10^{-6}\ \mathrm{C}\), \(1\ \mathrm{cm} = 0.01\ \mathrm{m}\).`, L`\(F = k\dfrac{|q_1 q_2|}{r^2}\)`],
            solution: [L`\[F = \frac{(8.99\times10^9)(${fmt(q1)}\times10^{-6})(${fmt(q2)}\times10^{-6})}{(${fmt(dcm / 100)})^2} = ${q(F, "N", 3)}\]`],
          };
        },
      },
      {
        title: "Electric field of a point charge",
        level: 2,
        gen(r) {
          const qq = r.num(0.5, 9, 0.5), dcm = r.num(5, 100, 5);
          const E = (k * qq * 1e-6) / (dcm / 100) ** 2;
          return {
            prompt: `What is the magnitude of the electric field ${qty(dcm, "cm")} from a ${qty(qq, "uC")} point charge? (\\(k = 8.99\\times10^{9}\\ \\mathrm{N\\,m^2/C^2}\\))`,
            answer: E, unit: "N/C",
            hints: [L`\(E = k\dfrac{|q|}{r^2}\)`],
            solution: [L`\[E = \frac{(8.99\times10^9)(${fmt(qq)}\times10^{-6})}{(${fmt(dcm / 100)})^2} = ${q(E, "N/C", 3)}\]`],
          };
        },
      },
      {
        title: "Series–parallel combination",
        level: 3,
        gen(r) {
          const V = r.num(6, 24, 1), R1 = r.num(2, 30, 1), R2 = r.num(4, 60, 2), R3 = r.num(4, 60, 2);
          const Rp = 1 / (1 / R2 + 1 / R3), Req = R1 + Rp, I = V / Req;
          return {
            prompt: `A ${qty(R1, "Ohm")} resistor is in series with a parallel pair of ${qty(R2, "Ohm")} and ${qty(R3, "Ohm")} resistors. The combination is connected to a ${qty(V, "V")} battery. What current does the battery supply?`,
            answer: I, unit: "A",
            hints: ["Reduce the parallel pair to a single resistor first.", "Then add the series resistor and apply Ohm's law."],
            solution: [
              L`\[R_p = \frac{(${fmt(R2)})(${fmt(R3)})}{${fmt(R2 + R3)}} = ${q(Rp, "Ohm", 3)}\]`,
              L`\[R_{eq} = ${fmt(R1)} + ${fmt(Rp, 3)} = ${q(Req, "Ohm", 3)}\]`,
              L`\[I = \frac{V}{R_{eq}} = ${q(I, "A", 3)}\]`,
            ],
          };
        },
      },
    ],
  });
})();
