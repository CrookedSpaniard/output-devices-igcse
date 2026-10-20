FD.add({
  id: 'projector',
  title: 'Data projectors',
  tab: 'Projectors',
  icon: 'projector',
  color: '--c8',
  section: true,
  interactive: true,
  vocab: [
    ['Lumens', 'The unit used to measure the brightness of a projector’s light bulb.'],
    ['Optical zoom', 'Focusing a lens in order to zoom in on an object.'],
    ['Digital zoom', 'Enlarging part of an image to produce the effect of zooming in.'],
  ],
  mount(el) {
    const USES = [
      ['🏫', 'Classrooms', 'Giving presentations and lessons to a whole class.', 'Ceiling-mounted · bright · about 3.5 kg'],
      ['💼', 'Business meetings', 'Showing slides and figures to a team.', 'Often carried between rooms · about 2.5 kg'],
      ['🍿', 'Home entertainment', 'Watching television or films and playing games on a huge picture.', 'High resolution · quiet · used in a dark room'],
      ['🧳', 'Travelling', 'Small, light projectors for people who travel on business.', 'Fits in a bag · about 0.5 kg'],
    ];
    const RES = [[80, 60, 'SVGA', '800 × 600'], [102, 77, 'XGA', '1024 × 768'], [128, 80, 'WXGA', '1280 × 800'], [192, 108, 'Full HD', '1920 × 1080']];
    el.innerHTML = `
      <div class="sim pj">
        <div class="ptabs" role="group" aria-label="Simulations">
          <button data-p="uses">🎦 Uses and portability</button><button data-p="bulb">💡 Light bulb</button><button data-p="res">🔲 Resolution</button><button data-p="zoom">🔍 Optical vs digital zoom</button>
        </div>

        <div data-panel="uses" class="sim">
          <div class="pj-uses">${USES.map(([e, n, d, p], i) => `<div class="sim-box pj-use" data-i="${i}"><span>${e}</span><b>${n}</b><small>${d}</small><small class="pj-port">${p}</small></div>`).join('')}</div>
        </div>

        <div data-panel="bulb" class="sim" hidden>
          <div class="pj-room" id="room">
            <svg viewBox="0 0 120 70" class="pj-dev" aria-hidden="true"><rect class="dv-body" x="10" y="22" width="80" height="34" rx="8"/><circle class="pj-lens" cx="70" cy="39" r="11"/><circle class="pj-bulb" id="bulbDot" cx="30" cy="39" r="6"/></svg>
            <div class="pj-beam" id="beam"></div>
            <div class="pj-screen"><canvas id="bc" width="320" height="180"></canvas><div class="pj-wash" id="wash"></div></div>
          </div>
          <div class="sim-box pj-ctl">
            <label class="meter"><span class="meter-l">Brightness</span><input type="range" id="lm" min="500" max="5000" step="250" value="3000"></label>
            <div class="seg" id="light"><span class="seg-l">Room</span><button data-v="dark">🌑 Lights off</button><button data-v="bright">☀️ Sunny classroom</button></div>
            <div class="readout"><div class="ro"><small>Light bulb</small><b id="lmV"></b></div><div class="ro"><small>Picture</small><b id="pic"></b></div><div class="ro bad"><small>Replacement bulb</small><b>Expensive!</b></div></div>
          </div>
        </div>

        <div data-panel="res" class="sim" hidden>
          <div class="two-col">
            <div class="sim-box pj-res"><canvas id="rc" width="384" height="216"></canvas></div>
            <div class="sim-box pj-ctl">
              <div class="seg" id="rseg"><span class="seg-l">Resolution</span>${RES.map(([, , n], i) => `<button data-v="${i}">${n}</button>`).join('')}</div>
              <div class="readout"><div class="ro"><small>Pixels</small><b id="rWH"></b></div></div>
              <p class="note">Like monitors, projectors use different quality screens. A higher resolution gives a sharper picture on the big screen. (Shown with fewer pixels so you can see the difference.)</p>
            </div>
          </div>
        </div>

        <div data-panel="zoom" class="sim" hidden>
          <div class="two-col">
            <figure class="sim-box pj-z"><figcaption><b>Optical zoom</b> · the lens focuses in</figcaption><canvas id="zo" width="320" height="180"></canvas><svg viewBox="0 0 200 40" class="pj-lensbar" aria-hidden="true"><rect class="dv-body" x="10" y="8" width="70" height="24" rx="5"/><rect class="pj-barrel" id="barrel" x="80" y="12" width="20" height="16" rx="2"/></svg></figure>
            <figure class="sim-box pj-z"><figcaption><b>Digital zoom</b> · part of the image is enlarged</figcaption><canvas id="zd" width="320" height="180"></canvas><svg viewBox="0 0 200 40" class="pj-lensbar" aria-hidden="true"><rect class="dv-body" x="10" y="8" width="70" height="24" rx="5"/><rect class="pj-barrel" x="80" y="12" width="20" height="16" rx="2"/><text x="110" y="25" class="pl-lab sm">lens does not move</text></svg></figure>
          </div>
          <label class="meter"><span class="meter-l">Zoom</span><input type="range" id="zm" min="1" max="4" step="0.25" value="1"></label>
          <p class="note" id="zMsg"></p>
        </div>
      </div>`;
    const root = el.querySelector('.pj'), $ = (s) => root.querySelector(s);
    let dead = false;

    // ---- uses ----
    async function tour(ctx, port) {
      const bs = [...root.querySelectorAll('.pj-use')];
      root.querySelector('.pj-uses').classList.toggle('port', !!port);
      for (const b of bs) { bs.forEach((x) => x.classList.toggle('on', x === b)); FD.pulse(b); if (!(await ctx.sleep(900))) return; }
      bs.forEach((x) => x.classList.remove('on'));
    }
    root.querySelectorAll('.pj-use').forEach((b) => b.addEventListener('click', () => root.querySelectorAll('.pj-use').forEach((x) => x.classList.toggle('on', x === b))));

    // ---- bulb ----
    let lum = 3000, room = 'dark';
    FD.pic($('#bc'), 320, 180);
    function bulb() {
      const amb = room === 'dark' ? 150 : 2600;
      const wash = amb / (lum + amb);
      $('#wash').style.opacity = wash.toFixed(2);
      $('#room').classList.toggle('bright', room === 'bright');
      $('#beam').style.opacity = (0.15 + (lum / 5000) * 0.55).toFixed(2);
      $('#bulbDot').style.opacity = (0.4 + (lum / 5000) * 0.6).toFixed(2);
      $('#lmV').textContent = FD.fmt(lum) + ' lumens';
      $('#pic').textContent = wash < 0.2 ? 'Clear and bright' : wash < 0.4 ? 'OK' : 'Washed out';
      FD.segSet($('#light'), room);
      $('#lm').value = lum;
    }
    $('#lm').addEventListener('input', (e) => { lum = +e.target.value; bulb(); });
    $('#light').addEventListener('click', (e) => { const b = e.target.closest('button[data-v]'); if (b) { room = b.dataset.v; bulb(); } });
    async function bulbDemo(ctx) {
      room = 'bright'; lum = 1000; bulb();
      if (!(await ctx.sleep(1200))) return;
      await FD.tween(1800, (t) => { if (ctx.alive()) { lum = Math.round((1000 + t * 3500) / 250) * 250; bulb(); } });
    }

    // ---- resolution ----
    function setRes(i) {
      FD.segSet($('#rseg'), i);
      const [w, h, , real] = RES[i];
      FD.pic($('#rc'), w, h);
      $('#rWH').textContent = real;
    }
    $('#rseg').addEventListener('click', (e) => { const b = e.target.closest('button[data-v]'); if (b) setRes(+b.dataset.v); });
    async function resUp(ctx) { for (let i = 0; i < RES.length; i++) { setRes(i); if (!(await ctx.sleep(1000))) return; } }

    // ---- zoom ----
    function zoom(z) {
      $('#zm').value = z;
      const s = 1 / z, cx = 0.48, cy = 0.62;
      const view = [FD.clamp(cx - s / 2, 0, 1 - s), FD.clamp(cy - s / 2, 0, 1 - s), s];
      FD.pic($('#zo'), 320, 180, view);              // optical: the lens gives full detail
      FD.pic($('#zd'), Math.max(8, Math.round(160 / z)), Math.max(5, Math.round(90 / z)), view); // digital: the same pixels, made bigger
      $('#barrel').setAttribute('width', 10 + z * 18);
      $('#zMsg').innerHTML = z === 1 ? 'No zoom: both pictures are the same.' : `At ${z}× the <b>optical zoom</b> picture stays sharp, but the <b>digital zoom</b> picture is <b>blocky</b>: it only makes the existing pixels bigger.`;
    }
    $('#zm').addEventListener('input', (e) => zoom(+e.target.value));
    async function zoomIn(ctx) {
      zoom(1);
      if (!(await ctx.sleep(700))) return;
      await FD.tween(2200, (t) => { if (ctx.alive()) zoom(Math.round((1 + t * 3) * 4) / 4); });
    }

    bulb();
    setRes(0);
    zoom(1);
    const showP = FD.panels(root);
    showP('uses');
    return { show: showP, tour, bulbDemo, resUp, zoomIn, zoom, destroy() { dead = true; } };
  },
  steps: [
    {
      title: 'What are data projectors used for?',
      text: `<p><strong>Data projectors</strong> project a large image (or film) onto a screen.</p>
             <p>They are used for <b>home entertainment</b>, such as watching television or playing games, and for <b>giving presentations</b> in classrooms and business meetings.</p>`,
      async on(a, ctx) { a.show('uses'); await a.tour(ctx, false); },
    },
    {
      title: 'Light bulbs',
      text: `<p>Projector <strong>light bulbs</strong> can have various <strong>brightness levels</strong>, measured in <strong>lumens</strong>.</p>
             <p>A brighter bulb is needed in a bright room. Bulbs are <strong>expensive to replace</strong>.</p>`,
      tip: 'Try it: switch the room lights and change the brightness.',
      async on(a, ctx) { a.show('bulb'); await a.bulbDemo(ctx); },
    },
    {
      title: 'Resolution',
      text: `<p>Like monitors, projectors use different quality screens: the <strong>resolution</strong>.</p>
             <p>A higher resolution gives a sharper, more detailed picture. See book pages 9–10 for more about screen resolutions.</p>`,
      async on(a, ctx) { a.show('res'); await a.resUp(ctx); },
    },
    {
      title: 'Zoom functionality',
      text: `<p>The projected image can be made larger using either <strong>optical zoom</strong> or <strong>digital zoom</strong>.</p>
             <p><b>Optical zoom</b> focuses a <b>lens</b>, so the picture stays sharp. <b>Digital zoom</b> enlarges <b>part of the image</b>, so the pixels just get bigger and the picture looks blocky.</p>`,
      tip: 'Try it: drag the zoom slider and compare.',
      async on(a, ctx) { a.show('zoom'); await a.zoomIn(ctx); },
    },
    {
      title: 'Portability',
      text: `<p>Some <strong>smaller and lighter</strong> projectors are available, and these are <strong>easier to move around</strong>.</p>
             <p>A projector fixed to a classroom ceiling can be big and heavy; a person travelling on business needs one that fits in a bag.</p>`,
      async on(a, ctx) { a.show('uses'); await a.tour(ctx, true); },
    },
  ],
});

