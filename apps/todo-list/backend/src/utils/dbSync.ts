import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import { createDatabase } from '@monorepo/shared-backend';

// Load .env files: root first, then app-specific
const rootEnvPath = path.resolve(__dirname, '../../../../.env');
const appEnvPath = path.resolve(__dirname, '../../.env');

if (fs.existsSync(rootEnvPath)) {
    dotenv.config({ path: rootEnvPath });
}
if (fs.existsSync(appEnvPath)) {
    dotenv.config({ path: appEnvPath, override: false });
}

let sequelize: Sequelize | null = null;

export const getDatabase = (): Sequelize => {
    if (!sequelize) {
        sequelize = createDatabase('todo-list');
    }
    return sequelize;
};

export const initializeDatabase = async (): Promise<void> => {
    const db = getDatabase();
    
    // Initialize models
    const { initTodoModel } = await import('../models/Todo');
    initTodoModel(db);
    
    // Run migrations
    const { runMigrations } = await import('./migrate');
    await runMigrations();
    
    console.log('Database initialized for todo-list');
};

export const closeDatabase = async (): Promise<void> => {
    if (sequelize) {
        await sequelize.close();
        sequelize = null;
        console.log('Database connection closed for todo-list');
    }
};
