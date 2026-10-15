'use client';
import * as THREE from 'three';

function rand(seed: number) {
    return () => {
        seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/** Light wood-plank texture (tinted by the material colour). */
export function plankTexture(repeat = 4, seed = 7) {
    const size = 1024;
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const g = c.getContext('2d')!;
    const r = rand(seed);
    const rows = 8;
    const h = size / rows;
    for (let i = 0; i < rows; i++) {
        let x = -r() * 400;
        while (x < size) {
            const w = 260 + r() * 320;
            const v = 205 + r() * 40;
            g.fillStyle = `rgb(${v},${v},${v})`;
            g.fillRect(x, i * h, w, h);
            for (let k = 0; k < 18; k++) {
                const a = 0.04 + r() * 0.06;
                g.strokeStyle = `rgba(60,40,20,${a})`;
                g.lineWidth = 1 + r() * 2;
                const yy = i * h + r() * h;
                g.beginPath();
                g.moveTo(x, yy);
                g.bezierCurveTo(x + w * 0.3, yy + (r() - 0.5) * 8, x + w * 0.7, yy + (r() - 0.5) * 8, x + w, yy);
                g.stroke();
            }
            g.fillStyle = 'rgba(40,25,10,0.35)';
            g.fillRect(x, i * h, 2, h);
            x += w;
        }
        g.fillStyle = 'rgba(40,25,10,0.35)';
        g.fillRect(0, i * h, size, 2);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeat, repeat);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    return tex;
}

/** Subtle plaster/linen noise for walls. */
export function plasterTexture(repeat = 3, seed = 11) {
    const size = 512;
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const g = c.getContext('2d')!;
    const r = rand(seed);
    g.fillStyle = 'rgb(236,236,236)';
    g.fillRect(0, 0, size, size);
    for (let i = 0; i < 9000; i++) {
        const v = 200 + r() * 55;
        g.fillStyle = `rgba(${v},${v},${v},0.25)`;
        g.fillRect(r() * size, r() * size, 1 + r() * 3, 1 + r() * 3);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeat, repeat);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
}
