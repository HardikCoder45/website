'use client';
import type * as THREE from 'three';

export type FxLevel = 'full' | 'lite' | 'off';

/** Effects level from the URL (?fx=lite|0) or the device: phones get "lite". */
export function initialFxLevel(): FxLevel {
    if (typeof window === 'undefined') return 'full';
    const p = new URLSearchParams(window.location.search).get('fx');
    if (p === '0') return 'off';
    if (p === 'lite') return 'lite';
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    return coarse || window.innerWidth < 768 ? 'lite' : 'full';
}

/**
 * Whether the GPU can render to half-float targets. Some drivers and software
 * renderers can't, and post-processing then renders black, so we fall back to
 * 8-bit buffers.
 */
export function supportsHalfFloat(gl: THREE.WebGLRenderer) {
    const ctx = gl.getContext();
    const ok = !!(ctx.getExtension('EXT_color_buffer_half_float') || ctx.getExtension('EXT_color_buffer_float'));
    const info = ctx.getExtension('WEBGL_debug_renderer_info');
    const renderer = String(ctx.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : ctx.RENDERER));
    return ok && !/swiftshader|llvmpipe/i.test(renderer);
}
