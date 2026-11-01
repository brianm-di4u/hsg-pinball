# Spa City Pinball: town content and sources

Every real place, fact, name, colour and story the table uses, with its source. Corpus paths are relative
to `C:\Video Game Projects\research\` (the shared, read-only Hot Springs corpus). `hs-NNNN` ids point to
the audited trivia bank `games/trivia/data/questions.json`, which is the required source for player-facing
fact text (SESSION-BRIEF ground rules); every callout below that has an id was checked against it.

Research date: 2026-11-01 (corpus notes dated 2026-10-28/29). Nothing here is new web research.

**Confidence tags** (as `00-INDEX.md` defines them): none = full-page read of the cited source;
`(snippet)` = search-summary only; **[DISPUTED]** / `conflict:` = sources disagree; **[UNVERIFIED]** /
**[UNCONFIRMED]** = no reliable source; **[LEGEND]** = folklore; **[promo]** = self-description;
**[measured]** = scaled from HABS drawings by a game session; **[inferred]** = design inference, not fact;
"(hex est.)" = every corpus colour is an estimate. **Fictional** = invented for the game.

**On-screen hedge words** (`game-hooks.md` → Cross-game notes): anything tagged DISPUTED, UNVERIFIED,
UNCONFIRMED, snippet or LEGEND appears only with "reportedly", "legend says", "about" or "sources differ".

---

## 1. Table geography (how the playfield maps onto the real town)

Proposed orientation **[inferred]**: the player stands on Central Avenue **facing east** toward Bathhouse
Row, exactly the view of the HABS streetscape, which reads left to right Superior … Lamar.

| Playfield zone | Real direction | Real feature there | Source |
|---|---|---|---|
| Top of table | East | Hot Springs Mountain rises behind the Row; the 216-ft tower is east of the Row (34.51723, -93.04611 vs Row ≈ -93.0535) | `downtown-and-landmarks.md` → Towers; `bathhouse-row-layout.md` §2 |
| Mid-field bank, left → right | North → south | The 8 bathhouses face west onto Central Ave, Superior northernmost, Lamar southernmost | `bathhouse-row-layout.md` §1 |
| Left side | North | Arlington Lawn and the Arlington at the Central/Fountain "Y"; Park Avenue (the Vapors, 315 Park Ave) runs on from the Y | `bathhouse-row-layout.md` §3; `gangster-era-and-gambling.md` → Clubs |
| Right side | South | Reserve St corner (Administration Building), then Central Ave south toward Oaklawn | `bathhouse-row-layout.md` §3; `oaklawn-and-racing.md` |
| Orbit lane | North–south | Central Avenue itself runs past the Row's front | `downtown-and-landmarks.md` → Central Avenue |

Row length about 1,705 ft along Central (OSM) / "some 1700 feet" (1989 LMP); built frontage about
1,150 ft; the rest is Arlington Lawn — `bathhouse-row-layout.md` §3.

---

## 2. Feature names: draft vs recommended

| Draft name | Recommended | Why |
|---|---|---|
| Top lanes S·P·A | **S·P·A lanes** (keep) | Flavour only. "Spa City" itself is not sourced as a nickname in the corpus (see §9, §12) |
| Thermal vents (3 pops) | **Thermal Springs** pops: *Display Spring*, *Spring No. 46*, *Hot Water Cascade* | The town has springs, not vents; all three are real named features (§3) |
| Bathhouse Row bank (8) | **Bathhouse Row** (keep), targets in N→S order | Order confirmed by 4 sources (§4) |
| Grand Soak multiball | **Grand Soak** (keep); optional jackpot ladder "21-Bath Course" | The 1920 prescribed course was 21 baths (§4.3) |
| Mountain Tower ramp | **Mountain Tower ramp** (keep); Tower Climb levels **Woolman → Rix → Mountain Tower** | Three real towers, 75–80 → ~165 → 216 ft (§5) |
| Central Avenue orbit + spinner | **Central Avenue** orbit (keep) | §6 |
| Oaklawn Derby meter / mode | **Fifth Season** race meter; mode **Derby Day** | "Fifth Season" is the sourced nickname for the meet; keeps the trademark name "Oaklawn" off a feature (`00-INDEX.md` content rules) |
| The Vapors scoop | **The Vapors** scoop (keep) | Real 1960 club; double meaning with the steam nickname (§7, §9) |
| Vapors Raid hurry-up | **Raid! 1967** | The documented 1967 raids hit *other* clubs; no source says the Vapors was raided (§7.3) |
| Arlington lock | **Arlington lock** (keep) | §8 |
| Mode: Bathhouse Soak | **Bathhouse Soak** (keep) | §4 |
| Mode: Oaklawn Derby | **Derby Day** | as above |
| Mode: Vapors Raid | **Raid! 1967** | as above |
| Mode: Tower Climb | **Tower Climb** (keep) | §5 |
| Mode: Duck Tour | **Tub Race** (alt. **Gator Farm**) | Duck tours are explicitly "not found" in the corpus; the tub race is well sourced (§10) |
| Mode: Magic Springs Coaster | **Coaster Hill** (generic), optional "Whittington" nod | "Magic Springs" is a listed trademark; no park marks (§10) |
| Wizard: Valley of Vapors | **Valley of Vapors** (keep, hedged) | Sourced nickname for the steam, via search summary; the neutral-ground tale is LEGEND (§9) |

---

## 3. Thermal Springs (pop bumpers)

| Fact | Value / note | Tag | Source |
|---|---|---|---|
| Average spring temperature | **about 143°F (62°C)** | — | NPS Display Spring, in `geography-lakes-mountains.md` → Thermal springs; hs-0147 |
| Superlative | "easily the hottest springs east of the Rocky Mountains" | — | NPS Display Spring; hs-0154 |
| Historic readings | 148–150°F (Dunbar–Hunter, 1804); 102–147°F, mostly 135–145°F (46 springs, 1920); max temps down about 5°F since records began | — | `geography-lakes-mountains.md` (EOA; NPS 1920 brochure; Wikipedia HSNP) |
| Heated at depth to | about 160°F, roughly a mile under Hot Springs Mountain | — | NPS Display Spring |
| Count | 47 usual (USGS; hs-0148) — conflict: 43 flowing / "about four dozen" | `conflict:` | `geography-lakes-mountains.md` |
| Flow | "over 700,000" gal/day (NPS) vs up to ~1,000,000 | `conflict:` | same |
| Age of the water | about 4,400 years (USGS tritium + carbon-14) | — | same; hs-0145 |
| Faults | two thrust faults, "alpha" (roughly under Central Ave/Fountain St) and "beta" | — | NPS Display Spring |
| *Display Spring* (pop 1) | behind the Maurice; open-air pool "surrounded by mosses and blue-green algae", ~143°F | — | `bathhouse-row-and-springs.md` → Springs and fountains |
| *Spring No. 46* (pop 2) | in the Fordyce basement, glazed-tile room | — | same; hs-0075 |
| *Hot Water Cascade* (pop 3) | below Arlington Lawn; NPS created it 1982; alga *Phormidium treleasei* | — | same |

Use "about" with every number (`geography-lakes-mountains.md` [inferred] canonical set: 47 springs,
143°F, 700,000+ gal/day, 4,000+ years).

---

## 4. Bathhouse Row bank (8 targets, north → south)

Order **Superior, Hale, Maurice, Fordyce, Quapaw, Ozark, Buckstaff, Lamar**, then the Administration
Building on the Reserve St corner. Confirmed by HABS AR-28, the NHL nomination ("The northernmost
bathhouse on the row is the Superior"), the CLI and OSM centroids — `bathhouse-row-layout.md` §1.
Wikipedia's alphabetical list is **not** the Row order.

### 4.1 Target facts and DMD callouts (≤ 40 chars)

| # | Target | Built / era | One-line fact | DMD callout | Tags / hedges | Source |
|---|---|---|---|---|---|---|
| 1 | Superior | 1916 `gilded-spa` | Green tile medallions on painted faux-tile concrete; "smallest bathhouse on the Row"; now a brewery | `SUPERIOR 1916: GREEN TILE MEDALLIONS` | Architect Harry vs "Harvey" C. Schwebke (conflict; don't show) | `bathhouse-row-and-springs.md` → Superior; hs-0066, hs-0290 |
| 2 | Hale | 1892–93 `gilded-spa` | Oldest surviving bathhouse on the Row; Mission facade 1939–40; now Hotel Hale | `HALE 1892: OLDEST ON THE ROW` | Wikipedia also says "1883" (conflict) — use 1892 | same → Hale; hs-0061, hs-0080 |
| 3 | Maurice | 1911–12 `gilded-spa` | Roycroft ("Dutch") Den; 1931 therapy pool inspired by FDR's Warm Springs; under restoration | `MAURICE 1912: THE ROYCROFT DEN` | 2026 lessee [UNCONFIRMED]; Dempsey gym tale [UNVERIFIED] — don't use | same → Maurice; hs-0067, hs-0079 |
| 4 | Fordyce | 1914–15 `gilded-spa` | Largest and costliest: $212,749.55; Neptune's-daughter stained-glass skylight over the DeSoto Fountain; visitor center since 1989 | `FORDYCE 1915: STAINED GLASS SKYLIGHT` | Glass "about 8,000" vs 18,000 pieces (conflict); de Soto visit is [LEGEND] | same → Fordyce; hs-0064, hs-0065, hs-0096 |
| 5 | Quapaw | 1922 `roaring` | Chevron-tiled dome with copper cupola; its lantern is the highest point on the Row (~58–60 ft) | `QUAPAW 1922: THE TILED DOME` | Height is [measured]; name from artifacts found digging the basement | same → Quapaw; `bathhouse-row-layout.md` §2; hs-0078 |
| 6 | Ozark | 1922 `roaring` | Twin towers with three-tiered setbacks; now the park's Cultural Center | `OZARK 1922: TWIN STEPPED TOWERS` | Address 425 vs 491 (conflict; don't show) | same → Ozark; hs-0085, hs-0104 |
| 7 | Buckstaff | 1912 `gilded-spa` | The only bathhouse that has run baths continuously since 1912 | `BUCKSTAFF: BATHS SINCE 1912` | Brick cream vs taupe (conflict) | same → Buckstaff; hs-0062 |
| 8 | Lamar | 1923 `roaring` | Its April 16, 1923 opening completed Bathhouse Row; now the park store | `LAMAR 1923: THE ROW IS COMPLETE` | Architect [DISPUTED] (don't show) | same → Lamar; hs-0077, hs-0105 |
| (kicker) | Administration Building | 1936 | Holds the Reserve St corner; jug fountains on the sidewalk | `RESERVE ST: FILL YOUR JUG` | — | `bathhouse-row-and-springs.md` → Springs and fountains |

Row-wide callouts: `8 BATHHOUSES ON THE ROW` (hs-0109); `LANDMARK DISTRICT SINCE 1987` (hs-0098);
`FEDERAL LAND: LEASED, NEVER SOLD` (`bathhouse-row-and-springs.md` → Row overview, EOA).

### 4.2 Façade toys (shape and colour per target, hex est.)

| Target | Silhouette cue | Colours (hex est.) | Source |
|---|---|---|---|
| Superior | flat brick parapet, green paterae frieze | cream #E6D7B5, stucco #F3EFE6, green tile #4E7D5B | `bathhouse-row-and-springs.md` → Superior |
| Hale | red tile hip roof; small "HALE" bell gable *low on the porch* | red tile #A9432C, shadow #7E2F1F, stucco #F3EFE6, iron #1F2A24 | → Hale [measured] |
| Maurice | white block, green-tile roof cap, sun porch of 5 arches | #F3EFE6, green #4E7D5B, terra cotta #C46A3E | → Maurice |
| Fordyce | two red-tile end pavilions, flat centre, dark-brown lozenge brick on light yellow; copper-and-glass marquee | #E3CF94 / lozenge #6E4B2F, red #A9432C, copper #B87333, cobalt #2B4C9B, amber #D9A23A | → Fordyce; `visual-style-guide.md` motif 1 |
| Quapaw | widest façade; chevron dome (buff/tan/cream, ochre base band, turquoise panels), bronze lantern; scallop-and-sculpin parapet | #D8C29A, #B89A6A, #C8963E, #3FA8A0, #6B4E2E; sculpin gold #D4AF37 | → Quapaw [observed 1984]; motifs 2–3 |
| Ozark | low white block between two 3-step towers with red caps | #F3EFE6, #A9432C | → Ozark |
| Buckstaff | seven bays, paterae row, brass lettering | #E6D7B5, #F3EFE6, brass #C9A23F | → Buckstaff |
| Lamar | simplest flat parapet, tile cap | #F3EFE6, #A9432C | → Lamar |

The Quapaw's Indian-head cartouche is drawn only as an abstract architectural ornament, never a face
(`00-INDEX.md` content rules). No lettering copied from real signs.

### 4.3 Grand Soak / Bathhouse Soak flavour

| Fact | Source |
|---|---|
| 1920: a prescribed **course of 21 baths**, $9–$15 ($13–$19 with attendant); single bath $0.50–$0.80 | NPS 1920 brochure in `bathhouse-row-and-springs.md` → Bathing practice |
| 1946: peak bathing, "more than 1 million baths" — conflict: 649,270 on the Row | same → Bath statistics |
| Government Free Bathhouse: act of Dec. 16, 1878; 87,040 free baths in 1919 | hs-0019, hs-0020 |
| 1912–1923 replacements: brick and stucco, marble walls, stained glass | NPS, `bathhouse-row-and-springs.md` → Row overview |

Segregated bathing and mercury treatments are history-card material only, never a gameplay joke
(`00-INDEX.md` → Sensitive history).

---

## 5. Mountain Tower ramp and Tower Climb

| Level | Tower | Height | Dates | Tags | Source |
|---|---|---|---|---|---|
| 1 | Enoch Woolman's wooden tower | ~75 ft (Wikipedia) / ~80 ft (Sentinel-Record) | 1877; lost to lightning in the 1890s | `conflict:` height | `downtown-and-landmarks.md` → Towers; hs-0292 |
| 2 | Rix Tower (steel, elevator, telescope) | ~165 ft, "120 mile view" | opened 1906 (Sentinel-Record); down July 13, 1971 (NPS) vs 1975 (Wikipedia) | `conflict:`; World's Fair origin is Wikipedia-only | same; hs-0071 |
| 3 | Hot Springs Mountain Tower (lattice steel, observation deck) | **216 ft** (65.8 m) | contract March 1982; opened June 3, 1983 (EOA 1983; Wikipedia city page 1982) | `conflict:` year → show "1983" | same; hs-0094 |

- Reached by the Peak Trail: 0.6 mi at 12.6% — `hot-springs-national-park.md` → Trails.
- 2026 open status not verified — do not say "open today".
- DMD: `MOUNTAIN TOWER: 216 FEET`, `1877: A WOODEN TOWER ON THE PEAK`.

---

## 6. Central Avenue orbit (spinner)

| Fact | Tag | Source |
|---|---|---|
| Called Valley Street until the late 1870s | — | EOA, `downtown-and-landmarks.md` → Central Avenue |
| Hot Springs Creek runs in a tunnel under Central Ave (enclosed 1882–83) | — | same |
| Row on the east side; 1880s–1930 commercial blocks on the west; Arlington at the north "Y" | — | same (intro) |
| 2014: American Planning Association named it a "Great Street" | — | EOA Central Avenue HD |
| Mayor Leo McLaughlin (1927–47) rode down Central daily in a sulky behind horses "Scotch and Soda" | — | `gangster-era-and-gambling.md` → McLaughlin; hs-0488 |
| Bathtub races run down Central Ave in front of the Row (§10) | — | `culture-events-food.md` → Running of the Tubs |

DMD: `CENTRAL AVE WAS VALLEY STREET`, `A CREEK RUNS UNDER CENTRAL AVE`, `MAYOR'S HORSES: SCOTCH AND SODA`.
McLaughlin is a deceased public figure: name in fact text only, no portrait (`gangster-era-and-gambling.md` hook 6).

