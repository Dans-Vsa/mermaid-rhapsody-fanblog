# Rebuilds every GLB in public/models from scratch.
# Run inside Blender 5.x (Scripting tab or Blender MCP):
#   exec(open(r"C:\ME\Mermaid Rhapsody\blender\build_assets.py", encoding="utf-8").read())
# Everything is procedural (bmesh), so there are no external assets or textures.
import random

exec(open(r"C:\ME\Mermaid Rhapsody\blender\helpers.py", encoding="utf-8").read())

UP = Matrix.Rotation(math.radians(-90), 4, "Y")  # loft axis +X -> world +Z


def flat_shape(outline, thickness):
    bm = bmesh.new()
    f = bm.faces.new([bm.verts.new((x, y, 0)) for x, y in outline])
    r = bmesh.ops.extrude_face_region(bm, geom=[f])
    bmesh.ops.translate(bm, vec=(0, 0, thickness), verts=[e for e in r["geom"] if isinstance(e, bmesh.types.BMVert)])
    bmesh.ops.translate(bm, vec=(0, 0, -thickness / 2), verts=bm.verts)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    return bm


def mirrored(half):
    return list(dict.fromkeys(half + [(x, -y) for x, y in reversed(half[1:])]))


def extrude_xy(pts, z0, z1):
    bm = bmesh.new()
    f = bm.faces.new([bm.verts.new((x, y, z0)) for x, y in pts])
    r = bmesh.ops.extrude_face_region(bm, geom=[f])
    bmesh.ops.translate(bm, vec=(0, 0, z1 - z0), verts=[e for e in r["geom"] if isinstance(e, bmesh.types.BMVert)])
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    return bm


# ---------------------------------------------------------------- whale (head +X, ~18 m)
def build_whale():
    col = collection("whale")
    stations = [
        (-8.0, 0.22, 0.20, 0.15), (-7.0, 0.38, 0.45, 0.12), (-5.6, 0.75, 0.90, 0.06), (-3.6, 1.20, 1.30, 0.0),
        (-1.2, 1.55, 1.62, 0.0), (1.4, 1.72, 1.72, -0.05), (3.8, 1.68, 1.58, -0.12), (5.8, 1.42, 1.22, -0.22),
        (7.1, 1.02, 0.84, -0.32), (7.9, 0.50, 0.42, -0.42),
    ]
    body = obj_from_bm(loft(stations, segs=12), "whale_body", col)
    fluke = obj_from_bm(flat_shape(mirrored([(-7.7, 0.0), (-8.3, 0.9), (-9.1, 2.2), (-9.9, 3.2), (-9.55, 3.3), (-9.0, 2.6), (-8.75, 1.4), (-9.0, 0.35)]), 0.14), "whale_fluke", col)
    fluke.location.z = 0.15
    fins = []
    for side in (1, -1):
        pts = [(x, y * side) for x, y in [(0, 0), (0.9, 0.25), (0.6, 1.8), (0.1, 3.9), (-0.35, 4.3), (-0.5, 3.6), (-0.6, 1.2)]]
        if side < 0:
            pts = list(reversed(pts))
        f = obj_from_bm(flat_shape(pts, 0.12), f"whale_fin_{side}", col)
        f.location = (3.2, 1.25 * side, -0.9)
        f.rotation_euler = (math.radians(-28 * side), 0, math.radians(-38 * side))
        fins.append(f)
    dorsal = obj_from_bm(flat_shape([(0, 0), (-1.1, 0), (-1.5, 0.55), (-0.9, 0.35)], 0.1), "whale_dorsal", col)
    dorsal.rotation_euler = (math.radians(90), 0, 0)
    dorsal.location = (-4.0, 0, 1.15)
    whale = join([body, fluke, *fins, dorsal], "Whale")
    shade_smooth(whale)
    paint_gradient(whale, 2, -1.5, 1.0, "#9FB9C1", "#0D2A3C")
    return col


