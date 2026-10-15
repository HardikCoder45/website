import type { FinishSelection } from '@/lib/three/finishes';
import type { Mood } from '@/components/three/KitchenModel';

export interface SceneProps {
    selection: FinishSelection;
    mood: Mood;
    toggles: Record<string, boolean>;
}