---

## 7. The Vapors scoop, mystery award and Raid! 1967

### 7.1 The Vapors (documented)

| Fact | Tag | Source |
|---|---|---|
| Built summer 1959 at **315 Park Ave** on the old Phillips Drive-In site; **opened 1960** | — | EOA Vapors in `gangster-era-and-gambling.md` → Clubs; hs-0411 |
| Built by Dane Harris (WWII pilot) with Owney Madden and Harry Hastings | — | same |
| Coffee shop, Monte Carlo Room, theater restaurant with retractable stage, late-night casino; Tiffany chandeliers, mahogany bar | — | EOA; America's Best Racing |
| Tony Bennett first sang "I Left My Heart in San Francisco" there in rehearsal | trivia only | EOA; hs-0408 |
| Bombed Jan. 4, 1963 (12 injured) | **history card only** — bombings are never gameplay | hs-0046; `00-INDEX.md` content rules |
| Today the music venue "Vapors Live" (since 2017) | private business: setting only | EOA Vapors |
| Unrelated name echo: the 1906 pro baseball team was the Hot Springs Vapors | — | hs-0209 |

### 7.2 Slot-reel mystery award (flavour facts)

| Fact | Tag | Source |
|---|---|---|
| Dane Harris's Spa Amusement Co. supplied slot machines | (snippet) | ADG 2017, `gangster-era-and-gambling.md` → Clubs |
| Gambling Museum (2016): 80 working slots, 15 used in Hot Springs | — | EOA Gambling Museum |
| 1927–47 peak: at least 10 major casinos; casinos paid "fines" that worked as license fees | — | Wikipedia; EOA McLaughlin |
| 1961: a federal probe called Hot Springs the largest illegal gambling operation in the U.S. | — | EOA Madden |

