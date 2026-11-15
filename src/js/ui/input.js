// Keyboard, mouse, touch and gamepad → game actions, with event timestamps so flips land on the right physics substep.
// Held keys use keydown/keyup only (auto-repeat ignored). Touch and mouse: left / right half of the table area flips that
// side; the plunger button pulls while held; two fingers landing together on one side nudge. The gamepad flips, plunges,
// nudges with the stick, and steers the menus.

export const KEYS = {
  flipL: ['ShiftLeft', 'KeyZ', 'ArrowLeft'],
  flipR: ['ShiftRight', 'Slash', 'ArrowRight'],
  plunge: ['Space', 'Enter', 'ArrowDown', 'NumpadEnter'],
  nudgeL: ['KeyX'], nudgeR: ['Period'], nudgeU: ['ArrowUp'],
  pause: ['Escape', 'KeyP'],
  mute: ['KeyM'],   // silences everything; again to bring it back
  tips: ['KeyT'],   // skips the first-game tips while they show
};

const SHIFTS = ['ShiftLeft', 'ShiftRight'];

// Settings can give each of these one key of the player's choice (settings.keys, action -> KeyboardEvent.code); an action without one keeps its list above.
export const REBIND = ['flipL', 'flipR', 'plunge', 'nudgeL', 'nudgeR', 'nudgeU'];
export const ACTION_NAME = { flipL: 'Left flipper', flipR: 'Right flipper', plunge: 'Plunger', nudgeL: 'Nudge left', nudgeR: 'Nudge right', nudgeU: 'Nudge up', pause: 'Pause', mute: 'Mute', tips: 'Skip tips' };
export const RESERVED = ['Escape', 'Tab'];   // Escape cancels and backs out; Tab moves between buttons
const DEFAULT_KEYS = Object.fromEntries(REBIND.map((a) => [a, [...KEYS[a]]]));
export function applyKeys(custom) { for (const a of REBIND) KEYS[a] = custom && typeof custom[a] === 'string' ? [custom[a]] : [...DEFAULT_KEYS[a]]; }
export const customKeys = () => REBIND.some((a) => KEYS[a].join() !== DEFAULT_KEYS[a].join());
const NAMES = { ShiftLeft: 'Left Shift', ShiftRight: 'Right Shift', ControlLeft: 'Left Ctrl', ControlRight: 'Right Ctrl', AltLeft: 'Left Alt', AltRight: 'Right Alt', Space: 'Space', Enter: 'Enter', NumpadEnter: 'Num Enter', ArrowLeft: '←', ArrowRight: '→', ArrowUp: '↑', ArrowDown: '↓',
  Slash: '/', Period: '.', Comma: ',', Semicolon: ';', Quote: "'", BracketLeft: '[', BracketRight: ']', Backslash: '\\',Backquote: '`', Minus: '-', Equal: '=', Backspace: 'Backspace', CapsLock: 'Caps Lock' };
export const keyName = (code) => NAMES[code] || code.replace(/^(Key|Digit)/, '').replace(/^Numpad/, 'Num ');
// the keys that mean an action, as the player reads them ('Left Shift · Z · ←'); the keypad's Enter is left out of the list
export const keyList = (a) => KEYS[a].filter((c) => c !== 'NumpadEnter').map(keyName).join(' · ');
// which action a key code already belongs to, for the rebinding screen: null when it is free
export const keyOwner = (code) => Object.keys(KEYS).find((a) => KEYS[a].includes(code)) || null;

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
  const touches = new Map();  // id → { a: action, at: start time }
  const NUDGE_MS = 60;        // two fingers landing together on one side nudge; a thumb landing on the other flipper does not
  const ts = (e) => {
    if (!handlers.touchActive || !handlers.touchActive()) return;
    for (const t of e.changedTouches) {
      const r = target.getBoundingClientRect();
      const a = t.clientX < r.left + r.width / 2 ? 'flipL' : 'flipR';
      const pair = [...touches.values()].some((o) => o.a === a && e.timeStamp - o.at <= NUDGE_MS);
      touches.set(t.identifier, { a, at: e.timeStamp });
      if (pair) handlers.action('nudgeU', true, e.timeStamp, 'touch');
      else handlers.action(a, true, e.timeStamp, 'touch');
    }
    e.preventDefault();
  };
  const te = (e) => {
    for (const t of e.changedTouches) {
      const a = (touches.get(t.identifier) || {}).a;
      if (!a) continue;
      touches.delete(t.identifier);
      if (![...touches.values()].some((o) => o.a === a)) handlers.action(a, false, e.timeStamp, 'touch');
    }
    e.preventDefault();
  };
  target.addEventListener('touchstart', ts, { passive: false });
  target.addEventListener('touchend', te, { passive: false });
  target.addEventListener('touchcancel', te, { passive: false });

  // mouse on the table area: the left or right half flips that side, as a finger does (a trackpad has no second button to spare)
  const mice = new Map();   // pointer id -> action
  target.addEventListener('contextmenu', (e) => e.preventDefault());
  target.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' || !handlers.touchActive || !handlers.touchActive()) return;
    const r = target.getBoundingClientRect(), a = e.clientX < r.left + r.width / 2 ? 'flipL' : 'flipR';
    mice.set(e.pointerId, a);
    try { target.setPointerCapture(e.pointerId); } catch { /* the pointer is already gone */ }
    handlers.action(a, true, e.timeStamp, 'mouse');
    e.preventDefault();
  });
  const mouseUp = (e) => {
    const a = mice.get(e.pointerId);
    if (!a) return;
    mice.delete(e.pointerId);
    if (![...mice.values()].includes(a)) handlers.action(a, false, e.timeStamp, 'mouse');
  };
  for (const ev of ['pointerup', 'pointercancel', 'lostpointercapture']) target.addEventListener(ev, mouseUp);

  // gamepad, polled from the main loop. In play: bumpers and triggers flip, A or down on the pad plunges, Y or the stick up and a flick of the
  // stick to either side nudge. In a menu (handlers.menuMode): the pad and the stick move between the controls, A presses.
  const pad = { prev: {}, menu: {} };
  const STICK = 0.6;
  function pollPad(now) {
    const gp = navigator.getGamepads ? [...navigator.getGamepads()].find(Boolean) : null;
    if (!gp) return;
    const b = (i) => !!(gp.buttons[i] && gp.buttons[i].pressed);
    const ax = (i) => (typeof gp.axes[i] === 'number' ? gp.axes[i] : 0);
    const map = { flipL: b(4) || b(6) || b(14), flipR: b(5) || b(7) || b(15), plunge: b(0) || b(13), pause: b(9), nudgeU: b(3) || ax(1) < -STICK, nudgeL: ax(0) < -STICK, nudgeR: ax(0) > STICK };
    for (const [a, v] of Object.entries(map)) {
      if (v !== !!pad.prev[a]) handlers.action(a, v, now, 'pad');
      pad.prev[a] = v;
    }
    if (handlers.menu && handlers.menuMode && handlers.menuMode()) {
      const nav = { up: b(12) || ax(1) < -STICK, down: b(13) || ax(1) > STICK, left: b(14) || ax(0) < -STICK, right: b(15) || ax(0) > STICK, ok: b(0), back: b(1) };
      for (const [k, v] of Object.entries(nav)) { if (v && !pad.menu[k]) handlers.menu(k); pad.menu[k] = v; }
    } else pad.menu = {};
  }
  return { pollPad, isDown: (code) => down.has(code), destroy() { window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku); } };
}
