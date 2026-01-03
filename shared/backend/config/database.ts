import { Sequelize, Options } from 'sequelize';
import dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load .env files in order: project root, then app-specific if appName provided
const loadEnvFiles = (appName?: string) => {
    // Always load root .env first
    const rootEnvPath = path.resolve(__dirname, '../../../.env');
    if (fs.existsSync(rootEnvPath)) {
        dotenv.config({ path: rootEnvPath });
    }
    
    // Then load app-specific .env if it exists
    if (appName) {
        const appEnvPath = path.resolve(__dirname, `../../../apps/${appName}/backend/.env`);
        if (fs.existsSync(appEnvPath)) {
            dotenv.config({ path: appEnvPath, override: false }); // Don't override root .env
        }
    }
};

// Load root .env on module load
loadEnvFiles();

export interface DatabaseConfig {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
    ssl: boolean;
    tablePrefix?: string;
}

export const createDatabaseConfig = (appName?: string): DatabaseConfig => {
    // Load env files when creating config (in case appName wasn't known at module load)
    loadEnvFiles(appName);
    
    const prefix = appName ? `${appName.toUpperCase().replace(/-/g, '_')}_` : '';
    
    return {
        host: process.env[`${prefix}DB_HOST`] || process.env.DB_HOST || 'localhost',
        port: parseInt(process.env[`${prefix}DB_PORT`] || process.env.DB_PORT || '5432'),
        database: process.env[`${prefix}DB_NAME`] || process.env.DB_NAME || 'monorepo',
        username: process.env[`${prefix}DB_USER`] || process.env.DB_USER || 'postgres',
        password: process.env[`${prefix}DB_PASSWORD`] || process.env.DB_PASSWORD || 'password',
        ssl: process.env[`${prefix}DB_SSL`] === 'true' || process.env.DB_SSL === 'true',
        tablePrefix: appName ? `${appName.replace(/-/g, '_')}_` : undefined,
    };
};

export const createSequelizeInstance = (config: DatabaseConfig): Sequelize => {
    const options: Options = {
        dialect: 'postgres',
        host: config.host,
        port: config.port,
        database: config.database,
        username: config.username,
        password: config.password,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
        logging: false,
        dialectOptions: {
            ssl: config.ssl
                ? {
                      require: true,
                      rejectUnauthorized: false,
                  }
                : false,
        },
        timezone: '+00:00',
    };

    return new Sequelize(options);
};

export const createDatabase = (appName?: string): Sequelize => {
    const config = createDatabaseConfig(appName);
    return createSequelizeInstance(config);
};