Reel symbols are original icons from the catalog (dice, horseshoe, roulette wheel, fedora, steam
spring, tiled dome) — `visual-style-guide.md` → Icon catalog #1, 5, 29, 31, 32, 35. No real slot-machine
art or brand.

### 7.3 Raid! 1967 (hurry-up)

| Fact | Tag | Source |
|---|---|---|
| Gov. Winthrop Rockefeller (elected 1966) ordered the State Police crackdown | — | EOA HS city; hs-0320, hs-0049 |
| Spring 1967: he vetoed a bill to legalize gambling at four private clubs | (snippet) | HMdb marker |
| **Mid-August 1967**: raids seized equipment from the **Ohio, Bridge Street, Citizens and White Front** clubs | exact days approximate | EOA HS city; Wikipedia |
| October 1967: raid on the Southern Club manager's home took **111 slot machines** | (snippet) | ADG 2017 via PressReader |
| conflict: one writer says the last bets were on the eve of Easter 1964 | `conflict:` (snippet) | Rex Nelson, NWA |

Hedge: the scoop sits at the Vapors but the hurry-up text must say "the clubs", not "the Vapors was
raided". DMD: `AUG 1967: STATE POLICE RAID THE CLUBS`, `OCT 1967: 111 SLOTS SEIZED`.

