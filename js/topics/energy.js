(function () {
  const { L, fmt, qty, q, C } = FIZIKS;
  const g = C.g;
  const rad = (d) => (d * Math.PI) / 180;

  FIZIKS.addTopic({
    id: "energy",
    name: "Work & Energy",
    tag: "Energy conservation and power",
    symbol: L`K = \tfrac12 mv^2`,
    blurb: "Kinetic and potential energy, work, springs, power and the work–energy theorem.",
    problems: [
      {
        title: "Kinetic energy",
        level: 1,
        gen(r) {
          const m = r.num(0.5, 80, 0.5), v = r.num(2, 30, 1);
          const K = 0.5 * m * v * v;
          return {
            prompt: `What is the kinetic energy of a ${qty(m, "kg")} object moving at ${qty(v, "m/s")}?`,
            answer: K, unit: "J",
            hints: [L`\(K = \tfrac12 m v^2\). Remember to square the speed.`],
            solution: [L`\[K = \tfrac12 (${fmt(m)})(${fmt(v)})^2 = ${q(K, "J", 3)}\]`],
          };
        },
      },
      {
        title: "Gravitational potential energy",
        level: 1,
        gen(r) {
          const m = r.num(1, 60, 1), h = r.num(2, 40, 1);
          const U = m * g * h;
          return {
            prompt: `How much gravitational potential energy does a ${qty(m, "kg")} backpack gain when lifted ${qty(h, "m")}?`,
            answer: U, unit: "J",
            hints: [L`\(\Delta U = mgh\)`],
            solution: [L`\[\Delta U = mgh = (${fmt(m)})(9.8)(${fmt(h)}) = ${q(U, "J", 3)}\]`],
          };
        },
      },
      {
        title: "Work done by an angled force",
        level: 1,
        gen(r) {
          const F = r.num(20, 200, 10), d = r.num(2, 30, 1), th = r.num(15, 60, 5);
          const W = F * d * Math.cos(rad(th));
          return {
            prompt: `A child pulls a wagon ${qty(d, "m")} along level ground with a force of ${qty(F, "N")} directed ${qty(th, "deg")} above the horizontal. How much work does the child do?`,
            answer: W, unit: "J",
            hints: [L`Only the component of force along the displacement does work.`, L`\(W = Fd\cos\theta\)`],
            solution: [L`\[W = Fd\cos\theta = (${fmt(F)})(${fmt(d)})\cos ${fmt(th)}^\circ = ${q(W, "J", 3)}\]`],
          };
        },
      },
      {
        title: "Elastic potential energy",
        level: 2,
        gen(r) {
          const k = r.num(100, 800, 50), xcm = r.num(2, 20, 1);
          const U = 0.5 * k * (xcm / 100) ** 2;
          return {
            prompt: `A spring with spring constant ${qty(k, "N/m")} is compressed by ${qty(xcm, "cm")}. How much energy is stored in it?`,
            answer: U, unit: "J",
            hints: ["Convert centimeters to meters first.", L`\(U_s = \tfrac12 k x^2\)`],
            solution: [L`\[x = ${fmt(xcm)}\ \mathrm{cm} = ${fmt(xcm / 100)}\ \mathrm{m}\]`, L`\[U_s = \tfrac12 (${fmt(k)})(${fmt(xcm / 100)})^2 = ${q(U, "J", 3)}\]`],
          };
        },
      },
      {
        title: "Power to lift a load",
        level: 2,
        gen(r) {
          const m = r.num(50, 500, 10), h = r.num(3, 30, 1), t = r.num(4, 30, 1);
          const P = (m * g * h) / t;
          return {
            prompt: `A motor lifts a ${qty(m, "kg")} load ${qty(h, "m")} at constant speed in ${qty(t, "s")}. What average power does the motor deliver?`,
            answer: P, unit: "W",
            hints: [L`Work done against gravity is \(mgh\).`, L`Power is work per unit time: \(P = W/t\).`],
            solution: [L`\[W = mgh = (${fmt(m)})(9.8)(${fmt(h)}) = ${q(m * g * h, "J", 3)}\]`, L`\[P = \frac{W}{t} = ${q(P, "W", 3)}\]`],
          };
        },
      },
      {
        title: "Work–energy theorem",
        level: 2,
        gen(r) {
          const m = r.num(800, 2000, 50), v1 = r.num(5, 15, 1), v2 = v1 + r.num(3, 15, 1);
          const W = 0.5 * m * (v2 * v2 - v1 * v1);
          return {
            prompt: `How much net work is needed to speed a ${qty(m, "kg")} car up from ${qty(v1, "m/s")} to ${qty(v2, "m/s")}?`,
            answer: W, unit: "J",
            hints: ["Net work equals the change in kinetic energy.", L`\(W = \tfrac12 m(v_f^2 - v_i^2)\). You can't square the difference in speeds.`],
            solution: [L`\[W = \tfrac12 m(v_f^2 - v_i^2) = \tfrac12(${fmt(m)})(${fmt(v2)}^2 - ${fmt(v1)}^2)\]`, L`\[W = ${q(W, "J", 3)}\]`],
          };
        },
      },
      {
        title: "Roller coaster speed",
        level: 2,
        gen(r) {
          const h1 = r.num(20, 60, 1), h2 = r.num(2, h1 - 5, 1), v0 = r.num(0, 8, 1);
          const v = Math.sqrt(v0 * v0 + 2 * g * (h1 - h2));
          return {
            prompt: `A roller coaster car passes the top of a hill ${qty(h1, "m")} high at ${qty(v0, "m/s")}. Ignoring friction, how fast is it moving when it reaches a point ${qty(h2, "m")} above the ground?`,
            answer: v, unit: "m/s",
            hints: ["Mechanical energy is conserved, and the mass cancels.", L`\(\tfrac12 v_0^2 + g h_1 = \tfrac12 v^2 + g h_2\)`],
            solution: [L`\[v = \sqrt{v_0^2 + 2g(h_1 - h_2)} = \sqrt{${fmt(v0)}^2 + 2(9.8)(${fmt(h1 - h2)})}\]`, L`\[v = ${q(v, "m/s", 3)}\]`],
          };
        },
      },
      {
        title: "Spring launcher",
        level: 3,
        gen(r) {
          const k = r.num(200, 1500, 50), xcm = r.num(5, 25, 1), m = r.num(0.1, 2, 0.1);
          const x = xcm / 100, v = x * Math.sqrt(k / m);
          return {
            prompt: `A ${qty(m, "kg")} block is pressed against a spring (\\(k = ${fmt(k)}\\ \\mathrm{N/m}\\)), compressing it ${qty(xcm, "cm")}, then released on a frictionless surface. How fast does the block leave the spring?`,
            answer: v, unit: "m/s",
            hints: ["All the spring's stored energy becomes kinetic energy.", L`\(\tfrac12 kx^2 = \tfrac12 mv^2\)`],
            solution: [L`\[v = x\sqrt{\frac{k}{m}} = (${fmt(x)})\sqrt{\frac{${fmt(k)}}{${fmt(m)}}}\]`, L`\[v = ${q(v, "m/s", 3)}\]`],
          };
        },
      },
      {
        title: "Sliding to a stop",
        level: 3,
        gen(r) {
          const v = r.num(3, 15, 0.5), mu = r.num(0.1, 0.6, 0.05);
          const d = (v * v) / (2 * mu * g);
          return {
            prompt: `A hockey puck slides onto a rough patch at ${qty(v, "m/s")}. The coefficient of kinetic friction there is \\(${fmt(mu)}\\). How far does the puck slide before stopping?`,
            answer: d, unit: "m",
            hints: [L`Work done by friction removes all the kinetic energy: \(\mu_k mg\,d = \tfrac12 mv^2\).`],
            solution: [L`\[d = \frac{v^2}{2\mu_k g} = \frac{(${fmt(v)})^2}{2(${fmt(mu)})(9.8)} = ${q(d, "m", 3)}\]`],
          };
        },
      },
    ],
  });
})();
