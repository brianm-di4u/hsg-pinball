// Keyboard, touch and gamepad → game actions, with event timestamps so flips land on the right physics substep.
// Held keys use keydown/keyup only (auto-repeat ignored). Touch: left / right half of the table area flips that
// side; the plunger button pulls while held; a two-finger tap nudges.

export const KEYS = {
  flipL: ['ShiftLeft', 'KeyZ', 'ArrowLeft'],
  flipR: ['ShiftRight', 'Slash', 'ArrowRight'],
  plunge: ['Space', 'Enter', 'ArrowDown', 'NumpadEnter'],
  nudgeL: ['KeyX'], nudgeR: ['Period'], nudgeU: ['ArrowUp'],
  pause: ['Escape', 'KeyP'],
};

const SHIFTS = ['ShiftLeft', 'ShiftRight'];

export function createInput(target, handlers) {
  const down = new Set();
  const which = (code) => Object.keys(KEYS).find((k) => KEYS[k].includes(code));
  // an action is held while any of its keys is down: it presses on the first key and releases on the last
  const held = (a) => KEYS[a].some((c) => down.has(c));
  const release = (code, ts, src) => {
    if (!down.delete(code)) return;
    const a = which(code);
    if (!held(a)) handlers.action(a, false, ts, src);
  };
  const onKey = (e, isDown) => {
    // Windows sends no keyup for the first Shift released while both are down; the last one's keyup (and every
    // later key event) reports Shift up, so any Shift still recorded as down was released
    if (!e.getModifierState('Shift')) for (const c of SHIFTS) if (c !== e.code) release(c, e.timeStamp, 'key');
    const a = which(e.code);
    if (!a) return;
    const wanted = !handlers.wantsKeys || handlers.wantsKeys(a, e);
    if (wanted) e.preventDefault();
    if (!isDown) { release(e.code, e.timeStamp, 'key'); return; }   // tracked even while a menu has the keys
    // a repeat for a key not yet down is a real press: Windows flags the second Shift's keydown as a repeat
    if (down.has(e.code) || !wanted) return;
    const first = !held(a);
    down.add(e.code);
    if (first) handlers.action(a, true, e.timeStamp, 'key');
  };
  const kd = (e) => onKey(e, true), ku = (e) => onKey(e, false);
  // focus lost: keyups will never arrive, so let go of every held key (and the plunger, however it is held)
  const releaseAll = () => { const ts = performance.now(); for (const c of [...down]) release(c, ts, 'blur'); handlers.action('plunge', false, ts, 'blur'); };
  window.addEventListener('keydown', kd);
  window.addEventListener('keyup', ku);
  window.addEventListener('blur', releaseAll);
  document.addEventListener('visibilitychange', () => { if (document.hidden) releaseAll(); });

  // touch on the table area
  const touches = new Map();  // id → action
  const ts = (e) => {
    if (!handlers.touchActive || !handlers.touchActive()) return;
    if (e.touches.length >= 2 && e.changedTouches.length === 1 && touches.size >= 1) { handlers.action('nudgeU', true, e.timeStamp, 'touch'); }
    for (const t of e.changedTouches) {
      const r = target.getBoundingClientRect();
      const a = t.clientX < r.left + r.width / 2 ? 'flipL' : 'flipR';
      touches.set(t.identifier, a);
      handlers.action(a, true, e.timeStamp, 'touch');
    }
    e.preventDefault();
  };
  const te = (e) => {
    for (const t of e.changedTouches) {
      const a = touches.get(t.identifier);
      if (!a) continue;
      touches.delete(t.identifier);
      if (![...touches.values()].includes(a)) handlers.action(a, false, e.timeStamp, 'touch');
    }
    e.preventDefault();
  };
  target.addEventListener('touchstart', ts, { passive: false });
  target.addEventListener('touchend', te, { passive: false });
  target.addEventListener('touchcancel', te, { passive: false });

  // gamepad, polled from the main loop
  const pad = { prev: {} };
  function pollPad(now) {
    const gp = navigator.getGamepads ? [...navigator.getGamepads()].find(Boolean) : null;
    if (!gp) return;
    const b = (i) => !!(gp.buttons[i] && gp.buttons[i].pressed);
    const map = { flipL: b(4) || b(6) || b(14), flipR: b(5) || b(7) || b(15), plunge: b(0) || b(13), pause: b(9), nudgeU: b(3) };
    for (const [a, v] of Object.entries(map)) {
      if (v !== !!pad.prev[a]) handlers.action(a, v, now, 'pad');
      pad.prev[a] = v;
    }
  }
  return { pollPad, isDown: (code) => down.has(code), destroy() { window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku); } };
}
