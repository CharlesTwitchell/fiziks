(function () {
  const { L, fmt, qty, q, C } = FIZIKS;
  const g = C.g;

  FIZIKS.addTopic({
    id: "kinematics",
    name: "Kinematics",
    tag: "Motion in one dimension",
    symbol: L`v = v_0 + at`,
    blurb: "Displacement, velocity and acceleration in a straight line, including free fall.",
    problems: [
      {
        title: "Accelerating from rest",
        level: 1,
        gen(r) {
          const a = r.num(1.5, 6, 0.5), t = r.num(3, 12, 1);
          const v = a * t;
          return {
            prompt: `A car starts from rest and accelerates uniformly at ${qty(a, "m/s^2")} for ${qty(t, "s")}. What is its final speed?`,
            answer: v, unit: "m/s",
            hints: [L`"From rest" means \(v_0 = 0\).`, L`Use \(v = v_0 + at\).`],
            solution: [L`\[v = v_0 + at\]`, L`\[v = 0 + (${q(a, "m/s^2")})(${q(t, "s")}) = ${q(v, "m/s", 3)}\]`],
          };
        },
      },
      {
        title: "Distance covered from rest",
        level: 1,
        gen(r) {
          const a = r.num(1, 5, 0.5), t = r.num(2, 10, 1);
          const d = 0.5 * a * t * t;
          return {
            prompt: `A cyclist starts from rest and accelerates at ${qty(a, "m/s^2")}. How far do they travel in the first ${qty(t, "s")}?`,
            answer: d, unit: "m",
            hints: [L`With \(v_0 = 0\), the displacement is \(\Delta x = \tfrac12 a t^2\).`],
            solution: [L`\[\Delta x = v_0 t + \tfrac12 a t^2 = 0 + \tfrac12(${fmt(a)})(${fmt(t)})^2\]`, L`\[\Delta x = ${q(d, "m", 3)}\]`],
          };
        },
      },
      {
        title: "Dropped object: fall time",
        level: 1,
        gen(r) {
          const h = r.num(5, 80, 5);
          const t = Math.sqrt((2 * h) / g);
          return {
            prompt: `A stone is dropped from rest off a ledge ${qty(h, "m")} above the ground. Ignoring air resistance, how long does it take to hit the ground? Use \\(g = 9.8\\ \\mathrm{m/s^2}\\).`,
            answer: t, unit: "s",
            hints: [L`The stone starts from rest and accelerates at \(g\).`, L`Solve \(h = \tfrac12 g t^2\) for \(t\).`],
            solution: [L`\[h = \tfrac12 g t^2 \;\Rightarrow\; t = \sqrt{\frac{2h}{g}}\]`, L`\[t = \sqrt{\frac{2(${fmt(h)})}{9.8}} = ${q(t, "s", 3)}\]`],
          };
        },
      },
      {
        title: "Braking distance",
        level: 2,
        gen(r) {
          const v0 = r.num(15, 35, 1), a = r.num(3, 8, 0.5);
          const d = (v0 * v0) / (2 * a);
          return {
            prompt: `A driver traveling at ${qty(v0, "m/s")} brakes, decelerating uniformly at ${qty(a, "m/s^2")}. How far does the car travel before stopping?`,
            answer: d, unit: "m",
            hints: [L`No time is given, so use the equation without \(t\): \(v^2 = v_0^2 + 2a\Delta x\).`, L`The final speed is 0 and the acceleration is negative.`],
            solution: [L`\[0 = v_0^2 - 2a\Delta x \;\Rightarrow\; \Delta x = \frac{v_0^2}{2a}\]`, L`\[\Delta x = \frac{(${fmt(v0)})^2}{2(${fmt(a)})} = ${q(d, "m", 3)}\]`],
          };
        },
      },
      {
        title: "Maximum height of a vertical throw",
        level: 2,
        gen(r) {
          const v0 = r.num(8, 30, 1);
          const H = (v0 * v0) / (2 * g);
          return {
            prompt: `A ball is thrown straight up at ${qty(v0, "m/s")}. How high above the launch point does it rise?`,
            answer: H, unit: "m",
            hints: [L`At the top of its flight the ball's velocity is momentarily zero.`, L`Use \(v^2 = v_0^2 - 2gH\) with \(v = 0\).`],
            solution: [L`\[0 = v_0^2 - 2gH \;\Rightarrow\; H = \frac{v_0^2}{2g}\]`, L`\[H = \frac{(${fmt(v0)})^2}{2(9.8)} = ${q(H, "m", 3)}\]`],
          };
        },
      },
      {
        title: "Round-trip time of a vertical throw",
        level: 2,
        gen(r) {
          const v0 = r.num(5, 25, 1);
          const T = (2 * v0) / g;
          return {
            prompt: `A ball is tossed straight up at ${qty(v0, "m/s")} and caught at the same height it was released. How long is it in the air?`,
            answer: T, unit: "s",
            hints: [L`The time up equals the time down.`, L`Time to the top: \(t_{up} = v_0 / g\).`],
            solution: [L`\[t_{up} = \frac{v_0}{g},\qquad T = 2t_{up} = \frac{2v_0}{g}\]`, L`\[T = \frac{2(${fmt(v0)})}{9.8} = ${q(T, "s", 3)}\]`],
          };
        },
      },
      {
        title: "Average velocity over two legs",
        level: 2,
        gen(r) {
          const d1 = r.num(100, 600, 50), t1 = r.num(20, 90, 5), d2 = r.num(100, 600, 50), t2 = r.num(20, 90, 5);
          const v = (d1 + d2) / (t1 + t2);
          return {
            prompt: `A runner covers ${qty(d1, "m")} in ${qty(t1, "s")}, then continues in the same direction for another ${qty(d2, "m")} in ${qty(t2, "s")}. What is the runner's average velocity for the whole trip?`,
            answer: v, unit: "m/s",
            hints: ["Average velocity is total displacement divided by total time.", "You can't just average the two speeds, because the legs take different amounts of time."],
            solution: [L`\[\bar v = \frac{\Delta x_{tot}}{t_{tot}} = \frac{${fmt(d1)} + ${fmt(d2)}}{${fmt(t1)} + ${fmt(t2)}}\]`, L`\[\bar v = ${q(v, "m/s", 3)}\]`],
          };
        },
      },
      {
        title: "Catching a speeding car",
        level: 3,
        gen(r) {
          const v = r.num(15, 35, 1), a = r.num(2, 5, 0.5);
          const t = (2 * v) / a;
          return {
            prompt: `A car moving at a constant ${qty(v, "m/s")} passes a parked police car. At that instant the police car starts from rest and accelerates at ${qty(a, "m/s^2")}. How long does it take the police car to catch up?`,
            answer: t, unit: "s",
            hints: [L`Write a position equation for each car, both measured from the same starting point.`, L`Set \(x_{car} = vt\) equal to \(x_{police} = \tfrac12 a t^2\).`],
            solution: [L`\[vt = \tfrac12 a t^2 \;\Rightarrow\; t = \frac{2v}{a}\quad (t \ne 0)\]`, L`\[t = \frac{2(${fmt(v)})}{${fmt(a)}} = ${q(t, "s", 3)}\]`],
          };
        },
      },
      {
        title: "Thrown downward from a cliff",
        level: 3,
        gen(r) {
          const v0 = r.num(3, 15, 1), h = r.num(20, 100, 5);
          const t = (-v0 + Math.sqrt(v0 * v0 + 2 * g * h)) / g;
          return {
            prompt: `A rock is thrown straight down at ${qty(v0, "m/s")} from the top of a cliff ${qty(h, "m")} high. How long does it take to reach the bottom?`,
            answer: t, unit: "s",
            hints: [L`Take downward as positive: \(h = v_0 t + \tfrac12 g t^2\).`, "That is a quadratic in t. Use the quadratic formula and keep the positive root."],
            solution: [
              L`\[\tfrac12 g t^2 + v_0 t - h = 0\]`,
              L`\[t = \frac{-v_0 + \sqrt{v_0^2 + 2gh}}{g} = \frac{-${fmt(v0)} + \sqrt{${fmt(v0)}^2 + 2(9.8)(${fmt(h)})}}{9.8}\]`,
              L`\[t = ${q(t, "s", 3)}\]`,
            ],
          };
        },
      },
    ],
  });
})();
