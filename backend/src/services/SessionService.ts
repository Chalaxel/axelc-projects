import { getDatabase } from '../utils/dbSync';
import { initSessionModel, getSessionModel } from '../models/Session';
import { Session, SessionCreationAttributes } from '@shared/types';

const db = getDatabase();
initSessionModel(db);
const SessionModel = getSessionModel();

export class SessionService {
    async getAll(): Promise<Session[]> {
        const sessions = await SessionModel.findAll({
            order: [['createdAt', 'DESC']],
        });
        return sessions.map(session => session.toJSON() as Session);
    }

    async getById(id: string): Promise<Session | null> {
        const session = await SessionModel.findByPk(id);
        return session ? (session.toJSON() as Session) : null;
    }

    async create(data: SessionCreationAttributes): Promise<Session> {
        const session = await SessionModel.create({
            sport: data.sport,
            blocks: data.blocks || [],
        });
        return session.toJSON() as Session;
    }

    async update(id: string, data: Partial<SessionCreationAttributes>): Promise<Session | null> {
        const session = await SessionModel.findByPk(id);
        if (!session) {
            return null;
        }

        if (data.sport !== undefined) {
            session.set('sport', data.sport);
        }
        if (data.blocks !== undefined) {
            session.set('blocks', data.blocks);
        }

        await session.save();
        return session.toJSON() as Session;
    }

    async delete(id: string): Promise<boolean> {
        const session = await SessionModel.findByPk(id);
        if (!session) {
            return false;
        }

        await session.destroy();
        return true;
    }
}

export const sessionService = new SessionService();
