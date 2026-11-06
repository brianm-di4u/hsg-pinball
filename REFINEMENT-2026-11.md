# Spa City Pinball refinement, November 2026

**Source fixes integrated. Formal release HOLD.**

The user ended testing early and directed integration of the recorded fixes. This closure records the fixes and retained generated runtime on the game repository’s main branch. Earlier findings and results retain their original scope. Full qualification and production deployment remain unverified. [R41 campaign record](<D:/hsg-campaign/evidence/refinement-2026-11/desktop-director-progress-d9696d13-41ae-427a-bb9e-a366f45ed43c/report.json>)

## Source and publication

- Integrated source tip `6580700afbbe9dba974bc0958a8e1350b495d813`. The original fix commits remain in the main history.
- The root `index.html` was updated from the retained candidate artifact, SHA-256 `80db00180d246c1941690a330de20f0006610a89efa8edd1cbc6af913fc88571`. No additional testing was run for this closure.


The historical publication inventory records `v1.1.0` at commit `1f076fe7d870e08a448f9bdba6913f1742de271b`. The corresponding committed index SHA-256 was `4aff7404ead1ed2fa5d20cae0d87692b0516dd9e8de399bcb29c4dac38107d97`. Current public response bytes and deployment identity still require verification. [Historical site ref inventory](<C:/Video Game Projects/campaigns/refinement-2026-11/preflight/p0-01-attempt1/stdout.txt>) · [Committed index inventory](<C:/Video Game Projects/campaigns/refinement-2026-11/preflight/p0-11-assessment/stdout.txt>)

- Local `codex/ipad-pinball-touch-adcb80a0` at `6580700afbbe9dba974bc0958a8e1350b495d813` in `D:/hsg-campaign/ipad-lane/ipad-pinball-touch-worktree-5bf8c81b-211c-4869-95b0-570c9d238c4e/worktree`.
- Local `refine/2026-11` at `6580700afbbe9dba974bc0958a8e1350b495d813` in `D:/hsg-campaign/worktrees/pinball/desktop-refinement`.

The accepted local candidate runtime index SHA-256 is `80db00180d246c1941690a330de20f0006610a89efa8edd1cbc6af913fc88571`. The candidate build and its source commit are retained separately from the historical shipped body. [Candidate build](<D:/hsg-campaign/ipad-lane/pinball-touch-runtime-7ad3912b-f5fd-4452-a24a-07746d17d36d/pinball/index.html>) · [Candidate source review](<D:/hsg-campaign/evidence/refinement-2026-11/desktop-director-original-suites-72fb0010-1e78-4510-b63f-569e0eb60c05/pinball79-candidate-source-root-review.json>)

## Coverage matrix

The rows record bounded observations by workflow. Formal completion of each applicable workflow and profile is still pending. [Workflow and profile requirements](<C:/Video Game Projects/campaigns/refinement-2026-11/MASTER-PROMPT.md>)

| Workflow | Scoped evidence and remaining work |
| --- | --- |
| WF-01 Build and integrity | Historical preflight retained the committed index and the rebuilt digest. The generated timestamp difference was recorded as a baseline build-integrity failure. |
| WF-02 Feature inventory | Complete feature-to-real-input coverage map remains pending. |
| WF-03 Core loop | A normal three-ball game, high score, retry, pause and quit ran on desktop. Physical iPad launch and sustained two-finger flipper actions were checked in both orientations. |
| WF-04 Input | Physical iPad Safari exercised a full native plunger pull and scoped two-finger flipper hold, move and release in portrait and landscape. |
| WF-05 Layout | The title/playfield overlap was reproduced and the locally corrected desktop player iframe was checked. |
| WF-06 Mechanics | Independent full rules, seeded shadow models and balance comparisons remain pending. |
| WF-07 Persistence | Scoped save behavior is recorded where observed. Full shipped-format, failure-mode and rollback round trips remain pending. |
| WF-08 Audio | Full real-input audio, analyser and recovery evidence remains pending. Human audibility remains unverified. |
| WF-09 Lifecycle | Full lifecycle matrix remains pending. Individual actions are listed in the retained scoped evidence. |
| WF-10 Performance | Original performance assertions and timing are proxy evidence. Real-GPU reference, 30-minute soak and governor evidence remain pending. |
| WF-11 Accessibility | Full keyboard, contrast, scalable text and assistive checks remain pending. |
| WF-12 Content and licensing | Physical Help confirmed touch flippers, Launch and Pause. Landscape keyboard side hints and imprecise nudge wording remain unclassified. |
| WF-13 Player integration | Scoped local player paths were observed in Chrome and Edge. Current formal workflow, exact production routes and candidate smoke remain pending. |
| WF-14 Visual polish | The title/playfield overlap was reproduced and the locally corrected desktop player iframe was checked. |

## Defect log