### 7.4 Gangster-era people: legend vs documented

| Person (all deceased) | Documented | Legend / disputed | Source |
|---|---|---|---|
| Owney Madden | Retired NY gangster, settled 1935 (EOA) — conflict 1934 (ADG); parole barred his return to New York; controlled the Southern Club by ~1940; co-built the Vapors; died 1965 | — | EOA Madden; hs-0036, hs-0305–0307 |
| Al Capone | Often at the Arlington in the 1930s, renting a floor (hs-0310) | Room **443 vs 442** [DISPUTED] (hs-0486 is tagged *claim*); tunnels to the Southern Club [UNVERIFIED]; cigar-smoke ghost [LEGEND] | `gangster-era-and-gambling.md` → Figures; `culture-events-food.md` → Folklore |
| Lucky Luciano | Arrested in Hot Springs, 1936 | Arrest site [DISPUTED]: Southern Club / national park / Arlington | same |
| Bugsy Siegel | — | Ohio Club link (snippet) / [UNVERIFIED] — do not use | same |

**Rule** (`00-INDEX.md`; `gangster-era-and-gambling.md` Caveats): real names appear only in factual DMD
text and history cards, never as characters, voices, portraits or caricatures. The Raid's on-screen
cast is fictional archetypes ("the Retired Gangster", "the Reform Governor's men"); tommy guns "use
sparingly" (`gangster-era-and-gambling.md` hook 22) — recommend none.

