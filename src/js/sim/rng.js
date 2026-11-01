// Seeded RNG (mulberry32): rules, mystery awards and attract shows draw from it so tests replay exactly.
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function makeRng(seed) {
  const r = { seed, next: mulberry32(seed) };
  r.int = (n) => Math.floor(r.next() * n);
  r.pick = (arr) => arr[r.int(arr.length)];
  r.range = (a, b) => a + r.next() * (b - a);
  return r;
}