# ---------------------------------------------------------------- mermaid (faces +X, origin at waist)
def build_mermaid():
    col = collection("mermaid")
    SKIN = "#E6DACB"

    def loft_up(stations, segs, name, color):
        bm = loft(stations, segs=segs)
        bmesh.ops.transform(bm, matrix=UP, verts=bm.verts)
        return obj_from_bm(bm, name, col, color)

    torso = loft_up([(0.0, 0.15, 0.11, 0), (0.22, 0.16, 0.11, 0), (0.42, 0.19, 0.12, 0), (0.58, 0.14, 0.10, 0), (0.68, 0.05, 0.05, 0)], 10, "torso", SKIN)
    tail = loft_up([(0.02, 0.155, 0.115, 0), (-0.35, 0.18, 0.13, 0), (-0.85, 0.15, 0.11, 0.02), (-1.35, 0.10, 0.075, 0.04), (-1.75, 0.055, 0.04, 0.05), (-1.92, 0.035, 0.028, 0.05)], 10, "tail", "#FF6FAE")
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=10, v_segments=8, radius=0.13)
    bmesh.ops.translate(bm, vec=(0, 0, 0.84), verts=bm.verts)
    head = obj_from_bm(bm, "head", col, SKIN)
    bm = loft([(0.0, 0.14, 0.13, 0), (0.3, 0.19, 0.07, 0.0), (0.7, 0.22, 0.045, 0.04), (1.05, 0.17, 0.03, 0.1), (1.3, 0.07, 0.02, 0.16)], segs=8)
    bmesh.ops.transform(bm, matrix=Matrix.Rotation(math.radians(-28), 4, "Y") @ Matrix.Rotation(math.pi, 4, "Z"), verts=bm.verts)
    bmesh.ops.translate(bm, vec=(-0.04, 0, 0.93), verts=bm.verts)
    hair = obj_from_bm(bm, "hair", col, "#18233A")
    arms, L = [], 0.6
    for side in (1, -1):
        bm = cylinder(0.045, 0.03, L, segs=6)
        a = math.radians(22)
        bmesh.ops.transform(bm, matrix=Matrix.Rotation(a * side, 4, "X") @ Matrix.Rotation(math.pi, 4, "X"), verts=bm.verts)
        bmesh.ops.translate(bm, vec=(0.03, 0.17 * side + (L / 2) * math.sin(a) * side, 0.58 - (L / 2) * math.cos(a)), verts=bm.verts)
        arms.append(obj_from_bm(bm, f"arm{side}", col, SKIN))
    bm = flat_shape(mirrored([(0.04, 0.0), (-0.1, 0.18), (-0.36, 0.42), (-0.32, 0.47), (-0.18, 0.36), (-0.2, 0.05)]), 0.04)
    bmesh.ops.transform(bm, matrix=UP, verts=bm.verts)
    bmesh.ops.translate(bm, vec=(-0.03, 0, -1.88), verts=bm.verts)
    fluke = obj_from_bm(bm, "fluke", col, "#F4E85C")
    mer = join([torso, tail, head, hair, *arms, fluke], "Mermaid")
    shade_smooth(mer)
    me = mer.data
    attr = me.color_attributes["Col"]
    pink, yel = hex_rgba("#FF6FAE"), hex_rgba("#F4E85C")
    for poly in me.polygons:  # neon tail gradient below the waist (not the hair)
        c = poly.center
        if c.z < 0.0 and abs(c.y) < 0.5 and c.x > -0.25:
            for li in poly.loop_indices:
                t = max(0, min(1, -me.vertices[me.loops[li].vertex_index].co.z / 2.2))
                attr.data[li].color = tuple(pink[i] + (yel[i] - pink[i]) * t for i in range(4))
    return col


