import { Sequelize, Options } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

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
    const prefix = appName ? `${appName.toUpperCase()}_` : '';
    
    return {
        host: process.env[`${prefix}POSTGRESQL_ADDON_HOST`] || process.env.POSTGRESQL_ADDON_HOST || 'localhost',
        port: parseInt(process.env[`${prefix}POSTGRESQL_ADDON_PORT`] || process.env.POSTGRESQL_ADDON_PORT || '5432'),
        database: process.env[`${prefix}POSTGRESQL_ADDON_DB`] || process.env.POSTGRESQL_ADDON_DB || 'myapp',
        username: process.env[`${prefix}POSTGRESQL_ADDON_USER`] || process.env.POSTGRESQL_ADDON_USER || 'postgres',
        password: process.env[`${prefix}POSTGRESQL_ADDON_PASSWORD`] || process.env.POSTGRESQL_ADDON_PASSWORD || 'password',
        ssl: process.env[`${prefix}DB_SSL`] === 'true' || process.env.DB_SSL === 'true',
        tablePrefix: appName ? `${appName}_` : undefined,
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

