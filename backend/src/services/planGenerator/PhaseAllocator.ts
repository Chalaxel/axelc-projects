import { UserLevel } from '@shared/types';
import { TrainingPeriodEnum, TrainingWeek } from '@shared/types/training';
import { differenceInCalendarWeeks, nextMonday, previousMonday, startOfToday } from 'date-fns';

interface RecoveryProps {
    age: number;
    trainingLevel: UserLevel;
    yearsOfPractice?: number;
    weeklyVolumeHours?: number;
    hasRecentInjury?: boolean;
    goal?: 'finish' | 'performance';
}

export class PeriodGenerator {
    private startDate: Date;
    private totalWeeks: number;
    private periodsCycle: number;

    constructor(
        private raceDate: Date,
        private recoveryProps: RecoveryProps,
    ) {
        this.startDate = this.setStartDate();
        this.totalWeeks = this.setTotalWeeks();
        this.periodsCycle = this.setPeriodsCycle();
    }

    private setStartDate() {
        const today = startOfToday();
        if (today.getDay() === 1) {
            return today;
        }
        if (today.getDay() === 2) {
            return previousMonday(today);
        }
        return nextMonday(today);
    }

    private setTotalWeeks() {
        const totalWeeks = differenceInCalendarWeeks(this.raceDate, this.startDate);

        if (totalWeeks < 12) {
            throw new Error('Race date must be at least 16 weeks after start date');
        }

        return totalWeeks;
    }

    public setPeriodsCycle() {
        const {
            age,
            trainingLevel,
            yearsOfPractice = 0,
            weeklyVolumeHours = 0,
            hasRecentInjury = false,
            goal = 'finish',
        } = this.recoveryProps;

        let score = 0;

        if (age >= 50) score += 3;
        else if (age >= 40) score += 2;

        if (trainingLevel === UserLevel.BEGINNER) score += 3;
        else if (trainingLevel === UserLevel.INTERMEDIATE) score += 1;

        if (yearsOfPractice < 2) score += 2;

        if (weeklyVolumeHours > 0 && weeklyVolumeHours < 6) score += 1;

        if (hasRecentInjury) score += 3;
        if (goal === 'finish') score += 1;

        const SOFT = 3;
        const REGULAR = 4;

        return score >= 5 ? SOFT : REGULAR;
    }

    public generatePeriods(weeks: TrainingWeek[] = []): TrainingWeek[] {
        if (weeks.length === this.totalWeeks) {
            return weeks;
        }

        if (weeks.length === 0) {
            const raceWeek = {
                weekIndex: this.totalWeeks - 1,
                startDate: previousMonday(this.raceDate),
                period: TrainingPeriodEnum.RACE,
                isRecovery: false,
                sessions: [],
            };

            return this.generatePeriods([raceWeek]);
        }

        const lastSetWeek = weeks[0];

        if (lastSetWeek.period === TrainingPeriodEnum.RACE) {
            const peakWeek = {
                weekIndex: lastSetWeek.weekIndex - 1,
                startDate: previousMonday(lastSetWeek.startDate),
                period: TrainingPeriodEnum.PEAK,
                isRecovery: false,
                sessions: [],
            };

            return this.generatePeriods([peakWeek, ...weeks]);
        }

        const nbOfBuildPeriods = this.buildPeriodsToInclude();

        if (lastSetWeek.period === TrainingPeriodEnum.PEAK) {
            const phasesToBuild = [
                TrainingPeriodEnum.BASE_3,
                TrainingPeriodEnum.BUILD_1,
                TrainingPeriodEnum.BUILD_2,
            ];

            const phaseToBuild = phasesToBuild[nbOfBuildPeriods];

            const period = this.createPeriod({
                trainingPhase: phaseToBuild,
                lastWeekIndex: lastSetWeek.weekIndex - 1,
                lastWeekDate: previousMonday(lastSetWeek.startDate),
            });

            return this.generatePeriods([...period, ...weeks]);
        }

        if (lastSetWeek.period === TrainingPeriodEnum.BUILD_2) {
            const period = this.createPeriod({
                trainingPhase: TrainingPeriodEnum.BUILD_1,
                lastWeekIndex: lastSetWeek.weekIndex - 1,
                lastWeekDate: previousMonday(lastSetWeek.startDate),
            });
            return this.generatePeriods([...period, ...weeks]);
        }

        if (lastSetWeek.period === TrainingPeriodEnum.BUILD_1) {
            const period = this.createPeriod({
                trainingPhase: TrainingPeriodEnum.BASE_3,
                lastWeekIndex: lastSetWeek.weekIndex - 1,
                lastWeekDate: previousMonday(lastSetWeek.startDate),
            });
            return this.generatePeriods([...period, ...weeks]);
        }

        if (lastSetWeek.period === TrainingPeriodEnum.BASE_3) {
            if (lastSetWeek.weekIndex > 3 * this.periodsCycle) {
                const period = this.createPeriod({
                    trainingPhase: TrainingPeriodEnum.BASE_3,
                    lastWeekIndex: lastSetWeek.weekIndex - 1,
                    lastWeekDate: previousMonday(lastSetWeek.startDate),
                });
                return this.generatePeriods([...period, ...weeks]);
            }
            const period = this.createPeriod({
                trainingPhase: TrainingPeriodEnum.BASE_2,
                lastWeekIndex: lastSetWeek.weekIndex - 1,
                lastWeekDate: previousMonday(lastSetWeek.startDate),
            });
            return this.generatePeriods([...period, ...weeks]);
        }

        if (lastSetWeek.period === TrainingPeriodEnum.BASE_2) {
            const period = this.createPeriod({
                trainingPhase: TrainingPeriodEnum.BASE_1,
                lastWeekIndex: lastSetWeek.weekIndex - 1,
                lastWeekDate: previousMonday(lastSetWeek.startDate),
            });
            return this.generatePeriods([...period, ...weeks]);
        }
        if (lastSetWeek.period === TrainingPeriodEnum.BASE_1) {
            const prepPeriod = Array.from({ length: this.totalWeeks - weeks.length }, (_, i) => ({
                weekIndex: i,
                startDate: previousMonday(weeks[0].startDate),
                period: TrainingPeriodEnum.PREP,
                isRecovery: false,
                sessions: [],
            }));

            return this.generatePeriods([...prepPeriod, ...weeks]);
        }

        return weeks;
    }

    private buildPeriodsToInclude() {
        const { trainingLevel } = this.recoveryProps;

        if (trainingLevel === UserLevel.BEGINNER || this.totalWeeks <= 20) {
            return 0;
        }

        if (this.totalWeeks <= 28) {
            return 1;
        }

        return 2;
    }

    private createPeriod({
        trainingPhase,
        lastWeekIndex,
        lastWeekDate,
    }: {
        trainingPhase: TrainingPeriodEnum;
        lastWeekIndex: number;
        lastWeekDate: Date;
    }) {
        const lastWeek = {
            weekIndex: lastWeekIndex,
            startDate: lastWeekDate,
            period: trainingPhase,
            isRecovery: true,
            sessions: [],
        };

        const weeks: TrainingWeek[] = [lastWeek];

        for (let i = 1; i < this.periodsCycle; i++) {
            weeks.unshift({
                ...lastWeek,
                isRecovery: false,
                weekIndex: lastWeekIndex - i,
                startDate: previousMonday(weeks[0].startDate),
            });
        }

        return weeks;
    }
}
