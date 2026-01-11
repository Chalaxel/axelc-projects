import {
    TriathlonDistance,
    SessionCreationAttributes,
    TriathlonPlanCreationAttributes,
} from '@shared/types';
import { PlanAssembler } from './plan-generator/PlanAssembler';

export class PlanGeneratorService {
    /**
     * Generates a training plan based on user preferences.
     * Uses periodization and training phases via PlanAssembler.
     */
    static generatePlan(
        userId: string,
        distance: TriathlonDistance,
        weeklyHours: number,
        startDate: Date,
        endDate: Date,
    ): { plan: TriathlonPlanCreationAttributes; sessions: SessionCreationAttributes[] } {
        return PlanAssembler.assemble(userId, distance, weeklyHours, startDate, endDate);
    }
}