---

## 8. Arlington lock

| Fact | Tag | Source |
|---|---|---|
| Third Arlington, 239 Central Ave at the Central/Fountain "Y"; completed Nov. 28, 1924 | — | `downtown-and-landmarks.md` → Arlington; hs-0076, hs-0111 |
| Built in 11 months and 3 days after the second Arlington burned April 5, 1923 | Arlington's own history page (business source) | same; hs-0039 |
| Spanish Colonial Revival, twin towers; Mann & Stern (George Mann) | — | same; hs-0289 |
| First Arlington 1875, the state's largest hotel; second (1893) red brick with corner towers | — | same; hs-0058 |
| Its placement "at the terminus of the town's most important vista" made it a key landmark | — | Wikipedia, same |
| KTHS radio broadcast from the hotel from Dec. 20, 1924 | conflict: Arlington page says 1928 | same |
| Room 824 ghosts, Capone's cigar smoke | [LEGEND] | `culture-events-food.md` → Folklore |

Lock progression idea **[inferred]**: three locks = the three Arlingtons (1875 wood → 1893 red brick →
1924 twin towers), from `downtown-and-landmarks.md` → Game hooks "Upgrade paths". The hotel operates
today (private business): setting only, no logo, no implied partnership.

---

## 9. Nicknames and the wizard mode

| Name | Status | Source |
|---|---|---|
| **Valley of Vapors** / "Valley of the Vapors" | Nickname from the steam rising off the springs — **(via search summary)**; first printed use not found | npshistory.com index via `geography-lakes-mountains.md`, `history-timeline.md` (ancient), `culture-events-food.md` |
| Neutral ground where rival tribes bathed in peace | **[LEGEND]** — EOA: later tourism-era embellishment | `culture-events-food.md` → Folklore |
| **Great American Spa** | Period nickname from the bathing industry | NPS, `hot-springs-national-park.md` → Superlatives (line "Great American Spa") |
| **America's Baden-Baden** | Title of the 1877 Iron Mountain railroad booklet | NPS "Getting to the American Spa"; hs-0018 |
| "The American Spa" | NPS page title; Dee Brown's 1982 book (not consulted) | `history-timeline.md`; `famous-people.md` |
| **Fifth Season** | Nickname for the winter–spring race meet | Wikipedia: Hot Springs; hs-0470 |
| America's "sin city" before Vegas | Smithsonian headline framing | `gangster-era-and-gambling.md` → Overview |
| "Spa City" | **Not sourced as a nickname** in the corpus (appears only in group names such as the Spa City Blues Society) | `culture-events-food.md` → Events |
| "We Bathe the World" (historic motto) | Not in the corpus; cited from runningofthetubs.org by the Cart Racing session | `games/Cart Racing/research/town-content.md` §1 |

