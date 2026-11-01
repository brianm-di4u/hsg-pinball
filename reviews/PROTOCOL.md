# Adversarial visual review loop: protocol

Adapted from `games/Cart Racing/reviews/PROTOCOL.md` (Spa City Tub Rally, itself adapted from football's loop), with
its fixes kept: the A/B rule, a plateau on the best total, a reserved big-lever slot, a prosecutor to balance the
advocate. `RUBRIC.md` defines the scores, `schema.json` the output shape, `briefs/` the role prompts.

## Roles
| Role | Who | Sees | Must not see |
|---|---|---|---|
| Critic A | Claude subagent, `briefs/critic.md` | this loop's captures and A/B pairs, rubric, loop brief | prior scores, `HISTORY.md`, `ab-key.json`, other `loop-*` folders, other reviewers |
| Critic B | Codex (GPT-6.1 Sol) via `codex:codex-rescue`, `briefs/critic.md` + `briefs/codex-wrapper.md` | same as Critic A | same as Critic A |
| Prosecutor | Claude subagent, `briefs/prosecutor.md` | both critiques, captures, `CHANGES.md` | `HISTORY.md`, `ab-key.json`, the advocate |
| Advocate | Claude subagent, `briefs/advocate.md` | both critiques, captures, `CHANGES.md` | `HISTORY.md`, `ab-key.json`, the prosecutor |
| Judge | Claude subagent, `briefs/judge.md` | everything above, `HISTORY.md` (trend only), gates | `ab-key.json` |

The developer (the main session) writes `CHANGES.md` (facts only), opens every capture before the review, and never
edits a reviewer's output. Claude reviewers write their own output file (`loop-N/<role>.md`) and touch nothing else;
Codex either runs read-only with its reply saved verbatim, or (from loop 5) writes its own `critic-codex.md` and
nothing else.

## The loop (N = loop number)
1. `npm run build`; the full test suite green.
2. Measured gates → `loop-N/gates.json` (`node tools/review-gates.mjs N`).
3. Captures: `REVIEW=1 node shared/test-harness/run.mjs . --file review --gpu --milestone review-loop-N --clean`.
4. `node tools/review-sheets.mjs N`: motion strips, contact sheets, A/B pairs against loop N−1 (seeded side).
5. The developer opens every capture and writes `loop-N/CHANGES.md`.
6. `node tools/review-prep.mjs N` writes the briefs.
7. Critics A and B in parallel → prosecutor and advocate in parallel → judge.
8. `node tools/review-tally.mjs N`: validates the JSON blocks, applies the A/B rule, writes `scores.json` and
   `gaps.json`, updates `HISTORY.md`, applies the stop rule, prints the backlog.
9. Develop the selected backlog; sync to `repos/hsg-pinball` and commit with `reviews/loop-N/` (PNGs stay
   git-ignored); then N+1.

## Scoring rules
- **A/B rule:** a category's score may differ from the last loop only in the direction both critics' blind A/B
  verdicts agree on; otherwise the tally holds the previous score.
- **A/B void:** the judge may set `"abWeight": {"<category>": 0}` with evidence that a category's pairs are invalid.
- **Backlog:** priority = expectedGain × weight ÷ cost (weight 1.5 below the gate, 1.0 otherwise, 0.3 once 1 above;
  cost S = 1, M = 2, L = 4). The best large gap takes a reserved big-lever slot; the rest fill 8 effort points. A
  category that falls by 0.5 or more forces a regression gap to the top.

## Stop rule (agreed with the user, 2026-11-01)
- **Pass:** every category meets its gate and every measured gate passes.
- **Plateau:** 3 loops in a row without a new best total (at least 1.0 above the previous best).
- **Cap:** loop 10.

Loops run back to back without pausing. On stop: a campaign section in `REPORT.md` with the final scores and gaps.

## Effects allowed in the renderer
Only stateless effects (no temporal accumulation), so captures repeat; captures freeze the render clock with
`__game.act('clock', ms)`.
