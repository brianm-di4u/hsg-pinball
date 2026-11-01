# Judge brief: loop 7

You are the judge in an adversarial visual review of **Spa City Pinball** (a browser three.js pinball table on Bathhouse Row,
Hot Springs, Arkansas), set against shipped digital pinball. You reconcile two blind critics, a
prosecutor and an advocate into the loop's final scores and a ranked gap list. That list drives the next
development loop.

## Inputs
- Rubric `games/Pinball/reviews/RUBRIC.md` (anchors, gates, evidence rule), schema `games/Pinball/reviews/schema.json`
- Loop brief `games/Pinball/reviews/loop-7/brief.md`, perf `games/Pinball/reviews/loop-7/perf.json`
- Measured gates for this loop:
```json
{
  "loop": 7,
  "perf": {
    "pass": true,
    "desktop": {
      "k": "desktop-gpu",
      "fps": 60.4,
      "taskMs": 3.94,
      "tier": "high"
    },
    "throttled": {
      "k": "phone-throttled",
      "fps": 36.8,
      "taskMs": 6.61,
      "tier": "high"
    },
    "swiftshader": {
      "k": "phone-swiftshader",
      "fps": 55.7,
      "taskMs": 2.73,
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
- Captures `games/Pinball/screenshots/review-loop-7/`
- `games/Pinball/reviews/loop-7/critic-claude.md`, `critic-codex.md`, `prosecutor.md`, `advocate.md`
- History `games/Pinball/reviews/HISTORY.md`: earlier judged scores, for trend only. Don't anchor on them; score what is on
  screen now. Off limits: `ab-key.json` (the A/B rule is applied mechanically after you, from the critics' verdicts).

## Rules
- **Open the captures yourself.** For every category where the critics differ by more than 1.0, or where the
  prosecutor and advocate disagree by more than 1.0, cite at least one close-up or strip you checked and say who was
  right.
- **Final score per category:** your own judgement on the rubric anchors, with at least 2 cited captures. Drop any
  uncited claim.
- **IP:** if anyone reported a commercial pinball name, logo or art, or text inside a painting, check it and rule
  on it; a real hit is a severity-5 gap in the affected category.
- **Gaps:** merge duplicates, fix wrong causes, rank by expected gain ÷ effort, and keep the top 12. Each needs a
  concrete, testable fix ("a soft contact shadow under each bathhouse toy", not "better lighting") and a
  workstream. Flag at most one large (L) gap as the loop's big lever if it is the main thing holding a category back.
- **Verdict:** `stop-pass` if every category meets its gate, otherwise `continue`. The tally applies the A/B rule,
  the measured gates and the plateau rule.


Write a short ruling per category, then the ranked gaps. End with one fenced ```json block per schema.json:
`"role": "judge"`, `"loop": 7`, `"tier": "high"`, plus `"verdict"`. Don't edit any file.
