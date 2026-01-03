import { Umzug } from 'umzug';
import * as path from 'path';
import { getDatabase } from './dbSync';

const createUmzug = () => {
    const sequelize = getDatabase();
    const queryInterface = sequelize.getQueryInterface();
    
    return new Umzug({
        migrations: {
            glob: path.join(__dirname, '../migrations/*.ts'),
            resolve: ({ name, path: migrationPath, context }) => {
                const migration = require(migrationPath!);
                return {
                    name,
                    up: async () => migration.up(context),
                    down: async () => migration.down ? migration.down(context) : Promise.resolve(),
                };
            },
        },
        context: queryInterface,
        storage: {
            async executed() {
                const [tables] = await sequelize.query(`
                    SELECT table_name 
                    FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name = 'SequelizeMeta';
                `) as [Array<{ table_name: string }>, unknown];
                
                if (tables.length === 0) {
                    return [];
                }
                
                const [results] = await sequelize.query(
                    `SELECT name FROM "SequelizeMeta" ORDER BY name;`
                ) as [Array<{ name: string }>, unknown];
                return results.map((r: { name: string }) => r.name);
            },
            async logMigration({ name }) {
                await sequelize.query(
                    `INSERT INTO "SequelizeMeta" (name) VALUES ('${name}');`
                );
            },
            async unlogMigration({ name }) {
                await sequelize.query(
                    `DELETE FROM "SequelizeMeta" WHERE name = '${name}';`
                );
            },
        },
        logger: console,
    });
};

export const runMigrations = async (): Promise<void> => {
    const sequelize = getDatabase();
    const queryInterface = sequelize.getQueryInterface();
    
    await queryInterface.sequelize.query(`
        CREATE TABLE IF NOT EXISTS "SequelizeMeta" (
            name VARCHAR(255) NOT NULL PRIMARY KEY
        );
    `);
    
    const umzug = createUmzug();
    await umzug.up();
};

export const getMigrationStatus = async (): Promise<void> => {
    const sequelize = getDatabase();
    const queryInterface = sequelize.getQueryInterface();
    
    await queryInterface.sequelize.query(`
        CREATE TABLE IF NOT EXISTS "SequelizeMeta" (
            name VARCHAR(255) NOT NULL PRIMARY KEY
        );
    `);
    
    const umzug = createUmzug();
    const pending = await umzug.pending();
    const executed = await umzug.executed();
    
    console.log('\n=== Migration Status ===\n');
    
    if (executed.length === 0 && pending.length === 0) {
        console.log('No migrations found.');
        return;
    }
    
    if (executed.length > 0) {
        console.log('Executed migrations:');
        executed.forEach((migration) => {
            console.log(`  ✓ ${migration.name}`);
        });
        console.log('');
    }
    
    if (pending.length > 0) {
        console.log('Pending migrations:');
        pending.forEach((migration) => {
            console.log(`  ⏳ ${migration.name}`);
        });
        console.log('');
    } else {
        console.log('All migrations are up to date.\n');
    }
};
