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
    'stucco': ('#F3EFE6', 0, 0.8), 'cream_brick': ('#E6D7B5', 0, 0.75), 'stone_trim': ('#D9CFBA', 0, 0.7),
    'yellow_brick': ('#E3CF94', 0, 0.75), 'lozenge_brick': ('#6E4B2F', 0, 0.7), 'buff_brick': ('#D8C29A', 0, 0.75),
    'tan_trim': ('#B89A6A', 0, 0.65), 'red_tile': ('#A9432C', 0, 0.55), 'red_tile_shadow': ('#7E2F1F', 0, 0.6),
    'green_tile': ('#4E7D5B', 0, 0.4, 0.3), 'terra_cotta': ('#C46A3E', 0, 0.6), 'iron': ('#1F2A24', 0.6, 0.45),
    'copper': ('#B87333', 1, 0.35), 'bronze': ('#6B4E2E', 1, 0.4), 'brass': ('#C9A23F', 1, 0.3), 'gold': ('#D4AF37', 1, 0.28),
    'skylight_cobalt': ('#2B4C9B', 0, 0.12, 0.5), 'skylight_amber': ('#D9A23A', 0, 0.12, 0.5),
    'dome_buff': ('#D8C29A', 0, 0.45, 0.3), 'dome_tan': ('#B89A6A', 0, 0.45, 0.3), 'dome_cream': ('#EFE4C8', 0, 0.45, 0.3),
    'dome_ochre': ('#C8963E', 0, 0.45, 0.3), 'turquoise_tile': ('#3FA8A0', 0, 0.35, 0.4),
    'roof_flat': ('#8F897F', 0, 0.9), 'glass_dark': ('#1C2A36', 0, 0.1), 'glass_lit': ('#F2C46D', 0, 0.25),
    'arlington_brick': ('#E8D49C', 0, 0.75),
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

def hip(x0, x1, y0, y1, z, h, m, ridge=0.0, inset=None, courses=1, lip=0.00012, name='roof'):
    """Hipped tile roof over a rectangle, built as overlapping courses (each course's lip reads as a tile row).
    ridge: fraction of the long side kept as a ridge (0 = pyramid); inset=(ix, iy) gives a flat-topped cap instead."""
    W, D = x1 - x0, y1 - y0
    if inset: ax, ay = inset
    elif W >= D: ax, ay = (W / 2) * (1 - ridge), D / 2
    else: ax, ay = W / 2, (D / 2) * (1 - ridge)
    def rect(t, e=0.0):
        zz = z + t * h
        return [(x0 + t * ax - e, y0 + t * ay - e, zz), (x1 - t * ax + e, y0 + t * ay - e, zz),
                (x1 - t * ax + e, y1 - t * ay + e, zz), (x0 + t * ax - e, y1 - t * ay + e, zz)]
    for k in range(courses):
        ta, tb = k / courses, (k + 1) / courses
        loft([rect(ta, lip if k else 0.0), rect(tb)], m, name, (True, k == courses - 1), recalc=False)

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
def parapet_ring(x0, x1, y0, y1, z0, z1, t, m):
    blk(x0, x1, y0, y0 + t, z0, z1, m); blk(x0, x1, y1 - t, y1, z0, z1, m)
    blk(x0, x0 + t, y0 + t, y1 - t, z0, z1, m); blk(x1 - t, x1, y0 + t, y1 - t, z0, z1, m)

