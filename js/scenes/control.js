FD.add({
  id: 'control',
  title: 'Control devices (actuators)',
  tab: 'Actuators',
  icon: 'control',
  color: '--c9',
  section: true,
  interactive: true,
  vocab: [
    ['Control device (actuator)', 'A component of a system that makes something happen in the real physical world. Actuators are often mechanical.'],
    ['Nanorobot', 'A tiny robot made of tiny sensors and actuators.'],
  ],
  mount(el) {
    const ACT = [
      ['valve', 'Valve', 'Opens or closes to control the flow of a liquid or gas.', 'e.g. watering plants, central heating'],
      ['piston', 'Piston', 'Pushes or pulls in a straight line.', 'e.g. opening a door, a robot gripper'],
      ['heater', 'Heater', 'Makes something warmer.', 'e.g. a greenhouse, a fish tank'],
      ['cooler', 'Cooler', 'Makes something colder.', 'e.g. air conditioning, a fridge'],
      ['motor', 'Motor', 'Turns round to make something move.', 'e.g. a fan, a window opener, a robot arm'],
    ];
    const SVG = {
      valve: '<rect class="ct-pipe" x="4" y="34" width="112" height="16" rx="3"/><line class="ct-flow" x1="6" y1="42" x2="114" y2="42"/><rect class="ct-gate" x="54" y="26" width="12" height="32" rx="2"/><g class="ct-wheel"><line x1="60" y1="26" x2="60" y2="14"/><ellipse cx="60" cy="12" rx="14" ry="4"/></g>',
      piston: '<rect class="ct-cyl" x="8" y="28" width="56" height="28" rx="4"/><rect class="ct-rod" x="60" y="38" width="40" height="8" rx="2"/><rect class="ct-head" x="96" y="30" width="8" height="24" rx="2"/>',
      heater: '<path class="ct-coil" d="M14 60c6-30 12-30 18 0s12 30 18 0 12-30 18 0 12 30 18 0 12-30 18 0"/><g class="ct-heat"><path d="M30 22q4-6 0-12M60 22q4-6 0-12M90 22q4-6 0-12"/></g>',
      cooler: '<g class="ct-fan"><circle cx="60" cy="42" r="4"/><path d="M60 42c-4-18 10-24 12-12zM60 42c18-4 24 10 12 12zM60 42c4 18-10 24-12 12zM60 42c-18 4-24-10-12-12z"/></g><circle class="ct-ring" cx="60" cy="42" r="26"/><text class="ct-snow" x="96" y="24">❄</text><text class="ct-snow" x="14" y="70">❄</text>',
      motor: '<rect class="ct-cyl" x="12" y="24" width="56" height="36" rx="6"/><rect class="ct-rod" x="68" y="38" width="18" height="8"/><g class="ct-rotor"><circle cx="96" cy="42" r="14"/><line x1="96" y1="28" x2="96" y2="56"/><line x1="82" y1="42" x2="110" y2="42"/></g>',
    };
    el.innerHTML = `
      <div class="sim ct">
        <div class="ptabs" role="group" aria-label="Simulations">
          <button data-p="types">⚙️ Examples of actuators</button><button data-p="system">🌱 Part of a system</button><button data-p="robot">🤖 Robots</button>
        </div>

        <div data-panel="types" class="sim">
          <div class="ct-acts">${ACT.map(([k, n, d, e]) => `
            <button class="sim-box ct-act" data-k="${k}" aria-pressed="false">
              <svg viewBox="0 0 120 84" aria-hidden="true">${SVG[k]}</svg>
              <b>${n}</b><small>${d}</small><small class="muted">${e}</small><span class="ct-sw">OFF</span>
            </button>`).join('')}</div>
          <p class="note">Click an actuator to switch it on or off.</p>
        </div>

        <div data-panel="system" class="sim" hidden>
          <div class="ct-sys">
            <div class="sim-box ct-gh" id="gh">
              <div class="ct-sky" id="sky"></div>
              <div class="ct-house"><span class="ct-plant" id="plant">🌱</span><span class="ct-win" id="win">🪟 closed</span></div>
              <div class="ct-icons"><span id="iH" class="ct-i">🔥 heater</span><span id="iF" class="ct-i">🌀 fan</span><span id="iW" class="ct-i">⚙️ window motor</span></div>
            </div>
            <div class="sim-box ct-loop">
              <div class="ct-chain">
                <span class="ct-node">🌡️<small>Sensor (input)</small><b id="tIn">20 °C</b></span><span class="ct-ar">→</span>
                <span class="ct-node">💻<small>Computer</small><b>keeps 18–26 °C</b></span><span class="ct-ar">→</span>
                <span class="ct-node">⚙️<small>Actuators (output)</small><b id="act">none</b></span>
              </div>
              <label class="meter"><span class="meter-l">Weather</span><input type="range" id="out" min="-5" max="40" step="1" value="12"></label>
              <div class="readout"><div class="ro"><small>Outside</small><b id="tOut">12 °C</b></div><div class="ro"><small>Inside the greenhouse</small><b id="tGh">20 °C</b></div></div>
              <p class="verdict" id="sysV"></p>
            </div>
          </div>
        </div>

        <div data-panel="robot" class="sim" hidden>
          <div class="two-col">
            <div class="sim-box ct-robot">
              <svg viewBox="0 0 240 180" aria-label="A robot arm moved by actuators">
                <rect class="ct-base" x="40" y="150" width="70" height="18" rx="4"/>
                <g id="arm1" transform="translate(75 150) rotate(-60)"><rect class="ct-link" x="0" y="-8" width="80" height="16" rx="8"/><circle class="ct-joint" r="9"/>
                  <g id="arm2" transform="translate(80 0) rotate(70)"><rect class="ct-link" x="0" y="-7" width="62" height="14" rx="7"/><circle class="ct-joint" r="8"/>
                    <g transform="translate(62 0)"><rect class="ct-link" x="0" y="-3" width="10" height="6"/><rect class="ct-box ct-carry" x="11" y="-6" width="14" height="12" rx="2"/><rect class="ct-grip" id="g1" x="8" y="-14" width="16" height="5" rx="2"/><rect class="ct-grip" id="g2" x="8" y="9" width="16" height="5" rx="2"/></g>
                  </g>
                </g>
                <rect class="ct-box" id="box" x="178" y="138" width="22" height="22" rx="3"/>
              </svg>
              <div class="ctrls"><button class="btn small-btn" id="pick">🤖 Pick up the box</button></div>
            </div>
            <div class="ct-power">
              <p class="mw-h">Robots use actuators that are powered in many ways</p>
              <div class="ct-pw" data-k="e"><span>⚡</span><b>Electricity</b><small>electric motors turn the joints</small></div>
              <div class="ct-pw" data-k="c"><span>🧪</span><b>Chemicals</b><small>e.g. a fuel or a chemical reaction</small></div>
              <div class="ct-pw" data-k="a"><span>💨</span><b>Compressed air</b><small>pneumatic pistons open and close the gripper</small></div>
              <div class="sim-box ct-nano" id="nano"><b>Did you know?</b> <b>Nanorobots</b> are made up of tiny sensors and actuators that can help a surgeon carry out very precise medical procedures, with smaller cuts and more precise movements than human hands.</div>
            </div>
          </div>
        </div>
      </div>`;
    const root = el.querySelector('.ct'), $ = (s) => root.querySelector(s);
    let dead = false, timer = null, run = 0;

    // ---- types ----
    function setAct(k, on) {
      const b = root.querySelector(`.ct-act[data-k="${k}"]`);
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on);
      b.querySelector('.ct-sw').textContent = on ? 'ON' : 'OFF';
    }
    root.querySelectorAll('.ct-act').forEach((b) => b.addEventListener('click', () => setAct(b.dataset.k, !b.classList.contains('on'))));
    const allOff = () => ACT.forEach(([k]) => setAct(k, false));
    async function tour(ctx) {
      allOff();
      for (const [k] of ACT) { setAct(k, true); if (!(await ctx.sleep(1100))) return; }
    }

    // ---- system ----
    let tin = 20, tout = 12;
    function sys() {
      const heat = tin < 18, cool = tin > 26;
      tin += (tout - tin) * 0.04 + (heat ? 0.9 : 0) - (cool ? 1.1 : 0);
      $('#tIn').textContent = `${tin.toFixed(1)} °C`;
      $('#tGh').textContent = `${tin.toFixed(1)} °C`;
      $('#tOut').textContent = `${tout} °C`;
      $('#iH').classList.toggle('on', heat);
      $('#iF').classList.toggle('on', cool);
      $('#iW').classList.toggle('on', cool);
      $('#win').textContent = cool ? '🪟 open' : '🪟 closed';
      $('#act').textContent = heat ? 'heater ON' : cool ? 'fan + window motor ON' : 'none needed';
      $('#gh').style.setProperty('--t', FD.clamp((tin + 5) / 45, 0, 1));
      $('#sky').textContent = tout < 5 ? '❄️ ☁️' : tout > 28 ? '☀️' : '⛅';
      $('#plant').textContent = tin < 10 || tin > 34 ? '🥀' : '🌱';
      const v = $('#sysV');
      v.innerHTML = heat ? 'Too cold: the computer switches the <b>heater</b> on.' : cool ? 'Too hot: the computer switches on the <b>fan</b> and the <b>motor</b> that opens the window.' : 'Just right: no actuator is needed.';
      v.className = 'verdict' + (heat || cool ? '' : ' good');
    }
    function startSys() { clearInterval(timer); timer = setInterval(() => { if (!dead) sys(); }, 250); }
    $('#out').addEventListener('input', (e) => { tout = +e.target.value; });
    function weather(t) { tout = t; $('#out').value = t; }

    // ---- robot ----
    async function pick(ctx) {
      const id = ++run;
      const pose = async (a1, a2, gOpen, ms) => {
        const s1 = cur[0], s2 = cur[1], s3 = cur[2];
        await FD.tween(ms, (t) => {
          if (dead || id !== run) return;
          cur = [s1 + (a1 - s1) * t, s2 + (a2 - s2) * t, s3 + (gOpen - s3) * t];
          $('#arm1').setAttribute('transform', `translate(75 150) rotate(${cur[0]})`);
          $('#arm2').setAttribute('transform', `translate(80 0) rotate(${cur[1]})`);
          $('#g1').setAttribute('y', -14 + (1 - cur[2]) * 5);
          $('#g2').setAttribute('y', 9 - (1 - cur[2]) * 5);
        });
        return id === run && !dead && (!ctx || ctx.alive());
      };
      const pw = (k) => root.querySelectorAll('.ct-pw').forEach((x) => x.classList.toggle('on', x.dataset.k === k));
      root.querySelector('.ct-robot').classList.remove('held');
      pw('e'); if (!(await pose(-40, 84, 1, 1200))) return;
      pw('a'); if (!(await pose(-40, 84, 0, 600))) return;
      root.querySelector('.ct-robot').classList.add('held');
      pw('e'); if (!(await pose(-75, 60, 0, 1200))) return;
      pw(null);
    }
    let cur = [-60, 70, 1];
    $('#pick').addEventListener('click', () => pick());

    allOff();
    sys();
    const showP = FD.panels(root, (p) => { if (p === 'system') startSys(); else clearInterval(timer); });
    showP('types');
    return {
      show: showP, tour, allOff, setAct, weather, pick,
      nano(on) { $('#nano').classList.toggle('on', on); },
      destroy() { dead = true; run++; clearInterval(timer); },
    };
  },
  steps: [
    {
      title: 'Control devices make things happen',
      text: `<p><strong>Control devices</strong> are also known as <strong>actuators</strong>.</p>
             <p>They are <strong>components of a system</strong> that <strong>make something happen in the real physical world</strong>: something moves, opens, warms up or cools down.</p>`,
      on(a) { a.show('types'); a.allOff(); a.setAct('motor', true); },
    },
    {
      title: 'Examples of actuators',
      text: `<p>These devices are often <strong>mechanical</strong>. Examples of actuators include:</p>
             <p><b>valves</b> · <b>pistons</b> · <b>heaters</b> · <b>coolers</b> · <b>motors</b>.</p>`,
      tip: 'Try it: switch each actuator on and off.',
      async on(a, ctx) { a.show('types'); await a.tour(ctx); },
    },
    {
      title: 'Part of a system',
      text: `<p>Actuators are the <strong>output</strong> of a control system. A <b>sensor</b> (input) measures the temperature, the <b>computer</b> processes it, and the <b>actuators</b> change the real world.</p>
             <p>In this greenhouse, a <b>heater</b>, a <b>fan</b> and a <b>motor</b> that opens the window keep the plants at the right temperature.</p>`,
      tip: 'Try it: change the weather and watch which actuators switch on.',
      async on(a, ctx) { a.show('system'); a.weather(2); if (!(await ctx.sleep(4500))) return; a.weather(36); },
    },
    {
      title: 'Robots use actuators',
      text: `<p><strong>Robots</strong> use actuators to move. These actuators are <strong>powered in many ways</strong>, such as <b>electricity</b>, <b>chemicals</b> and <b>compressed air</b>.</p>`,
      tip: 'Try it: make the robot pick up the box.',
      async on(a, ctx) { a.show('robot'); a.nano(false); await a.pick(ctx); },
    },
    {
      title: 'Did you know? Nanorobots',
      text: `<p><strong>Nanorobots</strong> are made up of tiny <b>sensors</b> and <b>actuators</b> that can assist a surgeon by carrying out <b>very precise medical procedures</b>.</p>
             <p>They allow doctors to make smaller cuts and more precise movements than they could with their own hands.</p>`,
      on(a) { a.show('robot'); a.nano(true); },
    },
  ],
});

