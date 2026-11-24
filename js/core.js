/* Fiziks core: seeded RNG, number formatting, answer parsing, storage, topic registry. */
(function () {
  const L = String.raw;

  const F = (window.FIZIKS = {
    topics: [],
    L,
    // Physical constants used across problem sets
    C: {
      g: 9.8,
      G: 6.674e-11,
      k: 8.99e9,
      ME: 5.97e24,
      RE: 6.37e6,
      R: 8.314,
      cWater: 4186,
      LfWater: 3.34e5,
      vSound: 343,
    },
  });

  // ---------- Seeded RNG (mulberry32) ----------
  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function decimals(step) {
    const s = String(step);
    const i = s.indexOf(".");
    return i < 0 ? 0 : s.length - i - 1;
  }

  F.makeRng = function (seed) {
    const next = mulberry32(seed);
    return {
      next,
      /** Random value in [min, max] on a grid of `step`. */
      num(min, max, step = 1) {
        const n = Math.round((max - min) / step);
        const k = Math.floor(next() * (n + 1));
        return Number((min + k * step).toFixed(decimals(step)));
      },
      int(min, max) {
        return min + Math.floor(next() * (max - min + 1));
      },
      pick(arr) {
        return arr[Math.floor(next() * arr.length)];
      },
    };
  };

  F.newSeed = () => Math.floor(Math.random() * 2147483647) + 1;

  // ---------- Formatting ----------
  /** Format a number as LaTeX, using scientific notation for very large/small values. */
  F.fmt = function (x, sig = 4) {
    if (!isFinite(x)) return String(x);
    if (x === 0) return "0";
    const a = Math.abs(x);
    if (a >= 1e5 || a < 1e-3) {
      let e = Math.floor(Math.log10(a));
      let m = Number((x / Math.pow(10, e)).toPrecision(sig));
      if (Math.abs(m) >= 10) {
        m /= 10;
        e += 1;
      }
      return `${m} \\times 10^{${e}}`;
    }
    return String(Number(x.toPrecision(sig)));
  };

  /** Short unit codes -> LaTeX. Anything else is wrapped in \mathrm{}. */
  const UNIT_MAP = {
    deg: L`^\circ`,
    C: L`^\circ\mathrm{C}`,
    Ohm: L`\Omega`,
    uC: L`\mu\mathrm{C}`,
    "J/(kg*C)": L`\mathrm{J/(kg\cdot{}^\circ C)}`,
    "1/C": L`\mathrm{({}^\circ C)^{-1}}`,
    "kg*m/s": L`\mathrm{kg\cdot m/s}`,
    "N*s": L`\mathrm{N\cdot s}`,
    dollars: L`\text{dollars}`,
    "": "",
  };
  F.unit = function (u) {
    if (u in UNIT_MAP) return UNIT_MAP[u];
    return L`\mathrm{${u}}`;
  };

  /** Inline LaTeX quantity, e.g. qty(9.8, 'm/s^2') -> \(9.8\ \mathrm{m/s^2}\) */
  F.qty = function (x, u, sig = 4) {
    const un = F.unit(u);
    const sep = un.startsWith("^") ? "" : L`\ `;
    return L`\(${F.fmt(x, sig)}${sep}${un}\)`;
  };

  /** LaTeX for "value unit" without the \( \) wrapper (for use inside equations). */
  F.q = function (x, u, sig = 4) {
    const un = F.unit(u);
    const sep = un.startsWith("^") ? "" : L`\ `;
    return `${F.fmt(x, sig)}${sep}${un}`;
  };

  // ---------- Answer checking ----------
  F.parseAnswer = function (raw) {
    if (raw == null) return NaN;
    let s = String(raw).trim().replace(/−/g, "-").replace(/,/g, "").replace(/\s+/g, "");
    // 1.2x10^3, 1.2*10^-3, 1.2×10^(3), 1.2·10^3
    s = s.replace(/(?:x|X|\*|×|·)10\^?\(?([+-]?\d+)\)?$/, "e$1");
    s = s.replace(/^10\^\(?([+-]?\d+)\)?$/, "1e$1");
    if (!/^[+-]?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i.test(s)) return NaN;
    return Number(s);
  };

  /** True if `value` is within relative tolerance `tol` of `answer`. */
  F.isCorrect = function (value, answer, tol = 0.02) {
    if (!isFinite(value)) return false;
    if (answer === 0) return Math.abs(value) < 1e-9;
    return Math.abs(value - answer) <= tol * Math.abs(answer);
  };

  // ---------- Storage (best effort; page works without it) ----------
  const KEY = "fiziks.progress.v1";
  F.loadProgress = function () {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || {};
    } catch (e) {
      return {};
    }
  };
  F.saveProgress = function (p) {
    try {
      localStorage.setItem(KEY, JSON.stringify(p));
    } catch (e) {
      /* ignore */
    }
  };
  F.recordAttempt = function (topicId, correct) {
    const p = F.loadProgress();
    const t = (p[topicId] = p[topicId] || { attempted: 0, correct: 0 });
    t.attempted += 1;
    if (correct) t.correct += 1;
    F.saveProgress(p);
    return t;
  };

  // ---------- Topic registry ----------
  F.addTopic = (t) => F.topics.push(t);
  F.getTopic = (id) => F.topics.find((t) => t.id === id);
  F.totalTemplates = () => F.topics.reduce((n, t) => n + t.problems.length, 0);

  F.LEVELS = { 1: "Intro", 2: "Standard", 3: "Challenge" };

  // ---------- KaTeX helper ----------
  F.renderMath = function (el) {
    if (window.renderMathInElement) {
      window.renderMathInElement(el, {
        delimiters: [
          { left: "\\[", right: "\\]", display: true },
          { left: "\\(", right: "\\)", display: false },
        ],
        throwOnError: false,
      });
    }
  };
})();
