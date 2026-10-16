"""Generate tileable PBR texture sets (albedo / roughness / normal) for the site.

All noise is synthesised in the frequency domain, so every map tiles seamlessly.
Output: <out>/<name>_{albedo,rough,normal}.webp at 1024px.
"""
import sys, os
import numpy as np
from PIL import Image

N = 1024
OUT = sys.argv[1]
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(7)


def spectral(beta=2.0, sx=1.0, sy=1.0, lo=1.0, hi=None, seed=None):
    """Tileable 1/f^beta noise. sx/sy stretch features (anisotropy)."""
    r = np.random.default_rng(seed) if seed is not None else rng
    fx = np.fft.fftfreq(N)[None, :] * N * sx
    fy = np.fft.fftfreq(N)[:, None] * N * sy
    f = np.sqrt(fx ** 2 + fy ** 2)
    f[0, 0] = 1
    amp = 1.0 / f ** (beta / 2)
    amp[f < lo] = 0
    if hi:
        amp[f > hi] = 0
    phase = r.uniform(0, 2 * np.pi, (N, N))
    spec = amp * np.exp(1j * phase)
    img = np.real(np.fft.ifft2(spec))
    img -= img.min(); img /= img.max() + 1e-9
    return img


def warp(field, dx, dy, amt):
    """Tileable domain warp: sample `field` at (x + dx*amt, y + dy*amt)."""
    yy, xx = np.mgrid[0:N, 0:N]
    x = (xx + (dx - 0.5) * amt).astype(int) % N
    y = (yy + (dy - 0.5) * amt).astype(int) % N
    return field[y, x]


def normal_from_height(h, strength):
    gx = (np.roll(h, -1, 1) - np.roll(h, 1, 1)) * strength
    gy = (np.roll(h, -1, 0) - np.roll(h, 1, 0)) * strength
    n = np.dstack([-gx, -gy, np.ones_like(h)])
    n /= np.linalg.norm(n, axis=2, keepdims=True)
    return ((n * 0.5 + 0.5) * 255).astype(np.uint8)


def mix(c1, c2, t):
    c1 = np.array(c1, float) / 255; c2 = np.array(c2, float) / 255
    t = t[..., None]
    return c1 * (1 - t) + c2 * t


def save(name, albedo, rough, height, nstrength):
    Image.fromarray((np.clip(albedo, 0, 1) * 255).astype(np.uint8)).save(f"{OUT}/{name}_albedo.webp", quality=88, method=6)
    Image.fromarray((np.clip(rough, 0, 1) * 255).astype(np.uint8)).save(f"{OUT}/{name}_rough.webp", quality=85, method=6)
    Image.fromarray(normal_from_height(height, nstrength)).save(f"{OUT}/{name}_normal.webp", quality=90, method=6)
    print("wrote", name)


