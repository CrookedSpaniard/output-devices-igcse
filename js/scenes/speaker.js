FD.add({
  id: 'speaker',
  title: 'Speakers',
  tab: 'Speakers',
  icon: 'speaker',
  color: '--c5',
  section: true,
  interactive: true,
  vocab: [
    ['Mono sound', 'Sound that comes from a single speaker.'],
    ['Stereo sound', 'Sound that comes from two sides (left and right).'],
    ['Surround sound', 'Sound that comes from four or more sides, so that sounds from a film or television programme come from all around the viewer as they would in real life.'],
    ['Spatial awareness', 'The impression of a realistic space.'],
  ],
  mount(el) {
    const CX = 180, CY = 135;
    const SPK = {
      mono: [['C', 180, 40]],
      stereo: [['L', 90, 50], ['R', 270, 50]],
      surround: [['FL', 90, 50], ['C', 180, 38], ['FR', 270, 50], ['RL', 70, 225], ['RR', 290, 225]],
    };
    const ALERTS = [
      ['🍲', 'Microwave', 'Ding! The food is ready.', [[1320, 300, 'sine']]],
      ['🔥', 'Smoke alarm', 'Beep beep beep: get out!', [[3100, 120, 'square'], [0, 80], [3100, 120, 'square'], [0, 80], [3100, 120, 'square']]],
      ['⌚', 'Digital watch', 'A tiny piezo speaker beeps the hour.', [[4000, 70, 'square'], [0, 60], [4000, 70, 'square']]],
      ['🧺', 'Washing machine', 'The wash has finished.', [[880, 200, 'triangle'], [0, 60], [660, 300, 'triangle']]],
      ['🚗', 'Parking sensor', 'Faster beeps as the car gets closer.', [[1500, 60, 'square'], [0, 120], [1500, 60, 'square'], [0, 60], [1500, 60, 'square'], [0, 30], [1500, 60, 'square']]],
      ['🔔', 'Door buzzer', 'Bzzz! Someone is at the door.', [[220, 450, 'sawtooth']]],
    ];
    el.innerHTML = `
      <div class="sim sp">
        <div class="ptabs" role="group" aria-label="Simulations">
          <button data-p="room">🎧 Mono, stereo and surround</button><button data-p="alert">🚨 Low-quality speakers</button>
        </div>

        <div data-panel="room" class="sim">
          <div class="sp-cols">
            <div class="sim-box sp-roomb">
              <svg viewBox="0 0 360 260" aria-label="A room seen from above with the listener and the speakers">
                <rect class="sp-floor" x="20" y="10" width="320" height="240" rx="12"/>
                <rect class="sp-tv" x="130" y="14" width="100" height="10" rx="3"/>
                <g id="spk"></g>
                <circle class="sp-heard" id="heard" r="13"/>
                <text class="sp-src" id="src" x="0" y="0">🚁</text>
                <text class="sp-me" x="${CX}" y="${CY + 10}">🧑</text>
              </svg>
            </div>
            <div class="sim-box sp-ctl">
              <div class="seg" id="mode"><span class="seg-l">Sound</span><button data-v="mono">Mono</button><button data-v="stereo">Stereo</button><button data-v="surround">Surround</button></div>
              <p class="mw-h">Amplifier · level sent to each speaker</p>
              <div class="sp-amp" id="amp"></div>
              <div class="ctrls"><button class="btn small-btn" id="fly">🚁 Fly the helicopter round</button><label class="note"><input type="checkbox" id="snd"> 🔈 Sound (use headphones)</label></div>
              <p class="verdict" id="where"></p>
            </div>
          </div>
        </div>

        <div data-panel="alert" class="sim" hidden>
          <div class="sp-alerts">${ALERTS.map(([e, n, d], i) => `<button class="sim-box sp-al" data-i="${i}"><span>${e}</span><b>${n}</b><small>${d}</small></button>`).join('')}</div>
          <div class="sim-box sp-piezo">
            <svg viewBox="0 0 120 80" aria-hidden="true"><circle class="dv-body" cx="45" cy="45" r="30"/><circle class="sp-disc" cx="45" cy="45" r="22"/><path class="sp-w r" d="M85 30q10 15 0 30"/><path class="sp-w b" d="M95 22q16 23 0 46"/></svg>
            <p class="note">A single small speaker (often a <b>piezoelectric ‘piezo’ speaker</b>) gives <b>low-quality audio feedback</b>. That is all an alarm or a buzzer needs. Click a device to hear it.</p>
          </div>
        </div>
      </div>`;
    const root = el.querySelector('.sp'), $ = (s) => root.querySelector(s);
    let dead = false, run = 0, mode = 'stereo', ang = -Math.PI / 2;

    function draw() {
      const list = SPK[mode];
      $('#spk').innerHTML = list.map(([n, x, y]) => `<g class="sp-s" data-n="${n}" transform="translate(${x} ${y})"><circle class="sp-ring" r="16"/><rect class="sp-box" x="-9" y="-11" width="18" height="22" rx="3"/><circle class="sp-cone" r="5"/><text y="27">${n}</text></g>`).join('');
      $('#amp').innerHTML = list.map(([n]) => `<div class="sp-ch"><b>${n}</b><span class="bar"><i data-n="${n}"></i></span></div>`).join('');
      FD.segSet($('#mode'), mode);
      update();
    }
    function update() {
      const sx = CX + Math.cos(ang) * 120, sy = CY + Math.sin(ang) * 100;
      $('#src').setAttribute('x', sx); $('#src').setAttribute('y', sy + 7);
      const list = SPK[mode];
      let g = list.map(([, x, y]) => 1 / (Math.hypot(x - sx, y - sy) + 20) ** 2);
      if (mode === 'stereo') { const p = (sx - 60) / 240; g = [1 - FD.clamp(p, 0, 1), FD.clamp(p, 0, 1)]; }
      if (mode === 'mono') g = [1];
      const max = Math.max(...g), sum = g.reduce((a, b) => a + b, 0);
      const w = g.map((v) => v / sum);
      list.forEach(([n], i) => {
        const lvl = g[i] / max;
        const s = root.querySelector(`.sp-s[data-n="${n}"] .sp-ring`);
        if (s) { s.setAttribute('r', 12 + lvl * 12); s.style.opacity = 0.15 + lvl * 0.75; }
        const b = root.querySelector(`#amp i[data-n="${n}"]`);
        if (b) b.style.setProperty('--v', Math.round(lvl * 100) + '%');
      });
      const hx = list.reduce((a, [, x], i) => a + x * w[i], 0), hy = list.reduce((a, [, , y], i) => a + y * w[i], 0);
      $('#heard').setAttribute('cx', hx); $('#heard').setAttribute('cy', hy);
      const v = $('#where');
      v.innerHTML = mode === 'mono' ? '🔈 Everything comes from <b>one speaker</b>: you cannot tell where the helicopter is.' : mode === 'stereo' ? '🎧 You can hear the helicopter move <b>left and right</b>, but not behind you.' : '🎬 The sound comes from <b>all around you</b>, as it would in real life: <b>spatial awareness</b>.';
      return (hx - CX) / 120;
    }
    async function fly(ctx) {
      const id = ++run;
      let last = 0;
      const start = ang;
      await FD.tween(6000, (t) => {
        if (dead || id !== run || (ctx && !ctx.alive())) return;
        ang = start + t * Math.PI * 2;
        const pan = update();
        if ($('#snd').checked && performance.now() - last > 260) { last = performance.now(); FD.beep(320, 220, 'sawtooth', 0.04, mode === 'mono' ? 0 : FD.clamp(pan, -1, 1)); }
      });
    }
    $('#mode').addEventListener('click', (e) => { const b = e.target.closest('button[data-v]'); if (b) { mode = b.dataset.v; draw(); } });
    $('#fly').addEventListener('click', () => fly());

    async function playAlert(i) {
      const b = root.querySelector(`.sp-al[data-i="${i}"]`);
      root.querySelectorAll('.sp-al').forEach((x) => x.classList.toggle('on', x === b));
      FD.pulse(b);
      root.querySelector('.sp-piezo').classList.add('ring');
      for (const [f, ms, type] of ALERTS[i][3]) {
        if (f) FD.beep(f, ms, type, 0.05);
        await new Promise((r) => setTimeout(r, ms));
        if (dead) return;
      }
      root.querySelector('.sp-piezo').classList.remove('ring');
    }
    root.querySelectorAll('.sp-al').forEach((b) => b.addEventListener('click', () => playAlert(+b.dataset.i)));
    async function alertTour(ctx) {
      const bs = [...root.querySelectorAll('.sp-al')];
      for (const b of bs) { bs.forEach((x) => x.classList.toggle('on', x === b)); FD.pulse(b); if (!(await ctx.sleep(800))) return; }
    }

    draw();
    const showP = FD.panels(root);
    showP('room');
    return {
      show: showP, fly, alertTour,
      mode(m) { mode = m; ang = -Math.PI / 2; draw(); },
      destroy() { dead = true; run++; },
    };
  },
  steps: [
    {
      title: 'Speakers · stereo sound',
      text: `<p><strong>Speakers</strong> allow a computer to <strong>output sound</strong>.</p>
             <p>Speakers often come <strong>in pairs</strong> to provide <strong>stereo sound</strong>: one is used for the <b>left</b> side and one for the <b>right</b> side.</p>`,
      tip: 'Try it: fly the helicopter round (use headphones for the sound).',
      async on(a, ctx) { a.show('room'); a.mode('stereo'); await a.fly(ctx); },
    },
    {
      title: 'Surround sound',
      text: `<p><strong>Multiple speakers</strong> are commonly used to provide <strong>surround sound</strong> in <b>home entertainment systems</b>.</p>
             <p>Sound comes from four or more sides, so sounds from a film come from <b>all around the viewer</b>, as they would in real life.</p>`,
      async on(a, ctx) { a.show('room'); a.mode('surround'); await a.fly(ctx); },
    },
    {
      title: 'An amplifier and spatial awareness',
      text: `<p>These speakers need a special <strong>amplifier</strong> that can deliver <strong>different levels of sound to each speaker</strong>.</p>
             <p>This provides <strong>spatial awareness</strong>: the impression of a realistic space.</p>`,
      tip: 'Watch the amplifier levels change as the helicopter moves.',
      async on(a, ctx) { a.show('room'); a.mode('surround'); await a.fly(ctx); },
    },
    {
      title: 'Mono sound',
      text: `<p><strong>Mono sound</strong> is sound that comes from a <strong>single speaker</strong>.</p>
             <p>You cannot tell where a sound is coming from, but for some jobs that does not matter.</p>`,
      tip: 'Switch between mono, stereo and surround and compare.',
      async on(a, ctx) { a.show('room'); a.mode('mono'); await a.fly(ctx); },
    },
    {
      title: 'Low-quality speakers',
      text: `<p>A <strong>single speaker</strong> is usually used to provide <strong>low-quality audio feedback</strong> to a user.</p>
             <p>These speakers are often <b>small and low-quality</b>, and are often found in <strong>alert systems</strong> such as <b>alarms</b> and <b>buzzers</b>.</p>`,
      tip: 'Try it: click each device to hear its alert.',
      async on(a, ctx) { a.show('alert'); await a.alertTour(ctx); },
    },
  ],
});

