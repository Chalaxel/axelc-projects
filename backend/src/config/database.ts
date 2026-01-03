import { Sequelize, Options } from 'sequelize';

export interface DatabaseConfig {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
    ssl: boolean;
}

export const createDatabaseConfig = (): DatabaseConfig => {
    const host = process.env.POSTGRESQL_ADDON_HOST || process.env.DB_HOST || 'localhost';
    const port = process.env.POSTGRESQL_ADDON_PORT || process.env.DB_PORT || '5432';
    const database = process.env.POSTGRESQL_ADDON_DB || process.env.DB_NAME || 'todo_list';
    const username = process.env.POSTGRESQL_ADDON_USER || process.env.DB_USER || 'postgres';
    const password = process.env.POSTGRESQL_ADDON_PASSWORD || process.env.DB_PASSWORD || 'password';
    
    return {
        host,
        port: parseInt(port),
        database,
        username,
        password,
        ssl: process.env.DB_SSL === 'true',
    };
};

export const createSequelizeInstance = (config: DatabaseConfig): Sequelize => {
    const connectionUri = process.env.POSTGRESQL_ADDON_URI || process.env.DATABASE_URL;
    
    const baseOptions: Options = {
        dialect: 'postgres',
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
        logging: false,
        timezone: '+00:00',
    };
    
    if (connectionUri) {
        const options: Options = {
            ...baseOptions,
            ...(config.ssl === false && {
                dialectOptions: {
                    ssl: false,
                },
            }),
        };
        
        return new Sequelize(connectionUri, options);
    }
    
    const options: Options = {
        ...baseOptions,
        host: config.host,
        port: config.port,
        database: config.database,
        username: config.username,
        password: config.password,
        dialectOptions: {
            ssl: config.ssl
                ? {
                      require: false,
                      rejectUnauthorized: false,
                  }
                : false,
        },
    };

    return new Sequelize(options);
};

export const createDatabase = (): Sequelize => {
    const config = createDatabaseConfig();
    return createSequelizeInstance(config);
};