FD.activities({
  section: 'projector',
  items: [
    {
      id: 'pj-types',
      title: 'Types of projector · 1',
      task: '<p>Do some online research to find an <b>appropriate projector</b> for each situation. Write its name and why it is suitable (brightness, resolution, zoom, portability).</p>',
      fields: ['Use in a classroom', 'A home entertainment system', 'A person travelling on business'],
      lines: 2,
      hint: 'Anything else you found out…',
    },
    {
      id: 'pj-bulbs',
      title: 'Types of projector · 2',
      task: '<p>For each projector that you identified, find out <b>how long its light bulbs last</b> (on average) and <b>how much the replacement bulbs cost</b>.</p>',
      fields: ['Classroom projector: bulb life and cost', 'Home entertainment projector: bulb life and cost', 'Travel projector: bulb life and cost'],
      lines: 2,
      hint: 'What do you notice?',
    },
  ],
});

FD.check({
  section: 'projector',
  items: [
    { type: 'mcq', q: 'The brightness of a projector’s light bulb is measured in…', opts: ['lumens', 'pixels', 'inches', 'decibels'], why: 'Bulbs have various brightness levels and are expensive to replace.' },
    { type: 'mcq', q: 'What is the difference between optical zoom and digital zoom?', opts: ['Optical zoom focuses a lens; digital zoom enlarges part of the image', 'Optical zoom enlarges pixels; digital zoom uses a lens', 'They are exactly the same', 'Digital zoom always gives a sharper picture'], why: 'Digital zoom only makes the existing pixels bigger.' },
    { type: 'multi', q: 'Which <b>three</b> are features of data projectors given in the book?', need: 3, opts: [['Light bulbs', true], ['Zoom functionality', true], ['Portability', true], ['Carbon copies', false], ['Toner', false]], why: 'The four features are light bulbs, resolution, zoom functionality and portability.' },
    { type: 'tf', q: 'Smaller and lighter projectors are easier to move around.', a: true, why: 'This is portability, useful for a person travelling on business.' },
  ],
});
