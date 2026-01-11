import { TrainingPeriodEnum } from '@shared/types/training';

export interface PhaseConfig {
    period: TrainingPeriodEnum;
    durationWeeks: number; // Duration of this specific block
    loadFactor: number; // Multiplier for volume/stress
}

export interface PhaseDefinition {
    name: TrainingPeriodEnum;
    defaultDuration: number; // weeks
    minDuration: number;
    maxDuration: number;
    priority: number; // Higher means allocated first when squeezing
}

export const DEFAULT_PHASE_ORDER = [
    TrainingPeriodEnum.RACE,
    TrainingPeriodEnum.PEAK,
    TrainingPeriodEnum.BUILD_2,
    TrainingPeriodEnum.BUILD_1,
    TrainingPeriodEnum.BASE_3,
    TrainingPeriodEnum.BASE_2,
    TrainingPeriodEnum.BASE_1,
    TrainingPeriodEnum.PREP,
];
