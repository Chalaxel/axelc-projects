import { SessionCreationAttributes, SportEnum } from '../session';

export enum TrainingPeriodEnum {
    PREP = 'Prep',
    BASE_1 = 'Base 1',
    BASE_2 = 'Base 2',
    BASE_3 = 'Base 3',
    BUILD_1 = 'Build 1',
    BUILD_2 = 'Build 2',
    PEAK = 'Peak',
    RACE = 'Race',
    TRANSITION = 'Transition',
}

export interface TrainingWeek {
    weekIndex: number;
    startDate: Date;
    period: TrainingPeriodEnum;
    isRecovery: boolean;
    targetTss?: number;
    targetHours?: number;
    sessions: SessionCreationAttributes[];
}

export interface IntensityZone {
    name: string;
    minHeartRate?: number;
    maxHeartRate?: number;
    minPower?: number;
    maxPower?: number;
    minPace?: number;
    maxPace?: number;
    description?: string;
}

export interface UserPhysio {
    maxHR?: number;
    restHR?: number;
    ftp?: number; // Cycling Functional Threshold Power
    thresholdPaceRun?: number; // min/km
    thresholdPaceSwim?: number; // min/100m
    zones?: {
        heartRate: IntensityZone[];
        power: IntensityZone[];
        pace: IntensityZone[];
    };
}

export interface WorkoutBlock {
    type: 'warmup' | 'main' | 'cooldown' | 'recovery' | 'drill';
    durationMinutes?: number;
    distanceMeters?: number;
    intensityZone?: number; // 1-7 or similar
    description: string;
    repetitions?: number;
    subBlocks?: WorkoutBlock[];
}

export interface WorkoutTemplate {
    id: string;
    name: string;
    sport: SportEnum;
    phases: TrainingPeriodEnum[];
    goal: string;
    durationFactor: number; // multiplier of session duration
    blocks: WorkoutBlock[];
}

export interface TrainingPeriod {
    type: TrainingPeriodEnum;
    durationWeeks: number;
}
