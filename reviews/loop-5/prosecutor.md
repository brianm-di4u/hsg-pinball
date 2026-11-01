# Prosecutor: loop 5

Both critics land on 59.5. Each is 0.5 or more too generous in most categories. Each critic noticed some of the faults below, but neither scored them. Other faults turned up only once I opened the close-ups and single strip frames, or measured pixels.

1. **The headline lighting change does not show in the stills.** Mode, multiball and wizard frames are barely darker than normal play.
2. **The ramp has visible construction seams.**
3. **The slingshots are primitive blocks.**
4. **The frames sold as "ball in the bumpers" show neither the ball in the bumpers nor any bumper reaction.**
5. **The help screen hides text** while half its width stays empty.

Critic means: art 6.75, toys 6.5, lighting 6.5, animation 6.5, ui 7.0, typography 6.25, readability 6.5, mobile 6.25, authenticity 7.25.

## Art: argue down to 6.0 (mean 6.75)

Codex's 7 is generous. The anchor-7 test is "painted art composed around the layout, every zone themed, inserts and lettering integrated". The captures show several anchor-5 traits: art in rectangles unrelated to the layout, and empty patches.

- **The slingshots are flat fills.** In `desktop/c03-flippers` both sling plastics are plain coral and plain teal triangles, with one diagonal sheen and no artwork. That is the anchor-3 "flat colour fills" trait, on the two parts the player looks at most.
- **The bathhouse lamp plates are blank.** In `desktop/c01-row` the eight plates in front of the Row are plain rectangles, either lit white or dull khaki. The names sit on separate black tags beside them, so the inserts are not integrated with their lettering.
- **The garden painting ignores the layout.** In `desktop/c02-springs` and `strips/s02-bumpers`, the bumpers sit on a generic garden illustration: foliage, a stone gazebo at top centre where there is no shot, and a waterfall and pool under the S·P·A lane guides.
- **The field is two pictures with a seam.** In `desktop/r03-play` the garden stops at a balustrade line and the deco terrazzo floor begins. The ramp covers painted art with no relation to it.
- **The apron is plain cards.** In `desktop/r02-serve` the apron cards are cream text cards on navy, with no art.
- **The backglass is strong** (`desktop/r02-serve`) and in the same hand as the upper field. It is the only reason this is not lower.

## Toys: argue down to 6.0 (mean 6.5)

- **Ramp construction is visibly faulty** (`desktop/c05-tower`, zoomed).
  - Two transverse seam lines cross the ramp floor, one at the bend and one about two-thirds down.
  - At the lower seam the left wall steps inward, so the wall segments do not meet.
  - The walls carry a regular white "zipper-tooth" stripe pattern that reads as a texture artefact, not flange highlights.
  - The ends drop onto plain dark-brown blocks.
  - Neither critic recorded the seams.
- **The sling assemblies are boxes.** In `desktop/c03-flippers` each sling is an off-white rectangular block with two black holes, like a face, plus a flat brown cap slab. There is no rubber band, no posts and no plastic thickness. This is the anchor-3 "primitive boxes" trait on a core toy.
- **The Arlington is perched on the lock gate.** In `desktop/c06-arlington` and `desktop/c02-springs` it sits directly on the gold crossbar of the gate behind the lock hole. It has no base, no ground contact and no shadow, as if balanced on a pipe.
- **The guides read as plumbing.** In `desktop/c04-vapors` and `desktop/c06-arlington`, the gold walls are thick round tubes with flat-cut ends on white donut rubbers over brown blocks.
- **The buildings sit on identical cream plinths** (`desktop/c01-row`). In the close-up (`desktop/c06-arlington`) the windows are flat yellow squares with no visible sills or glazing bars, although this loop's brief says it added them.
- **The ball reads as a lamp, not chrome.** In `desktop/s02-bumpers-0` it is a translucent peach orb with a halo. In `strips/s01-flip` it is a glowing white blob in every frame.
- **The Vapors model is mostly a white box with a sign** (`desktop/c04-vapors`). The stone wing, breeze-block screen and glazed lobby named in the change list cannot be seen from the play camera.
- **In credit:** the wireform and the lattice tower (`desktop/c05-tower`), and the bumper caps (`desktop/c02-springs`).
- At least five named toys show anchor-5 or worse traits: ramp, slings, guides, plinths and ball. 6.5 overstates this.

