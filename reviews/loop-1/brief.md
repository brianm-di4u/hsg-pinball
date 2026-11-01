# Critic brief: loop 1

You are an independent, deliberately harsh visual critic reviewing **Spa City Pinball**, a browser (three.js) pinball
game: an original top-down 2.5D table set on Bathhouse Row in Hot Springs, Arkansas, with painted art, modelled toys,
glowing lamps, a DMD and a backglass. Judge it against shipped digital pinball (Pinball FX / Zen tables, Pro Pinball,
good Visual Pinball X tables, real machines under their GI). Inflated scores waste the developer's time; deflated
ones without evidence get thrown out by the judge. Be exact and cite.

You have not seen any earlier score, any other reviewer, or the developer's opinion. Don't look for them:
`games/Pinball/reviews/HISTORY.md`, `games/Pinball/reviews/history.json`, any `ab-key.json`, and every other
`games/Pinball/reviews/loop-*/` folder are off limits.

## Read first
- Rubric: `games/Pinball/reviews/RUBRIC.md` (anchors, gates, evidence rule).
- Output schema: `games/Pinball/reviews/schema.json`.

## What to review
Captures were made on a real GPU in headless Chrome at 1280×800 desktop and 390×844@2× phone (plus one 844×390
phone landscape frame). Root: `games/Pinball/screenshots/review-loop-1/`.

| Capture | Moment | Main categories |
|---|---|---|
| `desktop/c01-row` | close-up: Bathhouse Row targets and toys, lock lane | toys, authenticity |
| `desktop/c02-springs` | close-up: thermal-spring bumpers and S·P·A lanes | toys, lighting |
| `desktop/c03-flippers` | close-up: flippers, slingshots, inserts | toys, art |
| `desktop/c04-vapors` | close-up: the Vapors scoop and sign | toys, authenticity |
| `desktop/c05-tower` | close-up: Mountain Tower ramp, wireform, tower | toys |
| `desktop/c06-arlington` | close-up: the Arlington and lock | toys, authenticity |
| `desktop/r01-title` | title screen over the attract demo | ui, typography, art |
| `desktop/r02-serve` | ball served, skill shot lit | ui, readability |
| `desktop/r03-play` | mid-game with progress lit | art, lighting, readability |
| `desktop/r04-bumpers` | ball in the pop bumpers | lighting, animation |
| `desktop/r05-ramp` | ball on the Mountain Tower ramp | toys, readability |
| `desktop/r06-multiball` | Arlington Multiball, three balls | readability, animation |
| `desktop/r07-mode` | a mode (Derby Day) with its DMD | ui, authenticity |
| `desktop/r08-wizard` | wizard mode light show | lighting |
| `desktop/r09-help` | how-to-play screen | typography, ui |
| `desktop/r10-scores` | high scores | typography, ui |
| `mobile/r01-title` | title screen over the attract demo (phone) | mobile, ui, typography, art |
| `mobile/r02-serve` | ball served, skill shot lit (phone) | mobile, ui, readability |
| `mobile/r03-play` | mid-game with progress lit (phone) | mobile, art, lighting, readability |
| `mobile/r04-bumpers` | ball in the pop bumpers (phone) | mobile, lighting, animation |
| `mobile/r05-ramp` | ball on the Mountain Tower ramp (phone) | mobile, toys, readability |
| `mobile/r06-multiball` | Arlington Multiball, three balls (phone) | mobile, readability, animation |
| `mobile/r07-mode` | a mode (Derby Day) with its DMD (phone) | mobile, ui, authenticity |
| `mobile/r08-wizard` | wizard mode light show (phone) | mobile, lighting |
| `mobile/r09-help` | how-to-play screen (phone) | mobile, typography, ui |
| `mobile/r10-scores` | high scores (phone) | mobile, typography, ui |
| `mobile/r11-landscape` | phone landscape in play (phone) | mobile, mobile |
| `strips/s01-flip` | strip: a left-flipper shot | animation |
| `strips/s02-bumpers` | strip: the ball in the bumpers | animation, lighting |
| `strips/s03-multiball` | strip: Grand Soak multiball launch | animation |

Contact sheets for a first sweep (the full-size files stay the evidence): `sheets/desktop-01.png`, `sheets/desktop-02.png`, `sheets/desktop-03.png`, `sheets/desktop-04.png`, `sheets/desktop-05.png`, `sheets/desktop-06.png`, `sheets/desktop-07.png`, `sheets/mobile-01.png`, `sheets/mobile-02.png`.


- **Frames** (`desktop/R*.png`, `mobile/R*.png`): the game as the player sees it.
- **Close-ups** (`desktop/C*.png`): the table through a close camera, to judge asset quality.
- **Strips** (`strips/S*.png`): 8 consecutive moments a few sim ticks apart. **Judge animation from these.**

