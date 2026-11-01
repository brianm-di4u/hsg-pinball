# Spa City Pinball: product requirements

Step D of `shared/SESSION-BRIEF.md`. The ideal version of the game, with numbered acceptance criteria (AC).

## 1. Vision and pillars
An original, top-down 2.5D pinball table set on Bathhouse Row in Hot Springs, Arkansas: steaming thermal
springs at the top, the eight historic bathhouses across the middle, the Mountain Tower ramp up the right, and
Central Avenue's orbit up the left. It should look as good as the collection's best 3D work and play like a real
table.
1. **Real pinball feel.** Fast, fair, physical: flippers that cradle, catch and aim; ramps that reject weak shots.
2. **Readable at a glance.** Top-down camera, a clear lamp language (shape and colour), everything visible on a phone.
3. **Hot Springs, accurately.** Every shown fact comes from `research/` with hedges where sources disagree.
4. **Juice.** Lamps, bloom, steam, coils, callouts, light shows.

## 2. Players
Casual browser players (desktop and phone) who want a few minutes of play; pinball fans who will learn the
rules for high scores. Keyboard, touch and gamepad.

## 3. Modes of play
- **Standard game**: 3 balls (setting: 3 or 5), single player, local high-score table.
- **Practice**: unlimited ball saves, no high score (settings toggle). 
- **Attract**: light show, DMD fact rotation and high scores when idle on the title.

## 4. Rules
### 4.1 Table features
| Feature | What it is | Scores |
|---|---|---|
| S·P·A top lanes | 3 rollovers; flippers rotate the lit lanes | 1,000 each; all 3 → bonus multiplier +1 (max 5×), lanes reset |
| Skill shot | one lane lit at plunge | 25,000 (+25,000 per skill shot this game, max 100,000) |
| Thermal Springs | 3 pop bumpers (Display Spring, Spring No. 46, Hot Water Cascade) | 500 + 10 × temperature; each hit +1 °F from 100 °F; at 143 °F the springs "boil": value doubles for 30 s, then the temperature resets to 120 °F |
| Bathhouse Row | 8 standup targets, Superior → Lamar | 3,000 each lit (unlit 500); completing the Row lights **Grand Soak** at the Vapors and shows each bathhouse's fact once |
| Mountain Tower ramp | ramp, turnaround, wire to the right inlane | 10,000 + 5,000 per tower level; 3 ramps raise the tower a level (Woolman, Rix, Mountain Tower); each level lights the lock once |
| Central Avenue orbit | left orbit with spinner | orbit 7,500; spinner 100 per spin; spins fill the **Fifth Season** meter (300 spins → extra ball lit) |
| Reserve Street lane | the right channel up beside the ramp | 5,000; a combo shot |
| The Vapors | scoop | starts the next mode (or the lit Grand Soak / wizard); otherwise a mystery award; 5,000 |
| Arlington lock | centre saucer behind the Row | when lit, locks a ball (3 locks start **Arlington Multiball**); otherwise 2,500 and kicks out |
| Slingshots | | 110 |
| Inlanes / outlanes | | 1,000 / 5,000 |
| Combos | ramp, orbit or Reserve within 3 s of another major shot | 20,000 × combo count |

### 4.2 Modes (started at the Vapors, in order; one at a time, 40 s each unless stated)
| # | Mode | Goal | Award |
|---|---|---|---|
| 1 | **Bathhouse Soak** | A lit target moves along the Row each 3 s; hit 6 lit bathhouses ("a course of baths") | 15,000 per bath, 50,000 completion |
| 2 | **Derby Day** | Ramps, orbits and Reserve shots advance your fictional horse against three rivals on the DMD; finish first | 25,000 per advance, 150,000 for a win |
| 3 | **Raid! 1967** | Troopers search the clubs: bank targets light as "hidden slot machines"; hit 3, then the Vapors to collect a hurry-up counting down from 200,000 | hurry-up value |
| 4 | **Tower Climb** | 3 ramp shots climb Woolman → Rix → Mountain Tower (216 ft) | 40,000 × level, 100,000 at the top |
| 5 | **Tub Race** | Alternate left and right shots (orbit ↔ ramp/Reserve) 5 times | 30,000 per leg |
| 6 | **Coaster Hill** | Spinner and orbit laps; 4 laps | 35,000 per lap |
Finishing (or timing out of) a mode marks it played; completing it marks it **won**. Three played modes light
the extra ball at the Vapors once. All six played lights the wizard mode.

