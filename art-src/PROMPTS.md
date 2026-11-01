# Art provenance and prompts

All painted art is original, made with OpenAI image generation through the Codex plugin (`codex:codex-rescue`),
starting 2026-11-01. Raw PNGs in this folder are git-ignored; packed WebP data ships in `assets/` (`art.json` →
`tools/build-art.mjs`). 3D toys are our own Blender models (`blender/toys.py`). Everything else (playfield base,
inserts, lettering, DMD, plastics patterns) is drawn in code.

Every prompt carries the same constraints:
- original art for an open-source (MIT) pinball video game set in Hot Springs, Arkansas
- **no text, letters, numbers, signage words or logos** anywhere (titles and labels are set in code)
- no real or recognisable people; any people small and generic
- do not imitate any living artist or any existing pinball machine's artwork
- frameless (no borders drawn in), so the game can crop and frame it

## House style (set by the pilots)
"A mid-century American pinball backglass painting: bold gouache and airbrush, saturated night palette of deep
midnight blue and violet with deco gold, neon red and turquoise accents, warm cream-brick and red-tile
architecture lit from within, soft glowing steam, crisp confident ink outlines, gentle halftone grain, dramatic
but clean composition." Palette anchors (from `shared/design/tokens.css`): midnight #14121F, deco gold #D4AF37,
neon red #FF3B3B, neon blue #4FC3FF, cream brick #E6D7B5, red tile #A9432C, Maurice green #4E7D5B,
thermal teal #2A9D8F, turquoise #3FBFB5, coral #F26B5B.

## Pieces
| File | Size | Prompt summary |
|---|---|---|
| `pilot-backglass.png` → `backglass.png` | 1024×1536 | House style. Hot Springs, Arkansas at night, seen from Central Avenue: the row of 1910s–20s bathhouses glowing along the left (a tiled dome with a copper lantern, twin stepped towers, red-tile roofs, a stained-glass skylight glow), clouds of steam rising from thermal springs on the wooded mountain behind, a tall lattice observation tower with a lit deck on the ridge, a 1950s supper-club canopy with neon tubes (no words) at lower right, a racehorse silhouette in the clouds, magnolia leaves framing the bottom corners. Leave the top 22% as dark sky with soft stars and steam (the title is set there in code). |
| `pilot-pf-mountain.png` → `pf-mountain.png` | 1536×1024 | House style, evenly lit, viewed from almost straight above (a playfield painting): the wooded slope of Hot Springs Mountain with grey-white tufa terraces, steaming turquoise spring pools and cascades, stone spring boxes, a winding gravel path, pine and oak canopy, warm lamplight glow at the edges. No sky, no horizon. |
| `pf-promenade.png` | 1536×1024 | House style, evenly lit, from almost straight above: the brick Grand Promenade walkway with magnolia trees, iron lamp posts and benches, cream marble and terrazzo paving with deco fan patterns, puddles reflecting neon, fallen magnolia petals. No people. |
| `pf-row.png` | 1536×1024 | House style, evenly lit, from straight above: decorative hexagonal white-and-green bathhouse floor tile and cream marble with brass inlay lines, wisps of steam. A seamless-looking texture. |
| `pf-derby.png` | 1024×1024 | House style: three racehorses with jockeys in fictional geometric silks (hoops, diamonds, chevrons) galloping toward the viewer on a dirt track at dusk, grandstand lights blurred behind. No numbers, no words. |
| `pf-vapors.png` | 1024×1024 | House style: a 1960 supper club entrance canopy at night with turquoise and coral neon tubes in abstract shapes, a starburst, potted palms; no words, no letters. |
| `pf-raid.png` | 1024×1024 | House style, sepia-tinted newsprint feel: a pile of old three-reel slot machines in a gravel pit under a night sky, no people, no words. (Documented: seized slots were crushed and burned in 1967.) |
| `pf-tub.png` | 1024×1024 | House style: a decorated clawfoot bathtub on wheels splashing down a brick street, water flying, rubber duck on the rim, small generic pushers seen from behind, no words. |
| `pf-coaster.png` | 1024×1024 | House style: an early-1900s wooden roller coaster on a wooded hillside at dusk, strings of bulbs, no words. |

## Checks done on every image
- Text: none at full size (inspected with the Read tool).
- People: small and generic.
- In game, paintings are decorative illustration, never presented as photographs.
