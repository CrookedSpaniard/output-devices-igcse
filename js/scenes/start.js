FD.add({
  id: 'start',
  title: 'Start here',
  tab: 'Start',
  icon: 'start',
  color: '--accent',
  page: true,
  mount(el) {
    const S = FD.state;
    const nodes = [[60, 45, '🖥️'], [160, 25, '🖨️'], [265, 30, '🧊'], [360, 55, '✒️'], [55, 180, '📽️'], [150, 205, '🔊'], [265, 205, '⚙️'], [360, 175, '🤖']];
    const part = (p) => `
      <section class="card st-part">
        <h3>Part ${p} · ${FD.PARTS[p].name} <small>${FD.PARTS[p].pages}</small></h3>
        <ul class="st-list">${FD.SECTIONS.filter((s) => s.part === p).map((s) => `
          <li><button data-go="${s.id}" style="--c:var(${s.color})">${FD.icon[s.id]}<span><b>${FD.SECTIONS.indexOf(s) + 1}. ${s.name}</b><small>${s.line}</small></span>${FD.state.checks['check-' + s.id] ? '<span class="st-done" title="Check done">✓</span>' : ''}</button></li>`).join('')}
          <li><button data-go="test${p}" style="--c:var(--red-ui)">${FD.icon.final}<span><b>Test Part ${p}</b><small>Multiple choice + exam-style questions</small></span>${S.tests['test' + p] && S.tests['test' + p].done ? '<span class="st-done">✓</span>' : ''}</button></li>
        </ul>
      </section>`;
    el.innerHTML = `
      <section class="card st-hero">
        <div>
          <p class="kick">Unit 1 · Digital devices · Output · Pearson Edexcel International GCSE ICT</p>
          <h2>Output devices</h2>
          <p><b>Output peripherals</b> are connected to a computer and <b>output the results of the computer’s processing</b>. In this lesson you will see how monitors, printers, 3D printers, plotters, data projectors, speakers and control devices turn data into something people can <b>see, hear, hold or feel</b> — and which one to choose for each job.</p>
          <div class="who">
            <label>Your name<input id="sName" autocomplete="name" placeholder="First name and surname" value="${FD.esc(S.name)}"></label>
            <label>Class<input id="sClass" placeholder="e.g. 10B" value="${FD.esc(S.cls)}"></label>
          </div>
          <p class="small" id="sMsg">Your name goes on the results you send to your teacher.</p>
          <div class="chk-btns">
            <button class="btn primary" id="sGo">${S.last && S.last !== 'start' ? '▶ Continue where I left off' : '▶ Start Part A'}</button>
            <button class="btn ghost" id="sProg" style="color:#fff;border-color:rgb(255 255 255 / .4)">${FD.icon.progress} My progress</button>
          </div>
        </div>
        <svg class="st-net" viewBox="0 0 420 230" role="img" aria-label="A computer in the middle, connected to different output devices">
          ${nodes.map(([x, y]) => `<line x1="${x}" y1="${y}" x2="210" y2="115"/>`).join('')}
          <rect class="nd" x="182" y="88" width="56" height="54" rx="8"/><text x="210" y="124" style="font-size:26px">💻</text>
          ${nodes.map(([x, y, e]) => `<circle class="nd" cx="${x}" cy="${y}" r="25"/><text x="${x}" y="${y + 8}" style="font-size:23px">${e}</text>`).join('')}
        </svg>
      </section>

      <section class="card">
        <h3>How to use this website on your own</h3>
        ${FD.HOWTO}
      </section>

      <div class="st-cols">${part('A')}${part('B')}</div>
      <p class="small muted">Want to repeat the unit from zero? <button class="link-btn danger" id="sReset">↺ Reset my progress</button></p>
      <p class="small muted">Your progress is saved in this browser only. Nothing is sent to the internet. The simulations are simplified drawings of how each device works.</p>`;
    const $ = (s) => el.querySelector(s);
    $('#sName').addEventListener('input', (e) => { FD.state.name = e.target.value; FD.save(); });
    $('#sClass').addEventListener('input', (e) => { FD.state.cls = e.target.value; FD.save(); });
    $('#sGo').addEventListener('click', () => {
      if (FD.state.last && FD.state.last !== 'start') FD.goto(FD.state.last, FD.state.step || 0);
      else FD.goto('monitor');
    });
    $('#sProg').addEventListener('click', FD.openProgress);
    $('#sReset').addEventListener('click', () => FD.openProgress('reset'));
    el.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => FD.goto(b.dataset.go)));
  },
});
