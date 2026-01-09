import {
    TriathlonDistance,
    SportEnum,
    SessionBlockType,
    SessionCreationAttributes,
    TriathlonPlanCreationAttributes,
} from '@shared/types';

export class PlanGeneratorService {
    /**
     * Generates a training plan based on user preferences.
     * This is a simplified version of a coaching algorithm.
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

        // Basic distribution of sessions per week based on hours
        // 5h -> ~3-4 sessions
        // 10h -> ~6-8 sessions
        // 15h+ -> ~10+ sessions
        const sessionsPerWeek = Math.max(3, Math.floor(weeklyHours / 1.5));

        for (let w = 0; w < totalWeeks; w++) {
            for (let s = 0; s < sessionsPerWeek; s++) {
                const sessionDate = new Date(startDate);
                sessionDate.setDate(
                    startDate.getDate() + w * 7 + Math.floor(s * (7 / sessionsPerWeek)),
                );

                if (sessionDate > endDate) break;

                const sport = this.getSportForSession(s, sessionsPerWeek);
                sessions.push(
                    this.createSession(userId, sport, sessionDate, distance, w, totalWeeks),
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

    private static getSportForSession(index: number, total: number): SportEnum {
        const ratio = index / total;
        if (ratio < 0.2) return SportEnum.SWIM;
        if (ratio < 0.6) return SportEnum.CYCLING;
        return SportEnum.RUN;
    }

    private static createSession(
        userId: string,
        sport: SportEnum,
        date: Date,
        distance: TriathlonDistance,
        weekIndex: number,
        totalWeeks: number,
    ): SessionCreationAttributes {
        // Simple logic to vary intensity and volume
        const isEndurance = weekIndex % 4 !== 3; // Every 4th week is recovery
        const intensity = isEndurance ? 'Z2' : 'Recovery';

        return {
            userId,
            sport,
            blocks: [
                {
                    type: SessionBlockType.SIMPLE,
                    note: `Warm up - 10-15min ${sport}`,
                    repetitions: 1,
                },
                {
                    type: SessionBlockType.SIMPLE,
                    note: isEndurance
                        ? `Main set - Endurance ${intensity} ${sport}`
                        : `Active recovery ${sport}`,
                    repetitions: 1,
                },
                {
                    type: SessionBlockType.SIMPLE,
                    note: `Cool down - 5-10min ${sport}`,
                    repetitions: 1,
                },
            ],
            data: {
                notes: `Week ${weekIndex + 1}/${totalWeeks} - ${distance} Training`,
            },
        };
    }
}
