import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Register ts-node for dynamic TypeScript imports in development
if (process.env.NODE_ENV !== 'production') {
    require('ts-node').register({
        transpileOnly: true,
        compilerOptions: {
            module: 'commonjs',
            esModuleInterop: true,
        },
    });
}

// Load .env from project root (2 levels up from backend/src)
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

const logger = console;

const app = express();
const PORT = process.env.PORT || 3000;
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
        apps: ['template', 'todo-list'],
    });
});

interface AppModule {
    router: express.Router;
    initializeDatabase?: () => Promise<void>;
    closeDatabase?: () => Promise<void>;
    startJobs?: () => void;
}

const loadedApps: Map<string, AppModule> = new Map();

const loadApp = async (appName: string): Promise<AppModule | null> => {
    try {
        const isDev = process.env.NODE_ENV !== 'production';
        let appModule: AppModule;
        
        if (isDev) {
            // In development, load from src using require (ts-node is registered above)
            const appPath = path.resolve(__dirname, `../../apps/${appName}/backend/src/index.ts`);
            appModule = require(appPath);
        } else {
            // In production, load from dist
            const appPath = path.resolve(__dirname, `../../apps/${appName}/backend/dist/index.js`);
            appModule = await import(appPath);
        }
        
        logger.log(`App ${appName} loaded successfully from ${isDev ? 'src' : 'dist'}`);
        return appModule;
    } catch (error) {
        logger.error(`Failed to load app ${appName}:`, error);
        return null;
    }
};

const registerApp = (appName: string, appModule: AppModule) => {
    app.use(`/api/${appName}`, appModule.router);
    loadedApps.set(appName, appModule);
    logger.log(`Registered routes for /api/${appName}`);
};

const initializeApps = async () => {
    for (const [appName, appModule] of loadedApps) {
        if (appModule.initializeDatabase) {
            try {
                await appModule.initializeDatabase();
                logger.log(`Database initialized for ${appName}`);
            } catch (error) {
                logger.error(`Failed to initialize database for ${appName}:`, error);
            }
        }
        if (appModule.startJobs) {
            appModule.startJobs();
            logger.log(`Jobs started for ${appName}`);
        }
    }
};

const closeApps = async () => {
    for (const [appName, appModule] of loadedApps) {
        if (appModule.closeDatabase) {
            try {
                await appModule.closeDatabase();
                logger.log(`Database closed for ${appName}`);
            } catch (error) {
                logger.error(`Failed to close database for ${appName}:`, error);
            }
        }
    }
};

app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
    logger.error('Error:', err.message);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        timestamp: new Date(),
    });
});

const startServer = async (): Promise<void> => {
    const enabledApps = (process.env.ENABLED_APPS || 'template,todo-list').split(',').map(s => s.trim());

    for (const appName of enabledApps) {
        const appModule = await loadApp(appName);
        if (appModule) {
            registerApp(appName, appModule);
        }
    }

    app.listen(Number(PORT), HOST, async () => {
        logger.log(`Backend started on http://${HOST}:${PORT}`);
        logger.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        logger.log(`Enabled apps: ${enabledApps.join(', ')}`);
        
        await initializeApps();
    });
};

process.on('SIGINT', async () => {
    logger.log('\nShutting down...');
    await closeApps();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    logger.log('\nShutting down...');
    await closeApps();
    process.exit(0);
});

startServer();

