import { Goal, User, UserPublic, UserGoal } from '@shared/types';
import { models } from 'src/models/models';

export class UserService {
    static async getUserById(userId: string): Promise<UserPublic | null> {
        const user = await models.User.findByPk(userId, {
            include: [{ model: models.Goal, as: 'goals' }],
        });

        if (!user) {
            return null;
        }

        const userData = user.toJSON() as User & { goals?: UserGoal[] };

        // Transform the structure to match UserPublic if necessary,
        // or ensure backend returns what frontend expects.
        // Frontend expects user.profile.goals.
        // We will map the fetched goals into the profile object for compatibility.

        const profile = userData.profile || { goals: [] };
        if (userData.goals) {
            profile.goals = userData.goals.map(g => ({
                _id: g.id,
                targetDistance: g.targetDistance as any,
                raceDate: g.raceDate ? new Date(g.raceDate) : new Date(),
                weeklyTrainingNumbers: g.weeklyAvailability,
            }));
        }

        return {
            ...userData,
            profile,
        };
    }

    static async addGoal(userId: string, goal: Goal): Promise<void> {
        await models.Goal.create({
            ...goal,
            userId,
        } as any);
    }
}
