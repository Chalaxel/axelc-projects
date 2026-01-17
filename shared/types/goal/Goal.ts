import { TriathlonDistance } from '..';

export interface Goal {
    targetDistance: TriathlonDistance;
    raceDate: Date;
    weeklyTrainingNumbers: number;
}

export interface GoalForm {
    targetDistance: TriathlonDistance;
    raceDate: string | Date;
    weeklyTrainingNumbers: number;
}
