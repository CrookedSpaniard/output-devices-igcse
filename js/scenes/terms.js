FD.add({
  id: 'terms',
  title: 'Key terms',
  tab: 'Key terms',
  icon: 'terms',
  color: '--accent',
  page: true,
  mount(el) {
    const T = [
      ['monitor', 'Output peripheral', 'A device connected to a computer that outputs the results of the computer’s processing, e.g. as an electronic display, printed text, video, audio or tactile (touch) forms.'],
      ['monitor', 'Monitor', 'A device that lets users see the output from the computer on an electronic display.'],
      ['monitor', 'Screen size', 'The size of a screen, measured diagonally from one corner to the opposite corner.'],
      ['monitor', 'Resolution', 'The number of pixels across × down on a screen, e.g. 1920 × 1080.'],
      ['monitor', 'Pixel', 'One tiny dot of colour on a screen.'],
      ['monitor', 'Standby mode', 'A low-power mode a monitor goes into if no input is detected (an energy efficiency measure).'],
      ['printer', 'Dot matrix printer', 'An ‘impact’ printer: pins hit the paper through a ribbon of ink. Slow and noisy, but can print carbon copies.'],
      ['printer', 'Carbon copy', 'A copy of a document made using carbon paper (paper coated in a coloured substance that leaves traces on clean paper).'],
      ['printer', 'Inkjet printer', 'A printer that sprays tiny dots of ink from cartridges (black, and cyan, magenta and yellow) onto the paper.'],
      ['printer', 'Laser printer', 'A printer in which a laser discharges points on a charged drum; toner is attracted to them and heated onto the paper.'],
      ['printer', 'Discharge', 'Remove the electrical charge from something.'],
      ['printer', 'Toner', 'A type of ink (a fine powder) used in laser printers.'],
      ['print3d', '3D printer', 'A printer that creates real-life versions of digital models by adding layers of heated material from the bottom to the top.'],
      ['plotter', 'Plotter', 'An output device that draws high-quality CAD images onto large sheets of paper by moving a pen that can be raised and lowered.'],
      ['plotter', 'CAD', 'Computer Aided Design: software used to design products, buildings and machines.'],
      ['plotter', 'Cartographers', 'People who draw and produce maps.'],
      ['projector', 'Data projector', 'A device that projects a large image (or film) onto a screen, for presentations or home entertainment.'],
      ['projector', 'Lumens', 'The unit for the brightness of a projector’s light bulb.'],
      ['projector', 'Optical zoom', 'Focusing a lens in order to zoom in on an object.'],
      ['projector', 'Digital zoom', 'Enlarging part of an image to produce the effect of zooming in.'],
      ['projector', 'Portability', 'How easy a device is to move around; smaller and lighter projectors are more portable.'],
      ['speaker', 'Speaker', 'An output device that allows a computer to output sound.'],
      ['speaker', 'Mono sound', 'Sound that comes from a single speaker.'],
      ['speaker', 'Stereo sound', 'Sound that comes from two sides (left and right).'],
      ['speaker', 'Surround sound', 'Sound that comes from four or more sides, so that sounds from a film or television programme come from all around the viewer as they would in real life.'],
      ['speaker', 'Spatial awareness', 'The impression of a realistic space.'],
      ['speaker', 'Amplifier', 'A device that delivers different levels of sound to each speaker in a surround sound system.'],
      ['control', 'Control device (actuator)', 'A component of a system that makes something happen in the real physical world, e.g. a valve, piston, heater, cooler or motor.'],
      ['control', 'Nanorobot', 'A tiny robot made up of tiny sensors and actuators, able to assist a surgeon with very precise procedures.'],
    ];
    const colorOf = (id) => (FD.section(id) || { color: '--accent' }).color;
    el.innerHTML = `
      <h2>Key terms</h2>
      <div class="terms-tools"><input type="search" id="tq" placeholder="Search a term…" aria-label="Search terms">
        <span class="seg" id="tp"><button data-v="all">All</button><button data-v="A">Part A</button><button data-v="B">Part B</button></span>
        <span class="small muted" id="tn"></span></div>
      <div class="terms" id="terms">${T.map(([f, t, d]) => `
        <article class="term" data-part="${FD.section(f).part}" style="--c:var(${colorOf(f)})"><h3>${t}</h3><p>${d}</p><button class="link-btn" data-go="${f}">${FD.icon[f]} See it</button></article>`).join('')}</div>`;
    const cards = [...el.querySelectorAll('.term')];
    const q = el.querySelector('#tq'), n = el.querySelector('#tn');
    let part = 'all';
    const filter = () => {
      const s = q.value.trim().toLowerCase();
      let k = 0;
      cards.forEach((c) => { const show = (!s || c.textContent.toLowerCase().includes(s)) && (part === 'all' || c.dataset.part === part); c.hidden = !show; k += show; });
      n.textContent = `${k} of ${cards.length} terms`;
      FD.segSet(el.querySelector('#tp'), part);
    };
    q.addEventListener('input', filter);
    el.querySelector('#tp').addEventListener('click', (e) => { const b = e.target.closest('button[data-v]'); if (b) { part = b.dataset.v; filter(); } });
    filter();
    el.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => FD.goto(b.dataset.go)));
  },
});
