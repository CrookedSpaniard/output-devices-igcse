FD.add({
  id: 'plotter',
  title: 'Plotters',
  tab: 'Plotters',
  icon: 'plotter',
  color: '--c1',
  section: true,
  interactive: true,
  vocab: [
    ['Cartographers', 'People who draw and produce maps.'],
    ['CAD', 'Computer Aided Design: software used to design products, buildings and machines.'],
  ],
  mount(el) {
    const PROS = [['📦', 'Product designers'], ['🏛️', 'Architects'], ['🔧', 'Engineers'], ['🗺️', 'Cartographers']];
    // A CAD floor plan in sheet units (sheet is 300 × 200). Each path is drawn with the pen down; moves between paths are pen up.
    const PLAN = [
      [[20, 20], [280, 20], [280, 180], [20, 180], [20, 20]],
      [[140, 20], [140, 80]], [[140, 110], [140, 180]],
      [[140, 100], [280, 100]],
      [[20, 120], [70, 120]], [[100, 120], [140, 120]],
      [[200, 100], [200, 140]],
      [[60, 50], [100, 50], [100, 80], [60, 80], [60, 50]],
      [[220, 140], [260, 140], [260, 165], [220, 165], [220, 140]],
    ];
    const STAR = [[150, 40], [165, 85], [212, 85], [174, 112], [188, 158], [150, 130], [112, 158], [126, 112], [88, 85], [135, 85], [150, 40]];
    el.innerHTML = `
      <div class="sim pl">
        <div class="ptabs" role="group" aria-label="Simulations">
          <button data-p="who">👷 Who uses plotters?</button><button data-p="draw">✒️ Plot a drawing</button><button data-p="size">📏 How big?</button>
        </div>

        <div data-panel="who" class="sim">
          <div class="pl-pros">${PROS.map(([e, n]) => `<div class="sim-box pl-pro"><span>${e}</span><b>${n}</b></div>`).join('')}</div>
          <p class="note">The plotter draws <b>high-quality images</b> created in <b>Computer Aided Design (CAD)</b> software onto <b>large sheets of paper</b>.</p>
        </div>

        <div data-panel="draw" class="sim" hidden>
          <div class="two-col pl-cols">
            <div class="sim-box pl-box">
              <svg viewBox="0 0 340 250" aria-label="A plotter drawing a floor plan">
                <clipPath id="plClip"><rect x="10" y="30" width="320" height="210"/></clipPath>
                <g clip-path="url(#plClip)"><g id="sheet"><rect class="pl-paper" id="paper" x="20" y="0" width="300" height="200"/><g id="ink"></g><g id="cut"></g></g></g>
                <rect class="pl-roller" x="10" y="226" width="320" height="10" rx="5"/>
                <rect class="pl-rail" x="10" y="118" width="320" height="8" rx="4"/>
                <g id="pen"><rect class="pl-car" x="-12" y="104" width="24" height="18" rx="3"/><g id="tip"><path class="pl-pen" d="M-3 112h6v10l-3 5-3-5z"/></g></g>
                <text class="pl-lab" x="16" y="22" id="mode">Pen up</text>
              </svg>
            </div>
            <div class="sim-box pl-ctl">
              <div class="seg" id="tool"><span class="seg-l">Attachment</span><button data-v="pen">✒️ Pen</button><button data-v="cut">✂️ Cutter</button></div>
              <div class="readout"><div class="ro"><small>Pen</small><b id="pState">up</b></div><div class="ro"><small>Paper</small><b id="rollS">still</b></div></div>
              <div class="ctrls"><button class="btn small-btn" id="go">▶ Plot</button><button class="btn ghost small-btn" id="reset">↺ New sheet</button></div>
              <p class="note" id="msg">The pen moves <b>across</b> the paper; the paper <b>rolls backwards and forwards</b>.</p>
            </div>
          </div>
        </div>

        <div data-panel="size" class="sim" hidden>
          <div class="sim-box pl-sizes">
            <svg viewBox="0 0 360 260" aria-label="An A0 sheet divided into 16 A4 sheets">
              <rect class="pl-a0" x="10" y="10" width="168.2" height="237.8"/>
              <line class="pl-grid" x1="52.1" y1="10" x2="52.1" y2="247.8"/><line class="pl-grid" x1="94.1" y1="10" x2="94.1" y2="247.8"/><line class="pl-grid" x1="136.2" y1="10" x2="136.2" y2="247.8"/><line class="pl-grid" x1="10" y1="69.5" x2="178.2" y2="69.5"/><line class="pl-grid" x1="10" y1="128.9" x2="178.2" y2="128.9"/><line class="pl-grid" x1="10" y1="188.4" x2="178.2" y2="188.4"/>
              <rect class="pl-a4" x="136.2" y="188.4" width="42.1" height="59.5"/>
              <text class="pl-lab in" x="142.2" y="204.4">A4</text>
              <text class="pl-lab" x="194.2" y="40">A0 sheet</text><text class="pl-lab sm" x="194.2" y="56">841 × 1189 mm</text>
              <text class="pl-lab" x="194.2" y="96">16 A4 sheets</text><text class="pl-lab sm" x="194.2" y="112">fit on one A0 sheet</text>
            </svg>
            <p class="note">Plotters use very large sheets (often A1 or A0, or rolls of paper) for building plans, engineering drawings, maps and posters. </p>
          </div>
        </div>
      </div>`;
    const root = el.querySelector('.pl'), $ = (s) => root.querySelector(s);
    const NS = 'http://www.w3.org/2000/svg';
    let dead = false, run = 0, tool = 'pen';
    const RAIL = 128; // y where the pen touches the paper
    function at(x, y, down) {
      // the carriage moves in x; the sheet rolls so that point y is under the pen
      $('#pen').setAttribute('transform', `translate(${20 + x} 0)`);
      $('#sheet').setAttribute('transform', `translate(0 ${RAIL - y})`);
      $('#tip').setAttribute('transform', `translate(0 ${down ? 1 : -6})`);
      $('#pState').textContent = down ? 'down (drawing)' : 'up (raised)';
      $('#mode').textContent = down ? (tool === 'cut' ? 'Cutter down' : 'Pen down') : 'Pen up';
    }
    function reset() {
      run++;
      $('#ink').innerHTML = ''; $('#cut').innerHTML = '';
      $('#paper').classList.toggle('vinyl', tool === 'cut');
      root.querySelector('.pl-box').classList.remove('peeled');
      at(150, 100, false);
      $('#rollS').textContent = 'still';
    }
    async function move(from, to, down, line, id, ctx) {
      const d = Math.hypot(to[0] - from[0], to[1] - from[1]), n = Math.max(2, Math.round(d / (down ? 4 : 9)));
      $('#rollS').textContent = Math.abs(to[1] - from[1]) < 1 ? 'still' : to[1] > from[1] ? 'rolling backwards ▲' : 'rolling forwards ▼';
      for (let k = 1; k <= n; k++) {
        const x = from[0] + ((to[0] - from[0]) * k) / n, y = from[1] + ((to[1] - from[1]) * k) / n;
        at(x, y, down);
        if (line) line.setAttribute('points', line.getAttribute('points') + ` ${20 + x},${y}`);
        await FD.wait(down ? 18 : 10);
        if (dead || id !== run || (ctx && !ctx.alive())) return false;
      }
      return true;
    }
    async function plot(ctx) {
      reset();
      const id = run;
      const paths = tool === 'cut' ? [STAR] : PLAN;
      let pos = [150, 100];
      for (const p of paths) {
        if (!(await move(pos, p[0], false, null, id, ctx))) return;
        const line = document.createElementNS(NS, 'polyline');
        line.setAttribute('points', `${20 + p[0][0]},${p[0][1]}`);
        line.setAttribute('class', tool === 'cut' ? 'pl-cutline' : 'pl-line');
        $(tool === 'cut' ? '#cut' : '#ink').appendChild(line);
        for (let i = 1; i < p.length; i++) {
          if (!(await move(p[i - 1], p[i], true, line, id, ctx))) return;
        }
        pos = p[p.length - 1];
      }
      await move(pos, [150, 100], false, null, id, ctx);
      $('#rollS').textContent = 'still';
      $('#msg').innerHTML = tool === 'cut' ? '✂️ The cutter cut the <b>vinyl</b> to make a sticker. Now it can be peeled off and stuck on clothing.' : '✅ A precise floor plan. Lines are drawn with the <b>pen down</b>; it is <b>raised</b> to move to the next line.';
      if (tool === 'cut') { await FD.wait(700); if (id === run) root.querySelector('.pl-box').classList.add('peeled'); }
    }
    function setTool(t) { tool = t; FD.segSet($('#tool'), t); reset(); $('#msg').innerHTML = t === 'cut' ? 'A <b>cutter attachment</b> instead of the pen cuts <b>vinyl</b>.' : 'The pen moves <b>across</b> the paper; the paper <b>rolls backwards and forwards</b>.'; }
    $('#tool').addEventListener('click', (e) => { const b = e.target.closest('button[data-v]'); if (b) setTool(b.dataset.v); });
    $('#go').addEventListener('click', () => plot());
    $('#reset').addEventListener('click', reset);
    setTool('pen');
    async function pros(ctx) {
      const bs = [...root.querySelectorAll('.pl-pro')];
      bs.forEach((b) => b.classList.remove('on'));
      for (const b of bs) { b.classList.add('on'); FD.pulse(b); if (!(await ctx.sleep(700))) return; }
    }
    const showP = FD.panels(root);
    showP('who');
    return { show: showP, plot, setTool, pros, destroy() { dead = true; run++; } };
  },
  steps: [
    {
      title: 'Who uses plotters?',
      text: `<p><strong>Plotters</strong> are used by a variety of professionals, including <b>product designers</b>, <b>architects</b>, <b>engineers</b> and <b>cartographers</b> (people who draw and produce maps).</p>`,
      async on(a, ctx) { a.show('who'); await a.pros(ctx); },
    },
    {
      title: 'Large, high-quality CAD drawings',
      text: `<p>The plotter draws <strong>high-quality images</strong> created in <strong>Computer Aided Design (CAD)</strong> software onto <strong>large sheets of paper</strong>.</p>`,
      on(a) { a.show('size'); },
    },
    {
      title: 'A pen that moves, up and down',
      text: `<p>It does this by <strong>moving a pen across the paper</strong> to draw the lines.</p>
             <p>The pen can be <strong>raised away from</strong> and <strong>lowered onto</strong> the sheet of paper, so it only draws where there should be a line.</p>`,
      tip: 'Try it: press Plot and watch “Pen up / Pen down”.',
      async on(a, ctx) { a.show('draw'); a.setTool('pen'); await a.plot(ctx); },
    },
    {
      title: 'Rolling the paper',
      text: `<p>Some plotters can also <strong>roll the paper backwards and forwards</strong>.</p>
             <p>The pen moves left and right along the rail while the paper moves up and down underneath it, so together they can reach any point on a huge sheet.</p>`,
      tip: 'Watch the “Paper” readout while it plots.',
      async on(a, ctx) { a.show('draw'); a.setTool('pen'); await a.plot(ctx); },
    },
    {
      title: 'Did you know? Cutting vinyl',
      text: `<p>Plotters can also use a <strong>cutter attachment</strong> instead of the pen attachment to <strong>cut vinyl</strong>.</p>
             <p>This can be used to create <b>stickers</b> or images to go on <b>printed clothing</b>.</p>`,
      tip: 'Try it: choose the cutter and press Plot.',
      async on(a, ctx) { a.show('draw'); a.setTool('cut'); await a.plot(ctx); },
    },
  ],
});

FD.check({
  section: 'plotter',
  items: [
    { type: 'multi', q: 'Which <b>three</b> professionals use plotters, according to the book?', need: 3, opts: [['Architects', true], ['Engineers', true], ['Cartographers', true], ['Pilots', false], ['Musicians', false]], why: 'Product designers, architects, engineers and cartographers.' },
    { type: 'mcq', q: 'How does a plotter draw the lines?', opts: ['It moves a pen across the paper and raises or lowers it', 'It sprays tiny dots of ink', 'It hits the paper through a ribbon', 'It heats toner onto the paper'], why: 'The pen is lowered to draw and raised to move without drawing.' },
    { type: 'mcq', q: 'What is a plotter mainly used to output?', opts: ['High-quality CAD images on large sheets of paper', 'Many carbon copies of invoices', 'Photographs at home', '3D models made of plastic'], why: 'CAD = Computer Aided Design.' },
    { type: 'tf', q: 'Some plotters can roll the paper backwards and forwards.', a: true, why: 'And with a cutter attachment they can cut vinyl to make stickers.' },
  ],
});
