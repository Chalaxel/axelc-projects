import { Router, Request, Response, NextFunction } from 'express';
import { categoriesRoutes } from './categories.routes';
import { productRoutes } from './products.routes';
import { ordersRoutes } from './orders.routes';
import { notificationsRoutes } from './notifications.routes';
import { paymentsRoutes } from './payments.routes';
import { articlesRoutes } from './articles.routes';
import { pagesRoutes } from './pages.routes';
import { contactRoutes } from './contact.routes';
import { isArray } from 'lodash/fp';
import { Route } from '../types';

const logger = console;

const router = Router();

const sendJson = (data: any, req: Request, res: Response) => {
    if (data?.status === 'error') {
        logger.error(data);
    }

    res.json(isArray(data) ? { items: data } : data);
};

const createSubRouter = (routes: Route[]) => {
    const router = Router();

    routes.forEach(({ handler, method, middlewares = [], path, send = sendJson }) => {
        router[method](path, middlewares, (req: Request, res: Response, next: NextFunction) => {
            handler(req)
                .then((data: any) => send(data, req, res))
                .catch(next);
        });
    });

    return router;
};

// Health check pour Clever Cloud
router.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});

router.use('/categories', createSubRouter(categoriesRoutes));
router.use('/products', createSubRouter(productRoutes));
router.use('/orders', createSubRouter(ordersRoutes));
router.use('/notifications', createSubRouter(notificationsRoutes));
router.use('/payments', createSubRouter(paymentsRoutes));
router.use('/articles', createSubRouter(articlesRoutes));
router.use('/pages', createSubRouter(pagesRoutes));
router.use('/contact', createSubRouter(contactRoutes));

router.all('*', (req: Request, res: Response) => {
    res.sendStatus(404);
});

export { router };
