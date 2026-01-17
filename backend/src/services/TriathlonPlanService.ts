import {
    TriathlonPlan,
    TriathlonDistance,
    UserProfile,
    UserPublic,
    UserGoal,
    UserGoalStatus,
} from '@shared/types';
import { PlanGeneratorService } from './PlanGeneratorService';
import crypto from 'crypto';
import { models } from 'src/models/models';

export class TriathlonPlanService {
    async getCurrentPlan(userId: string): Promise<TriathlonPlan | null> {
        const plan = await models.TriathlonPlan.findOne({
            where: { userId },
            order: [['createdAt', 'DESC']],
        });

        if (!plan) return null;

        // In a real app, we might want to fetch sessions associated with this plan
        // For now, we'll just return the plan details
        return plan.toJSON() as TriathlonPlan;
    }

    async createPlan(
        userId: string,
        data: {
            distance: TriathlonDistance;
            weeklyHours: number;
            startDate: string;
            endDate: string;
        },
    ): Promise<TriathlonPlan> {
        const { plan: planData, sessions } = PlanGeneratorService.generatePlan(
            userId,
            data.distance,
            data.weeklyHours,
            new Date(data.startDate),
            new Date(data.endDate),
        );

        const plan = await models.TriathlonPlan.create(planData);

        // Bulk create sessions
        if (sessions.length > 0) {
            await models.Session.bulkCreate(
                sessions.map(s => ({
                    ...s,
                    userId,
                })),
            );
        }

        return plan.toJSON() as TriathlonPlan;
    }

    async updateUserProfile(userId: string, profile: UserProfile): Promise<UserPublic> {
        const user = await models.User.findByPk(userId);
        if (!user) throw new Error('User not found');

        user.set('profile', profile);
        await user.save();

        return user.toJSON() as UserPublic;
    }

    async addGoal(userId: string, goal: Omit<UserGoal, 'id' | 'status'>): Promise<UserPublic> {
        const user = await models.User.findByPk(userId);
        if (!user) throw new Error('User not found');

        // Deactivate other active goals
        await models.Goal.update(
            { status: UserGoalStatus.COMPLETED },
            {
                where: {
                    userId,
                    status: UserGoalStatus.ACTIVE,
                },
            },
        );

        // Create new goal
        await models.Goal.create({
            ...goal,
            id: crypto.randomUUID(),
            userId,
            status: UserGoalStatus.ACTIVE,
        });

        // Refetch user with goals
        const updatedUser = await models.User.findByPk(userId, {
            include: [{ model: models.Goal, as: 'goals' }],
        });

        if (!updatedUser) throw new Error('User fetch failed');

        const userData = updatedUser.toJSON() as UserPublic & { goals?: UserGoal[] };
        const profile = userData.profile || { goals: [] };
        if (userData.goals) {
            profile.goals = userData.goals.map(g => ({
                _id: g.id,
                targetDistance: g.targetDistance as any,
                raceDate: g.raceDate ? new Date(g.raceDate) : new Date(),
                weeklyTrainingNumbers: g.weeklyAvailability,
            }));
        }

        return { ...userData, profile };
    }

    async deleteCurrentPlan(userId: string): Promise<void> {
        // Delete all sessions for the user
        await models.Session.destroy({
            where: { userId },
        });

        // Delete all plans for the user
        await models.TriathlonPlan.destroy({
            where: { userId },
        });

        // Clear goals (delete them)
        await models.Goal.destroy({
            where: { userId },
        });

        // Also clear profile goals just in case there are vestiges
        const user = await models.User.findByPk(userId);
        if (user) {
            const profile = (user.get('profile') as UserProfile) || { goals: [] };
            profile.goals = [];
            user.set('profile', profile);
            user.save();
        }
    }
}

export const triathlonPlanService = new TriathlonPlanService();
