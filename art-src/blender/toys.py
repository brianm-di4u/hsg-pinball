# Spa City Pinball: 3D toy models, built procedurally and exported as one GLB each.
#   "C:\Program Files\Blender Foundation\Blender 5.2\blender.exe" -b --factory-startup --python art-src/blender/toys.py -- art-src/models [name ...] [--no-preview] [--review <dir>]
# Conventions (the game code depends on them):
#   - real scale in metres, Blender Z up (the glTF exporter converts to +Y up), front of every toy faces -Y
#   - one GLB per model: <out>/<name>.glb, transforms applied; origin as noted per model
#   - materials are solid Principled BSDF colours (sRGB hex from research/town-content.md), no image textures
#   - names the code drives: glass_lit, glass_dark, neon_turquoise, neon_coral, sign_panel, bumper_body,
#     bumper_cap (top face UV disc 0..1), flipper_body, flipper_rubber, spinner_plate (UV 0..1 both faces)
# After building, every GLB is re-read (JSON + binary) and checked: node names, material names, triangles, bounds.
# Then the GLBs are re-imported into a clean scene and rendered as a contact sheet: <out>/preview.png.
import bpy, bmesh, math, os, sys, json, struct, random
from mathutils import Vector

ARGS = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
REVIEW = None
if '--review' in ARGS:
    i = ARGS.index('--review'); REVIEW = os.path.abspath(ARGS[i + 1]); del ARGS[i:i + 2]
NO_PREVIEW = '--no-preview' in ARGS
ARGS = [a for a in ARGS if not a.startswith('--')]
OUT = os.path.abspath(ARGS[0] if ARGS else os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'models'))
ONLY = set(ARGS[1:])
os.makedirs(OUT, exist_ok=True)
PI = math.pi

def srgb(h):
    h = h.lstrip('#'); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(((x + 0.055) / 1.055) ** 2.4 if x > 0.04045 else x / 12.92 for x in c)