def bh_superior():
    """1916: smallest on the Row. Cream brick, flat parapet with green tile coping, green paterae frieze."""
    blk(-0.0108, 0.0108, 0.0, 0.0130, 0.0, 0.0010, mt('stone_trim'), 0.0002)
    blk(-0.0102, 0.0102, 0.0006, 0.0126, 0.0010, 0.0112, mt('cream_brick'), 0.00025)
    blk(-0.0104, 0.0104, 0.0004, 0.0128, 0.0060, 0.0066, mt('stucco'))
    blk(-0.0104, 0.0104, 0.0004, 0.0128, 0.0096, 0.0110, mt('stucco'))
    for k in range(7): disc_y(-0.0084 + k * 0.0028, 0.0103, 0.00042, 0.0001, 0.0005, mt('green_tile'))
    blk(-0.0110, 0.0110, 0.0001, 0.0130, 0.0110, 0.0117, mt('stucco'), 0.00015)
    parapet_ring(-0.0106, 0.0106, 0.0003, 0.0127, 0.0117, 0.0133, 0.0008, mt('cream_brick'))
    parapet_ring(-0.0108, 0.0108, 0.0001, 0.0129, 0.0133, 0.0136, 0.0012, mt('green_tile'))
    blk(-0.0040, 0.0040, 0.0003, 0.0011, 0.0136, 0.0137, mt('cream_brick'))   # raised centre panel
    blk(-0.0042, 0.0042, 0.0001, 0.0013, 0.0137, 0.0140, mt('green_tile'), 0.0001)
    blk(-0.0098, 0.0098, 0.0011, 0.0119, 0.0117, 0.0121, mt('roof_flat'))
    blk(0.0030, 0.0062, 0.0074, 0.0102, 0.0121, 0.0128, mt('stucco'), 0.0001)  # roof hatch
    panes([-0.0080, -0.0040, 0.0, 0.0040, 0.0080], 0.0072, 0.0092, 0.0022, 0.0006, mt('glass_dark'))
    panes([-0.0080, -0.0047, 0.0047, 0.0080], 0.0022, 0.0052, 0.0024, 0.0006, mt('glass_lit'))
    arch(0, 0.0010, 0.0040, 0.0054, 0.0003, 0.0007, mt('stucco'))
    arch(0, 0.0010, 0.0028, 0.0047, 0.0001, 0.0005, mt('glass_lit'))

def bh_hale():
    """1892: oldest. Stucco block, red tile hip roof, porch with a small Mission bell gable."""
    blk(-0.0106, 0.0106, 0.0, 0.0150, 0.0, 0.0010, mt('stone_trim'), 0.0002)
    blk(-0.0098, 0.0098, 0.0036, 0.0144, 0.0010, 0.0114, mt('stucco'), 0.00025)
    hip(-0.0104, 0.0104, 0.0030, 0.0150, 0.0114, 0.0042, mt('red_tile'), ridge=0.35, courses=4)
    rl = 0.0208 * 0.35 / 2
    blk(-rl - 0.0003, rl + 0.0003, 0.0087, 0.0093, 0.0153, 0.0160, mt('red_tile_shadow'), 0.0001)
    blk(-0.0094, 0.0094, 0.0, 0.0038, 0.0010, 0.0015, mt('stone_trim'))
    for x in (-0.0088, -0.0053, -0.0018, 0.0018, 0.0053, 0.0088):
        blk(x - 0.0005, x + 0.0005, 0.0003, 0.0013, 0.0015, 0.0060, mt('stucco'), 0.0001)
    blk(-0.0096, 0.0096, 0.0001, 0.0038, 0.0060, 0.0065, mt('stucco'))
    prism_yz([(0.0, 0.0065), (0.0038, 0.0065), (0.0038, 0.0076), (0.0, 0.0068)], -0.0097, 0.0097, mt('red_tile'))
    blk(-0.0088, 0.0088, 0.0006, 0.0009, 0.0027, 0.0030, mt('iron'))
    blk(-0.0088, 0.0088, 0.0006, 0.0009, 0.0017, 0.0019, mt('iron'))
    g = [(-0.0030, 0.0066), (0.0030, 0.0066), (0.0030, 0.0080), (0.0022, 0.0082), (0.0016, 0.0087), (0.0008, 0.0091), (0.0, 0.0093),
         (-0.0008, 0.0091), (-0.0016, 0.0087), (-0.0022, 0.0082), (-0.0030, 0.0080)]
    prism_xz(g, 0.0002, 0.0008, mt('stucco'), 'gable')
    arch(0, 0.0072, 0.0012, 0.0016, 0.0000, 0.0003, mt('iron'))     # bell opening
    panes([-0.0080 + k * 0.0032 for k in range(6)], 0.0076, 0.0100, 0.0018, 0.0036, mt('glass_dark'))
    panes([-0.0070, -0.0035, 0.0035, 0.0070], 0.0020, 0.0050, 0.0020, 0.0036, mt('glass_lit'))
    blk(-0.0012, 0.0012, 0.0032, 0.0036, 0.0015, 0.0055, mt('glass_lit'))

