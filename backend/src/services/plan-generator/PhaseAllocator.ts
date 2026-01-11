import { TrainingPhase, TrainingWeek } from '@shared/types/training';

export class PhaseAllocator {
    /**
     * Allocates phases to weeks working BACKWARDS from the race date.
     * Ensures recovery weeks are inserted periodically.
     */
    static allocatePhases(startDate: Date, raceDate: Date): TrainingWeek[] {
        const totalWeeks = Math.ceil(
            (raceDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000),
        );

        if (totalWeeks < 1) {
            throw new Error('Race date must be at least 1 week after start date');
        }

        const weeks: TrainingWeek[] = new Array(totalWeeks);
        let currentWeekIndex = totalWeeks - 1;

        // 1. Allocate Race Week
        const raceWeek = this.createWeek(currentWeekIndex, startDate, TrainingPhase.RACE);
        weeks[currentWeekIndex] = raceWeek;
        currentWeekIndex--;

        // 2. Allocate Peak (Taper) - usually 1-2 weeks
        // If we have enough time, give 2 weeks, else 1
        const peakWeeks = totalWeeks > 12 ? 2 : 1;
        for (let i = 0; i < peakWeeks && currentWeekIndex >= 0; i++) {
            weeks[currentWeekIndex] = this.createWeek(
                currentWeekIndex,
                startDate,
                TrainingPhase.PEAK,
            );
            currentWeekIndex--;
        }

        // 3. Allocate Build and Base phases backwards
        const phasesToAllocate = [
            { phase: TrainingPhase.BUILD_2, duration: 4 },
            { phase: TrainingPhase.BUILD_1, duration: 4 },
            { phase: TrainingPhase.BASE_3, duration: 4 },
            { phase: TrainingPhase.BASE_2, duration: 4 },
            { phase: TrainingPhase.BASE_1, duration: 4 },
        ];

        for (const p of phasesToAllocate) {
            if (currentWeekIndex < 0) break;

            // We try to fit the full duration, but clip if we run out of start time
            // Ideally we'd have logic to compress phases proportionally if short on time,
            // but for now we prioritize specific phases nearest the race.
            const duration = Math.min(p.duration, currentWeekIndex + 1);

            this.fillPhaseBlock(weeks, currentWeekIndex, duration, p.phase, startDate);
            currentWeekIndex -= duration;
        }

        // 4. Fill remaining time with Prep or extend Base 1
        while (currentWeekIndex >= 0) {
            weeks[currentWeekIndex] = this.createWeek(
                currentWeekIndex,
                startDate,
                TrainingPhase.PREP,
            );
            currentWeekIndex--;
        }

        return weeks;
    }

    private static fillPhaseBlock(
        weeks: TrainingWeek[],
        endIndex: number,
        duration: number,
        phase: TrainingPhase,
        startDate: Date,
    ) {
        for (let i = 0; i < duration; i++) {
            const weekIdx = endIndex - i;
            // Every 4th week of a block (working backwards, it's the "last" week of the block physically,
            // but usually recovery comes at the END of a block.
            // Standard 3:1 cycle means 3 weeks load, 1 week recovery.
            // If block is 4 weeks: Load, Load, Load, Rec.
            // Since we fill backwards: Rec (i=0), Load, Load, Load.

            const isRecovery = i === 0; // Last week of the block is recovery

            weeks[weekIdx] = this.createWeek(weekIdx, startDate, phase, isRecovery);
        }
    }

    private static createWeek(
        index: number,
        planStartDate: Date,
        phase: TrainingPhase,
        isRecovery: boolean = false,
    ): TrainingWeek {
        const weekStart = new Date(planStartDate);
        weekStart.setDate(planStartDate.getDate() + index * 7);

        return {
            weekIndex: index,
            startDate: weekStart.toISOString().split('T')[0],
            phase,
            isRecovery,
            sessions: [], // To be filled by SessionBuilder
        };
    }
}
