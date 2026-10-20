FD.add({
  id: 'monitor',
  title: 'Output and monitors',
  tab: 'Monitors',
  icon: 'monitor',
  color: '--c4',
  section: true,
  interactive: true,
  vocab: [
    ['Output peripheral', 'A device connected to a computer that outputs the results of the computer’s processing.'],
    ['Pixel', 'One tiny dot of colour on a screen. Resolution is measured in pixels.'],
    ['Standby mode', 'A low-power mode a monitor goes into when no input is detected.'],
  ],
  mount(el) {
    const FORMS = [
      ['display', '🖥️', 'Electronic display', 'Monitor, data projector'],
      ['print', '📄', 'Printed text', 'Printer, plotter'],
      ['video', '🎞️', 'Video', 'Monitor, data projector'],
      ['audio', '🔊', 'Audio', 'Speakers, headphones'],
      ['touch', '📳', 'Tactile (touch)', 'A phone that vibrates, a braille display'],
    ];
    const RES = [
      [32, 18, 'Very low: 32 × 18'],
      [64, 36, 'Low: 64 × 36'],
      [160, 90, 'Medium: 160 × 90'],
      [480, 270, 'High: 480 × 270'],
    ];
    const REAL = [['1280 × 720', 'HD'], ['1920 × 1080', 'Full HD'], ['2560 × 1440', 'QHD'], ['3840 × 2160', '4K Ultra HD']];
    el.innerHTML = `
      <div class="sim mo">
        <div class="ptabs" role="group" aria-label="Simulations">
          <button data-p="forms">📤 Forms of output</button><button data-p="size">📐 Screen size</button><button data-p="res">🔲 Resolution</button><button data-p="eco">🌙 Energy saving</button><button data-p="evo">🕰️ Monitors over time</button>
        </div>

        <div data-panel="forms" class="sim">
          <div class="mo-flow">
            <div class="mo-pc">💻<small>Computer processes the data</small></div>
            <div class="mo-arrow" aria-hidden="true">→</div>
            <ul class="mo-forms">${FORMS.map(([k, e, n, d]) => `<li><button data-f="${k}"><span class="mo-e">${e}</span><b>${n}</b><small>${d}</small></button></li>`).join('')}</ul>
          </div>
          <p class="note">Click a form of output to see it.</p>
        </div>

        <div data-panel="size" class="sim" hidden>
          <div class="two-col">
            <div class="sim-box">
              <svg viewBox="0 0 320 220" class="mo-size" aria-label="A monitor with its diagonal measured">
                <rect class="dv-body" id="mFrame" x="0" y="0" width="10" height="10" rx="6"/>
                <rect class="dv-screen" id="mScr" x="0" y="0" width="10" height="10"/>
                <line class="mo-diag" id="mDiag" x1="0" y1="0" x2="10" y2="10"/>
                <text class="mo-dl" id="mDl" x="0" y="0"></text>
                <line class="mo-w" id="mW" x1="0" y1="0" x2="10" y2="0"/>
                <text class="mo-wl" id="mWl" x="0" y="0"></text>
                <rect class="dv-body" id="mStand" x="150" y="0" width="20" height="16"/>
                <rect class="dv-body" id="mFoot" x="125" y="0" width="70" height="6" rx="3"/>
              </svg>
            </div>
            <div class="sim-box mo-ctl">
              <label class="meter"><span class="meter-l">Screen size</span><input type="range" id="sz" min="13" max="43" step="1" value="24"></label>
              <div class="readout"><div class="ro"><small>Diagonal</small><b id="szIn">24″</b></div><div class="ro"><small>In centimetres</small><b id="szCm"></b></div></div>
              <div class="readout"><div class="ro"><small>Width (16:9)</small><b id="szW"></b></div><div class="ro"><small>Height</small><b id="szH"></b></div></div>
              <p class="note" id="szUse"></p>
            </div>
          </div>
        </div>

        <div data-panel="res" class="sim" hidden>
          <div class="two-col">
            <div class="sim-box mo-res"><canvas id="rc" width="480" height="270" aria-label="The same picture at the chosen resolution"></canvas></div>
            <div class="sim-box mo-ctl">
              <div class="seg" id="rseg"><span class="seg-l">Resolution</span>${RES.map(([w, h, n], i) => `<button data-v="${i}">${n}</button>`).join('')}</div>
              <div class="readout"><div class="ro"><small>Pixels across × down</small><b id="rWH"></b></div><div class="ro"><small>Total pixels</small><b id="rN"></b></div></div>
              <p class="note">Same screen size, more pixels → a sharper, more detailed picture. (The pictures here are made with very few pixels so you can see them.)</p>
              <table class="tbl mo-real"><thead><tr><th>Real monitor resolution</th><th>Name</th><th>Total pixels</th></tr></thead>
                <tbody>${REAL.map(([r, n]) => `<tr><td>${r}</td><td>${n}</td><td>${FD.fmt(r.split(' × ').reduce((a, b) => a * b, 1))}</td></tr>`).join('')}</tbody></table>
            </div>
          </div>
        </div>

        <div data-panel="eco" class="sim" hidden>
          <div class="two-col">
            <div class="sim-box mo-eco" id="eco">
              <div class="mo-screen" id="ecoScr"><canvas id="ec" width="320" height="180"></canvas><span class="mo-zz" id="zz">💤 Standby</span></div>
              <p class="mo-pw"><span id="ecoLed" class="mo-led"></span> Power used: <b id="ecoW">25 W</b></p>
            </div>
            <div class="sim-box mo-ctl">
              <div class="readout"><div class="ro"><small>No input for</small><b id="idle">0 s</b></div><div class="ro"><small>Standby after</small><b>10 s</b></div></div>
              <span class="bar"><i id="idleBar"></i></span>
              <div class="ctrls"><button class="btn small-btn" id="move">🖱️ Move the mouse</button><button class="btn small-btn" id="leave">🚶 Walk away</button></div>
              <p class="verdict" id="ecoV"></p>
            </div>
          </div>
        </div>

        <div data-panel="evo" class="sim" hidden>
          <div class="mo-evo">
            ${[['crt', 'Old CRT monitor', 'Big, deep and heavy. Lots of power.'], ['flat', 'Flat-screen monitor', 'Thin, lighter, uses less power.'], ['aio', 'All-in-one', 'The computer is built into the monitor.'], ['touch', 'Touch screen monitor', 'An output and an input device at the same time.']].map(([k, n, d]) => `
              <figure class="sim-box mo-ev" data-k="${k}">
                <svg viewBox="0 0 120 90" aria-hidden="true">${{
                  crt: '<path class="dv-body" d="M20 10h70l14 12v46l-14 10H20z"/><rect class="dv-screen" x="26" y="16" width="58" height="46" rx="8"/><rect class="dv-body" x="40" y="78" width="30" height="6"/>',
                  flat: '<rect class="dv-body" x="10" y="8" width="100" height="58" rx="3"/><rect class="dv-screen" x="14" y="12" width="92" height="50"/><rect class="dv-body" x="55" y="66" width="10" height="12"/><rect class="dv-body" x="40" y="78" width="40" height="4" rx="2"/>',
                  aio: '<rect class="dv-body" x="10" y="6" width="100" height="62" rx="4"/><rect class="dv-screen" x="14" y="10" width="92" height="50"/><circle class="dv-led" cx="60" cy="64" r="1.6"/><path class="dv-body" d="M52 68h16l6 14H46z"/><rect class="dv-body" x="30" y="84" width="40" height="3" rx="1.5"/><rect class="dv-body" x="78" y="83" width="12" height="5" rx="2.5"/>',
                  touch: '<rect class="dv-body" x="10" y="8" width="100" height="58" rx="3"/><rect class="dv-screen" x="14" y="12" width="92" height="50"/><circle class="mo-tap" cx="70" cy="36" r="6"/><path class="dv-body" d="M70 40c4 0 6 3 6 6v20H60V52c0-2 2-3 3-3s3 1 3 3v-8c0-2 2-4 4-4z"/>',
                }[k]}</svg>
                <figcaption><b>${n}</b><small>${d}</small></figcaption>
              </figure>`).join('')}
          </div>
          <p class="note">Monitors have evolved over time to give better quality and more features (book Figure 1.61). Touch screens were covered in Input devices (pages 26–27).</p>
        </div>
      </div>`;
    const root = el.querySelector('.mo'), $ = (s) => root.querySelector(s);
    let dead = false, runId = 0;

    // ---- forms ----
    const formBtns = [...root.querySelectorAll('[data-f]')];
    function pickForm(k) {
      formBtns.forEach((b) => b.classList.toggle('on', b.dataset.f === k));
      const b = root.querySelector(`[data-f="${k}"]`);
      if (b) FD.pulse(b);
    }
    formBtns.forEach((b) => b.addEventListener('click', () => pickForm(b.dataset.f)));
    async function allForms(ctx) {
      for (const [k] of FORMS) { pickForm(k); if (!(await ctx.sleep(900))) return; }
      formBtns.forEach((b) => b.classList.add('on'));
    }

    // ---- size ----
    function size(d) {
      $('#sz').value = d;
      const k = Math.sqrt(16 * 16 + 9 * 9), wIn = (d * 16) / k, hIn = (d * 9) / k;
      const sc = 260 / (43 * 16 / k); // the biggest screen fills the box
      const W = wIn * sc, H = hIn * sc, x = (320 - W) / 2, y = 175 - H - 14;
      const set = (id, a) => Object.entries(a).forEach(([n, v]) => $(id).setAttribute(n, v));
      set('#mFrame', { x: x - 5, y: y - 5, width: W + 10, height: H + 10 });
      set('#mScr', { x, y, width: W, height: H });
      set('#mDiag', { x1: x + 3, y1: y + H - 3, x2: x + W - 3, y2: y + 3 });
      set('#mDl', { x: x + W / 2 + 10, y: y + H / 2 - 4 });
      $('#mDl').textContent = d + '″';
      set('#mW', { x1: x, y1: y + H + 22, x2: x + W, y2: y + H + 22 });
      set('#mWl', { x: x + W / 2, y: y + H + 36 });
      $('#mWl').textContent = `width ${(wIn * 2.54).toFixed(0)} cm`;
      set('#mStand', { y: y + H + 5 });
      set('#mFoot', { y: y + H + 20 });
      $('#mW').style.display = 'none'; $('#mWl').style.display = 'none';
      $('#szIn').textContent = d + '″';
      $('#szCm').textContent = (d * 2.54).toFixed(0) + ' cm';
      $('#szW').textContent = (wIn * 2.54).toFixed(1) + ' cm';
      $('#szH').textContent = (hIn * 2.54).toFixed(1) + ' cm';
      $('#szUse').textContent = d <= 16 ? 'About the size of a laptop screen.' : d <= 24 ? 'A typical desk monitor for school or office work.' : d <= 32 ? 'A large monitor: design work, gaming, two windows side by side.' : 'Very large: meeting rooms, displays in shops and airports.';
    }
    $('#sz').addEventListener('input', (e) => size(+e.target.value));
    async function sweep(ctx) {
      const from = 15, to = 32;
      for (let d = from; d <= to; d++) { size(d); if (!(await ctx.sleep(110))) return; }
    }

    // ---- resolution ----
    let res = 0;
    function setRes(i) {
      res = i;
      FD.segSet($('#rseg'), i);
      const [w, h] = RES[i];
      FD.pic($('#rc'), w, h);
      $('#rWH').textContent = `${w} × ${h}`;
      $('#rN').textContent = FD.fmt(w * h);
    }
    $('#rseg').addEventListener('click', (e) => { const b = e.target.closest('button[data-v]'); if (b) setRes(+b.dataset.v); });
    async function resUp(ctx) {
      for (let i = 0; i < RES.length; i++) { setRes(i); if (!(await ctx.sleep(1100))) return; }
    }

    // ---- energy ----
    let idle = 0, standby = false, tick = null;
    FD.pic($('#ec'), 320, 180);
    function ecoShow() {
      $('#idle').textContent = Math.floor(idle) + ' s';
      $('#idleBar').style.setProperty('--v', Math.min(100, (idle / 10) * 100) + '%');
      $('#ecoScr').classList.toggle('off', standby);
      $('#zz').hidden = !standby;
      $('#ecoW').textContent = standby ? '0.5 W' : '25 W';
      $('#ecoLed').classList.toggle('amber', standby);
      const v = $('#ecoV');
      v.innerHTML = standby ? '🌙 No input was detected, so the monitor went into <b>low-power standby mode</b>.' : idle > 0 ? '' : '✅ Input detected: the monitor is on.';
      v.className = 'verdict ' + (standby ? 'good' : '');
    }
    function move() { idle = 0; standby = false; ecoShow(); }
    function leave() {
      clearInterval(tick);
      const id = ++runId;
      tick = setInterval(() => {
        if (dead || id !== runId) { clearInterval(tick); return; }
        idle += 0.25 * FD.speed;
        if (idle >= 10) { idle = 10; standby = true; clearInterval(tick); }
        ecoShow();
      }, 250);
    }
    $('#move').addEventListener('click', () => { runId++; clearInterval(tick); move(); });
    $('#leave').addEventListener('click', () => { move(); leave(); });
    ecoShow();

    size(24);
    setRes(0);
    const showP = FD.panels(root);
    showP('forms');
    return {
      show: showP, allForms, sweep, size, resUp, setRes,
      eco(ctx) { move(); leave(); },
      destroy() { dead = true; runId++; clearInterval(tick); },
    };
  },
  steps: [
    {
      title: 'What do output devices do?',
      text: `<p><strong>Output peripherals</strong> are connected to a computer and <strong>output the results of the computer’s processing</strong>.</p>
             <p>The output can take various forms: <b>electronic display</b>, <b>printed text</b>, <b>video</b>, <b>audio</b> and <b>tactile (touch)</b> forms.</p>`,
      tip: 'Try it: click each form of output.',
      async on(a, ctx) { a.show('forms'); await a.allForms(ctx); },
    },
    {
      title: 'Monitors · screen size',
      text: `<p><strong>Monitors</strong> let users see the output from the computer on an <b>electronic display</b>.</p>
             <p>The <strong>screen size</strong> is measured <strong>diagonally</strong>, from one corner to the opposite corner, usually in inches (″).</p>`,
      tip: 'Try it: drag the slider and watch the diagonal.',
      async on(a, ctx) { a.show('size'); await a.sweep(ctx); },
    },
    {
      title: 'Monitors · resolution',
      text: `<p>The <strong>resolution</strong> is measured in <strong>pixels</strong>: the number of dots across × the number of dots down.</p>
             <p>More pixels on the same screen give a <b>sharper, more detailed</b> picture. A Full HD monitor has 1920 × 1080 = <b>2,073,600 pixels</b>.</p>`,
      tip: 'See book pages 9–10 for more about pixels and screen resolutions.',
      async on(a, ctx) { a.show('res'); await a.resUp(ctx); },
    },
    {
      title: 'Monitors · energy efficiency',
      text: `<p>Monitors have <strong>energy efficiency measures</strong>. For example, they go into a <strong>low-power standby mode if no input is detected</strong>.</p>
             <p>When the user moves the mouse or presses a key, the monitor wakes up again.</p>`,
      tip: 'Try it: walk away and wait 10 seconds, then move the mouse.',
      on(a, ctx) { a.show('eco'); a.eco(ctx); },
    },
    {
      title: 'Monitors over time and touch screens',
      text: `<p>Monitors have <strong>evolved</strong> to provide better quality and more features: from deep, heavy CRT monitors to thin flat screens.</p>
             <p>Some monitors also use <strong>touch screen technology</strong>, so they are an output device and an input device at the same time.</p>`,
      on(a) { a.show('evo'); },
    },
  ],
});

