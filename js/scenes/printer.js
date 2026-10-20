FD.add({
  id: 'printer',
  title: 'Printers: dot matrix, inkjet and laser',
  tab: 'Printers',
  icon: 'printer',
  color: '--c6',
  section: true,
  interactive: true,
  vocab: [
    ['Carbon copy', 'A copy of a document made using carbon paper (paper coated in a coloured substance that leaves traces on clean paper).'],
    ['Discharge', 'Remove the electrical charge from something.'],
    ['Toner', 'A type of ink (a fine powder) used by laser printers.'],
  ],
  mount(el) {
    const TABLE = [
      ['dot', 'Dot matrix', 'Slowest', 'Cheap', 'Low', 'Rare', 'Low', 'When multiple copies are required.'],
      ['ink', 'Inkjet', 'Fast', 'Medium', 'High', 'Yes', 'High', 'Home printing and photographs'],
      ['laser', 'Laser', 'Fastest', 'Expensive', 'Medium', 'Yes', 'Highest', 'High-volume printing, often used in offices'],
    ];
    const HEAD = ['', 'Speed', 'Printer cost', 'Cost per copy', 'Colour printing', 'Quality', 'Examples of where it is used'];
    const JOBS = [
      ['A garage prints each invoice with two carbon copies: one for the customer, one for the office and one for the accounts.', 'dot', 'Dot matrix: the impact goes through the carbon copy layers, so it makes several copies as it prints.'],
      ['A family prints holiday photographs at home a few times a year.', 'ink', 'Inkjet: good colour quality and a medium printer cost. The high cost per copy does not matter for a few prints.'],
      ['An office prints thousands of pages of reports every week.', 'laser', 'Laser: the fastest, highest quality and a medium cost per copy for high-volume printing.'],
      ['A student wants a cheap printer for occasional colour homework.', 'ink', 'Inkjet: colour printing for a medium printer cost.'],
      ['A school reprographics room prints 30 copies of a worksheet for every class, very quickly.', 'laser', 'Laser: the fastest, and cheaper per copy than inkjet.'],
    ];
    const NAMES = { dot: 'Dot matrix', ink: 'Inkjet', laser: 'Laser' };
    const WORD = 'INVOICE 042';
    const cols = FD.dotCols(WORD);
    const D = 5, X0 = 22, Y0 = 34;
    // laser: the word OK on a 16 × 9 grid of the drum's surface
    const LG = { c: 16, r: 9, s: 15 }, ok = new Set();
    FD.dotCols('OK').forEach((ys, x) => ys.forEach((y) => ok.add(`${x + 2},${y + 1}`)));

    el.innerHTML = `
      <div class="sim pr">
        <div class="ptabs" role="group" aria-label="Simulations">
          <button data-p="cmp">📋 Three types</button><button data-p="dot">🔨 Dot matrix</button><button data-p="ink">💧 Inkjet</button><button data-p="laser">⚡ Laser</button><button data-p="pick">🤔 Which printer?</button>
        </div>

        <div data-panel="cmp" class="sim">
          <div class="tbl-wrap"><table class="tbl pr-tbl" id="tbl">
            <caption>Table 1.3 Comparing printer types</caption>
            <thead><tr>${HEAD.map((h, c) => `<th data-c="${c}">${h}</th>`).join('')}</tr></thead>
            <tbody>${TABLE.map(([k, ...r]) => `<tr data-k="${k}">${r.map((v, c) => (c === 0 ? `<th scope="row" data-c="0"><span class="pr-ic">${{ dot: '🔨', ink: '💧', laser: '⚡' }[k]}</span> ${v}</th>` : `<td data-c="${c}">${v}</td>`)).join('')}</tr>`).join('')}</tbody>
          </table></div>
          <p class="note">Click a column heading to compare the three printers on one feature.</p>
        </div>

        <div data-panel="dot" class="sim" hidden>
          <div class="sim-box pr-dotbox">
            <svg viewBox="0 0 420 200" aria-label="A dot matrix print head printing through a ribbon onto paper with carbon copies">
              <g class="pr-sheet c2" id="sh2"><rect x="10" y="18" width="380" height="52" rx="3"/><text x="372" y="34">copy 2</text><g class="pr-dots" id="d2"></g></g>
              <g class="pr-sheet c1" id="sh1"><rect x="10" y="18" width="380" height="52" rx="3"/><text x="372" y="34">copy 1</text><g class="pr-dots" id="d1"></g></g>
              <g class="pr-sheet top" id="sh0"><rect x="10" y="18" width="380" height="52" rx="3"/><text x="372" y="34">top copy</text><g class="pr-dots" id="d0"></g></g>
              <rect class="pr-ribbon" x="0" y="${Y0 - 6}" width="420" height="${7 * D + 8}" id="rib"/>
              <g id="head"><rect class="pr-head" x="-9" y="${Y0 - 16}" width="18" height="${7 * D + 30}" rx="3"/>${[0, 1, 2, 3, 4, 5, 6].map((y) => `<rect class="pr-pin" data-y="${y}" x="-3" y="${Y0 + y * D - 2}" width="6" height="3"/>`).join('')}</g>
              <text class="pr-clack" id="clack" x="0" y="${Y0 + 7 * D + 30}">CLACK!</text>
            </svg>
          </div>
          <div class="ctrls">
            <button class="btn small-btn" id="dGo">▶ Print</button>
            <button class="btn small-btn" id="dFan">📑 Separate the copies</button>
            <button class="btn ghost small-btn" id="dReset">↺ New paper</button>
            <label class="note"><input type="checkbox" id="dSnd"> 🔈 Sound</label>
            <span class="note" id="dMsg"></span>
          </div>
        </div>

        <div data-panel="ink" class="sim" hidden>
          <div class="pr-inkbox">
            <div class="sim-box pr-carts">
              <p class="mw-h">Cartridges</p>
              <div class="pr-cartrow">
                <div class="pr-cart k"><i id="lk"></i><b>Black</b><small>its own cartridge</small></div>
                <div class="pr-cart col"><div class="pr-split"><i class="c" id="lc"></i><i class="m" id="lm"></i><i class="y" id="ly"></i></div><b>Colour</b><small>cyan · magenta · yellow</small></div>
              </div>
            </div>
            <div class="sim-box pr-paper" id="inkPaper">
              <div class="pr-zoomwrap" id="zw"><canvas id="ic" width="360" height="216"></canvas></div>
              <div class="pr-nozzle" id="noz">▼</div>
            </div>
          </div>
          <div class="ctrls">
            <button class="btn small-btn" id="iGo">▶ Print the photo</button>
            <button class="btn small-btn" id="iZoom" aria-pressed="false">🔍 Zoom in on the dots</button>
            <button class="btn ghost small-btn" id="iReset">↺ New paper</button>
            <span class="note" id="iMsg"></span>
          </div>
        </div>

        <div data-panel="laser" class="sim" hidden>
          <div class="sim-box">
            <svg viewBox="0 0 440 250" class="pr-laser" aria-label="Stages of laser printing on the drum">
              <text class="pr-cap" x="20" y="16">The drum’s surface (shown unrolled)</text>
              <rect class="pr-drum" x="20" y="24" width="${LG.c * LG.s}" height="${LG.r * LG.s}" rx="6"/>
              <g id="cells">${Array.from({ length: LG.r }, (_, y) => Array.from({ length: LG.c }, (_, x) => `<g class="pr-cell" data-k="${x},${y}" transform="translate(${20 + x * LG.s + LG.s / 2} ${24 + y * LG.s + LG.s / 2})"><text class="plus">+</text><circle class="toner" r="5.5"/></g>`).join('')).join('')}</g>
              <line class="pr-beam" id="beam" x1="0" y1="0" x2="0" y2="0"/>
              <g transform="translate(290 24)">
                <circle class="pr-drumside" cx="60" cy="50" r="38"/><text class="pr-cap" x="60" y="54" text-anchor="middle">drum</text>
                <path class="pr-rot" d="M60 6a44 44 0 0 1 40 26" marker-end="url(#ah)"/>
                <rect class="pr-hopper" id="hop" x="104" y="60" width="34" height="34" rx="4"/><text class="pr-cap" x="121" y="106" text-anchor="middle">toner</text>
              </g>
              <defs><marker id="ah" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="currentColor"/></marker></defs>
              <g id="paperG" class="pr-lpaper"><rect x="20" y="180" width="${LG.c * LG.s}" height="56" rx="3"/><g id="pdots"></g></g>
              <g id="fuser" class="pr-fuser"><rect x="290" y="178" width="120" height="60" rx="10"/><text x="350" y="204" text-anchor="middle">🔥 heater</text><text x="350" y="222" text-anchor="middle" class="pr-cap">fuses toner</text></g>
            </svg>
          </div>
          <div class="pr-stages" id="stg">${['⚡ Charge the drum', '🔦 Laser discharges points', '⚫ Toner sticks', '📄 Paper passes over', '🔥 Heat fixes the toner'].map((s, i) => `<button data-s="${i + 1}"><b>${i + 1}</b>${s}</button>`).join('')}</div>
          <p class="verdict" id="lMsg"></p>
        </div>

        <div data-panel="pick" class="sim" hidden>
          <div class="sim-box pr-pick">
            <p class="pr-job" id="job"></p>
            <div class="ctrls" id="pickBtns">${Object.entries(NAMES).map(([k, n]) => `<button class="btn small-btn" data-k="${k}">${n}</button>`).join('')}</div>
            <p class="verdict" id="pickV"></p>
            <div class="ctrls"><button class="btn ghost small-btn" id="pickNext">Next job ▶</button><span class="note" id="pickN"></span></div>
          </div>
        </div>
      </div>`;
    const root = el.querySelector('.pr'), $ = (s) => root.querySelector(s);
    const NS = 'http://www.w3.org/2000/svg';
    let dead = false;
    const runs = { dot: 0, ink: 0, laser: 0 };

    // ---- table ----
    function col(c) {
      root.querySelectorAll('#tbl [data-c]').forEach((x) => x.classList.toggle('hl', c > 0 && +x.dataset.c === c));
    }
    root.querySelectorAll('#tbl thead th').forEach((th) => th.addEventListener('click', () => col(+th.dataset.c)));
    function row(k) { root.querySelectorAll('#tbl tbody tr').forEach((r) => r.classList.toggle('hl', !k || r.dataset.k === k)); }
    async function scanCols(ctx) { for (let c = 1; c < HEAD.length; c++) { col(c); if (!(await ctx.sleep(1100))) return; } col(0); }

    // ---- dot matrix ----
    function dotReset() {
      runs.dot++;
      ['#d0', '#d1', '#d2'].forEach((s) => { $(s).innerHTML = ''; });
      root.querySelector('.pr-dotbox').classList.remove('fan');
      $('#head').setAttribute('transform', `translate(${X0 - 8} 0)`);
      $('#dMsg').textContent = '';
    }
    async function dotPrint() {
      dotReset();
      const id = runs.dot;
      for (let x = 0; x < cols.length; x++) {
        const hx = X0 + x * D;
        $('#head').setAttribute('transform', `translate(${hx} 0)`);
        const ys = cols[x];
        root.querySelectorAll('.pr-pin').forEach((p) => p.classList.toggle('hit', ys.includes(+p.dataset.y)));
        ys.forEach((y) => ['#d0', '#d1', '#d2'].forEach((s) => {
          const c = document.createElementNS(NS, 'circle');
          c.setAttribute('cx', hx); c.setAttribute('cy', Y0 + y * D); c.setAttribute('r', 1.9);
          $(s).appendChild(c);
        }));
        if (ys.length) {
          const cl = $('#clack');
          cl.setAttribute('x', hx - 18);
          FD.pulse(cl);
          if ($('#dSnd').checked) FD.beep(140 + Math.random() * 60, 25, 'square', 0.05);
        }
        await FD.wait(55);
        if (dead || id !== runs.dot) return;
      }
      root.querySelectorAll('.pr-pin').forEach((p) => p.classList.remove('hit'));
      $('#dMsg').innerHTML = 'Printed by <b>hitting the paper through the ink ribbon</b>. Very noisy!';
    }
    function fan(on = true) { root.querySelector('.pr-dotbox').classList.toggle('fan', on); if (on) $('#dMsg').innerHTML = 'The same text is on <b>all three layers</b>: one print, several copies.'; }
    $('#dGo').addEventListener('click', dotPrint);
    $('#dFan').addEventListener('click', () => fan(!root.querySelector('.pr-dotbox').classList.contains('fan')));
    $('#dReset').addEventListener('click', dotReset);

    // ---- inkjet ----
    const ic = $('#ic'), ictx = ic.getContext('2d');
    const G = 9, GW = ic.width / G, GH = ic.height / G;
    const src = document.createElement('canvas');
    src.width = GW; src.height = GH;
    FD.pic(src, GW * 2, GH * 2);
    const px = src.getContext('2d').getImageData(0, 0, GW, GH).data;
    const ink = { k: 100, c: 100, m: 100, y: 100 };
    const showInk = () => ['k', 'c', 'm', 'y'].forEach((k) => $('#l' + k).style.setProperty('--v', ink[k] + '%'));
    function inkReset() {
      runs.ink++;
      ictx.globalCompositeOperation = 'source-over';
      ictx.fillStyle = '#fff'; ictx.fillRect(0, 0, ic.width, ic.height);
      $('#noz').style.top = '';
      $('#iMsg').textContent = '';
      Object.keys(ink).forEach((k) => { ink[k] = 100; });
      showInk();
    }
    async function inkPrint() {
      inkReset();
      const id = runs.ink;
      ictx.globalCompositeOperation = 'multiply';
      const C = { c: '#00aeef', m: '#ec008c', y: '#fff200', k: '#231f20' };
      for (let gy = 0; gy < GH; gy++) {
        $('#noz').style.top = `${((gy * G + G / 2) * 100) / ic.height}%`;
        for (let gx = 0; gx < GW; gx++) {
          const i = (gy * GW + gx) * 4;
          const r = px[i] / 255, g = px[i + 1] / 255, b = px[i + 2] / 255;
          const k = 1 - Math.max(r, g, b);
          const amt = { c: k < 1 ? (1 - r - k) / (1 - k) : 0, m: k < 1 ? (1 - g - k) / (1 - k) : 0, y: k < 1 ? (1 - b - k) / (1 - k) : 0, k };
          const off = { c: [-1.6, -1.6], m: [1.6, -1.6], y: [-1.6, 1.6], k: [1.6, 1.6] };
          Object.entries(amt).forEach(([n, a]) => {
            if (a < (n === 'k' ? 0.3 : 0.08)) return;
            ictx.fillStyle = C[n];
            ictx.beginPath();
            ictx.arc(gx * G + G / 2 + off[n][0], gy * G + G / 2 + off[n][1], 0.8 + 2.7 * Math.sqrt(a), 0, 7);
            ictx.fill();
            ink[n] = Math.max(0, ink[n] - a * 0.06);
          });
        }
        showInk();
        await FD.wait(70);
        if (dead || id !== runs.ink) return;
      }
      $('#noz').style.top = '';
      $('#iMsg').innerHTML = 'Thousands of <b>tiny dots</b> of cyan, magenta, yellow and black make the picture.';
    }
    let zoom = false;
    function setZoom(on) { zoom = on; $('#zw').classList.toggle('zoom', on); $('#iZoom').setAttribute('aria-pressed', on); }
    $('#iGo').addEventListener('click', inkPrint);
    $('#iZoom').addEventListener('click', () => setZoom(!zoom));
    $('#iReset').addEventListener('click', () => { inkReset(); setZoom(false); });

    // ---- laser ----
    const cells = [...root.querySelectorAll('.pr-cell')];
    const LMSG = [
      '',
      '⚡ <b>1.</b> The rotating drum <b>holds an electrical charge</b> all over its surface.',
      '🔦 <b>2.</b> A laser <b>discharges</b> certain points on the drum and ‘draws’ the image.',
      '⚫ <b>3.</b> Electrically charged <b>toner is attracted to those points</b> only.',
      '📄 <b>4.</b> Paper is <b>passed over the drum</b> and the toner moves onto it.',
      '🔥 <b>5.</b> The toner is <b>heated onto the paper</b>, so it is fixed and will not smudge.',
    ];
    let stage = 0;
    function lset(s) {
      stage = s;
      root.querySelectorAll('#stg button').forEach((b) => b.classList.toggle('on', +b.dataset.s <= s && s > 0));
      cells.forEach((c) => {
        const inWord = ok.has(c.dataset.k);
        c.classList.toggle('charged', s >= 1 && !(inWord && s >= 2));
        c.classList.toggle('dis', inWord && s >= 2);
        c.classList.toggle('inked', inWord && s === 3);
      });
      $('#paperG').classList.toggle('in', s >= 4);
      $('#pdots').innerHTML = s >= 4 ? [...ok].map((k) => { const [x, y] = k.split(','); return `<circle cx="${20 + x * LG.s + LG.s / 2}" cy="${186 + y * 6}" r="2.8"/>`; }).join('') : '';
      $('#paperG').classList.toggle('fused', s >= 5);
      $('#fuser').classList.toggle('hot', s >= 5);
      $('#hop').classList.toggle('on', s === 3);
      $('#lMsg').innerHTML = LMSG[s];
      $('#lMsg').className = 'verdict' + (s === 5 ? ' good' : '');
    }
    async function beamSweep(ctx) {
      const id = ++runs.laser, beam = $('#beam');
      lset(1);
      for (let y = 0; y < LG.r; y++) {
        const cy = 24 + y * LG.s + LG.s / 2;
        for (let x = 0; x <= LG.c; x += 2) {
          beam.setAttribute('x1', 20 + x * LG.s); beam.setAttribute('y1', 0); beam.setAttribute('x2', 20 + x * LG.s); beam.setAttribute('y2', cy);
          cells.filter((c) => c.dataset.k.endsWith(',' + y)).forEach((c) => {
            const cx = +c.dataset.k.split(',')[0];
            if (cx < x && ok.has(c.dataset.k)) { c.classList.add('dis'); c.classList.remove('charged'); }
          });
          await FD.wait(16);
          if (dead || id !== runs.laser || (ctx && !ctx.alive())) return;
        }
      }
      beam.setAttribute('y2', 0);
      lset(2);
    }
    root.querySelectorAll('#stg button').forEach((b) => b.addEventListener('click', () => { runs.laser++; $('#beam').setAttribute('y2', 0); if (+b.dataset.s === 2 && stage < 2) beamSweep(); else lset(+b.dataset.s); }));
    async function laserAll(ctx, from = 1, to = 5) {
      for (let s = from; s <= to; s++) {
        if (s === 2) await beamSweep(ctx); else lset(s);
        if (!(await ctx.sleep(1500))) return;
      }
    }

    // ---- which printer? ----
    let job = 0, score = 0, answered = 0;
    function showJob(i) {
      job = i % JOBS.length;
      $('#job').textContent = JOBS[job][0];
      $('#pickV').textContent = '';
      $('#pickV').className = 'verdict';
      root.querySelectorAll('#pickBtns button').forEach((b) => { b.disabled = false; b.classList.remove('right', 'wrong'); });
      $('#pickN').textContent = `Job ${job + 1} of ${JOBS.length}${answered ? ` · ${score}/${answered} right` : ''}`;
    }
    function choose(k) {
      const [, want, why] = JOBS[job], good = k === want;
      answered++; score += good;
      root.querySelectorAll('#pickBtns button').forEach((b) => { b.disabled = true; if (b.dataset.k === want) b.classList.add('right'); else if (b.dataset.k === k) b.classList.add('wrong'); });
      $('#pickV').innerHTML = (good ? '✅ ' : `❌ Not the best choice. `) + why;
      $('#pickV').className = 'verdict ' + (good ? 'good' : 'bad');
      $('#pickN').textContent = `Job ${job + 1} of ${JOBS.length} · ${score}/${answered} right`;
    }
    root.querySelectorAll('#pickBtns button').forEach((b) => b.addEventListener('click', () => choose(b.dataset.k)));
    $('#pickNext').addEventListener('click', () => showJob(job + 1));

    dotReset();
    inkReset();
    lset(0);
    showJob(0);
    const showP = FD.panels(root);
    showP('cmp');
    return {
      show: showP, hasDots: () => !!root.querySelector('#d0 circle'), row, col, scanCols, dotPrint, dotReset, fan, inkPrint, inkReset, setZoom, laserAll, lset, showJob,
      destroy() { dead = true; Object.keys(runs).forEach((k) => runs[k]++); },
    };
  },
  steps: [
    {
      title: 'Three types of standard printer',
      text: `<p>There are three types of standard printer: <strong>dot matrix</strong>, <strong>inkjet</strong> and <strong>laser</strong>.</p>
             <p>They work in very different ways, so each one is good for different jobs.</p>`,
      on(a) { a.show('cmp'); a.col(0); a.row(null); },
    },
    {
      title: 'Dot matrix · an ‘impact’ printer',
      text: `<p>Dot matrix printers are sometimes called <strong>‘impact’ printers</strong>. The print is made by <strong>hitting (‘impacting’) the paper through a ribbon of ink</strong>.</p>
             <p>Tiny pins in the print head hit the ribbon to make each letter out of dots. This process is <strong>very noisy</strong>.</p>`,
      tip: 'Try it: press Print (turn the sound on if you want to hear it).',
      async on(a) { a.show('dot'); await a.dotPrint(); },
    },
    {
      title: 'Dot matrix · carbon copies',
      text: `<p>The paper often has a number of <strong>carbon copy</strong> layers, so the printer can make <strong>several copies of the same document as it prints it</strong>.</p>
             <p>The impact of each pin goes through all the layers.</p>`,
      tip: 'Try it: separate the copies.',
      async on(a, ctx) { a.show('dot'); if (!a.hasDots()) await a.dotPrint(); if (ctx.alive()) a.fan(true); },
    },
    {
      title: 'Inkjet · cartridges',
      text: `<p>Inkjet printers use <strong>cartridges</strong> containing different coloured ink.</p>
             <p><b>Black</b> ink is held in one cartridge, while the colour cartridge is often split into three colours: <strong>cyan, magenta and yellow</strong>.</p>`,
      tip: 'Did you know? Many cartridges can be refilled to save money and protect the environment.',
      on(a) { a.show('ink'); a.inkReset(); a.setZoom(false); },
    },
    {
      title: 'Inkjet · tiny dots of ink',
      text: `<p><strong>Tiny dots</strong> of these inks are <strong>sprayed onto the paper</strong> to form images or text.</p>
             <p>Close up, a photo is just dots of cyan, magenta, yellow and black. From a distance your eyes mix them into every colour.</p>`,
      tip: 'Try it: print the photo, then zoom in on the dots.',
      async on(a, ctx) { a.show('ink'); a.setZoom(false); await a.inkPrint(); if (await ctx.sleep(600)) a.setZoom(true); },
    },
    {
      title: 'Laser · the drum and the laser',
      text: `<p>Laser printers contain a <strong>rotating cylinder or drum</strong> that holds an <strong>electrical charge</strong>.</p>
             <p>A laser is used to <strong>discharge</strong> certain points on the drum and <strong>‘draw’ an image</strong>.</p>`,
      tip: 'Try it: click the stages one by one.',
      async on(a, ctx) { a.show('laser'); a.lset(0); if (!(await ctx.sleep(500))) return; await a.laserAll(ctx, 1, 2); },
    },
    {
      title: 'Laser · toner and heat',
      text: `<p>Electrically charged <strong>toner</strong> (a type of ink) is <strong>attracted to those points</strong> on the drum.</p>
             <p>The toner is then <strong>heated onto paper</strong> that is passed over the drum.</p>`,
      async on(a, ctx) { a.show('laser'); a.lset(2); if (!(await ctx.sleep(800))) return; await a.laserAll(ctx, 3, 5); },
    },
    {
      title: 'Comparing printer types (Table 1.3)',
      text: `<p><b>Dot matrix:</b> slowest, cheap to buy, low cost per copy, rarely colour, low quality → when <b>multiple copies</b> are required.</p>
             <p><b>Inkjet:</b> fast, medium price, <b>high cost per copy</b>, colour, high quality → home printing and photographs.</p>
             <p><b>Laser:</b> fastest, expensive, medium cost per copy, colour, highest quality → <b>high-volume</b> printing in offices.</p>`,
      tip: 'Try it: click each column heading.',
      async on(a, ctx) { a.show('cmp'); a.row(null); await a.scanCols(ctx); },
    },
    {
      title: 'Which printer would you choose?',
      text: `<p>Use the table to choose the <strong>best printer for each job</strong>. Think about speed, cost per copy, colour, quality and copies.</p>`,
      tip: 'Try it: choose a printer for each job.',
      on(a) { a.show('pick'); a.showJob(0); },
    },
  ],
});

