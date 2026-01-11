import { TrainingWeek, TrainingPhase } from '@shared/types/training';

interface LoadReference {
    period: string; // Matches TrainingPhase values (roughly)
    week: string; // '1', '2', '3', '4' or 'All'
    loads: number[]; // Array of values corresponding to columns in CSV
}

export class LoadPlanner {
    private static tssData: LoadReference[] = [];
    private static hoursData: LoadReference[] = [];

    /**
     * Calculates target load (TSS and Hours) for each week.
     */
    static calculateLoad(weeks: TrainingWeek[], weeklyHoursConstraint: number): TrainingWeek[] {
        // 1. Build a baseline progression
        // If we have CSV data, we could look up values.
        // For now, let's implement the logic described:
        // - Base: High volume, low intensity
        // - Build: Stable volume, higher intensity
        // - Peak: Taper (reduce volume)

        // We will simple use the user's max available hours as the "Peak" of the Base/Build phase
        // and scale backwards.

        // Find the "max load" week index (usually end of Build 2 or Base 3)
        // Actually, usually volume peaks in Base 3 / Build 1, then intensity takes over.

        // Simple heuristic for now:
        // Recovery weeks = 60% of previous week
        // Progressive overload = +5-10% from previous load week (skipping recovery)

        // Let's iterate FORWARD now to build up fitness?
        // No, we should respect the backwards allocation phases.

        // Let's set the "Target" max volume at the end of Base 3 / start of Build 1 to be the User's Limit.
        const maxHours = weeklyHoursConstraint;

        // Assign loads
        // Correct approach: Anchor max volume at specific phase, then taper/build.

        return weeks.map(week => {
            const load = this.calculateWeekLoad(week, maxHours);
            week.targetHours = load.hours;
            week.targetTss = load.tss;
            return week;
        });
    }

    private static calculateWeekLoad(
        week: TrainingWeek,
        maxHours: number,
    ): { hours: number; tss: number } {
        let phaseFactor = 1.0;

        switch (week.phase) {
            case TrainingPhase.RACE:
                phaseFactor = 0.4;
                break;
            case TrainingPhase.PEAK:
                // Taper: 60-80%
                phaseFactor = 0.7;
                break;
            case TrainingPhase.BUILD_2:
                // High intensity, volume slightly lower than max
                phaseFactor = 0.9;
                break;
            case TrainingPhase.BUILD_1:
                phaseFactor = 0.95;
                break;
            case TrainingPhase.BASE_3:
                phaseFactor = 1.0; // Peak Volume
                break;
            case TrainingPhase.BASE_2:
                phaseFactor = 0.9;
                break;
            case TrainingPhase.BASE_1:
                phaseFactor = 0.8;
                break;
            case TrainingPhase.PREP:
                phaseFactor = 0.6;
                break;
            default:
                phaseFactor = 0.7;
        }

        if (week.isRecovery) {
            phaseFactor *= 0.6; // Recovery week reduction
        }

        // Add a slight progressive ramp within the macro-view?
        // For simplicity, the Phase factor handles the macro wave.

        const hours = Math.round(maxHours * phaseFactor * 10) / 10;

        // Estimate TSS based on hours * intensity
        // TSS = (sec x NP x IF) / (FTP x 3600) x 100
        // Approx: 1 hour @ FTP = 100 TSS.
        // Base: IF ~0.6-0.7 -> TSS/hr ~ 40-50
        // Build: IF ~0.75-0.85 -> TSS/hr ~ 60-70

        let intensityFactor = 0.6; // Prep/Base 1
        if (week.phase === TrainingPhase.BASE_2) intensityFactor = 0.65;
        if (week.phase === TrainingPhase.BASE_3) intensityFactor = 0.7;
        if (week.phase === TrainingPhase.BUILD_1) intensityFactor = 0.75;
        if (week.phase === TrainingPhase.BUILD_2) intensityFactor = 0.8;
        if (week.phase === TrainingPhase.PEAK) intensityFactor = 0.85; // High intensity, low volume
        if (week.phase === TrainingPhase.RACE) intensityFactor = 0.9;

        const tss = Math.round(hours * 100 * (intensityFactor * intensityFactor));

        return { hours, tss };
    }
}