## Lighting: argue down to 6.0 (mean 6.5)

**The mood darkening is not in the captures.** I measured median luma on unlit art patches in the desktop frames:

| Patch | `r03-play` | `r07-mode` | `r06-multiball` | `r08-wizard` |
|---|---|---|---|---|
| Lower-left terrazzo | 69 | 67 | 64 | 61 |
| Lower-right terrazzo | 71 | 69 | 66 | 64 |
| Upper garden | 76 | 72 | 69 | 67 |
| Left outlane | 77 | 74 | 70 | 67 |

- These are frame luma ratios of about 0.96 for the mode, 0.92 for the multiball and 0.88 for the wizard.
- Even allowing for gamma, the stated levels should give luma ratios of about 0.88 (mode at 75% light), 0.76 (multiball at 55%) and 0.62 (wizard at 35%). Every frame misses its target.
- Critic A found the same on the phone frames. Codex wrote "Mode darkness helps", and the numbers do not support that.

**The darkening is inconsistent.** The Grand Soak strip *is* visibly dark (`strips/s03-multiball` and `desktop/s03-multiball-0`), but Arlington Multiball (`desktop/r06-multiball`) is not.

**Glare.** The anchor-7 rule is "no glare". The captures show:
- Lit bathhouse plates blown to white (`desktop/c01-row`).
- A white glare bar across the CENTRAL AVENUE plate (`desktop/c04-vapors`, top left).
- A stray horizontal white streak, probably the spinner flag edge-on, at the left orbit (`desktop/r03-play`, about x 462–492, y 270).
- The wizard star blooming over the VALLEY OF THE VAPORS label (`desktop/r08-wizard`).
- Lit bumper caps where the "143°F" decal melts into an orange-red smear (`desktop/s02-bumpers-0`, bottom and right caps).

**Light leaks off the machine.** In `desktop/s03-multiball-0` an orange glow lights the black void beyond the cabinet's top-right corner, and a blue haze sits off its left side. It reads as light with nothing to fall on.

**Grounding is weak.** Buildings, the Arlington and bumper bodies show no contact shadow (`desktop/c06-arlington`).

**In credit:** inserts bloom only when lit, and the GI is warm (`desktop/r03-play`).

## Animation: argue down to 6.0 (mean 6.5)

The anchor-7 list names five things: flippers snap, bumpers flash *and drop*, steam rises, light shows run, and the camera reacts to nudges. The captures show three of them.

- **Flippers snap.** In `strips/s01-flip` the left flipper is down in frames 0–2 and fully up in frame 3, then holds through frame 7. There is no anticipation, flex or recovery.
- **Bumpers flash but do not drop.** In `strips/s02-bumpers` the caps light and unlight. Comparing `desktop/s02-bumpers-0` with `desktop/s02-bumpers-5`, I can see no ring or skirt displacement.
- **The bumper frames show no bumper action.** `desktop/r04-bumpers` and `mobile/r04-bumpers`, which the capture index calls "ball in the pop bumpers", show the ball above the bumpers at the top arch, with all three caps in the same idle state. The frames meant to sell bumper action show none.
- **The camera never reacts** in any strip, including the multiball launch (`strips/s03-multiball`).
- **Phone steam is still bubble dots** (`mobile/r07-mode`, `mobile/r08-wizard`, `mobile/r11-landscape`). In landscape they float in the black void above the table.
- **In credit:** the light show in `strips/s03-multiball` is real, and the desktop steam puffs are better than before.
- With two of the five anchor behaviours absent and no follow-through anywhere, this is 6.0, not 6.5.

