"""Cycles renders of the AMS kitchen model.

usage: python render_kitchen.py <glb> <tex_dir> <hdri> <out_dir> <w> <h> <samples> <shot>[,<shot>...]
"""
import sys, math, os
import bpy
from mathutils import Vector

glb, tex, hdri, out, W, H, SAMPLES, shots = sys.argv[1:9]
W, H, SAMPLES = int(W), int(H), int(SAMPLES)
os.makedirs(out, exist_ok=True)

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=glb)
scene = bpy.context.scene


def g2b(v):
    """glTF (Y-up) → Blender (Z-up)."""
    x, y, z = v
    return Vector((x, -z, y))


# ── Materials ─────────────────────────────────────────────────────────────
def img(name, colorspace="sRGB"):
    im = bpy.data.images.load(os.path.join(tex, name))
    im.colorspace_settings.name = colorspace
    return im


def textured(mat, base, tint=(1, 1, 1), rough_scale=1.0, scale=1.0, normal=0.4):
    """Replace the material's base colour/roughness/normal with a box-projected texture set."""
    mat.use_nodes = True
    nt = mat.node_tree
    bsdf = next((n for n in nt.nodes if n.type == "BSDF_PRINCIPLED"), None)
    if not bsdf:
        return
    coord = nt.nodes.new("ShaderNodeTexCoord")
    mapn = nt.nodes.new("ShaderNodeMapping")
    mapn.inputs["Scale"].default_value = (scale, scale, scale)
    nt.links.new(coord.outputs["Object"], mapn.inputs["Vector"])

    def tex_node(fname, cs):
        t = nt.nodes.new("ShaderNodeTexImage")
        t.image = img(fname, cs)
        t.projection = "BOX"
        t.projection_blend = 0.25
        nt.links.new(mapn.outputs["Vector"], t.inputs["Vector"])
        return t

    a = tex_node(f"{base}_albedo.webp", "sRGB")
    mixc = nt.nodes.new("ShaderNodeMix")
    mixc.data_type = "RGBA"
    mixc.blend_type = "MULTIPLY"
    mixc.inputs["Factor"].default_value = 1.0
    nt.links.new(a.outputs["Color"], mixc.inputs[6])
    mixc.inputs[7].default_value = (*tint, 1)
    nt.links.new(mixc.outputs[2], bsdf.inputs["Base Color"])

    r = tex_node(f"{base}_rough.webp", "Non-Color")
    mul = nt.nodes.new("ShaderNodeMath")
    mul.operation = "MULTIPLY"
    mul.inputs[1].default_value = rough_scale
    nt.links.new(r.outputs["Color"], mul.inputs[0])
    nt.links.new(mul.outputs[0], bsdf.inputs["Roughness"])

    n = tex_node(f"{base}_normal.webp", "Non-Color")
    nm = nt.nodes.new("ShaderNodeNormalMap")
    nm.inputs["Strength"].default_value = normal
    nt.links.new(n.outputs["Color"], nm.inputs["Color"])
    nt.links.new(nm.outputs["Normal"], bsdf.inputs["Normal"])


def flat(mat, color, rough=None, metal=None):
    mat.use_nodes = True
    bsdf = next((n for n in mat.node_tree.nodes if n.type == "BSDF_PRINCIPLED"), None)
    if not bsdf:
        return
    bsdf.inputs["Base Color"].default_value = (*color, 1)
    if rough is not None:
        bsdf.inputs["Roughness"].default_value = rough
    if metal is not None:
        bsdf.inputs["Metallic"].default_value = metal


def srgb(h):
    h = h.lstrip("#")
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(((x + 0.055) / 1.055) ** 2.4 if x > 0.04045 else x / 12.92 for x in c)


FINISHES = {
    # variant id → cabinet tint, counter texture, backsplash colour, hardware colour
    "wenge": dict(cab=("oak", srgb("#5a3e2b"), 1.0), counter="nero", splash="#1f5a46", hw="#c9a25e"),
    "ivory": dict(cab=(None, srgb("#e8e0cf"), 0.55), counter="calacatta", splash="#efede8", hw="#d8dadd"),
    "sage": dict(cab=(None, srgb("#7d8c70"), 0.35), counter="calacatta", splash="#e9e4da", hw="#c9a25e"),
    "walnut": dict(cab=("oak", srgb("#a8805c"), 0.9), counter="travertine", splash="#b8693f", hw="#1b1b1b"),
}

variant = os.environ.get("VARIANT", "wenge")
F = FINISHES[variant]

for m in bpy.data.materials:
    n = m.name
    if n in ("Cabinet_Dark_Wood_Wenge", "Mat_Pantry_Dark", "Dark_Wood_Panel"):
        base, tint, rough = F["cab"]
        if base:
            textured(m, base, tint, rough_scale=rough, scale=0.7, normal=0.3)
        else:
            flat(m, tint, rough, 0)
    elif n in ("Marble_Countertop_Dark", "Mat_DarkMarble_Countertop"):
        textured(m, F["counter"], scale=1.7, normal=0.1, rough_scale=1.0)
    elif n == "Emerald_Backsplash_Tile":
        flat(m, srgb(F["splash"]), 0.12, 0)
    elif n == "Brushed_Champagne_Gold":
        flat(m, srgb(F["hw"]), 0.25, 1)
    elif n == "Textured_Dark_Wall":
        textured(m, "plaster", srgb("#4a4038"), scale=0.4, normal=0.5)
    elif n == "Ceiling_Plaster":
        flat(m, srgb("#efe9df"), 0.8, 0)
    elif n in ("BrushedSteel", "Fridge_Stainless_Steel"):
        flat(m, srgb("#c8cacd"), 0.25, 1)
    elif n == "ToeKick_Dark":
        flat(m, srgb("#1a1512"), 0.6, 0)
    elif n == "Black_Smoked_Glass":
        flat(m, srgb("#1b1b1d"), 0.05, 0.3)
    elif n == "Board_Wood":
        textured(m, "oak", srgb("#d4b089"), scale=2.0)
    elif n == "GoldTextured":
        flat(m, srgb("#c9a25e"), 0.2, 1)
    elif n == "Tray_Cream":
        flat(m, srgb("#e9dfcc"), 0.6, 0)
    elif n == "Rug_Fabric":
        textured(m, "linen", srgb("#c9bba2"), scale=1.5, normal=0.6)
    elif n == "Rug_GoldBorder":
        flat(m, srgb("#b8892a"), 0.8, 0)

