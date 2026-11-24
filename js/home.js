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

  document.getElementById("stat-topics").textContent = F.topics.length;
  document.getElementById("stat-types").textContent = F.totalTemplates();
  document.getElementById("stat-solved").textContent = solved;

  F.renderMath(document.body);
});
