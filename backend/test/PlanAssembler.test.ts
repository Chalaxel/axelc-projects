import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TrainingPeriodEnum } from '@shared/types/training';
import { PeriodGenerator } from '../src/services/planGenerator/PhaseAllocator';
import { UserLevel } from '@shared/types';
import { startOfToday } from 'date-fns';
import { LoadPlanner } from '../src/services/planGenerator/loadDicts';

// Mock date-fns
vi.mock('date-fns', async () => {
    const actual = await vi.importActual('date-fns');
    return {
        ...actual,
        startOfToday: vi.fn(),
    };
});

describe('PlanAssembler', () => {
    const raceDate = new Date('2026-06-21');

    beforeEach(() => {
        // Set a fixed date for all tests: Monday, January 1st, 2024
        vi.mocked(startOfToday).mockReturnValue(new Date('2026-01-12'));
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('assemble', () => {
        it('should allocate phases backwards from race date', () => {
            const phaseAllocator = new PeriodGenerator(raceDate, {
                age: 21,
                trainingLevel: UserLevel.INTERMEDIATE,
                yearsOfPractice: 1,
                weeklyVolumeHours: 6,
                hasRecentInjury: false,
                goal: 'performance',
            });

            const weeks = phaseAllocator.generatePeriods();

            // Last week should be Race
            expect(weeks[weeks.length - 1].period).toBe(TrainingPeriodEnum.RACE);

            // Week before race should be Peak
            expect(weeks[weeks.length - 2].period).toBe(TrainingPeriodEnum.PEAK);
        });
    });
});
