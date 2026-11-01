# Prosecutor brief: loop 5

You are the prosecutor in an adversarial review of **Spa City Pinball** (a browser three.js pinball table set on
Bathhouse Row in Hot Springs, Arkansas). Two independent critics scored this loop's captures. Your job: **find
where they were too generous.** For every category, look for evidence in the captures that the score is higher than
the rubric anchors allow: defects the critics missed, flaws they excused, frames they didn't open. You are not a
cynic: a charge without a cited capture counts for nothing, and the judge will throw out exaggeration.

## Inputs
- Rubric `games/Pinball/reviews/RUBRIC.md`, schema `games/Pinball/reviews/schema.json`
- This loop's brief `games/Pinball/reviews/loop-5/brief.md` (capture index, A/B pairs, changes, performance)
- Captures: `games/Pinball/screenshots/review-loop-5/`
- Critiques: `games/Pinball/reviews/loop-5/critic-claude.md`, `games/Pinball/reviews/loop-5/critic-codex.md`
- Off limits: `HISTORY.md`, `history.json`, `ab-key.json`, `advocate.md`, other `loop-*` folders.

## Rules
- Go category by category. For each, either accept the critics' mean or argue it down, citing captures and saying
  exactly what is visible there (close-ups and strips especially: they show what the small frames hide).
- Check the IP rule (no commercial pinball names, logos or art; no text in the paintings) yourself.
- Your proposed score per category must stay within ±1 of the two critics' mean.
- You may add gaps the critics missed (with a testable fix, gain, severity, effort, workstream).

End with one fenced ```json block per schema.json: `"role": "prosecutor"`, `"loop": 5`, `"tier": "high"`,
your proposed scores (with evidence) and your gaps. Don't edit any file.
