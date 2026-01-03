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
    
    // Support Clever Cloud PostgreSQL Addon variables (POSTGRESQL_ADDON_*)
    // Fallback to custom DB_* variables or defaults
    const getEnvVar = (key: string, defaultValue: string): string => {
        // Try app-specific prefix first
        if (prefix) {
            const appSpecific = process.env[`${prefix}${key}`];
            if (appSpecific) return appSpecific;
        }
        
        // Try Clever Cloud PostgreSQL Addon variables
        const cleverCloudKey = key.replace('DB_', 'POSTGRESQL_ADDON_');
        const cleverCloudValue = process.env[cleverCloudKey];
        if (cleverCloudValue) return cleverCloudValue;
        
        // Try custom DB_* variables
        const customValue = process.env[`DB_${key}`];
        if (customValue) return customValue;
        
        // Fallback to default
        return defaultValue;
    };
    
    // Determine SSL requirement
    // Explicitly disabled takes precedence
    const sslDisabled = process.env[`${prefix}DB_SSL`] === 'false' || 
                        process.env.DB_SSL === 'false';
    
    // SSL is enabled if explicitly set to true, or auto-enabled for Clever Cloud
    const sslEnabled = !sslDisabled && (
        process.env[`${prefix}DB_SSL`] === 'true' || 
        process.env.DB_SSL === 'true' || 
        !!process.env.POSTGRESQL_ADDON_HOST // Auto-enable SSL if using Clever Cloud
    );
    
    return {
        host: getEnvVar('HOST', 'localhost'),
        port: parseInt(getEnvVar('PORT', '5432')),
        database: getEnvVar('NAME', 'monorepo'),
        username: getEnvVar('USER', 'postgres'),
        password: getEnvVar('PASSWORD', 'password'),
        ssl: sslEnabled,
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