**Verdict:** "Valley of Vapors" is supported as a nickname for the steam, at search-summary confidence.
Keep the wizard name; the attract/DMD line should be steam-based ("the valley of steaming springs"), and
any neutral-ground story must be framed "legend says". Note two other collection games already use the
phrase (Valley of Vapors Trivia Trail; Valley of Vapors: Through the Ages) — `game-hooks.md` §4, §11.

---

## 10. Remaining modes

### Derby Day / Fifth Season meter (Oaklawn facts, fictional horses)

| Fact | Tag | Source |
|---|---|---|
| Oaklawn Jockey Club formed 1904 by Southern Club owners; racing opened Feb. 1905 (EOA) — Wikipedia says Feb. 24, 1904 | **[DISPUTED]** → say "since 1904" or "1904/05" | `oaklawn-and-racing.md` → Founding conflict |
| First day declared a city holiday | — | hs-0212 |
| One-mile dirt oval; two finish lines (miles finish at the sixteenth pole) | — | → Track facts |
| **Arkansas Derby** first run 1936, $5,000 purse; Grade I; skipped 1945 (WWII, snippet) | — | → Arkansas Derby; hs-0214, hs-0216 |
| Racing Festival of the South created 1974 | — | hs-0234 |
| Meet: late January–early May (2019, 57 days) vs "December through May" | **[DISPUTED]** → say "winter–spring" | → Caveats |
| 1934 reopening without legislative consent; 1935 pari-mutuel law | — | → Political and legal history |
| American Pharoah won the 2015 Arkansas Derby, then the Triple Crown | trivia only | hs-0240 |
| 50¢ corned beef on opening weekend | (snippet) | → Traditions |

Horses, jockeys and silks are **fictional**; real horse names only in fact callouts (`oaklawn-and-racing.md`
→ Famous horses). Silks: geometric hoops, diamonds and chevrons in era palettes (`oaklawn-and-racing.md`
→ Game hooks, [inferred]); no real stable colours are sourced. Living Cella family members: not named.

### Tub Race (replaces Duck Tour)

| Fact | Source |
|---|---|
| Stueart Pennington World Championship Running of the Tubs, begun 2006, honours Bathhouse Row | `culture-events-food.md` → Running of the Tubs; hs-0379 |
| Teams push decorated bathtubs on wheels down Central Ave; spectators throw water | same |
| Police and fire open with the "Battle of the Badges"; "World Championship" from 2018 | hs-0381, hs-0382 |

Overlaps the collection's Cart Racing game (Spa City Tub Rally); keep it a short mode. Event name in fact
text only, no event logo. Alternative mode **Gator Farm**: Arkansas Alligator Farm (1902, 847 Whittington
Ave); on March 17, 1918 a long home run (about 573 ft, measured 2011, hedge) landed in it (hs-0183,
hs-0184) — use a fictional "Bambino-type slugger" (`00-INDEX.md`).

### Coaster Hill (replaces Magic Springs Coaster)

| Fact | Tag | Source |
|---|---|---|
| Early-1900s Whittington Park amusements had merry-go-rounds and roller coasters (no roster) | (snippet) | `other-attractions.md` → Whittington Park |
| Magic Springs opened July 22, 1978; reopened 2000 | trivia only | `magic-springs.md`; hs-0414 |

