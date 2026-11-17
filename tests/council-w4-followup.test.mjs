// Council wave 4, follow-up: S5-29 (the first cue of a rate-limited sound is never dropped, whatever the audio clock says).
import { audio, sfx } from '../src/js/ui/audio.js';

export const tests = [
  {
    name: 'S5-29 the first cue of a rate-limited sound plays even while the audio clock still reads 0, and a repeat inside the limit is dropped', node: true,
    async run(t) {
      const saved = { ctx: audio.ctx, on: audio.on, hold: audio.hold, last: audio.last };
      audio.ctx = { currentTime: 0 }; audio.on = true; audio.hold = false; audio.last = {};
      try {
        sfx('bumper');
        t.equal(audio.last.bumper, 0, 'the first bumper at clock 0 got past the rate limit');
        sfx('target');
        t.equal(audio.last.target, 0, 'and so did the first target');
        audio.ctx.currentTime = 0.01; sfx('bumper');
        t.equal(audio.last.bumper, 0, 'a second bumper 10 ms later is still limited');
        audio.ctx.currentTime = 0.1; sfx('bumper');
        t.equal(audio.last.bumper, 0.1, 'and one after the limit plays');
      } finally { Object.assign(audio, saved); }
    },
  },
];
