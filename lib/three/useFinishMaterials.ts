'use client';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import type { FinishGroup, FinishSelection } from './finishes';
import { applySelection, snapshot, type Snapshot } from './applyFinishes';

type Params = THREE.MeshPhysicalMaterialParameters;

/**
 * Creates named materials for procedural scenes and keeps them in sync with
 * the finish selection. `base` gives each material's authored ("original") look.
 */
export function useFinishMaterials<K extends string>(
    base: Record<K, Params>,
    groups: FinishGroup[],
    selection: FinishSelection,
    /** Runs once before the "original" look is snapshotted (e.g. to attach canvas textures). */
    init?: (mats: Record<K, THREE.MeshPhysicalMaterial>) => void,
) {
    const entries = useMemo(() => {
        const out = {} as Record<K, { m: THREE.MeshPhysicalMaterial; o: Snapshot }>;
        const mats = {} as Record<K, THREE.MeshPhysicalMaterial>;
        (Object.keys(base) as K[]).forEach((name) => { mats[name] = new THREE.MeshPhysicalMaterial({ ...base[name], name }); });
        init?.(mats);
        (Object.keys(mats) as K[]).forEach((name) => { out[name] = { m: mats[name], o: snapshot(mats[name]) }; });
        return out;
        // Base params are static module-level objects.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        applySelection(groups, selection, (n) => entries[n as K]);
    }, [entries, groups, selection]);

    useEffect(() => () => { Object.values<{ m: THREE.Material }>(entries).forEach((e) => e.m.dispose()); }, [entries]);

    return useMemo(() => {
        const mats = {} as Record<K, THREE.MeshPhysicalMaterial>;
        (Object.keys(entries) as K[]).forEach((k) => { mats[k] = entries[k].m; });
        return mats;
    }, [entries]);
}