## UI: argue down to 6.5 (mean 7.0)

The anchor-7 rule includes "nothing overlapping" and "menus in the same deco style".

- **The phone HUD chip overlaps the cabinet.** In `mobile/r02-serve` and `mobile/r03-play` the "Modes 0/6 · Tower 0/3" chip (y about 215–258) overlaps the table's top cabinet rail (which starts at about y 245). Steam sprites drift over the chip and up into the DMD zone.
- **The help screen hides text it has room for.** In `desktop/r09-help` the left column is cut off mid-sentence at "Central Avenue orbit… the Fifth Season meter for an extra ball" under the fade. The right column ends at about y 480, leaving roughly 220 px of empty panel. The text could fit with balanced columns. `mobile/r09-help` cuts "The Vapors scoop starts modes, collects…", and neither viewport shows a scroll cue.
- **The DMD shows stale content behind menus.** In `desktop/r10-scores` and `mobile/r10-scores` the attract DMD behind the High scores menu still reads "VALLEY OF THE VAPORS / ALL SHOTS LIT".
- **The desktop right column is mostly empty.** In `desktop/r03-play` it holds a DMD, three hint lines and a Menu button over about 450 px of navy.
- **The menu buttons are plain.** In `desktop/r01-title` and `mobile/r01-title` they are rounded rectangles in a system sans. Only the frame and the Play button carry the deco gold.
- **In credit:** the DMD art (horse, towers, mountain) in `desktop/r07-mode` and `desktop/r06-multiball` is genuinely good.
- 7.0 asks for nothing overlapping, and the captures show overlaps.

## Typography: argue down to 6.0 (mean 6.25)

- The display faces are deliberate: the title lockup and the slab headings (`desktop/r01-title`, `mobile/r09-help`).
- **Everything else is a stock system sans:** buttons, HUD, high-score table and help body (`mobile/r10-scores`, `desktop/r09-help`).
- **Playfield type fails at play scale.** In `desktop/r03-play` (zoomed), the mode labels SOAK, DERBY, RAID and so on are about 4 px tall. The green EXTRA BALL on brown is illegible, and the bathhouse name tags are unreadable. The apron cards in `desktop/r02-serve` are blurred serif at about 6 px.
- **Names are lost close up too.** In `desktop/c01-row` SUPERIOR is truncated to "SU" against the HALE tag. Lit plates erase their neighbours, and the "143°F" bumper decals smear when lit (`desktop/s02-bumpers-0`).
- **The Vapors is labelled twice, and one label is unreadable.** "THE VAPORS" appears on a playfield tag *and* on the marquee in `desktop/c04-vapors`, and the marquee version is pale cyan on cyan bloom.
- 6.0 is Codex's score, and the evidence supports it over 6.5.

## Readability: argue down to 6.0 (mean 6.5)

- **The ball nearly disappears in the action frames.**
  - In `desktop/r04-bumpers` it is an 8 px dot at the top arch against dark art. It took a search to find.
  - In `desktop/r05-ramp` it is a pale dot on the pale ramp at about x 785, y 237, nearly invisible. Codex saw the same on `mobile/r05-ramp`.
  - In `desktop/r06-multiball` one of the three balls is a tiny dot at the top arch.
- **The desktop table is small.** It spans x 410–870 of 1280 (36%), so everything on desktop is small.
- **The wizard frame blurs its own message.** In `desktop/r08-wizard` the star bloom swallows the VALLEY OF THE VAPORS label, and the six mode inserts merge into one violet band. The frame meant to read "all shots lit" is harder to read than normal play.
- **In credit:** the shot arrows mark entrances clearly, and lit and unlit inserts differ clearly (`mobile/r03-play`).
- The anchor-7 rule is "the ball always stands out". Three of the six desktop action frames fail it.

