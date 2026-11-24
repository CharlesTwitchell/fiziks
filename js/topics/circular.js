(function () {
  const { L, fmt, qty, q, C } = FIZIKS;
  const g = C.g;

  FIZIKS.addTopic({
    id: "circular",
    name: "Circular Motion & Gravity",
    tag: "Centripetal force and orbits",
    symbol: L`a_c = \frac{v^2}{r}`,
    blurb: "Centripetal acceleration, banked and flat curves, loops, Newton's law of gravitation and orbits.",
    problems: [
      {
        title: "Centripetal acceleration",
        level: 1,
        gen(r) {
          const v = r.num(2, 30, 1), rr = r.num(5, 100, 5);
          const a = (v * v) / rr;
          return {
            prompt: `A car rounds a curve of radius ${qty(rr, "m")} at a constant ${qty(v, "m/s")}. What is its centripetal acceleration?`,
            answer: a, unit: "m/s^2",
            hints: [L`\(a_c = v^2 / r\)`],
            solution: [L`\[a_c = \frac{v^2}{r} = \frac{(${fmt(v)})^2}{${fmt(rr)}} = ${q(a, "m/s^2", 3)}\]`],
          };
        },
      },
      {
        title: "Period of circular motion",
        level: 1,
        gen(r) {
          const rr = r.num(0.5, 5, 0.1), v = r.num(1, 15, 0.5);
          const T = (2 * Math.PI * rr) / v;
          return {
            prompt: `A ball on a string moves in a horizontal circle of radius ${qty(rr, "m")} at ${qty(v, "m/s")}. How long does one revolution take?`,
            answer: T, unit: "s",
            hints: [L`One revolution covers the circumference \(2\pi r\).`],
            solution: [L`\[T = \frac{2\pi r}{v} = \frac{2\pi(${fmt(rr)})}{${fmt(v)}} = ${q(T, "s", 3)}\]`],
          };
        },
      },
      {
        title: "Centripetal force",
        level: 1,
        gen(r) {
          const m = r.num(0.2, 5, 0.1), v = r.num(2, 15, 0.5), rr = r.num(0.5, 3, 0.1);
          const F = (m * v * v) / rr;
          return {
            prompt: `A ${qty(m, "kg")} stone is whirled in a horizontal circle of radius ${qty(rr, "m")} at ${qty(v, "m/s")}. What tension in the string provides the centripetal force? (Ignore gravity.)`,
            answer: F, unit: "N",
            hints: [L`\(F_c = \dfrac{mv^2}{r}\)`],
            solution: [L`\[F_c = \frac{mv^2}{r} = \frac{(${fmt(m)})(${fmt(v)})^2}{${fmt(rr)}} = ${q(F, "N", 3)}\]`],
          };
        },
      },
      {
        title: "Maximum speed on a flat curve",
        level: 2,
        gen(r) {
          const mu = r.num(0.3, 0.9, 0.05), rr = r.num(20, 200, 10);
          const v = Math.sqrt(mu * g * rr);
          return {
            prompt: `A flat, unbanked curve has radius ${qty(rr, "m")}. The coefficient of static friction between tires and road is \\(${fmt(mu)}\\). What is the maximum speed a car can take the curve without skidding?`,
            answer: v, unit: "m/s",
            hints: [L`Static friction supplies the centripetal force: \(\mu_s mg = mv^2/r\).`, "Mass cancels."],
            solution: [L`\[v_{max} = \sqrt{\mu_s g r} = \sqrt{(${fmt(mu)})(9.8)(${fmt(rr)})} = ${q(v, "m/s", 3)}\]`],
          };
        },
      },
      {
        title: "Gravitational attraction",
        level: 2,
        gen(r) {
          const m1 = r.num(40, 120, 5), m2 = r.num(40, 120, 5), d = r.num(0.5, 3, 0.1);
          const F = (C.G * m1 * m2) / (d * d);
          return {
            prompt: `Two people of masses ${qty(m1, "kg")} and ${qty(m2, "kg")} stand ${qty(d, "m")} apart. What is the gravitational force between them? Use \\(G = 6.674\\times10^{-11}\\ \\mathrm{N\\,m^2/kg^2}\\). (Scientific notation like <code>1.2e-7</code> is fine.)`,
            answer: F, unit: "N",
            hints: [L`\(F = G\dfrac{m_1 m_2}{r^2}\)`],
            solution: [L`\[F = \frac{(6.674\times10^{-11})(${fmt(m1)})(${fmt(m2)})}{(${fmt(d)})^2} = ${q(F, "N", 3)}\]`],
          };
        },
      },
      {
        title: "Surface gravity of a planet",
        level: 2,
        gen(r) {
          const mm = r.num(1, 9.9, 0.1), me = r.int(23, 25), Rkm = r.num(2000, 9000, 100) * (me === 25 ? 3 : 1);
          const M = mm * 10 ** me, R = Rkm * 1000;
          const gs = (C.G * M) / (R * R);
          return {
            prompt: `A planet has mass \\(${fmt(M)}\\ \\mathrm{kg}\\) and radius ${qty(Rkm, "km")}. What is the gravitational acceleration at its surface? (\\(G = 6.674\\times10^{-11}\\ \\mathrm{N\\,m^2/kg^2}\\))`,
            answer: gs, unit: "m/s^2",
            hints: [L`\(g = GM/R^2\)`, "Convert the radius to meters."],
            solution: [L`\[g = \frac{GM}{R^2} = \frac{(6.674\times10^{-11})(${fmt(M)})}{(${fmt(R)})^2} = ${q(gs, "m/s^2", 3)}\]`],
          };
        },
      },
      {
        title: "Minimum speed at the top of a loop",
        level: 3,
        gen(r) {
          const rr = r.num(3, 20, 0.5);
          const v = Math.sqrt(g * rr);
          return {
            prompt: `A roller coaster has a vertical loop of radius ${qty(rr, "m")}. What is the minimum speed the car must have at the top of the loop so it doesn't lose contact with the track?`,
            answer: v, unit: "m/s",
            hints: ["At the minimum speed the normal force at the top is zero.", L`So gravity alone provides the centripetal force: \(mg = mv^2/r\).`],
            solution: [L`\[mg = \frac{mv^2}{r} \;\Rightarrow\; v = \sqrt{gr} = \sqrt{(9.8)(${fmt(rr)})} = ${q(v, "m/s", 3)}\]`],
          };
        },
      },
      {
        title: "Orbital speed of a satellite",
        level: 3,
        gen(r) {
          const hkm = r.num(200, 2000, 50);
          const rr = C.RE + hkm * 1000;
          const v = Math.sqrt((C.G * C.ME) / rr);
          return {
            prompt: `A satellite orbits Earth in a circular orbit ${qty(hkm, "km")} above the surface. What is its orbital speed? Use \\(M_E = 5.97\\times10^{24}\\ \\mathrm{kg}\\), \\(R_E = 6.37\\times10^{6}\\ \\mathrm{m}\\), \\(G = 6.674\\times10^{-11}\\).`,
            answer: v, unit: "m/s",
            hints: [L`The orbital radius is measured from Earth's center: \(r = R_E + h\).`, L`Gravity provides the centripetal force: \(GMm/r^2 = mv^2/r\).`],
            solution: [L`\[r = R_E + h = ${fmt(rr)}\ \mathrm{m}\]`, L`\[v = \sqrt{\frac{GM_E}{r}} = ${q(v, "m/s", 3)}\]`],
          };
        },
      },
    ],
  });
})();
