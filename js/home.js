document.addEventListener("DOMContentLoaded", function () {
  const F = window.FIZIKS;
  const progress = F.loadProgress();
  const grid = document.getElementById("topic-grid");

  let solved = 0;
  F.topics.forEach((t) => {
    const p = progress[t.id] || { attempted: 0, correct: 0 };
    solved += p.correct;
    const counts = [1, 2, 3].map((l) => t.problems.filter((x) => x.level === l).length);
    const pct = p.attempted ? Math.round((100 * p.correct) / p.attempted) : 0;

    const a = document.createElement("a");
    a.className = "topic-card";
    a.href = `practice.html?topic=${t.id}`;
    a.innerHTML = `
      <div class="symbol">\\(${t.symbol}\\)</div>
      <span class="tag">${t.tag}</span>
      <h3>${t.name}</h3>
      <p>${t.blurb}</p>
      <div class="topic-meta">
        <span>${t.problems.length} types · ${counts[0]} intro · ${counts[1]} std · ${counts[2]} challenge</span>
      </div>
      <div class="topic-meta">
        <span>${p.attempted ? `${p.correct}/${p.attempted} first-try correct` : "Not started"}</span>
        <span>${p.attempted ? pct + "%" : ""}</span>
      </div>
      <div class="bar"><span style="width:${pct}%"></span></div>`;
    grid.appendChild(a);
  });

  // Physics history quiz cards
  const H = F.history;
  const hgrid = document.getElementById("history-grid");
  if (H && hgrid) {
    let best = {};
    try {
      best = (JSON.parse(localStorage.getItem("fiziks.history.v1")) || {}).best || {};
    } catch (e) {
      /* ignore */
    }
    H.categories.forEach((c) => {
      const n = H.questions.filter((q) => q.c === c.id).length;
      const b = best[c.id];
      const a = document.createElement("a");
      a.className = "topic-card";
      a.href = `history.html?cat=${c.id}`;
      a.innerHTML = `
        <span class="tag"></span>
        <h3></h3>
        <p></p>
        <div class="topic-meta"><span>${n} questions</span><span>${b == null ? "Not played" : "Best " + Math.round(b * 100) + "%"}</span></div>`;
      a.querySelector(".tag").textContent = c.era;
      a.querySelector("h3").textContent = c.name;
      a.querySelector("p").textContent = c.blurb;
      hgrid.appendChild(a);
    });
  }

  document.getElementById("stat-topics").textContent = F.topics.length;
  document.getElementById("stat-types").textContent = F.totalTemplates();
  document.getElementById("stat-solved").textContent = solved;

  F.renderMath(document.body);
});
