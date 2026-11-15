// Menus and overlays as DOM (title, settings, help, high scores, pause, game over, initials entry). Keyboard,
// touch and gamepad reachable: every control is a real button; focus moves into each dialog.
import { MODES } from '../sim/rules.js';
import { BATHHOUSES } from '../sim/table-spa-city.js';
import { FACTS } from '../sim/facts.js';
import { GOALS, RANKS, MODE_NAMES, shiftDay } from '../progress.js';
import { GOAL_LINE } from './coach.js';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fmt = (n) => Number(n).toLocaleString('en-US');
const DIFF_OPTS = [['easy', 'Easy'], ['standard', 'Standard'], ['expert', 'Expert']];
const DIFF_HINT = {
  easy: 'Easy: a 20 second ball save, five kickbacks a side, a forgiving tilt.',
  standard: 'Standard: a 10 second ball save, three kickbacks a side.',
  expert: 'Expert: no ball save, no kickbacks, a strict tilt and a stronger nudge.',
};
const DIFF_NAME = { easy: 'Easy', standard: 'Standard', expert: 'Expert' };
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const niceDate = (k) => MONTHS[+k.slice(5, 7) - 1] + ' ' + +k.slice(8, 10);
// the lines a finished game adds to the game-over and initials screens: a personal best, the rank, the daily table, the goals earned
function summary(res, compact) {
  if (!res) return '';
  const names = res.earned.map((id) => (GOALS.find((g) => g.id === id) || {}).name).filter(Boolean);
  const lines = [];
  if (res.newBest) lines.push('<p class="pb"><b>New personal best</b> on the ' + DIFF_NAME[res.diff] + ' table</p>');
  else if (!compact && res.best) lines.push('<p class="small">Your best on the ' + DIFF_NAME[res.diff] + ' table: ' + fmt(res.best) + '</p>');
  if (res.rankUp) lines.push('<p class="pb"><b>Rank up!</b> You are now a ' + esc(res.rank.name) + '</p>');
  else if (!compact) lines.push('<p class="small">Rank: ' + esc(res.rank.name) + (res.rank.next ? ' · ' + fmt(res.rank.toNext) + ' points to ' + esc(res.rank.next) : '') + '</p>');
  if (res.daily) lines.push('<p class="small">Daily table: best ' + fmt(res.daily.best) + (res.daily.newBest ? ' (new)' : '') + ' · ' + res.daily.streak + (res.daily.streak === 1 ? ' day' : ' days') + ' running</p>');
  if (names.length) lines.push('<p class="small goals-now">' + (names.length === 1 ? 'Goal reached: ' : 'Goals reached: ') + esc(names.join(', ')) + '</p>');
  return '<div class="summary">' + lines.join('') + '</div>';
}

