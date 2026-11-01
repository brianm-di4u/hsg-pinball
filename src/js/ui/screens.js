// Menus and overlays as DOM (title, settings, help, high scores, pause, game over, initials entry). Keyboard,
// touch and gamepad reachable: every control is a real button; focus moves into each dialog.
import { MODES } from '../sim/rules.js';
import { BATHHOUSES } from '../sim/table-spa-city.js';
import { FACTS } from '../sim/facts.js';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fmt = (n) => Number(n).toLocaleString('en-US');

export function createScreens(root, app) {
  let current = null;
  const el = (html) => { root.innerHTML = html; root.hidden = !html; const f = root.querySelector('[autofocus], button'); if (f) f.focus({ preventScroll: true }); };
  const on = (sel, fn) => { const n = root.querySelector(sel); if (n) n.addEventListener('click', (e) => { app.sfx('ui'); fn(e); }); };

  const S = {
    get current() { return current; },
    close() { current = null; el(''); },
    title() {
      current = 'title';
      el(`<section class="screen title" aria-labelledby="t-h">
        <div class="title-art" aria-hidden="true"></div>
        <h1 id="t-h"><span class="t-small">Spa City</span><span class="t-big">Pinball</span></h1>
        <p class="tag">Bathhouse Row · Hot Springs, Arkansas</p>
        <div class="menu">
          <button type="button" id="b-play" class="btn primary" autofocus>Play</button>
          <button type="button" id="b-help" class="btn">How to play</button>
          <button type="button" id="b-scores" class="btn">High scores</button>
          <button type="button" id="b-settings" class="btn">Settings</button>
        </div>
        <p class="hint">${app.touch ? 'Tap the left or right side to flip' : 'Shift or Z and / to flip · hold Space to plunge'}</p>
      </section>`);
      on('#b-play', () => app.start());
      on('#b-help', () => S.help('title'));
      on('#b-scores', () => S.scores('title'));
      on('#b-settings', () => S.settings('title'));
    },
    pause() {
      current = 'pause';
      el(`<section class="screen dialog" role="dialog" aria-modal="true" aria-labelledby="p-h">
        <h2 id="p-h">Paused</h2>
        <div class="menu">
          <button type="button" id="b-resume" class="btn primary" autofocus>Resume</button>
          <button type="button" id="b-help" class="btn">How to play</button>
          <button type="button" id="b-settings" class="btn">Settings</button>
          <button type="button" id="b-restart" class="btn">Restart game</button>
          <button type="button" id="b-quit" class="btn">Quit to title</button>
        </div>
      </section>`);
      on('#b-resume', () => app.resume());
      on('#b-help', () => S.help('pause'));
      on('#b-settings', () => S.settings('pause'));
      on('#b-restart', () => app.start());
      on('#b-quit', () => app.quit());
    },
    settings(back) {
      current = 'settings';
      const s = app.settings;
      const opt = (id, label, vals, cur) => `<label class="row"><span>${label}</span><select id="${id}">${vals.map(([v, t]) => `<option value="${v}" ${String(v) === String(cur) ? 'selected' : ''}>${t}</option>`).join('')}</select></label>`;
      el(`<section class="screen dialog" role="dialog" aria-modal="true" aria-labelledby="s-h">
        <h2 id="s-h">Settings</h2>
        <div class="form">
          ${opt('s-sound', 'Sound effects', [[1, 'On'], [0, 'Off']], +s.sound)}
          ${opt('s-music', 'Music', [[1, 'On'], [0, 'Off']], +s.music)}
          <label class="row"><span>Volume</span><input id="s-vol" type="range" min="0" max="1" step="0.05" value="${s.volume}"></label>
          ${opt('s-motion', 'Motion', [['auto', 'Follow system'], ['full', 'Full'], ['reduced', 'Reduced']], s.motion)}
          ${opt('s-balls', 'Balls per game', [[3, '3'], [5, '5']], s.balls)}
          ${opt('s-practice', 'Practice (endless ball save)', [[0, 'Off'], [1, 'On']], +s.practice)}
          ${opt('s-tier', 'Graphics quality', [['auto', 'Automatic'], ['high', 'High'], ['medium', 'Medium'], ['low', 'Low'], ['2d', 'Flat 2D']], s.tier)}
          ${opt('s-text', 'Text size', [[1, 'Normal'], [1.15, 'Large'], [1.3, 'Larger']], s.textScale)}
        </div>
        <div class="menu"><button type="button" id="b-back" class="btn primary">Done</button></div>
      </section>`);
      const read = () => {
        const v = (id) => root.querySelector(id).value;
        app.applySettings({ sound: v('#s-sound') === '1', music: v('#s-music') === '1', volume: +v('#s-vol'), motion: v('#s-motion'),
          balls: +v('#s-balls'), practice: v('#s-practice') === '1', tier: v('#s-tier'), textScale: +v('#s-text') });
      };
      root.querySelectorAll('select, input').forEach((n) => n.addEventListener('change', read));
      on('#b-back', () => { read(); back === 'pause' ? S.pause() : S.title(); });
    },
    help(back) {
      current = 'help';
      el(`<section class="screen dialog wide" role="dialog" aria-modal="true" aria-labelledby="h-h">
        <h2 id="h-h">How to play</h2>
        <div class="cols">
          <div>
            <h3>Controls</h3>
            <table class="keys"><tbody>
              <tr><th>Left flipper</th><td>Left Shift · Z · ← · tap left half</td></tr>
              <tr><th>Right flipper</th><td>Right Shift · / · → · tap right half</td></tr>
              <tr><th>Plunger</th><td>Hold Space · Enter · ↓, then release · hold the Launch button</td></tr>
              <tr><th>Nudge</th><td>X (left) · . (right) · ↑ · two-finger tap. Too many and the table tilts.</td></tr>
              <tr><th>Pause</th><td>Esc · P · the menu button</td></tr>
            </tbody></table>
            <h3>The table</h3>
            <ul>
              <li><b>Skill shot:</b> plunge into the flashing S·P·A lane. Flippers move the lit lane.</li>
              <li><b>S·P·A lanes:</b> light all three for a bonus multiplier (up to 5×).</li>
              <li><b>Thermal springs</b> (pop bumpers) heat up to 143 °F, then boil for double points.</li>
              <li><b>Bathhouse Row:</b> hit all eight, ${BATHHOUSES.join(', ')}, to light <b>Grand Soak</b> multiball.</li>
              <li><b>Mountain Tower ramp:</b> every 3 ramps raise the tower and light the lock.</li>
              <li><b>The Arlington:</b> lock 3 balls for <b>Arlington Multiball</b>. Jackpots on the ramp.</li>
              <li><b>Central Avenue orbit:</b> the spinner fills the Fifth Season meter for an extra ball.</li>
              <li><b>The Vapors</b> scoop starts modes, collects what's lit, or pays a mystery award.</li>
            </ul>
          </div>
          <div>
            <h3>Modes at the Vapors</h3>
            <ol class="modes">${MODES.map((m) => `<li><b>${esc(m.name)}</b>: ${esc(m.goal.toLowerCase())}</li>`).join('')}</ol>
            <p>Play all six to light the wizard mode, <b>Valley of the Vapors</b>.</p>
            <h3>About</h3>
            <p class="small">An original game in the open-source Hot Springs Games collection (MIT). Places are shown as setting only; no affiliation with any business. Facts come from the collection's research notes, with "about" or "reportedly" where sources disagree. Horses, riders and characters are fictional. ${esc(FACTS.reserved.text.toLowerCase())}.</p>
          </div>
        </div>
        <div class="menu"><button type="button" id="b-back" class="btn primary" autofocus>Back</button></div>
      </section>`);
      on('#b-back', () => (back === 'pause' ? S.pause() : S.title()));
    },
    scores(back, highlight = -1) {
      current = 'scores';
      const rows = app.scores().map((r, i) => `<tr class="${i === highlight ? 'hl' : ''}"><td>${i + 1}</td><td>${esc(r.initials)}</td><td class="num">${fmt(r.score)}</td></tr>`).join('');
      el(`<section class="screen dialog" role="dialog" aria-modal="true" aria-labelledby="hs-h">
        <h2 id="hs-h">High scores</h2>
        <table class="scores"><tbody>${rows}</tbody></table>
        <div class="menu"><button type="button" id="b-back" class="btn primary" autofocus>${back === 'over' ? 'Continue' : 'Back'}</button></div>
      </section>`);
      on('#b-back', () => S.title());
    },
    over(score, match, won) {
      current = 'over';
      el(`<section class="screen dialog" role="dialog" aria-modal="true" aria-labelledby="o-h">
        <h2 id="o-h">Game over</h2>
        <p class="big-score">${fmt(score)}</p>
        <p>Match <b>${String(match).padStart(2, '0')}</b>${won ? ' · <b class="won">Match! Free game</b>' : ''}</p>
        <div class="menu">
          <button type="button" id="b-again" class="btn primary" autofocus>Play again</button>
          <button type="button" id="b-title" class="btn">Title</button>
        </div>
      </section>`);
      on('#b-again', () => app.start());
      on('#b-title', () => app.quit());
    },
    entry(score, done) {
      current = 'entry';
      const letters = ['A', 'A', 'A'];
      let pos = 0;
      const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ ';
      const render = () => {
        el(`<section class="screen dialog" role="dialog" aria-modal="true" aria-labelledby="e-h">
          <h2 id="e-h">High score!</h2>
          <p class="big-score">${fmt(score)}</p>
          <p>Enter your initials</p>
          <div class="initials" role="group" aria-label="Initials">${letters.map((l, i) => `<div class="ini ${i === pos ? 'on' : ''}"><button type="button" class="btn sm" data-up="${i}" aria-label="Letter ${i + 1} next">▲</button><span aria-live="polite">${l === ' ' ? '_' : l}</span><button type="button" class="btn sm" data-down="${i}" aria-label="Letter ${i + 1} previous">▼</button></div>`).join('')}</div>
          <p class="hint">Flippers change the letter · plunger confirms</p>
          <div class="menu"><button type="button" id="b-ok" class="btn primary" autofocus>OK</button></div>
        </section>`);
        root.querySelectorAll('[data-up]').forEach((b) => b.addEventListener('click', () => { pos = +b.dataset.up; cycle(1); }));
        root.querySelectorAll('[data-down]').forEach((b) => b.addEventListener('click', () => { pos = +b.dataset.down; cycle(-1); }));
        on('#b-ok', () => finish());
      };
      const cycle = (d) => { letters[pos] = A[(A.indexOf(letters[pos]) + d + A.length) % A.length]; render(); };
      const finish = () => done(letters.join('').replace(/ /g, '_'));
      S.entryKey = (a) => {
        if (a === 'flipL') cycle(-1); else if (a === 'flipR') cycle(1);
        else if (a === 'plunge') { if (pos < 2) { pos++; render(); } else finish(); }
      };
      render();
    },
  };
  return S;
}