No park name, ride names or marks on the playfield (`00-INDEX.md`; `game-hooks.md` §10). Coaster icon:
sine track on lattice supports, red track / white supports (`visual-style-guide.md` icon #36).

---

## 11. DMD fact callouts (128×32, ≤ 40 chars)

| # | Callout | Feature | Tag | Source |
|---|---|---|---|---|
| 1 | `SPRING WATER: ABOUT 143°F` | pops | — | NPS; hs-0147 |
| 2 | `HOTTEST SPRINGS EAST OF THE ROCKIES` | pops | — | NPS; hs-0154 |
| 3 | `RAIN FROM ABOUT 4,400 YEARS AGO` | pops | — | USGS; hs-0145 |
| 4 | `ABOUT 47 HOT SPRINGS` | pops | count conflict → "about" | hs-0148 |
| 5 | `RESERVED APRIL 20, 1832` | attract | — | hs-0001 |
| 6 | `40 YEARS OLDER THAN YELLOWSTONE` | attract | — | hs-0002 |
| 7 | `A NATIONAL PARK SINCE 1921` | attract | — | NPS, `hot-springs-national-park.md` → Timeline |
| 8 | `HALE 1892: OLDEST ON THE ROW` | bank | — | hs-0061 |
| 9 | `FORDYCE COST $212,749.55` | bank | — | hs-0064 |
| 10 | `BUCKSTAFF: BATHS SINCE 1912` | bank | — | hs-0062 |
| 11 | `LAMAR 1923: THE ROW IS COMPLETE` | bank | — | hs-0077 |
| 12 | `1920: A COURSE OF 21 BATHS` | Grand Soak | — | NPS 1920 brochure |
| 13 | `MOUNTAIN TOWER: 216 FEET` | ramp | — | hs-0094 |
| 14 | `MAYOR'S HORSES: SCOTCH AND SODA` | orbit | — | hs-0488 |
| 15 | `FIRST ARKANSAS DERBY: 1936, $5,000` | Derby | — | hs-0214, hs-0216 |
| 16 | `THE RACE MEET: THE FIFTH SEASON` | Derby | — | hs-0470 |
| 17 | `THE VAPORS OPENED 1960` | scoop | — | hs-0411 |
| 18 | `AUG 1967: STATE POLICE RAID THE CLUBS` | Raid | "mid-August" | EOA; hs-0049 |
| 19 | `ARLINGTON REBUILT IN 11 MONTHS` | lock | business source | Arlington history; hs-0076 |
| 20 | `1877: AMERICA'S BADEN-BADEN` | attract | — | hs-0018 |
| 21 | `TUB RACES ON CENTRAL SINCE 2006` | Tub Race | — | hs-0379 |
| H1 | `REPORTEDLY CAPONE'S ROOM: 443` | lock | [DISPUTED] 443/442 | hs-0486 (claim) |
| H2 | `TUNNELS UNDER THE ARLINGTON? UNPROVEN` | lock | [UNVERIFIED] | Arlington history |
| H3 | `LEGEND: DE SOTO BATHED HERE (UNPROVEN)` | bank (Fordyce) | [LEGEND] | hs-0471 |

H-rows always carry their hedge word on screen. Keep all ≤ 40 characters including spaces; `°` needs a
glyph in the DMD font (fallback `143 F`).

---

## 12. Palettes (from `C:\Video Game Projects\shared\design\tokens.css`; all hex est.)

Gilded-spa daytime playfield + deco-neon night lighting, with thermal-water for springs and
motor-hotel for the 1960 Vapors. Default themes per `game-hooks.md` Cross-game notes: light =
`gilded-spa`, dark = `deco-neon`.

| Palette (era) | Use on the table | Tokens |
|---|---|---|
| `gilded-spa` (1875–1920) | Playfield base, Row façades, apron | bg #E6D7B5 cream brick · surface #F2EFE8 marble · primary #A9432C red tile · secondary #C46A3E terra cotta · accent #4E7D5B Maurice green · text #1F2A24 iron · muted #5A4C38 · highlight #D9A23A amber/brass · cobalt #2B4C9B · tile-shadow #7E2F1F |
| `deco-neon` (1921–1946) | Inserts, night mode, Raid, Arlington lock, DMD frame | bg #14121F midnight · surface #1F1C2E · primary #D4AF37 deco gold · secondary #7C5A2E bronze · accent #FF3B3B neon red · text #D8CFBD limestone · muted #8A8590 · highlight #4FC3FF neon blue · felt #1E5B3A |
| `thermal-water` (cross-era) | Pops, steam, cascade, Grand Soak | bg #1F5F6B pool · surface #174A54 · primary #2A9D8F blue-green algae · secondary #2F8F5B emerald · accent #6B8E3A moss · text #F4F2EC · steam #FFFFFF @ 25–35% · tufa #9A968C / rim #C8C3B6 |
| `motor-hotel` (1947–1967) | The Vapors scoop sign and mode | primary #3FBFB5 turquoise · secondary #F26B5B coral · accent #F4C542 atomic yellow · highlight #FFF6E0 neon white · rose #E26D8E |
| `linen-postcard` (1930s–50s) | Backglass / attract art | bg #F3E9D2 · primary #2F7FC6 cerulean · secondary #C8452B brick · accent #F6C933 title yellow · text #1F2F5C ink navy · horizon #A7DDF2 |

1920s–60s club interiors and neon colours are **not sourced** (`visual-style-guide.md` → roaring); any
neon scheme is an original design. Fordyce glass sea ramp #1F5F6B → #2A9D8F → #7FC8B8 → #2B4C9B with
lead #2A2A2A (`visual-style-guide.md` motif 4).

---

## 13. Motifs (`visual-style-guide.md` → Motif and pattern library)

| Motif | Table use | Recipe # / source |
|---|---|---|
| Steam curls | Rising from pops and the scoop; ball-lock idle | 7 |
| Tufa terraces | Cascade bumper base, Grand Soak inserts | 8 |
| Leaded sea glass (Fordyce mermaid skylight) | Centre insert art, wizard-mode light show | 4; icon #13 |
| Quapaw chevron dome | Mode-start insert, Bathhouse Row toy | 2 |
| Scallop and sculpin border | Apron and DMD frame | 3 |
| Fordyce lozenge brick | Inlane/outlane guides | 1 |
| Paterae rosette row | Rollover buttons, bonus-x lamps | 9 |
| Spanish tile roof strip | Top arch | 10 |
| Wrought-iron scroll | Slingshot plastics | 5 |
| Deco sunburst / bronze grille | Arlington lock gate, Raid inserts | 6 |
| Neon outline | Vapors sign, high-score banner | 15 |
| Racing silks (geometric hoops/diamonds/chevrons) | Derby meter lamps | `oaklawn-and-racing.md` hooks [inferred]; icons #34–35 |
| Five-globe green lamp posts, magnolias | Row foreground toys | `bathhouse-row-and-springs.md` → Promenades [observed 1984] |

---

## 14. Content rules for this table

1. **No logos or brand marks**: no NPS arrowhead, Oaklawn, Magic Springs, Arlington, Vapors or event logos; signs are original lettering (`00-INDEX.md` → Content rules).
2. **No endorsement**: real businesses (Arlington, Vapors Live, Buckstaff, Superior brewery, Hotel Hale, Oaklawn, Ohio Club) are settings only. Credits line: "Real places appear as historical setting; no affiliation or endorsement."
3. **Not a historical simulation**: scoring, raids, multiball and modes are original game systems loosely inspired by events (`game-hooks.md` Caveats). The How-to-Play screen says so.
4. **Legend vs fact**: hedge per §11 H-rows; neutral ground, de Soto, Capone's room/tunnels and ghosts are always "legend says" / "reportedly".
5. **People**: living people only in factual trivia, never characters. Deceased historic figures (Capone, Madden, McLaughlin, Rockefeller) appear by name only in fact text; on-screen figures are fictional archetypes with no likeness (`00-INDEX.md`; `gangster-era-and-gambling.md` Caveats flag possible legal review).
6. **Sensitive history**: bombings (Belvedere 1959, Vapors 1963), segregation and medical history are never scored or played for laughs; history cards only.
7. **Horses and sports figures**: fictional horses and slugger; real names only in fact callouts.
8. **Trivia text** comes from the audited bank (`hs-` ids) wherever an id exists.

---

## 15. Gaps (for web research; not in the corpus)

1. Arcade, coin-op and pinball history in Hot Springs (arcades, amusement halls, operators); whether Spa Amusement Co. handled pinball as well as slots.
2. Arkansas law on pinball and coin-operated amusement machines (1930s–1970s bans, "games of skill" rulings) and slot-machine law beyond the 1903/1907/1913 gambling acts and Amendment 100.
3. Duck tours: "National Park Duck Tours" is explicitly not found (vehicle, route, years, lake entry).
4. A citable source for "Spa City" as the town's nickname, and for the "We Bathe the World" motto inside the corpus.
5. The first printed use of "Valley of (the) Vapors" (only a search summary supports it).
6. The Vapors' exterior, sign and neon colours; any 1920s–60s club neon in Hot Springs.
7. Whether the Vapors itself was raided in 1967 (sources list four other clubs and the Southern Club manager's home).
8. Slot-machine models used locally (for an authentic but original reel look).
9. Whittington Park roller coasters (names, dates, appearance).
10. Hot Springs Mountain Tower 2026 status, deck heights, elevator details.
11. Oaklawn racing silks or traditional colours, bugle call, and 2026 meet dates (for an original but grounded Derby mode).
12. Arlington 1924 interior colours (Fountain Room, lobby) and a settled Capone room number.
