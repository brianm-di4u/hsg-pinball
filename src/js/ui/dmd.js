// The 128×32 dot-matrix display: a brightness buffer (0–3 per dot) composed from a score screen, callouts with
// priorities, and small animations, drawn as glowing amber dots on a DOM canvas. Original pixel font (5×7).

export const DW = 128, DH = 32;

// 5×7 glyphs, each row 5 bits (MSB = left column)
const G5 = {
  ' ': [0, 0, 0, 0, 0, 0, 0], A: [14, 17, 17, 31, 17, 17, 17], B: [30, 17, 17, 30, 17, 17, 30], C: [14, 17, 16, 16, 16, 17, 14],
  D: [30, 17, 17, 17, 17, 17, 30], E: [31, 16, 16, 30, 16, 16, 31], F: [31, 16, 16, 30, 16, 16, 16], G: [14, 17, 16, 23, 17, 17, 15],
  H: [17, 17, 17, 31, 17, 17, 17], I: [14, 4, 4, 4, 4, 4, 14], J: [7, 2, 2, 2, 2, 18, 12], K: [17, 18, 20, 24, 20, 18, 17],
  L: [16, 16, 16, 16, 16, 16, 31], M: [17, 27, 21, 21, 17, 17, 17], N: [17, 17, 25, 21, 19, 17, 17], O: [14, 17, 17, 17, 17, 17, 14],
  P: [30, 17, 17, 30, 16, 16, 16], Q: [14, 17, 17, 17, 21, 18, 13], R: [30, 17, 17, 30, 20, 18, 17], S: [15, 16, 16, 14, 1, 1, 30],
  T: [31, 4, 4, 4, 4, 4, 4], U: [17, 17, 17, 17, 17, 17, 14], V: [17, 17, 17, 17, 17, 10, 4], W: [17, 17, 17, 21, 21, 21, 10],
  X: [17, 17, 10, 4, 10, 17, 17], Y: [17, 17, 10, 4, 4, 4, 4], Z: [31, 1, 2, 4, 8, 16, 31],
  0: [14, 17, 19, 21, 25, 17, 14], 1: [4, 12, 4, 4, 4, 4, 14], 2: [14, 17, 1, 2, 4, 8, 31], 3: [31, 2, 4, 2, 1, 17, 14],
  4: [2, 6, 10, 18, 31, 2, 2], 5: [31, 16, 30, 1, 1, 17, 14], 6: [6, 8, 16, 30, 17, 17, 14], 7: [31, 1, 2, 4, 8, 8, 8],
  8: [14, 17, 17, 14, 17, 17, 14], 9: [14, 17, 17, 15, 1, 2, 12],
  '.': [0, 0, 0, 0, 0, 12, 12], ',': [0, 0, 0, 0, 12, 4, 8], ':': [0, 12, 12, 0, 12, 12, 0], '!': [4, 4, 4, 4, 4, 0, 4],
  '?': [14, 17, 1, 2, 4, 0, 4], "'": [12, 4, 8, 0, 0, 0, 0], '-': [0, 0, 0, 31, 0, 0, 0], '/': [1, 1, 2, 4, 8, 16, 16],
  '&': [12, 18, 20, 8, 21, 18, 13], $: [4, 15, 20, 14, 5, 30, 4], '%': [24, 25, 2, 4, 8, 19, 3], '°': [12, 18, 18, 12, 0, 0, 0],
  '·': [0, 0, 0, 12, 12, 0, 0], '#': [10, 10, 31, 10, 31, 10, 10], '(': [2, 4, 8, 8, 8, 4, 2], ')': [8, 4, 2, 2, 2, 4, 8],
  '+': [0, 4, 4, 31, 4, 4, 0], '=': [0, 0, 31, 0, 31, 0, 0], '>': [8, 4, 2, 1, 2, 4, 8], '<': [2, 4, 8, 16, 8, 4, 2],
};

export function textWidth(s, scale = 1) { return s.length * 6 * scale - scale; }

