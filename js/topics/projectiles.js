(function () {
  const { L, fmt, qty, q, C } = FIZIKS;
  const g = C.g;
  const rad = (d) => (d * Math.PI) / 180;

  FIZIKS.addTopic({
    id: "projectiles",
    name: "Projectile Motion",
    tag: "Motion in two dimensions",
    symbol: L`R = \frac{v^2 \sin 2\theta}{g}`,
    blurb: "Horizontal launches, angled launches, range, flight time and maximum height.",
    problems: [
      {
        title: "Rolling off a table",
        level: 1,
        gen(r) {
          const h = r.num(0.7, 1.5, 0.05), v = r.num(1, 5, 0.5);
          const t = Math.sqrt((2 * h) / g);
          return {
            prompt: `A marble rolls off a table ${qty(h, "m")} high at ${qty(v, "m/s")}. How long does it take to hit the floor?`,
            answer: t, unit: "s",
            hints: ["Horizontal and vertical motion are independent.", "The marble starts with zero vertical velocity, so the horizontal speed doesn't affect the fall time."],
            solution: [L`\[h = \tfrac12 g t^2 \;\Rightarrow\; t = \sqrt{\frac{2h}{g}} = \sqrt{\frac{2(${fmt(h)})}{9.8}}\]`, L`\[t = ${q(t, "s", 3)}\]`],
          };
        },
      },
      {
        title: "Horizontal launch: range",
        level: 1,
        gen(r) {
          const h = r.num(5, 50, 5), v = r.num(3, 20, 1);
          const t = Math.sqrt((2 * h) / g), R = v * t;
          return {
            prompt: `A ball is kicked horizontally at ${qty(v, "m/s")} off a cliff ${qty(h, "m")} high. How far from the base of the cliff does it land?`,
            answer: R, unit: "m",
            hints: [L`First find the fall time from \(h = \tfrac12 g t^2\).`, L`Horizontal distance: \(x = v t\).`],
            solution: [L`\[t = \sqrt{\frac{2h}{g}} = \sqrt{\frac{2(${fmt(h)})}{9.8}} = ${q(t, "s", 3)}\]`, L`\[x = vt = (${fmt(v)})(${fmt(t, 3)}) = ${q(R, "m", 3)}\]`],
          };
        },
      },
      {
        title: "Angled launch: time of flight",
        level: 2,
        gen(r) {
          const v = r.num(10, 40, 1), th = r.num(20, 70, 5);
          const T = (2 * v * Math.sin(rad(th))) / g;
          return {
            prompt: `A projectile is launched at ${qty(v, "m/s")} at ${qty(th, "deg")} above the horizontal over level ground. How long is it in the air?`,
            answer: T, unit: "s",
            hints: [L`Only the vertical component matters for time: \(v_y = v\sin\theta\).`, L`Total time: \(T = 2v_y/g\).`],
            solution: [L`\[v_y = v\sin\theta = ${fmt(v)}\sin ${fmt(th)}^\circ = ${q(v * Math.sin(rad(th)), "m/s", 3)}\]`, L`\[T = \frac{2v_y}{g} = ${q(T, "s", 3)}\]`],
          };
        },
      },
      {
        title: "Angled launch: range",
        level: 2,
        gen(r) {
          const v = r.num(10, 40, 1), th = r.num(15, 75, 5);
          const R = (v * v * Math.sin(rad(2 * th))) / g;
          return {
            prompt: `A golf ball leaves the ground at ${qty(v, "m/s")} at an angle of ${qty(th, "deg")}. Ignoring air resistance, how far away does it land on level ground?`,
            answer: R, unit: "m",
            hints: [L`Range on level ground: \(R = \dfrac{v^2 \sin 2\theta}{g}\).`, L`Or find the flight time from \(v_y\) and multiply by \(v_x\).`],
            solution: [L`\[R = \frac{v^2\sin 2\theta}{g} = \frac{(${fmt(v)})^2 \sin ${fmt(2 * th)}^\circ}{9.8}\]`, L`\[R = ${q(R, "m", 3)}\]`],
          };
        },
      },
      {
        title: "Angled launch: maximum height",
        level: 2,
        gen(r) {
          const v = r.num(10, 40, 1), th = r.num(20, 80, 5);
          const vy = v * Math.sin(rad(th)), H = (vy * vy) / (2 * g);
          return {
            prompt: `A soccer ball is kicked at ${qty(v, "m/s")} at ${qty(th, "deg")} above the horizontal. What maximum height does it reach?`,
            answer: H, unit: "m",
            hints: [L`At the peak, the vertical velocity is zero.`, L`\(H = \dfrac{(v\sin\theta)^2}{2g}\)`],
            solution: [L`\[v_y = ${fmt(v)}\sin ${fmt(th)}^\circ = ${q(vy, "m/s", 3)}\]`, L`\[H = \frac{v_y^2}{2g} = \frac{(${fmt(vy, 3)})^2}{2(9.8)} = ${q(H, "m", 3)}\]`],
          };
        },
      },
      {
        title: "Horizontal launch: impact speed",
        level: 3,
        gen(r) {
          const h = r.num(5, 60, 5), v = r.num(4, 20, 1);
          const vy = Math.sqrt(2 * g * h), s = Math.sqrt(v * v + vy * vy);
          return {
            prompt: `A package is pushed horizontally at ${qty(v, "m/s")} off a platform ${qty(h, "m")} high. With what speed does it hit the ground?`,
            answer: s, unit: "m/s",
            hints: [L`The horizontal velocity stays at \(${fmt(v)}\) m/s the whole time.`, L`Find the vertical velocity at impact with \(v_y^2 = 2gh\), then combine the components.`],
            solution: [L`\[v_y = \sqrt{2gh} = \sqrt{2(9.8)(${fmt(h)})} = ${q(vy, "m/s", 3)}\]`, L`\[v = \sqrt{v_x^2 + v_y^2} = \sqrt{${fmt(v)}^2 + ${fmt(vy, 3)}^2} = ${q(s, "m/s", 3)}\]`],
          };
        },
      },
      {
        title: "Launch speed to hit a target",
        level: 3,
        gen(r) {
          const d = r.num(5, 30, 1), h = r.num(2, 20, 1);
          const t = Math.sqrt((2 * h) / g), v = d / t;
          return {
            prompt: `A stunt rider leaves a horizontal ramp ${qty(h, "m")} above a landing pad. The pad is ${qty(d, "m")} away horizontally. At what minimum speed must the rider leave the ramp?`,
            answer: v, unit: "m/s",
            hints: ["The fall time is fixed by the height.", L`Then \(v = d / t\).`],
            solution: [L`\[t = \sqrt{\frac{2h}{g}} = ${q(t, "s", 3)}\]`, L`\[v = \frac{d}{t} = \frac{${fmt(d)}}{${fmt(t, 3)}} = ${q(v, "m/s", 3)}\]`],
          };
        },
      },
    ],
  });
})();
