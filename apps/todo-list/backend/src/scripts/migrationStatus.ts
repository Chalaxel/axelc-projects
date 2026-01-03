import dotenv from 'dotenv';
import * as path from 'path';

// Load .env from project root (4 levels up from apps/todo-list/backend/src/scripts)
const envPath = path.resolve(__dirname, '../../../../.env');
dotenv.config({ path: envPath });

import { getMigrationStatus } from '../utils/migrate';

getMigrationStatus()
    .then(() => {
        process.exit(0);
    })
    .catch((error: unknown) => {
        console.error('Error getting migration status:', error);
        process.exit(1);
    });