export class DMD {
  constructor() {
    this.buf = new Uint8Array(DW * DH);
    this.queue = [];      // pending callouts
    this.cur = null;      // the callout on screen
    this.t = 0;
    this.art = {};        // id → Uint8Array(40×32) of 0–3 dot levels (dithered paintings for mode intros)
  }
  clear() { this.buf.fill(0); }
  px(x, y, v = 3) { x |= 0; y |= 0; if (x >= 0 && x < DW && y >= 0 && y < DH && v > this.buf[y * DW + x]) this.buf[y * DW + x] = v; }
  rect(x, y, w, h, v = 3, fill = false) {
    for (let i = 0; i < w; i++) for (let j = 0; j < h; j++) if (fill || i === 0 || j === 0 || i === w - 1 || j === h - 1) this.px(x + i, y + j, v);
  }
  text(s, x, y, scale = 1, v = 3) {
    s = String(s).toUpperCase();
    for (const ch of s) {
      const g = G5[ch] || G5['?'];
      for (let r = 0; r < 7; r++) for (let c = 0; c < 5; c++) if (g[r] & (16 >> c)) {
        for (let a = 0; a < scale; a++) for (let b = 0; b < scale; b++) this.px(x + c * scale + a, y + r * scale + b, v);
      }
      x += 6 * scale;
    }
  }
  center(s, y, scale = 1, v = 3) { this.text(s, Math.round((DW - textWidth(s, scale)) / 2), y, scale, v); }
  /** Wrap to lines of at most n characters. */
  static wrap(s, n = 21) {
    const out = []; let line = '';
    for (const w of String(s).split(' ')) {
      if ((line + ' ' + w).trim().length > n) { if (line) out.push(line); line = w; } else line = (line + ' ' + w).trim();
    }
    if (line) out.push(line);
    return out;
  }

  push(c) {
    // higher priority interrupts; equal priority queues (max 3 waiting)
    const item = { ...c, start: null };
    if (!this.cur || (c.prio || 0) > (this.cur.prio || 0)) { if (this.cur && (this.cur.prio || 0) >= 2) this.queue.unshift(this.cur); this.cur = item; }
    else { this.queue.push(item); if (this.queue.length > 3) this.queue.splice(0, this.queue.length - 3); }
  }
  get busy() { return !!this.cur; }

  /** Compose one frame. base(dmd) draws the idle screen (score, ball, mode). */
  frame(now, base) {
    this.t = now;
    this.clear();
    if (this.cur) {
      if (this.cur.start == null) this.cur.start = now;
      const age = now - this.cur.start;
      if (age > (this.cur.ms || 1500)) { this.cur = this.queue.shift() || null; if (this.cur) this.cur.start = now; }
    }
    if (this.cur) this.drawCallout(this.cur, now - this.cur.start);
    else base(this);
  }

