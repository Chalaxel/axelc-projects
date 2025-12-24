import { randomUUID } from 'crypto';
import { QueryInterface, DataTypes } from 'sequelize';

const PRODUCT_VARIANTS = 'product_variants';

module.exports = {
    async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
        await queryInterface.createTable(PRODUCT_VARIANTS, {
            id: {
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
            },
            productId: {
                type: Sequelize.UUID,
                allowNull: false,
                field: 'productId',
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            imageBase64: {
                type: Sequelize.TEXT,
                allowNull: true,
                field: 'imageBase64',
            },
            stock: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            isAvailable: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
                field: 'isAvailable',
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });

        // Ajout de la contrainte de clé étrangère
        await queryInterface.addConstraint(PRODUCT_VARIANTS, {
            fields: ['productId'],
            type: 'foreign key',
            name: 'fkey_product_variants_productId',
            references: {
                table: 'products',
                field: 'id',
            },
            onDelete: 'cascade',
            onUpdate: 'cascade',
        });

        // Récupérer les produits existants pour créer des variantes
        const products = (await queryInterface.sequelize.query(
            'SELECT id, name FROM products ORDER BY "createdAt" ASC',
            { type: 'SELECT' },
        )) as any[];

        if (products.length >= 2) {
            const torchonId = products[0].id;
            const cotonsId = products[1].id;

            const variantsToInsert = [
                // Variantes pour "Torchon"
                {
                    productId: torchonId,
                    name: 'Motif Beige',
                    imageBase64: null, // À remplir avec une vraie image base64
                    stock: 15,
                    isAvailable: true,
                },
                {
                    productId: torchonId,
                    name: 'Motif Bleu Marine',
                    imageBase64: null,
                    stock: 20,
                    isAvailable: true,
                },
                {
                    productId: torchonId,
                    name: 'Motif Rouge',
                    imageBase64: null,
                    stock: 10,
                    isAvailable: true,
                },
                // Variantes pour "Cotons de toilette"
                {
                    productId: cotonsId,
                    name: 'Coloris Blanc',
                    imageBase64: null,
                    stock: 25,
                    isAvailable: true,
                },
                {
                    productId: cotonsId,
                    name: 'Coloris Rose Poudré',
                    imageBase64: null,
                    stock: 18,
                    isAvailable: true,
                },
                {
                    productId: cotonsId,
                    name: 'Coloris Vert Menthe',
                    imageBase64: null,
                    stock: 12,
                    isAvailable: true,
                },
            ];

            await queryInterface.bulkInsert(
                PRODUCT_VARIANTS,
                variantsToInsert.map((variant) => ({
                    id: randomUUID(),
                    productId: variant.productId,
                    name: variant.name,
                    imageBase64: variant.imageBase64,
                    stock: variant.stock,
                    isAvailable: variant.isAvailable,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })),
            );
        }
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.dropTable(PRODUCT_VARIANTS);
    },
};
