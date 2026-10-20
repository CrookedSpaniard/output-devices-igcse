FD.add({
  id: 'print3d',
  title: '3D printers',
  tab: '3D printers',
  icon: 'print3d',
  color: '--c3',
  section: true,
  interactive: true,
  vocab: [
    ['3D printer', 'A printer that creates a real-life version of a digital model by adding layers of heated material from the bottom to the top.'],
    ['Digital model', 'A 3D design of an object made on a computer.'],
    ['Prototype', 'A first model of a product, made to test the design.'],
  ],
  mount(el) {
    const L = 24; // layers
    // half-width of the vase at height t (0 = bottom, 1 = top)
    const prof = (t) => 22 + 26 * Math.sin(Math.PI * Math.min(1, t * 1.15)) - (t > 0.85 ? (t - 0.85) * 60 : 0);
    const USES = [
      ['✈️', 'Aeroplane parts', 'Light, strong parts with complex shapes inside.'],
      ['🦾', 'Artificial limbs', 'Made to fit one person exactly, at a lower cost.'],
      ['🚗', 'Prototype models of cars', 'Designers test the shape before making the real car.'],
      ['🍫', 'Food', 'Even pasta and chocolate can be printed!'],
      ['⚙️', 'Items with working parts', 'Some could not be assembled in any other way: they are printed already joined.'],
    ];
    el.innerHTML = `
      <div class="sim p3">
        <div class="ptabs" role="group" aria-label="Simulations">
          <button data-p="build">🧊 Print a model</button><button data-p="uses">🛠️ What is 3D printed?</button>
        </div>

        <div data-panel="build" class="sim">
          <div class="p3-row">
            <div class="sim-box p3-cad">
              <p class="mw-h">1 · Digital model (on the computer)</p>
              <svg viewBox="0 0 140 130" aria-label="A wireframe digital model of a vase">
                <g class="p3-wire">${Array.from({ length: 9 }, (_, i) => { const t = i / 8, w = prof(t), y = 115 - t * 95; return `<ellipse cx="70" cy="${y}" rx="${w}" ry="${w / 5}"/>`; }).join('')}
                <path d="M${70 - prof(0)} 115 ${Array.from({ length: 9 }, (_, i) => `L${70 - prof(i / 8)} ${115 - (i / 8) * 95}`).join(' ')}"/>
                <path d="M${70 + prof(0)} 115 ${Array.from({ length: 9 }, (_, i) => `L${70 + prof(i / 8)} ${115 - (i / 8) * 95}`).join(' ')}"/></g>
              </svg>
            </div>
            <div class="p3-arrow" aria-hidden="true">→</div>
            <div class="sim-box p3-mach">
              <p class="mw-h">2 · The 3D printer</p>
              <svg viewBox="0 0 220 200" aria-label="A 3D printer building the model layer by layer">
                <rect class="p3-frame" x="10" y="8" width="200" height="186" rx="6"/>
                <rect class="p3-bed" x="40" y="168" width="140" height="8" rx="2"/>
                <g id="layers"></g>
                <g id="gantry"><rect class="p3-rail" x="14" y="0" width="192" height="6" rx="3"/>
                  <g id="nozzle"><rect class="p3-head" x="-12" y="-14" width="24" height="18" rx="3"/><path class="p3-tip" d="M-4 4h8l-4 7z"/><circle class="p3-glow" cx="0" cy="12" r="3"/></g></g>
                <path class="p3-fil" d="M206 30 C 230 30, 230 0, 200 -4"/>
              </svg>
            </div>
          </div>
          <div class="readout"><div class="ro"><small>Layer</small><b id="lay">0 / ${L}</b></div><div class="ro"><small>Printing time (real printer)</small><b id="time">0 h 00 min</b></div><div class="ro"><small>Material</small><b>Heated plastic</b></div></div>
          <div class="ctrls"><button class="btn small-btn" id="go">▶ Print</button><button class="btn small-btn" id="fast">⏩ Faster</button><button class="btn ghost small-btn" id="reset">↺ Clear the bed</button><span class="note" id="msg"></span></div>
        </div>

        <div data-panel="uses" class="sim" hidden>
          <div class="p3-uses">${USES.map(([e, n, d], i) => `<button class="sim-box p3-use" data-i="${i}"><span>${e}</span><b>${n}</b><small>${d}</small></button>`).join('')}</div>
          <p class="note">3D printers are often used to create <b>complex items</b>, sometimes with <b>working parts</b>.</p>
        </div>
      </div>`;
    const root = el.querySelector('.p3'), $ = (s) => root.querySelector(s);
    let dead = false, run = 0, layer = 0, fast = false;
    const BASE = 168, LH = (BASE - 30) / L;
    function place(x, y) { $('#gantry').setAttribute('transform', `translate(0 ${y - 22})`); $('#nozzle').setAttribute('transform', `translate(${x} 22)`); }
    function info() {
      $('#lay').textContent = `${layer} / ${L}`;
      const mins = Math.round((layer / L) * 205);
      $('#time').textContent = `${Math.floor(mins / 60)} h ${String(mins % 60).padStart(2, '0')} min`;
    }
    function reset() {
      run++; layer = 0;
      $('#layers').innerHTML = '';
      place(110, 40);
      $('#nozzle').classList.remove('hot');
      $('#msg').textContent = '';
      info();
    }
    async function build(ctx, upto = L) {
      if (layer >= L) reset();
      const id = ++run;
      $('#nozzle').classList.add('hot');
      while (layer < upto) {
        const t = layer / L, w = prof(t), y = BASE - (layer + 1) * LH;
        const r = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        r.setAttribute('class', 'p3-layer new');
        r.setAttribute('x', 110 - w); r.setAttribute('y', y); r.setAttribute('height', LH + 0.4); r.setAttribute('width', 0);
        $('#layers').appendChild(r);
        const steps = fast ? 6 : 16;
        for (let k = 0; k <= steps; k++) {
          const f = k / steps;
          place(110 - w + 2 * w * f, y);
          r.setAttribute('width', 2 * w * f);
          await FD.wait(fast ? 12 : 28);
          if (dead || id !== run || (ctx && !ctx.alive())) return;
        }
        r.classList.remove('new');
        layer++;
        info();
      }
      $('#nozzle').classList.remove('hot');
      if (layer >= L) { place(110, 30); $('#msg').innerHTML = '✅ Finished: built from the <b>bottom all the way to the top</b>.'; }
    }
    $('#go').addEventListener('click', () => build());
    $('#fast').addEventListener('click', () => { fast = !fast; $('#fast').classList.toggle('on', fast); });
    $('#reset').addEventListener('click', reset);
    root.querySelectorAll('.p3-use').forEach((b) => b.addEventListener('click', () => { root.querySelectorAll('.p3-use').forEach((x) => x.classList.toggle('on', x === b)); FD.pulse(b); }));
    async function tour(ctx) {
      const bs = [...root.querySelectorAll('.p3-use')];
      for (const b of bs) { bs.forEach((x) => x.classList.toggle('on', x === b)); FD.pulse(b); if (!(await ctx.sleep(1000))) return; }
      bs.forEach((x) => x.classList.add('on'));
    }
    reset();
    const showP = FD.panels(root);
    showP('build');
    return {
      show: showP, reset, build, tour,
      setFast(v) { fast = v; $('#fast').classList.toggle('on', v); },
      destroy() { dead = true; run++; },
    };
  },
  steps: [
    {
      title: 'Real-life versions of digital models',
      text: `<p>Three-dimensional (<strong>3D</strong>) printers create <strong>real-life versions of digital models</strong>.</p>
             <p>The object is first designed on a computer, then the printer makes it as a solid object you can hold.</p>`,
      on(a) { a.show('build'); a.reset(); },
    },
    {
      title: 'Layers of heated material',
      text: `<p>3D printers work by <strong>adding layers of heated material</strong> from the <strong>bottom</strong> of the model all the way to the <strong>top</strong>.</p>
             <p>The hot nozzle moves across and lays down one thin layer; then it moves up and adds the next one.</p>`,
      tip: 'Try it: press Print and watch the layer counter.',
      async on(a, ctx) { a.show('build'); a.reset(); a.setFast(false); await a.build(ctx, 8); },
    },
    {
      title: 'It takes a long time',
      text: `<p>3D-printed models <strong>take a long time to create</strong>. Even a small model can take hours, because every layer is very thin.</p>`,
      tip: 'Look at the printing time while the model is finished.',
      async on(a, ctx) { a.show('build'); a.setFast(true); await a.build(ctx); },
    },
    {
      title: 'What is 3D printed?',
      text: `<p>3D printers are often used to create <strong>complex items</strong>, sometimes with <strong>working parts</strong>. Some of these items <b>could not be assembled in any other way</b>.</p>
             <p>Examples: <b>aeroplane parts</b>, <b>artificial limbs</b>, <b>prototype models of cars</b> and even <b>food</b> such as pasta and chocolate.</p>`,
      tip: 'Try it: click each example.',
      async on(a, ctx) { a.show('uses'); await a.tour(ctx); },
    },
    {
      title: 'Technology and ethics',
      text: `<p>Anyone with a 3D printer and the plans can make an object at home. In 2013, someone published the plans for a <strong>3D-printed gun</strong> online.</p>
             <p>Should 3D printers be widely available? You will discuss this in the activities.</p>`,
      on(a) { a.show('uses'); },
    },
  ],
});

