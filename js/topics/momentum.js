(function () {
  const { L, fmt, qty, q, C } = FIZIKS;
  const g = C.g;

  FIZIKS.addTopic({
    id: "momentum",
    name: "Momentum",
    tag: "Impulse and collisions",
    symbol: L`p = mv`,
    blurb: "Momentum, impulse, recoil, and elastic and inelastic collisions.",
    problems: [
      {
        title: "Momentum of a moving object",
        level: 1,
        gen(r) {
          const m = r.num(0.1, 100, 0.1), v = r.num(1, 40, 1);
          return {
            prompt: `What is the magnitude of the momentum of a ${qty(m, "kg")} object moving at ${qty(v, "m/s")}?`,
            answer: m * v, unit: "kg*m/s",
            hints: [L`\(p = mv\)`],
            solution: [L`\[p = mv = (${fmt(m)})(${fmt(v)}) = ${fmt(m * v, 3)}\ \mathrm{kg\cdot m/s}\]`],
          };
        },
      },
      {
        title: "Average force from impulse",
        level: 2,
        gen(r) {
          const m = r.num(0.05, 0.5, 0.01), v = r.num(10, 35, 1), tms = r.num(5, 20, 1);
          const F = (m * v) / (tms / 1000);
          return {
            prompt: `A ${qty(m, "kg")} ball at rest is kicked and leaves the foot at ${qty(v, "m/s")}. The foot is in contact with the ball for ${qty(tms, "ms")}. What average force does the foot exert?`,
            answer: F, unit: "N",
            hints: [L`Impulse equals change in momentum: \(F\Delta t = \Delta p\).`, "Convert milliseconds to seconds."],
            solution: [L`\[F = \frac{\Delta p}{\Delta t} = \frac{(${fmt(m)})(${fmt(v)})}{${fmt(tms / 1000)}} = ${q(F, "N", 3)}\]`],
          };
        },
      },
      {
        title: "Bouncing off a wall",
        level: 2,
        gen(r) {
          const m = r.num(0.1, 0.6, 0.05), v1 = r.num(5, 20, 1), v2 = r.num(2, v1, 1);
          const J = m * (v1 + v2);
          return {
            prompt: `A ${qty(m, "kg")} ball hits a wall at ${qty(v1, "m/s")} and rebounds straight back at ${qty(v2, "m/s")}. What is the magnitude of the impulse the wall delivers to the ball?`,
            answer: J, unit: "N*s",
            hints: ["Velocity is a vector. The ball reverses direction.", L`\(\Delta p = m(v_f - v_i) = m(-${fmt(v2)} - ${fmt(v1)})\)`],
            solution: [L`\[|J| = m(v_1 + v_2) = (${fmt(m)})(${fmt(v1)} + ${fmt(v2)}) = ${fmt(J, 3)}\ \mathrm{N\cdot s}\]`],
          };
        },
      },
      {
        title: "Perfectly inelastic collision",
        level: 2,
        gen(r) {
          const m1 = r.num(800, 2500, 50), v1 = r.num(5, 25, 1), m2 = r.num(800, 2500, 50);
          const vf = (m1 * v1) / (m1 + m2);
          return {
            prompt: `A ${qty(m1, "kg")} car traveling at ${qty(v1, "m/s")} rear-ends a stationary ${qty(m2, "kg")} car. The cars lock together. How fast are they moving just after the collision?`,
            answer: vf, unit: "m/s",
            hints: ["Momentum is conserved in every collision.", L`\(m_1 v_1 = (m_1 + m_2)v_f\)`],
            solution: [L`\[v_f = \frac{m_1 v_1}{m_1 + m_2} = \frac{(${fmt(m1)})(${fmt(v1)})}{${fmt(m1 + m2)}} = ${q(vf, "m/s", 3)}\]`],
          };
        },
      },
      {
        title: "Recoil",
        level: 2,
        gen(r) {
          const M = r.num(3, 6, 0.5), mg = r.num(5, 15, 1), v = r.num(300, 900, 50);
          const V = ((mg / 1000) * v) / M;
          return {
            prompt: `A ${qty(M, "kg")} rifle fires a ${qty(mg, "g")} bullet at ${qty(v, "m/s")}. What is the rifle's recoil speed?`,
            answer: V, unit: "m/s",
            hints: ["The total momentum before firing is zero.", "Convert grams to kilograms."],
            solution: [L`\[0 = m v - MV \;\Rightarrow\; V = \frac{mv}{M} = \frac{(${fmt(mg / 1000)})(${fmt(v)})}{${fmt(M)}} = ${q(V, "m/s", 3)}\]`],
          };
        },
      },
      {
        title: "Elastic collision with a target at rest",
        level: 3,
        gen(r) {
          const m1 = r.num(0.1, 2, 0.1), m2 = r.num(0.1, 2, 0.1), v1 = r.num(2, 10, 0.5);
          const v2 = (2 * m1 * v1) / (m1 + m2);
          return {
            prompt: `A ${qty(m1, "kg")} cart moving at ${qty(v1, "m/s")} collides elastically, head-on, with a ${qty(m2, "kg")} cart at rest. What is the speed of the second cart after the collision?`,
            answer: v2, unit: "m/s",
            hints: ["Both momentum and kinetic energy are conserved.", L`For a target at rest: \(v_2' = \dfrac{2m_1}{m_1 + m_2}v_1\).`],
            solution: [L`\[v_2' = \frac{2m_1 v_1}{m_1 + m_2} = \frac{2(${fmt(m1)})(${fmt(v1)})}{${fmt(m1 + m2)}} = ${q(v2, "m/s", 3)}\]`],
          };
        },
      },
      {
        title: "Ballistic pendulum",
        level: 3,
        gen(r) {
          const mg = r.num(5, 20, 1), M = r.num(1, 5, 0.5), hcm = r.num(5, 30, 1);
          const m = mg / 1000, h = hcm / 100;
          const V = Math.sqrt(2 * g * h), v = ((m + M) / m) * V;
          return {
            prompt: `A ${qty(mg, "g")} bullet embeds itself in a ${qty(M, "kg")} wooden block hanging from strings. The block swings upward, rising ${qty(hcm, "cm")}. How fast was the bullet moving?`,
            answer: v, unit: "m/s",
            hints: [L`Step 1, the swing (energy conserved): \(V = \sqrt{2gh}\).`, L`Step 2, the collision (momentum conserved): \(mv = (m + M)V\).`],
            solution: [
              L`\[V = \sqrt{2gh} = \sqrt{2(9.8)(${fmt(h)})} = ${q(V, "m/s", 3)}\]`,
              L`\[v = \frac{m + M}{m}V = \frac{${fmt(m + M)}}{${fmt(m)}}(${fmt(V, 3)}) = ${q(v, "m/s", 3)}\]`,
            ],
          };
        },
      },
    ],
  });
})();
