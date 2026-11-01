Continue. Spa City Pinball has a strong regional identity, attractive painted scenery and a coherent gold, teal and amber palette, but it still falls short of shipped digital pinball in physical construction, lighting discipline and viewport design. The current captures score **59/90**. Build B wins the meaningful A/B comparisons, especially the landmark silhouettes, rails, DMD and portrait HUD; these improvements do not resolve the cropped landscape view, oversized guide walls, opaque-looking ramp or weak shot hierarchy. The supplied performance measurements pass; several visual gates do not.

All capture paths below are relative to `games/Pinball/screenshots/review-loop-3/`.

1. **Art — 7/10.** The backglass is richly painted, and the thermal garden, brick plaza and lower fan motif give the table distinct zones (`desktop/r03-play.png`, `desktop/c02-springs.png`). The lower field is composed around the flippers rather than merely filled. However, dense foliage competes with upper hardware, and the miniature buildings have a markedly simpler visual language than the painting (`desktop/c01-row.png`). **A/B: B, confidence 0.80**, using `ab/desktop-c04-vapors.png`, `ab/desktop-c03-flippers.png`, `ab/desktop-r03-play.png`: lettering placement and reduced surface glare improve the composition; the underlying paintings are effectively unchanged.

2. **Toys and materials — 6/10.** Bathhouse silhouettes are individually differentiated, and the tower has real lattice structure (`desktop/c01-row.png`, `desktop/c05-tower.png`). Chrome scoop rims and flipper rubber provide useful material separation. Nevertheless, huge dark guide walls with brass caps dominate the toys, their exposed ends look abruptly cut, and the ramp resembles a faceted translucent chute rather than convincing molded plastic. The Arlington remains a shallow architectural token (`desktop/c06-arlington.png`). **A/B: B, confidence 0.98**, using `ab/desktop-c01-row.png`, `ab/desktop-c03-flippers.png`, `ab/desktop-c05-tower.png`, `ab/desktop-c06-arlington.png`: rounded caps, bolt details and taller façades are clear improvements.

3. **Lighting — 6.5/10.** Lit versus unlit inserts is generally clear, with appealing warm target lighting and colored shot arrows (`desktop/r03-play.png`, `desktop/r08-wizard.png`). However, bumper bases and scoop rims still produce conspicuous white highlights; the wizard frame does not establish a substantially different atmosphere. The bumper impact rings look like flat orange graphic annuli rather than light spilling onto the painted surface (`strips/s02-bumpers.png`). **A/B: B, confidence 0.91**, using `ab/desktop-c02-springs.png`, `ab/desktop-c05-tower.png`, `ab/desktop-r08-wizard.png`: reduced blue glare and calmer reflections improve material legibility. The impact rings remain a weakness in B.

4. **Animation and game feel — 6.5/10.** The flipper strip shows a decisive change between frames 2 and 3 followed by a readable upward ball trajectory (`strips/s01-flip.png`). Bumper compression, flashing and expanding/fading rings provide a clear reaction sequence (`strips/s02-bumpers.png`). Multiball has coordinated lamp changes, but its strip communicates a light sequence more strongly than a three-ball launch (`strips/s03-multiball.png`). These samples do not establish nudge response or rich mechanical follow-through. **A/B: B, confidence 0.82**, using all three `ab/strips-*.png` pairs: bumper response is more explicit; the flipper sequence is effectively tied.

5. **UI, DMD and HUD — 7/10.** The horse and twin-tower silhouettes read immediately and give mode introductions character (`desktop/r07-mode.png`, `mobile/r06-multiball.png`). Menus are consistent and buttons have clear hierarchy. However, objectives are captured mid-scroll as incomplete phrases, the desktop repeats the score, and Help text runs underneath the pinned Back control (`desktop/r09-help.png`, `mobile/r09-help.png`). **A/B: B, confidence 0.99**, using `ab/desktop-r07-mode.png`, `ab/desktop-r06-multiball.png`, `ab/mobile-r03-play.png`, `ab/mobile-r07-mode.png`: authored silhouettes and the wider portrait DMD substantially outperform A.

6. **Typography — 6.5/10.** Menu headings, body copy and DMD lettering have consistent roles (`desktop/r10-scores.png`, `mobile/r01-title.png`). Enlarged plates are crisp in close-up (`desktop/c03-flippers.png`), but bathhouse names, mode labels and apron instructions become very small at the actual player camera (`mobile/r03-play.png`). The decorative title face also contributes less deco character than the framing suggests. **A/B: B, confidence 0.95**, using `ab/desktop-c03-flippers.png`, `ab/desktop-c04-vapors.png`, `ab/mobile-r07-mode.png`: stronger plates, cleared lettering and larger DMD text are visible improvements.

