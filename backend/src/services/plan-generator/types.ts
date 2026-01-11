import { TrainingPhase } from '@shared/types/training';

export interface PhaseConfig {
    phase: TrainingPhase;
    durationWeeks: number; // Duration of this specific block
    loadFactor: number; // Multiplier for volume/stress
}

export interface PhaseDefinition {
    name: TrainingPhase;
    defaultDuration: number; // weeks
    minDuration: number;
    maxDuration: number;
    priority: number; // Higher means allocated first when squeezing
}

export const DEFAULT_PHASE_ORDER = [
    TrainingPhase.RACE,
    TrainingPhase.PEAK,
    TrainingPhase.BUILD_2,
    TrainingPhase.BUILD_1,
    TrainingPhase.BASE_3,
    TrainingPhase.BASE_2,
    TrainingPhase.BASE_1,
    TrainingPhase.PREP,
];
