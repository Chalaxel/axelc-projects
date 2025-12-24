import { Router, Request, Response } from 'express';

const router = Router();

router.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'healthy', app: 'app1' });
});

// Add your routes here

export { router };

