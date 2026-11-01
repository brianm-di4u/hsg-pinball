// The Spa City table: every wall, post, toy, switch and lamp, in millimetres (+y up the table). An original layout.
// Lower playfield is mirror-symmetric about CX; features above are placed from tools/shot-map.mjs results.
import { LAYER } from './physics.js';

export const W = 522, H = 1100, CX = 242.5;
const mx = (x) => 2 * CX - x;                                      // mirror across the playfield centre
const mirror = (pts) => pts.map(([x, y, z]) => (z === undefined ? [mx(x), y] : [mx(x), y, z])).reverse();
const arc = (cx, cy, r, a0, a1, n = 16) => {
  const out = [];
  for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * (i / n); out.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); }
  return out;
};
const deg = (d) => (d * Math.PI) / 180;

const walls = [], circles = [], triggers = [], holes = [], ramps = [], lamps = [];
const wall = (pts, o = {}) => walls.push({ ...o, pts });
const post = (x, y, r = 5, o = {}) => circles.push({ x, y, r, kind: 'POST', e: 0.7, ...o });

// ---------------------------------------------------------------------------------------------------- cabinet
const ARCH_Y = 830, ARCH_R = (518 - 10) / 2, ARCH_CX = 10 + ARCH_R;
// left wall, the top arch, the shooter lane's outer wall: one rail
wall([[10, 0], [10, ARCH_Y], ...arc(ARCH_CX, ARCH_Y, ARCH_R, Math.PI, 0, 40).slice(1), [518, 0]].reverse(), { r: 4, e: 0.3, name: 'rail' });

// shooter lane inner wall; the lane is x 483..514
wall([[479, 40], [479, 845]], { r: 4, e: 0.3, name: 'laneWall' });
// one-way gate across the lane top: lets the ball out (moving +y), blocks it coming back down
wall([[483, 849], [511, 867]], { kind: 'GATE', r: 2, e: 0.2, name: 'laneGate', vis: 'gate' });

// ---------------------------------------------------------------------------------------------------- lower playfield (left; mirrored)
const lowerLeft = () => {
  const L = [];
  // outlane / inlane divider with its post
  L.push({ pts: [[52, 330], [52, 212]], r: 4, e: 0.5, kind: 'RUBBER', name: 'divider' });
  // inlane guide down to the flipper
  L.push({ pts: [[52, 212], [131, 152]], r: 4, e: 0.3, name: 'inlaneGuide' });
  // slingshot: the kicker face first, then the two plain sides
  L.push({ pts: [[96, 322], [140, 196]], r: 5, e: 0.7, kind: 'SLING', kick: 1100, kickMin: 160, sw: 'sling', name: 'sling' });
  L.push({ pts: [[140, 196], [96, 229], [96, 322]], r: 4, e: 0.5, kind: 'RUBBER', name: 'slingBody' });
  return L;
};
for (const l of lowerLeft()) {
  wall(l.pts, { ...l, sw: l.sw ? l.sw + 'L' : undefined, name: l.name + 'L' });
  wall(mirror(l.pts), { ...l, sw: l.sw ? l.sw + 'R' : undefined, name: l.name + 'R' });
}
post(52, 330, 6, { name: 'divPostL' }); post(mx(52), 330, 6, { name: 'divPostR' });
// outlane and inlane rollovers
triggers.push({ a: [14, 290], b: [48, 290], sw: 'outL', name: 'outL' });
triggers.push({ a: [56, 290], b: [92, 290], sw: 'inL', name: 'inL' });
triggers.push({ a: [mx(48), 290], b: [mx(14), 290], sw: 'outR', name: 'outR' });
triggers.push({ a: [mx(92), 290], b: [mx(56), 290], sw: 'inR', name: 'inR' });

