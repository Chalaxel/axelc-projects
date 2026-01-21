import { TriathlonDistance } from '..';

export type GoalId = string;

export enum GoalStatus {
    ACTIVE = 'active',
    COMPLETED = 'completed',
    DRAFT = 'draft',
}

export interface GoalAttributes {
    id: GoalId;
    targetDistance: TriathlonDistance;
    raceDate: Date;
    weeklyTrainingNumbers: number;
    userId: string;
    status: GoalStatus;
    periods: {
        preparation: number;
        general: number;
        specific: number;
        taper: number;
    };
}

export interface GoalCreationAttributes {
    targetDistance: TriathlonDistance;
    raceDate: Date;
    weeklyTrainingNumbers: number;
}