| Severity | Recorded defect or finding | Local status |
| --- | --- | --- |
| S3 | Title overlapped playfield at desktop size | Integrated fix `850e4dd8af69097b2716c62a44a3446ac508cfb8`. Formal release HOLD. |
| S2 | `IPAD-PINBALL-LAUNCH-SELECTION-001` Sustained Launch press no longer selects text. physical portrait/landscape and desktop input regression passed | Integrated fix `6580700afbbe9dba974bc0958a8e1350b495d813`. Formal release HOLD. |

The integrated changes affect play as follows. The title clears the playfield, and a sustained touch on Launch no longer selects text in the checked Safari views. [Local commit and worktree index](<D:/hsg-campaign/platform-support/release-controller/final-report-readiness-031009b8-9c99-4849-87ee-76e539afcebb/REPORT-READINESS.json>)

## Before and after

Matched original suites passed 79/79 on both bodies, including two slow cases. Seven original opt-in cases remain unrun. Separate local touch work passed two natural desktop profiles and five affected existing cases. [Evidence 1 · 8671](<D:/hsg-campaign/evidence/refinement-2026-11/desktop-pinball-layout-regression-green-af5e6eb1-a357-4f9e-a7aa-2db579fcfa5d/report.json>) · [Evidence 2 · 8720](<D:/hsg-campaign/evidence/refinement-2026-11/desktop-pinball-layout-actual-site-D2-ca190399-3b06-4f59-9cd3-ef1ffcfde3c1/report.json>) · [Evidence 3 · 12415](<D:/hsg-campaign/evidence/refinement-2026-11/desktop-director-pinball-touch-desktop-closure-f4801e16-cb49-4395-9cfa-e5ea748d730e/review.json>) · [Evidence 4 · 12534](<D:/hsg-campaign/evidence/refinement-2026-11/desktop-director-pinball-fast-forward-closure-fa622dad-3e56-495f-bd3a-03001ab9312d/review.json>)

## Evidence tiers

- Installed Chrome and Edge basic player observations are scoped E2 desktop evidence. Hardware qualification and broader workflow coverage remain separate. [Desktop scope and profile limits](<D:/hsg-campaign/evidence/refinement-2026-11/desktop-director-progress-d9696d13-41ae-427a-bb9e-a366f45ed43c/report.json>)
- The original browser suites use their frozen proxy settings and test hooks where applicable. Emulated mobile observations carry browser-proxy scope. [Historical body acceptance](<D:/hsg-campaign/evidence/refinement-2026-11/desktop-director-original-suites-72fb0010-1e78-4510-b63f-569e0eb60c05/pinball79-original-suite-actual-acceptance.json>) · [Fixed candidate acceptance](<D:/hsg-campaign/evidence/refinement-2026-11/desktop-director-original-suites-72fb0010-1e78-4510-b63f-569e0eb60c05/pinball79-candidate-suite-actual-acceptance.json>)
- The physical iPad Safari lane records 4 completed bounded gameplay runs across 5 attempts. The earlier partial-pull run failed its late displacement assertion. A later full-pull trajectory established gate crossing within its own scope. The R8 local route returned 200 with body SHA-256 `67b5c4c40ea873be48b3c0d8af350ff73e49aaf7e3f9e6140b3da06396235f82`. The last gameplay body SHA-256 was `80db00180d246c1941690a330de20f0006610a89efa8edd1cbc6af913fc88571` before the subsequent local source commit. Physical iPad scope is recorded separately from the Android and WebKit proxy tiers. [Physical iPad route](<D:/hsg-campaign/evidence/refinement-2026-11/ipad-route-verification-r8-9157fa31-c2c2-46ee-a788-e9bb70e3a59e/route-report.json>) · [Physical iPad gameplay](<D:/hsg-campaign/evidence/refinement-2026-11/ipad-final-report-c14434a9-3a6e-49f6-83fa-a1bea341c260/FINAL-REPORT.json>) · [Subsequent local commit](<D:/hsg-campaign/evidence/refinement-2026-11/desktop-director-pinball-touch-commit-closure-f7e1bc46-4be9-4920-a30f-0faa52fc5071/review.json>)

## Coverage left open at closure

- Matched original 79 on both builds, including slow cases. Seven opt-in cases remain unrun. Physical portrait/landscape touch regression is scoped. Audio, hardware and complete natural workflows remain open.
- Full A1 and A2 Android Chrome workflow evidence, the complete device and mode matrix, all historical save/rollback paths, independent rounds and production smoke remain pending. [R41 campaign record](<D:/hsg-campaign/evidence/refinement-2026-11/desktop-director-progress-d9696d13-41ae-427a-bb9e-a366f45ed43c/report.json>)

## Not Covered

No approved exclusions. Pending work is listed above.

## Manual checklist candidates

- Real iPhone Safari, Android handset performance and heat, and audible-output review remain for the end-of-campaign manual checklist. [Manual-checklist requirement](<C:/Video Game Projects/campaigns/refinement-2026-11/MASTER-PROMPT.md>)