def bh_maurice():
    """1912: white block, sun porch of five arches, green tile roof cap (mansard ring round a flat deck)."""
    blk(-0.0108, 0.0108, 0.0, 0.0148, 0.0, 0.0010, mt('stone_trim'), 0.0002)
    blk(-0.0102, 0.0102, 0.0006, 0.0142, 0.0010, 0.0138, mt('stucco'), 0.00025)
    blk(-0.0104, 0.0104, 0.0004, 0.0144, 0.0064, 0.0068, mt('terra_cotta'))
    for k in range(5):
        x = -0.0080 + k * 0.0040
        arch(x, 0.0012, 0.0034, 0.0048, 0.0003, 0.0007, mt('terra_cotta'))
        arch(x, 0.0014, 0.0026, 0.0042, 0.0001, 0.0005, mt('glass_lit'))
    xs = [-0.0085 + k * 0.0034 for k in range(6)]
    panes(xs, 0.0074, 0.0094, 0.0020, 0.0006, mt('glass_dark'))
    panes(xs, 0.0106, 0.0126, 0.0020, 0.0006, mt('glass_dark'))
    blk(-0.0108, 0.0108, 0.0001, 0.0148, 0.0136, 0.0143, mt('stucco'), 0.00015)
    hip(-0.0106, 0.0106, 0.0003, 0.0146, 0.0143, 0.0035, mt('green_tile'), inset=(0.0045, 0.0045), courses=3)
    blk(-0.0059, 0.0059, 0.0050, 0.0099, 0.0176, 0.0180, mt('roof_flat'))

def bh_fordyce():
    """1915: largest. Yellow brick with lozenge band, two red tile end pavilions, flat centre with a stained-glass
    skylight, copper-and-glass marquee."""
    blk(-0.0108, 0.0108, 0.0, 0.0152, 0.0, 0.0010, mt('stone_trim'), 0.0002)
    blk(-0.0066, 0.0066, 0.0014, 0.0148, 0.0010, 0.0162, mt('yellow_brick'), 0.00025)
    for s in (-1, 1):
        x0, x1 = sorted((s * 0.0064, s * 0.0104))
        blk(x0, x1, 0.0006, 0.0150, 0.0010, 0.0154, mt('yellow_brick'), 0.00025)
        blk(x0 - 0.0001, x1 + 0.0001, 0.0004, 0.0152, 0.0150, 0.0155, mt('stone_trim'))
        h0, h1 = sorted((s * 0.0060, s * 0.0108))
        hip(h0, h1, 0.0002, 0.0154, 0.0155, 0.0042, mt('red_tile'), ridge=0.4, courses=4)
        cx = s * 0.0084; rl = 0.0152 * 0.4 / 2
        blk(cx - 0.0003, cx + 0.0003, 0.0078 - rl - 0.0003, 0.0078 + rl + 0.0003, 0.0194, 0.0200, mt('red_tile_shadow'), 0.0001)
        panes([cx], 0.0020, 0.0050, 0.0018, 0.0006, mt('glass_lit'))
        panes([cx], 0.0068, 0.0090, 0.0018, 0.0006, mt('glass_dark'))
        panes([cx], 0.0116, 0.0138, 0.0018, 0.0006, mt('glass_dark'))
    blk(-0.0068, 0.0068, 0.0010, 0.0150, 0.0160, 0.0166, mt('stone_trim'))
    blk(-0.0064, 0.0064, 0.0016, 0.0146, 0.0166, 0.0168, mt('roof_flat'))
    blk(-0.0046, 0.0046, 0.0040, 0.0124, 0.0166, 0.0175, mt('copper'), 0.0001)
    for i in range(4):
        for j in range(2):
            x = -0.0043 + 0.00033 + i * (0.0019 + 0.00033); y = 0.0043 + 0.0002 + j * (0.0036 + 0.0002)
            blk(x, x + 0.0019, y, y + 0.0036, 0.0173, 0.0178, mt('skylight_amber' if (i + j) % 2 else 'skylight_cobalt'))
    xs = [-0.0045, -0.0015, 0.0015, 0.0045]
    panes(xs, 0.0020, 0.0050, 0.0020, 0.0014, mt('glass_lit'))
    panes(xs, 0.0066, 0.0090, 0.0018, 0.0014, mt('glass_dark'))
    panes(xs, 0.0118, 0.0142, 0.0018, 0.0014, mt('glass_dark'))
    for k in range(7):
        x = -0.0054 + k * 0.0018
        prism_xz([(x - 0.0007, 0.0104), (x, 0.0109), (x + 0.0007, 0.0104), (x, 0.0099)], 0.0010, 0.0014, mt('lozenge_brick'))
    blk(-0.0052, 0.0052, 0.0000, 0.0018, 0.0054, 0.0059, mt('copper'), 0.0001)
    blk(-0.0047, 0.0047, 0.0002, 0.0015, 0.0059, 0.0061, mt('glass_lit'))

