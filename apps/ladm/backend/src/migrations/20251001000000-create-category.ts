import { QueryInterface, DataTypes } from 'sequelize';

const CATEGORIES = 'categories';

// UUIDs fixes pour les catégories
const CATEGORY_CUISINE_ID = 'd696bc88-eb90-4f2b-b086-fe50ea38a3d0';
const CATEGORY_SALLE_DE_BAIN_ID = '5da601f0-07e0-4bae-9934-fa3e15976f20';

const initialCategories = [
    { id: CATEGORY_CUISINE_ID, name: 'Cuisine' },
    { id: CATEGORY_SALLE_DE_BAIN_ID, name: 'Salle de bain' },
];

module.exports = {
    async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
        await queryInterface.createTable(CATEGORIES, {
            id: {
                primaryKey: true,
                type: Sequelize.UUID,
            },
            name: {
                type: Sequelize.TEXT,
            },
            createdAt: {
                type: Sequelize.DATE,
            },
            updatedAt: {
                type: Sequelize.DATE,
            },
        });
        await queryInterface.bulkInsert(
            CATEGORIES,
            initialCategories.map((cat) => ({
                id: cat.id,
                name: cat.name,
                createdAt: new Date(),
                updatedAt: new Date(),
            })),
        );
    },

    async down(queryInterface) {
        await queryInterface.dropTable(CATEGORIES);
    },
};
