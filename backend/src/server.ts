import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

import { router } from './routes/routes';
import { initializeDatabase, closeDatabase } from './utils/dbSync';

const logger = console;

const app = express();
const PORT = process.env.BACKEND_PORT || process.env.PORT || 3000;
const HOST = '0.0.0.0';

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
    logger.log(`${new Date().toLocaleTimeString()} - ${req.method} ${req.url}`);
    next();
});

app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});

app.use('/api', router);

app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
    logger.error('Error:', err.message);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        timestamp: new Date(),
    });
});

const startServer = async (): Promise<void> => {
    app.listen(Number(PORT), HOST, async () => {
        logger.log(`Backend started on http://${HOST}:${PORT}`);
        logger.log(`Environment: ${process.env.NODE_ENV || 'development'}`);

        await initializeDatabase();
    });
};

process.on('SIGINT', async () => {
    logger.log('\nShutting down...');
    await closeDatabase();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    logger.log('\nShutting down...');
    await closeDatabase();
    process.exit(0);
});

startServer();
