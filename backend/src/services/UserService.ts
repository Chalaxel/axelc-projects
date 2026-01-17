import { getDatabase } from '../utils/dbSync';
import { initUserModel, getUserModel } from '../models/User';
import { Goal, User, UserPublic } from '@shared/types';

const db = getDatabase();
initUserModel(db);
const UserModel = getUserModel();

export class UserService {
    static async getUserById(userId: string): Promise<UserPublic | null> {
        const user = await UserModel.findByPk(userId);
        if (!user) {
            return null;
        }

        return user.toJSON() as User;
    }

    static async addGoal(userId: string, goal: Goal): Promise<void> {
        const user = await UserModel.findByPk(userId);
        if (!user) {
            throw new Error('User not found');
        }

        user.set('profile', { ...user.profile, goals: [...(user.profile?.goals || []), goal] });
        await user.save();
    }
}