FD.activities({
  section: 'speaker',
  items: [
    {
      id: 'sp-sound',
      title: 'Different types of sound',
      task: '<p>Do some research to find out when <b>mono sound</b> may be most appropriate. When might listeners prefer <b>stereo sound</b>?</p>',
      sim: ['speaker', 'Compare mono, stereo and surround again'],
      fields: ['Mono sound is most appropriate when…', 'Listeners prefer stereo sound when…'],
      lines: 2,
    },
    {
      id: 'sp-low',
      title: 'Using low-quality speakers',
      task: '<p>Think of the appliances and devices in your home that use <b>low-quality speakers</b> (you might want to start in the kitchen!).</p>',
      lines: 5,
      hint: 'Make a list: device – what the sound tells you',
    },
  ],
});

FD.check({
  section: 'speaker',
  items: [
    { type: 'sort', q: 'Match each description to the type of sound.', bins: ['Mono', 'Stereo', 'Surround'], rows: [['Sound from a single speaker', 0], ['Sound from two sides, left and right', 1], ['Sound from four or more sides, all around the viewer', 2], ['A pair of speakers on each side of a monitor', 1], ['A home cinema system with five speakers', 2]], why: 'Mono = 1 speaker, stereo = left + right, surround = 4 or more sides.' },
    { type: 'mcq', q: 'Why do surround sound systems need a special amplifier?', opts: ['To deliver different levels of sound to each speaker', 'To make every speaker play exactly the same sound', 'To convert sound into text', 'To charge the speakers’ batteries'], why: 'Different levels for each speaker give spatial awareness.' },
    { type: 'mcq', q: 'Where are single, small, low-quality speakers often found?', opts: ['In alert systems such as alarms and buzzers', 'In home cinema systems', 'In recording studios', 'In data projectors only'], why: 'They give low-quality audio feedback to a user.' },
    { type: 'tf', q: 'Spatial awareness means the impression of a realistic space.', a: true, why: 'Surround sound makes sounds seem to come from where they would be in real life.' },
  ],
});
