import { TriathlonDistance } from '..';

export interface Goal {
    targetDistance: TriathlonDistance;
    raceDate: Date;
    weeklyTrainingNumbers: number;
}