## A/B comparison
30 pairs in `screenshots/review-loop-1/ab/`. Each image shows the same moment from two builds, **A** on the left and **B** on the right. One is this loop's build and the other the previous loop's; which is which is hidden from you, and A is the same build in every pair. Files: `ab/desktop-c01-row`, `ab/desktop-c02-springs`, `ab/desktop-c03-flippers`, `ab/desktop-c04-vapors`, `ab/desktop-c05-tower`, `ab/desktop-c06-arlington`, `ab/desktop-r01-title`, `ab/desktop-r02-serve`, `ab/desktop-r03-play`, `ab/desktop-r04-bumpers`, `ab/desktop-r05-ramp`, `ab/desktop-r06-multiball`, `ab/desktop-r07-mode`, `ab/desktop-r08-wizard`, `ab/desktop-r09-help`, `ab/desktop-r10-scores`, `ab/mobile-r01-title`, `ab/mobile-r02-serve`, `ab/mobile-r03-play`, `ab/mobile-r04-bumpers`, `ab/mobile-r05-ramp`, `ab/mobile-r06-multiball`, `ab/mobile-r07-mode`, `ab/mobile-r08-wizard`, `ab/mobile-r09-help`, `ab/mobile-r10-scores`, `ab/mobile-r11-landscape`, `ab/strips-s01-flip`, `ab/strips-s02-bumpers`, `ab/strips-s03-multiball`.

For each of the 9 categories, say which build is better on the evidence of the pairs that bear on it (`A`, `B` or
`tie`) with a confidence (0–1) and the pairs you used. Call a tie when the difference is within noise.

## What changed this loop (facts only)
- Phone landscape: the table takes the width and the camera tilts back toward a player's view on wide canvases; a slim side panel holds the DMD, score and buttons.
- Phone portrait: a small score plate stays visible in the dark corner above the arch while the DMD shows callouts; the Launch button moved over the apron, left of the shooter lane.
- Help: touch controls listed first on phones; the Back button is pinned to the bottom of the dialog while the body scrolls.
- Ball: brighter reflection map (a reflection-only light ceiling above the table), higher reflection strength; softer, fainter steam sprites.
- Lamps: halos about 40% smaller and dimmer; Bathhouse Row inserts warm cream instead of white.
- Outer rail caps changed from mirror chrome to brushed brass (removes the rail glare streak).
- Contact shadows: soft dark footprints under bumpers, posts, targets, flippers, slingshots and the landmark toys.
- Landmarks: the Arlington's twin towers stand twice as tall behind the lock; the Mountain Tower moved out of the ramp turnaround to the dead area right of the ramp mouth at about 2.7× its height; the Vapors sign enlarged about 1.7×.
- Playfield lettering: bathhouse, mode and multiplier labels larger, on dark backing plates; Superior's label moved clear of the scoop.
- Bumper cap decal redrawn in a bold face; spinner flag carries a symmetric diamond motif instead of words.
- DMD: plain callouts limited to two lines with the second line scrolling; wizard and multiball intros show the objective (the Arlington fact follows separately, hedged "about 11 months"); dithered mode paintings slide in beside mode and multiball titles.
- Apron: enamel with gold trim, two instruction cards and a dark drain notch.
- Close-up C05 now frames the Mountain Tower beside the ramp.

## Measured gates
```json
{
  "loop": 1,
  "perf": {
    "pass": true,
    "desktop": {
      "k": "desktop-gpu",
      "fps": 60.1,
      "taskMs": 3.56,
      "tier": "high"
    },
    "throttled": {
      "k": "phone-throttled",
      "fps": 43.2,
      "taskMs": 5.46,
      "tier": "high"
    },
    "swiftshader": {
      "k": "phone-swiftshader",
      "fps": 60.3,
      "taskMs": 1.82,
      "tier": "low"
    }
  },
  "ip": {
    "pass": true,
    "hits": [],
    "note": "paintings checked by eye for text (art-src/PROMPTS.md)"
  }
}
```

## Write
1. A verdict in one paragraph.
2. For each of the 9 categories: the score, then why, citing captures by path (for example `desktop/R03-play`,
   `desktop/C01-row`, `strips/S02-bumpers`).
3. The IP check: anything resembling a commercial pinball machine's name, logo or art, or text inside the paintings.
4. Ranked gaps: the specific visual defects costing the most points, each with a concrete, testable fix, an expected
   gain, a severity (1–5) and an effort (S/M/L), and a workstream: WS1 render, lighting and materials; WS2 toys and
   models; WS3 animation and effects; WS4 playfield art and layout; WS5 UI, DMD and typography; WS6 mobile and
   framing; WS7 performance.
5. **The last thing in your reply:** one fenced ```json block per schema.json, with `"role": "critic-claude (Critic A) or critic-codex (Critic B), as assigned"`,
   `"loop": 1`, `"tier": "high"`, `ab` (from loop 1 on) and `ip`.

Don't edit any file. Reply with the review only.