  drawCallout(c, age) {
    const a = c.anim;
    const kind = typeof a === 'string' ? a : a && a.kind;
    if (kind === 'reels') return this.reels(c, age);
    if (kind === 'derby') return this.derby(c, age);
    const blink = ['jackpot', 'multiball', 'wizard', 'eb', 'skill', 'row'].includes(kind);
    if (blink && Math.floor(age / 120) % 2 === 0 && age < 700) this.rect(0, 0, DW, DH, 2);
    if (kind === 'boil') for (let i = 0; i < 18; i++) { const x = (i * 37 + 11) % DW, y = DH - 1 - ((age / 30 + i * 13) % DH); this.px(x, y, 1); this.px(x + 1, y, 1); }
    if (kind === 'tower') { const h = Math.min(30, age / 25); for (let y = 0; y < h; y++) { this.px(4, DH - 1 - y, 1); this.px(8, DH - 1 - y, 1); if (y % 4 === 0) for (let x = 4; x <= 8; x++) this.px(x, DH - 1 - y, 1); } }
    const art = (kind === 'mode' || kind === 'multiball' || kind === 'wizard') && this.art[a.id || kind];
    if (art) {
      // painting on the left (slides in), title and goal wrapped on the right
      // title (one or two lines) on the right, the objective as one scrolling line under it, the art on the left
      const lines = DMD.wrap(c.text || '', 14).slice(0, 2);
      let y = lines.length > 1 ? 2 : 6;
      for (const l of lines) { this.text(l, 44, y, 1, 3); y += 9; }
      if (c.sub) {
        const w = textWidth(c.sub), room = DW - 44;
        const off2 = w <= room ? 0 : Math.max(0, (age - 500) / 30) % (w + 30);
        this.text(c.sub, 44 - Math.round(off2), y + 3, 1, 2);
      }
      for (let yy = 0; yy < DH; yy++) for (let x = 0; x < 43; x++) this.buf[yy * DW + x] = 0;   // keep scrolled text out of the art
      const off = Math.max(0, 40 - Math.floor(age / 8));
      for (let yy = 0; yy < 32; yy++) for (let x = 0; x < 40; x++) { const v = art[yy * 40 + x]; if (v) this.px(x - off, yy, v); }
      return;
    }
    if (kind === 'mode') { this.rect(1, 1, DW - 2, DH - 2, 1); }
    const title = c.text || '';
    const big = textWidth(title, 2) <= DW - 4;
    const subLines = c.sub ? DMD.wrap(c.sub, 21) : [];
    if (big) {
      const y = subLines.length ? 2 : 9;
      this.center(title, y, 2, 3);
      if (subLines.length) this.scrollLine(subLines.join(' '), 21, age);
    } else {
      // two lines at most: the title on top (wrapped only if there is no sub line), the sub line scrolling under it
      const tl = subLines.length ? [title] : DMD.wrap(title, 21).slice(0, 2);
      let y = subLines.length ? 6 : Math.round((DH - tl.length * 9) / 2);
      for (const l of tl) { if (textWidth(l) > DW - 2) this.scrollLine(l, y, age); else this.center(l, y, 1, 3); y += 10; }
      if (subLines.length) this.scrollLine(subLines.join(' '), y + 2, age);
    }
  }
  scrollLine(s, y, age) {
    const w = textWidth(s);
    if (w <= DW - 2) return this.center(s, y, 1, 2);
    const off = Math.max(0, (age - 400) / 28) % (w + 40);
    this.text(s, Math.round(DW - 8 - off + 8), y, 1, 2);
  }
  reels(c, age) {
    const sym = { CHERRY: (x, y) => { this.rect(x + 2, y + 6, 4, 4, 3, true); this.rect(x + 8, y + 7, 4, 4, 3, true); this.px(x + 5, y + 3); this.px(x + 7, y + 2); this.px(x + 9, y + 4); },
      BELL: (x, y) => { this.rect(x + 4, y + 2, 6, 7, 3, true); this.rect(x + 2, y + 9, 10, 2, 3, true); this.px(x + 7, y + 12); },
      SHOE: (x, y) => { for (let i = 0; i < 9; i++) { this.px(x + 2, y + 3 + i); this.px(x + 11, y + 3 + i); } for (let i = 2; i < 12; i++) this.px(x + i, y + 2); },
      STEAM: (x, y) => { for (let i = 0; i < 10; i++) { this.px(x + 3 + Math.round(Math.sin(i * 0.9) * 1.5), y + 11 - i); this.px(x + 9 + Math.round(Math.sin(i * 0.9 + 2) * 1.5), y + 11 - i); } },
      STAR: (x, y) => { for (let i = -5; i <= 5; i++) { this.px(x + 7 + i, y + 7); this.px(x + 7, y + 7 + i); if (Math.abs(i) < 4) { this.px(x + 7 + i, y + 7 + i); this.px(x + 7 + i, y + 7 - i); } } } };
    const names = Object.keys(sym);
    const reels = (c.anim && c.anim.reels) || ['STAR', 'STAR', 'STAR'];
    for (let r = 0; r < 3; r++) {
      const x = 4 + r * 18, stopAt = 500 + r * 250;
      this.rect(x - 1, 1, 16, 16, 1);
      const s = age < stopAt ? names[Math.floor(age / 60 + r * 2) % names.length] : reels[r];
      sym[s](x, 2);
    }
    if (age > 1000) { const lines = DMD.wrap(c.sub || '', 11); lines.slice(0, 2).forEach((l, i) => this.text(l, 60, 3 + i * 9, 1, 3)); }
    else this.text('THE VAPORS', 60, 7, 1, 2);
    this.text(c.text === 'THE VAPORS' ? 'MYSTERY' : '', 60, 23, 1, 1);
  }
  derby(c, age) {
    const h = (c.anim && c.anim.horses) || [0, 0, 0, 0];
    const names = ['YOU', 'POP', 'MSV', 'RED'];
    for (let i = 0; i < 4; i++) {
      const y = 1 + i * 8;
      this.text(names[i], 0, y, 1, i === 0 ? 3 : 1);
      const len = Math.round((h[i] / 100) * 100);
      for (let x = 0; x < 100; x += 4) this.px(22 + x, y + 6, 1);
      this.rect(22 + len - 4, y + 1, 5, 5, i === 0 ? 3 : 2, true);
    }
    this.px(125, 0); for (let y = 0; y < 32; y += 2) this.px(125, y, 2);
  }
}

