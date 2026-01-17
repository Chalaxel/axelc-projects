import { TriathlonDistance } from '..';

export interface GoalForm {
    targetDistance: TriathlonDistance;
    raceDate: Date;
    weeklyTrainingNumbers: number;
}