def bh_quapaw():
    """1922: widest facade, arcade, scalloped parapet with gold finials, chevron-tiled dome with copper lantern."""
    blk(-0.0110, 0.0110, 0.0, 0.0150, 0.0, 0.0010, mt('stone_trim'), 0.0002)
    blk(-0.0107, 0.0107, 0.0008, 0.0146, 0.0010, 0.0100, mt('buff_brick'), 0.00025)
    for k in range(7):
        x = -0.0090 + k * 0.0030
        arch(x, 0.0014, 0.0026, 0.0060, 0.0004, 0.0009, mt('tan_trim'))
        arch(x, 0.0016, 0.0018, 0.0054, 0.0002, 0.0006, mt('glass_lit'))
    blk(-0.0108, 0.0108, 0.0006, 0.0147, 0.0084, 0.0090, mt('dome_ochre'))
    blk(-0.0110, 0.0110, 0.0003, 0.0150, 0.0100, 0.0106, mt('stone_trim'), 0.00015)
    blk(-0.0108, 0.0108, 0.0004, 0.0010, 0.0106, 0.0114, mt('buff_brick'))
    for k in range(9):
        x = -0.0096 + k * 0.0024
        prism_xz([(x + 0.0011 * math.cos(PI * i / 8), 0.0114 + 0.0011 * math.sin(PI * i / 8)) for i in range(9)], 0.0004, 0.0010, mt('buff_brick'), 'scallop')
    for x in (-0.0084, -0.0036, 0.0036, 0.0084):  # sculpin finials (abstract)
        prism_xz([(x - 0.0005, 0.0112), (x + 0.0005, 0.0112), (x + 0.0003, 0.0122), (x, 0.0128), (x - 0.0003, 0.0122)], 0.0003, 0.0007, mt('gold'))
    blk(-0.0108, -0.0102, 0.0010, 0.0148, 0.0106, 0.0112, mt('buff_brick'))
    blk(0.0102, 0.0108, 0.0010, 0.0148, 0.0106, 0.0112, mt('buff_brick'))
    blk(-0.0102, 0.0102, 0.0142, 0.0148, 0.0106, 0.0112, mt('buff_brick'))
    blk(-0.0102, 0.0102, 0.0010, 0.0142, 0.0106, 0.0109, mt('roof_flat'))
    cy = 0.0078
    lathe([(0.0060, 0.0), (0.0060, 0.0022)], [mt('dome_ochre'), mt('turquoise_tile')], 24, 0, cy, 0.0106, face_mat=lambda j, i: i % 2)
    lathe([(0.0064, 0.0), (0.0064, 0.0006)], mt('dome_ochre'), 32, 0, cy, 0.0128)
    rings = 12
    prof = [(0.0062 * math.cos(PI / 2 * j / rings), 0.0064 * math.sin(PI / 2 * j / rings)) for j in range(rings + 1)]
    prof[-1] = (0.0, prof[-1][1])
    dm = [mt('dome_cream'), mt('dome_tan'), mt('dome_buff'), mt('turquoise_tile')]
    def chevron(j, i):  # zigzag bands two faces thick: cream, tan, buff, tan ...; a turquoise panel row at the base
        if j == 1 and i % 3 == 0: return 3
        return (0, 1, 2, 1)[((j + abs(i % 6 - 3)) // 2) % 4]
    lathe(prof, dm, 24, 0, cy, 0.0134, face_mat=chevron, name='dome')
    lathe([(0.0018, 0.0), (0.0018, 0.0006)], mt('bronze'), 16, 0, cy, 0.0194)
    lathe([(0.0011, 0.0), (0.0011, 0.0032)], mt('glass_lit'), 12, 0, cy, 0.0200)
    for k in range(6):
        a = 2 * PI * k / 6
        strut((0.0016 * math.cos(a), cy + 0.0016 * math.sin(a), 0.0200), (0.0016 * math.cos(a), cy + 0.0016 * math.sin(a), 0.0232), 0.00026, mt('copper'), 4)
    lathe([(0.0021, 0.0), (0.0021, 0.0004)], mt('copper'), 16, 0, cy, 0.0232)
    lathe([(0.0019, 0.0), (0.0012, 0.0012), (0.0004, 0.0026), (0.0, 0.0030)], mt('copper'), 16, 0, cy, 0.0236)
    strut((0, cy, 0.0264), (0, cy, 0.0292), 0.00022, mt('copper'), 6)
    sphere((0, cy, 0.02955), 0.00045, mt('copper'), 10, 5)

def bh_ozark():
    """1922: low white block between two three-step towers with red tile caps."""
    blk(-0.0110, 0.0110, 0.0, 0.0150, 0.0, 0.0010, mt('stone_trim'), 0.0002)
    blk(-0.0050, 0.0050, 0.0012, 0.0144, 0.0010, 0.0118, mt('stucco'), 0.00025)
    blk(-0.0052, 0.0052, 0.0010, 0.0146, 0.0118, 0.0123, mt('stucco'), 0.00012)
    blk(-0.0050, 0.0050, 0.0011, 0.0017, 0.0123, 0.0130, mt('stucco'))
    blk(-0.0048, 0.0048, 0.0017, 0.0142, 0.0123, 0.0125, mt('roof_flat'))
    arch(0, 0.0010, 0.0040, 0.0064, 0.0010, 0.0014, mt('stone_trim'))
    arch(0, 0.0010, 0.0030, 0.0058, 0.0008, 0.0012, mt('glass_lit'))
    panes([-0.0030, 0.0, 0.0030], 0.0084, 0.0104, 0.0016, 0.0012, mt('glass_dark'))
    for s in (-1, 1):
        cx = s * 0.0078
        blk(cx - 0.0032, cx + 0.0032, 0.0004, 0.0146, 0.0010, 0.0150, mt('stucco'), 0.00025)
        blk(cx - 0.0026, cx + 0.0026, 0.0010, 0.0082, 0.0150, 0.0182, mt('stucco'), 0.0002)
        blk(cx - 0.0020, cx + 0.0020, 0.0016, 0.0076, 0.0182, 0.0210, mt('stucco'), 0.0002)
        hip(cx - 0.0024, cx + 0.0024, 0.0012, 0.0080, 0.0210, 0.0050, mt('red_tile'), ridge=0.25, courses=3)
        panes([cx], 0.0018, 0.0040, 0.0024, 0.0004, mt('glass_lit'))
        panes([cx], 0.0052, 0.0136, 0.0012, 0.0004, mt('glass_dark'))
        panes([cx], 0.0158, 0.0176, 0.0010, 0.0010, mt('glass_dark'))
        panes([cx], 0.0188, 0.0204, 0.0008, 0.0016, mt('glass_dark'))

def bh_buckstaff():
    """1912: seven bays between pilasters, brass paterae row, raised attic parapet (no lettering)."""
    blk(-0.0108, 0.0108, 0.0, 0.0140, 0.0, 0.0010, mt('stone_trim'), 0.0002)
    blk(-0.0102, 0.0102, 0.0006, 0.0136, 0.0010, 0.0130, mt('cream_brick'), 0.00025)
    for k in range(8):
        x = -0.0098 + k * 0.0028
        blk(x - 0.0004, x + 0.0004, 0.0002, 0.0006, 0.0010, 0.0108, mt('stucco'))
    bays = [-0.0084 + b * 0.0028 for b in range(7)]
    panes(bays, 0.0072, 0.0096, 0.0016, 0.0006, mt('glass_dark'))
    panes([x for b, x in enumerate(bays) if b != 3], 0.0020, 0.0052, 0.0018, 0.0006, mt('glass_lit'))
    arch(0, 0.0010, 0.0020, 0.0046, 0.0002, 0.0007, mt('glass_lit'))
    blk(-0.0050, 0.0050, 0.0001, 0.0005, 0.0059, 0.0063, mt('brass'))
    blk(-0.0104, 0.0104, 0.0004, 0.0138, 0.0106, 0.0120, mt('stucco'))
    for x in bays: disc_y(x, 0.0113, 0.00045, 0.0001, 0.0005, mt('brass'))
    blk(-0.0110, 0.0110, 0.0001, 0.0140, 0.0120, 0.0127, mt('stucco'), 0.00015)
    blk(-0.0106, 0.0106, 0.0003, 0.0010, 0.0127, 0.0150, mt('cream_brick'))
    blk(-0.0108, 0.0108, 0.0001, 0.0012, 0.0150, 0.0154, mt('stucco'), 0.0001)
    blk(-0.0045, 0.0045, 0.0003, 0.0010, 0.0154, 0.0176, mt('cream_brick'))
    blk(-0.0047, 0.0047, 0.0001, 0.0012, 0.0176, 0.0180, mt('stucco'), 0.0001)
    disc_y(0, 0.0165, 0.0006, 0.0001, 0.0004, mt('brass'), 12)
    parapet_ring(-0.0106, 0.0106, 0.0010, 0.0138, 0.0127, 0.0140, 0.0007, mt('cream_brick'))
    blk(-0.0099, 0.0099, 0.0010, 0.0131, 0.0127, 0.0133, mt('roof_flat'))
    blk(-0.0035, 0.0035, 0.0075, 0.0120, 0.0130, 0.0158, mt('stucco'), 0.00015)
    blk(-0.0037, 0.0037, 0.0073, 0.0122, 0.0158, 0.0161, mt('roof_flat'))

def bh_lamar():
    """1923: the simplest. Flat parapet with red tile coping, five tall bays, small tile pent over the door."""
    blk(-0.0106, 0.0106, 0.0, 0.0130, 0.0, 0.0010, mt('stone_trim'), 0.0002)
    blk(-0.0100, 0.0100, 0.0006, 0.0126, 0.0010, 0.0120, mt('stucco'), 0.00025)
    for k in range(6):
        x = -0.0096 + k * 0.00384
        blk(x - 0.0004, x + 0.0004, 0.0002, 0.0006, 0.0010, 0.0116, mt('stucco'))
    bays = [-0.00768 + b * 0.00384 for b in range(5)]
    panes(bays, 0.0068, 0.0102, 0.0022, 0.0006, mt('glass_dark'))
    panes([x for b, x in enumerate(bays) if b != 2], 0.0020, 0.0054, 0.0022, 0.0006, mt('glass_lit'))
    blk(-0.0012, 0.0012, 0.0002, 0.0006, 0.0010, 0.0054, mt('glass_lit'))
    prism_yz([(0.0000, 0.0058), (0.0030, 0.0063), (0.0030, 0.0068), (0.0000, 0.0061)], -0.0018, 0.0018, mt('red_tile'))
    blk(-0.0104, 0.0104, 0.0002, 0.0128, 0.0116, 0.0121, mt('stucco'), 0.00015)
    parapet_ring(-0.0102, 0.0102, 0.0004, 0.0126, 0.0121, 0.0133, 0.0008, mt('stucco'))
    for (x0, x1, y0, y1) in ((-0.0104, 0.0104, 0.0002, 0.0014), (-0.0104, 0.0104, 0.0116, 0.0128),
                             (-0.0104, -0.0092, 0.0014, 0.0116), (0.0092, 0.0104, 0.0014, 0.0116)):
        hip(x0, x1, y0, y1, 0.0133, 0.0007, mt('red_tile'), ridge=0.9)
    blk(-0.0094, 0.0094, 0.0012, 0.0118, 0.0121, 0.0124, mt('roof_flat'))

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
    """1924: twin towers with red tile pyramid caps joined by a central block; wings; arched entrance."""
    br, tr, rt = mt('arlington_brick'), mt('stone_trim'), mt('red_tile')
    rnd = random.Random(5)
    lit = lambda: mt('glass_dark') if rnd.random() < 0.18 else mt('glass_lit')
    blk(-0.0280, 0.0280, 0.0002, 0.0180, 0.0, 0.0012, tr, 0.0002)
    for s in (-1, 1):
        x0, x1 = sorted((s * 0.0155, s * 0.0275))
        blk(x0, x1, 0.0025, 0.0175, 0.0012, 0.0186, br, 0.00025)
        blk(x0 - 0.0002, x1 + 0.0002, 0.0023, 0.0177, 0.0186, 0.0192, tr, 0.00012)
        h0, h1 = sorted((s * 0.0151, s * 0.0279))
        hip(h0, h1, 0.0021, 0.0179, 0.0192, 0.0040, rt, ridge=0.4, courses=3)
        for c in range(4):
            x = s * (0.0175 + c * 0.0027)
            for r in range(4):
                panes([x], 0.0030 + r * 0.0038, 0.0050 + r * 0.0038, 0.0015, 0.0025, lit())
    blk(-0.0155, 0.0155, 0.0008, 0.0170, 0.0012, 0.0212, br, 0.00025)
    blk(-0.0157, 0.0157, 0.0006, 0.0172, 0.0212, 0.0218, tr, 0.00012)
    hip(-0.0159, 0.0159, 0.0006, 0.0172, 0.0218, 0.0040, rt, ridge=0.45, courses=3)
    for s in (-1, 1):
        cx = s * 0.0095
        blk(cx - 0.0037, cx + 0.0037, 0.0004, 0.0078, 0.0012, 0.0272, br, 0.00025)
        blk(cx - 0.0039, cx + 0.0039, 0.0002, 0.0080, 0.0268, 0.0272, tr)
        blk(cx - 0.0033, cx + 0.0033, 0.0008, 0.0074, 0.0272, 0.0290, br, 0.0002)
        blk(cx - 0.0040, cx + 0.0040, 0.0002, 0.0080, 0.0290, 0.0295, tr, 0.00012)
        hip(cx - 0.0038, cx + 0.0038, 0.0003, 0.0079, 0.0295, 0.0045, rt, courses=3)
        for dx in (-0.0013, 0.0013):
            arch(cx + dx, 0.0274, 0.0014, 0.0014, 0.0005, 0.0009, mt('glass_dark'), 4)
            for r in range(6):
                panes([cx + dx], 0.0032 + r * 0.0037, 0.0052 + r * 0.0037, 0.0014, 0.0004, lit())
    for r in range(3):
        panes([-0.0030, 0.0, 0.0030], 0.0102 + r * 0.0036, 0.0122 + r * 0.0036, 0.0016, 0.0008, lit())
    arch(0, 0.0012, 0.0062, 0.0078, 0.0002, 0.0008, tr)
    arch(0, 0.0012, 0.0044, 0.0064, 0.0000, 0.0004, mt('glass_lit'))
    blk(-0.0040, 0.0040, 0.0000, 0.0004, 0.0012, 0.0016, tr)  # entrance step

# ---------- 4. The Vapors (origin bottom-centre-front) ----------
def vapors():
    """1960 supper club entrance: low stone front, cantilevered canopy, atomic starburst, tall sign blade."""
    stn, wht = mt('vapors_stone'), mt('canopy_white')
    blk(-0.0197, 0.0115, 0.0050, 0.0140, 0.0, 0.0105, stn, 0.0002)
    blk(-0.0200, 0.0118, 0.0047, 0.0140, 0.0105, 0.0115, wht, 0.00015)
    blk(-0.0195, 0.0113, 0.0052, 0.0137, 0.0115, 0.0117, mt('roof_flat'))
    blk(-0.0185, -0.0128, 0.0046, 0.0051, 0.0030, 0.0090, mt('glass_lit'))
    blk(0.0060, 0.0105, 0.0046, 0.0051, 0.0030, 0.0090, mt('glass_lit'))
    for x in (-0.0166, -0.0147, 0.0075, 0.0090):
        blk(x - 0.00015, x + 0.00015, 0.0045, 0.0047, 0.0030, 0.0090, wht)
    blk(-0.0045, 0.0015, 0.0046, 0.0051, 0.0002, 0.0072, mt('glass_lit'))
    blk(-0.0016, -0.0014, 0.0045, 0.0047, 0.0002, 0.0072, wht)
    blk(-0.0050, 0.0020, 0.0042, 0.0050, 0.0, 0.0003, mt('stone_trim'))
    # canopy: rounded front corners
    X0, X1, Y0, Y1, rc = -0.0150, 0.0075, 0.0004, 0.0062, 0.0022
    out = [((X0, Y1), (-1, 0))]
    for i in range(7):
        a = PI + (PI / 2) * i / 6; out.append(((X0 + rc + rc * math.cos(a), Y0 + rc + rc * math.sin(a)), (math.cos(a), math.sin(a))))
    for i in range(7):
        a = 1.5 * PI + (PI / 2) * i / 6; out.append(((X1 - rc + rc * math.cos(a), Y0 + rc + rc * math.sin(a)), (math.cos(a), math.sin(a))))
    out.append(((X1, Y1), (1, 0)))
    loft([[(p[0], p[1], 0.0078) for p, _ in out], [(p[0], p[1], 0.0088) for p, _ in out]], wht, 'canopy')
    edge = [(p[0] + nn[0] * 0.00005, p[1] + nn[1] * 0.00005, 0.0083) for p, nn in out[1:-1]]
    edge = [(X0 - 0.00005, 0.0050, 0.0083)] + edge + [(X1 + 0.00005, 0.0050, 0.0083)]
    tube(edge, 0.0003, mt('neon_turquoise'), sides=6, normal=(0, 0, 1), name='neon')
    # starburst on the canopy
    cx, cz = -0.0105, 0.0134
    star = []
    for k in range(24):
        a = PI / 2 + 2 * PI * k / 24
        r = 0.0008 if k % 2 else (0.0044 if k % 4 == 0 else 0.0029)
        star.append((cx + r * math.cos(a), cz + r * math.sin(a)))
    prism_xz(star, 0.0030, 0.0034, mt('starburst_gold'), 'star')
    tube([(cx + 0.0012 * math.cos(2 * PI * k / 14), 0.0029, cz + 0.0012 * math.sin(2 * PI * k / 14)) for k in range(14)],
         0.00024, mt('neon_turquoise'), closed=True, sides=6, normal=(0, 1, 0))
    strut((cx, 0.0034, 0.0088), (cx, 0.0034, cz - 0.0007), 0.00025, mt('starburst_gold'), 6)
    # sign blade beside the entrance, its blank face toward the player
    blk(0.0130, 0.0200, 0.0045, 0.0080, 0.0, 0.0285, mt('sign_body'), 0.0002)
    blk(0.0112, 0.0131, 0.0058, 0.0068, 0.0096, 0.0102, mt('sign_body'))
    px0, px1, pz0, pz1 = 0.0138, 0.0192, 0.0105, 0.0265
    loft([[(px0, 0.0045, pz0), (px1, 0.0045, pz0), (px1, 0.0045, pz1), (px0, 0.0045, pz1)],
          [(px0, 0.0041, pz0), (px1, 0.0041, pz0), (px1, 0.0041, pz1), (px0, 0.0041, pz1)]],
         mt('sign_panel'), 'sign_panel', uv=lambda co: ((co.x - px0) / (px1 - px0), (co.z - pz0) / (pz1 - pz0)))
    ox0, ox1, oz0, oz1, ro = px0 - 0.0004, px1 + 0.0004, pz0 - 0.0004, pz1 + 0.0004, 0.0008
    rr = []
    for cxr, czr, a0 in ((ox1 - ro, oz0 + ro, -PI / 2), (ox1 - ro, oz1 - ro, 0), (ox0 + ro, oz1 - ro, PI / 2), (ox0 + ro, oz0 + ro, PI)):
        for i in range(5):
            a = a0 + (PI / 2) * i / 4; rr.append((cxr + ro * math.cos(a), 0.0040, czr + ro * math.sin(a)))
    tube(rr, 0.00028, mt('neon_coral'), closed=True, sides=6, normal=(0, 1, 0), name='neon')
    wave = [(0.0138 + 0.0054 * i / 16, 0.0041, 0.0062 + 0.0011 * math.sin(i / 16 * 5 * PI)) for i in range(17)]
    tube(wave, 0.00026, mt('neon_turquoise'), sides=6, normal=(0, 1, 0), name='neon')
    sphere((0.0165, 0.00625, 0.02925), 0.00075, mt('starburst_gold'), 12, 6)

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

MODELS = [('bh_superior', bh_superior, 2500), ('bh_hale', bh_hale, 2500), ('bh_maurice', bh_maurice, 2500),
          ('bh_fordyce', bh_fordyce, 2500), ('bh_quapaw', bh_quapaw, 2500), ('bh_ozark', bh_ozark, 2500),
          ('bh_buckstaff', bh_buckstaff, 2500), ('bh_lamar', bh_lamar, 2500), ('tower', tower, 4000),
          ('arlington', arlington, 3000), ('vapors', vapors, 3000), ('bumper', bumper, 2000),
          ('flipper', flipper, 2000), ('spinner', spinner, 1000)]

def export(name, objs):
    for o in bpy.context.scene.objects: o.select_set(o in objs)
    bpy.ops.export_scene.gltf(filepath=os.path.join(OUT, name + '.glb'), export_format='GLB', use_selection=True,
                              export_apply=True, export_yup=True, export_materials='EXPORT', export_cameras=False,
                              export_lights=False, export_animations=False)

def build():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    for name, fn, budget in MODELS:
        if ONLY and name not in ONLY: continue
        clear()
        res = fn()
        objs = res if res else [finalize(name)]
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
    info = {'nodes': [], 'materials': mats, 'images': len(js.get('images', [])), 'tris': 0, 'uv': {}, 'warn': []}
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
