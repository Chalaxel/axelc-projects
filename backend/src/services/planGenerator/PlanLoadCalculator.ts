import { TriathlonDistance, UserLevel } from '@shared/types';
import { PlanGenerationContext } from './PhaseAllocator';

export class PlanLoadCalculator {
    private readonly context: PlanGenerationContext;
    private readonly seasonWeeks = 48;

    constructor(context: PlanGenerationContext) {
        this.context = context;
    }

    public getFloorAnnualVolume() {
        let { annualHours, annualTSS } = this.computeAnnualVolume();

        annualTSS = Math.max(15000, Math.min(60000, annualTSS));
        annualTSS = Math.floor(annualTSS / 2500) * 2500;

        annualHours = Math.max(300, Math.min(1200, annualHours));
        annualHours = Math.floor(annualHours / 50) * 50;

        return {
            annualHours,
            annualTSS,
        };
    }

    public computeAnnualVolume() {
        const annualHours = this.computeAnnualHours();
        const rawAnnualTSS = this.computeAnnualTSS();
        const annualTSS = this.harmonizeTSSWithHours(rawAnnualTSS, annualHours);

        return {
            annualHours,
            annualTSS,
        };
    }

    private computeAnnualTSS(): number {
        const { recentWeeklyTss } = this.context;

        const baseAnnualTSS =
            recentWeeklyTss !== undefined ? recentWeeklyTss * this.seasonWeeks : 24000;

        const adjustedTSS =
            baseAnnualTSS *
            this.getExperienceFactor() *
            this.getTrainingLevelFactor() *
            this.getAgeFactor() *
            this.getRiskFactor() *
            this.getObjectiveFactor() *
            this.getRaceDistanceFactor();

        return Math.round(adjustedTSS);
    }

    private computeAnnualHours(): number {
        const { recentWeeklyVolumeHours } = this.context;

        const baseAnnualHours =
            recentWeeklyVolumeHours !== undefined
                ? recentWeeklyVolumeHours * this.seasonWeeks
                : 380;

        const adjustedHours =
            baseAnnualHours *
            this.getTrainingLevelFactor() *
            this.getAgeFactor() *
            this.getRiskFactor() *
            this.getRaceDistanceFactor();

        return Math.round(adjustedHours);
    }

    private harmonizeTSSWithHours(annualTSS: number, annualHours: number): number {
        const maxTSSPerHour = 72;
        return Math.min(annualTSS, Math.round(annualHours * maxTSSPerHour));
    }

    private getExperienceFactor(): number {
        const { yearsOfPractice } = this.context;

        if (yearsOfPractice === undefined) return 0.9;
        if (yearsOfPractice <= 1) return 0.75;
        if (yearsOfPractice <= 3) return 0.85;
        if (yearsOfPractice <= 6) return 1.0;
        if (yearsOfPractice <= 10) return 1.05;

        return 1.1;
    }

    private getRaceDistanceFactor(): number {
        switch (this.context.raceDistance) {
            case TriathlonDistance.XS:
                return 0.7;
            case TriathlonDistance.S:
                return 0.85;
            case TriathlonDistance.M:
                return 1.0;
            case TriathlonDistance.L:
                return 1.15;
            case TriathlonDistance.XL:
                return 1.3;
            default:
                return 1.0; // olympique par défaut
        }
    }

    private getTrainingLevelFactor(): number {
        switch (this.context.trainingLevel) {
            case UserLevel.BEGINNER:
                return 0.85;
            case UserLevel.INTERMEDIATE:
                return 1.0;
            case UserLevel.ADVANCED:
                return 1.1;
        }
    }

    private getAgeFactor(): number {
        const { age } = this.context;

        if (age < 30) return 1.0;
        if (age < 40) return 0.97;
        if (age < 50) return 0.93;

        return 0.9;
    }

    private getRiskFactor(): number {
        const { injuryHistory, lifeStress } = this.context;

        let factor = 1.0;

        if (injuryHistory === 'minor') factor -= 0.05;
        if (injuryHistory === 'major') factor -= 0.1;

        if (lifeStress === 'moderate') factor -= 0.05;
        if (lifeStress === 'high') factor -= 0.1;

        return factor;
    }

    private getObjectiveFactor(): number {
        return this.context.objective === 'performance' ? 1.05 : 0.95;
    }
}