const FLIP = { len: 82, r0: 13, r1: 6.5, stroke: deg(54), acc: 2600, maxOmega: 32, retAcc: 1500, maxRet: 24, e: 0.58, f: 0.14 };
const flippers = [
  { side: 'L', x: 147.5, y: 130, rest: deg(-32), dir: 1, ...FLIP },
  { side: 'R', x: mx(147.5), y: 130, rest: deg(180 + 32), dir: -1, ...FLIP },
];

// ---------------------------------------------------------------------------------------------------- upper playfield
// Central Avenue: the left orbit lane (x 14..58), with a spinner, up into the arch. A rubber deflector below its
// mouth turns a ball coming down the lane toward the left inlane instead of straight into the outlane.
wall([[10, 500], [52, 432]], { r: 4, e: 0.5, kind: 'RUBBER', name: 'orbitDeflector' });
post(52, 432, 5);
wall([[62, 560], [62, 880]], { r: 4, e: 0.35, name: 'orbitWall' });
post(62, 560, 6, { name: 'orbitPostLow' }); post(62, 880, 5, { name: 'orbitPostTop' });
triggers.push({ a: [14, 700], b: [58, 700], sw: 'spinner', spinner: true, name: 'spinner', vis: 'spinner' });
triggers.push({ a: [14, 820], b: [58, 820], sw: 'orbitTop', oneWay: true, name: 'orbitTop' });
triggers.push({ a: [58, 600], b: [14, 600], sw: 'orbitDown', oneWay: true, name: 'orbitDown' });

// The Vapors: a scoop at the end of a short lane aimed at the right flipper
export const VAP = { x: 138, y: 585 };
{
  const fx = mx(147.5) - 30, fy = 110;
  let ux = fx - VAP.x, uy = fy - VAP.y; const L = Math.hypot(ux, uy); ux /= L; uy /= L;  // toward the flipper
  const px = -uy, py = ux;                                                               // across the lane
  const P = (s, t) => [VAP.x + ux * s + px * t, VAP.y + uy * s + py * t];
  wall([P(58, 21), P(-12, 21), P(-36, 0), P(-12, -21), P(58, -21)], { r: 4, e: 0.25, name: 'vaporsLane' });
  post(...P(58, 21), 5); post(...P(58, -21), 5);
  holes.push({ x: VAP.x, y: VAP.y, r: 13, maxSpeed: 2600, sw: 'vapors', name: 'vapors',
    kickAngle: Math.atan2(300 - VAP.y, 190 - VAP.x), kickSpeed: 1250, vis: 'scoop' });
  triggers.push({ a: P(50, 19), b: P(50, -19), sw: 'vaporsEnter', name: 'vaporsEnter' });
}

// Bathhouse Row: eight standup targets in Row order, north (left) to south (right), in two banks of four
export const BATHHOUSES = ['Superior', 'Hale', 'Maurice', 'Fordyce', 'Quapaw', 'Ozark', 'Buckstaff', 'Lamar'];
const bank = (a, b, names) => {
  const n = names.length, gap = 0.12;
  for (let i = 0; i < n; i++) {
    const t0 = (i + gap / 2) / n, t1 = (i + 1 - gap / 2) / n;
    const p0 = [a[0] + (b[0] - a[0]) * t0, a[1] + (b[1] - a[1]) * t0];
    const p1 = [a[0] + (b[0] - a[0]) * t1, a[1] + (b[1] - a[1]) * t1];
    wall([p0, p1], { kind: 'TARGET', r: 4.5, e: 0.45, sw: 'bh' + names[i], name: 'bh' + names[i], vis: 'target' });
  }
  // a back rail behind the faces, so the bank is solid from above
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  let nx = -(b[1] - a[1]) / L, ny = (b[0] - a[0]) / L;
  if (ny < 0) { nx = -nx; ny = -ny; }  // the back faces up the table
  wall([[a[0] + nx * 9, a[1] + ny * 9], [b[0] + nx * 9, b[1] + ny * 9]], { r: 3, e: 0.3, name: 'bankBack', vis: 'bankBack' });
};
bank([117, 650], [203, 694], BATHHOUSES.slice(0, 4));
bank([mx(203), 694], [mx(117), 650], BATHHOUSES.slice(4));
post(117, 650, 5); post(mx(117), 650, 5);
wall([[199, 703], [218, 712]], { r: 3, e: 0.3, name: 'bankJoinL', vis: 'bankBack' });
wall([[mx(218), 712], [mx(199), 703]], { r: 3, e: 0.3, name: 'bankJoinR', vis: 'bankBack' });

