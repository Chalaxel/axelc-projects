import { type Sequelize } from 'sequelize';
import { createDatabase } from '../config/database';
import { initTodoModel } from '../models/Todo';
import { runMigrations } from './migrate';

let sequelize: Sequelize | null = null;

const logger = console;

export const getDatabase = (): Sequelize => {
    if (!sequelize) {
        sequelize = createDatabase();
    }
    return sequelize;
};

export const initializeDatabase = async (): Promise<void> => {
    const db = getDatabase();
    
    initTodoModel(db);
    
    await runMigrations();
    
    logger.log('Database initialized');
};

export const closeDatabase = async (): Promise<void> => {
    if (sequelize) {
        await sequelize.close();
        sequelize = null;
        logger.log('Database connection closed');
    }
};
