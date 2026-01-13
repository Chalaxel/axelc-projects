import { describe, it, expect } from 'vitest';
import { TrainingPeriodEnum } from '@shared/types/training';
import { PeriodGenerator } from '../src/services/planGenerator/PhaseAllocator';
import { LoadPlanner } from '../src/services/planGenerator/loadDicts';

describe('PlanGenerator', () => {
    // describe('PhaseAllocator', () => {
    //     it('should allocate phases backwards from race date', () => {
    //         const startDate = new Date('2024-01-01');
    //         const raceDate = new Date('2024-07-01'); // 26 weeks
    //         const weeks = PhaseAllocator.allocatePhases(startDate, raceDate);
    //         // Last week should be Race
    //         expect(weeks[weeks.length - 1].phase).toBe(TrainingPhase.RACE);
    //         // Week before race should be Peak
    //         expect(weeks[weeks.length - 2].phase).toBe(TrainingPhase.PEAK);
    //         // Check approximate Build phase
    //         // Race (1) + Peak (2) = 3 weeks. Build 2 (4 weeks) starts at index -7
    //         // weeks.length is 26. Index 25=Race. 24,23=Peak. 22,21,20,19=Build 2.
    //         expect(weeks[weeks.length - 4].phase).toBe(TrainingPhase.BUILD_2);
    //     });
    //     it('should insert recovery weeks', () => {
    //         const startDate = new Date('2024-01-01');
    //         const raceDate = new Date('2024-04-01'); // 13 weeks
    //         const weeks = PhaseAllocator.allocatePhases(startDate, raceDate);
    //         // Check that we have some recovery weeks
    //         const recoveryWeeks = weeks.filter(w => w.isRecovery);
    //         expect(recoveryWeeks.length).toBeGreaterThan(0);
    //     });
    // });
    // describe('LoadPlanner', () => {
    //     it('should reduce volume in recovery weeks', () => {
    //         const startDate = new Date('2024-01-01');
    //         const raceDate = new Date('2024-04-01');
    //         let weeks = PhaseAllocator.allocatePhases(startDate, raceDate);
    //         weeks = LoadPlanner.calculateLoad(weeks, 10); // 10 hours max
    //         const recoveryWeek = weeks.find(w => w.isRecovery && w.phase !== TrainingPhase.RACE);
    //         const loadWeek = weeks.find(w => !w.isRecovery && w.phase === recoveryWeek?.phase);
    //         if (recoveryWeek && loadWeek) {
    //             expect(recoveryWeek.targetHours).toBeLessThan(loadWeek.targetHours!);
    //         }
    //     });
    // });
});