// The Arlington: a centre lane up to the ball lock
wall([[218, 700], [218, 760]], { r: 4, e: 0.3, name: 'lockLaneL' });
wall([[mx(218), 700], [mx(218), 760]], { r: 4, e: 0.3, name: 'lockLaneR' });
post(218, 700, 5); post(mx(218), 700, 5);
holes.push({ x: CX, y: 740, r: 12, maxSpeed: 1600, sw: 'lock', name: 'lock', kickAngle: -Math.PI / 2, kickSpeed: 700, vis: 'saucer' });
triggers.push({ a: [222, 708], b: [mx(222), 708], sw: 'lockEnter', oneWay: true, name: 'lockEnter' });
// the lane is closed at the top (the Arlington stands behind it), so the lock is only reached from below
wall([[218, 760], [mx(218), 760]], { r: 4, e: 0.3, name: 'lockBack' });
// the Arlington toy's footprint is solid, so the ball never rolls through it
wall([[219, 762], [219, 784], [mx(219), 784], [mx(219), 762]], { r: 3, e: 0.3, name: 'arlingtonBlock', vis: 'none' });

// Reserve Street: the channel between the south bank and the ramp block, up into the top of the table
triggers.push({ a: [372, 760], b: [437, 760], sw: 'reserve', oneWay: true, name: 'reserve' });

// Thermal springs: three pop bumpers
circles.push({ x: 150, y: 878, r: 25, kind: 'BUMPER', kick: 1500, e: 0.6, sw: 'bumper1', name: 'bumper1', vis: 'bumper' });
circles.push({ x: 252, y: 878, r: 25, kind: 'BUMPER', kick: 1500, e: 0.6, sw: 'bumper2', name: 'bumper2', vis: 'bumper' });
circles.push({ x: 192, y: 818, r: 25, kind: 'BUMPER', kick: 1500, e: 0.6, sw: 'bumper3', name: 'bumper3', vis: 'bumper' });

// S · P · A top lanes
// lane guides reach up toward the arch, their tops 20 mm clear of a ball riding the arch: a ball rolling along the arch drops into the lane
// where it runs out of speed, so plunge strength picks the lane (the skill shot)
const archY = (x) => ARCH_Y + Math.sqrt(ARCH_R * ARCH_R - (x - ARCH_CX) ** 2);
for (const x of [336, 376, 416, 456]) { const top = ARCH_Y + Math.sqrt(216.5 ** 2 - (x - ARCH_CX) ** 2); wall([[x, 902], [x, top]], { r: 4, e: 0.4, name: 'laneGuide' }); post(x, top, 4.5); }
[['S', 356], ['P', 396], ['A', 436]].forEach(([l, x]) => triggers.push({ a: [x + 15, 920], b: [x - 15, 920], sw: 'lane' + l, name: 'lane' + l, vis: 'rollover' }));

