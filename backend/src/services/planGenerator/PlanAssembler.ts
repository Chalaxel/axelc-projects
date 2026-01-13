import {
    TriathlonPlanCreationAttributes,
    SessionCreationAttributes,
    TriathlonDistance,
    SportEnum,
    UserLevel,
} from '@shared/types';
import { PeriodGenerator } from './PhaseAllocator';
import { LoadPlanner } from './loadDicts';
import { WorkoutLibrary } from './WorkoutLibrary';
import { WorkoutBuilder } from './WorkoutBuilder';
import { TrainingWeek } from '@shared/types/training';

export class PlanAssembler {
    static assemble(
        userId: string,
        distance: TriathlonDistance,
        weeklyHours: number,
        startDate: Date,
        raceDate: Date,
    ): { plan: TriathlonPlanCreationAttributes; sessions: SessionCreationAttributes[] } {
        let weeks = new PeriodGenerator(raceDate, {
            age: 21,
            trainingLevel: UserLevel.INTERMEDIATE,
        }).generatePeriods();

        // 2. Plan Loads
        weeks = LoadPlanner.calculateLoad(weeks, weeklyHours);

        // 3. Generate Sessions for each week
        const allSessions: SessionCreationAttributes[] = [];

        weeks.forEach(week => {
            const weekSessions = this.generateWeekSessions(week, userId);
            allSessions.push(...weekSessions);
        });

        const plan: TriathlonPlanCreationAttributes = {
            userId,
            distance,
            weeklyHours,
            startDate: startDate.toISOString().split('T')[0],
            endDate: raceDate.toISOString().split('T')[0],
        };

        return { plan, sessions: allSessions };
    }

    private static generateWeekSessions(
        week: TrainingWeek,
        userId: string,
    ): SessionCreationAttributes[] {
        const sessions: SessionCreationAttributes[] = [];
        const { targetHours = 5, period: phase } = week;

        // Distribution of sports based on Distance & Phase
        // Simple distribution: Swim 20%, Bike 40%, Run 30%, S&C 10%
        // We will just create 3 key sessions for now: 1 Swim, 1 Bike, 1 Run + optional extras based on volume.

        const numSessions = Math.max(3, Math.floor(targetHours / 1.5));

        for (let i = 0; i < numSessions; i++) {
            // Cycle through sports: Swim, Bike, Run
            let sport = SportEnum.RUN;
            if (i % 3 === 0) sport = SportEnum.SWIM;
            if (i % 3 === 1) sport = SportEnum.CYCLING;

            // Get templates for this phase
            const templates = WorkoutLibrary.getTemplatesForPhase(phase).filter(
                t => t.sport === sport,
            );
            if (templates.length === 0) continue;

            const template = templates[i % templates.length];

            // Assign Date
            const sessionDate = new Date(week.startDate);
            sessionDate.setDate(sessionDate.getDate() + ((i * 2) % 7)); // Spread them out roughly

            // Create Session
            const avgDuration = (targetHours / numSessions) * 60; // minutes
            const session = WorkoutBuilder.buildSession(
                template,
                sessionDate,
                week.weekIndex + 1,
                userId,
                Math.round(avgDuration),
            );

            sessions.push(session);
        }

        return sessions;
    }
}
