import { TriathlonDistance } from '..';

export type GoalId = string;

export enum GoalStatus {
    ACTIVE = 'active',
    COMPLETED = 'completed',
    DRAFT = 'draft',
}

interface Period {
    startDate: string;
    duration: number;
}

export interface GoalAttributes {
    id: GoalId;
    targetDistance: TriathlonDistance;
    raceDate: Date;
    weeklyTrainingNumbers: number;
    userId: string;
    status: GoalStatus;
    periods: {
        preparation: Period;
        general: Period;
        specific: Period;
        taper: Period;
    };
}

export interface GoalCreationAttributes {
    targetDistance: TriathlonDistance;
    raceDate: Date;
    weeklyTrainingNumbers: number;
}
