import { randomUUID } from 'crypto';
import { QueryInterface, DataTypes } from 'sequelize';

const PRODUCTS = 'products';

// UUIDs qui correspondent aux catégories de la première migration
const CATEGORY_CUISINE_ID = 'd696bc88-eb90-4f2b-b086-fe50ea38a3d0';
const CATEGORY_SALLE_DE_BAIN_ID = '5da601f0-07e0-4bae-9934-fa3e15976f20';

const initialProducts = [
    {
        price: 3,
        categoryId: CATEGORY_CUISINE_ID,
        name: 'Torchon',
    },
    {
        price: 3,
        categoryId: CATEGORY_SALLE_DE_BAIN_ID,
        name: 'Cotons de toilette',
    },
];

module.exports = {
    async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
        await queryInterface.createTable(PRODUCTS, {
            id: {
                primaryKey: true,
                type: Sequelize.UUID,
            },
            price: {
                type: Sequelize.INTEGER,
            },
            name: {
                type: Sequelize.TEXT,
            },
            categoryId: {
                type: Sequelize.UUID,
            },
            createdAt: {
                type: Sequelize.DATE,
            },
            updatedAt: {
                type: Sequelize.DATE,
            },
        });
        await queryInterface.addConstraint(PRODUCTS, {
            fields: ['categoryId'],
            type: 'foreign key',
            name: 'fkey_products_categoryId',
            references: {
                table: 'categories',
                field: 'id',
            },
            onDelete: 'restrict',
            onUpdate: 'restrict',
        });
        await queryInterface.bulkInsert(
            PRODUCTS,
            initialProducts.map((product) => ({
                id: randomUUID(),
                name: product.name,
                categoryId: product.categoryId,
                price: product.price,
                createdAt: new Date(),
                updatedAt: new Date(),
            })),
        );
    },

    async down(queryInterface) {
        await queryInterface.dropTable(PRODUCTS);
    },
};
