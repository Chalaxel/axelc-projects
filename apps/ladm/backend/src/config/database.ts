// backend/src/config/database.ts
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

// Configuration de la base de données
const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.POSTGRESQL_ADDON_HOST || 'localhost',
    port: parseInt(process.env.POSTGRESQL_ADDON_PORT || '5432'),
    database: process.env.POSTGRESQL_ADDON_DB || 'myapp',
    username: process.env.POSTGRESQL_ADDON_USER || 'postgres',
    password: process.env.POSTGRESQL_ADDON_PASSWORD || 'password',

    // Options de connexion
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },

    // Logging
    logging: false,

    // Options SSL pour les bases de données en ligne
    dialectOptions: {
        ssl:
            process.env.DB_SSL === 'true'
                ? {
                      require: true,
                      rejectUnauthorized: false,
                  }
                : false,
    },

    // Timezone
    timezone: '+00:00',
});

export default sequelize;
