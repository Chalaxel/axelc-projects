import dotenv from 'dotenv';
import * as path from 'path';
import { runMigrations } from '../utils/migrate';

const envPath = path.resolve(__dirname, '../../../../backend/.env');
dotenv.config({ path: envPath });

runMigrations()
    .then(() => {
        console.log('Migrations completed successfully');
        process.exit(0);
    })
    .catch((error: unknown) => {
        console.error('Migration failed:', error);
        process.exit(1);
    });
