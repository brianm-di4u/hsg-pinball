// Shared by S6-07 (council-w1-a1), S6-08 (council-w3-c) and AC31 (m5): put the game under enough CPU load that its frames are slow, then wait for the
// quality governor. Not a test file itself (the harness runs only *.test.mjs).
// The governor steps down when the median frame is slower than GOV.slowMs (24 ms, src/js/gfx/view3d.js). A 4x CPU throttle is meant to
// get a phone-class device there, but a fast desktop with a real GPU still draws 60 fps at 4x, and the governor then rightly keeps its
// tier. So raise the throttle until the frames really are slow (or give up at 32x), and only then expect the step down.
const SLOW_FPS = 1000 / 24;
export async function loadUntilSlow(t) {
  for (const rate of [4, 8, 16, 32]) {
    await t.cpuThrottle(rate);
    const fc = await t.frameCost(1500);
    if (fc.fps < SLOW_FPS) return { rate, fps: fc.fps };
    t.log(`at ${rate}x throttle the frames are not slow (${fc.fps} fps), so the governor has nothing to act on yet`);
  }
  return null;
}
export async function governorUnderLoad(t) {
  const load = await loadUntilSlow(t);
  let s = await t.state();
  for (let i = 0; load && i < 60 && s.tier !== 'low' && s.tier !== null; i++) { await t.page.waitForTimeout(500); s = await t.state(); }   // it steps down every ~2 slow windows
  await t.cpuThrottle(4);
  const fc = await t.frameCost(3000);   // what a player gets at 4x once the governor has acted
  await t.cpuThrottle(1);
  return { load, s: await t.state(), fc };
}