FD.check({
  section: 'printer',
  items: [
    { type: 'sort', q: 'Which type of printer is each statement about?', bins: ['Dot matrix', 'Inkjet', 'Laser'], rows: [['Prints by hitting the paper through a ribbon of ink', 0], ['Sprays tiny dots of ink onto the paper', 1], ['A laser discharges points on a charged drum', 2], ['Can print several carbon copies at once', 0], ['Has the highest cost per copy', 1], ['The fastest, used for high-volume printing', 2]], why: 'Look again at Table 1.3 if you missed any.' },
    { type: 'mcq', q: 'Why are dot matrix printers called ‘impact’ printers?', opts: ['The print is made by hitting the paper through a ribbon of ink', 'They have a big impact on the environment', 'They use a laser that hits the drum', 'They spray ink at high speed'], why: 'The pins impact the ribbon, which marks the paper. This is very noisy.' },
    { type: 'mcq', q: 'The colour cartridge of an inkjet printer is often split into which three colours?', opts: ['Cyan, magenta and yellow', 'Red, green and blue', 'Black, white and grey', 'Cyan, red and black'], why: 'Black is held in its own cartridge.' },
    { type: 'mcq', q: 'In a laser printer, what happens to the toner at the end?', opts: ['It is heated onto the paper', 'It is sprayed through tiny nozzles', 'It is hit through a ribbon', 'It is dried with a fan'], why: 'Charged toner sticks to the discharged points on the drum and is heated onto the paper passed over it.' },
    { type: 'tf', q: 'Laser printers have the lowest quality of the three types of printer.', a: false, why: 'Laser printers have the highest quality; dot matrix printers have the lowest.' },
  ],
});
