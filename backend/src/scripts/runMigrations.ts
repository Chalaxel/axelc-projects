import dotenv from 'dotenv';
import * as path from 'path';
import { runMigrations } from '../utils/migrate';

const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

const logger = console;

runMigrations()
    .then(() => {
        logger.log('Migrations completed successfully');
        process.exit(0);
    })
    .catch((error: unknown) => {
        console.error('Migration failed:', error);
        process.exit(1);
    });