7. **Readability — 6.5/10.** The bright ball is easy to locate in ordinary play and on the ramp (`desktop/r03-play.png`, `mobile/r05-ramp.png`). Colored arrows establish broad destinations. But the silver ball competes with white hardware highlights, the target row is visually crowded, and important entrances are poorly connected to their corresponding arrows (`desktop/r06-multiball.png`, `desktop/c04-vapors.png`). Small purple progress lamps read more readily as status than actionable shots. **A/B: B, confidence 0.85**, using `ab/desktop-r02-serve.png`, `ab/desktop-c04-vapors.png`, `ab/mobile-r03-play.png`, `ab/mobile-r08-wizard.png`: quieter reflections and clearer labels help; some lamp differences are phase-dependent.

8. **Mobile — 5.5/10.** Portrait framing retains the full table and provides a readable DMD; the floating controls stay on the apron (`mobile/r02-serve.png`, `mobile/r07-mode.png`). Landscape is a major failure: the upper table, bumpers and shot destinations are outside the frame (`mobile/r11-landscape.png`). Help also places text against and underneath the pinned Back button (`mobile/r09-help.png`). **A/B: B, confidence 0.97**, using `ab/mobile-r03-play.png`, `ab/mobile-r06-multiball.png`, `ab/mobile-r09-help.png`, `ab/mobile-r11-landscape.png`: portrait is materially improved, while landscape remains unacceptable in both builds.

9. **Authenticity — 7.5/10.** The eight named bathhouses, differentiated roofs and domes, thermal steam, tower, Arlington and Vapors establish a specific place (`desktop/c01-row.png`, `desktop/c04-vapors.png`, `desktop/c05-tower.png`). Help explicitly qualifies disputed facts and describes the setting without claiming affiliation (`desktop/r09-help.png`). The Arlington and Vapors models are still simplified enough that their labels carry considerable identification work. **A/B: B, confidence 0.95**, using `ab/desktop-c01-row.png`, `ab/desktop-c06-arlington.png`, `ab/desktop-c04-vapors.png`: taller façades make the regional architecture easier to recognize.

The visual IP check is clean on the supplied evidence. I see no recognizable commercial pinball title, copied pinball artwork or identifiable real-business logo. Landmark and business names appear as setting labels. I see no legible text embedded in the scenic paintings; the readable lettering appears on UI, plates, decals and signs. This is a visual assessment of these captures.

Ranked gaps, with expected gains expressed as category points rather than guaranteed total gains:

1. **Landscape excludes the upper playfield.** `mobile/r11-landscape.png`. Fit the complete playable field into 844×390, then verify that bumpers, both scoops, ramp entrance and flippers are visible together. **Expected gain: mobile +1.5; severity 5; effort M; WS6.**
2. **Guide walls and ramp undermine physical credibility.** `desktop/c04-vapors.png`, `desktop/c05-tower.png`. Reduce wall mass, add credible end treatments and mounting details, and give the ramp consistent thin plastic edges, supports and restrained transparency. Verify in close-up and the player camera. **Expected gain: toys +1.0; severity 4; effort L; WS2.**
3. **Shot destinations lack a strong visual hierarchy.** `desktop/r03-play.png`, `mobile/r03-play.png`. Simplify high-frequency art immediately around entrances and connect each main arrow to its entrance with consistent color and placement. Verify identification at 390 CSS pixels without zoom. **Expected gain: readability +1.0; severity 4; effort M; WS4.**
4. **Bumper rings look like overlay graphics.** `strips/s02-bumpers.png`. Replace the hard annuli with soft, rapidly decaying illumination that respects the playfield surface; retain visible compression and recovery. Verify all eight strip frames without solid orange discs obscuring the art. **Expected gain: lighting +0.5; severity 3; effort M; WS3.**
5. **Help content collides with its pinned footer.** `desktop/r09-help.png`, `mobile/r09-help.png`. Give the scrolling content a separate viewport above the button and sufficient bottom padding. Verify that the final instruction can scroll fully above Back. **Expected gain: ui +0.5; severity 3; effort S; WS5.**
6. **Mode objectives rely too heavily on scrolling fragments.** `desktop/r07-mode.png`, `mobile/r06-multiball.png`. Keep a short complete imperative visible beside the silhouette; scroll only supplementary detail. Verify that an arbitrary still communicates the next action. **Expected gain: ui +0.5; severity 3; effort M; WS5.**

