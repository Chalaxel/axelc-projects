import { Sequelize, Options } from 'sequelize';
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
    const host = process.env.POSTGRESQL_ADDON_HOST || process.env.DB_HOST || 'localhost';
    const port = process.env.POSTGRESQL_ADDON_PORT || process.env.DB_PORT || '5432';
    const database = process.env.POSTGRESQL_ADDON_DB || process.env.DB_NAME || 'monorepo';
    const username = process.env.POSTGRESQL_ADDON_USER || process.env.DB_USER || 'postgres';
    const password = process.env.POSTGRESQL_ADDON_PASSWORD || process.env.DB_PASSWORD || 'password';
    
    return {
        host,
        port: parseInt(port),
        database,
        username,
        password,
        ssl: process.env.DB_SSL === 'true',
        tablePrefix: appName ? `${appName.replace(/-/g, '_')}_` : undefined,
    };
};

export const createSequelizeInstance = (config: DatabaseConfig): Sequelize => {
    // Check if we have a connection URI (e.g., from Clever Cloud POSTGRESQL_ADDON_URI)
    // If so, use it directly - the URI typically includes SSL parameters
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
        // When using a connection URI, the URI typically includes SSL parameters
        // Only override if SSL is explicitly disabled (to allow disabling SSL when needed)
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
    
    // Otherwise, use individual connection parameters
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
                      // Use 'prefer' mode: try SSL but don't require it
                      // This allows fallback to non-SSL if SSL fails
                      require: false,
                      rejectUnauthorized: false,
                  }
                : false,
        },
    };

    return new Sequelize(options);
};

export const createDatabase = (appName?: string): Sequelize => {
    const config = createDatabaseConfig(appName);

    return createSequelizeInstance(config);
};

