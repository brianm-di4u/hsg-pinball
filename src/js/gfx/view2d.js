// 2D canvas renderer: the fallback when WebGL is missing or too slow (tier '2d'), and the `?debug=physics` overlay.
// Draws the same sim and lamp states as the 3D view, top-down.
import { K, BALL_R } from '../sim/physics.js';

export function createView2D(canvas, T, lamps) {
  const ctx = canvas.getContext('2d');
  let W = 0, H = 0, s = 1, ox = 0, oy = 0, dpr = 1;
  const view = {
    kind: '2d',
    resize(w, h, ratio = 1) {
      dpr = ratio; W = w; H = h;
      canvas.width = Math.round(w * ratio); canvas.height = Math.round(h * ratio);
      s = Math.min(w / T.width, h / T.height) * ratio;
      ox = (canvas.width - T.width * s) / 2; oy = (canvas.height - T.height * s) / 2;
    },
    toScreen(x, y) { return [(ox + x * s) / dpr, (oy + (T.height - y) * s) / dpr]; },
    draw(G, alpha, lampOn, interp, opts = {}) {
      const X = (x) => ox + x * s, Y = (y) => oy + (T.height - y) * s;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = '#0b0a12'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      // playfield
      const g = ctx.createLinearGradient(0, Y(T.height), 0, Y(0));
      g.addColorStop(0, '#1d2a3a'); g.addColorStop(0.45, '#2a2437'); g.addColorStop(1, '#3a2a22');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.moveTo(X(10), Y(0)); ctx.lineTo(X(10), Y(830));
      ctx.arc(X(264), Y(830), 254 * s, Math.PI, 0); ctx.lineTo(X(518), Y(0)); ctx.closePath(); ctx.fill();
      // lamps
      for (const l of lamps) {
        const v = lampOn[l.name] || 0;
        ctx.save(); ctx.translate(X(l.x), Y(l.y)); ctx.rotate(-l.angle);
        ctx.globalAlpha = 0.25 + 0.75 * v;
        ctx.fillStyle = v > 0.05 ? l.color : '#3a3442';
        if (v > 0.5) { ctx.shadowColor = l.color; ctx.shadowBlur = 10 * s; }
        shape(ctx, l.shape, l.size * s);
        ctx.restore();
      }
      ctx.globalAlpha = 1; ctx.shadowBlur = 0;
      // ramps (translucent)
      for (const r of T.ramps) {
        ctx.strokeStyle = r.layer === 2 ? 'rgba(140,200,255,0.18)' : 'rgba(220,220,240,0.12)';
        ctx.lineWidth = (r.layer === 2 ? 36 : 30) * s; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.beginPath(); r.pts.forEach((p, i) => (i ? ctx.lineTo(X(p[0]), Y(p[1])) : ctx.moveTo(X(p[0]), Y(p[1])))); ctx.stroke();
      }
      // walls
      ctx.lineCap = 'round';
      for (let i = 0; i < T.segs.length; i++) {
        const sg = T.segs[i];
        if (G.w.drops[i]) continue;
        const col = sg.mask === 1 ? ({ [K.RUBBER]: '#e8d9a0', [K.SLING]: '#ff7a5c', [K.TARGET]: '#fff4dc', [K.GATE]: '#9ad' }[sg.kind] || '#b8c0cc')
          : sg.mask === 2 ? 'rgba(170,215,255,0.8)' : sg.mask === 4 ? 'rgba(220,220,235,0.9)' : '#b8c0cc';
        ctx.strokeStyle = col; ctx.lineWidth = Math.max(1, sg.r * 2 * s);
        ctx.beginPath(); ctx.moveTo(X(sg.ax), Y(sg.ay)); ctx.lineTo(X(sg.bx), Y(sg.by)); ctx.stroke();
      }
      for (const c of T.circles) {
        ctx.fillStyle = c.kind === K.BUMPER ? '#ff5aa0' : '#e8d9a0';
        ctx.beginPath(); ctx.arc(X(c.x), Y(c.y), c.r * s, 0, Math.PI * 2); ctx.fill();
        if (c.kind === K.BUMPER) { ctx.fillStyle = '#fff4dc'; ctx.beginPath(); ctx.arc(X(c.x), Y(c.y), c.r * 0.5 * s, 0, Math.PI * 2); ctx.fill(); }
      }
      for (const h of T.holes) { ctx.fillStyle = '#05040a'; ctx.beginPath(); ctx.arc(X(h.x), Y(h.y), h.r * s, 0, Math.PI * 2); ctx.fill(); }
      if (opts.debug) for (const t of T.triggers) { ctx.strokeStyle = t.layer ? '#fff' : '#2ec4b6'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(X(t.ax), Y(t.ay)); ctx.lineTo(X(t.bx), Y(t.by)); ctx.stroke(); ctx.setLineDash([]); }
      // plunger
      const p = G.w.plunger;
      ctx.fillStyle = '#c9ccd4'; ctx.fillRect(X(p.x0), Y(p.y - p.pull), (p.x1 - p.x0) * s, 40 * s);
      // flippers
      for (const f of interp.flippers) {
        ctx.strokeStyle = '#f4f1ea'; ctx.lineWidth = f.r0 * 1.7 * s; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(X(f.x), Y(f.y)); ctx.lineTo(X(f.x + Math.cos(f.angle) * f.len), Y(f.y + Math.sin(f.angle) * f.len)); ctx.stroke();
        ctx.strokeStyle = '#d23a2a'; ctx.lineWidth = 2 * s; ctx.stroke();
      }
      // balls
      for (const b of interp.balls) {
        const r = BALL_R * s * (1 + b.z / 400);
        const gg = ctx.createRadialGradient(X(b.x) - r * 0.35, Y(b.y) - r * 0.35, r * 0.1, X(b.x), Y(b.y), r);
        gg.addColorStop(0, '#ffffff'); gg.addColorStop(0.5, '#b9c2cc'); gg.addColorStop(1, '#5b6270');
        ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(X(b.x), Y(b.y), r, 0, Math.PI * 2); ctx.fill();
      }
    },
  };
  return view;
}

export function shape(ctx, kind, r) {
  ctx.beginPath();
  if (kind === 'arrow') { ctx.moveTo(r, 0); ctx.lineTo(-r * 0.6, r * 0.65); ctx.lineTo(-r * 0.25, 0); ctx.lineTo(-r * 0.6, -r * 0.65); }
  else if (kind === 'rect') ctx.rect(-r, -r * 0.45, r * 2, r * 0.9);
  else if (kind === 'triangle') { ctx.moveTo(0, -r); ctx.lineTo(r * 0.9, r * 0.7); ctx.lineTo(-r * 0.9, r * 0.7); }
  else if (kind === 'star') { for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.45 : r; ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } }
  else ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.closePath(); ctx.fill();
}
