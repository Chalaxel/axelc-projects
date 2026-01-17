import { models } from '../models/models';
import { Session, SessionCreationAttributes, SessionData } from '@shared/types';

export class SessionService {
    async getAll(userId: string): Promise<Session[]> {
        const sessions = await models.Session.findAll({
            where: { userId },
            order: [
                ['date', 'DESC'],
                ['createdAt', 'DESC'],
            ],
        });
        return sessions.map(session => session.toJSON() as Session);
    }

    async getById(id: string, userId: string): Promise<Session | null> {
        const session = await models.Session.findOne({
            where: { id, userId },
        });
        if (!session) {
            return null;
        }
        return session ? (session.toJSON() as Session) : null;
    }

    async create(data: SessionCreationAttributes, userId: string): Promise<Session> {
        const session = await models.Session.create({
            sport: data.sport,
            blocks: data.blocks || [],
            data: data.data || {},
            date: data.date,
            weekNumber: data.weekNumber,
            userId,
        });
        return session.toJSON() as Session;
    }

    async update(
        id: string,
        data: Partial<SessionCreationAttributes>,
        userId: string,
    ): Promise<Session | null> {
        const session = await models.Session.findOne({
            where: { id, userId },
        });
        if (!session) {
            return null;
        }

        if (data.sport !== undefined) {
            session.set('sport', data.sport);
        }
        if (data.blocks !== undefined) {
            session.set('blocks', data.blocks);
        }
        if (data.date !== undefined) {
            session.set('date', data.date);
        }
        if (data.weekNumber !== undefined) {
            session.set('weekNumber', data.weekNumber);
        }

        const currentData = session.get('data') || {};
        const newData: SessionData = {
            ...currentData,
            ...data.data,
        };

        session.set('data', newData);

        await session.save();
        return session.toJSON() as Session;
    }

    async delete(id: string, userId: string): Promise<boolean> {
        const session = await models.Session.findOne({
            where: { id, userId },
        });
        if (!session) {
            return false;
        }

        await session.destroy();
        return true;
    }
}

export const sessionService = new SessionService();