/** Paint the buffer as glowing dots on a 2D canvas. */
export function paintDMD(ctx, dmd, w, h, colors = ['#1b0f06', '#5a2a08', '#b45a12', '#ffa63a']) {
  const sx = w / DW, sy = h / DH, r = Math.min(sx, sy) * 0.42;
  ctx.fillStyle = '#0c0704';
  ctx.fillRect(0, 0, w, h);
  for (let lvl = 0; lvl < 4; lvl++) {
    ctx.fillStyle = colors[lvl];
    ctx.beginPath();
    for (let y = 0; y < DH; y++) for (let x = 0; x < DW; x++) {
      if (dmd.buf[y * DW + x] !== lvl) continue;
      const cx = (x + 0.5) * sx, cy = (y + 0.5) * sy;
      ctx.moveTo(cx + r, cy); ctx.arc(cx, cy, r, 0, Math.PI * 2);
    }
    ctx.fill();
  }
}

/** Turn a painting into 40×32 DMD dots: cover-crop, luminance, 4×4 ordered dither to four levels. */
export function ditherArt(img) {
  const c = document.createElement('canvas'); c.width = 40; c.height = 32;
  const g = c.getContext('2d');
  const s = Math.max(40 / img.width, 32 / img.height);
  g.drawImage(img, (40 - img.width * s) / 2, (32 - img.height * s) / 2, img.width * s, img.height * s);
  const d = g.getImageData(0, 0, 40, 32).data, out = new Uint8Array(40 * 32);
  const B = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  for (let i = 0; i < 40 * 32; i++) {
    const L = (0.3 * d[i * 4] + 0.59 * d[i * 4 + 1] + 0.11 * d[i * 4 + 2]) / 255;
    const x = i % 40, y = (i / 40) | 0;
    out[i] = Math.max(0, Math.min(3, Math.floor(Math.pow(L, 0.8) * 3.6 + B[(y % 4) * 4 + (x % 4)] / 16 - 0.35)));
  }
  return out;
}

/**
 * Authored 40×32 silhouettes for mode and multiball intros (clean shapes read better on a dot display than dithered
 * paintings): drawn with canvas paths, then quantised to the four dot levels.
 */
