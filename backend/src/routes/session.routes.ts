import { Router, Response } from 'express';
import { getUserMiddleware, AuthenticatedRequest } from '../middleware/auth';
import { sessionService } from 'src/services/SessionService';
import { SessionCreationAttributes } from '@shared/types';

const router = Router();

router.get('/', getUserMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Non autorisé' });
        }
        const sessions = await sessionService.getAll(req.user.userId);
        res.json({ success: true, data: sessions });
    } catch (error) {
        console.error('Error fetching sessions:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch sessions' });
    }
});

router.get('/:id', getUserMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Non autorisé' });
        }
        const { id } = req.params;
        const session = await sessionService.getById(id, req.user.userId);

        if (!session) {
            return res.status(404).json({ success: false, message: 'Session not found' });
        }

        res.json({ success: true, data: session });
    } catch (error) {
        console.error('Error fetching session:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch session' });
    }
});

router.post('/', getUserMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Non autorisé' });
        }
        const data: SessionCreationAttributes = req.body;

        if (!data.sport) {
            return res.status(400).json({ success: false, message: 'Sport is required' });
        }

        const session = await sessionService.create(data, req.user.userId);
        res.status(201).json({ success: true, data: session });
    } catch (error) {
        console.error('Error creating session:', error);
        res.status(500).json({ success: false, message: 'Failed to create session' });
    }
});

router.put('/:id', getUserMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Non autorisé' });
        }
        const { id } = req.params;
        const data: Partial<SessionCreationAttributes> = req.body;

        const session = await sessionService.update(id, data, req.user.userId);

        if (!session) {
            return res.status(404).json({ success: false, message: 'Session not found' });
        }

        res.json({ success: true, data: session });
    } catch (error) {
        console.error('Error updating session:', error);
        res.status(500).json({ success: false, message: 'Failed to update session' });
    }
});

router.delete('/:id', getUserMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Non autorisé' });
        }
        const { id } = req.params;
        const deleted = await sessionService.delete(id, req.user.userId);

        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Session not found' });
        }

        res.json({ success: true, message: 'Session deleted successfully' });
    } catch (error) {
        console.error('Error deleting session:', error);
        res.status(500).json({ success: false, message: 'Failed to delete session' });
    }
});

export { router as sessionRouter };