# Floors are not separately named in the export; anything large and flat near y=0
# that still uses a default material gets microcement.
floor_mat = bpy.data.materials.new("AMS_Floor")
floor_mat.use_nodes = True
textured(floor_mat, "plaster", srgb("#8c8378"), scale=0.25, normal=0.3, rough_scale=0.7)
for o in scene.objects:
    if o.type != "MESH":
        continue
    dims = o.dimensions
    if dims.z < 0.05 and dims.x > 6 and dims.y > 5 and o.location.z < 0.1:
        o.data.materials.clear()
        o.data.materials.append(floor_mat)

# Smooth-by-angle shading so cylinders (stools, pendants) aren't faceted.
for o in scene.objects:
    if o.type == "MESH":
        for poly in o.data.polygons:
            poly.use_smooth = True
try:
    bpy.ops.object.select_all(action="SELECT")
    bpy.context.view_layer.objects.active = next(o for o in scene.objects if o.type == "MESH")
    bpy.ops.object.shade_auto_smooth(angle=math.radians(35))
except Exception as e:
    print("auto-smooth fallback:", e)

# ── Lighting ──────────────────────────────────────────────────────────────
world = bpy.data.worlds.new("World")
scene.world = world
world.use_nodes = True
wn = world.node_tree
env = wn.nodes.new("ShaderNodeTexEnvironment")
env.image = bpy.data.images.load(hdri)
bg = wn.nodes["Background"]
bg.inputs["Strength"].default_value = float(os.environ.get("ENV", "0.6"))
wn.links.new(env.outputs["Color"], bg.inputs["Color"])

evening = os.environ.get("MOOD") == "evening"
if not evening:
    sun = bpy.data.lights.new("Sun", "SUN")
    sun.energy = 3.2
    sun.angle = math.radians(2.5)
    sun.color = (1.0, 0.93, 0.84)
    so = bpy.data.objects.new("Sun", sun)
    scene.collection.objects.link(so)
    so.rotation_euler = (math.radians(62), 0, math.radians(95))
else:
    bg.inputs["Strength"].default_value = 0.08

# Soft overhead fill so the room never goes muddy.
fill = bpy.data.lights.new("Fill", "AREA")
fill.shape = "RECTANGLE"
fill.size, fill.size_y = 4.5, 3.0
fill.energy = 220 if not evening else 90
fill.color = (1.0, 0.9, 0.78)
fo = bpy.data.objects.new("Fill", fill)
scene.collection.objects.link(fo)
fo.location = g2b((0.3, 2.85, -0.6))

# Boost authored emissive strips/bulbs.
for m in bpy.data.materials:
    if not m.use_nodes:
        continue
    for nd in m.node_tree.nodes:
        if nd.type == "BSDF_PRINCIPLED" and nd.inputs["Emission Strength"].default_value > 0:
            nd.inputs["Emission Strength"].default_value *= (6.0 if evening else 2.0)

# ── Render settings ───────────────────────────────────────────────────────
scene.render.engine = "CYCLES"
scene.cycles.device = "CPU"
scene.cycles.samples = SAMPLES
scene.cycles.use_denoising = True
scene.cycles.denoiser = "OPENIMAGEDENOISE"
scene.cycles.max_bounces = 6
scene.cycles.caustics_reflective = False
scene.cycles.caustics_refractive = False
scene.render.resolution_x, scene.render.resolution_y = W, H
scene.render.threads_mode = "AUTO"
scene.view_settings.view_transform = "AgX"
scene.view_settings.look = "AgX - Medium High Contrast"
scene.view_settings.exposure = float(os.environ.get("EXPOSURE", "0.45"))
scene.render.image_settings.file_format = "PNG"

SHOTS = {
    "overview": ((3.3, 2.0, 2.35), (-0.6, 1.0, -1.6), 26),
    "island": ((2.4, 1.35, 2.3), (0.4, 0.95, 0.0), 30),
    "cooking": ((0.25, 1.5, 0.2), (0.0, 1.25, -3.85), 26),
    "detail": ((1.5, 1.25, -1.6), (-0.8, 1.05, -3.7), 40),
    "wide": ((3.6, 1.65, 2.6), (-1.2, 1.1, -2.0), 22),
}

cam_data = bpy.data.cameras.new("Cam")
cam = bpy.data.objects.new("Cam", cam_data)
scene.collection.objects.link(cam)
scene.camera = cam
cam_data.sensor_width = 36

for shot in shots.split(","):
    pos, target, focal = SHOTS[shot]
    cam.location = g2b(pos)
    d = g2b(target) - g2b(pos)
    cam.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()
    cam_data.lens = focal
    scene.render.filepath = os.path.join(out, f"{variant}-{'evening-' if evening else ''}{shot}.png")
    bpy.ops.render.render(write_still=True)
    print("RENDERED", scene.render.filepath, flush=True)
