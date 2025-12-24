require('dotenv').config();

module.exports = {
    username: process.env.POSTGRESQL_ADDON_USER || 'postgres',
    password: process.env.POSTGRESQL_ADDON_PASSWORD || 'password',
    database: process.env.POSTGRESQL_ADDON_DB || 'myapp',
    host: process.env.POSTGRESQL_ADDON_HOST || 'localhost',
    port: parseInt(process.env.POSTGRESQL_ADDON_PORT || '5432'),
    dialect: 'postgres',
    dialectOptions: {
        require: true,
        rejectUnauthorized: false,
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
    logging: false,
};