// Mountain Tower ramp: an angled mouth aimed along left-flipper shots, up the right side, a tight turnaround inside
// the arch, then a wire down over the shooter lane into the right inlane. Layer 1 cannot reach the block under it.
export const RAMP = { E0: [392, 470], d: [0.45, 0.893], hw: 26 };
{
  const [ex, ey] = RAMP.E0, [dx, dy] = RAMP.d, px = dy, py = -dx, hw = RAMP.hw;
  const at = (s, t) => [ex + dx * s + px * t, ey + dy * s + py * t];
  // a 52 mm mouth that narrows to 38 mm as it climbs
  const L0 = at(0, -hw), R0 = at(0, hw), L1 = at(70, -19), R1 = at(70, 19);
  // playfield side: the block boundary (also the ramp's left rail)
  wall([L0, L1, [441, 610], [441, 832]], { r: 4, e: 0.3, mask: LAYER.FIELD | LAYER.RAMP, name: 'rampBlockL', vis: 'rampRail' });
  wall([R0, [479, R0[1]]], { r: 4, e: 0.3, name: 'rampBlockLow' });
  wall([[441, 832], [479, 845]], { r: 4, e: 0.3, name: 'rampBlockTop' });
  post(...L0, 6, { name: 'rampPostL' }); post(...R0, 6, { name: 'rampPostR' });
  // ramp side (layer 2): right rail, the divider between the climb and the descent, the turnaround
  wall([R0, R1], { r: 2.5, e: 0.3, mask: LAYER.FIELD | LAYER.RAMP, name: 'rampMouthR', vis: 'rampRail' });
  wall([R1, [478.5, 590], [478.5, 820]], { r: 2.5, e: 0.3, mask: LAYER.RAMP, name: 'rampInner', vis: 'rampRail' });
  wall([[441, 820], ...arc(478.5, 820, 37.5, Math.PI, 0, 16).slice(1), [516, 780]], { r: 3, e: 0.3, mask: LAYER.RAMP, name: 'rampOuter', vis: 'rampRail' });
  triggers.push({ a: at(10, -hw + 2), b: at(10, hw - 2), sw: 'rampEnter', layer: [LAYER.FIELD, LAYER.RAMP], mask: LAYER.FIELD | LAYER.RAMP, name: 'rampEnter' });
  // crossing downward in the descent moves the ball from the ramp to the wire
  triggers.push({ a: [513, 800], b: [482, 800], sw: 'rampMade', layer: [LAYER.RAMP, LAYER.WIRE], mask: LAYER.RAMP | LAYER.WIRE, name: 'rampMade' });
  ramps.push({ name: 'towerRamp', layer: LAYER.RAMP, pts: [[ex, ey, 0], [423, 532, 20], [459.5, 620, 40], [459.5, 800, 66], [478.5, 852, 70], [498, 800, 72], [498, 780, 72]] });
}
// wire return (layer 4)
wall([[481, 805], [481, 440], [425, 392], [400, 362]], { r: 2.5, e: 0.2, mask: LAYER.WIRE, name: 'wireL', vis: 'wire' });
wall([[515, 805], [515, 430], [465, 372], [432, 350]], { r: 2.5, e: 0.2, mask: LAYER.WIRE, name: 'wireR', vis: 'wire' });
ramps.push({ name: 'towerWire', layer: LAYER.WIRE, pts: [[498, 800, 72], [498, 600, 58], [498, 440, 42], [458, 382, 24], [414, 352, 8]] });
// crossing toward the inlane (+n) takes a wire ball down to the playfield; field balls never see this trigger
triggers.push({ a: [400, 364], b: [432, 352], sw: 'wireDrop', layer: [LAYER.WIRE, LAYER.FIELD], mask: LAYER.WIRE, name: 'wireDrop' });

// ---------------------------------------------------------------------------------------------------- shooter
const plunger = { x0: 485, x1: 512, y: 90, maxPull: 50, pullRate: 40, maxVel: 1750, e: 0.25 };
triggers.push({ a: [483, 300], b: [514, 300], sw: 'shooterLane', name: 'shooterLane' });

export const spec = {
  name: 'Spa City', width: W, height: H, drainY: 30, rollDamp: 0.03,
  walls, circles, triggers, holes, ramps, flippers, plunger, lamps,
  shooterLane: { x0: 483, x1: 514, y1: 140 },
  extraSwitches: [],
};