### 4.3 Multiballs
- **Arlington Multiball** (3 balls): ramps light the lock; 3 locks start it. Jackpot at the ramp (lit after any
  orbit), 75,000 rising by 25,000. 15 s ball save.
- **Grand Soak** (2 balls): from a completed Row. Every bathhouse target is a jackpot (20,000 × balls in play);
  the Vapors scores a super jackpot when all 8 are re-hit.
- **Valley of the Vapors** (wizard, 3 balls, 60 s): every shot lit, values double each 10 s, a final shot at the
  Vapors collects. The nickname is real; the "neutral ground" story is labelled legend if shown.

### 4.4 Ball and game
Ball save 10 s per ball; tilt (3 warnings); extra balls (shoot again); end-of-ball bonus = (bathhouses × 2,000 +
tower levels × 10,000 + modes played × 15,000 + spins × 10) × bonus multiplier; match (last two digits, free
"replay" credit shown); top-10 high scores with 3-letter initials.

### 4.5 Mystery award (the Vapors, slot-reel animation on the DMD)
Seeded draw from: 10,000 · 25,000 · light lock · +10 °F springs · advance tower · light extra ball (rare) ·
ball save 15 s · bonus +1×. Reel symbols are original (cherries, bells, horseshoes, a steam cloud), no real
machine's art.

## 5. Hot Springs content map
All facts from `research/town-content.md` (sources and hedges there).
| Where | Content |
|---|---|
| Bank targets | the eight bathhouses in Row order, each with a façade toy and one callout (Superior 1916 … Lamar 1923) |
| Pop bumpers | spring names, 143 °F, 47 springs, ~4,400-year-old water |
| Ramp | Woolman tower 1877, Rix tower, Mountain Tower 216 ft (1983) |
| Orbit | Central Avenue; Oaklawn "since 1904/05", first Arkansas Derby 1936, the "Fifth Season" |
| Vapors | opened 1960; the August 1967 state police raids (slots seized, crushed and burned at a gravel pit) |
| Lock | the Arlington (rebuilt in 11 months; Capone room 443 only as "reportedly") |
| Attract | reserved April 20, 1832; national park 1921; "The American Spa"; "Valley of the Vapors" |
Rules: no logos, no endorsement, no real living people, legend always labelled, mechanics never presented as
historical simulation (`research/00-INDEX.md`, `game-hooks.md`).

## 6. Screens and flow
Title (attract) → Play / Settings / Help / High scores → game (table + DMD + backglass) → pause → end of ball
bonus → game over → match → initials → high scores → title.
- Desktop (landscape): table centred at full height, backglass painting left, DMD and score panel right.
- Phone (portrait): DMD strip above the table; the table fills the rest; on-screen hints for touch.
- Phone landscape: table centred, DMD at the side.

## 7. Art direction
Gilded-spa daytime playfield art (cream brick, marble, red tile, Maurice green, brass) under deco-neon
lighting (midnight, deco gold, neon red and blue) with thermal-water teal for the springs and motor-hotel
turquoise and coral for the Vapors (`shared/design/tokens.css`, `research/visual-style-guide.md`).
Painted playfield, backglass and plastics by Codex from Blender layout renders; 3D toys modelled in Blender
(bathhouse façades, Mountain Tower, bumper caps, flippers, ramp and wireform, Vapors sign, Arlington). PBR
materials, a chrome ball reflecting the room, lamp bloom, soft shadows, steam particles.

## 8. Audio direction
WebAudio synthesis only: coil thunks, rubber pops, bumper "spring" chimes with a steam hiss, spinner ticks,
ramp rumble, saucer kicks, a jazzy synthesized loop per mode (title, main, multiball, wizard), DMD callout
stingers. Volume, sound and music settings.

## 9. Accessibility
Keyboard-only play; contrast ≥ 4.5:1 for UI text; lamp language uses shape plus colour (arrows, stars,
circles); `prefers-reduced-motion` and a motion setting disable shake, slow motion and full-screen flashes;
no strobe faster than 3 Hz; text scale setting; screen-reader labels for menus and a live region for score and
callouts; adjustable flipper keys.