FD.activities({
  section: 'print3d',
  items: [
    {
      id: 'p3-video',
      title: 'Using 3D printers',
      task: '<p>Find a <b>video online</b> that shows a 3D printer in action.</p>',
      sim: ['print3d', 'See the 3D printer simulation again'],
      fields: ['Title or link of the video', 'What was printed and how long it took'],
      lines: 3,
      hint: 'What did you notice about how the object was built?',
    },
    {
      id: 'p3-ethics1',
      title: 'Technology and ethics · 1',
      task: '<p>In 2013, someone published the plans for a 3D-printed gun online. <b>Discuss</b> the impact of this.</p>',
      lines: 5,
    },
    {
      id: 'p3-ethics2',
      title: 'Technology and ethics · 2',
      task: '<p>Write notes to support <b>two opposing arguments</b>: one for and one against the wide availability of 3D printers. You could then use your notes to debate this topic in your class.</p>',
      fields: ['FOR wide availability', 'AGAINST wide availability'],
      lines: 3,
      hint: 'What did you decide after the class debate?',
    },
  ],
});

FD.check({
  section: 'print3d',
  items: [
    { type: 'mcq', q: 'How does a 3D printer build a model?', opts: ['By adding layers of heated material from the bottom to the top', 'By cutting the model out of a solid block', 'By spraying ink onto paper', 'By printing the top layer first'], why: 'Layer by layer, from the bottom of the model all the way to the top.' },
    { type: 'tf', q: '3D-printed models are very quick to create.', a: false, why: 'They take a long time to create.' },
    { type: 'multi', q: 'Which <b>three</b> are examples of 3D-printed items from the book?', need: 3, opts: [['Artificial limbs', true], ['Aeroplane parts', true], ['Chocolate', true], ['Carbon copies of invoices', false], ['Surround sound', false]], why: 'Also prototype models of cars and pasta.' },
    { type: 'mcq', q: 'What does a 3D printer create?', opts: ['A real-life version of a digital model', 'A large drawing of a CAD image', 'A copy of a document on carbon paper', 'A projected image on a screen'], why: 'It turns a model designed on a computer into a solid object.' },
  ],
});