# ---------- materials (one datablock per name, so names stay exact across models) ----------
_mats = {}
def mat(name, color, metal=0.0, rough=0.5, coat=0.0, emit=0.0, alpha=1.0):
    if name in _mats: return _mats[name]
    m = bpy.data.materials.new(name)
    if m.node_tree is None:
        m.use_nodes = True
    b = next(n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED')
    b.inputs['Base Color'].default_value = (*srgb(color), 1)
    b.inputs['Metallic'].default_value = metal
    b.inputs['Roughness'].default_value = rough
    if coat: b.inputs['Coat Weight'].default_value = coat; b.inputs['Coat Roughness'].default_value = 0.08
    if emit: b.inputs['Emission Color'].default_value = (*srgb(color), 1); b.inputs['Emission Strength'].default_value = emit
    if alpha < 1:
        b.inputs['Alpha'].default_value = alpha
        try: m.surface_render_method = 'BLENDED'
        except Exception: pass
    m.diffuse_color = (*srgb(color), alpha)
    _mats[name] = m
    return m

M = {  # name: (hex, metallic, roughness, coat, emission, alpha)
    # brick / stucco / stone: rough 0.7-0.85; tile: semi-gloss 0.35; copper: metal 1, rough 0.4 (+ verdigris patina)
    'stucco': ('#F3EFE6', 0, 0.82), 'cream_brick': ('#E6D7B5', 0, 0.8), 'stone_trim': ('#D9CFBA', 0, 0.72),
    'yellow_brick': ('#E3CF94', 0, 0.8), 'lozenge_brick': ('#6E4B2F', 0, 0.78), 'buff_brick': ('#D8C29A', 0, 0.8),
    'tan_trim': ('#B89A6A', 0, 0.72), 'red_tile': ('#A9432C', 0, 0.35, 0.15), 'red_tile_shadow': ('#7E2F1F', 0, 0.4),
    'green_tile': ('#4E7D5B', 0, 0.35, 0.3), 'terra_cotta': ('#C46A3E', 0, 0.7), 'iron': ('#1F2A24', 0.6, 0.45),
    'copper': ('#B87333', 1, 0.4), 'copper_patina': ('#5E9E88', 0.25, 0.6), 'bronze': ('#6B4E2E', 1, 0.4),
    'brass': ('#C9A23F', 1, 0.3), 'gold': ('#D4AF37', 1, 0.28), 'sash': ('#F7F4EC', 0, 0.5),
    'skylight_cobalt': ('#2B4C9B', 0, 0.12, 0.5), 'skylight_amber': ('#D9A23A', 0, 0.12, 0.5),
    'dome_buff': ('#D8C29A', 0, 0.35, 0.3), 'dome_tan': ('#B89A6A', 0, 0.35, 0.3), 'dome_cream': ('#EFE4C8', 0, 0.35, 0.3),
    'dome_ochre': ('#C8963E', 0, 0.35, 0.3), 'turquoise_tile': ('#3FA8A0', 0, 0.35, 0.4),
    'roof_flat': ('#8F897F', 0, 0.9), 'glass_dark': ('#1C2A36', 0, 0.1), 'glass_lit': ('#F2C46D', 0, 0.25),
    'arlington_brick': ('#E8D49C', 0, 0.8), 'shadow': ('#3A3A38', 0, 0.9),
    'tower_steel': ('#BFC4C9', 0.7, 0.35), 'deck_white': ('#EEF0EE', 0, 0.5), 'deck_floor': ('#6E7378', 0, 0.8),
    'concrete': ('#A9A49A', 0, 0.85), 'roof_dark': ('#4A4F55', 0, 0.6),
    'vapors_stone': ('#D9CBB0', 0, 0.8), 'canopy_white': ('#F4F2EC', 0, 0.45), 'sign_body': ('#24434F', 0.2, 0.45),
    'sign_panel': ('#F2EEE4', 0, 0.4), 'starburst_gold': ('#D9B44A', 1, 0.3),
    'neon_turquoise': ('#40E0D0', 0, 0.3, 0, 1.0), 'neon_coral': ('#FF6F61', 0, 0.3, 0, 1.0),
    'bumper_base': ('#141414', 0, 0.4), 'chrome': ('#E6E8EA', 1, 0.12),
    'bumper_body': ('#F4EEDC', 0, 0.25, 0, 0, 0.8), 'bumper_cap': ('#F3EFE6', 0, 0.35, 0.4),
    'flipper_body': ('#F5F3EE', 0, 0.3, 0.5), 'flipper_rubber': ('#C8202A', 0, 0.65),
    'spinner_plate': ('#E9E6DF', 0.3, 0.35),
}
def mt(name):
    p = list(M[name]) + [None, 0, 0.5, 0, 0, 1.0][len(M[name]):]
    return mat(name, p[0], p[1], p[2], p[3], p[4], p[5])

# ---------- geometry helpers ----------
def link(ob):
    bpy.context.scene.collection.objects.link(ob); return ob

def bevel(ob, w=0.00025, seg=2, angle=40):
    md = ob.modifiers.new('bv', 'BEVEL'); md.width = w; md.segments = seg
    md.limit_method = 'ANGLE'; md.angle_limit = math.radians(angle)
    return ob

def loft(rings, mats, name='part', caps=(True, True), closed=False, face_mat=None, cap_mat=0, uv=None, recalc=True):
    """Skin consecutive point loops (each a closed loop, CCW seen from the profile's 'up').
    Coincident points merge, so a ring of identical points is a pole and collapsed faces drop out."""
    bm = bmesh.new(); vmap = {}
    def V(p):
        k = (round(p[0], 8), round(p[1], 8), round(p[2], 8))
        v = vmap.get(k)
        if v is None: v = vmap[k] = bm.verts.new(k)
        return v
    R = [[V(p) for p in ring] for ring in rings]
    def F(vs, mi):
        out = []
        for v in vs:
            if not out or out[-1] is not v: out.append(v)
        while len(out) > 1 and out[0] is out[-1]: out.pop()
        if len(out) < 3 or len(set(out)) != len(out): return
        try: bm.faces.new(out).material_index = mi
        except ValueError: pass
    js = list(range(len(R) - 1)) + ([len(R) - 1] if closed else [])
    for j in js:
        a, b = R[j], R[(j + 1) % len(R)]
        n = len(a)
        for i in range(n):
            i2 = (i + 1) % n
            F((a[i], a[i2], b[i2], b[i]), face_mat(j, i) if face_mat else 0)
    if caps[0]: F(R[0][::-1], cap_mat)
    if caps[1]: F(R[-1], cap_mat)
    if recalc: bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    if uv:
        lay = bm.loops.layers.uv.new('UVMap')
        for f in bm.faces:
            for l in f.loops: l[lay].uv = uv(l.vert.co)
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    for m in (mats if isinstance(mats, (list, tuple)) else [mats]): me.materials.append(m)
    return link(bpy.data.objects.new(name, me))

def blk(x0, x1, y0, y1, z0, z1, m, bv=0.0, seg=2, name='blk'):
    r = lambda z: [(x0, y0, z), (x1, y0, z), (x1, y1, z), (x0, y1, z)]
    ob = loft([r(z0), r(z1)], m, name, recalc=False)
    if bv: bevel(ob, bv, seg)
    return ob

def lathe(profile, mats, segs=32, cx=0.0, cy=0.0, z0=0.0, a0=0.0, caps=True, closed=False, face_mat=None, uv=None, name='lathe'):
    rings = [[(cx + r * math.cos(a0 + 2 * PI * i / segs), cy + r * math.sin(a0 + 2 * PI * i / segs), z0 + z) for i in range(segs)] for r, z in profile]
    return loft(rings, mats, name, (caps, caps), closed, face_mat, 0, uv)

def prism_xz(pts, y0, y1, m, name='prism'):
    """Polygon in the XZ plane (the facade plane) extruded along Y from y0 to y1."""
    return loft([[(x, y0, z) for x, z in pts], [(x, y1, z) for x, z in pts]], m, name)

def prism_yz(pts, x0, x1, m, name='prism'):
    return loft([[(x0, y, z) for y, z in pts], [(x1, y, z) for y, z in pts]], m, name)

def tube(path, r, m, closed=False, sides=6, normal=None, name='tube'):
    """Round tube along a polyline. `normal` is the path's plane normal (keeps the rings from twisting)."""
    P = [Vector(p) for p in path]; n = len(P); rings = []
    for i in range(n):
        if closed: t = P[(i + 1) % n] - P[i - 1]
        else: t = P[min(i + 1, n - 1)] - P[max(i - 1, 0)]
        t.normalize()
        ref = Vector(normal) if normal else t.orthogonal()
        u = t.cross(ref)
        if u.length < 1e-9: u = t.orthogonal()
        u.normalize(); v = t.cross(u)
        rings.append([tuple(P[i] + r * (math.cos(2 * PI * k / sides) * u + math.sin(2 * PI * k / sides) * v)) for k in range(sides)])
    return loft(rings, m, name, (not closed, not closed), closed)

def strut(p0, p1, r, m, sides=6, name='strut'):
    return tube([p0, p1], r, m, sides=sides, name=name)

def hip(x0, x1, y0, y1, z, h, m, ridge=0.0, inset=None, courses=1, lip=0.00012, caps=None, fascia=None, name='roof'):
    """Hipped tile roof over a rectangle, built as overlapping courses (each course's lip reads as a tile row).
    ridge: fraction of the long side kept as a ridge (0 = pyramid); inset=(ix, iy) gives a flat-topped cap instead.
    m may be a list (one material per course, cycled). caps: material for rolled hip/ridge caps; fascia: eave board."""
    W, D = x1 - x0, y1 - y0
    if inset: ax, ay = inset
    elif W >= D: ax, ay = (W / 2) * (1 - ridge), D / 2
    else: ax, ay = W / 2, (D / 2) * (1 - ridge)
    def rect(t, e=0.0):
        zz = z + t * h
        return [(x0 + t * ax - e, y0 + t * ay - e, zz), (x1 - t * ax + e, y0 + t * ay - e, zz),
                (x1 - t * ax + e, y1 - t * ay + e, zz), (x0 + t * ax - e, y1 - t * ay + e, zz)]
    ms = m if isinstance(m, (list, tuple)) else [m]
    for k in range(courses):
        ta, tb_ = k / courses, (k + 1) / courses
        loft([rect(ta, lip if k else 0.0), rect(tb_)], ms[k % len(ms)], name, (True, k == courses - 1), recalc=False)
    if fascia: blk(x0, x1, y0, y1, z - 0.0003, z + 0.00005, fascia, 0.00005, 1, 'fascia')
    if caps:
        b0, b1 = rect(0), rect(1); r = 0.00011; seen = set()
        for k in range(4):
            strut(b0[k], b1[k], r, caps, 5, 'hipcap')
            p, q = b1[k], b1[(k + 1) % 4]
            key = frozenset((tuple(round(c, 7) for c in p), tuple(round(c, 7) for c in q)))
            if (Vector(p) - Vector(q)).length > 1e-6 and key not in seen:
                seen.add(key); strut(p, q, r, caps, 5, 'ridgecap')

def panes(xs, z0, z1, w, yf, m, t=0.0004):
    """Window panes standing 0.6*t proud of a wall whose front face is at y = yf."""
    for x in xs: blk(x - w / 2, x + w / 2, yf - 0.6 * t, yf + 0.4 * t, z0, z1, m, name='pane')

def arch(xc, z0, w, h, y0, y1, m, n=6, name='arch'):
    zc = z0 + h - w / 2
    pts = [(xc - w / 2, z0), (xc + w / 2, z0)] + [(xc + w / 2 * math.cos(PI * i / n), zc + w / 2 * math.sin(PI * i / n)) for i in range(n + 1)]
    return prism_xz(pts, y0, y1, m, name)

def disc_y(x, z, r, y0, y1, m, n=10):
    return prism_xz([(x + r * math.cos(2 * PI * i / n), z + r * math.sin(2 * PI * i / n)) for i in range(n)], y0, y1, m, 'disc')

def sphere(c, r, m, segs=12, rings=6):
    prof = [(r * math.sin(PI * j / rings), -r * math.cos(PI * j / rings)) for j in range(rings + 1)]
    return lathe(prof, m, segs, c[0], c[1], c[2], name='ball')

# ---------- detail helpers: mouldings, recessed openings, trim ----------
SB = 0.00006   # small bevel on trim pieces (catches a highlight on every edge)
def tb(x0, x1, y0, y1, z0, z1, m, bv=SB, name='trim'):
    return blk(x0, x1, y0, y1, z0, z1, m, bv, 1, name) if bv else blk(x0, x1, y0, y1, z0, z1, m, 0, name=name)

# moulding profiles: (outward offset from the wall, height above the base line)
CORNICE = [(0, 0), (0.00014, 0.0001), (0.00014, 0.00022), (0.0004, 0.0004), (0.0007, 0.0005), (0.0007, 0.00078), (0.00052, 0.00085), (0, 0.00085)]
CORN_S = [(0, 0), (0.00012, 0.00008), (0.00012, 0.00018), (0.0004, 0.00034), (0.0004, 0.00056), (0, 0.00062)]
BELT = [(0, 0), (0.0002, 0.00006), (0.0002, 0.00028), (0, 0.00034)]
PLINTH = [(0.00028, 0), (0.00028, 0.0007), (0.0001, 0.0009), (0, 0.00095)]

def mould(x0, x1, y0, y1, z, prof, m, name='mould'):
    """A moulding run round a rectangular wall footprint (cornice, belt course, plinth)."""
    return loft([[(x0 - d, y0 - d, z + h), (x1 + d, y0 - d, z + h), (x1 + d, y1 + d, z + h), (x0 - d, y1 + d, z + h)] for d, h in prof], m, name)

def ring_coping(x0, x1, y0, y1, z0, z1, t, m, o=0.00014):
    """Coping capstones on a parapet ring of wall thickness t, overhanging both faces by o."""
    parapet_ring(x0 - o, x1 + o, y0 - o, y1 + o, z0, z1, t + 2 * o, m, SB)

def parapet_ring(x0, x1, y0, y1, z0, z1, t, m, bv=0.0):
    tb(x0, x1, y0, y0 + t, z0, z1, m, bv); tb(x0, x1, y1 - t, y1, z0, z1, m, bv)
    tb(x0, x0 + t, y0 + t, y1 - t, z0, z1, m, bv); tb(x1 - t, x1, y0 + t, y1 - t, z0, z1, m, bv)

def arch_pts(x, z0, w, h, n=8):
    zc = z0 + h - w / 2
    return [(x - w / 2, z0), (x + w / 2, z0)] + [(x + w / 2 * math.cos(PI * i / n), zc + w / 2 * math.sin(PI * i / n)) for i in range(n + 1)]

def opening(x, z0, w, h, yf, glass, reveal, depth=0.00045, arch=False, sill=None, sill_bv=SB, mull=None, hood=None, key=None, through=False):
    """A window/door recessed `depth` into a wall whose front face is y = yf. Returns the cutter (pass it to carve()):
    its sides become the reveals (material `reveal`), its back cap the glass. Adds sill / glazing bars / hood / keystone."""
    pts = arch_pts(x, z0, w, h) if arch else [(x - w / 2, z0), (x + w / 2, z0), (x + w / 2, z0 + h), (x - w / 2, z0 + h)]
    y1 = yf + (0.02 if through else depth)
    cut = loft([[(px, yf - 0.001, pz) for px, pz in pts], [(px, y1, pz) for px, pz in pts]], [reveal, glass], 'cut', cap_mat=1)
    yb = yf + depth
    if sill: tb(x - w / 2 - 0.0002, x + w / 2 + 0.0002, yf - 0.00028, yf + 0.0002, z0 - 0.0002, z0, sill, sill_bv)
    if mull and not through:
        t = 0.0001; zs = z0 + (h - w / 2 if arch else h * 0.62)
        tb(x - t / 2, x + t / 2, yb - 0.00012, yb + 0.00002, z0, (zs if arch else z0 + h), mull, 0, 'mull')
        tb(x - w / 2, x + w / 2, yb - 0.00012, yb + 0.00002, zs - t / 2, zs + t / 2, mull, 0, 'mull')
    if hood:
        zt = z0 + h
        tb(x - w / 2 - 0.00022, x + w / 2 + 0.00022, yf - 0.00026, yf + 0.0001, zt, zt + 0.00024, hood)
    if key and arch:
        zt = z0 + h
        prism_xz([(x - 0.00018, zt - 0.00036), (x + 0.00018, zt - 0.00036), (x + 0.00028, zt + 0.0001), (x - 0.00028, zt + 0.0001)],
                 yf - 0.00018, yf + 0.0001, key, 'key')
    return cut

def archivolt(x, z0, w, h, y, m, off=0.00018, r=0.00012, n=10):
    """Moulded ring round an arched opening (a square-section tube following jambs and arch)."""
    R = w / 2 + off; zc = z0 + h - w / 2
    path = [(x + R, y, z0)] + [(x + R * math.cos(PI * i / n), y, zc + R * math.sin(PI * i / n)) for i in range(n + 1)] + [(x - R, y, z0)]
    return tube(path, r, m, sides=4, normal=(0, 1, 0), name='archivolt')

def medallion(x, z, r, y, m, m2=None):
    """Round patera: a disc proud of the wall at y with a raised boss."""
    disc_y(x, z, r, y - 0.00016, y + 0.0001, m, 12)
    disc_y(x, z, r * 0.62, y - 0.00026, y - 0.0001, m2 or m, 10)
    disc_y(x, z, r * 0.25, y - 0.00034, y - 0.0002, m, 6)

def quoins(x, y, z0, z1, s, m, n=6):
    """Alternating long/short stone blocks up a front corner at (x, y); s = +1 right corner, -1 left."""
    hgt = (z1 - z0) / n
    for k in range(n):
        L = 0.0011 if k % 2 == 0 else 0.0007
        xa, xb = sorted((x, x - s * L))
        tb(xa - (0.0001 if s < 0 else 0), xb + (0.0001 if s > 0 else 0), y - 0.0001, y + 0.0008, z0 + k * hgt + 0.00003, z0 + (k + 1) * hgt - 0.00003, m, 0)

def pent(x0, x1, y0, y1, zlo, zhi, m, courses=3, th=0.00022, lip=0.00012):
    """Tile pent roof sloping down toward -Y (front edge y0 at zlo, wall edge y1 at zhi), stepped tile courses."""
    zf = lambda y: zlo + (zhi - zlo) * (y - y0) / (y1 - y0)
    for k in range(courses):
        ya, yb = y0 + (y1 - y0) * k / courses, y0 + (y1 - y0) * (k + 1) / courses
        prism_yz([(ya - (lip if k == 0 else 0), zf(ya) - th), (yb, zf(yb) - th * 0.4), (yb, zf(yb)), (ya - (lip if k == 0 else 0), zf(ya) + th * 0.6)],
                 x0, x1, m, 'pent')

def carve(body, cuts):
    """Boolean-subtract the opening cutters from a wall body (exact solver; cutter materials transfer to the cut faces)."""
    cuts = [c for c in cuts if c]
    if not cuts: return body
    vl = bpy.context.view_layer
    def only(objs, act):
        for o in bpy.context.scene.objects: o.select_set(False)
        for o in objs: o.select_set(True)
        vl.objects.active = act
    only([body], body); bpy.ops.object.convert(target='MESH')
    only(cuts, cuts[0])
    if len(cuts) > 1: bpy.ops.object.join()
    cut = vl.objects.active
    md = body.modifiers.new('cut', 'BOOLEAN'); md.operation = 'DIFFERENCE'; md.solver = 'EXACT'; md.object = cut
    md.material_mode = 'TRANSFER'
    only([body], body); bpy.ops.object.modifier_apply(modifier=md.name)
    bpy.data.objects.remove(cut, do_unlink=True)
    return body

def glazing(seed, p_dark=0.2):
    """Upper-floor glass: mostly glass_lit (glows at night), a few dark rooms."""
    rnd = random.Random(seed)
    return lambda: mt('glass_dark') if rnd.random() < p_dark else mt('glass_lit')

def clear():
    for o in list(bpy.data.objects): bpy.data.objects.remove(o, do_unlink=True)
    for me in list(bpy.data.meshes): bpy.data.meshes.remove(me)

def finalize(name, objs=None, origin=None):
    """Apply modifiers, join into one mesh object called `name`, apply transforms, smooth with sharp edges."""
    sc = bpy.context.scene; vl = bpy.context.view_layer
    objs = objs or [o for o in sc.objects if o.type == 'MESH']
    for o in sc.objects: o.select_set(False)
    for o in objs: o.select_set(True)
    vl.objects.active = objs[0]
    bpy.ops.object.convert(target='MESH')
    if len(objs) > 1: bpy.ops.object.join()
    ob = vl.objects.active
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    ob.name = name; ob.data.name = name
    ob.data.shade_smooth()
    ob.data.set_sharp_from_angle(angle=math.radians(35))
    if origin: ob.location = origin
    ob.select_set(False)
    return ob

# ---------- 1. bathhouse facade blocks (origin bottom-centre of the front face, body toward +Y) ----------
# Each: a base slab at y = 0, a moulded plinth, wall bodies with recessed openings (carve), sills / glazing bars,
# belt courses, a projecting cornice, parapet copings or tile roofs with rolled hip caps, roof furniture.
def roof_box(x0, x1, y0, y1, z0, z1, m, cap=None):
    """Small rooftop box (hatch, penthouse, chimney) with an overhanging cap slab."""
    tb(x0, x1, y0, y1, z0, z1, m, 0.00008)
    if cap: tb(x0 - 0.00015, x1 + 0.00015, y0 - 0.00015, y1 + 0.00015, z1, z1 + 0.0002, cap)

def skylight(x, y, z, w, d):
    """Low hipped glass skylight on a sash curb."""
    tb(x - w / 2, x + w / 2, y - d / 2, y + d / 2, z, z + 0.0004, mt('sash'), 0.00005)
    hip(x - w / 2 + 0.0001, x + w / 2 - 0.0001, y - d / 2 + 0.0001, y + d / 2 - 0.0001, z + 0.0004, 0.0006, mt('glass_dark'), ridge=0.5, caps=mt('sash'))

def vents(pts, z):
    """Mushroom roof vents."""
    for x, y in pts: lathe([(0.00022, 0.0), (0.00022, 0.0007), (0.00045, 0.0008), (0.00045, 0.00095), (0.0, 0.0011)], mt('tower_steel'), 8, x, y, z, name='vent')

def bh_superior():
    """1916: smallest on the Row. Cream brick, flat parapet with green tile coping, green tile medallion frieze."""
    cb, st, tr, gt = mt('cream_brick'), mt('stucco'), mt('stone_trim'), mt('green_tile')
    up = glazing(11)
    X, Y0, Y1 = 0.0102, 0.0012, 0.0124
    tb(-0.0108, 0.0108, 0.0, 0.0130, 0.0, 0.0005, tr, 0.00015)                     # stoop slab
    mould(-X, X, Y0, Y1, 0.0005, PLINTH, tr)
    body = blk(-X, X, Y0, Y1, 0.0005, 0.0106, cb, 0.0002)
    cuts = [opening(0, 0.0010, 0.0026, 0.0044, Y0, mt('glass_lit'), st, 0.0006, arch=True, mull=mt('sash'), key=gt)]
    cuts += [opening(x, 0.0022, 0.0021, 0.0029, Y0, mt('glass_dark'), st, sill=tr, mull=mt('sash')) for x in (-0.0080, -0.0047, 0.0047, 0.0080)]
    cuts += [opening(x, 0.0071, 0.0021, 0.0021, Y0, up(), st, sill=tr, mull=mt('sash'), hood=st) for x in (-0.0080, -0.0040, 0.0, 0.0040, 0.0080)]
    carve(body, cuts)
    archivolt(0, 0.0010, 0.0026, 0.0044, Y0 - 0.0001, st)
    for s in (-1, 1): tb(s * 0.0021 - 0.0003, s * 0.0021 + 0.0003, Y0 - 0.0003, Y0 + 0.0001, 0.0006, 0.0056, st)   # door pilasters
    tb(-0.0027, 0.0027, Y0 - 0.00042, Y0 + 0.0001, 0.0056, 0.0061, st)              # door entablature
    mould(-X, X, Y0, Y1, 0.0062, BELT, st)
    tb(-X - 0.00012, X + 0.00012, Y0 - 0.00012, Y1 + 0.00012, 0.0095, 0.0106, st, 0.00005)   # frieze band
    for k in range(7): medallion(-0.0084 + k * 0.0028, 0.01005, 0.00038, Y0 - 0.00012, gt)
    mould(-X, X, Y0, Y1, 0.0106, CORNICE, st)
    zc = 0.0106 + 0.00085
    parapet_ring(-X, X, Y0, Y1, zc, 0.0131, 0.0008, cb)
    ring_coping(-X, X, Y0, Y1, 0.0131, 0.01345, 0.0008, gt)
    tb(-0.0040, 0.0040, Y0, Y0 + 0.0008, 0.01345, 0.0137, cb, 0)                   # raised centre panel
    tb(-0.0042, 0.0042, Y0 - 0.00014, Y0 + 0.00094, 0.0137, 0.0140, gt)
    disc_y(0, 0.0122, 0.00045, Y0 - 0.00012, Y0 + 0.0001, gt, 10)
    tb(-X + 0.0007, X - 0.0007, Y0 + 0.0007, Y1 - 0.0007, zc, zc + 0.0002, mt('roof_flat'), 0)
    roof_box(0.0030, 0.0062, 0.0074, 0.0102, zc + 0.0002, 0.0125, st, mt('roof_flat'))   # roof hatch
    skylight(-0.0040, 0.0060, zc + 0.0002, 0.0050, 0.0030)
    vents([(-0.0075, 0.0040), (0.0078, 0.0050)], zc + 0.0002)
    roof_box(-0.0080, -0.0068, 0.0100, 0.0112, zc + 0.0002, 0.0132, cb, tr)        # flue

def bh_hale():
    """1892: oldest. Stucco block, red tile hip roof with bracketed eaves, Mission arcade porch with a bell gable."""
    st, tr, rt, rs, ir = mt('stucco'), mt('stone_trim'), mt('red_tile'), mt('red_tile_shadow'), mt('iron')
    up = glazing(12)
    X, Y0, Y1 = 0.0096, 0.0040, 0.0142
    tb(-0.0104, 0.0104, 0.0, 0.0150, 0.0, 0.0006, tr, 0.00015)                     # porch floor / base
    mould(-X, X, Y0, Y1, 0.0006, PLINTH, tr)
    body = blk(-X, X, Y0, Y1, 0.0006, 0.0114, st, 0.0002)
    cuts = [opening(-0.0080 + k * 0.0032, 0.0077, 0.0018, 0.0024, Y0, up(), st, sill=tr, mull=mt('sash'), hood=st) for k in range(6)]
    cuts += [opening(x, 0.0019, 0.0019, 0.0031, Y0, mt('glass_dark'), st, mull=mt('sash')) for x in (-0.0070, -0.0035, 0.0035, 0.0070)]
    cuts.append(opening(0, 0.0006, 0.0022, 0.0042, Y0, mt('glass_lit'), st, 0.0005, mull=mt('sash')))
    carve(body, cuts)
    mould(-X, X, Y0, Y1, 0.0108, BELT, st)
    for k in range(11):                                                            # exposed rafter brackets under the eave
        x = -0.0090 + k * 0.0018
        prism_yz([(Y0 - 0.0007, 0.0112), (Y0, 0.0110), (Y0, 0.0114), (Y0 - 0.0007, 0.0114)], x - 0.00012, x + 0.00012, rs, 'rafter')
    hip(-0.0104, 0.0104, 0.0032, 0.0150, 0.0114, 0.0040, rt, ridge=0.35, courses=6, caps=rt, fascia=rs)
    roof_box(0.0052, 0.0066, 0.0118, 0.0132, 0.0128, 0.0158, st, tr)               # chimney (back slope)
    # porch: Mission arcade with five arches, tile pent above, bell gable over the centre arch
    PY0, PY1 = 0.0004, 0.0012
    arc = blk(-0.0094, 0.0094, PY0, PY1, 0.0006, 0.0064, st, 0.00015)
    carve(arc, [opening(-0.0074 + k * 0.0037, 0.0006, 0.0026, 0.0040, PY0, mt('glass_dark'), st, through=True) for k in range(5)])
    for s in (-1, 1): tb(s * 0.0094 - (0.0008 if s > 0 else 0), s * 0.0094 + (0.0008 if s < 0 else 0), PY1, Y0, 0.0006, 0.0064, st, 0.0001)
    for k in range(5): archivolt(-0.0074 + k * 0.0037, 0.0006, 0.0026, 0.0040, PY0 - 0.00008, tr, 0.00012, 0.0001)
    tb(-0.0096, 0.0096, PY0 - 0.0002, Y0, 0.0062, 0.0067, st)                       # porch beam
    pent(-0.0098, 0.0098, PY0 - 0.0002, Y0, 0.0068, 0.0080, rt, 3)
    g = [(-0.0030, 0.0064), (0.0030, 0.0064), (0.0030, 0.0080), (0.0022, 0.0082), (0.0016, 0.0087), (0.0008, 0.0091), (0.0, 0.0093),
         (-0.0008, 0.0091), (-0.0016, 0.0087), (-0.0022, 0.0082), (-0.0030, 0.0080)]
    gable = prism_xz(g, 0.0002, 0.0009, st, 'gable')
    carve(gable, [opening(0, 0.0072, 0.0012, 0.0016, 0.0002, mt('glass_dark'), st, through=True)])
    tube([(x, 0.00055, z + 0.00012) for x, z in g[2:]] , 0.0001, tr, sides=4, normal=(0, 1, 0), name='gable_cope')
    lathe([(0.0, 0.0), (0.00034, 0.00006), (0.00032, 0.0003), (0.0002, 0.00052), (0.0, 0.00056)], mt('bronze'), 10, 0, 0.00055, 0.00745, name='bell')
    strut((-0.00055, 0.00055, 0.0081), (0.00055, 0.00055, 0.0081), 0.00006, ir, 4)  # bell yoke
    for s in (-1, 1):                                                              # iron lanterns beside the door
        strut((s * 0.0018, Y0, 0.0040), (s * 0.0018, Y0 - 0.0005, 0.0040), 0.00006, ir, 4)
        tb(s * 0.0018 - 0.00018, s * 0.0018 + 0.00018, Y0 - 0.00068, Y0 - 0.00032, 0.0033, 0.0039, mt('glass_lit'), 0)

def bh_maurice():
    """1912: white block, glazed sun porch of five terra-cotta arches, green tile mansard cap with dormers."""
    st, tr, tc, gt = mt('stucco'), mt('stone_trim'), mt('terra_cotta'), mt('green_tile')
    up = glazing(13)
    X, Y0, Y1 = 0.0100, 0.0016, 0.0140
    tb(-0.0108, 0.0108, 0.0, 0.0148, 0.0, 0.0005, tr, 0.00015)
    mould(-X, X, Y0, Y1, 0.0005, PLINTH, tr)
    body = blk(-X, X, Y0, Y1, 0.0005, 0.0134, st, 0.0002)
    xs = [-0.0085 + k * 0.0034 for k in range(6)]
    cuts = [opening(x, z, 0.0020, 0.0020, Y0, up(), st, sill=tc, mull=mt('sash')) for z in (0.0075, 0.0104) for x in xs]
    carve(body, cuts)
    mould(-X, X, Y0, Y1, 0.0098, BELT, tc)
    mould(-X, X, Y0, Y1, 0.0134, CORNICE, st)
    zc = 0.0134 + 0.00085
    hip(-0.0106, 0.0106, 0.0010, 0.0146, zc, 0.0032, gt, inset=(0.0045, 0.0045), courses=4, caps=gt)
    zt = zc + 0.0032
    tb(-0.0061, 0.0061, 0.0055, 0.0101, zt - 0.0001, zt + 0.0001, mt('roof_flat'), 0)
    roof_box(-0.0020, 0.0020, 0.0066, 0.0090, zt + 0.0001, 0.0178, st, mt('roof_flat'))        # stair penthouse
    for x in (-0.0060, 0.0, 0.0060):                                                # dormers on the front slope
        yd = 0.0026; z0 = zc + 0.0009
        tb(x - 0.0009, x + 0.0009, yd, 0.0050, z0, z0 + 0.0014, st, 0.00005)
        prism_xz([(x - 0.0011, z0 + 0.0014), (x + 0.0011, z0 + 0.0014), (x, z0 + 0.0022)], yd - 0.0002, 0.0050, gt, 'dormer_roof')
        tb(x - 0.00055, x + 0.00055, yd - 0.00005, yd + 0.0001, z0 + 0.0003, z0 + 0.0011, mt('glass_lit'), 0)
    # sun porch: projecting single storey, five glazed arches in terra-cotta archivolts, balustraded roof
    PY0 = 0.0004
    porch = blk(-0.0098, 0.0098, PY0, Y0 + 0.0004, 0.0005, 0.0062, st, 0.00015)
    carve(porch, [opening(-0.0080 + k * 0.0040, 0.0011, 0.0028, 0.0044, PY0, mt('glass_lit'), st, 0.0004, arch=True, mull=mt('sash')) for k in range(5)])
    for k in range(5):
        x = -0.0080 + k * 0.0040
        archivolt(x, 0.0011, 0.0028, 0.0044, PY0 - 0.00008, tc)
        tb(x - 0.0017, x + 0.0017, PY0 - 0.00025, PY0 + 0.0001, 0.0008, 0.0011, tc)   # arch sill
    tb(-0.0100, 0.0100, PY0 - 0.0002, Y0 + 0.0006, 0.0062, 0.0066, tc)              # porch coping
    for k in range(11): tb(-0.0090 + k * 0.0018 - 0.00012, -0.0090 + k * 0.0018 + 0.00012, PY0 + 0.0001, PY0 + 0.0004, 0.0066, 0.0071, st, 0)
    tb(-0.0098, 0.0098, PY0, PY0 + 0.0005, 0.0071, 0.0074, tc)                      # balustrade rail

def bh_fordyce():
    """1915: largest. Yellow brick, lozenge band, two red tile end pavilions with quoins, flat centre with a stained-glass
    hipped skylight, copper-and-glass marquee over the entrance."""
    yb, lz, tr, rt, cu, cp = mt('yellow_brick'), mt('lozenge_brick'), mt('stone_trim'), mt('red_tile'), mt('copper'), mt('copper_patina')
    up = glazing(14)
    tb(-0.0108, 0.0108, 0.0, 0.0154, 0.0, 0.0005, tr, 0.00015)
    CX, CY0, CY1 = 0.0066, 0.0018, 0.0148
    mould(-CX, CX, CY0, CY1, 0.0005, PLINTH, tr)
    centre = blk(-CX, CX, CY0, CY1, 0.0005, 0.0158, yb, 0.0002)
    cuts = [opening(0, 0.0005, 0.0026, 0.0042, CY0, mt('glass_lit'), tr, 0.0006, mull=mt('sash'))]
    cuts += [opening(x, 0.0013, 0.0020, 0.0031, CY0, mt('glass_dark'), tr, arch=True, mull=mt('sash')) for x in (-0.0043, 0.0043)]
    cuts += [opening(x, z, 0.0018, 0.0023, CY0, up(), yb, sill=tr, mull=mt('sash'), hood=tr) for z in (0.0068, 0.0116) for x in (-0.0045, -0.0015, 0.0015, 0.0045)]
    carve(centre, cuts)
    for s in (-1, 1): tb(s * 0.0018 - 0.0003, s * 0.0018 + 0.0003, CY0 - 0.0003, CY0 + 0.0001, 0.0005, 0.0050, tr)
    mould(-CX, CX, CY0, CY1, 0.0062, BELT, tr)
    mould(-CX, CX, CY0, CY1, 0.0094, BELT, tr)
    for k in range(7):
        x = -0.0054 + k * 0.0018
        prism_xz([(x - 0.0007, 0.0104), (x, 0.0109), (x + 0.0007, 0.0104), (x, 0.0099)], CY0 - 0.00016, CY0 + 0.0001, lz, 'lozenge')
    mould(-CX, CX, CY0, CY1, 0.0150, CORN_S, tr)
    tb(-CX, CX, CY0, CY0 + 0.0008, 0.0156, 0.0164, yb, 0)                         # front parapet
    tb(-CX - 0.00014, CX + 0.00014, CY0 - 0.00014, CY0 + 0.00094, 0.0164, 0.0167, tr)
    tb(-CX, CX, CY0, CY1, 0.0156, 0.0158, mt('roof_flat'), 0)
    # stained-glass skylight: copper curb, low hip of alternating cobalt / amber glass, copper ribs
    tb(-0.0044, 0.0044, 0.0042, 0.0124, 0.0158, 0.0166, cu, 0.00008)
    hip(-0.0042, 0.0042, 0.0044, 0.0122, 0.0166, 0.0020, [mt('skylight_cobalt'), mt('skylight_amber')], ridge=0.3, courses=4, caps=cp)
    # copper-and-glass marquee
    MX = 0.0058
    tb(-MX, MX, 0.0000, 0.0003, 0.0050, 0.0057, cu, 0.00005)
    for s in (-1, 1): tb(s * MX - (0.0003 if s > 0 else 0), s * MX + (0.0003 if s < 0 else 0), 0.0003, CY0, 0.0050, 0.0057, cu, 0.00005)
    prism_yz([(0.0002, 0.0056), (CY0, 0.0060), (CY0, 0.0062), (0.0002, 0.0058)], -MX + 0.0002, MX - 0.0002, mt('glass_lit'), 'marquee_glass')
    for k in range(7):
        x = -0.0051 + k * 0.0017
        strut((x, 0.0002, 0.00585), (x, CY0, 0.00625), 0.00007, cp if k % 2 else cu, 4)
    for k in range(13):                                                            # cresting
        x = -0.0054 + k * 0.0009
        prism_xz([(x - 0.0003, 0.0057), (x + 0.0003, 0.0057), (x, 0.0062)], 0.00005, 0.00025, cu, 'crest')
    for s in (-1, 1): strut((s * 0.0052, CY0, 0.0088), (s * 0.0055, 0.0003, 0.0057), 0.00006, cp, 4)   # tie rods
    for s in (-1, 1):
        x0, x1 = sorted((s * 0.0064, s * 0.0104)); cx = s * 0.0084
        PY0 = 0.0008
        mould(x0, x1, PY0, 0.0150, 0.0005, PLINTH, tr)
        pav = blk(x0, x1, PY0, 0.0150, 0.0005, 0.0150, yb, 0.0002)
        carve(pav, [opening(cx, 0.0013, 0.0020, 0.0031, PY0, mt('glass_dark'), tr, arch=True, mull=mt('sash')),
                    opening(cx, 0.0068, 0.0018, 0.0023, PY0, up(), yb, sill=tr, mull=mt('sash'), hood=tr),
                    opening(cx, 0.0116, 0.0018, 0.0023, PY0, up(), yb, sill=tr, mull=mt('sash'), hood=tr)])
        archivolt(cx, 0.0013, 0.0020, 0.0031, PY0 - 0.00008, tr, 0.00015, 0.0001)
        quoins(x1 if s > 0 else x0, PY0, 0.0010, 0.0146, s, tr, 10)
        for k in (-1, 1): prism_xz([(cx + k * 0.0009 - 0.0007, 0.0104), (cx + k * 0.0009, 0.0109), (cx + k * 0.0009 + 0.0007, 0.0104), (cx + k * 0.0009, 0.0099)],
                                   PY0 - 0.00016, PY0 + 0.0001, lz, 'lozenge')
        mould(x0, x1, PY0, 0.0150, 0.0062, BELT, tr)
        mould(x0, x1, PY0, 0.0150, 0.0145, CORN_S, tr)
        h0, h1 = sorted((s * 0.0060, s * 0.0108))
        hip(h0, h1, 0.0002, 0.0154, 0.0151, 0.0043, rt, ridge=0.4, courses=6, caps=rt, fascia=mt('red_tile_shadow'))
        rl = 0.0152 * 0.4 / 2
        for yy in (0.0078 - rl, 0.0078 + rl):                                      # copper ridge finials
            strut((cx, yy, 0.0194), (cx, yy, 0.0198), 0.00007, cu, 4)
            sphere((cx, yy, 0.01985), 0.00015, cp, 8, 4)

def bh_quapaw():
    """1922: widest facade, seven-arch arcade, scalloped parapet with gold finials, chevron-tiled dome with copper lantern."""
    bb, tt, tr, oc, tq = mt('buff_brick'), mt('tan_trim'), mt('stone_trim'), mt('dome_ochre'), mt('turquoise_tile')
    X, Y0, Y1 = 0.0104, 0.0010, 0.0146
    tb(-0.0110, 0.0110, 0.0, 0.0150, 0.0, 0.0005, tr, 0.00015)
    mould(-X, X, Y0, Y1, 0.0005, PLINTH, tr)
    body = blk(-X, X, Y0, Y1, 0.0005, 0.0100, bb, 0.0002)
    xs = [-0.0090 + k * 0.0030 for k in range(7)]
    carve(body, [opening(x, 0.0013, 0.0021, 0.0058, Y0, mt('glass_lit'), tt, 0.0006, arch=True, mull=mt('sash')) for x in xs])
    for x in xs:
        archivolt(x, 0.0013, 0.0021, 0.0058, Y0 - 0.00008, tt, 0.00016, 0.0001)
        prism_xz([(x - 0.00022, 0.0071 - 0.0002), (x + 0.00022, 0.0071 - 0.0002), (x + 0.0003, 0.0074), (x - 0.0003, 0.0074)], Y0 - 0.0002, Y0 + 0.0001, oc, 'key')
    for x in [xx + 0.0015 for xx in xs[:-1]]:                                       # tile insets over the piers
        disc_y(x, 0.0078, 0.00028, Y0 - 0.00012, Y0 + 0.0001, tq, 4)
    tb(-X - 0.00012, X + 0.00012, Y0 - 0.00012, Y1 + 0.00012, 0.0083, 0.0089, oc, 0.00005)   # ochre tile band
    mould(-X, X, Y0, Y1, 0.0093, CORNICE, tr)
    zc = 0.0093 + 0.00085
    tb(-0.0106, 0.0106, Y0, Y0 + 0.0006, zc, 0.0110, bb, 0)
    for k in range(9):
        x = -0.0096 + k * 0.0024
        prism_xz([(x + 0.0011 * math.cos(PI * i / 8), 0.0110 + 0.0011 * math.sin(PI * i / 8)) for i in range(9)], Y0, Y0 + 0.0006, bb, 'scallop')
        tube([(x + 0.00115 * math.cos(PI * i / 8), Y0 + 0.0003, 0.0110 + 0.00115 * math.sin(PI * i / 8)) for i in range(9)], 0.0001, tt, sides=4, normal=(0, 1, 0), name='scallop_cope')
    for x in (-0.0084, -0.0036, 0.0036, 0.0084):  # sculpin finials (abstract)
        prism_xz([(x - 0.0005, 0.0108), (x + 0.0005, 0.0108), (x + 0.0003, 0.0118), (x, 0.0124), (x - 0.0003, 0.0118)], Y0 - 0.0001, Y0 + 0.0005, mt('gold'), 'finial')
    parapet_ring(-0.0106, 0.0106, Y0 + 0.0006, 0.0148, zc, 0.0108, 0.0006, bb)
    tb(-0.0100, 0.0100, Y0 + 0.0006, 0.0142, zc, zc + 0.0002, mt('roof_flat'), 0)
    cy = 0.0078; zd = zc + 0.0002
    lathe([(0.0060, 0.0), (0.0060, 0.0022)], [oc, tq], 24, 0, cy, zd, face_mat=lambda j, i: i % 2, name='drum')
    lathe([(0.0060, 0.0), (0.0063, 0.00015), (0.0066, 0.0004), (0.0066, 0.0007), (0.0060, 0.0007)], tr, 36, 0, cy, zd + 0.0022, name='drum_cornice')
    rings = 12; zb = zd + 0.0029
    prof = [(0.0062 * math.cos(PI / 2 * j / rings), 0.0064 * math.sin(PI / 2 * j / rings)) for j in range(rings + 1)]
    prof[-1] = (0.0, prof[-1][1])
    dm = [mt('dome_cream'), mt('dome_tan'), mt('dome_buff'), tq]
    def chevron(j, i):  # zigzag bands two faces thick: cream, tan, buff, tan ...; a turquoise panel row at the base
        if j == 1 and i % 3 == 0: return 3
        return (0, 1, 2, 1)[((j + abs(i % 6 - 3)) // 2) % 4]
    lathe(prof, dm, 36, 0, cy, zb, face_mat=chevron, name='dome')
    zl = zb + 0.0060
    lathe([(0.0018, 0.0), (0.0020, 0.0002), (0.0020, 0.0006), (0.0016, 0.0006)], mt('bronze'), 16, 0, cy, zl)
    lathe([(0.0011, 0.0), (0.0011, 0.0032)], mt('glass_lit'), 12, 0, cy, zl + 0.0006)
    for k in range(6):
        a = 2 * PI * k / 6
        strut((0.0016 * math.cos(a), cy + 0.0016 * math.sin(a), zl + 0.0006), (0.0016 * math.cos(a), cy + 0.0016 * math.sin(a), zl + 0.0038), 0.00026, mt('copper'), 4)
    lathe([(0.0019, 0.0), (0.0022, 0.0002), (0.0022, 0.0004), (0.0019, 0.0004)], mt('copper'), 16, 0, cy, zl + 0.0038)
    lathe([(0.0019, 0.0), (0.0012, 0.0012), (0.0004, 0.0026), (0.0, 0.0030)], [mt('copper_patina'), mt('copper')], 16, 0, cy, zl + 0.0042,
          face_mat=lambda j, i: 0 if j < 2 else 1)
    zs = zl + 0.0072
    strut((0, cy, zs), (0, cy, 0.0292), 0.00022, mt('copper'), 6)
    sphere((0, cy, 0.02955), 0.00045, mt('copper'), 10, 5)

def bh_ozark():
    """1922: low white block with an arched portal between two three-step towers with red tile caps."""
    st, tr, rt = mt('stucco'), mt('stone_trim'), mt('red_tile')
    up = glazing(16)
    tb(-0.0110, 0.0110, 0.0, 0.0150, 0.0, 0.0005, tr, 0.00015)
    Y0 = 0.0014
    mould(-0.0050, 0.0050, Y0, 0.0144, 0.0005, PLINTH, tr)
    ctr = blk(-0.0050, 0.0050, Y0, 0.0144, 0.0005, 0.0116, st, 0.0002)
    carve(ctr, [opening(0, 0.0005, 0.0030, 0.0058, Y0, mt('glass_lit'), tr, 0.0007, arch=True, mull=mt('sash'), key=tr)] +
               [opening(x, 0.0083, 0.0016, 0.0021, Y0, up(), st, sill=tr, mull=mt('sash'), hood=st) for x in (-0.0030, 0.0, 0.0030)])
    archivolt(0, 0.0005, 0.0030, 0.0058, Y0 - 0.0001, tr, 0.0002, 0.00014)
    for s in (-1, 1):                                                              # portal columns + entablature
        strut((s * 0.0022, Y0 - 0.0003, 0.0006), (s * 0.0022, Y0 - 0.0003, 0.0066), 0.00022, tr, 8)
        tb(s * 0.0022 - 0.0003, s * 0.0022 + 0.0003, Y0 - 0.0006, Y0, 0.0005, 0.0009, tr)
    tb(-0.0029, 0.0029, Y0 - 0.0007, Y0 + 0.0001, 0.0066, 0.0072, tr)
    prism_xz([(-0.0012, 0.0072), (0.0012, 0.0072), (0.0, 0.0077)], Y0 - 0.0005, Y0 + 0.0001, tr, 'pediment')
    mould(-0.0050, 0.0050, Y0, 0.0144, 0.0114, CORN_S, st)
    zc = 0.0114 + 0.00062
    parapet_ring(-0.0050, 0.0050, Y0, 0.0144, zc, 0.0127, 0.0007, st)
    ring_coping(-0.0050, 0.0050, Y0, 0.0144, 0.0127, 0.0130, 0.0007, tr)
    tb(-0.0018, 0.0018, Y0, Y0 + 0.0007, 0.0130, 0.0136, st, 0)                    # stepped centre gablet
    tb(-0.0020, 0.0020, Y0 - 0.00014, Y0 + 0.00084, 0.0136, 0.0139, tr)
    tb(-0.0050, 0.0050, Y0 + 0.0007, 0.0137, zc, zc + 0.0002, mt('roof_flat'), 0)
    skylight(0.0, 0.0090, zc + 0.0002, 0.0040, 0.0034)
    vents([(-0.0030, 0.0040), (0.0030, 0.0125)], zc + 0.0002)
    for s in (-1, 1):
        cx = s * 0.0078
        T1 = (cx - 0.0031, cx + 0.0031, 0.0004, 0.0146)
        mould(T1[0], T1[1], T1[2], T1[3], 0.0005, PLINTH, tr)
        t1 = blk(*T1, 0.0005, 0.0146, st, 0.0002)
        carve(t1, [opening(cx, 0.0016, 0.0022, 0.0030, T1[2], mt('glass_dark'), st, arch=True, mull=mt('sash'), sill=tr),
                   opening(cx, 0.0062, 0.0012, 0.0074, T1[2], up(), st, sill=tr, mull=mt('sash'), hood=st)])
        quoins(T1[1] if s > 0 else T1[0], T1[2], 0.0010, 0.0140, s, tr, 9)
        mould(*T1, 0.0055, BELT, st)
        mould(*T1, 0.0140, CORN_S, st)
        T2 = (cx - 0.0026, cx + 0.0026, 0.0010, 0.0082)
        t2 = blk(*T2, 0.0144, 0.0180, st, 0.00015)
        carve(t2, [opening(cx, 0.0154, 0.0012, 0.0018, T2[2], up(), st, sill=tr, mull=mt('sash'))])
        mould(*T2, 0.0174, CORN_S, st)
        T3 = (cx - 0.0020, cx + 0.0020, 0.0016, 0.0076)
        t3 = blk(*T3, 0.0178, 0.0210, st, 0.00015)
        carve(t3, [opening(cx + d, 0.0186, 0.0007, 0.0016, T3[2], mt('glass_lit'), st, 0.0004, arch=True) for d in (-0.0006, 0.0006)])
        mould(*T3, 0.0204, CORN_S, st)
        hip(cx - 0.0025, cx + 0.0025, 0.0011, 0.0081, 0.02102, 0.0046, rt, ridge=0.25, courses=5, caps=rt, fascia=mt('red_tile_shadow'))
        rl = (0.0070 / 2) * 0.25
        strut((cx, 0.0046, 0.0256), (cx, 0.0046, 0.0259), 0.00008, mt('copper'), 4)
        sphere((cx, 0.0046, 0.02595), 0.00014, mt('copper_patina'), 8, 4)

def bh_buckstaff():
    """1912: seven bays between pilasters, brass paterae frieze, raised attic parapet with a central medallion."""
    cb, st, tr, br = mt('cream_brick'), mt('stucco'), mt('stone_trim'), mt('brass')
    up = glazing(17)
    X, Y0, Y1 = 0.0101, 0.0010, 0.0133
    tb(-0.0108, 0.0108, 0.0, 0.0140, 0.0, 0.0005, tr, 0.00015)
    mould(-X, X, Y0, Y1, 0.0005, PLINTH, tr)
    body = blk(-X, X, Y0, Y1, 0.0005, 0.0106, cb, 0.0002)
    bays = [-0.0084 + b * 0.0028 for b in range(7)]
    cuts = [opening(x, 0.0072, 0.0016, 0.0024, Y0, up(), st, sill=tr, mull=mt('sash'), hood=st) for x in bays]
    cuts += [opening(x, 0.0020, 0.0018, 0.0032, Y0, mt('glass_dark'), st, sill=tr, mull=mt('sash')) for b, x in enumerate(bays) if b != 3]
    cuts.append(opening(0, 0.0005, 0.0020, 0.0046, Y0, mt('glass_lit'), st, 0.0006, arch=True, mull=mt('sash'), key=st))
    carve(body, cuts)
    for k in range(8):                                                             # pilasters: base, shaft, capital
        x = -0.0098 + k * 0.0028
        tb(x - 0.0005, x + 0.0005, Y0 - 0.0005, Y0 + 0.0001, 0.0005, 0.0013, tr)
        tb(x - 0.00034, x + 0.00034, Y0 - 0.00034, Y0 + 0.0001, 0.0013, 0.0098, st, 0.00004)
        tb(x - 0.0005, x + 0.0005, Y0 - 0.0005, Y0 + 0.0001, 0.0098, 0.0104, st)
    tb(-0.0015, 0.0015, Y0 - 0.0004, Y0 + 0.0001, 0.0056, 0.0062, br, 0.00004)     # brass plaque over the door
    mould(-X, X, Y0, Y1, 0.0104, BELT, st)
    tb(-X - 0.0001, X + 0.0001, Y0 - 0.0001, Y1 + 0.0001, 0.0107, 0.0120, st, 0.00005)   # frieze
    for x in bays: medallion(x, 0.01135, 0.00042, Y0 - 0.0001, br)
    mould(-X, X, Y0, Y1, 0.0120, CORNICE, st)
    zc = 0.0120 + 0.00085
    tb(-0.0104, 0.0104, Y0, Y0 + 0.0008, zc, 0.0150, cb, 0)                        # attic
    for x in (-0.0070, 0.0070): tb(x - 0.0022, x + 0.0022, Y0 - 0.0001, Y0 + 0.0001, 0.0134, 0.0144, st, 0.00004)   # attic panels
    tb(-0.0106, 0.0106, Y0 - 0.00016, Y0 + 0.00096, 0.0150, 0.0154, st)
    tb(-0.0045, 0.0045, Y0, Y0 + 0.0008, 0.0154, 0.0175, cb, 0)
    tb(-0.0047, 0.0047, Y0 - 0.00016, Y0 + 0.00096, 0.0175, 0.0180, st)
    medallion(0, 0.0164, 0.00065, Y0, br)
    for x in (-0.0028, 0.0028): disc_y(x, 0.0164, 0.0003, Y0 - 0.00012, Y0 + 0.0001, br, 8)
    parapet_ring(-0.0104, 0.0104, Y0 + 0.0008, Y1, zc, 0.0138, 0.0007, cb)
    ring_coping(-0.0104, 0.0104, Y0 + 0.0008, Y1, 0.0138, 0.0141, 0.0007, st)
    tb(-0.0099, 0.0099, Y0 + 0.0008, Y1 - 0.0005, zc, zc + 0.0002, mt('roof_flat'), 0)
    roof_box(-0.0035, 0.0035, 0.0075, 0.0120, zc + 0.0002, 0.0158, st, mt('roof_flat'))   # penthouse
    tb(-0.0026, 0.0026, 0.0080, 0.0115, 0.0160, 0.0163, mt('glass_dark'), 0.00005)        # skylight on it
    skylight(-0.0072, 0.0090, zc + 0.0002, 0.0034, 0.0040); skylight(0.0072, 0.0090, zc + 0.0002, 0.0034, 0.0040)
    vents([(-0.0080, 0.0040), (0.0082, 0.0120)], zc + 0.0002)

def bh_lamar():
    """1923: the simplest. Five tall bays between plain pilasters, flat parapet with red tile coping, tile pent over the door."""
    st, tr, rt = mt('stucco'), mt('stone_trim'), mt('red_tile')
    up = glazing(18)
    X, Y0, Y1 = 0.0099, 0.0011, 0.0123
    tb(-0.0106, 0.0106, 0.0, 0.0130, 0.0, 0.0005, tr, 0.00015)
    mould(-X, X, Y0, Y1, 0.0005, PLINTH, tr)
    body = blk(-X, X, Y0, Y1, 0.0005, 0.0112, st, 0.0002)
    bays = [-0.00768 + b * 0.00384 for b in range(5)]
    cuts = [opening(x, 0.0068, 0.0022, 0.0033, Y0, up(), st, sill=tr, mull=mt('sash')) for x in bays]
    cuts += [opening(x, 0.0020, 0.0022, 0.0033, Y0, mt('glass_dark'), st, sill=tr, mull=mt('sash')) for b, x in enumerate(bays) if b != 2]
    cuts.append(opening(0, 0.0005, 0.0024, 0.0046, Y0, mt('glass_lit'), st, 0.0006, mull=mt('sash')))
    carve(body, cuts)
    for k in range(6):
        x = -0.0096 + k * 0.00384
        tb(x - 0.0004, x + 0.0004, Y0 - 0.0003, Y0 + 0.0001, 0.0010, 0.0108, st, 0.00004)
    mould(-X, X, Y0, Y1, 0.0060, BELT, st)
    pent(-0.0021, 0.0021, 0.0002, Y0, 0.0058, 0.0066, rt, 2)                       # tile pent over the door
    for s in (-1, 1): prism_yz([(Y0, 0.0052), (Y0, 0.0060), (0.0004, 0.0058)], s * 0.0018 - 0.0001, s * 0.0018 + 0.0001, st, 'bracket')
    mould(-X, X, Y0, Y1, 0.0108, CORN_S, st)
    zc = 0.0108 + 0.00062
    parapet_ring(-0.0100, 0.0100, Y0, Y1, zc, 0.0130, 0.0008, st)
    for (x0, x1, y0, y1) in ((-0.0102, 0.0102, Y0 - 0.0002, Y0 + 0.001), (-0.0102, 0.0102, Y1 - 0.001, Y1 + 0.0002),
                             (-0.0102, -0.0090, Y0 + 0.001, Y1 - 0.001), (0.0090, 0.0102, Y0 + 0.001, Y1 - 0.001)):
        hip(x0, x1, y0, y1, 0.0130, 0.0007, rt, ridge=0.9, courses=2, caps=rt)
    tb(-0.0092, 0.0092, Y0 + 0.0008, Y1 - 0.0008, zc, zc + 0.0002, mt('roof_flat'), 0)
    roof_box(0.0040, 0.0066, 0.0070, 0.0094, zc + 0.0002, 0.0128, st, mt('roof_flat'))
    skylight(-0.0040, 0.0068, zc + 0.0002, 0.0060, 0.0030)
    vents([(-0.0078, 0.0040), (0.0078, 0.0108), (0.0010, 0.0110)], zc + 0.0002)

# ---------- 2. Hot Springs Mountain Tower (origin base centre) ----------
def tower():
    st, cc, wh = mt('tower_steel'), mt('concrete'), mt('deck_white')
    C = [(1, 1), (-1, 1), (-1, -1), (1, -1)]
    Z0, Z1 = 0.018, 0.050
    hw = lambda z: 0.0034 + (0.0024 - 0.0034) * (z - Z0) / (Z1 - Z0)
    for sx, sy in C:
        blk(sx * 0.0115 - 0.0015, sx * 0.0115 + 0.0015, sy * 0.0115 - 0.0015, sy * 0.0115 + 0.0015, 0.0, 0.0012, cc, 0.0002)
    leg = lambda sx, sy, z: Vector((sx, sy, 0)) * (0.0115 + (hw(Z0) - 0.0115) * (z - 0.0012) / (Z0 - 0.0012)) + Vector((0, 0, z))
    for sx, sy in C: strut(leg(sx, sy, 0.0012), leg(sx, sy, Z0), 0.0006, st, 6)
    for k in range(4):  # leg bracing: a ring and an X on each side
        a, b = C[k], C[(k + 1) % 4]
        strut(leg(*a, 0.0085), leg(*b, 0.0085), 0.00025, st, 4)
        strut(leg(*a, 0.0012), leg(*b, 0.0085), 0.00022, st, 4)
        strut(leg(*b, 0.0012), leg(*a, 0.0085), 0.00022, st, 4)
        strut(leg(*a, 0.0085), leg(*b, Z0), 0.00022, st, 4)
        strut(leg(*b, 0.0085), leg(*a, Z0), 0.00022, st, 4)
    blk(-0.0011, 0.0011, -0.0011, 0.0011, 0.0, 0.0500, cc)   # elevator core
    col = lambda sx, sy, z: (sx * hw(z), sy * hw(z), z)
    for sx, sy in C: strut(col(sx, sy, Z0), col(sx, sy, Z1), 0.00042, st, 6)
    n = 8
    zs = [Z0 + (Z1 - Z0) * i / n for i in range(n + 1)]
    for i, z in enumerate(zs):
        for k in range(4):
            a, b = C[k], C[(k + 1) % 4]
            strut(col(*a, z), col(*b, z), 0.00018, st, 4)
            if i < n:
                if (i + k) % 2: strut(col(*a, z), col(*b, zs[i + 1]), 0.00018, st, 4)
                else: strut(col(*b, z), col(*a, zs[i + 1]), 0.00018, st, 4)
    a8 = PI / 8
    lathe([(0.0030, 0.0470), (0.0078, 0.0503), (0.0080, 0.0505), (0.0080, 0.0520)], wh, 8, a0=a8, name='deck')
    lathe([(0.0074, 0.0520), (0.0074, 0.0575)], mt('glass_lit'), 8, a0=a8, caps=False, name='glass')
    for k in range(8):
        a = a8 + 2 * PI * k / 8
        strut((0.0075 * math.cos(a), 0.0075 * math.sin(a), 0.0520), (0.0075 * math.cos(a), 0.0075 * math.sin(a), 0.0575), 0.00028, wh, 4)
    lathe([(0.0084, 0.0575), (0.0084, 0.0588)], wh, 8, a0=a8, name='roofslab')
    lathe([(0.0081, 0.0588), (0.0081, 0.0590)], mt('deck_floor'), 8, a0=a8, name='floor')
    ring = [(0.0081 * math.cos(a8 + 2 * PI * k / 8), 0.0081 * math.sin(a8 + 2 * PI * k / 8)) for k in range(8)]
    for x, y in ring: strut((x, y, 0.0588), (x, y, 0.0620), 0.0002, wh, 4)
    for zr in (0.0604, 0.0620): tube([(x, y, zr) for x, y in ring], 0.00022, wh, closed=True, sides=4, normal=(0, 0, 1))
    blk(-0.0020, 0.0020, -0.0016, 0.0024, 0.0588, 0.0640, wh, 0.00015)
    blk(-0.0023, 0.0023, -0.0019, 0.0027, 0.0640, 0.0646, mt('roof_dark'), 0.0001)
    panes([0.0], 0.0592, 0.0632, 0.0016, -0.0016, mt('glass_lit'), 0.0003)   # stair door, front
    strut((0, 0.0004, 0.0646), (0, 0.0004, 0.0700), 0.00028, st, 6)
    strut((-0.0011, 0.0004, 0.0682), (0.0011, 0.0004, 0.0682), 0.00014, st, 4)

# ---------- 3. Arlington Hotel (origin bottom-centre-front) ----------
def arlington():
    """1924: twin towers with arcaded belvederes and red tile pyramid caps, central block, wings, arched portal with an
    iron-and-glass canopy. Cornices at every roof line, recessed windows with sills, quoined towers."""
    br, tr, rt, rs = mt('arlington_brick'), mt('stone_trim'), mt('red_tile'), mt('red_tile_shadow')
    lit = glazing(5, 0.18)
    tb(-0.0280, 0.0280, 0.0002, 0.0180, 0.0, 0.0012, tr, 0.0002)
    for s in (-1, 1):                                                              # wings
        x0, x1 = sorted((s * 0.0155, s * 0.0275))
        mould(x0, x1, 0.0025, 0.0175, 0.0012, PLINTH, tr)
        wing = blk(x0, x1, 0.0025, 0.0175, 0.0012, 0.0186, br, 0.00025)
        carve(wing, [opening(s * (0.0175 + c * 0.0027), 0.0030 + r * 0.0038, 0.0015, 0.0020, 0.0025, lit() if r else mt('glass_dark'), br, 0.0004,
                             sill=tr, sill_bv=0) for c in range(4) for r in range(4)])
        mould(x0, x1, 0.0025, 0.0175, 0.0060, BELT, tr)
        mould(x0, x1, 0.0025, 0.0175, 0.0182, CORN_S, tr)
        h0, h1 = sorted((s * 0.0151, s * 0.0279))
        hip(h0, h1, 0.0021, 0.0179, 0.01882, 0.0040, rt, ridge=0.4, courses=5, caps=rt, fascia=rs)
    # central block
    mould(-0.0155, 0.0155, 0.0008, 0.0170, 0.0012, PLINTH, tr)
    ctr = blk(-0.0155, 0.0155, 0.0008, 0.0170, 0.0012, 0.0212, br, 0.00025)
    cuts = [opening(0, 0.0012, 0.0044, 0.0064, 0.0008, mt('glass_lit'), tr, 0.0006, arch=True, mull=mt('sash'), key=tr)]
    cuts += [opening(x, 0.0102 + r * 0.0036, 0.0016, 0.0020, 0.0008, lit(), br, 0.0004, sill=tr, sill_bv=0) for x in (-0.0030, 0.0, 0.0030) for r in range(3)]
    cuts += [opening(s * 0.0143, 0.0030 + r * 0.0037, 0.0012, 0.0020, 0.0008, lit(), br, 0.0004, sill=tr, sill_bv=0) for s in (-1, 1) for r in range(5)]
    carve(ctr, cuts)
    archivolt(0, 0.0012, 0.0044, 0.0064, 0.0007, tr, 0.00022, 0.00016)
    mould(-0.0155, 0.0155, 0.0008, 0.0170, 0.0094, BELT, tr)
    mould(-0.0155, 0.0155, 0.0008, 0.0170, 0.0208, CORN_S, tr)
    hip(-0.0159, 0.0159, 0.0006, 0.0172, 0.02142, 0.0040, rt, ridge=0.45, courses=5, caps=rt, fascia=rs)
    # entrance canopy (iron frame, glass top), tie rods, step
    tb(-0.0034, 0.0034, 0.0000, 0.0003, 0.0052, 0.0057, mt('iron'), 0.00005)
    for s in (-1, 1): tb(s * 0.0034 - (0.0003 if s > 0 else 0), s * 0.0034 + (0.0003 if s < 0 else 0), 0.0003, 0.0008, 0.0052, 0.0057, mt('iron'), 0.00005)
    prism_yz([(0.0002, 0.0056), (0.0008, 0.0058), (0.0008, 0.0059), (0.0002, 0.0057)], -0.0032, 0.0032, mt('glass_lit'), 'canopy_glass')
    for s in (-1, 1): strut((s * 0.0030, 0.0008, 0.0084), (s * 0.0032, 0.0002, 0.0057), 0.00006, mt('iron'), 4)
    tb(-0.0040, 0.0040, 0.0000, 0.0008, 0.0012, 0.0016, tr, 0.00005)
    for s in (-1, 1):                                                              # twin towers
        cx = s * 0.0095
        TX0, TX1, TY0, TY1 = cx - 0.0037, cx + 0.0037, 0.0004, 0.0078
        mould(TX0, TX1, TY0, TY1, 0.0012, PLINTH, tr)
        tw = blk(TX0, TX1, TY0, TY1, 0.0012, 0.0268, br, 0.00025)
        carve(tw, [opening(cx + dx, 0.0032 + r * 0.0037, 0.0014, 0.0020, TY0, lit() if r else mt('glass_dark'), br, 0.0004, sill=tr, sill_bv=0)
                   for dx in (-0.0013, 0.0013) for r in range(6)])
        quoins(TX0, TY0, 0.0022, 0.0258, -1, tr, 10); quoins(TX1, TY0, 0.0022, 0.0258, 1, tr, 10)
        mould(TX0, TX1, TY0, TY1, 0.0058, BELT, tr)
        mould(TX0, TX1, TY0, TY1, 0.0262, CORN_S, tr)
        bel = blk(cx - 0.0033, cx + 0.0033, 0.0008, 0.0074, 0.0268, 0.0290, br, 0.00015)
        carve(bel, [opening(cx + dx, 0.02705, 0.0014, 0.0016, 0.0008, mt('glass_dark'), tr, 0.0005, arch=True) for dx in (-0.0013, 0.0013)])
        mould(cx - 0.0033, cx + 0.0033, 0.0008, 0.0074, 0.0287, CORN_S, tr)
        hip(cx - 0.0038, cx + 0.0038, 0.0003, 0.0079, 0.02932, 0.0045, rt, courses=5, caps=rt, fascia=rs)

# ---------- 4. The Vapors (origin bottom-centre-front) ----------
def vapors():
    """1960 supper club entrance: stacked-stone wing, breeze-block screen, glazed lobby under a thin cantilevered canopy
    that carries a wide horizontal marquee (sign_panel quad, UV 0..1 left-to-right / bottom-to-top seen from -Y) ringed
    in coral and turquoise neon, an atomic starburst on top."""
    stn, wht, sb = mt('vapors_stone'), mt('canopy_white'), mt('sign_body')
    nt, nc, gd = mt('neon_turquoise'), mt('neon_coral'), mt('starburst_gold')
    tb(-0.0200, 0.0200, 0.0, 0.0138, 0.0, 0.0004, mt('concrete'), 0.0001)          # forecourt slab
    X, Y0, Y1 = 0.0190, 0.0052, 0.0134
    body = blk(-X, X, Y0, Y1, 0.0004, 0.0098, stn, 0.00015)
    cuts = [opening(0, 0.0004, 0.0108, 0.0066, Y0, mt('glass_lit'), wht, 0.0008)]                 # lobby glass wall
    cuts += [opening(-0.0122, 0.0012 + k * 0.0009, 0.0128, 0.00012, Y0, stn, stn, 0.00012) for k in range(9)]   # stone coursing
    carve(body, cuts)
    for k in range(7): tb(-0.0054 + k * 0.0018 - 0.00006, -0.0054 + k * 0.0018 + 0.00006, Y0 + 0.00066, Y0 + 0.0008, 0.0004, 0.0070, wht, 0)
    tb(-0.0054, 0.0054, Y0 + 0.00066, Y0 + 0.0008, 0.0050, 0.0052, wht, 0)       # transom bar
    for s in (-1, 1): tb(s * 0.0009 - 0.0003, s * 0.0009 + 0.0003, Y0 + 0.0006, Y0 + 0.0007, 0.0024, 0.0027, mt('brass'), 0)   # door pulls
    scr = blk(0.0068, 0.0182, Y0 - 0.0004, Y0 + 0.0001, 0.0010, 0.0088, wht, 0.0001)   # breeze-block screen
    carve(scr, [opening(0.0080 + i * 0.0018, 0.0016 + j * 0.0018, 0.0012, 0.0012, Y0 - 0.0004, mt('shadow'), wht, 0.00035) for i in range(6) for j in range(4)])
    tb(-0.0198, 0.0198, Y0 - 0.0006, Y1 + 0.0004, 0.0098, 0.0104, wht, 0.0001)    # roof slab
    tube([(-0.0194, Y0 - 0.00078, 0.0101), (0.0194, Y0 - 0.00078, 0.0101)], 0.00016, nc, sides=6, normal=(0, 1, 0), name='neon')
    # cantilevered canopy with rounded front corners, neon edge and downlights
    X0, X1, CY0, rc = -0.0168, 0.0168, 0.0006, 0.0022
    out = [((X0, Y0), (-1, 0))]
    for i in range(7):
        a = PI + (PI / 2) * i / 6; out.append(((X0 + rc + rc * math.cos(a), CY0 + rc + rc * math.sin(a)), (math.cos(a), math.sin(a))))
    for i in range(7):
        a = 1.5 * PI + (PI / 2) * i / 6; out.append(((X1 - rc + rc * math.cos(a), CY0 + rc + rc * math.sin(a)), (math.cos(a), math.sin(a))))
    out.append(((X1, Y0), (1, 0)))
    loft([[(p[0], p[1], 0.0072) for p, _ in out], [(p[0], p[1], 0.0078) for p, _ in out]], wht, 'canopy')
    edge = [(p[0] + nn[0] * 0.00012, p[1] + nn[1] * 0.00012, 0.0075) for p, nn in out[1:-1]]
    edge = [(X0 - 0.00012, Y0 - 0.0002, 0.0075)] + edge + [(X1 + 0.00012, Y0 - 0.0002, 0.0075)]
    tube(edge, 0.00024, nt, sides=6, normal=(0, 0, 1), name='neon')
    for k in range(6): lathe([(0.00032, 0.0), (0.00032, 0.00012)], mt('glass_lit'), 8, -0.0125 + k * 0.0050, 0.0030, 0.0071, name='downlight')
    # marquee: dark box on the canopy, recessed sign face, coral neon round the face, turquoise neon round the box
    MX, MY0, MY1, MZ0, MZ1 = 0.0188, 0.0010, 0.0032, 0.0104, 0.0236
    PX, PZ0, PZ1 = 0.0172, 0.0119, 0.0221
    for x in (-0.0150, 0.0150):                                                    # tapered pylons: canopy to marquee
        loft([[(x - 0.0007, 0.0012, 0.0078), (x + 0.0007, 0.0012, 0.0078), (x + 0.0007, 0.0030, 0.0078), (x - 0.0007, 0.0030, 0.0078)],
              [(x - 0.0004, 0.0014, MZ0 + 0.0002), (x + 0.0004, 0.0014, MZ0 + 0.0002), (x + 0.0004, 0.0028, MZ0 + 0.0002), (x - 0.0004, 0.0028, MZ0 + 0.0002)]], wht, 'pylon')
    for k in range(9): sphere((-0.0120 + k * 0.0030, 0.0021, MZ0 - 0.0002), 0.00024, mt('glass_lit'), 8, 4)   # bulbs under the marquee
    box = blk(-MX, MX, MY0, MY1, MZ0, MZ1, sb, 0.00025)
    carve(box, [opening(0, PZ0 - 0.0002, 2 * PX + 0.0004, PZ1 - PZ0 + 0.0004, MY0, sb, sb, 0.0003)])
    bm = bmesh.new(); lay = bm.loops.layers.uv.new('UVMap'); yp = MY0 + 0.00027
    f = bm.faces.new([bm.verts.new(c) for c in ((-PX, yp, PZ0), (PX, yp, PZ0), (PX, yp, PZ1), (-PX, yp, PZ1))])
    for l in f.loops: l[lay].uv = ((l.vert.co.x + PX) / (2 * PX), (l.vert.co.z - PZ0) / (PZ1 - PZ0))
    bm.normal_update()
    me = bpy.data.meshes.new('sign_panel'); bm.to_mesh(me); bm.free(); me.materials.append(mt('sign_panel'))
    link(bpy.data.objects.new('sign_panel', me))
    def rrect(x0, x1, z0, z1, r, y, n=4):
        pts = []
        for cxr, czr, a0 in ((x1 - r, z0 + r, -PI / 2), (x1 - r, z1 - r, 0), (x0 + r, z1 - r, PI / 2), (x0 + r, z0 + r, PI)):
            for i in range(n + 1):
                a = a0 + (PI / 2) * i / n; pts.append((cxr + r * math.cos(a), y, czr + r * math.sin(a)))
        return pts
    tube(rrect(-PX - 0.0006, PX + 0.0006, PZ0 - 0.0006, PZ1 + 0.0006, 0.0008, MY0 - 0.0002), 0.00022, nc, closed=True, sides=6, normal=(0, 1, 0), name='neon')
    tube(rrect(-MX + 0.0003, MX - 0.0003, MZ0 + 0.0003, MZ1 - 0.0003, 0.0011, MY0 - 0.0002), 0.00022, nt, closed=True, sides=6, normal=(0, 1, 0), name='neon')
    tb(-MX - 0.0004, MX + 0.0004, MY0 - 0.0004, MY1 + 0.0002, MZ1, MZ1 + 0.0004, wht, 0.0001)   # eyebrow cap
    for s in (-1, 1): strut((s * 0.0120, MY1, 0.0210), (s * 0.0120, Y0 + 0.0020, 0.0104), 0.00016, wht, 6)   # back braces
    # atomic starburst on a mast
    cx, cy, cz = 0.0, 0.0021, 0.0268
    strut((cx, cy, MZ1 + 0.0004), (cx, cy, cz), 0.00018, gd, 6)
    star = []
    for k in range(32):
        a = PI / 2 + 2 * PI * k / 32
        r = 0.0004 if k % 2 else (0.0026 if k % 8 == 0 else 0.0019 if k % 4 == 0 else 0.0013)
        star.append((cx + r * math.cos(a), cz + r * math.sin(a)))
    prism_xz(star, cy - 0.00015, cy + 0.00015, gd, 'star')
    star2 = []
    for k in range(16):
        a = PI / 2 + 2 * PI * k / 16 + PI / 8
        r = 0.00035 if k % 2 else 0.0014
        star2.append((cy + r * math.cos(a), cz + r * math.sin(a)))
    prism_yz(star2, cx - 0.00012, cx + 0.00012, gd, 'star2')
    tube([(cx + 0.0010 * math.cos(2 * PI * k / 16), cy - 0.0003, cz + 0.0011 * math.sin(2 * PI * k / 16)) for k in range(16)],
         0.00016, nc, closed=True, sides=6, normal=(0, 1, 0), name='neon')
    sphere((cx, cy - 0.0002, cz), 0.0004, nt, 10, 5)
    for k in range(4):
        a = PI / 2 + 2 * PI * k / 4
        sphere((cx + 0.0026 * math.cos(a), cy, cz + 0.0026 * math.sin(a)), 0.00016, gd, 8, 4)

# ---------- 5. pop bumper (origin base centre) ----------
def bumper():
    S = 40
    lathe([(0.0, 0.0), (0.0255, 0.0), (0.0260, 0.0005), (0.0260, 0.0035), (0.0255, 0.0040), (0.0, 0.0040)], mt('bumper_base'), S, name='base')
    lathe([(0.0185, 0.0040), (0.0230, 0.0040), (0.0230, 0.0050), (0.0193, 0.0088), (0.0185, 0.0088)], mt('chrome'), S, caps=False, closed=True, name='skirt')
    lathe([(0.0180, 0.0040), (0.0180, 0.0254), (0.0176, 0.0260)], mt('bumper_body'), S, name='body')
    RT = 0.0238  # radius of the flat top face: it maps to the 0..1 UV disc; the rounded rim clamps to the disc edge
    def uv(co):
        r = math.hypot(co.x, co.y); k = 1.0 / max(r, RT)
        return (0.5 + 0.5 * co.x * k, 0.5 + 0.5 * co.y * k)
    lathe([(0.0200, 0.0260), (0.0245, 0.0261), (0.0250, 0.0266), (0.0250, 0.0308), (0.0246, 0.0316), (RT, 0.0320)], mt('bumper_cap'), S, uv=uv, name='cap')

# ---------- 6. flipper (origin pivot centre, base on z=0, bat along +X) ----------
def flip_outline(off, R=0.013, r=0.0065, L=0.0755, nb=28, nt=12):
    beta = PI / 2 - math.asin((R - r) / L)
    pts = [(L + (r + off) * math.cos(a), (r + off) * math.sin(a)) for a in [-beta + 2 * beta * i / nt for i in range(nt + 1)]]
    pts += [((R + off) * math.cos(a), (R + off) * math.sin(a)) for a in [beta + (2 * PI - 2 * beta) * i / nb for i in range(nb + 1)]]
    return pts

def flipper():
    prof = [(-0.0011, 0.0), (-0.0005, 0.0006), (-0.0005, 0.0024), (-0.0013, 0.0028), (-0.0013, 0.0072), (-0.0005, 0.0076), (-0.0005, 0.0094), (-0.0011, 0.0100)]
    loft([[(x, y, z) for x, y in flip_outline(d)] for d, z in prof], mt('flipper_body'), 'body')
    rub = [(-0.0014, 0.0029), (-0.0004, 0.0029), (-0.00012, 0.0035), (0.0, 0.0050), (-0.00012, 0.0065), (-0.0004, 0.0071), (-0.0014, 0.0071)]
    loft([[(x, y, z) for x, y in flip_outline(d)] for d, z in rub], mt('flipper_rubber'), 'rubber', caps=(False, False), closed=True)
    lathe([(0.0043, 0.0098), (0.0043, 0.0104), (0.0037, 0.0110)], mt('chrome'), 32, name='pivot_cap')

# ---------- 7. spinner (two nodes) ----------
def spinner():
    ch = mt('chrome'); PX = 0.0214; PZ = 0.018
    for s in (-1, 1):
        strut((s * PX, 0, 0.0004), (s * PX, 0, 0.0200), 0.0006, ch, 8)
        blk(s * PX - 0.0006, s * PX + 0.0006, -0.0018, 0.0018, 0.0, 0.0004, ch, name='tab')
        tube([(s * (PX - 0.0007), 0.0005 * math.cos(2 * PI * k / 8), PZ + 0.0005 * math.sin(2 * PI * k / 8)) for k in range(8)],
             0.00015, ch, closed=True, sides=4, normal=(1, 0, 0), name='eye')
    strut((-PX, 0, 0.0200), (PX, 0, 0.0200), 0.0005, ch, 8)
    bracket = finalize('spinner_bracket')
    # plate in local coordinates around its pivot, then placed at the pivot height
    X, T, H = 0.020, 0.00075, 0.014
    bm = bmesh.new(); lay = bm.loops.layers.uv.new('UVMap')
    v = {(i, j, k): bm.verts.new((X * (2 * i - 1), T * (2 * j - 1), -H * (1 - k))) for i in (0, 1) for j in (0, 1) for k in (0, 1)}
    U = lambda co, back: ((1 - (co.x + X) / (2 * X)) if back else (co.x + X) / (2 * X), (co.z + H) / H)
    faces = [([(0, 0, 0), (1, 0, 0), (1, 0, 1), (0, 0, 1)], 'front'), ([(1, 1, 0), (0, 1, 0), (0, 1, 1), (1, 1, 1)], 'back'),
             ([(0, 0, 1), (1, 0, 1), (1, 1, 1), (0, 1, 1)], 'edge'), ([(0, 1, 0), (1, 1, 0), (1, 0, 0), (0, 0, 0)], 'edge'),
             ([(0, 1, 0), (0, 0, 0), (0, 0, 1), (0, 1, 1)], 'edge'), ([(1, 0, 0), (1, 1, 0), (1, 1, 1), (1, 0, 1)], 'edge')]
    for keys, kind in faces:
        f = bm.faces.new([v[k] for k in keys])
        for l in f.loops:
            l[lay].uv = U(l.vert.co, kind == 'back') if kind != 'edge' else U(l.vert.co, False)
    me = bpy.data.meshes.new('spinner_plate'); bm.to_mesh(me); bm.free(); me.materials.append(mt('spinner_plate'))
    plate = link(bpy.data.objects.new('plate', me))
    axle = strut((-0.0209, 0, 0), (0.0209, 0, 0), 0.00045, ch, 6)
    plate = finalize('spinner_plate', [plate, axle], origin=(0, 0, PZ))
    return [bracket, plate]

MODELS = [('bh_superior', bh_superior, 5000), ('bh_hale', bh_hale, 5000), ('bh_maurice', bh_maurice, 5000),
          ('bh_fordyce', bh_fordyce, 5000), ('bh_quapaw', bh_quapaw, 5000), ('bh_ozark', bh_ozark, 5000),
          ('bh_buckstaff', bh_buckstaff, 5000), ('bh_lamar', bh_lamar, 5000), ('tower', tower, 4000),
          ('arlington', arlington, 6000), ('vapors', vapors, 6000), ('bumper', bumper, 2000),
          ('flipper', flipper, 2000), ('spinner', spinner, 1000)]
AO_MODELS = {'bh_superior', 'bh_hale', 'bh_maurice', 'bh_fordyce', 'bh_quapaw', 'bh_ozark', 'bh_buckstaff', 'bh_lamar', 'arlington', 'vapors'}
NO_AO = {'glass_lit', 'glass_dark', 'neon_turquoise', 'neon_coral', 'sign_panel', 'skylight_cobalt', 'skylight_amber'}

def add_ao(ob, h=0.0032, floor=0.5):
    """Vertex-colour ground occlusion (COLOR_0): darken toward the base; glass, neon and the sign stay white."""
    me = ob.data
    ca = me.color_attributes.new('Col', 'BYTE_COLOR', 'CORNER')
    me.color_attributes.active_color = ca
    zmin = min(v.co.z for v in me.vertices)
    skip = {i for i, m in enumerate(me.materials) if m and m.name in NO_AO}
    for p in me.polygons:
        for li in p.loop_indices:
            if p.material_index in skip: c = 1.0
            else:
                t = min(1.0, (me.vertices[me.loops[li].vertex_index].co.z - zmin) / h); c = floor + (1 - floor) * t * t * (3 - 2 * t)
            ca.data[li].color = (c, c, c, 1.0)

def export(name, objs):
    for o in bpy.context.scene.objects: o.select_set(o in objs)
    kw = dict(filepath=os.path.join(OUT, name + '.glb'), export_format='GLB', use_selection=True,
              export_apply=True, export_yup=True, export_materials='EXPORT', export_cameras=False,
              export_lights=False, export_animations=False)
    if name in AO_MODELS: kw['export_vertex_color'] = 'ACTIVE'
    else: kw['export_vertex_color'] = 'NONE'
    bpy.ops.export_scene.gltf(**kw)

def build():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    for name, fn, budget in MODELS:
        if ONLY and name not in ONLY: continue
        clear()
        res = fn()
        objs = res if res else [finalize(name)]
        if name in AO_MODELS: add_ao(objs[0])
        tris = 0
        for o in objs: o.data.calc_loop_triangles(); tris += len(o.data.loop_triangles)
        print('built %-14s %5d tris%s' % (name, tris, '  OVER BUDGET %d' % budget if tris > budget else ''))
        export(name, objs)

# ---------- verification: read every GLB back ----------
def glb_info(path):
    data = open(path, 'rb').read(); js = None; binc = b''; off = 12
    while off < len(data):
        clen, ctype = struct.unpack_from('<II', data, off); off += 8
        if ctype == 0x4E4F534A: js = json.loads(data[off:off + clen].decode('utf-8'))
        elif ctype == 0x004E4942: binc = data[off:off + clen]
        off += clen
    acc, bvs = js['accessors'], js['bufferViews']
    def vec(ai):
        a = acc[ai]; bv = bvs[a['bufferView']]; n = {'VEC2': 2, 'VEC3': 3}[a['type']]
        st = bv.get('byteStride', 4 * n); base = bv.get('byteOffset', 0) + a.get('byteOffset', 0)
        return [struct.unpack_from('<%df' % n, binc, base + i * st) for i in range(a['count'])]
    mats = [m.get('name') for m in js.get('materials', [])]
    info = {'nodes': [], 'materials': mats, 'images': len(js.get('images', [])), 'tris': 0, 'uv': {}, 'warn': [], 'color0': False}
    lo, hi = [1e9] * 3, [-1e9] * 3
    for n in js['nodes']:
        t = n.get('translation', [0, 0, 0])
        info['nodes'].append('%s%s' % (n.get('name'), ' @(%.4f,%.4f,%.4f)' % (t[0], -t[2], t[1]) if any(t) else ''))
        if 'rotation' in n or 'scale' in n: info['warn'].append('node %s has rotation/scale' % n.get('name'))
        if 'mesh' not in n: continue
        for p in js['meshes'][n['mesh']]['primitives']:
            pa = acc[p['attributes']['POSITION']]
            info['tris'] += (acc[p['indices']]['count'] if 'indices' in p else pa['count']) // 3
            for k in range(3): lo[k] = min(lo[k], pa['min'][k] + t[k]); hi[k] = max(hi[k], pa['max'][k] + t[k])
            mn = mats[p['material']] if 'material' in p else None
            if 'COLOR_0' in p['attributes']: info['color0'] = True
            if 'TEXCOORD_0' in p['attributes'] and mn in ('bumper_cap', 'spinner_plate', 'sign_panel'):
                uv = vec(p['attributes']['TEXCOORD_0'])
                info['uv'][mn] = [round(min(u for u, _ in uv), 3), round(max(u for u, _ in uv), 3), round(min(w for _, w in uv), 3), round(max(w for _, w in uv), 3)]
    # glTF is +Y up: Blender X = x, Y = -z, Z = y
    info['bbox_min'] = [round(lo[0], 4), round(-hi[2], 4), round(lo[1], 4)]
    info['bbox_max'] = [round(hi[0], 4), round(-lo[2], 4), round(hi[1], 4)]
    info['size'] = [round(info['bbox_max'][k] - info['bbox_min'][k], 4) for k in range(3)]
    return info

def verify():
    rep = {}
    for name, _, budget in MODELS:
        p = os.path.join(OUT, name + '.glb')
        if not os.path.exists(p): continue
        i = glb_info(p); i['budget'] = budget; rep[name] = i
        print('VERIFY', name, json.dumps(i))
    return rep

# ---------- contact sheet ----------
LAYOUT = [('tower', -0.085, 0.080), ('arlington', -0.012, 0.080), ('vapors', 0.068, 0.080),
          ('bh_superior', -0.0945, 0.025), ('bh_hale', -0.0675, 0.025), ('bh_maurice', -0.0405, 0.025), ('bh_fordyce', -0.0135, 0.025),
          ('bh_quapaw', 0.0135, 0.025), ('bh_ozark', 0.0405, 0.025), ('bh_buckstaff', 0.0675, 0.025), ('bh_lamar', 0.0945, 0.025),
          ('bumper', -0.080, -0.042), ('flipper', -0.032, -0.042), ('spinner', 0.082, -0.042)]

def stage():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    for name, x, y in LAYOUT:
        p = os.path.join(OUT, name + '.glb')
        if not os.path.exists(p): continue
        before = set(bpy.data.objects)
        bpy.ops.import_scene.gltf(filepath=p)
        for o in [o for o in bpy.data.objects if o not in before and o.parent is None]:
            o.location.x += x; o.location.y += y
    me = bpy.data.meshes.new('ground'); bm = bmesh.new()
    bmesh.ops.create_grid(bm, x_segments=1, y_segments=1, size=1.0); bm.to_mesh(me); bm.free()
    g = bpy.data.materials.new('ground'); g.diffuse_color = (0.3, 0.3, 0.3, 1)
    b = next(n for n in g.node_tree.nodes if n.type == 'BSDF_PRINCIPLED')
    b.inputs['Base Color'].default_value = (0.32, 0.32, 0.32, 1); b.inputs['Roughness'].default_value = 0.85
    me.materials.append(g); link(bpy.data.objects.new('ground', me))
    sd = bpy.data.lights.new('sun', 'SUN'); sd.energy = 3.0; sd.angle = math.radians(6); sd.color = (1.0, 0.96, 0.9)
    sun = link(bpy.data.objects.new('sun', sd))
    sun.rotation_euler = Vector((-0.45, -0.55, 0.9)).normalized().to_track_quat('Z', 'Y').to_euler()
    w = bpy.data.worlds.new('w'); sc.world = w
    if w.node_tree is None:
        w.use_nodes = True
    bg = next(n for n in w.node_tree.nodes if n.type == 'BACKGROUND')
    bg.inputs['Color'].default_value = (0.62, 0.66, 0.72, 1); bg.inputs['Strength'].default_value = 0.6
    sc.render.engine = 'CYCLES'; sc.cycles.samples = 64; sc.cycles.use_denoising = True
    try:
        pr = bpy.context.preferences.addons['cycles'].preferences
        for dev in ('OPTIX', 'CUDA', 'HIP', 'ONEAPI'):
            try:
                pr.compute_device_type = dev; pr.get_devices()
                if any(d.type == dev for d in pr.devices):
                    for d in pr.devices: d.use = d.type == dev
                    sc.cycles.device = 'GPU'; break
            except Exception: continue
    except Exception as e: print('cpu render', e)
    sc.view_settings.view_transform = 'Standard'; sc.view_settings.look = 'None'
    sc.render.image_settings.file_format = 'PNG'
    cd = bpy.data.cameras.new('cam'); cd.clip_start = 0.002; cd.clip_end = 5
    sc.camera = link(bpy.data.objects.new('cam', cd))

def shoot(path, target, w, h, persp=None, ortho=None):
    sc = bpy.context.scene; cam = sc.camera; t = Vector(target)
    if persp:  # (distance, elevation deg, azimuth deg, lens)
        d, el, az, lens = persp; cam.data.type = 'PERSP'; cam.data.lens = lens
        el, az = math.radians(el), math.radians(az)
        cam.location = t + d * Vector((math.sin(az) * math.cos(el), -math.cos(az) * math.cos(el), math.sin(el)))
    else:      # (ortho scale, tilt from straight down toward the player, deg)
        sc_, tilt = ortho; cam.data.type = 'ORTHO'; cam.data.ortho_scale = sc_
        cam.location = t + 1.0 * Vector((0, -math.sin(math.radians(tilt)), math.cos(math.radians(tilt))))
    cam.rotation_euler = (t - cam.location).to_track_quat('-Z', 'Y').to_euler()
    sc.render.resolution_x, sc.render.resolution_y = w, h
    sc.render.filepath = path; bpy.ops.render.render(write_still=True)
    print('rendered', path)

if __name__ == '__main__':
    build()
    verify()
    if not NO_PREVIEW:
        stage()
        shoot(os.path.join(OUT, 'preview.png'), (0.0, 0.014, 0.006), 2000, 1250, persp=(0.70, 52, -12, 80))
        if REVIEW:
            os.makedirs(REVIEW, exist_ok=True)
            shoot(os.path.join(REVIEW, 'row_game.png'), (0.0, 0.032, 0.008), 2400, 520, ortho=(0.225, 18))
            shoot(os.path.join(REVIEW, 'row_34.png'), (0.0, 0.03, 0.008), 2400, 900, persp=(0.20, 35, -20, 50))
            shoot(os.path.join(REVIEW, 'back_34.png'), (0.0, 0.085, 0.02), 2000, 1000, persp=(0.22, 30, -25, 50))
            shoot(os.path.join(REVIEW, 'front_34.png'), (0.0, -0.035, 0.008), 2000, 900, persp=(0.20, 40, -15, 50))
