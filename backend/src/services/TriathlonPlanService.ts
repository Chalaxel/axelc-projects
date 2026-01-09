import { getDatabase } from '../utils/dbSync';
import { initTriathlonPlanModel, getTriathlonPlanModel } from '../models/TriathlonPlan';
import { getSessionModel } from '../models/Session';
import { getUserModel } from '../models/User';
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

const db = getDatabase();
initTriathlonPlanModel(db);
const TriathlonPlanModel = getTriathlonPlanModel();
const SessionModel = getSessionModel();
const UserModel = getUserModel();

export class TriathlonPlanService {
    async getCurrentPlan(userId: string): Promise<TriathlonPlan | null> {
        const plan = await TriathlonPlanModel.findOne({
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

        const plan = await TriathlonPlanModel.create(planData);

        // Bulk create sessions
        if (sessions.length > 0) {
            await SessionModel.bulkCreate(
                sessions.map(s => ({
                    ...s,
                    userId,
                })),
            );
        }

        return plan.toJSON() as TriathlonPlan;
    }

    async updateUserProfile(userId: string, profile: UserProfile): Promise<UserPublic> {
        const user = await UserModel.findByPk(userId);
        if (!user) throw new Error('User not found');

        user.set('profile', profile);
        await user.save();

        return user.toJSON() as UserPublic;
    }

    async addGoal(userId: string, goal: Omit<UserGoal, 'id' | 'status'>): Promise<UserPublic> {
        const user = await UserModel.findByPk(userId);
        if (!user) throw new Error('User not found');

        const currentProfile = (user.get('profile') as UserProfile) || { goals: [] };
        if (!currentProfile.goals) currentProfile.goals = [];

        const newGoal: UserGoal = {
            ...goal,
            id: crypto.randomUUID(),
            status: UserGoalStatus.ACTIVE,
        };

        // Deactivate other goals if this one is active
        currentProfile.goals = currentProfile.goals.map(g => ({
            ...g,
            status: UserGoalStatus.COMPLETED,
        }));

        currentProfile.goals.push(newGoal);
        user.set('profile', currentProfile);
        user.changed('profile', true);
        await user.save();

        return user.toJSON() as UserPublic;
    }
    async deleteCurrentPlan(userId: string): Promise<void> {
        // Delete all sessions for the user
        await SessionModel.destroy({
            where: { userId },
        });

        // Delete all plans for the user
        await TriathlonPlanModel.destroy({
            where: { userId },
        });

        // Clear goals in user profile
        const user = await UserModel.findByPk(userId);
        if (user) {
            const profile = (user.get('profile') as UserProfile) || { goals: [] };
            profile.goals = [];
            user.set('profile', profile);
            user.changed('profile', true);
            await user.save();
        }
    }
}

export const triathlonPlanService = new TriathlonPlanService();
