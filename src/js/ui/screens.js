// Menus and overlays as DOM (title, settings, help, high scores, pause, game over, initials entry). Keyboard,
// touch and gamepad reachable: every control is a real button; focus moves into each dialog.
import { MODES, LADDER, COMBO_MAX, EB_CAP } from '../sim/rules.js';
import { BATHHOUSES } from '../sim/table-spa-city.js';
import { FACTS } from '../sim/facts.js';
import { GOALS, RANKS, MODE_NAMES, shiftDay } from '../progress.js';
import { GOAL_LINE } from './coach.js';
import { KEYS, REBIND, ACTION_NAME, keyList, keyName, keyOwner, customKeys } from './input.js';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fmt = (n) => Number(n).toLocaleString('en-US');
const DIFF_OPTS = [['easy', 'Easy'], ['standard', 'Standard'], ['expert', 'Expert']];
const DIFF_HINT = {
  easy: 'Easy: a 20 second ball save, five kickbacks a side, a forgiving tilt.',
  standard: 'Standard: a 10 second ball save, one kickback a side.',
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

// what this game did, from its own tallies: only the things that happened (S4-04)
function didLine(d) {
  if (!d) return '';
  const plural = (n, one, many) => n + ' ' + (n === 1 ? one : many);
  const parts = [];
  if (d.wins) parts.push(plural(d.wins, 'mode won', 'modes won'));
  if (d.rows) parts.push(plural(d.rows, 'Bathhouse Row', 'Bathhouse Rows'));
  if (d.tower) parts.push('tower level ' + d.tower);
  if (d.skill) parts.push(plural(d.skill, 'skill shot', 'skill shots'));
  if (d.jackpots) parts.push(plural(d.jackpots, 'jackpot', 'jackpots'));
  if (d.valley) parts.push('the Valley of the Vapors');
  if (d.extra) parts.push(plural(d.extra, 'extra ball', 'extra balls'));
  if (d.boils) parts.push(plural(d.boils, 'boil', 'boils'));
  return parts.length ? '<p class="did" id="o-did">This game: ' + parts.join(' · ') + '</p>' : '';
}

// a match (S3-11): the game-over card stamps it and the records count it; a practice game is not recorded, so it is not stamped
const matchStamp = (score, won, practice) => (won && !practice ? `<p class="match-stamp" id="o-stamp" role="status"><span aria-hidden="true">★</span> MATCH <span aria-hidden="true">★</span><small>${fmt(score)} ends in the match number: added to your records</small></p>` : '');

export function createScreens(root, app) {
  let current = null;
  // with storage blocked (a private window, site data switched off) nothing the player earns is kept: say so. A save from a newer version of the game
  // is left untouched, so this visit is not saved either: the title says so once, Settings every time it opens
  let newerTold = false;
  const noSave = (id, once = false) => {
    if (app.newerSave()) {
      if (once && newerTold) return '';
      newerTold = true;
      return `<p class="hint warn" id="${id}" role="note">This visit is not being saved: your save comes from a newer version of the game, and it is left as it is.</p>`;
    }
    return app.storageOk() ? '' : `<p class="hint warn" id="${id}" role="note">Progress cannot be saved in this browser: scores and settings will not be kept.</p>`;
  };
  let unbind = null;   // set while Settings waits for a key to bind: takes the listener off again
  const el = (html) => { if (unbind) unbind(); root.innerHTML = html; root.hidden = !html; const st = document.getElementById('stage'); if (st) st.inert = !!html; const f = root.querySelector('[autofocus], button'); if (f) f.focus({ preventScroll: true }); };
  // Back, Done and Resume sound lower than the forward click: the cue is named by the button unless the caller says otherwise (the game-over card's Continue is forward)
  const BACK = ['#b-back', '#b-resume'];
  const on = (sel, fn, cue = BACK.includes(sel) ? 'uiBack' : 'ui') => { const n = root.querySelector(sel); if (n) n.addEventListener('click', (e) => { app.sfx(cue); fn(e); }); };
  // a destructive button: the first tap asks, a second tap within 3 s does it
  const confirmOn = (sel, fn, doneCue = 'ui') => {
    const n = root.querySelector(sel); if (!n) return;
    const label = n.textContent; let timer = 0;
    n.addEventListener('click', () => {
      app.sfx(timer ? doneCue : 'ui');
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
          <button type="button" id="b-credits" class="btn">Credits</button>
        </div>
        <p class="hint">${app.touch ? 'Tap the left or right side to flip · hold Launch to plunge' : customKeys() ? `${keyName(KEYS.flipL[0])} and ${keyName(KEYS.flipR[0])} to flip · hold ${keyName(KEYS.plunge[0])} to plunge` : 'Z and / (or Shift) to flip · hold Space to plunge'}</p>
        <p class="hint" id="t-diff">${DIFF_NAME[app.settings.difficulty]} table</p>
        ${noSave('t-nosave', true)}
        <p class="hint" id="t-rank">Rank: ${esc(P.rank.name)}${P.daily.days[P.today] ? ' · daily played today' : ' · today\'s daily table is waiting'}</p>
      </section>`);
      on('#b-continue', () => app.continueGame());
      on('#b-play', () => app.start());
      on('#b-daily', () => app.startDaily());
      on('#b-credits', () => S.credits('title'));
      on('#b-records', () => S.records('title'));
      on('#b-help', () => S.help('title'));
      on('#b-scores', () => S.scores('title'));
      on('#b-settings', () => S.settings('title'));
    },
    // who made it and where the facts come from: only what the game's own About text and the research notes already say (S4-04)
    credits(back) {
      current = 'credits';
      el(`<section class="screen dialog" role="dialog" aria-modal="true" aria-labelledby="c-h">
        <h2 id="c-h">Credits</h2>
        <div class="credits">
          <p><b>Spa City Pinball</b> is an original game in the open-source Hot Springs Games collection (MIT licence).</p>
          <p>The table, the sounds and the music are made in code. Nothing is loaded from the network.</p>
          <p id="c-art">Art: 3D block-outs painted with AI image tools for this game.</p>
          <p id="c-font">Headings are set in Rokkitt Bold, under the SIL Open Font License.</p>
          <p>The town facts come from the collection's research notes, with "about" or "reportedly" where sources disagree.</p>
          <p>Real places appear as historical setting. There is no affiliation with, or endorsement by, any business. Horses, riders and characters are fictional.</p>
        </div>
        <div class="menu"><button type="button" id="b-back" class="btn primary" autofocus>Back</button></div>
      </section>`);
      on('#b-back', () => (back === 'pause' ? S.pause() : S.title()));
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
      confirmOn('#b-quit', () => app.quit(), 'uiBack');   // the second tap leaves the game: a back sound
    },
    settings(back) {
      current = 'settings';
      const s = app.settings;
      // the keyboard rows: each action shows its keys, and a press on the button waits for the key to use instead
      const keyRows = () => `<h3 class="sub">Keys</h3>${REBIND.map((a) => `<div class="row"><span>${ACTION_NAME[a]}</span><button type="button" class="btn sm keybtn" data-act="${a}" aria-label="${ACTION_NAME[a]}: ${esc(keyList(a))}. Press to choose another key.">${esc(keyList(a))}</button></div>`).join('')}
          <div class="row"><span>Default keys</span><button type="button" id="s-keys-reset" class="btn sm">Reset keys</button></div>
          <p class="hint" id="s-keys-hint" aria-live="polite">Pick a key button, then press the new key. Esc cancels.</p>`;
      const opt = (id, label, vals, cur) => `<label class="row"><span>${label}</span><select id="${id}">${vals.map(([v, t]) => `<option value="${v}" ${String(v) === String(cur) ? 'selected' : ''}>${t}</option>`).join('')}</select></label>`;
      el(`<section class="screen dialog" role="dialog" aria-modal="true" aria-labelledby="s-h">
        <h2 id="s-h">Settings</h2>
        ${noSave('s-nosave')}
        <div class="form">
          ${opt('s-sound', 'Sound effects', [[1, 'On'], [0, 'Off']], +s.sound)}
          ${opt('s-music', 'Music', [[1, 'On'], [0, 'Off']], +s.music)}
          ${opt('s-ambience', 'Ambience', [[1, 'On'], [0, 'Off']], +s.ambience)}
          <label class="row"><span>Master volume</span><input id="s-vol" type="range" min="0" max="1" step="0.05" value="${s.volume}"></label>
          <label class="row"><span>Effects volume</span><input id="s-sfxvol" type="range" min="0" max="1" step="0.05" value="${s.sfxVol}"></label>
          <label class="row"><span>Music volume</span><input id="s-musvol" type="range" min="0" max="1" step="0.05" value="${s.musicVol}"></label>
          ${opt('s-motion', 'Motion', [['auto', 'Follow system'], ['full', 'Full'], ['reduced', 'Reduced']], s.motion)}
          ${opt('s-difficulty', 'Table difficulty', DIFF_OPTS, s.difficulty)}
          <p class="hint" id="s-diff-hint">${DIFF_HINT[s.difficulty]}${back === 'pause' ? ' Applies to the next game.' : ''}</p>
          ${opt('s-balls', 'Balls per game', [[3, '3'], [5, '5']], s.balls)}
          ${opt('s-practice', 'Practice (endless ball save)', [[0, 'Off'], [1, 'On']], +s.practice)}
          ${opt('s-tier', 'Graphics quality', [['auto', 'Automatic'], ['high', 'High'], ['medium', 'Medium'], ['low', 'Low'], ['2d', 'Flat 2D']], s.tier)}
          ${opt('s-glow', 'Ball highlight', [[1, 'On'], [0, 'Off']], +s.ballGlow)}
          ${typeof navigator.vibrate === 'function' || typeof navigator.getGamepads === 'function' ? opt('s-haptics', 'Vibration', [[1, 'On'], [0, 'Off']], +s.haptics) : ''}
          ${matchMedia('(max-aspect-ratio: 4 / 5)').matches ? '' : opt('s-callouts', 'Callouts on the table', [[1, 'On'], [0, 'Off']], +s.callouts)}
          ${opt('s-rim', 'Lit inserts', [[0, 'Normal'], [1, 'High contrast: white rim']], +s.litRim)}
          ${opt('s-text', 'Text size', [[1, 'Normal'], [1.15, 'Large'], [1.3, 'Larger']], s.textScale)}
          ${document.fullscreenEnabled ? '<div class="row"><span>Full screen</span><button type="button" id="s-full" class="btn sm" aria-pressed="' + !!document.fullscreenElement + '">' + (document.fullscreenElement ? 'Leave full screen' : 'Go full screen') + '</button></div>' : ''}
          <div class="row"><span>First-game tips</span><button type="button" id="s-tips" class="btn sm">Show tips again</button></div>
          <p class="hint" id="s-tips-hint" aria-live="polite">${s.tipsSeen ? '' : 'The tips will show on the next ball.'}</p>
          ${app.touch ? '' : keyRows()}
        </div>
        <div class="menu"><button type="button" id="b-back" class="btn primary">Done</button></div>
      </section>`);
      const read = () => {
        const v = (id) => root.querySelector(id).value;
        app.applySettings({ sound: v('#s-sound') === '1', music: v('#s-music') === '1', ambience: v('#s-ambience') === '1', volume: +v('#s-vol'), sfxVol: +v('#s-sfxvol'), musicVol: +v('#s-musvol'), motion: v('#s-motion'),
          balls: +v('#s-balls'), difficulty: v('#s-difficulty'), practice: v('#s-practice') === '1', tier: v('#s-tier'), textScale: +v('#s-text'), ballGlow: v('#s-glow') === '1', litRim: v('#s-rim') === '1', haptics: root.querySelector('#s-haptics') ? v('#s-haptics') === '1' : app.settings.haptics,
          callouts: root.querySelector('#s-callouts') ? v('#s-callouts') === '1' : app.settings.callouts });
      };
      const hint = root.querySelector('#s-keys-hint');
      const showKeys = () => root.querySelectorAll('.keybtn').forEach((b) => { b.textContent = keyList(b.dataset.act); b.setAttribute('aria-label', ACTION_NAME[b.dataset.act] + ': ' + keyList(b.dataset.act) + '. Press to choose another key.'); });
      root.querySelectorAll('.keybtn').forEach((btn) => btn.addEventListener('click', () => {
        app.sfx('ui');
        if (unbind) unbind();
        const a = btn.dataset.act;
        btn.textContent = 'Press a key'; hint.textContent = 'Press the key for ' + ACTION_NAME[a].toLowerCase() + '. Esc cancels.';
        const fn = (e) => {
          if (e.repeat || e.code === 'Tab') { if (e.code === 'Tab') unbind(); return; }
          e.preventDefault(); e.stopImmediatePropagation();
          if (e.code === 'Escape') { unbind(); hint.textContent = 'Cancelled. Keys are as they were.'; return; }
          const owner = keyOwner(e.code);
          if (owner && owner !== a) { hint.textContent = keyName(e.code) + ' already works the ' + ACTION_NAME[owner].toLowerCase() + '. Press another key.'; return; }
          app.applySettings({ keys: { ...(app.settings.keys || {}), [a]: e.code } });
          unbind(); hint.textContent = ACTION_NAME[a] + ' is now ' + keyName(e.code) + '.';
        };
        unbind = () => { window.removeEventListener('keydown', fn, true); unbind = null; showKeys(); };
        window.addEventListener('keydown', fn, true);
      }));
      on('#s-keys-reset', () => { app.applySettings({ keys: undefined }); showKeys(); hint.textContent = 'The keys are back to the usual ones.'; });
      on('#s-full', () => {
        const b = root.querySelector('#s-full'), enter = !document.fullscreenElement;
        Promise.resolve(enter ? document.documentElement.requestFullscreen() : document.exitFullscreen()).then(() => { b.textContent = enter ? 'Leave full screen' : 'Go full screen'; b.setAttribute('aria-pressed', String(enter)); }, () => { b.textContent = 'Full screen is not available here'; });
      });
      on('#s-tips', () => { app.showTipsAgain(); root.querySelector('#s-tips-hint').textContent = 'The tips will show on the next ball.'; });
      root.querySelectorAll('select, input').forEach((n) => n.addEventListener('change', read));
      root.querySelector('#s-difficulty').addEventListener('change', (e) => { root.querySelector('#s-diff-hint').textContent = DIFF_HINT[e.target.value] + (back === 'pause' ? ' Applies to the next game.' : ''); });
      on('#b-back', () => { read(); back === 'pause' ? S.pause() : S.title(); });
    },
    // the gamepad in a menu: up and down move between the controls, left and right change a list or a slider, A presses
    navigate(cmd) {
      const all = [...root.querySelectorAll('button, select, input')].filter((n) => !n.disabled && n.getClientRects().length);
      if (!all.length) return;
      const at = all.indexOf(document.activeElement), a = all[at];
      if (cmd === 'ok') { if (a && a.tagName === 'BUTTON') a.click(); else if (!a) all[0].focus({ preventScroll: true }); return; }
      if ((cmd === 'left' || cmd === 'right') && a && (a.tagName === 'SELECT' || a.type === 'range')) {
        const d = cmd === 'left' ? -1 : 1;
        if (a.tagName === 'SELECT') { const i = Math.max(0, Math.min(a.options.length - 1, a.selectedIndex + d)); if (i !== a.selectedIndex) { a.selectedIndex = i; a.dispatchEvent(new Event('change', { bubbles: true })); } }
        else { if (d < 0) a.stepDown(); else a.stepUp(); a.dispatchEvent(new Event('input', { bubbles: true })); a.dispatchEvent(new Event('change', { bubbles: true })); }
        return;
      }
      const d = cmd === 'up' || cmd === 'left' ? -1 : 1, n = all[(at < 0 ? (d > 0 ? 0 : all.length - 1) : (at + d + all.length) % all.length)];
      n.focus({ preventScroll: false });
    },
    help(back) {
      current = 'help';
      el(`<section class="screen dialog wide" data-tab="a" role="dialog" aria-modal="true" aria-labelledby="h-h">
        <h2 id="h-h">How to play</h2>
        <p class="goal-line"><b>Goal.</b> ${GOAL_LINE}</p>
        <div class="help-tabs" role="tablist" aria-label="Help sections">
          <button type="button" role="tab" id="ht-a" class="btn sm primary" data-tab="a" aria-selected="true" aria-controls="hp-a">Controls</button>
          <button type="button" role="tab" id="ht-b" class="btn sm" data-tab="b" aria-selected="false" aria-controls="hp-b" tabindex="-1">Table and modes</button>
        </div>
        <div class="cols">
          <div>
            <div class="hp hp-a" id="hp-a" role="tabpanel" aria-labelledby="ht-a">
            <h3>Controls</h3>
            <table class="keys"><tbody>${app.touch ? `
              <tr><th>Flippers</th><td>Tap and hold the left or right half of the table</td></tr>
              <tr><th>Plunger</th><td>Hold Launch, then let go (longer = stronger). A quick tap launches.</td></tr>
              <tr><th>Nudge</th><td>Tap two fingers together on one side. Too many and the table tilts.</td></tr>
              <tr><th>Pause</th><td>The ☰ button</td></tr>
              <tr><th>Mute</th><td>The speaker button</td></tr>` : `
              <tr><th>Left flipper</th><td>${keyList('flipL')}</td></tr>
              <tr><th>Right flipper</th><td>${keyList('flipR')}</td></tr>
              <tr><th>Plunger</th><td>Hold ${keyList('plunge')}, then release (longer = stronger). A quick tap launches.</td></tr>
              <tr><th>Nudge</th><td>${keyList('nudgeL')} (left) · ${keyList('nudgeR')} (right) · ${keyList('nudgeU')}. Too many and the table tilts. Keys can be changed in Settings.</td></tr>
              <tr><th>Pause</th><td>Esc · P · the menu button</td></tr>
              <tr><th>Mouse</th><td>Click the left or right half of the table to flip.</td></tr>
              <tr><th>Gamepad</th><td>Bumpers or triggers flip, A plunges, Y or a flick of the stick nudges, Start pauses. In menus the D-pad moves, A presses, B goes back.</td></tr>
              <tr><th>Mute</th><td>M · the speaker button</td></tr>
              <tr><th>Tip</th><td>On Windows, Z and / work best: while one Shift is held, Windows hides the other Shift's release.</td></tr>`}
            </tbody></table>
            </div>
            <div class="hp hp-b">
            <h3>The table</h3>
            <ul>
              <li><b>Skill shot:</b> plunge into the flashing S·P·A lane. Flippers move the lit lane. Hold Launch and let go when the bar reaches the lit lane's mark.</li>
              <li><b>S·P·A lanes:</b> light all three for a bonus multiplier (up to 5×).</li>
              <li><b>Thermal springs</b> (pop bumpers) heat up to 143 °F, then boil for double points.</li>
              <li><b>Bathhouse Row:</b> hit all eight, ${BATHHOUSES.join(', ')}, to light <b>Grand Soak</b> multiball.</li>
              <li><b>Mountain Tower ramp:</b> every 3 ramps raise the tower and light the lock.</li>
              <li><b>The Arlington:</b> lock 3 balls for <b>Arlington Multiball</b>. Jackpots on the ramp.</li>
              <li><b>Central Avenue orbit:</b> the spinner fills the Fifth Season meter for an extra ball.</li>
              <li><b>Kickbacks:</b> a ball that rolls down an outlane after the ball save has run out is sent back to the shooter lane, once a side each ball on Standard. Table difficulty in Settings changes how many.</li>
              <li><b>The Vapors</b> scoop starts modes, collects what's lit, or pays a mystery award.</li>
            </ul>
            </div>
          </div>
          <div>
            <div class="hp hp-b" id="hp-b" role="tabpanel" aria-labelledby="ht-b">
            <h3>Modes at the Vapors</h3>
            <ol class="modes">${MODES.map((m) => `<li><b>${esc(m.name)}</b>: ${esc(m.goal.toLowerCase())}</li>`).join('')}</ol>
            <p>Win two to light an extra ball and win four to light the wizard mode, <b>Valley of the Vapors</b>. A mode you lose pays a smaller bonus. Finish it and the round goes up: the modes ask a little more and pay a little more.</p>
            <h3>Scoring</h3>
            <ul id="help-scoring">
              <li><b>Combo:</b> a second big shot (the ramp or an orbit) within 3 seconds pays 20,000 times the chain, up to ${fmt(20000 * COMBO_MAX)}.</li>
              <li><b>Modes:</b> every step pays 15,000 or more, and most pay 50,000 to 200,000 more for finishing.</li>
              <li><b>Extra ball:</b> 300 spins fill the Fifth Season meter. At most ${EB_CAP === 2 ? 'two' : EB_CAP} extra balls a game.</li>
              <li><b>Bonus</b> at the end of each ball: 2,000 a bathhouse, 10,000 a tower level, ${fmt(LADDER.bonusWon)} a mode won (${fmt(LADDER.bonusPlayed)} if only played) and 10 a spin, times the S·P·A multiplier.</li>
              <li><b>Match:</b> a score that ends in the match number is a match, stamped in your records.</li>
              <li><b>Beat the table:</b> the display shows the next high score to pass.</li>
            </ul>
            </div>
            <div class="hp hp-c" id="hp-c" role="region" aria-label="About this game">
            <h3>About</h3>${'' /* fact: reserved, older */}
            <p class="small" id="help-about">An original game in the open-source Hot Springs Games collection (MIT). Places are shown as setting only; no affiliation with any business. Facts come from the collection's research notes, with "about" or "reportedly" where sources disagree. Horses, riders and characters are fictional. Hot Springs was set aside by Congress on April 20, 1832, forty years before Yellowstone.</p>
            </div>
          </div>
        </div>
        <div class="menu"><button type="button" id="b-about" class="btn sm help-about-link" aria-controls="hp-c" aria-expanded="false">About this game</button><button type="button" id="b-back" class="btn primary" autofocus>Back</button></div>
      </section>`);
      // on a phone the help is one section at a time (CSS shows every section on a wider screen): Controls, Table and modes, and About from the footer
      const sec = root.querySelector('.screen'), tabs = [...root.querySelectorAll('.help-tabs [role=tab]')], aboutBtn = root.querySelector('#b-about'), body = root.querySelector('.cols');
      // 'Scroll for more' is only said when there is more: a section that fits has nothing under it
      const fits = () => sec.classList.toggle('fits', body.scrollHeight <= body.clientHeight + 1);
      if (window.ResizeObserver) new ResizeObserver(fits).observe(body);
      const showTab = (id, focus = false) => {
        sec.dataset.tab = id;
        for (const b of tabs) { const on = b.dataset.tab === id; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; b.classList.toggle('primary', on); if (on && focus) b.focus(); }
        if (id === 'c') tabs[0].tabIndex = 0;   // About has no tab of its own: the first tab stays reachable by keyboard
        aboutBtn.setAttribute('aria-expanded', String(id === 'c'));
        body.scrollTop = 0; fits();
      };
      for (const b of tabs) b.addEventListener('click', () => { app.sfx('ui'); showTab(b.dataset.tab); });
      root.querySelector('.help-tabs').addEventListener('keydown', (e) => {
        const k = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!k) return;
        e.preventDefault(); showTab(tabs[(tabs.findIndex((b) => b.dataset.tab === sec.dataset.tab) + k + tabs.length) % tabs.length].dataset.tab, true);
      });
      aboutBtn.addEventListener('click', () => { app.sfx('ui'); showTab(sec.dataset.tab === 'c' ? 'a' : 'c'); });
      fits();
      on('#b-back', () => (back === 'pause' ? S.pause() : S.title()));
    },
    scores(back, highlight = -1, balls = app.scoresBalls()) {
      current = 'scores';
      const rows = app.scores(balls).map((r, i) => `<tr class="${i === highlight ? 'hl' : ''}"><td>${i + 1}</td><td>${esc(r.initials)}</td><td class="num">${fmt(r.score)}</td><td class="diff">${r.difficulty && r.difficulty !== 'standard' ? DIFF_NAME[r.difficulty] : ''}</td></tr>`).join('');
      el(`<section class="screen dialog" role="dialog" aria-modal="true" aria-labelledby="hs-h">
        <h2 id="hs-h">High scores</h2>
        <div class="pair seg" role="group" aria-label="Length of game">${[3, 5].map((n) => `<button type="button" class="btn sm${n === balls ? ' primary' : ''}" data-balls="${n}" aria-pressed="${n === balls}">${n}-ball games</button>`).join('')}</div>
        <table class="scores"><tbody>${rows}</tbody></table>
        <div class="menu"><button type="button" id="b-back" class="btn primary" autofocus>${back === 'over' ? 'Continue' : 'Back'}</button></div>
      </section>`);
      root.querySelectorAll('[data-balls]').forEach((b) => b.addEventListener('click', () => { app.sfx('ui'); S.scores(back, +b.dataset.balls === balls ? highlight : -1, +b.dataset.balls); const n = root.querySelector('[data-balls="' + b.dataset.balls + '"]'); if (n) n.focus({ preventScroll: true }); }));
      on('#b-back', () => (back === 'over' ? app.quit() : S.title()), back === 'over' ? 'ui' : 'uiBack');
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
            <table class="keys"><tbody>${stat('Games finished', st.games)}${stat('Matches won', st.matches || 0)}${stat('Modes won', wins)}${stat('Wizard rounds finished', st.wizards)}${stat('Valley of the Vapors reached', st.mbs[2])}${stat('Arlington Multiballs', st.mbs[0])}${stat('Grand Soaks', st.mbs[1])}${stat('Jackpots', st.jackpots)}${stat('Skill shots', st.skillShots)}${stat('Bathhouse hits', st.baths)}${stat('Bathhouse Rows completed', st.rows)}${stat('Springs boiled', st.boils)}${stat('Extra balls', st.extraBalls)}</tbody></table>
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
    over(score, match, won, res, practice, did) {
      current = 'over';
      el(`<section class="screen dialog" role="dialog" aria-modal="true" aria-labelledby="o-h">
        <div class="title-art" aria-hidden="true"></div>
        <h2 id="o-h">Game over</h2>
        <p class="big-score">${fmt(score)}</p>
        <p>Match <b>${String(match).padStart(2, '0')}</b></p>
        ${matchStamp(score, won, practice)}
        <p class="small" id="o-match">Match: a score that ends in ${String(match).padStart(2, '0')} is a match, and is stamped in your records.</p>
        ${didLine(did)}
        ${summary(res, false)}
        ${practice ? '<p class="small">Practice game: not ranked</p>' : ''}
        <div class="menu">
          <button type="button" id="b-again" class="btn primary" autofocus>Play again</button>
          <button type="button" id="b-title" class="btn">Title</button>
        </div>
      </section>`);
      on('#b-again', () => app.start());
      on('#b-title', () => app.quit());
    },
    entry(score, done, res) {
      // on a keyboard the letter keys type, so the hint names the flipper keys that still change the letter: Shift, / and ← → as shipped, or the player's own non-letter keys (K-07)
      const cycleKeys = () => {
        if (!customKeys()) return 'Shift, / or ← →';
        const names = [...KEYS.flipL, ...KEYS.flipR].filter((c) => !/^Key[A-Z]$/.test(c)).map(keyName);
        return names.length > 1 ? names.slice(0, -1).join(', ') + ' or ' + names[names.length - 1] : names[0] || '';
      };
      current = 'entry';
      const letters = ['A', 'A', 'A'];
      let pos = 0;
      const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ ';
      const render = () => {
        el(`<section class="screen dialog" role="dialog" aria-modal="true" aria-labelledby="e-h">
          <div class="title-art" aria-hidden="true"></div>
          <h2 id="e-h">High score!</h2>
          <p class="big-score">${fmt(score)}</p>
          ${summary(res, true)}
          ${res ? matchStamp(score, res.matched, false) : ''}
          <p>Enter your initials</p>
          <div class="initials" role="group" aria-label="Initials">${letters.map((l, i) => `<div class="ini ${i === pos ? 'on' : ''}"><button type="button" class="btn sm" data-up="${i}" aria-label="Letter ${i + 1} next">▲</button><span aria-live="polite">${l === ' ' ? '_' : l}</span><button type="button" class="btn sm" data-down="${i}" aria-label="Letter ${i + 1} previous">▼</button></div>`).join('')}</div>
          <p class="hint" id="e-hint">${app.touch ? 'Flippers change the letter · plunger confirms' : 'Type your initials' + (cycleKeys() ? ', or change the letter with ' + cycleKeys() : '') + ' · plunger confirms'}</p>
          <div class="menu"><button type="button" id="b-ok" class="btn primary" autofocus>OK</button></div>
        </section>`);
        root.querySelectorAll('[data-up]').forEach((b) => b.addEventListener('click', () => { pos = +b.dataset.up; cycle(1); }));
        root.querySelectorAll('[data-down]').forEach((b) => b.addEventListener('click', () => { pos = +b.dataset.down; cycle(-1); }));
        on('#b-ok', () => finish());
      };
      const cycle = (d) => { letters[pos] = A[(A.indexOf(letters[pos]) + d + A.length) % A.length]; render(); };
      const finish = () => done(letters.join('').replace(/ /g, '_'));
      // a keyboard types the letters (P-N03): a letter fills the place under the cursor and moves on (the last place takes the next letter instead), Backspace takes one back.
      // The letter comes from the key as the player's layout reads it, and it is taken before the game's own keys, so Z types a Z here
      let typedLast = false;
      if (S.entryType) window.removeEventListener('keydown', S.entryType, true);
      S.entryType = (e) => {
        if (current !== 'entry') { window.removeEventListener('keydown', S.entryType, true); S.entryType = null; return; }
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        if (e.key === 'Backspace') {
          if (pos === 2 && typedLast) { letters[2] = 'A'; typedLast = false; } else if (pos > 0) { pos--; letters[pos] = 'A'; } else return;
        } else if (/^[a-z]$/i.test(e.key)) {
          if (e.repeat) { e.preventDefault(); e.stopImmediatePropagation(); return; }
          letters[pos] = e.key.toUpperCase();
          if (pos < 2) pos++; else typedLast = true;
        } else return;
        e.preventDefault(); e.stopImmediatePropagation();
        render();
      };
      window.addEventListener('keydown', S.entryType, true);
      S.entryKey = (a) => {
        if (a === 'flipL') cycle(-1); else if (a === 'flipR') cycle(1);
        else if (a === 'plunge') { if (pos < 2) { pos++; render(); } else finish(); }
      };
      render();
    },
  };
  return S;
}
