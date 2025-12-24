import { QueryInterface, DataTypes } from 'sequelize';

export default {
    async up(queryInterface: QueryInterface): Promise<void> {
        // Supprimer les colonnes redondantes qui sont maintenant gérées par les relations
        await queryInterface.removeColumn('order_items', 'productName');
        await queryInterface.removeColumn('order_items', 'variantName');
        await queryInterface.removeColumn('order_items', 'variantImageBase64');

        // Ajouter les contraintes de clés étrangères pour Product et Variant
        await queryInterface.addConstraint('order_items', {
            fields: ['productId'],
            type: 'foreign key',
            name: 'fk_order_items_product',
            references: {
                table: 'products',
                field: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT', // Empêcher la suppression d'un produit utilisé dans une commande
        });

        await queryInterface.addConstraint('order_items', {
            fields: ['variantId'],
            type: 'foreign key',
            name: 'fk_order_items_variant',
            references: {
                table: 'product_variants',
                field: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT', // Empêcher la suppression d'un variant utilisé dans une commande
        });
    },

    async down(queryInterface: QueryInterface): Promise<void> {
        // Retirer les contraintes de clés étrangères
        await queryInterface.removeConstraint('order_items', 'fk_order_items_product');
        await queryInterface.removeConstraint('order_items', 'fk_order_items_variant');

        // Rajouter les colonnes supprimées
        await queryInterface.addColumn('order_items', 'productName', {
            type: DataTypes.STRING,
            allowNull: true, // Permettre NULL temporairement pour ne pas bloquer
        });

        await queryInterface.addColumn('order_items', 'variantName', {
            type: DataTypes.STRING,
            allowNull: true,
        });

        await queryInterface.addColumn('order_items', 'variantImageBase64', {
            type: DataTypes.TEXT,
            allowNull: true,
        });
    },
};

