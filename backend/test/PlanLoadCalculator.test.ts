import { describe, it, expect } from 'vitest';
import { TriathlonDistance, UserLevel } from '@shared/types';
import { PlanLoadCalculator } from 'src/services/planGenerator/PlanLoadCalculator';

describe('PlanLoadCalculator', () => {
    describe('computeAnnualVolume', () => {
        it('baseline intermediate athlete with full data (olympic)', () => {
            const calc = new PlanLoadCalculator({
                age: 21,
                trainingLevel: UserLevel.INTERMEDIATE,
                yearsOfPractice: 1,
                recentWeeklyVolumeHours: 6,
                recentWeeklyTss: 500,
                sessionsPerWeek: 5,
                injuryHistory: 'none',
                lifeStress: 'low',
                objective: 'performance',
                raceDistance: TriathlonDistance.M,
            });

            const result = calc.computeAnnualVolume();

            expect(result.annualHours).toBeLessThan(300);
            expect(result.annualTSS).toBeLessThan(20000);
        });

        it('beginner with no history should be conservative (sprint)', () => {
            const calc = new PlanLoadCalculator({
                age: 30,
                trainingLevel: UserLevel.BEGINNER,
                objective: 'finish',
                raceDistance: TriathlonDistance.S,
            });

            const result = calc.computeAnnualVolume();

            expect(result.annualHours).toBeLessThanOrEqual(350);
            expect(result.annualTSS).toBeLessThanOrEqual(22000);
        });

        it('advanced athlete with performance objective should be aggressive (half)', () => {
            const calc = new PlanLoadCalculator({
                age: 28,
                trainingLevel: UserLevel.ADVANCED,
                yearsOfPractice: 8,
                recentWeeklyVolumeHours: 12,
                recentWeeklyTss: 750,
                objective: 'performance',
                raceDistance: TriathlonDistance.L,
            });

            const result = calc.computeAnnualVolume();

            expect(result.annualHours).toBeGreaterThan(500);
            expect(result.annualTSS).toBeGreaterThan(30000);
        });

        it('older athlete should have reduced load even on olympic distance', () => {
            const calc = new PlanLoadCalculator({
                age: 55,
                trainingLevel: UserLevel.INTERMEDIATE,
                recentWeeklyVolumeHours: 8,
                recentWeeklyTss: 450,
                raceDistance: TriathlonDistance.M,
            });

            const result = calc.computeAnnualVolume();

            expect(result.annualHours).toBeLessThan(380);
            expect(result.annualTSS).toBeLessThan(22000);
        });

        it('major injury history should cap volume even for long distance (half)', () => {
            const calc = new PlanLoadCalculator({
                age: 40,
                trainingLevel: UserLevel.INTERMEDIATE,
                recentWeeklyVolumeHours: 9,
                recentWeeklyTss: 550,
                injuryHistory: 'major',
                raceDistance: TriathlonDistance.L,
            });

            const result = calc.computeAnnualVolume();

            expect(result.annualHours).toBeLessThan(420);
            expect(result.annualTSS).toBeLessThan(24000);
        });

        it('high life stress should reduce both hours and TSS (olympic)', () => {
            const calc = new PlanLoadCalculator({
                age: 35,
                trainingLevel: UserLevel.INTERMEDIATE,
                recentWeeklyVolumeHours: 8,
                recentWeeklyTss: 500,
                lifeStress: 'high',
                raceDistance: TriathlonDistance.M,
            });

            const result = calc.computeAnnualVolume();

            expect(result.annualHours).toBeLessThan(380);
            expect(result.annualTSS).toBeLessThan(24000);
        });

        it('finish objective should be safer than performance at same distance', () => {
            const finishCalc = new PlanLoadCalculator({
                age: 32,
                trainingLevel: UserLevel.INTERMEDIATE,
                recentWeeklyVolumeHours: 8,
                recentWeeklyTss: 480,
                objective: 'finish',
                raceDistance: TriathlonDistance.M,
            });

            const perfCalc = new PlanLoadCalculator({
                age: 32,
                trainingLevel: UserLevel.INTERMEDIATE,
                recentWeeklyVolumeHours: 8,
                recentWeeklyTss: 480,
                objective: 'performance',
                raceDistance: TriathlonDistance.M,
            });

            const finishResult = finishCalc.computeAnnualVolume();
            const perfResult = perfCalc.computeAnnualVolume();

            expect(perfResult.annualTSS).toBeGreaterThan(finishResult.annualTSS);
        });

        it('ironman distance should generate more load than olympic for same athlete', () => {
            const olympic = new PlanLoadCalculator({
                age: 34,
                trainingLevel: UserLevel.INTERMEDIATE,
                recentWeeklyVolumeHours: 8,
                recentWeeklyTss: 480,
                raceDistance: TriathlonDistance.M,
            });

            const ironman = new PlanLoadCalculator({
                age: 34,
                trainingLevel: UserLevel.INTERMEDIATE,
                recentWeeklyVolumeHours: 8,
                recentWeeklyTss: 480,
                raceDistance: TriathlonDistance.XL,
            });

            const o = olympic.computeAnnualVolume();
            const i = ironman.computeAnnualVolume();

            expect(i.annualHours).toBeGreaterThan(o.annualHours);
            expect(i.annualTSS).toBeGreaterThan(o.annualTSS);
        });

        it('TSS should never exceed hours-based cap regardless of distance', () => {
            const calc = new PlanLoadCalculator({
                age: 25,
                trainingLevel: UserLevel.BEGINNER,
                recentWeeklyVolumeHours: 5,
                recentWeeklyTss: 1200, // volontairement énorme
                raceDistance: TriathlonDistance.XL,
            });

            const result = calc.computeAnnualVolume();

            const maxAllowedTSS = result.annualHours * 72;
            expect(result.annualTSS).toBeLessThanOrEqual(maxAllowedTSS);
        });

        it('should work with minimal required data and default distance', () => {
            const calc = new PlanLoadCalculator({
                age: 18,
                trainingLevel: UserLevel.BEGINNER,
            });

            const result = calc.computeAnnualVolume();

            expect(result.annualHours).toBeDefined();
            expect(result.annualTSS).toBeDefined();
        });

        it('yearsOfPractice should increase load progressively at same distance', () => {
            const lowExp = new PlanLoadCalculator({
                age: 30,
                trainingLevel: UserLevel.INTERMEDIATE,
                yearsOfPractice: 1,
                raceDistance: TriathlonDistance.M,
            });

            const highExp = new PlanLoadCalculator({
                age: 30,
                trainingLevel: UserLevel.INTERMEDIATE,
                yearsOfPractice: 8,
                raceDistance: TriathlonDistance.M,
            });

            const low = lowExp.computeAnnualVolume();
            const high = highExp.computeAnnualVolume();

            expect(high.annualTSS).toBeGreaterThan(low.annualTSS);
        });
    });
});
