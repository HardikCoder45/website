import * as THREE from 'three';
import type { FinishChoice, FinishGroup, FinishSelection } from './finishes';

type Std = THREE.MeshStandardMaterial;
export interface Snapshot { color: THREE.Color; map: THREE.Texture | null; roughness: number; metalness: number; emissive: THREE.Color }

export function snapshot(m: Std): Snapshot {
    return { color: m.color.clone(), map: m.map, roughness: m.roughness, metalness: m.metalness, emissive: m.emissive.clone() };
}

/** Restyle one material with a finish choice; `original` restores the snapshot. */
export function applyChoice(m: Std, choice: FinishChoice, o: Snapshot) {
    if (choice.original) {
        m.color.copy(o.color);
        m.map = o.map;
        m.roughness = o.roughness;
        m.metalness = o.metalness;
    } else {
        m.color.set(choice.color ?? '#ffffff');
        m.map = choice.keepMap ? o.map : null;
        m.roughness = choice.roughness ?? o.roughness;
        m.metalness = choice.metalness ?? o.metalness;
    }
    // Light-emitting finishes (e.g. LED colour) follow the chosen colour too.
    const emits = o.emissive.r + o.emissive.g + o.emissive.b > 0;
    if (emits) {
        if (choice.original) m.emissive.copy(o.emissive);
        else if (choice.color) m.emissive.set(choice.color);
    }
    m.needsUpdate = true;
}

export function applySelection(groups: FinishGroup[], sel: FinishSelection, lookup: (name: string) => { m: Std; o: Snapshot } | undefined) {
    for (const g of groups) {
        const choice = g.choices.find((c) => c.id === sel[g.id]);
        if (!choice) continue;
        for (const name of g.materials) {
            const entry = lookup(name);
            if (entry) applyChoice(entry.m, choice, entry.o);
        }
    }
}

/**
 * Gives every configurable material on `root` its own clone (so cached GLTF
 * materials aren't mutated across instances) and returns a function that
 * applies a finish selection.
 */
export function prepareFinishes(root: THREE.Object3D, groups: FinishGroup[]) {
    const names = new Set(groups.flatMap((g) => g.materials));
    const clones = new Map<string, { m: Std; o: Snapshot }>();

    root.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (!mesh.isMesh) return;
        const swap = (m: THREE.Material) => {
            if (!names.has(m.name)) return m;
            let entry = clones.get(m.name);
            if (!entry) {
                const c = (m as Std).clone();
                entry = { m: c, o: snapshot(c) };
                clones.set(m.name, entry);
            }
            return entry.m;
        };
        mesh.material = Array.isArray(mesh.material) ? mesh.material.map(swap) : swap(mesh.material);
    });

    return (sel: FinishSelection) => applySelection(groups, sel, (n) => clones.get(n));
}