FD.activities({
  section: 'monitor',
  items: [
    {
      id: 'mon-uses',
      title: 'Using monitors · 1',
      task: '<p><b>Discuss</b> the different uses for monitors.</p>',
      fields: ['At home', 'At school or in an office', 'In public places (shops, stations, airports)'],
      lines: 3,
      hint: 'Anything else you discussed with your class…',
    },
    {
      id: 'mon-table',
      title: 'Using monitors · 2',
      task: '<p>Create a <b>table</b> of the uses for monitors with different <b>sizes</b> and <b>resolutions</b>. Write one row per line: <i>use – size – resolution – why</i>.</p>',
      sim: ['monitor', 'See screen size and resolution again'],
      lines: 6,
      hint: 'e.g. Editing photos – 27″ – 2560 × 1440 – lots of detail and space for tools',
    },
  ],
});

FD.check({
  section: 'monitor',
  items: [
    { type: 'multi', q: 'Which <b>three</b> are forms of output named in the book?', need: 3, opts: [['Printed text', true], ['Audio', true], ['Tactile (touch)', true], ['Scanning a barcode', false], ['Typing on a keyboard', false]], why: 'The forms are electronic display, printed text, video, audio and tactile (touch).' },
    { type: 'mcq', q: 'How is the screen size of a monitor measured?', opts: ['Diagonally, from one corner to the opposite corner', 'Across the bottom edge', 'From the top to the bottom', 'By counting the pixels'], why: 'A 24″ monitor measures 24 inches along its diagonal.' },
    { type: 'mcq', q: 'The resolution of a monitor is measured in…', opts: ['pixels', 'lumens', 'inches', 'watts'], why: 'For example 1920 × 1080 pixels.' },
    { type: 'mcq', q: 'How many pixels does a 1920 × 1080 screen have?', opts: ['2,073,600', '3,000', '207,360', '20,736,000'], why: '1920 × 1080 = 2,073,600.' },
    { type: 'tf', q: 'A monitor can save energy by going into a low-power standby mode if no input is detected.', a: true, why: 'This is one of the energy efficiency measures in the book.' },
  ],
});
