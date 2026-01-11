import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TrainingPeriodEnum } from '@shared/types/training';
import { PeriodGenerator } from '../src/services/planGenerator/PhaseAllocator';
import { UserLevel } from '@shared/types';

// Mock date-fns
vi.mock('date-fns', async () => {
    const actual = await vi.importActual('date-fns');
    return {
        ...actual,
        startOfToday: vi.fn(),
    };
});

import { startOfToday } from 'date-fns';

describe('PlanAllocator', () => {
    const raceDate = new Date('2026-06-21');

    beforeEach(() => {
        // Set a fixed date for all tests: Monday, January 1st, 2024
        vi.mocked(startOfToday).mockReturnValue(new Date('2026-01-12'));
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('generatePeriods', () => {
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

    describe('setPeriodsCycle', () => {
        it('should recommend 2:1 for older intermediate athlete finishing goal', () => {
            const phaseAllocator = new PeriodGenerator(raceDate, {
                age: 45,
                trainingLevel: UserLevel.INTERMEDIATE,
                yearsOfPractice: 3,
                weeklyVolumeHours: 5,
                hasRecentInjury: false,
                goal: 'finish',
            });

            const recoveryCycle = phaseAllocator.setPeriodsCycle();
            expect(recoveryCycle).toBe(3);
        });

        it('should recommend 3:1 for young advanced athlete with performance goal', () => {
            const phaseAllocator = new PeriodGenerator(raceDate, {
                age: 28,
                trainingLevel: UserLevel.ADVANCED,
                yearsOfPractice: 5,
                weeklyVolumeHours: 12,
                hasRecentInjury: false,
                goal: 'performance',
            });
            const recoveryCycle = phaseAllocator.setPeriodsCycle();
            expect(recoveryCycle).toBe(4);
        });

        it('should recommend 2:1 for beginner regardless of age', () => {
            const phaseAllocator = new PeriodGenerator(raceDate, {
                age: 30,
                trainingLevel: UserLevel.BEGINNER,
                yearsOfPractice: 0,
                weeklyVolumeHours: 4,
                hasRecentInjury: false,
                goal: 'finish',
            });
            const recoveryCycle = phaseAllocator.setPeriodsCycle();
            expect(recoveryCycle).toBe(3);
        });

        it('should recommend 3:1 for athlete over 50 with good level', () => {
            const phaseAllocator = new PeriodGenerator(raceDate, {
                age: 55,
                trainingLevel: UserLevel.INTERMEDIATE,
                yearsOfPractice: 10,
                weeklyVolumeHours: 8,
                hasRecentInjury: false,
                goal: 'performance',
            });
            const recoveryCycle = phaseAllocator.setPeriodsCycle();
            expect(recoveryCycle).toBe(4);
        });

        it('should recommend 2:1 for athlete with recent injury but good level', () => {
            const phaseAllocator = new PeriodGenerator(raceDate, {
                age: 35,
                trainingLevel: UserLevel.INTERMEDIATE,
                yearsOfPractice: 4,
                weeklyVolumeHours: 10,
                hasRecentInjury: true,
                goal: 'performance',
            });
            const recoveryCycle = phaseAllocator.setPeriodsCycle();
            expect(recoveryCycle).toBe(4);
        });

        it('should recommend 3:1 for low volume but young athlete', () => {
            const phaseAllocator = new PeriodGenerator(raceDate, {
                age: 32,
                trainingLevel: UserLevel.INTERMEDIATE,
                yearsOfPractice: 3,
                weeklyVolumeHours: 4,
                hasRecentInjury: false,
                goal: 'finish',
            });
            const recoveryCycle = phaseAllocator.setPeriodsCycle();
            expect(recoveryCycle).toBe(4);
        });

        it('should recommend 3:1 for experienced high-volume athlete', () => {
            const phaseAllocator = new PeriodGenerator(raceDate, {
                age: 35,
                trainingLevel: UserLevel.ADVANCED,
                yearsOfPractice: 8,
                weeklyVolumeHours: 15,
                hasRecentInjury: false,
                goal: 'performance',
            });
            const recoveryCycle = phaseAllocator.setPeriodsCycle();
            expect(recoveryCycle).toBe(4);
        });
    });
});
