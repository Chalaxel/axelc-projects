import {
    TriathlonDistance,
    SportEnum,
    SessionBlockType,
    SessionCreationAttributes,
    TriathlonPlanCreationAttributes,
} from '@shared/types';

enum TrainingPhase {
    BASE = 'Base',
    BUILD = 'Build',
    PEAK = 'Peak',
    TAPER = 'Taper',
}

enum SessionType {
    AEROBIC = 'Aerobic',
    THRESHOLD = 'Threshold',
    VO2MAX = 'VO2Max',
    RECOVERY = 'Recovery',
    BRICK = 'Brick',
}

export class PlanGeneratorService {
    /**
     * Generates a training plan based on user preferences.
     * Uses periodization and training phases.
     */
    static generatePlan(
        userId: string,
        distance: TriathlonDistance,
        weeklyHours: number,
        startDate: Date,
        endDate: Date,
    ): { plan: TriathlonPlanCreationAttributes; sessions: SessionCreationAttributes[] } {
        const totalWeeks = Math.ceil(
            (endDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000),
        );

        const sessions: SessionCreationAttributes[] = [];

        for (let w = 0; w < totalWeeks; w++) {
            const phase = this.getPhaseForWeek(w, totalWeeks);
            const isRecoveryWeek = (w + 1) % 4 === 0;
            const weekMultiplier = isRecoveryWeek ? 0.6 : 0.8 + (w / totalWeeks) * 0.4;
            const effectiveHours = weeklyHours * weekMultiplier;

            // Distribution based on phase
            const sessionsPerWeek = this.getSessionsCount(weeklyHours, isRecoveryWeek);

            for (let s = 0; s < sessionsPerWeek; s++) {
                const sessionDate = new Date(startDate);
                sessionDate.setDate(startDate.getDate() + w * 7);
                console.log(startDate);
                console.log(sessionDate);

                if (sessionDate > endDate) break;

                const sport = this.getSportForSession(s, sessionsPerWeek, phase);
                const type = this.getSessionType(s, sessionsPerWeek, phase, isRecoveryWeek);

                sessions.push(
                    this.createAdvancedSession(
                        userId,
                        sport,
                        sessionDate,
                        distance,
                        w,
                        totalWeeks,
                        type,
                        effectiveHours / sessionsPerWeek,
                    ),
                );
            }
        }

        const plan: TriathlonPlanCreationAttributes = {
            userId,
            distance,
            weeklyHours,
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
        };

        return { plan, sessions };
    }

    private static getPhaseForWeek(weekIndex: number, totalWeeks: number): TrainingPhase {
        const progress = weekIndex / totalWeeks;
        if (progress < 0.4) return TrainingPhase.BASE;
        if (progress < 0.7) return TrainingPhase.BUILD;
        if (progress < 0.9) return TrainingPhase.PEAK;
        return TrainingPhase.TAPER;
    }

    private static getSessionsCount(weeklyHours: number, isRecovery: boolean): number {
        let count = Math.max(3, Math.floor(weeklyHours / 1.5));
        if (isRecovery) count = Math.max(3, count - 1);
        return count;
    }

    private static getSportForSession(
        index: number,
        total: number,
        phase: TrainingPhase,
    ): SportEnum {
        const ratio = index / total;
        // In Peak phase, more running; in Base, more swimming/cycling
        if (phase === TrainingPhase.PEAK) {
            if (ratio < 0.2) return SportEnum.SWIM;
            if (ratio < 0.5) return SportEnum.CYCLING;
            return SportEnum.RUN;
        }

        if (ratio < 0.25) return SportEnum.SWIM;
        if (ratio < 0.65) return SportEnum.CYCLING;
        return SportEnum.RUN;
    }

    private static getSessionType(
        index: number,
        total: number,
        phase: TrainingPhase,
        isRecovery: boolean,
    ): SessionType {
        if (isRecovery) return SessionType.RECOVERY;

        const ratio = index / total;
        if (
            index === total - 1 &&
            (phase === TrainingPhase.BUILD || phase === TrainingPhase.PEAK)
        ) {
            return SessionType.BRICK;
        }

        if (ratio < 0.6) return SessionType.AEROBIC;
        if (ratio < 0.85) return SessionType.THRESHOLD;
        return SessionType.VO2MAX;
    }

    private static createAdvancedSession(
        userId: string,
        sport: SportEnum,
        date: Date,
        distance: TriathlonDistance,
        weekIndex: number,
        totalWeeks: number,
        type: SessionType,
        avgDurationHours: number,
    ): SessionCreationAttributes {
        const durationMin = Math.round(avgDurationHours * 60);
        const mainSetDur = Math.round(durationMin * 0.7);

        const blocks = [
            {
                type: SessionBlockType.SIMPLE,
                note: `Warm up - 15min ${sport} (progressive)`,
                repetitions: 1,
            },
        ];

        if (type === SessionType.THRESHOLD) {
            blocks.push({
                type: SessionBlockType.SERIES,
                note: `Main Set: 4x8min @ Threshold with 2min rest`,
                repetitions: 4,
            });
        } else if (type === SessionType.VO2MAX) {
            blocks.push({
                type: SessionBlockType.SERIES,
                note: `Main Set: 10x40"/20" @ VO2Max`,
                repetitions: 10,
            });
        } else if (type === SessionType.BRICK) {
            blocks.push({
                type: SessionBlockType.SIMPLE,
                note: `Main Set: ${sport} focus ${mainSetDur}min then transition run 10min`,
                repetitions: 1,
            });
        } else {
            blocks.push({
                type: SessionBlockType.SIMPLE,
                note: `Main Set: ${type} ${sport} - ${mainSetDur}min`,
                repetitions: 1,
            });
        }

        blocks.push({
            type: SessionBlockType.SIMPLE,
            note: `Cool down - 10min easy ${sport}`,
            repetitions: 1,
        });

        const phase = this.getPhaseForWeek(weekIndex, totalWeeks);

        return {
            userId,
            sport,
            blocks,
            date: date.toISOString().split('T')[0],
            weekNumber: weekIndex + 1,
            data: {
                notes: `[Week ${weekIndex + 1}/${totalWeeks} - Phase ${phase}] Type: ${type} | Focus: ${distance} preparation`,
            },
        };
    }
}