## 10. Performance budgets
60 fps on a mid-range laptop (High tier, real GPU); playable on a phone (Low tier, SwiftShader floor ≥ 30 fps
of sim-correct play); `index.html` ≤ 2 MB, lazy asset packs ≤ 6 MB total; interactive in ≤ 2 s; zero network
requests; works from `file://`.

## 11. Acceptance criteria
### Physics
- **AC1** 4,000 seeded random drops all drain: none escape, none stick for 4 s, none end inside a wall.
- **AC2** No tunnelling: balls fired at 6.5 m/s at every wall, post and flipper stay inside the table.
- **AC3** Every major feature (ramp, orbit/spinner, Reserve lane, Vapors, lock, all 8 bathhouses, top lanes) is
  reached from both flippers across inlane, drop and cradle feeds (`tools/shot-map.mjs`).
- **AC4** A held flipper cradles a ball coming down the inlane within 1.5 s; releasing it lets the ball roll off.
- **AC5** Sim is deterministic: the same seed and timed inputs give identical state after 60 s.
- **AC6** Flip timing applies to the substep (≤ 1.1 ms), not the tick.
- **AC7** A full plunge reaches the top arch; a soft plunge falls back to the plunger or into the field.
### Rules
- **AC8** Ball lifecycle: serve, ball save, drain, bonus, next ball, game over after the last ball.
- **AC9** Skill shot awards only for the lit lane within 4 s of the plunge.
- **AC10** S·P·A lane change follows the flipper buttons; completion raises the bonus multiplier to at most 5×.
- **AC11** Pop bumpers raise the spring temperature and boil at 143 °F as specified.
- **AC12** All 8 bathhouses complete the Row and light Grand Soak; targets show their facts.
- **AC13** Ramps raise the tower every 3 and light the lock; 3 locks start Arlington Multiball with 3 balls.
- **AC14** Each of the 6 modes starts at the Vapors, runs its timer, can be completed, and scores as specified.
- **AC15** Grand Soak and the wizard mode start and end correctly (multiball ends at one ball).
- **AC16** Tilt: warnings then tilt; tilted ball scores no bonus; the next ball plays normally.
- **AC17** Ball search frees a ball still for 5 s.
- **AC18** Extra ball, match and high-score entry work; scores persist across reloads.
- **AC19** Mystery award draws are seeded and every award applies its effect.
### Presentation
- **AC20** Title, help, settings, pause, game over, initials and high scores screens exist and are reachable by
  keyboard, touch and gamepad.
- **AC21** DMD shows score, ball, callouts, mode status and animations legibly at both viewports.
- **AC22** 3D table renders with bloom on lit inserts, shadows, chrome ball, steam on the springs, all toys.
- **AC23** Lamps reflect rules state (lit targets, lock, modes, multiplier) with shape-coded inserts.
- **AC24** Light shows play on attract, mode start, multiball and wizard.
- **AC25** Sounds play for every switch kind; music per scene; sound and music settings work.
- **AC26** Settings persist: sound, music, volume, motion, balls per game, quality tier.
### Platform
- **AC27** Desktop 1280×800 and phone 390×844 layouts have no overflow; touch targets ≥ 44 px.
- **AC28** Touch flippers and plunger work on the phone viewport; keyboard and gamepad on desktop.
- **AC29** Reduced motion: no shake, no slow motion, no full-screen flashes; nothing strobes above 3 Hz.
- **AC30** UI text contrast ≥ 4.5:1.
- **AC31** 60 fps High tier on a real GPU; Low tier works on SwiftShader; quality tier switch works.
- **AC32** Zero console errors, zero network requests, works from `file://`.
- **AC33** `index.html` ≤ 2 MB; interactive in ≤ 2 s.
- **AC34** Runs with `localStorage` blocked.
- **AC35** Every shown fact has a source key (`tools/check-facts.mjs`).

## 12. Out of scope
Multiplayer (2–4 players), online leaderboards, a table editor, more than one table, real-money or
gambling mechanics (the slot reel is a cosmetic award animation), VR, licensed music.