```json
{
  "loop": 3,
  "role": "critic-codex",
  "tier": "high",
  "verdict": "continue",
  "scores": {
    "art": {
      "score": 7,
      "confidence": 0.9,
      "evidence": [
        {"shot": "desktop/r03-play.png", "note": "Coherent painted zones and lower fan composition."},
        {"shot": "desktop/c02-springs.png", "note": "Rich scenic art competes with hardware."}
      ]
    },
    "toys": {
      "score": 6,
      "confidence": 0.96,
      "evidence": [
        {"shot": "desktop/c01-row.png", "note": "Distinct façades, oversized guide walls."},
        {"shot": "desktop/c05-tower.png", "note": "Lattice tower is recognizable; ramp is faceted and insufficiently physical."}
      ]
    },
    "lighting": {
      "score": 6.5,
      "confidence": 0.92,
      "evidence": [
        {"shot": "desktop/r08-wizard.png", "note": "Colored lamps but limited atmospheric separation."},
        {"shot": "strips/s02-bumpers.png", "note": "Hard orange impact annuli look graphical."}
      ]
    },
    "animation": {
      "score": 6.5,
      "confidence": 0.8,
      "evidence": [
        {"shot": "strips/s01-flip.png", "note": "Decisive flipper rotation and readable ball launch."},
        {"shot": "strips/s02-bumpers.png", "note": "Compression and fading hit response."},
        {"shot": "strips/s03-multiball.png", "note": "Lamp choreography reads more clearly than multiple-ball release."}
      ]
    },
    "ui": {
      "score": 7,
      "confidence": 0.93,
      "evidence": [
        {"shot": "desktop/r07-mode.png", "note": "Recognizable horse silhouette; incomplete scrolling objective."},
        {"shot": "mobile/r06-multiball.png", "note": "Clear DMD and score chip."},
        {"shot": "mobile/r09-help.png", "note": "Text reaches beneath pinned Back button."}
      ]
    },
    "typography": {
      "score": 6.5,
      "confidence": 0.92,
      "evidence": [
        {"shot": "desktop/c03-flippers.png", "note": "Crisp enlarged plate lettering."},
        {"shot": "mobile/r03-play.png", "note": "Playfield labels remain very small."},
        {"shot": "desktop/r10-scores.png", "note": "Consistent menu hierarchy."}
      ]
    },
    "readability": {
      "score": 6.5,
      "confidence": 0.88,
      "evidence": [
        {"shot": "desktop/r06-multiball.png", "note": "Ball highlights compete with bright hardware and lamps."},
        {"shot": "mobile/r05-ramp.png", "note": "Ball visible on ramp; destinations and labels remain crowded."}
      ]
    },
    "mobile": {
      "score": 5.5,
      "confidence": 0.98,
      "evidence": [
        {"shot": "mobile/r02-serve.png", "note": "Full portrait table and readable DMD."},
        {"shot": "mobile/r11-landscape.png", "note": "Upper playable field is outside frame."},
        {"shot": "mobile/r09-help.png", "note": "Footer crowds and occludes content."}
      ]
    },
    "authenticity": {
      "score": 7.5,
      "confidence": 0.86,
      "evidence": [
        {"shot": "desktop/c01-row.png", "note": "Eight named and differentiated bathhouse façades."},
        {"shot": "desktop/c05-tower.png", "note": "Specific lattice landmark."},
        {"shot": "desktop/r09-help.png", "note": "Setting and uncertain facts are qualified."}
      ]
    }
  },
  "ab": {
    "art": {
      "winner": "B",
      "confidence": 0.8,
      "pairs": ["ab/desktop-c04-vapors.png", "ab/desktop-c03-flippers.png", "ab/desktop-r03-play.png"],
      "note": "Better lettering integration and reduced glare; paintings essentially unchanged."
    },
    "toys": {
      "winner": "B",
      "confidence": 0.98,
      "pairs": ["ab/desktop-c01-row.png", "ab/desktop-c03-flippers.png", "ab/desktop-c05-tower.png", "ab/desktop-c06-arlington.png"],
      "note": "Rounded caps, bolt details and taller façades improve construction and silhouettes."
    },
    "lighting": {
      "winner": "B",
      "confidence": 0.91,
      "pairs": ["ab/desktop-c02-springs.png", "ab/desktop-c05-tower.png", "ab/desktop-r08-wizard.png"],
      "note": "Less blue glare and calmer reflections; hard impact rings remain weak."
    },
    "animation": {
      "winner": "B",
      "confidence": 0.82,
      "pairs": ["ab/strips-s01-flip.png", "ab/strips-s02-bumpers.png", "ab/strips-s03-multiball.png"],
      "note": "More explicit bumper response; flipper sequence effectively tied."
    },
    "ui": {
      "winner": "B",
      "confidence": 0.99,
      "pairs": ["ab/desktop-r07-mode.png", "ab/desktop-r06-multiball.png", "ab/mobile-r03-play.png", "ab/mobile-r07-mode.png"],
      "note": "Authored silhouettes and full-width portrait DMD are substantial improvements."
    },
    "typography": {
      "winner": "B",
      "confidence": 0.95,
      "pairs": ["ab/desktop-c03-flippers.png", "ab/desktop-c04-vapors.png", "ab/mobile-r07-mode.png"],
      "note": "Larger plates, cleared lettering and larger DMD text."
    },
    "readability": {
      "winner": "B",
      "confidence": 0.85,
      "pairs": ["ab/desktop-r02-serve.png", "ab/desktop-c04-vapors.png", "ab/mobile-r03-play.png", "ab/mobile-r08-wizard.png"],
      "note": "Quieter reflections and clearer labels; lamp phases limit direct comparison."
    },
    "mobile": {
      "winner": "B",
      "confidence": 0.97,
      "pairs": ["ab/mobile-r03-play.png", "ab/mobile-r06-multiball.png", "ab/mobile-r09-help.png", "ab/mobile-r11-landscape.png"],
      "note": "Portrait HUD improves materially; landscape remains cropped in both."
    },
    "authenticity": {
      "winner": "B",
      "confidence": 0.95,
      "pairs": ["ab/desktop-c01-row.png", "ab/desktop-c06-arlington.png", "ab/desktop-c04-vapors.png"],
      "note": "Taller façades make regional architecture more recognizable."
    }
  },
  "ip": {
    "clean": true,
    "notes": "No recognizable commercial pinball title, copied pinball art, identifiable business logo or legible text embedded in the scenic paintings observed. Landmark names appear as setting labels. Capture-based visual assessment."
  },
  "gaps": [
    {
      "id": "G-landscape-framing",
      "category": "mobile",
      "expectedGain": 1.5,
      "severity": 5,
      "effort": "M",
      "workstream": "WS6",
      "evidence": ["mobile/r11-landscape.png"],
      "fix": "Fit the complete playable field at 844x390; verify bumpers, both scoops, ramp entrance and flippers are simultaneously visible."
    },
    {
      "id": "G-hardware-construction",
      "category": "toys",
      "expectedGain": 1,
      "severity": 4,
      "effort": "L",
      "workstream": "WS2",
      "evidence": ["desktop/c04-vapors.png", "desktop/c05-tower.png"],
      "fix": "Reduce guide-wall mass, add credible end treatments and mounts, and give the ramp thin consistent plastic edges and supports; verify close-up and player-camera plausibility."
    },
    {
      "id": "G-shot-hierarchy",
      "category": "readability",
      "expectedGain": 1,
      "severity": 4,
      "effort": "M",
      "workstream": "WS4",
      "evidence": ["desktop/r03-play.png", "mobile/r03-play.png"],
      "fix": "Simplify art around shot entrances and consistently connect arrow color and placement to destinations; verify identification at 390 CSS pixels without zoom."
    },
    {
      "id": "G-bumper-impact-rings",
      "category": "lighting",
      "expectedGain": 0.5,
      "severity": 3,
      "effort": "M",
      "workstream": "WS3",
      "evidence": ["strips/s02-bumpers.png"],
      "fix": "Replace hard orange annuli with soft surface illumination and rapid decay while retaining compression and recovery; verify all eight frames preserve the painted surface."
    },
    {
      "id": "G-help-footer",
      "category": "ui",
      "expectedGain": 0.5,
      "severity": 3,
      "effort": "S",
      "workstream": "WS5",
      "evidence": ["desktop/r09-help.png", "mobile/r09-help.png"],
      "fix": "Constrain scrolling content above the pinned footer and add bottom padding; verify the last instruction scrolls completely above Back."
    },
    {
      "id": "G-objective-fragments",
      "category": "ui",
      "expectedGain": 0.5,
      "severity": 3,
      "effort": "M",
      "workstream": "WS5",
      "evidence": ["desktop/r07-mode.png", "mobile/r06-multiball.png"],
      "fix": "Keep a complete short imperative visible beside each silhouette and scroll only supplementary detail; verify arbitrary stills communicate the next action."
    }
  ]
}
```
