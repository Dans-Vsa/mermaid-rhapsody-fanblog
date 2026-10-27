# Shared helpers for building the Mermaid Rhapsody assets in Blender (run through Blender MCP).
# Usage inside Blender: exec(open(r"<repo>/blender/helpers.py", encoding="utf-8").read())
# Conventions: 1 unit = 1 m, Z up in Blender (glTF export converts to Y up), origin at the base or
# centre of each asset, transforms applied before export, colour lives in a COLOR_0 vertex attribute
# so the site can shade everything with one toon + rim material.
import math

import bmesh
import bpy
from mathutils import Matrix, Vector

REPO = r"C:\ME\Mermaid Rhapsody"
OUT = REPO + r"\public\models"


def hex_rgba(h, a=1.0):
    h = h.lstrip("#")
    srgb = [int(h[i : i + 2], 16) / 255 for i in (0, 2, 4)]
    # color attributes are stored linear for FLOAT_COLOR; convert from sRGB
    lin = [c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in srgb]
    return (*lin, a)


def collection(name, clear=True):
    col = bpy.data.collections.get(name)
    if col is None:
        col = bpy.data.collections.new(name)
        bpy.context.scene.collection.children.link(col)
    elif clear:
        for ob in list(col.objects):
            bpy.data.objects.remove(ob, do_unlink=True)
    return col


def shared_material():
    """One material for everything: base colour comes from the vertex colour attribute."""
    mat = bpy.data.materials.get("MR_Vertex")
    if mat:
        return mat
    mat = bpy.data.materials.new("MR_Vertex")
    mat.use_nodes = True
    nt = mat.node_tree
    bsdf = next(n for n in nt.nodes if n.type == "BSDF_PRINCIPLED")
    bsdf.inputs["Roughness"].default_value = 1.0
    attr = nt.nodes.new("ShaderNodeVertexColor")
    attr.layer_name = "Col"
    nt.links.new(attr.outputs["Color"], bsdf.inputs["Base Color"])
    return mat


def obj_from_bm(bm, name, col, color=None):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    ob = bpy.data.objects.new(name, me)
    col.objects.link(ob)
    ob.data.materials.append(shared_material())
    if color is not None:
        paint(ob, color)
    return ob


def paint(ob, color, where=None):
    """Fill the 'Col' corner attribute. `where(face_center, normal) -> bool` limits the fill."""
    me = ob.data
    attr = me.color_attributes.get("Col") or me.color_attributes.new("Col", "BYTE_COLOR", "CORNER")
    rgba = hex_rgba(color) if isinstance(color, str) else color
    for poly in me.polygons:
        if where is None or where(poly.center, poly.normal):
            for li in poly.loop_indices:
                attr.data[li].color = rgba
    me.color_attributes.active_color = attr
    me.color_attributes.render_color_index = me.color_attributes.find("Col")


def paint_gradient(ob, axis, lo, hi, c_lo, c_hi):
    """Linear vertex-colour gradient along an axis (0 x, 1 y, 2 z), per corner."""
    me = ob.data
    attr = me.color_attributes.get("Col") or me.color_attributes.new("Col", "BYTE_COLOR", "CORNER")
    a, b = hex_rgba(c_lo), hex_rgba(c_hi)
    for poly in me.polygons:
        for li in poly.loop_indices:
            v = me.vertices[me.loops[li].vertex_index].co[axis]
            t = max(0.0, min(1.0, (v - lo) / (hi - lo)))
            attr.data[li].color = tuple(a[i] + (b[i] - a[i]) * t for i in range(4))


def loft(stations, segs=10, cap_start=True, cap_end=True):
    """Build a closed tube from cross-sections.
    stations: list of (x, ry, rz, z_offset); each ring is an ellipse in the YZ plane at x.
    Returns a bmesh."""
    bm = bmesh.new()
    rings = []
    for x, ry, rz, zo in stations:
        ring = []
        for i in range(segs):
            a = 2 * math.pi * i / segs
            ring.append(bm.verts.new((x, math.cos(a) * ry, zo + math.sin(a) * rz)))
        rings.append(ring)
    for r0, r1 in zip(rings, rings[1:]):
        for i in range(segs):
            j = (i + 1) % segs
            bm.faces.new((r0[i], r0[j], r1[j], r1[i]))
    if cap_start:
        bm.faces.new(list(reversed(rings[0])))
    if cap_end:
        bm.faces.new(rings[-1])
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    return bm


def box(size, loc=(0, 0, 0), rot_z=0.0):
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    bmesh.ops.scale(bm, vec=Vector(size), verts=bm.verts)
    bmesh.ops.rotate(bm, cent=(0, 0, 0), matrix=Matrix.Rotation(rot_z, 3, "Z"), verts=bm.verts)
    bmesh.ops.translate(bm, vec=Vector(loc), verts=bm.verts)
    return bm


def cylinder(r1, r2, depth, segs=10, loc=(0, 0, 0)):
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=segs, radius1=r1, radius2=r2, depth=depth)
    bmesh.ops.translate(bm, vec=Vector(loc), verts=bm.verts)
    return bm


def join(objs, name):
    """Join objects into the first one, rename, apply transforms."""
    bpy.ops.object.select_all(action="DESELECT")
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    if len(objs) > 1:
        bpy.ops.object.join()
    ob = bpy.context.view_layer.objects.active
    ob.name = name
    ob.data.name = name
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
    return ob


def apply_all(col):
    bpy.ops.object.select_all(action="DESELECT")
    for o in col.objects:
        o.select_set(True)
    bpy.context.view_layer.objects.active = col.objects[0]
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)


def shade_flat(ob):
    for p in ob.data.polygons:
        p.use_smooth = False


def shade_smooth(ob):
    for p in ob.data.polygons:
        p.use_smooth = True


def tri_count(col):
    return sum(sum(len(p.vertices) - 2 for p in o.data.polygons) for o in col.objects if o.type == "MESH")


def export(col, filename):
    """Export one collection as Draco-compressed GLB (no lights/cameras, vertex colours on)."""
    bpy.ops.object.select_all(action="DESELECT")
    for o in col.objects:
        o.select_set(True)
    path = OUT + "\\" + filename
    kw = dict(
        filepath=path,
        export_format="GLB",
        use_selection=True,
        export_apply=True,
        export_yup=True,
        export_normals=True,
        export_texcoords=False,
        export_materials="EXPORT",
        export_cameras=False,
        export_lights=False,
        export_draco_mesh_compression_enable=True,
        export_draco_mesh_compression_level=7,
        export_draco_position_quantization=14,
        export_draco_normal_quantization=10,
        export_draco_color_quantization=8,
    )
    props = bpy.ops.export_scene.gltf.get_rna_type().properties.keys()
    if "export_vertex_color" in props:
        kw["export_vertex_color"] = "ACTIVE"
    if "export_all_vertex_colors" in props:
        kw["export_all_vertex_colors"] = False
    kw = {k: v for k, v in kw.items() if k in props}
    bpy.ops.export_scene.gltf(**kw)
    import os

    return path, os.path.getsize(path)
