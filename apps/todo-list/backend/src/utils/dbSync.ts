import { Sequelize } from 'sequelize';
import { createDatabase } from '@monorepo/shared-backend';

let sequelize: Sequelize | null = null;

export const getDatabase = (): Sequelize => {
    if (!sequelize) {
        sequelize = createDatabase('todo-list');
    }
    return sequelize;
};

export const initializeDatabase = async (): Promise<void> => {
    const db = getDatabase();
    
    const { initTodoModel } = await import('../models/Todo');
    initTodoModel(db);
    
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
