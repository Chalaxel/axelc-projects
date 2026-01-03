import { Router, Request, Response } from 'express';
import { authRouter } from './auth.routes';
import { sessionRouter } from './session.routes';

const router = Router();

router.use('/auth', authRouter);
router.use('/sessions', sessionRouter);

router.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'healthy' });
});

export { router };
