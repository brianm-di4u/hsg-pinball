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

export function createInput(target, handlers) {
  const down = new Set();
  const which = (code) => Object.keys(KEYS).find((k) => KEYS[k].includes(code));
  const onKey = (e, isDown) => {
    const a = which(e.code);
    if (!a) return;
    if (handlers.wantsKeys && !handlers.wantsKeys(a, e)) return;
    e.preventDefault();
    if (isDown) { if (down.has(e.code) || e.repeat) return; down.add(e.code); } else down.delete(e.code);
    handlers.action(a, isDown, e.timeStamp, 'key');
  };
  const kd = (e) => onKey(e, true), ku = (e) => onKey(e, false);
  window.addEventListener('keydown', kd);
  window.addEventListener('keyup', ku);
  window.addEventListener('blur', () => { for (const a of ['flipL', 'flipR', 'plunge']) handlers.action(a, false, performance.now(), 'blur'); down.clear(); });

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
