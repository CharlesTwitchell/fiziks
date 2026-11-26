document.addEventListener("DOMContentLoaded", function () {
  const F = window.FIZIKS;
  const H = F.history;
  const $ = (id) => document.getElementById(id);
  const ROUND = 10;
  const KEY = "fiziks.history.v1";

  // ---------- Storage ----------
  function load() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || { seen: {}, best: {} };
    } catch (e) {
      return { seen: {}, best: {} };
    }
  }
  function save(d) {
    try {
      localStorage.setItem(KEY, JSON.stringify(d));
    } catch (e) {
      /* ignore */
    }
  }
  const store = load();
  store.seen = store.seen || {};
  store.best = store.best || {};

  // Stable id for each question so "seen" survives reordering of the data file.
  const qid = (q) => q.q.slice(0, 60);

  function shuffle(a) {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const catName = (id) => (id === "all" ? "All eras" : H.categories.find((c) => c.id === id).name);

  // ---------- State ----------
  const params = new URLSearchParams(location.search);
  const state = {
    cat: H.categories.some((c) => c.id === params.get("cat")) ? params.get("cat") : "all",
    round: [],
    i: 0,
    score: 0,
    answered: false,
    missed: [],
  };

  // ---------- Category chips ----------
  const chips = $("cat-chips");
  [{ id: "all", name: "All eras" }, ...H.categories].forEach((c) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    b.dataset.cat = c.id;
    b.textContent = c.name;
    chips.appendChild(b);
  });
  chips.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    state.cat = b.dataset.cat;
    startRound();
  });
  function syncChips() {
    chips.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.cat === state.cat)));
  }

  // ---------- Round ----------
  function startRound() {
    syncChips();
    try {
      history.replaceState(null, "", state.cat === "all" ? location.pathname : `${location.pathname}?cat=${state.cat}`);
    } catch (e) {
      /* ignore */
    }
    const pool = H.questions.filter((q) => state.cat === "all" || q.c === state.cat);
    const unseen = shuffle(pool.filter((q) => !store.seen[qid(q)]));
    const seen = shuffle(pool.filter((q) => store.seen[qid(q)]));
    state.round = unseen.concat(seen).slice(0, ROUND);
    // If everything has been seen, start the cycle over for this era.
    if (!unseen.length) pool.forEach((q) => delete store.seen[qid(q)]);
    state.i = 0;
    state.score = 0;
    state.missed = [];
    $("results").hidden = true;
    $("quiz-card").hidden = false;
    showQuestion();
  }

  function showQuestion() {
    const q = state.round[state.i];
    const cat = H.categories.find((c) => c.id === q.c);
    state.answered = false;
    state.options = shuffle([q.a, ...q.w]);

    $("q-count").textContent = `Question ${state.i + 1} of ${state.round.length}`;
    $("q-score").textContent = `Score: ${state.score}`;
    $("q-bar").style.width = `${(100 * state.i) / state.round.length}%`;
    $("q-meta").innerHTML = `<span class="pill">${cat.name}</span><span>${cat.era}</span>`;
    $("q-text").textContent = q.q;

    const box = $("q-options");
    box.innerHTML = "";
    state.options.forEach((opt, k) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "option";
      b.innerHTML = `<span class="key">${k + 1}</span><span></span>`;
      b.lastChild.textContent = opt;
      b.addEventListener("click", () => answer(k));
      box.appendChild(b);
    });
    $("q-explain").hidden = true;
    $("q-tools").hidden = true;
  }

  function answer(k) {
    if (state.answered) return;
    state.answered = true;
    const q = state.round[state.i];
    const chosen = state.options[k];
    const right = chosen === q.a;
    store.seen[qid(q)] = 1;
    save(store);

    if (right) state.score += 1;
    else state.missed.push({ q, chosen });

    $("q-options").querySelectorAll(".option").forEach((b, j) => {
      b.disabled = true;
      if (state.options[j] === q.a) b.classList.add("correct");
      else if (j === k) b.classList.add("wrong");
    });

    const ex = $("q-explain");
    ex.hidden = false;
    ex.className = `explain ${right ? "good" : "bad"}`;
    ex.innerHTML = `<strong>${right ? "Correct!" : "Not quite."}</strong> <span></span>`;
    ex.lastChild.textContent = q.ex;

    $("q-score").textContent = `Score: ${state.score}`;
    $("q-bar").style.width = `${(100 * (state.i + 1)) / state.round.length}%`;
    $("q-tools").hidden = false;
    const last = state.i === state.round.length - 1;
    $("q-next").textContent = last ? "See results →" : "Next question →";
    $("q-next").focus({ preventScroll: true });
  }

  function nextQuestion() {
    if (!state.answered) return;
    if (state.i < state.round.length - 1) {
      state.i += 1;
      showQuestion();
    } else {
      showResults();
    }
  }

  function showResults() {
    const n = state.round.length, s = state.score;
    const prevBest = store.best[state.cat];
    const pct = s / n;
    if (prevBest == null || pct > prevBest) store.best[state.cat] = pct;
    save(store);

    $("quiz-card").hidden = true;
    $("results").hidden = false;
    $("r-score").textContent = `${s} / ${n}`;
    const msg =
      pct === 1 ? "A perfect round. Newton would be impressed."
      : pct >= 0.8 ? "Excellent. You know your physics history."
      : pct >= 0.5 ? "Solid work. Review the ones you missed below."
      : "Every great physicist started somewhere. Read the notes below and try again.";
    $("r-msg").textContent = `${catName(state.cat)}: ${msg}${prevBest != null && pct > prevBest ? " New best score!" : ""}`;

    const box = $("r-missed");
    box.innerHTML = "";
    if (state.missed.length) {
      const h = document.createElement("h4");
      h.textContent = "Review";
      box.appendChild(h);
      state.missed.forEach(({ q, chosen }) => {
        const d = document.createElement("div");
        d.className = "missed-item";
        d.innerHTML = `<p class="mq"></p><p class="ma"></p><p class="mx"></p>`;
        d.querySelector(".mq").textContent = q.q;
        d.querySelector(".ma").innerHTML = `<span class="no"></span> → <span class="yes"></span>`;
        d.querySelector(".no").textContent = chosen;
        d.querySelector(".yes").textContent = q.a;
        d.querySelector(".mx").textContent = q.ex;
        box.appendChild(d);
      });
    }
    renderBest();
    $("r-again").focus({ preventScroll: true });
  }

  function renderBest() {
    const list = $("best-list");
    list.innerHTML = "";
    [{ id: "all" }, ...H.categories].forEach((c) => {
      const row = document.createElement("div");
      row.className = "stat-row";
      const b = store.best[c.id];
      row.innerHTML = `<span></span><strong>${b == null ? "–" : Math.round(b * 100) + "%"}</strong>`;
      row.firstChild.textContent = catName(c.id);
      list.appendChild(row);
    });
  }

  // ---------- Events ----------
  $("q-next").addEventListener("click", nextQuestion);
  $("r-again").addEventListener("click", startRound);
  document.addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (!$("quiz-card").hidden && !state.answered && /^[1-4]$/.test(e.key)) {
      answer(Number(e.key) - 1);
    } else if (e.key === "Enter" && state.answered && !$("quiz-card").hidden && document.activeElement !== $("q-next")) {
      e.preventDefault();
      nextQuestion();
    }
  });

  renderBest();
  startRound();
});