## Mobile: argue down to 6.0 (mean 6.25)

- **Portrait is purposeful.** In `mobile/r03-play` the DMD is on top and the apron buttons sit clear of the ball.
- **Portrait also has faults.**
  - The HUD chip overlaps the cabinet (`mobile/r02-serve`).
  - Steam rises out of the table into the DMD band.
  - The lone ☰ button leaves the apron lopsided during play (`mobile/r03-play`).
  - All playfield labels are illegible at 390 px.
- **Landscape is not framed on purpose** (`mobile/r11-landscape`):
  - About the top 19% of the viewport is black, with steam dots floating in it.
  - The cabinet's bottom rail is cropped at the bottom edge.
  - About 60% of the right HUD column is empty below Menu.
  - The DMD is small, and there is no touch-zone cue.
- The anchor-7 rule asks for "portrait and landscape". Landscape fails, so I side with Codex's 6.0.

## Authenticity: argue down to 7.0 (mean 7.25)

- **What meets the anchor:**
  - The order Superior → Lamar is correct (`desktop/c01-row`).
  - The facts are hedged (`desktop/r09-help`: "about", "reportedly", the no-affiliation line; 1832 against Yellowstone's 1872 is right).
  - The lattice tower, Arlington towers, Derby Day, RAID! 1967 and Reserve St ground the place.
- **Codex's 7.5 ignores what the player actually sees.**
  - At play scale the Row is a strip of 30 px cream boxes whose names cannot be read (`desktop/r03-play` zoomed, `mobile/r03-play`).
  - The Vapors reads as a white box with an unreadable cyan sign (`desktop/c04-vapors`, `mobile/r08-wizard`). Its supper-club features cannot be seen.
  - The top third is a generic garden with a gazebo, not the Grand Promenade or the Arlington lawn (`desktop/c02-springs`).
  - The Arlington is perched on the lock gate in mid-table (`desktop/c06-arlington`), not set as the anchor at the head of Central Avenue.
- Recognisable in close-up, but not in play: 7.0.

## IP check

I checked this myself.
- **No commercial pinball names, logos or art.** The title "Spa City Pinball" is original, and the deco lockup copies no machine's logo.
- **No text in the paintings.** I zoomed the backglass (`desktop/r02-serve`, x 200–400): its neon canopy, domed bathhouse and tower carry no lettering. The playfield paintings in `desktop/c02-springs` and `desktop/c03-flippers` carry none either. All lettering is overlay: "SPA CITY", tags, inserts and apron cards.
- **Two low-risk real names.** "The Arlington" (a hotel still operating) and "The Vapors" (a name I believe a Hot Springs venue still uses) appear as place names only, with no logos. The marquee's pink script "The" plus block "VAPORS" is generic, and it should stay generic rather than drift toward the historic sign's lettering.
- **Clean.**

## Gaps the critics missed

1. **G-ramp-seams** (toys, WS2, severity 3, effort M, expected gain +0.3)
   - Problem: two transverse seams and a stepped wall join in `desktop/c05-tower`.
   - Fix: loft the ramp as one continuous mesh with mitred walls, and replace the zipper-tooth wall texture with a single edge highlight.
   - Test: no seam line and no wall offset visible in C05.
2. **G-sling-assembly** (toys, WS2, severity 3, effort M, expected gain +0.3)
   - Problem: the slings are white boxes with two holes and flat plastics (`desktop/c03-flippers`).
   - Fix: model a rubber band between chrome posts, give the plastic thickness, and print themed art on it.
   - Test: in C03 a rubber band and at least two posts are visible per sling, and the plastic carries non-flat art.
3. **G-arlington-base** (toys, WS2, severity 2, effort S, expected gain +0.2)
   - Problem: the Arlington is balanced on the lock-gate crossbar (`desktop/c06-arlington`).
   - Fix: seat it on a terrace or plinth behind the gate, or turn the gate into its porte-cochère.
   - Test: in C06 the building meets a ground surface and casts a contact shadow.
4. **G-mood-dim-inconsistent** (lighting, WS1, severity 4, effort S, expected gain +0.5)
   - Problem: the measured desktop luma ratios are about 0.96, 0.92 and 0.88, and Grand Soak darkens while Arlington Multiball does not (`desktop/r06-multiball`, `desktop/r07-mode`, `desktop/r08-wizard`, `strips/s03-multiball`).
   - Fix: drive one mood scalar for every multiball and mode, applied to ambient, hemisphere and environment intensity.
   - Test: unlit-patch luma relative to R03 is at most 0.88 in R07, at most 0.76 in R06 and at most 0.62 in R08.
5. **G-lamp-spill-void** (lighting, WS1, severity 2, effort S, expected gain +0.2)
   - Problem: lamp glow lands on the black void beside the cabinet (`desktop/s03-multiball-0`).
   - Fix: clamp the light distance, exclude the background, or add cabinet side walls.
   - Test: pixels outside the cabinet silhouette in all S03 frames stay at luma 12 or below.
6. **G-lit-decal-wash** (lighting, WS1, severity 2, effort S, expected gain +0.2)
   - Problem: lit bumper caps smear "143°F" (`desktop/s02-bumpers-0`), and the spinner glints as a white bar (`desktop/r03-play`).
   - Fix: mask the emissive under the decals and cap the spinner's specular.
   - Test: "143°F" is legible on every lit cap in S02, and there is no white streak at the left orbit in R03.
7. **G-ball-contrast** (readability, WS1, severity 3, effort S, expected gain +0.3)
   - Problem: the ball is near-invisible in `desktop/r04-bumpers` and `desktop/r05-ramp`.
   - Fix: give the ball a dark-rimmed chrome environment and a soft contact shadow, and drop its emissive halo.
   - Test: ball-to-background luma contrast is at least 3:1 at the ball's position in R04 and R05 (desktop).
8. **G-bumper-frame-proof** (animation, WS3, severity 2, effort S, expected gain +0.2)
   - Problem: the r04 frames show neither the ball in the bumpers nor a lit cap (`desktop/r04-bumpers`, `mobile/r04-bumpers`).
   - Fix: add a visible bumper hit reaction (cap flash plus ring drop) that holds for at least 4 frames, so a still can catch it.
   - Test: R04 on both viewports shows the ball touching a bumper with that bumper lit.
9. **G-help-columns** (ui, WS5, severity 2, effort S, expected gain +0.3)
   - Problem: the left help column is cut off while about 220 px of the right column is empty (`desktop/r09-help`).
   - Fix: balance the two columns, moving Central Avenue and the Vapors items right, and add a scroll cue on phone.
   - Test: all help text is visible without scrolling at 1280×800, and `mobile/r09-help` shows a scroll indicator.
10. **G-hud-chip-overlap** (mobile, WS6, severity 2, effort S, expected gain +0.2)
    - Problem: the chip overlaps the cabinet top, and steam escapes the table (`mobile/r02-serve`, `mobile/r03-play`).
    - Fix: reserve a row above the table for the chip, and clip steam sprites to the playfield bounds.
    - Test: the chip and table boxes do not intersect in R02, and no steam pixel shows above the table's top edge.
11. **G-stale-dmd** (ui, WS5, severity 1, effort S, expected gain +0.1)
    - Problem: the wizard message shows on the DMD behind High scores (`desktop/r10-scores`, `mobile/r10-scores`).
    - Fix: the attract DMD shows the score table or the title while a menu is open.
    - Test: no mode text on the DMD in R10.
12. **G-vapors-facade-visible** (authenticity, WS2, severity 3, effort M, expected gain +0.3)
    - Problem: the supper-club features cannot be seen from the play camera (`desktop/c04-vapors`, `desktop/r03-play`).
    - Fix: turn and raise the Vapors so the canopy, breeze-block screen and glazed lobby face the player.
    - Test: in C04 the breeze-block screen and canopy are distinguishable, and in R03 the Vapors reads as more than a white box.

**Proposed total: 55.5 / 90**

```json
{
  "loop": 5,
  "role": "prosecutor",
  "tier": "high",
  "scores": {
    "art": { "score": 6.0, "confidence": 0.65, "evidence": [
      { "shot": "desktop/c03-flippers", "note": "sling plastics are flat coral/teal fills with no artwork (anchor-3 trait)" },
      { "shot": "desktop/c01-row", "note": "bathhouse lamp plates are blank rectangles; names on separate tags, not integrated inserts" },
      { "shot": "desktop/c02-springs", "note": "generic garden painting under the layout; gazebo top-centre with no shot, pool under lane guides" },
      { "shot": "desktop/r03-play", "note": "two pictures (garden / terrazzo) meeting at a balustrade seam; ramp covers unrelated art" },
      { "shot": "desktop/r02-serve", "note": "backglass strong and same hand; apron cards plain text on navy" } ] },
    "toys": { "score": 6.0, "confidence": 0.65, "evidence": [
      { "shot": "desktop/c05-tower", "note": "ramp floor has two transverse seams and a stepped wall join; zipper-tooth wall texture; wireform and tower good" },
      { "shot": "desktop/c03-flippers", "note": "sling bodies are white blocks with two black holes; no rubber, posts or plastic thickness" },
      { "shot": "desktop/c06-arlington", "note": "Arlington balanced on the gold lock-gate crossbar with no base; windows are flat yellow squares" },
      { "shot": "desktop/c04-vapors", "note": "guides are thick gold tubes on donut rubbers; Vapors reads as a white box with sign" },
      { "shot": "desktop/s02-bumpers-0", "note": "ball is a translucent peach orb with halo, not chrome" } ] },
    "lighting": { "score": 6.0, "confidence": 0.7, "evidence": [
      { "shot": "desktop/r07-mode", "note": "unlit-patch luma 67/69/72/74 vs r03 69/71/76/77: ~0.96, target ~0.88" },
      { "shot": "desktop/r08-wizard", "note": "luma ratio ~0.88 vs ~0.62 target for 35% light; star bloom swallows VALLEY OF THE VAPORS" },
      { "shot": "desktop/r06-multiball", "note": "~0.92 ratio while Grand Soak strip is visibly dark: inconsistent mood" },
      { "shot": "desktop/c01-row", "note": "lit plates blown to white" },
      { "shot": "desktop/s03-multiball-0", "note": "orange and blue lamp glow spills into the black void beside the cabinet" },
      { "shot": "desktop/s02-bumpers-0", "note": "lit caps smear the 143°F decal into orange-red blobs" } ] },
    "animation": { "score": 6.0, "confidence": 0.6, "evidence": [
      { "shot": "strips/s01-flip", "note": "flipper snaps frame 3 and holds; no anticipation, flex or recovery" },
      { "shot": "strips/s02-bumpers", "note": "caps flash, no ring/skirt drop between s02-0 and s02-5; steam drifts" },
      { "shot": "desktop/r04-bumpers", "note": "'ball in bumpers' frame shows ball at top arch, all caps idle" },
      { "shot": "strips/s03-multiball", "note": "real light show but camera never reacts" },
      { "shot": "mobile/r11-landscape", "note": "phone steam as bubble dots floating in black above the table" } ] },
    "ui": { "score": 6.5, "confidence": 0.6, "evidence": [
      { "shot": "mobile/r02-serve", "note": "HUD chip overlaps the cabinet top rail; steam drifts over it" },
      { "shot": "desktop/r09-help", "note": "left column cut mid-sentence while right column has ~220 px empty; no scroll cue" },
      { "shot": "desktop/r10-scores", "note": "stale wizard text on DMD behind High scores" },
      { "shot": "desktop/r07-mode", "note": "DMD horse art and two-line layout are good" },
      { "shot": "desktop/r01-title", "note": "buttons are plain rounded rectangles in system sans" } ] },
    "typography": { "score": 6.0, "confidence": 0.65, "evidence": [
      { "shot": "desktop/r03-play", "note": "mode labels ~4 px; EXTRA BALL green-on-brown illegible; bathhouse tags unreadable" },
      { "shot": "desktop/c01-row", "note": "SUPERIOR truncated to 'SU' against HALE" },
      { "shot": "desktop/c04-vapors", "note": "marquee pale cyan on cyan bloom; THE VAPORS duplicated on a tag" },
      { "shot": "mobile/r10-scores", "note": "system sans body/table; display slab only for headings" },
      { "shot": "desktop/r02-serve", "note": "apron card serif ~6 px, blurred" } ] },
    "readability": { "score": 6.0, "confidence": 0.65, "evidence": [
      { "shot": "desktop/r04-bumpers", "note": "ball an 8 px dot at the top arch against dark art" },
      { "shot": "desktop/r05-ramp", "note": "ball pale-on-pale on the ramp, nearly invisible" },
      { "shot": "desktop/r06-multiball", "note": "one of three balls a tiny dot at the top arch; table 36% of width" },
      { "shot": "desktop/r08-wizard", "note": "mode inserts merge into a violet band; star bloom hides the label" },
      { "shot": "mobile/r03-play", "note": "arrows and lit/unlit inserts clear" } ] },
    "mobile": { "score": 6.0, "confidence": 0.65, "evidence": [
      { "shot": "mobile/r11-landscape", "note": "~19% black above table, bottom rail cropped, ~60% of HUD column empty" },
      { "shot": "mobile/r02-serve", "note": "HUD chip overlaps the cabinet; steam rises into the DMD band" },
      { "shot": "mobile/r03-play", "note": "portrait framed with DMD on top and buttons clear of the ball; playfield labels illegible" } ] },
    "authenticity": { "score": 7.0, "confidence": 0.65, "evidence": [
      { "shot": "desktop/c01-row", "note": "Row in correct order with signatures in close-up" },
      { "shot": "desktop/r09-help", "note": "facts hedged; 1832 vs Yellowstone 1872 correct" },
      { "shot": "mobile/r03-play", "note": "at play scale the Row is 30 px cream boxes with unreadable names" },
      { "shot": "desktop/c04-vapors", "note": "supper-club features cannot be seen; reads as a white box with unreadable sign" },
      { "shot": "desktop/c02-springs", "note": "top third is a generic garden, not the Promenade or Arlington lawn" } ] }
  },
  "ip": { "clean": true, "notes": "No commercial pinball names, logos or art. Backglass zoomed: no lettering in the painting; all playfield lettering is overlay. 'The Arlington' and 'The Vapors' are used as place names with no logos; keep the marquee lettering generic, not modelled on the historic sign." },
  "gaps": [
    { "id": "G-ramp-seams", "category": "toys", "expectedGain": 0.3, "severity": 3, "effort": "M", "workstream": "WS2", "evidence": ["desktop/c05-tower"], "fix": "Loft the ramp as one continuous mesh with mitred walls; replace the zipper-tooth wall texture with a single edge highlight. Test: no transverse seam or wall offset visible in C05." },
    { "id": "G-sling-assembly", "category": "toys", "expectedGain": 0.3, "severity": 3, "effort": "M", "workstream": "WS2", "evidence": ["desktop/c03-flippers"], "fix": "Model rubber band between chrome posts, plastic thickness and printed themed art. Test: in C03 each sling shows a rubber band, at least 2 posts and non-flat art." },
    { "id": "G-arlington-base", "category": "toys", "expectedGain": 0.2, "severity": 2, "effort": "S", "workstream": "WS2", "evidence": ["desktop/c06-arlington", "desktop/c02-springs"], "fix": "Seat the Arlington on a terrace/plinth behind the gate or make the gate its porte-cochère. Test: in C06 the building meets a ground surface with a contact shadow." },
    { "id": "G-mood-dim-inconsistent", "category": "lighting", "expectedGain": 0.5, "severity": 4, "effort": "S", "workstream": "WS1", "evidence": ["desktop/r06-multiball", "desktop/r07-mode", "desktop/r08-wizard", "strips/s03-multiball"], "fix": "One mood scalar for every multiball and mode, applied to ambient, hemisphere and env intensity. Test: unlit-patch luma relative to R03 is <=0.88 in R07, <=0.76 in R06, <=0.62 in R08." },
    { "id": "G-lamp-spill-void", "category": "lighting", "expectedGain": 0.2, "severity": 2, "effort": "S", "workstream": "WS1", "evidence": ["desktop/s03-multiball-0"], "fix": "Clamp lamp light distance, exclude the background, or add cabinet side walls. Test: pixels outside the cabinet silhouette in all S03 frames stay at luma <=12." },
    { "id": "G-lit-decal-wash", "category": "lighting", "expectedGain": 0.2, "severity": 2, "effort": "S", "workstream": "WS1", "evidence": ["desktop/s02-bumpers-0", "desktop/r03-play"], "fix": "Mask emissive under the bumper decals and cap the spinner specular. Test: 143°F legible on every lit cap in S02; no white streak at the left orbit in R03." },
    { "id": "G-ball-contrast", "category": "readability", "expectedGain": 0.3, "severity": 3, "effort": "S", "workstream": "WS1", "evidence": ["desktop/r04-bumpers", "desktop/r05-ramp"], "fix": "Dark-rimmed chrome env, soft contact shadow, no emissive halo. Test: ball/background luma contrast >= 3:1 at the ball position in desktop R04 and R05." },
    { "id": "G-bumper-frame-proof", "category": "animation", "expectedGain": 0.2, "severity": 2, "effort": "S", "workstream": "WS3", "evidence": ["desktop/r04-bumpers", "mobile/r04-bumpers"], "fix": "Visible bumper hit reaction (cap flash plus ring drop) held for at least 4 frames. Test: R04 on both viewports shows the ball touching a bumper with that bumper lit." },
    { "id": "G-help-columns", "category": "ui", "expectedGain": 0.3, "severity": 2, "effort": "S", "workstream": "WS5", "evidence": ["desktop/r09-help", "mobile/r09-help"], "fix": "Balance the two help columns and add a phone scroll cue. Test: all help text visible without scrolling at 1280x800; mobile R09 shows a scroll indicator." },
    { "id": "G-hud-chip-overlap", "category": "mobile", "expectedGain": 0.2, "severity": 2, "effort": "S", "workstream": "WS6", "evidence": ["mobile/r02-serve", "mobile/r03-play"], "fix": "Reserve a row above the table for the chip; clip steam sprites to playfield bounds. Test: chip and table boxes do not intersect in R02; no steam pixel above the table's top edge." },
    { "id": "G-stale-dmd", "category": "ui", "expectedGain": 0.1, "severity": 1, "effort": "S", "workstream": "WS5", "evidence": ["desktop/r10-scores", "mobile/r10-scores"], "fix": "Attract DMD shows the score table or title while a menu is open. Test: no mode text on the DMD in R10." },
    { "id": "G-vapors-facade-visible", "category": "authenticity", "expectedGain": 0.3, "severity": 3, "effort": "M", "workstream": "WS2", "evidence": ["desktop/c04-vapors", "desktop/r03-play"], "fix": "Turn and raise the Vapors so canopy, breeze-block screen and glazed lobby face the player. Test: breeze-block screen and canopy distinguishable in C04; Vapors reads as more than a white box in R03." }
  ]
}
```
