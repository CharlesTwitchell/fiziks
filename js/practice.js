document.addEventListener("DOMContentLoaded", function () {
  const F = window.FIZIKS;
  const $ = (id) => document.getElementById(id);

  const els = {
    topic: $("topic-select"),
    levels: $("level-filter"),
    meta: $("problem-meta"),
    text: $("problem-text"),
    form: $("answer-form"),
    input: $("answer"),
    unit: $("answer-unit"),
    check: $("check-btn"),
    feedback: $("feedback"),
    hintBtn: $("hint-btn"),
    solBtn: $("solution-btn"),
    nextBtn: $("next-btn"),
    hints: $("hints"),
    hintList: $("hint-list"),
    solution: $("solution"),
    solBody: $("solution-body"),
    share: $("share-btn"),
  };

  // ---------- State ----------
  const params = new URLSearchParams(location.search);
  const state = {
    topicId: F.getTopic(params.get("topic")) ? params.get("topic") : "mixed",
    level: ["1", "2", "3"].includes(params.get("level")) ? Number(params.get("level")) : "all",
    seed: Number(params.get("seed")) || null,
    current: null, // { topic, tpl, data }
    wrong: 0,
    recorded: false,
    solved: false,
    revealed: false,
    hintsShown: 0,
  };
  const session = { solved: 0, first: 0, streak: 0, best: 0 };

  // ---------- Controls ----------
  const optMixed = new Option("All topics (mixed)", "mixed");
  els.topic.add(optMixed);
  F.topics.forEach((t) => els.topic.add(new Option(t.name, t.id)));
  els.topic.value = state.topicId;

  function syncLevelButtons() {
    els.levels.querySelectorAll("button").forEach((b) => {
      b.setAttribute("aria-pressed", String(String(state.level) === b.dataset.level));
    });
  }
  syncLevelButtons();

  els.topic.addEventListener("change", () => {
    state.topicId = els.topic.value;
    next();
  });
  els.levels.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    state.level = b.dataset.level === "all" ? "all" : Number(b.dataset.level);
    syncLevelButtons();
    next();
  });

  // ---------- Problem selection ----------
  function pool() {
    const topics = state.topicId === "mixed" ? F.topics : [F.getTopic(state.topicId)];
    const items = [];
    topics.forEach((topic) =>
      topic.problems.forEach((tpl) => {
        if (state.level === "all" || tpl.level === state.level) items.push({ topic, tpl });
      })
    );
    return items;
  }

  function build(seed) {
    const items = pool();
    if (!items.length) return null;
    const r = F.makeRng(seed);
    const item = r.pick(items);
    return { ...item, data: item.tpl.gen(r) };
  }

  function updateUrl() {
    const p = new URLSearchParams();
    p.set("topic", state.topicId);
    if (state.level !== "all") p.set("level", state.level);
    p.set("seed", state.seed);
    try {
      history.replaceState(null, "", `${location.pathname}?${p}`);
    } catch (e) {
      /* file:// in some browsers */
    }
  }

  function next() {
    const prevTitle = state.current && state.current.tpl.title;
    let seed, prob;
    for (let i = 0; i < 8; i++) {
      seed = F.newSeed();
      prob = build(seed);
      if (!prob || prob.tpl.title !== prevTitle || pool().length === 1) break;
    }
    state.seed = seed;
    show(prob);
  }

  // ---------- Rendering ----------
  function answerLatex(d) {
    const u = F.unit(d.unit);
    const sep = !u || u.startsWith("^") ? "" : "\\ ";
    return `\\(${F.fmt(d.answer, 3)}${sep}${u}\\)`;
  }

  function show(prob) {
    state.current = prob;
    state.wrong = 0;
    state.recorded = false;
    state.solved = false;
    state.revealed = false;
    state.hintsShown = 0;
    updateUrl();

    if (!prob) {
      els.text.textContent = "No problems match this filter.";
      return;
    }
    const { topic, tpl, data } = prob;
    els.meta.innerHTML = `
      <span>${topic.name}</span><span aria-hidden="true">·</span>
      <span>${tpl.title}</span>
      <span class="pill l${tpl.level}">${F.LEVELS[tpl.level]}</span>`;
    els.text.innerHTML = data.prompt;
    els.unit.innerHTML = F.unit(data.unit) ? `\\(${F.unit(data.unit)}\\)` : "";
    els.input.value = "";
    els.input.disabled = false;
    els.check.textContent = "Check";
    els.feedback.hidden = true;
    els.hints.hidden = true;
    els.hintList.innerHTML = "";
    els.solution.hidden = true;
    els.solBody.innerHTML = "";
    updateHintBtn();
    els.solBtn.disabled = false;

    F.renderMath(els.meta.parentNode);
    els.input.focus({ preventScroll: true });
  }

  function setFeedback(kind, html) {
    els.feedback.hidden = false;
    els.feedback.className = `feedback ${kind}`;
    els.feedback.innerHTML = html;
    F.renderMath(els.feedback);
  }

  function updateHintBtn() {
    const total = state.current ? state.current.data.hints.length : 0;
    const left = total - state.hintsShown;
    els.hintBtn.disabled = left <= 0;
    els.hintBtn.textContent = left > 0 ? `Hint (${left} left)` : "No more hints";
  }

  function renderSession() {
    $("s-solved").textContent = session.solved;
    $("s-first").textContent = session.first;
    $("s-streak").textContent = session.streak;
    $("s-best").textContent = session.best;
  }

  function record(correct) {
    if (state.recorded) return;
    state.recorded = true;
    F.recordAttempt(state.current.topic.id, correct);
  }

  // A helpful nudge when an answer is wrong in a recognizable way.
  function diagnose(value, answer) {
    if (value !== 0 && F.isCorrect(-value, answer)) return "Check your sign.";
    const ratio = value / answer;
    if (ratio > 0) {
      const p = Math.log10(ratio);
      const k = Math.round(p);
      if (k !== 0 && Math.abs(p - k) < 0.01) return `You're off by a factor of \\(10^{${k}}\\). Check your unit conversions.`;
      if (Math.abs(ratio - 2) < 0.04 || Math.abs(ratio - 0.5) < 0.01) return "You're off by a factor of 2. Check for a missing ½ or 2.";
    }
    return "";
  }

  // ---------- Actions ----------
  els.form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!state.current) return;
    if (state.solved || state.revealed) return next();

    const d = state.current.data;
    const value = F.parseAnswer(els.input.value);
    if (!isFinite(value)) {
      setFeedback("info", "Enter a number, like <code>12.5</code> or <code>3.2e-5</code>.");
      return;
    }

    if (F.isCorrect(value, d.answer)) {
      const firstTry = state.wrong === 0 && !state.recorded;
      record(firstTry);
      state.solved = true;
      session.solved += 1;
      if (firstTry) session.first += 1;
      session.streak += 1;
      session.best = Math.max(session.best, session.streak);
      renderSession();
      els.input.disabled = true;
      els.check.textContent = "Next →";
      setFeedback("good", `Correct! The answer is ${answerLatex(d)}.${state.revealed ? "" : " Open the worked solution to compare methods."}`);
      els.check.focus();
    } else {
      record(false);
      state.wrong += 1;
      session.streak = 0;
      renderSession();
      const tip = diagnose(value, d.answer);
      const more =
        state.wrong >= 3
          ? " Try opening the worked solution."
          : state.hintsShown < d.hints.length
          ? " Try a hint."
          : "";
      setFeedback("bad", `Not quite. ${tip}${more}`);
      els.input.select();
    }
  });

  els.hintBtn.addEventListener("click", () => {
    const d = state.current && state.current.data;
    if (!d || state.hintsShown >= d.hints.length) return;
    const li = document.createElement("li");
    li.innerHTML = d.hints[state.hintsShown];
    els.hintList.appendChild(li);
    els.hints.hidden = false;
    state.hintsShown += 1;
    F.renderMath(li);
    updateHintBtn();
  });

  els.solBtn.addEventListener("click", () => {
    const d = state.current && state.current.data;
    if (!d) return;
    if (!state.solved) {
      record(false);
      state.revealed = true;
      session.streak = 0;
      renderSession();
      els.check.textContent = "Next →";
      els.input.disabled = true;
    }
    els.solBody.innerHTML =
      d.solution.map((s) => `<div>${s}</div>`).join("") + `<p class="final">Answer: ${answerLatex(d)}</p>`;
    els.solution.hidden = false;
    els.solBtn.disabled = true;
    F.renderMath(els.solution);
  });

  els.nextBtn.addEventListener("click", next);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && (state.solved || state.revealed) && document.activeElement !== els.check) {
      e.preventDefault();
      next();
    }
  });

  els.share.addEventListener("click", async () => {
    const url = location.href;
    try {
      await navigator.clipboard.writeText(url);
      els.share.textContent = "Link copied";
    } catch (e) {
      window.prompt("Copy this link:", url);
    }
    setTimeout(() => (els.share.textContent = "Copy link to this problem"), 1800);
  });

  // ---------- Start ----------
  renderSession();
  if (state.seed) {
    show(build(state.seed));
  } else {
    next();
  }
  F.renderMath(document.querySelector(".site-footer"));
});
