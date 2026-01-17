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
}

export interface GoalCreationAttributes {
    targetDistance: TriathlonDistance;
    raceDate: Date;
    weeklyTrainingNumbers: number;
}
