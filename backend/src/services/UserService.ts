import { GoalAttributes, User } from '@shared/types';
import { models } from 'src/models/models';

export class UserService {
    static async getUserById(
        userId: string,
    ): Promise<(User & { goals?: GoalAttributes[] }) | null> {
        const user = await models.User.findByPk(userId, {
            include: [{ model: models.Goal, as: 'goals' }],
        });

        if (!user) {
            return null;
        }

        return user.toJSON();
    }

    static async addGoal(userId: string, goal: GoalAttributes): Promise<void> {
        await models.Goal.create({
            ...goal,
            userId,
        });
    }
}