# ---------------------------------------------------------------- sunken city modules (origin at base)
def build_city():
    col = collection("city")
    STONE, STONE2, DARK, ROOF = "#B9CCCA", "#A4BEC0", "#0C2433", "#8EADB2"

    def windows(w, d, cols, rows, z0, z1, ww=0.7, wh=1.1, inset=0.06, faces=("x+", "x-", "y+", "y-")):
        objs = []
        for face in faces:
            span = w if face[0] == "y" else d
            for c in range(cols):
                for r in range(rows):
                    u = -span / 2 + span * (c + 0.5) / cols
                    z = z0 + (z1 - z0) * (r + 0.5) / rows
                    if face[0] == "x":
                        bm = box((inset * 2, ww, wh), ((w / 2) * (1 if face[1] == "+" else -1), u, z))
                    else:
                        bm = box((ww, inset * 2, wh), (u, (d / 2) * (1 if face[1] == "+" else -1), z))
                    objs.append(obj_from_bm(bm, "win", col, DARK))
        return objs

    def module(name, parts, x):
        ob = join(parts, name)
        shade_flat(ob)
        ob.location.x = x

    W, D, H = 4.0, 4.0, 14.0
    module("bldg_tower", [obj_from_bm(box((W, D, H), (0, 0, H / 2)), "t", col, STONE),
                          obj_from_bm(box((W + 0.3, D + 0.3, 0.5), (0, 0, H + 0.25)), "p", col, ROOF),
                          obj_from_bm(box((W + 0.2, D + 0.2, 0.35), (0, 0, 4.2)), "band", col, STONE2)]
           + windows(W, D, 2, 5, 5.0, H - 0.6, ww=0.75, wh=1.2), 0)

    W, D, H = 6.0, 4.0, 5.0
    bm = cylinder(2.0, 2.0, W, segs=12)
    bmesh.ops.rotate(bm, cent=(0, 0, 0), matrix=Matrix.Rotation(math.pi / 2, 3, "Y"), verts=bm.verts)
    bmesh.ops.bisect_plane(bm, geom=bm.verts[:] + bm.edges[:] + bm.faces[:], plane_co=(0, 0, 0), plane_no=(0, 0, -1), clear_outer=True)
    bmesh.ops.holes_fill(bm, edges=bm.edges, sides=0)
    bmesh.ops.translate(bm, vec=(0, 0, H), verts=bm.verts)
    door = cylinder(0.8, 0.8, 0.14, segs=10)
    bmesh.ops.rotate(door, cent=(0, 0, 0), matrix=Matrix.Rotation(math.pi / 2, 3, "X"), verts=door.verts)
    bmesh.ops.translate(door, vec=(0, D / 2, 2.2), verts=door.verts)
    module("bldg_vault", [obj_from_bm(box((W, D, H), (0, 0, H / 2)), "b", col, STONE2), obj_from_bm(bm, "roof", col, ROOF),
                          obj_from_bm(door, "door", col, DARK), obj_from_bm(box((1.6, 0.14, 2.2), (0, D / 2, 1.1)), "door2", col, DARK)]
           + windows(W, D, 2, 1, 2.6, 4.2, ww=0.8, wh=1.0, faces=("x+", "x-")), 10)

    W, D, H = 5.0, 5.0, 10.0
    bm = box((W, D, H), (0, 0, H / 2))
    bmesh.ops.bisect_plane(bm, geom=bm.verts[:] + bm.edges[:] + bm.faces[:], plane_co=(0, 0, 7.0), plane_no=Vector((0.45, 0.25, 1)).normalized(), clear_outer=True)
    bmesh.ops.holes_fill(bm, edges=bm.edges, sides=0)
    module("bldg_ruin", [obj_from_bm(bm, "r", col, STONE)] + windows(W, D, 2, 2, 1.5, 5.5, ww=0.8, wh=1.3), 19)

    R, ANG, H, T, SEG = 8.0, math.radians(70), 5.0, 0.5, 14
    bm = bmesh.new()
    inner, outer = [], []
    for i in range(SEG + 1):
        a = -ANG / 2 + ANG * i / SEG
        for rr, lst in ((R - T / 2, inner), (R + T / 2, outer)):
            lst.append((bm.verts.new((math.cos(a) * rr - R, math.sin(a) * rr, 0)), bm.verts.new((math.cos(a) * rr - R, math.sin(a) * rr, H))))
    for i in range(SEG):
        for lst in (inner, outer):
            b0, t0 = lst[i]
            b1, t1 = lst[i + 1]
            bm.faces.new((b0, b1, t1, t0))
        bm.faces.new((inner[i][1], inner[i + 1][1], outer[i + 1][1], outer[i][1]))
        bm.faces.new((inner[i][0], outer[i][0], outer[i + 1][0], inner[i + 1][0]))
    for e in (0, SEG):
        bm.faces.new((inner[e][0], inner[e][1], outer[e][1], outer[e][0]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    parts = [obj_from_bm(bm, "wall", col, STONE)]
    for k in (-1, 0, 1):
        a = k * ANG / 3.4
        px, py = math.cos(a) * (R + T / 2) - R, math.sin(a) * (R + T / 2)
        top = cylinder(0.6, 0.6, 0.12, segs=10)
        bmesh.ops.rotate(top, cent=(0, 0, 0), matrix=Matrix.Rotation(a, 3, "Z") @ Matrix.Rotation(math.pi / 2, 3, "Y"), verts=top.verts)
        bmesh.ops.translate(top, vec=(px, py, 3.1), verts=top.verts)
        parts += [obj_from_bm(box((0.12, 1.2, 2.2), (px, py, 2.0), rot_z=a), "w", col, DARK), obj_from_bm(top, "wt", col, DARK)]
    module("wall_curve", parts, 28)

    def pillar(h, broken=False):
        p = [obj_from_bm(box((1.5, 1.5, 0.4), (0, 0, 0.2)), "base", col, STONE2),
             obj_from_bm(cylinder(0.55, 0.48, h, segs=10, loc=(0, 0, 0.4 + h / 2)), "shaft", col, STONE)]
        if broken:
            bm = cylinder(0.5, 0.48, 1.0, segs=10, loc=(0, 0, 0.4 + h + 0.5))
            bmesh.ops.bisect_plane(bm, geom=bm.verts[:] + bm.edges[:] + bm.faces[:], plane_co=(0, 0, 0.4 + h + 0.4), plane_no=Vector((0.6, 0, 1)).normalized(), clear_outer=True)
            bmesh.ops.holes_fill(bm, edges=bm.edges, sides=0)
            p.append(obj_from_bm(bm, "stub", col, STONE))
        else:
            p.append(obj_from_bm(box((1.4, 1.4, 0.35), (0, 0, 0.4 + h + 0.18)), "cap", col, STONE2))
        return p

    module("pillar", pillar(6.0), 38)
    module("pillar_broken", pillar(2.8, broken=True), 42)
    module("stairs", [obj_from_bm(box((4.0, 0.6, 0.35 * (i + 1)), (0, -i * 0.6, 0.35 * (i + 1) / 2)), "s", col, STONE2) for i in range(6)], 47)

    R1, R2, T, N = 2.6, 3.4, 1.0, 12
    pts = [(math.cos(math.pi * i / N) * R2, math.sin(math.pi * i / N) * R2) for i in range(N + 1)] + \
          [(math.cos(math.pi * i / N) * R1, math.sin(math.pi * i / N) * R1) for i in range(N, -1, -1)]
    bm = bmesh.new()
    f = bm.faces.new([bm.verts.new((x, 0, z)) for x, z in pts])
    r = bmesh.ops.extrude_face_region(bm, geom=[f])
    bmesh.ops.translate(bm, vec=(0, T, 0), verts=[e for e in r["geom"] if isinstance(e, bmesh.types.BMVert)])
    bmesh.ops.translate(bm, vec=(0, -T / 2, 5.0), verts=bm.verts)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    module("arch_gate", [obj_from_bm(bm, "arch", col, STONE),
                         obj_from_bm(box((0.8, T, 5.0), (-3.0, 0, 2.5)), "pl", col, STONE),
                         obj_from_bm(box((0.8, T, 5.0), (3.0, 0, 2.5)), "pr", col, STONE)], 54)
    return col


# ---------------------------------------------------------------- props
def build_props():
    random.seed(26)
    col = collection("props")
    WHITE, BLACK = "#EEEDE6", "#0A0E13"

    def module(name, parts, x, flat=True):
        ob = join(parts, name)
        (shade_flat if flat else shade_smooth)(ob)
        ob.location.x = x
        return ob

    module("white_wall", [obj_from_bm(box((14, 0.6, 8), (0, 0, 4)), "w", col, WHITE)], 0)
    parts = [obj_from_bm(box((3.0, 1.6, 0.16), (0, 0, 1.0)), "top", col, WHITE)]
    for sx in (-1, 1):
        for sy in (-1, 1):
            parts.append(obj_from_bm(box((0.12, 0.12, 0.92), (sx * 1.35, sy * 0.66, 0.46)), "leg", col, WHITE))
    module("white_table", parts, 10)

    outline = [(-0.75, -0.8), (0.75, -0.8), (0.75, 0.2)]
    for i in range(1, 9):
        t = i / 8
        outline.append((0.75 - 0.55 * t, 0.2 + 1.6 * t ** 0.8 + 0.25 * math.sin(t * math.pi)))
    outline += [(0.05, 2.0), (-0.75, 1.3)]
    parts = [obj_from_bm(extrude_xy(outline, 0.7, 1.0), "case", col, BLACK)]
    lid = extrude_xy(outline, 0, 0.03)
    bmesh.ops.rotate(lid, cent=(-0.75, 0, 0), matrix=Matrix.Rotation(math.radians(-34), 3, "Y"), verts=lid.verts)
    bmesh.ops.translate(lid, vec=(0, 0, 1.0), verts=lid.verts)
    parts += [obj_from_bm(lid, "lid", col, BLACK), obj_from_bm(box((0.03, 0.03, 0.82), (0.55, 0.5, 1.38)), "stick", col, BLACK)]
    for px, py in ((-0.6, -0.65), (0.6, -0.65), (-0.1, 1.6)):
        parts.append(obj_from_bm(cylinder(0.06, 0.05, 0.7, segs=6, loc=(px, py, 0.35)), "leg", col, BLACK))
    parts.append(obj_from_bm(box((1.4, 0.18, 0.04), (0, -0.9, 0.86)), "keys", col, WHITE))
    for k in range(14):
        if k % 7 not in (2, 6):
            parts.append(obj_from_bm(box((0.05, 0.1, 0.03), (-0.62 + k * 0.095, -0.86, 0.895)), "bk", col, BLACK))
    parts.append(obj_from_bm(box((0.9, 0.35, 0.08), (0, -1.55, 0.5)), "bench", col, BLACK))
    for sx in (-1, 1):
        parts.append(obj_from_bm(box((0.06, 0.3, 0.46), (sx * 0.4, -1.55, 0.23)), "bl", col, BLACK))
    module("piano", parts, 18)

    parts = []

    def branch(base, direction, length, r, depth):
        d = Vector(direction).normalized()
        bm = cylinder(r, r * 0.55, length, segs=6)
        bmesh.ops.transform(bm, matrix=Vector((0, 0, 1)).rotation_difference(d).to_matrix().to_4x4(), verts=bm.verts)
        tip = Vector(base) + d * length
        bmesh.ops.translate(bm, vec=(Vector(base) + tip) / 2, verts=bm.verts)
        parts.append(obj_from_bm(bm, "br", col, "#C98A97"))
        if depth > 0:
            for _ in range(2):
                branch(tip, d + Vector((random.uniform(-0.8, 0.8), random.uniform(-0.8, 0.8), random.uniform(0.1, 0.6))), length * 0.7, r * 0.6, depth - 1)

    for _ in range(3):
        branch((random.uniform(-0.3, 0.3), random.uniform(-0.3, 0.3), 0), (random.uniform(-0.4, 0.4), random.uniform(-0.4, 0.4), 1), 0.9, 0.18, 2)
    paint_gradient(module("coral", parts, 24), 2, 0, 2.2, "#7E5A6E", "#E7A3B0")

    bm = bmesh.new()
    rows = []
    for i in range(11):  # 10 segments high so the shader can bend it
        t = i / 10
        z, w, a = t * 4.0, 0.22 * (1 - t * 0.7), t * 2.2
        rows.append((bm.verts.new((math.cos(a) * w, math.sin(a) * w, z)), bm.verts.new((-math.cos(a) * w, -math.sin(a) * w, z))))
    for r0, r1 in zip(rows, rows[1:]):
        bm.faces.new((r0[0], r0[1], r1[1], r1[0]))
    paint_gradient(module("seaweed", [obj_from_bm(bm, "seaweed", col)], 28, flat=False), 2, 0, 4, "#163F35", "#4F9A72")

    bm = bmesh.new()
    bmesh.ops.create_icosphere(bm, subdivisions=1, radius=1.0)
    for v in bm.verts:
        v.co *= random.uniform(0.8, 1.15)
        v.co.z *= 0.6
    paint_gradient(module("rock", [obj_from_bm(bm, "rock", col)], 32), 2, -0.6, 0.6, "#0F3442", "#3B6E78")

    bm = loft([(-0.22, 0.02, 0.03, 0), (-0.12, 0.05, 0.09, 0), (0.05, 0.06, 0.11, 0), (0.18, 0.04, 0.07, 0), (0.25, 0.01, 0.02, 0)], segs=6)
    tail = bmesh.new()
    tail.faces.new([tail.verts.new(p) for p in ((-0.2, 0, 0), (-0.34, 0, 0.1), (-0.3, 0, 0), (-0.34, 0, -0.1))])
    paint_gradient(module("fish", [obj_from_bm(bm, "fb", col), obj_from_bm(tail, "ft", col)], 35), 2, -0.1, 0.1, "#E8F6F4", "#6FB7C4")
    return col


if __name__ == "__main__" or True:
    built = [build_whale(), build_mermaid(), build_city(), build_props()]
    for lc in bpy.context.view_layer.layer_collection.children:
        lc.hide_viewport = False
    for c in built:
        path, size = export(c, c.name + ".glb")
        print(c.name, tri_count(c), "tris", size, "bytes")
