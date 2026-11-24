(function () {
  const { L, fmt, qty, q, C } = FIZIKS;
  const g = C.g;
  const rad = (d) => (d * Math.PI) / 180;
  const deg = (r) => (r * 180) / Math.PI;

  FIZIKS.addTopic({
    id: "waves",
    name: "Waves, Oscillations & Optics",
    tag: "Sound, light and vibration",
    symbol: L`v = f\lambda`,
    blurb: "Wave speed, pendulums, springs, echoes, standing waves, refraction and thin lenses.",
    problems: [
      {
        title: "Wavelength from frequency",
        level: 1,
        gen(r) {
          const f = r.num(100, 2000, 20), v = C.vSound;
          return {
            prompt: `A tuning fork produces a ${qty(f, "Hz")} tone in air, where sound travels at ${qty(v, "m/s")}. What is the wavelength?`,
            answer: v / f, unit: "m",
            hints: [L`\(v = f\lambda\)`],
            solution: [L`\[\lambda = \frac{v}{f} = \frac{${fmt(v)}}{${fmt(f)}} = ${q(v / f, "m", 3)}\]`],
          };
        },
      },
      {
        title: "Period from frequency",
        level: 1,
        gen(r) {
          const f = r.num(20, 1000, 10);
          return {
            prompt: `A wave has a frequency of ${qty(f, "Hz")}. What is its period in milliseconds?`,
            answer: 1000 / f, unit: "ms",
            hints: [L`\(T = 1/f\). Then convert seconds to milliseconds.`],
            solution: [L`\[T = \frac{1}{f} = \frac{1}{${fmt(f)}} = ${fmt(1 / f, 3)}\ \mathrm{s} = ${q(1000 / f, "ms", 3)}\]`],
          };
        },
      },
      {
        title: "Echo distance",
        level: 1,
        gen(r) {
          const t = r.num(0.4, 6, 0.1), v = C.vSound;
          const d = (v * t) / 2;
          return {
            prompt: `You shout toward a cliff and hear the echo ${qty(t, "s")} later. If sound travels at ${qty(v, "m/s")}, how far away is the cliff?`,
            answer: d, unit: "m",
            hints: ["The sound travels to the cliff and back."],
            solution: [L`\[d = \frac{vt}{2} = \frac{(${fmt(v)})(${fmt(t)})}{2} = ${q(d, "m", 3)}\]`],
          };
        },
      },
      {
        title: "Pendulum period",
        level: 2,
        gen(r) {
          const Lp = r.num(0.2, 3, 0.1);
          const T = 2 * Math.PI * Math.sqrt(Lp / g);
          return {
            prompt: `What is the period of a simple pendulum of length ${qty(Lp, "m")} swinging with small amplitude?`,
            answer: T, unit: "s",
            hints: [L`\(T = 2\pi\sqrt{L/g}\). The mass doesn't matter.`],
            solution: [L`\[T = 2\pi\sqrt{\frac{${fmt(Lp)}}{9.8}} = ${q(T, "s", 3)}\]`],
          };
        },
      },
      {
        title: "Mass–spring period",
        level: 2,
        gen(r) {
          const m = r.num(0.1, 3, 0.1), kk = r.num(10, 500, 10);
          const T = 2 * Math.PI * Math.sqrt(m / kk);
          return {
            prompt: `A ${qty(m, "kg")} mass oscillates on a spring with \\(k = ${fmt(kk)}\\ \\mathrm{N/m}\\). What is the period of oscillation?`,
            answer: T, unit: "s",
            hints: [L`\(T = 2\pi\sqrt{m/k}\)`],
            solution: [L`\[T = 2\pi\sqrt{\frac{${fmt(m)}}{${fmt(kk)}}} = ${q(T, "s", 3)}\]`],
          };
        },
      },
      {
        title: "Snell's law",
        level: 2,
        gen(r) {
          const med = r.pick([
            ["water", 1.33],
            ["glass", 1.5],
            ["acrylic", 1.49],
            ["diamond", 2.42],
          ]);
          const th1 = r.num(15, 75, 5);
          const th2 = deg(Math.asin(Math.sin(rad(th1)) / med[1]));
          return {
            prompt: `Light in air (\\(n = 1.00\\)) strikes the surface of ${med[0]} (\\(n = ${med[1]}\\)) at ${qty(th1, "deg")} from the normal. What is the angle of refraction, in degrees?`,
            answer: th2, unit: "deg",
            hints: [L`\(n_1\sin\theta_1 = n_2\sin\theta_2\)`, "Light bends toward the normal when it enters a denser medium."],
            solution: [L`\[\sin\theta_2 = \frac{n_1\sin\theta_1}{n_2} = \frac{\sin ${fmt(th1)}^\circ}{${med[1]}} = ${fmt(Math.sin(rad(th2)), 3)}\]`, L`\[\theta_2 = ${fmt(th2, 3)}^\circ\]`],
          };
        },
      },
      {
        title: "Thin lens image distance",
        level: 3,
        gen(r) {
          const f = r.num(5, 30, 1), dO = f + r.num(2, 40, 1);
          const di = 1 / (1 / f - 1 / dO);
          return {
            prompt: `An object is placed ${qty(dO, "cm")} in front of a converging lens with focal length ${qty(f, "cm")}. How far from the lens does the image form?`,
            answer: di, unit: "cm",
            hints: [L`Thin lens equation: \(\dfrac{1}{f} = \dfrac{1}{d_o} + \dfrac{1}{d_i}\).`],
            solution: [L`\[\frac{1}{d_i} = \frac{1}{${fmt(f)}} - \frac{1}{${fmt(dO)}}\]`, L`\[d_i = ${q(di, "cm", 3)}\]`],
          };
        },
      },
      {
        title: "Fundamental frequency of a string",
        level: 3,
        gen(r) {
          const Ls = r.num(0.3, 1.2, 0.05), T = r.num(20, 200, 10), mu = r.num(0.5, 5, 0.5);
          const v = Math.sqrt(T / (mu / 1000)), f = v / (2 * Ls);
          return {
            prompt: `A guitar string ${qty(Ls, "m")} long has linear mass density ${qty(mu, "g/m")} and is under ${qty(T, "N")} of tension. What is its fundamental frequency?`,
            answer: f, unit: "Hz",
            hints: [L`Wave speed on a string: \(v = \sqrt{T/\mu}\), with \(\mu\) in kg/m.`, L`The fundamental has \(\lambda = 2L\), so \(f_1 = v/2L\).`],
            solution: [L`\[v = \sqrt{\frac{${fmt(T)}}{${fmt(mu / 1000)}}} = ${q(v, "m/s", 3)}\]`, L`\[f_1 = \frac{v}{2L} = \frac{${fmt(v, 3)}}{2(${fmt(Ls)})} = ${q(f, "Hz", 3)}\]`],
          };
        },
      },
    ],
  });
})();