export function createScreens(root, app) {
  let current = null;
  // with storage blocked (a private window, site data switched off) nothing the player earns is kept: say so
  const noSave = (id) => (app.storageOk() ? '' : `<p class="hint warn" id="${id}" role="note">Progress cannot be saved in this browser: scores and settings will not be kept.</p>`);
  const el = (html) => { root.innerHTML = html; root.hidden = !html; const st = document.getElementById('stage'); if (st) st.inert = !!html; const f = root.querySelector('[autofocus], button'); if (f) f.focus({ preventScroll: true }); };
  const on = (sel, fn) => { const n = root.querySelector(sel); if (n) n.addEventListener('click', (e) => { app.sfx('ui'); fn(e); }); };
  // a destructive button: the first tap asks, a second tap within 3 s does it
  const confirmOn = (sel, fn) => {
    const n = root.querySelector(sel); if (!n) return;
    const label = n.textContent; let timer = 0;
    n.addEventListener('click', () => {
      app.sfx('ui');
      if (timer) { clearTimeout(timer); timer = 0; fn(); return; }
      n.textContent = 'Tap again to confirm';
      timer = setTimeout(() => { timer = 0; n.textContent = label; }, 3000);
    });
  };

  const S = {
    get current() { return current; },
    close() { current = null; el(''); },
    title() {
      current = 'title';
      const P = app.progress();
      el(`<section class="screen title" role="dialog" aria-modal="true" aria-labelledby="t-h">
        <div class="title-art" aria-hidden="true"></div>
        <h1 id="t-h"><span class="t-small">Spa City</span><span class="t-big">Pinball</span></h1>
        <p class="tag">Bathhouse Row · Hot Springs, Arkansas</p>
        <div class="menu">
          ${app.canContinue() ? '<button type="button" id="b-continue" class="btn primary" autofocus>Continue game</button>' : ''}
          <button type="button" id="b-play" class="btn${app.canContinue() ? '' : ' primary'}"${app.canContinue() ? '' : ' autofocus'}>Play</button>
          <button type="button" id="b-daily" class="btn">Daily table</button>
          <div class="pair"><button type="button" id="b-scores" class="btn">High scores</button><button type="button" id="b-records" class="btn">Records</button></div>
          <div class="pair"><button type="button" id="b-help" class="btn">How to play</button><button type="button" id="b-settings" class="btn">Settings</button></div>
        </div>
        <p class="hint">${app.touch ? 'Tap the left or right side to flip · hold Launch to plunge' : 'Z and / (or Shift) to flip · hold Space to plunge'}</p>
        <p class="hint" id="t-diff">${DIFF_NAME[app.settings.difficulty]} table</p>
        ${noSave('t-nosave')}
        <p class="hint" id="t-rank">Rank: ${esc(P.rank.name)}${P.daily.days[P.today] ? ' · daily played today' : ' · today\'s daily table is waiting'}</p>
      </section>`);
      on('#b-continue', () => app.continueGame());
      on('#b-play', () => app.start());
      on('#b-daily', () => app.startDaily());
      on('#b-records', () => S.records('title'));
      on('#b-help', () => S.help('title'));
      on('#b-scores', () => S.scores('title'));
      on('#b-settings', () => S.settings('title'));
    },
    pause() {
      current = 'pause';
      el(`<section class="screen dialog" role="dialog" aria-modal="true" aria-labelledby="p-h">
        <h2 id="p-h">Paused</h2>
        <p class="small goal-line">${GOAL_LINE}</p>
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
      confirmOn('#b-restart', () => app.restart());
      confirmOn('#b-quit', () => app.quit());
    },
    settings(back) {
      current = 'settings';
      const s = app.settings;
      const opt = (id, label, vals, cur) => `<label class="row"><span>${label}</span><select id="${id}">${vals.map(([v, t]) => `<option value="${v}" ${String(v) === String(cur) ? 'selected' : ''}>${t}</option>`).join('')}</select></label>`;
      el(`<section class="screen dialog" role="dialog" aria-modal="true" aria-labelledby="s-h">
        <h2 id="s-h">Settings</h2>
        ${noSave('s-nosave')}
        <div class="form">
          ${opt('s-sound', 'Sound effects', [[1, 'On'], [0, 'Off']], +s.sound)}
          ${opt('s-music', 'Music', [[1, 'On'], [0, 'Off']], +s.music)}
          ${opt('s-ambience', 'Ambience', [[1, 'On'], [0, 'Off']], +s.ambience)}
          <label class="row"><span>Volume</span><input id="s-vol" type="range" min="0" max="1" step="0.05" value="${s.volume}"></label>
          ${opt('s-motion', 'Motion', [['auto', 'Follow system'], ['full', 'Full'], ['reduced', 'Reduced']], s.motion)}
          ${opt('s-difficulty', 'Table difficulty', DIFF_OPTS, s.difficulty)}
          <p class="hint" id="s-diff-hint">${DIFF_HINT[s.difficulty]}${back === 'pause' ? ' Applies to the next game.' : ''}</p>
          ${opt('s-balls', 'Balls per game', [[3, '3'], [5, '5']], s.balls)}
          ${opt('s-practice', 'Practice (endless ball save)', [[0, 'Off'], [1, 'On']], +s.practice)}
          ${opt('s-tier', 'Graphics quality', [['auto', 'Automatic'], ['high', 'High'], ['medium', 'Medium'], ['low', 'Low'], ['2d', 'Flat 2D']], s.tier)}
          ${opt('s-glow', 'Ball highlight', [[1, 'On'], [0, 'Off']], +s.ballGlow)}
          ${opt('s-text', 'Text size', [[1, 'Normal'], [1.15, 'Large'], [1.3, 'Larger']], s.textScale)}
          <div class="row"><span>First-game tips</span><button type="button" id="s-tips" class="btn sm">Show tips again</button></div>
          <p class="hint" id="s-tips-hint" aria-live="polite">${s.tipsSeen ? '' : 'The tips will show on the next ball.'}</p>
        </div>
        <div class="menu"><button type="button" id="b-back" class="btn primary">Done</button></div>
      </section>`);
      const read = () => {
        const v = (id) => root.querySelector(id).value;
        app.applySettings({ sound: v('#s-sound') === '1', music: v('#s-music') === '1', ambience: v('#s-ambience') === '1', volume: +v('#s-vol'), motion: v('#s-motion'),
          balls: +v('#s-balls'), difficulty: v('#s-difficulty'), practice: v('#s-practice') === '1', tier: v('#s-tier'), textScale: +v('#s-text'), ballGlow: v('#s-glow') === '1' });
      };
      on('#s-tips', () => { app.showTipsAgain(); root.querySelector('#s-tips-hint').textContent = 'The tips will show on the next ball.'; });
      root.querySelectorAll('select, input').forEach((n) => n.addEventListener('change', read));
      root.querySelector('#s-difficulty').addEventListener('change', (e) => { root.querySelector('#s-diff-hint').textContent = DIFF_HINT[e.target.value] + (back === 'pause' ? ' Applies to the next game.' : ''); });
      on('#b-back', () => { read(); back === 'pause' ? S.pause() : S.title(); });
    },
    help(back) {
      current = 'help';
      el(`<section class="screen dialog wide" role="dialog" aria-modal="true" aria-labelledby="h-h">
        <h2 id="h-h">How to play</h2>
        <p class="goal-line"><b>Goal.</b> ${GOAL_LINE}</p>
        <div class="cols">
          <div>
            <h3>Controls</h3>
            <table class="keys"><tbody>${app.touch ? `
              <tr><th>Flippers</th><td>Tap and hold the left or right half of the table</td></tr>
              <tr><th>Plunger</th><td>Hold Launch, then let go (longer = stronger). A quick tap launches.</td></tr>
              <tr><th>Nudge</th><td>Tap two fingers together on one side. Too many and the table tilts.</td></tr>
              <tr><th>Pause</th><td>The ☰ button</td></tr>` : `
              <tr><th>Left flipper</th><td>Left Shift · Z · ←</td></tr>
              <tr><th>Right flipper</th><td>Right Shift · / · →</td></tr>
              <tr><th>Plunger</th><td>Hold Space · Enter · ↓, then release (longer = stronger). A quick tap launches.</td></tr>
              <tr><th>Nudge</th><td>X (left) · . (right) · ↑. Too many and the table tilts.</td></tr>
              <tr><th>Pause</th><td>Esc · P · the menu button</td></tr>
              <tr><th>Tip</th><td>On Windows, Z and / work best: while one Shift is held, Windows hides the other Shift's release.</td></tr>`}
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
              <li><b>Kickbacks:</b> a ball that rolls down an outlane after the ball save has run out is sent back to the shooter lane, a few times a side each ball. Table difficulty in Settings changes how many.</li>
              <li><b>The Vapors</b> scoop starts modes, collects what's lit, or pays a mystery award.</li>
            </ul>
          </div>
          <div>
            <h3>Modes at the Vapors</h3>
            <ol class="modes">${MODES.map((m) => `<li><b>${esc(m.name)}</b>: ${esc(m.goal.toLowerCase())}</li>`).join('')}</ol>
            <p>Play all six to light the wizard mode, <b>Valley of the Vapors</b>. Finish it and the round goes up: the modes ask a little more and pay a little more.</p>
            <h3>About</h3>${'' /* fact: reserved, older */}
            <p class="small" id="help-about">An original game in the open-source Hot Springs Games collection (MIT). Places are shown as setting only; no affiliation with any business. Facts come from the collection's research notes, with "about" or "reportedly" where sources disagree. Horses, riders and characters are fictional. Hot Springs was set aside by Congress on April 20, 1832, forty years before Yellowstone.</p>
          </div>
        </div>
        <div class="menu"><button type="button" id="b-back" class="btn primary" autofocus>Back</button></div>
      </section>`);
      on('#b-back', () => (back === 'pause' ? S.pause() : S.title()));
    },
    scores(back, highlight = -1) {
      current = 'scores';
      const rows = app.scores().map((r, i) => `<tr class="${i === highlight ? 'hl' : ''}"><td>${i + 1}</td><td>${esc(r.initials)}</td><td class="num">${fmt(r.score)}</td><td class="diff">${r.difficulty && r.difficulty !== 'standard' ? DIFF_NAME[r.difficulty] : ''}</td></tr>`).join('');
      el(`<section class="screen dialog" role="dialog" aria-modal="true" aria-labelledby="hs-h">
        <h2 id="hs-h">High scores</h2>
        <table class="scores"><tbody>${rows}</tbody></table>
        <div class="menu"><button type="button" id="b-back" class="btn primary" autofocus>${back === 'over' ? 'Continue' : 'Back'}</button></div>
      </section>`);
      on('#b-back', () => (back === 'over' ? app.quit() : S.title()));
    },
    records(back) {
      current = 'records';
      const P = app.progress(), st = P.stats, r = P.rank, d = P.daily;
      const have = (id) => st.earned[id];
      const nGoals = GOALS.filter((g) => have(g.id)).length;
      const best = (k) => (st.best[k] ? fmt(st.best[k]) : '·');
      const stat = (k, v) => `<tr><th>${k}</th><td>${fmt(v)}</td></tr>`;
      const wins = st.modeWins.reduce((a, b) => a + b, 0);
      const cells = [];
      for (let i = 27; i >= 0; i--) { const k = shiftDay(P.today, -i), played = d.days[k] && d.days[k].plays > 0; cells.push(`<li class="${played ? 'on' : ''}${i === 0 ? ' today' : ''}" aria-label="${niceDate(k)}${played ? ': played, best ' + fmt(d.days[k].best) : ': not played'}"><span aria-hidden="true">${+k.slice(8, 10)}</span></li>`); }
      const todayRec = d.days[P.today];
      el(`<section class="screen dialog wide" role="dialog" aria-modal="true" aria-labelledby="r-h">
        <h2 id="r-h">Records</h2>
        <div class="cols">
          <div>
            <h3>Rank</h3>
            <p class="rank-name"><b id="r-rank">${esc(r.name)}</b> <span class="small">(${r.i + 1} of ${RANKS.length})</span></p>
            <div class="bar" role="img" aria-label="${Math.round(r.frac * 100)} percent of the way to ${esc(r.next || r.name)}"><i style="width:${Math.round(r.frac * 100)}%"></i></div>
            <p class="small">${fmt(st.score)} points in all${r.next ? ' · ' + fmt(r.toNext) + ' to ' + esc(r.next) : ' · the top of the Row'}</p>
            <h3>Best scores</h3>
            <table class="keys"><tbody><tr><th>Easy</th><td>${best('easy')}</td></tr><tr><th>Standard</th><td>${best('standard')}</td></tr><tr><th>Expert</th><td>${best('expert')}</td></tr></tbody></table>
            <h3>Lifetime</h3>
            <table class="keys"><tbody>${stat('Games finished', st.games)}${stat('Modes won', wins)}${stat('Wizard rounds finished', st.wizards)}${stat('Valley of the Vapors reached', st.mbs[2])}${stat('Arlington Multiballs', st.mbs[0])}${stat('Grand Soaks', st.mbs[1])}${stat('Jackpots', st.jackpots)}${stat('Skill shots', st.skillShots)}${stat('Bathhouse hits', st.baths)}${stat('Bathhouse Rows completed', st.rows)}${stat('Springs boiled', st.boils)}${stat('Extra balls', st.extraBalls)}</tbody></table>
            <h3>Wins by mode</h3>
            <ul class="chips">${MODE_NAMES.map((n, i) => `<li>${n} <b>${st.modeWins[i]}</b></li>`).join('')}</ul>
            <h3>Daily table</h3>
            <p class="small">${todayRec ? 'Today: best ' + fmt(todayRec.best) + ' in ' + todayRec.plays + (todayRec.plays === 1 ? ' game' : ' games') : 'Not played today.'} · ${P.streak} ${P.streak === 1 ? 'day' : 'days'} running · longest ${d.longest}</p>
            <ol class="cal" aria-label="The last 28 days of the daily table">${cells.join('')}</ol>
          </div>
          <div>
            <h3>Goals (${nGoals} of ${GOALS.length})</h3>
            <ul class="goals">${GOALS.map((g) => `<li class="${have(g.id) ? 'got' : 'todo'}"><b>${esc(g.name)}</b> <span class="small">${have(g.id) ? 'earned ' + niceDate(have(g.id)) : 'not yet'}</span><br><span class="small">${esc(g.text)}</span></li>`).join('')}</ul>
            <p class="small">Practice games are not recorded. Records stay in this browser.</p>
          </div>
        </div>
        <div class="menu"><button type="button" id="b-back" class="btn primary" autofocus>Back</button></div>
      </section>`);
      on('#b-back', () => S.title());
    },
    over(score, match, won, res) {
      current = 'over';
      el(`<section class="screen dialog" role="dialog" aria-modal="true" aria-labelledby="o-h">
        <h2 id="o-h">Game over</h2>
        <p class="big-score">${fmt(score)}</p>
        <p>Match <b>${String(match).padStart(2, '0')}</b>${won ? ' · <b class="won">Match! Free game</b>' : ''}</p>
        ${summary(res, false)}
        <div class="menu">
          <button type="button" id="b-again" class="btn primary" autofocus>Play again</button>
          <button type="button" id="b-title" class="btn">Title</button>
        </div>
      </section>`);
      on('#b-again', () => app.start());
      on('#b-title', () => app.quit());
    },
    entry(score, done, res) {
      current = 'entry';
      const letters = ['A', 'A', 'A'];
      let pos = 0;
      const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ ';
      const render = () => {
        el(`<section class="screen dialog" role="dialog" aria-modal="true" aria-labelledby="e-h">
          <h2 id="e-h">High score!</h2>
          <p class="big-score">${fmt(score)}</p>
          ${summary(res, true)}
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
