// First-game tips (S2-01): four short lines, one at a time, in play, at the moment each one matters. The words follow the
// input in use (keys, touch buttons, gamepad face buttons). Pure logic and text here; main.js owns the element, the
// settings flag (`tipsSeen`) and the sim facts it feeds in.

export const TIP_MAX_WORDS = 12;
export const KINDS = ['key', 'touch', 'pad'];

// the goal in one sentence: also at the top of Help and on the pause card
export const GOAL_LINE = 'Score big: light the Row, win all six modes, reach the Valley of the Vapors.';

// the steps, in order. `until` is how the step ends besides the Skip button: 'launch' (the ball leaves the lane),
// 'flip' (the player flips), or a number of sim seconds (waiting is enough).
export const STEPS = [
  { id: 'plunge', until: 'launch', max: 40, text: { key: 'Hold Space, then let go to launch.', touch: 'Hold Launch, then let go to fire.', pad: 'Hold A, then let go to launch.' } },
  { id: 'flip', until: 'flip', max: 10, text: { key: 'Press Z or / to work the flippers.', touch: 'Tap the left or right side to flip.', pad: 'Squeeze LB or RB to flip.' } },
  { id: 'goal', until: 6, text: { key: 'Light all eight bathhouses for Grand Soak.', touch: 'Light all eight bathhouses for Grand Soak.', pad: 'Light all eight bathhouses for Grand Soak.' } },
  { id: 'vapors', until: 6, text: { key: 'Roll into The Vapors to start a mode.', touch: 'Roll into The Vapors to start a mode.', pad: 'Roll into The Vapors to start a mode.' } },
];

export const tipText = (step, kind) => STEPS[step].text[kind] || STEPS[step].text.key;

/**
 * The coach. `host` gives it the page: show(text, id) / hide() / say(text) for the screen-reader line, and done(skipped)
 * when the last step ends or the player skips. Feed it poll({ t, lane, balls, shown }) every frame (t is sim time, so a
 * pause does not run the clock) and note('flip') when the player flips.
 */
export function createCoach(host) {
  const c = { active: false, step: -1, kind: 'key', t0: 0, flipped: false, text: '' };
  const enter = (i, t) => {
    c.step = i; c.t0 = t; c.flipped = false;
    c.text = tipText(i, c.kind);
    host.show(c.text, STEPS[i].id); host.say(c.text);
  };
  c.start = (t = 0) => { if (c.active) return; c.active = true; enter(0, t); };
  c.stop = () => { if (!c.active) return; c.active = false; c.step = -1; host.hide(); };
  c.skip = () => { if (!c.active) return; c.stop(); host.done(true); };
  c.setKind = (kind) => {
    if (!KINDS.includes(kind) || kind === c.kind) return;
    c.kind = kind;
    if (c.active) { c.text = tipText(c.step, kind); host.show(c.text, STEPS[c.step].id); }
  };
  c.note = (what) => { if (c.active && what === 'flip') c.flipped = true; };
  c.poll = ({ t, lane, balls }) => {
    if (!c.active) return;
    const s = STEPS[c.step], age = t - c.t0;
    // a serve into the lane after the player has already launched once: they have learned the plunger, move on
    if (c.step > 0 && lane) { c.step = STEPS.length; c.stop(); host.done(false); return; }
    let next = false;
    if (s.until === 'launch') next = (!lane && balls > 0 && age > 0.3) || age > s.max;
    else if (s.until === 'flip') next = (c.flipped && age > 0.7) || age > s.max;
    else next = age > s.until;
    if (!next) return;
    if (c.step + 1 >= STEPS.length) { c.stop(); host.done(false); return; }
    enter(c.step + 1, t);
  };
  return c;
}
