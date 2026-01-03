import dotenv from 'dotenv';
import * as path from 'path';

// Load .env from project root (4 levels up from apps/todo-list/backend/src/scripts)
const envPath = path.resolve(__dirname, '../../../../.env');
dotenv.config({ path: envPath });

import { runMigrations } from '../utils/migrate';

runMigrations()
    .then(() => {
        console.log('Migrations completed successfully');
        process.exit(0);
    })
    .catch((error: unknown) => {
        console.error('Migration failed:', error);
        process.exit(1);
    });