def smooth(x, a, b):
    t = np.clip((x - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


# ── Travertine: warm banded limestone with elongated pits ──────────────────
band = spectral(2.6, sx=6, sy=0.6)
mott = spectral(2.2)
fine = spectral(1.2, lo=40)
pitsn = spectral(1.6, sx=4, sy=0.8, lo=20)
pits = smooth(pitsn, 0.70, 0.82)
base = 0.55 * band + 0.3 * mott + 0.15 * fine
alb = mix((206, 189, 160), (232, 220, 198), base)
alb *= (1 - 0.35 * pits)[..., None]
rough = 0.55 + 0.25 * pits + 0.08 * fine
height = 0.5 * fine + 0.2 * mott - 0.8 * pits
save("travertine", alb, rough, height, 4.0)

# ── Marble (turbulence-sine; integer frequencies keep it tileable) ─────────
yy, xx = np.mgrid[0:N, 0:N] / N
def marble_field(seed, fx, fy, turb_amt):
    t1 = spectral(2.3, hi=28, seed=seed) - 0.5
    t2 = spectral(2.0, hi=60, seed=seed + 1) - 0.5
    phase = 2 * np.pi * (fx * xx + fy * yy) + turb_amt * t1 + 0.4 * t2
    return phase

ph = marble_field(11, 2, 3, 4.0)
veins = np.exp(-np.abs(np.sin(ph / 2)) * 7)          # main veins
veins_f = np.exp(-np.abs(np.sin(marble_field(21, 5, 2, 5.0))) * 26)  # fine secondary
cloud = spectral(2.2)
alb = mix((236, 233, 227), (250, 248, 244), cloud)
alb = alb * (1 - 0.6 * veins)[..., None] + np.array([0.58, 0.53, 0.45]) * (0.6 * veins)[..., None]
alb = alb * (1 - 0.12 * veins_f)[..., None]
rough = 0.12 + 0.06 * cloud + 0.05 * veins
save("calacatta", alb, rough, 0.2 * cloud + 0.1 * veins, 1.0)

ph = marble_field(31, 3, 2, 4.5)
veins = np.exp(-np.abs(np.sin(ph / 2)) * 16)
veins_f = np.exp(-np.abs(np.sin(marble_field(41, 2, 5, 5.0))) * 30)
cloud = spectral(2.2)
alb = mix((16, 16, 18), (32, 31, 33), cloud)
alb = alb + np.array([0.80, 0.78, 0.74]) * (0.8 * veins)[..., None] + np.array([0.5, 0.48, 0.45]) * (0.25 * veins_f)[..., None]
rough = 0.1 + 0.05 * cloud
save("nero", alb, rough, 0.15 * cloud, 0.8)

# ── Oak: straight grain with gentle cathedral figure ───────────────────────
grain = spectral(1.1, sx=60, sy=0.5, lo=6)
ring_n = spectral(2.6, sx=3, sy=1)
rings = 0.5 + 0.5 * np.sin((yy * 18 + ring_n * 6) * np.pi * 2)
pores = smooth(spectral(1.0, sx=30, sy=0.3, lo=60), 0.7, 0.9)
t = np.clip((0.6 * grain + 0.25 * rings + 0.15 * spectral(2.0) - 0.5) * 1.6 + 0.5, 0, 1)
alb = mix((150, 112, 74), (198, 160, 118), t)
alb *= (1 - 0.25 * pores)[..., None]
rough = 0.5 + 0.2 * pores + 0.1 * grain
save("oak", alb, rough, 0.6 * grain + 0.3 * rings - 0.5 * pores, 3.0)

# ── Microcement / lime plaster: soft mottling, trowel marks ────────────────
m1 = spectral(2.4); m2 = spectral(1.6, lo=10); trow = spectral(2.2, sx=3, sy=0.7)
t = 0.55 * m1 + 0.25 * m2 + 0.2 * trow
alb = mix((196, 190, 180), (222, 217, 208), t)
rough = 0.72 + 0.15 * m2
save("plaster", alb, rough, 0.4 * m2 + 0.3 * trow, 1.5)

# ── Terrazzo: warm base with stone chips ───────────────────────────────────
base = spectral(2.2)
alb = mix((214, 206, 194), (226, 219, 208), base)
chips = np.zeros((N, N)); chipcol = np.zeros((N, N, 3))
pal = np.array([[0.62, 0.42, 0.30], [0.30, 0.29, 0.28], [0.88, 0.86, 0.82], [0.70, 0.60, 0.46], [0.45, 0.47, 0.42]])
cells = spectral(0.0, lo=0)  # white noise for scattering
pts = rng.integers(0, N, (2600, 2))
for i, (y, x) in enumerate(pts):
    r = rng.integers(3, 16)
    ys = np.arange(y - r, y + r) % N; xs = np.arange(x - r, x + r) % N
    yy2, xx2 = np.meshgrid(np.arange(-r, r), np.arange(-r, r), indexing="ij")
    ang = rng.uniform(0, np.pi); k = rng.uniform(0.5, 1.0)
    d = np.abs(xx2 * np.cos(ang) + yy2 * np.sin(ang)) + np.abs(-xx2 * np.sin(ang) + yy2 * np.cos(ang)) / k
    mask = d < r
    c = pal[rng.integers(0, len(pal))] * rng.uniform(0.85, 1.1)
    sub = np.ix_(ys, xs)
    chipcol[sub][mask] = c
    region = chipcol[sub]; region[mask] = c; chipcol[sub] = region
    cm = chips[sub]; cm[mask] = 1; chips[sub] = cm
alb = alb * (1 - chips[..., None]) + chipcol * chips[..., None]
rough = 0.3 + 0.1 * base - 0.05 * chips
save("terrazzo", alb, rough, 0.1 * chips + 0.1 * base, 1.0)

# ── Linen: fine plain weave ────────────────────────────────────────────────
weave = 0.5 + 0.25 * np.sin(xx * N * np.pi / 3) * np.sin(yy * N * np.pi / 3)
slub = spectral(1.2, sx=20, sy=0.5, lo=8)
t = 0.5 * weave + 0.3 * slub + 0.2 * spectral(2.0)
alb = mix((196, 186, 168), (226, 218, 202), t)
rough = 0.85 + 0.1 * slub
save("linen", alb, rough, weave + 0.4 * slub, 2.5)

# ── Brushed metal: anisotropic streaks (roughness/normal only; tint in shader)
streak = spectral(1.0, sx=60, sy=0.2, lo=6)
alb = np.ones((N, N, 3)) * (0.9 + 0.1 * streak)[..., None]
rough = 0.22 + 0.18 * streak
save("brushed", alb, rough, streak, 1.2)
