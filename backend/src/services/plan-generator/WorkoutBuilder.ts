import { SessionCreationAttributes, SessionBlockType, SportEnum } from '@shared/types/session';
import { WorkoutTemplate, WorkoutBlock } from '@shared/types/training';

export class WorkoutBuilder {
    static buildSession(
        template: WorkoutTemplate,
        date: Date,
        weekNumber: number,
        userId: string,
        durationMinutes: number,
    ): SessionCreationAttributes {
        // Scale blocks to fit duration
        // This is a simplified scaling: we just convert blocks to simple session blocks
        // In reality, we'd adjust main set intervals or warmup/cool down.

        // For this MVP, we map our new "WorkoutBlock" to the existing "SessionBlock"
        const sessionBlocks = template.blocks.map(b => this.mapBlock(b));

        return {
            userId,
            sport: template.sport,
            date: date.toISOString().split('T')[0],
            weekNumber,
            blocks: sessionBlocks,
            data: {
                notes: `[${template.name}] ${template.goal} - ${durationMinutes}min`,
            },
        };
    }

    private static mapBlock(block: WorkoutBlock): {
        type: SessionBlockType;
        note: string;
        repetitions?: number;
    } {
        let type = SessionBlockType.SIMPLE;
        let note = `${block.type.toUpperCase()}: ${block.description}`;

        if (block.subBlocks && block.subBlocks.length > 0) {
            type = SessionBlockType.SERIES;
            // Naive stringification of sub-blocks for the existing UI
            note = `${block.description}`;
        }

        if (block.type === 'main' && (block.description.includes('x') || block.repetitions)) {
            type = SessionBlockType.SERIES;
        }

        return {
            type,
            note,
            repetitions: block.repetitions || 1,
        };
    }
}