FD.check({
  section: 'control',
  items: [
    { type: 'mcq', q: 'What is another name for a control device?', opts: ['An actuator', 'A sensor', 'A plotter', 'A peripheral cable'], why: 'Control devices are also known as actuators.' },
    { type: 'mcq', q: 'What does an actuator do?', opts: ['Makes something happen in the real physical world', 'Measures the temperature', 'Stores data when the power is off', 'Displays text on a screen'], why: 'Sensors measure (input); actuators act (output).' },
    { type: 'multi', q: 'Which <b>three</b> are examples of actuators?', need: 3, opts: [['Valve', true], ['Piston', true], ['Motor', true], ['Temperature sensor', false], ['Microphone', false]], why: 'The book lists valves, pistons, heaters, coolers and motors.' },
    { type: 'sort', q: 'Is each device an input (sensor) or an output (actuator) in the greenhouse system?', bins: ['Input', 'Output'], rows: [['Temperature sensor', 0], ['Heater', 1], ['Motor that opens the window', 1], ['Cooling fan', 1]], why: 'The sensor measures; the computer decides; the actuators act.' },
    { type: 'tf', q: 'Robot actuators can be powered by electricity, chemicals or compressed air.', a: true, why: 'See Figure 1.71 in the book.' },
  ],
});