export function makeSilhouettes() {
  const art = {};
  const draw = (id, fn) => {
    const c = document.createElement('canvas'); c.width = 40; c.height = 32;
    const g = c.getContext('2d'); g.fillStyle = '#000'; g.fillRect(0, 0, 40, 32);
    g.strokeStyle = g.fillStyle = '#fff'; g.lineWidth = 1.6; g.lineCap = 'round'; g.lineJoin = 'round';
    fn(g);
    const d = g.getImageData(0, 0, 40, 32).data, out = new Uint8Array(1280);
    for (let i = 0; i < 1280; i++) out[i] = Math.min(3, Math.round((d[i * 4] / 255) * 3.2));
    art[id] = out;
  };
  const poly = (g, pts, fill = true) => { g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); fill ? g.fill() : g.stroke(); };
  const steam = (g, x, y, h) => { g.globalAlpha = 0.6; g.beginPath(); for (let k = 0; k <= h; k++) g.lineTo(x + Math.sin(k * 0.8) * 1.5, y - k); g.stroke(); g.globalAlpha = 1; };
  draw('derby', (g) => {   // a galloping horse with a rider
    poly(g, [[6, 17], [12, 13], [24, 13], [29, 9], [33, 8], [35, 11], [31, 13], [30, 18], [27, 19], [14, 19]]);
    g.lineWidth = 2; for (const [x0, x1] of [[9, 4], [13, 16], [26, 31], [28, 24]]) { g.beginPath(); g.moveTo(x0 + 2, 18); g.lineTo(x1, 27); g.stroke(); }
    g.beginPath(); g.arc(21, 8, 2.2, 0, Math.PI * 2); g.fill(); poly(g, [[18, 13], [20, 9], [23, 10], [24, 13]]);
    g.lineWidth = 1; g.beginPath(); g.moveTo(2, 29); g.lineTo(38, 29); g.stroke();
  });
  draw('raid', (g) => {    // a three-reel slot machine
    poly(g, [[8, 6], [28, 6], [30, 9], [30, 28], [6, 28], [6, 9]], false);
    g.fillRect(8, 24, 20, 2);
    for (let r = 0; r < 3; r++) { g.strokeRect(9 + r * 6.5, 12, 5, 7); g.fillRect(10.5 + r * 6.5, 14.5, 2, 2); }
    g.beginPath(); g.moveTo(31, 18); g.lineTo(35, 18); g.lineTo(35, 8); g.stroke(); g.beginPath(); g.arc(35, 6.5, 2, 0, Math.PI * 2); g.fill();
  });
  draw('tower', (g) => {   // a lattice observation tower on a ridge
    g.lineWidth = 1.2; g.beginPath(); g.moveTo(14, 29); g.lineTo(19, 9); g.moveTo(26, 29); g.lineTo(21, 9); g.stroke();
    for (let y = 12; y < 29; y += 4) { const w = (y - 9) * 0.25; g.beginPath(); g.moveTo(19 - w, y); g.lineTo(21 + w, y + 4); g.moveTo(21 + w, y); g.lineTo(19 - w, y + 4); g.stroke(); }
    g.fillRect(15, 5, 10, 4); g.fillRect(17, 2, 6, 2); g.beginPath(); g.moveTo(20, 2); g.lineTo(20, 0); g.stroke();
    poly(g, [[0, 31], [8, 27], [16, 29], [26, 28], [33, 26], [40, 29], [40, 32], [0, 32]]);
  });
  draw('tub', (g) => {     // a clawfoot tub on wheels, steaming
    poly(g, [[5, 14], [35, 14], [33, 22], [28, 25], [12, 25], [7, 22]]);
    g.beginPath(); g.arc(11, 27, 2.2, 0, Math.PI * 2); g.arc(29, 27, 2.2, 0, Math.PI * 2); g.fill();
    steam(g, 14, 12, 9); steam(g, 20, 12, 10); steam(g, 26, 12, 8);
  });
  draw('coaster', (g) => { // a wooden coaster hill
    g.lineWidth = 1.8; g.beginPath(); for (let x = 0; x <= 40; x++) g.lineTo(x, 22 - Math.sin((x / 40) * Math.PI * 1.6) * 14); g.stroke();
    g.lineWidth = 1; for (let x = 3; x < 40; x += 5) { const y = 22 - Math.sin((x / 40) * Math.PI * 1.6) * 14; g.beginPath(); g.moveTo(x, y); g.lineTo(x, 31); g.stroke(); }
    g.fillRect(12, 4, 6, 3);
  });
  draw('soak', (g) => {    // a bathhouse front with a dome, steaming
    g.fillRect(5, 16, 30, 13); g.beginPath(); g.arc(20, 16, 6, Math.PI, 0); g.fill(); g.fillRect(19, 7, 2, 4);
    g.fillStyle = '#000'; for (let a = 0; a < 5; a++) { g.beginPath(); g.arc(9 + a * 5.5, 25, 1.8, Math.PI, 0); g.rect(7.2 + a * 5.5, 25, 3.6, 4); g.fill(); }
    g.fillStyle = '#fff'; steam(g, 8, 14, 9); steam(g, 32, 14, 9);
  });
  draw('multiball', (g) => { // the Arlington's twin towers
    g.fillRect(4, 18, 32, 11); g.fillRect(9, 9, 7, 20); g.fillRect(24, 9, 7, 20);
    poly(g, [[8, 9], [12.5, 3], [17, 9]]); poly(g, [[23, 9], [27.5, 3], [32, 9]]);
    g.fillStyle = '#000'; for (let x = 6; x < 35; x += 4) g.fillRect(x, 21, 2, 3);
  });
  draw('wizard', (g) => {  // the valley of the vapors: ridges and rising steam
    poly(g, [[0, 30], [9, 18], [15, 23], [23, 13], [31, 21], [40, 16], [40, 32], [0, 32]]);
    g.lineWidth = 1.4; steam(g, 12, 19, 14); steam(g, 22, 14, 13); steam(g, 30, 19, 15);
  });
  return art;
}
