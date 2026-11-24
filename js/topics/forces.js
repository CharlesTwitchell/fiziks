(function () {
  const { L, fmt, qty, q, C } = FIZIKS;
  const g = C.g;
  const rad = (d) => (d * Math.PI) / 180;

  FIZIKS.addTopic({
    id: "forces",
    name: "Newton's Laws",
    tag: "Forces and dynamics",
    symbol: L`\sum F = ma`,
    blurb: "Net force, friction, inclines, elevators, pulleys and connected objects.",
    problems: [
      {
        title: "Net force and acceleration",
        level: 1,
        gen(r) {
          const F = r.num(10, 200, 5), m = r.num(2, 40, 1);
          const a = F / m;
          return {
            prompt: `A net force of ${qty(F, "N")} acts on a ${qty(m, "kg")} crate. What is the crate's acceleration?`,
            answer: a, unit: "m/s^2",
            hints: [L`Newton's second law: \(F_{net} = ma\).`],
            solution: [L`\[a = \frac{F_{net}}{m} = \frac{${fmt(F)}}{${fmt(m)}} = ${q(a, "m/s^2", 3)}\]`],
          };
        },
      },
      {
        title: "Weight on another world",
        level: 1,
        gen(r) {
          const body = r.pick([
            ["the Moon", 1.62],
            ["Mars", 3.71],
            ["Jupiter", 24.8],
            ["Venus", 8.87],
          ]);
          const m = r.num(40, 120, 5);
          const W = m * body[1];
          return {
            prompt: `An astronaut of mass ${qty(m, "kg")} stands on ${body[0]}, where \\(g = ${body[1]}\\ \\mathrm{m/s^2}\\). What is the astronaut's weight there?`,
            answer: W, unit: "N",
            hints: ["Mass doesn't change from place to place, but weight does.", L`\(W = mg\)`],
            solution: [L`\[W = mg = (${fmt(m)})(${body[1]}) = ${q(W, "N", 3)}\]`],
          };
        },
      },
      {
        title: "Frictionless incline",
        level: 1,
        gen(r) {
          const th = r.num(10, 50, 5);
          const a = g * Math.sin(rad(th));
          return {
            prompt: `A block slides down a frictionless ramp inclined at ${qty(th, "deg")}. What is its acceleration?`,
            answer: a, unit: "m/s^2",
            hints: [L`Only the component of gravity along the slope, \(mg\sin\theta\), accelerates the block.`],
            solution: [L`\[ma = mg\sin\theta \;\Rightarrow\; a = g\sin\theta = 9.8\sin ${fmt(th)}^\circ = ${q(a, "m/s^2", 3)}\]`],
          };
        },
      },
      {
        title: "Pushing against friction",
        level: 2,
        gen(r) {
          const m = r.num(5, 40, 1), mu = r.num(0.1, 0.5, 0.05);
          const f = mu * m * g;
          const F = Math.ceil((f * r.num(1.3, 2.5, 0.1)) / 5) * 5;
          const a = (F - f) / m;
          return {
            prompt: `You push a ${qty(m, "kg")} box across a floor with a horizontal force of ${qty(F, "N")}. The coefficient of kinetic friction is \\(\\mu_k = ${fmt(mu)}\\). What is the box's acceleration?`,
            answer: a, unit: "m/s^2",
            hints: [L`Kinetic friction: \(f = \mu_k N = \mu_k mg\).`, L`Net force = applied force − friction.`],
            solution: [
              L`\[f = \mu_k mg = (${fmt(mu)})(${fmt(m)})(9.8) = ${q(f, "N", 3)}\]`,
              L`\[a = \frac{F - f}{m} = \frac{${fmt(F)} - ${fmt(f, 3)}}{${fmt(m)}} = ${q(a, "m/s^2", 3)}\]`,
            ],
          };
        },
      },
      {
        title: "Apparent weight in an elevator",
        level: 2,
        gen(r) {
          const m = r.num(50, 90, 1), a = r.num(0.5, 3, 0.5);
          const up = r.next() < 0.5;
          const N = m * (g + (up ? a : -a));
          return {
            prompt: `A ${qty(m, "kg")} person stands on a bathroom scale in an elevator that is accelerating <strong>${up ? "upward" : "downward"}</strong> at ${qty(a, "m/s^2")}. What does the scale read (in newtons)?`,
            answer: N, unit: "N",
            hints: [L`The scale reads the normal force \(N\).`, L`Take up as positive: \(N - mg = ma\), and use the sign of \(a\).`],
            solution: [L`\[N = m(g ${up ? "+" : "-"} a) = (${fmt(m)})(9.8 ${up ? "+" : "-"} ${fmt(a)})\]`, L`\[N = ${q(N, "N", 3)}\]`],
          };
        },
      },
      {
        title: "Atwood machine: acceleration",
        level: 2,
        gen(r) {
          const m1 = r.num(1, 5, 0.5), m2 = m1 + r.num(0.5, 3, 0.5);
          const a = ((m2 - m1) * g) / (m1 + m2);
          return {
            prompt: `Masses of ${qty(m1, "kg")} and ${qty(m2, "kg")} hang from opposite ends of a light string over a frictionless pulley. What is the magnitude of their acceleration?`,
            answer: a, unit: "m/s^2",
            hints: ["Treat both masses as one system. The tension is internal and cancels.", L`Net force = \((m_2 - m_1)g\); total mass = \(m_1 + m_2\).`],
            solution: [L`\[a = \frac{(m_2 - m_1)g}{m_1 + m_2} = \frac{(${fmt(m2)} - ${fmt(m1)})(9.8)}{${fmt(m1 + m2)}}\]`, L`\[a = ${q(a, "m/s^2", 3)}\]`],
          };
        },
      },
      {
        title: "Atwood machine: tension",
        level: 3,
        gen(r) {
          const m1 = r.num(1, 5, 0.5), m2 = m1 + r.num(0.5, 3, 0.5);
          const T = (2 * m1 * m2 * g) / (m1 + m2);
          return {
            prompt: `Masses of ${qty(m1, "kg")} and ${qty(m2, "kg")} hang over a frictionless pulley on a light string. What is the tension in the string?`,
            answer: T, unit: "N",
            hints: [L`First find \(a = \frac{(m_2 - m_1)g}{m_1 + m_2}\).`, L`Then apply \(F = ma\) to the lighter mass alone: \(T - m_1 g = m_1 a\).`],
            solution: [
              L`\[a = \frac{(m_2 - m_1)g}{m_1 + m_2} = ${q(((m2 - m1) * g) / (m1 + m2), "m/s^2", 3)}\]`,
              L`\[T = m_1(g + a) = \frac{2m_1 m_2 g}{m_1 + m_2} = ${q(T, "N", 3)}\]`,
            ],
          };
        },
      },
      {
        title: "Contact force between blocks",
        level: 3,
        gen(r) {
          const m1 = r.num(2, 10, 1), m2 = r.num(2, 10, 1), F = r.num(10, 60, 2);
          const P = (F * m2) / (m1 + m2);
          return {
            prompt: `Two blocks sit side by side on a frictionless surface: block A (${qty(m1, "kg")}) and block B (${qty(m2, "kg")}). A horizontal force of ${qty(F, "N")} pushes on A, which pushes B. What force does A exert on B?`,
            answer: P, unit: "N",
            hints: [L`Both blocks share the same acceleration \(a = F/(m_A + m_B)\).`, L`The only horizontal force on B is the contact force, so \(P = m_B a\).`],
            solution: [L`\[a = \frac{F}{m_A + m_B} = \frac{${fmt(F)}}{${fmt(m1 + m2)}} = ${q(F / (m1 + m2), "m/s^2", 3)}\]`, L`\[P = m_B a = ${q(P, "N", 3)}\]`],
          };
        },
      },
      {
        title: "Incline with friction",
        level: 3,
        gen(r) {
          const th = r.num(30, 50, 5), mu = r.num(0.1, 0.4, 0.05);
          const a = g * (Math.sin(rad(th)) - mu * Math.cos(rad(th)));
          return {
            prompt: `A sled slides down a ${qty(th, "deg")} snowy hill. The coefficient of kinetic friction is \\(\\mu_k = ${fmt(mu)}\\). What is the sled's acceleration down the slope?`,
            answer: a, unit: "m/s^2",
            hints: [L`Along the slope: gravity component \(mg\sin\theta\) down, friction \(\mu_k mg\cos\theta\) up.`, L`Mass cancels: \(a = g(\sin\theta - \mu_k\cos\theta)\).`],
            solution: [L`\[a = g(\sin\theta - \mu_k\cos\theta) = 9.8(\sin ${fmt(th)}^\circ - ${fmt(mu)}\cos ${fmt(th)}^\circ)\]`, L`\[a = ${q(a, "m/s^2", 3)}\]`],
          };
        },
      },
    ],
  });
})();
