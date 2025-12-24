import { router } from './routes/routes';
import { initializeDatabase, closeDatabase } from './utils/dbSync';
import { startExpiredOrdersCleanup } from './jobs/expiredOrdersCleanup';

export {
    router,
    initializeDatabase,
    closeDatabase,
};

export const startJobs = () => {
    startExpiredOrdersCleanup();
};

