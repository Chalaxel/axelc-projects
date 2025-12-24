import { QueryInterface, DataTypes } from 'sequelize';

export default {
    async up(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.createTable('articles', {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            title: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            imageUrl: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            category: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            publishedAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            status: {
                type: DataTypes.ENUM('draft', 'published'),
                allowNull: false,
                defaultValue: 'draft',
            },
            isFeatured: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            slug: {
                type: DataTypes.STRING(255),
                allowNull: false,
                unique: true,
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
            },
        });

        await queryInterface.addIndex('articles', ['slug']);
        await queryInterface.addIndex('articles', ['status']);
        await queryInterface.addIndex('articles', ['category']);
        await queryInterface.addIndex('articles', ['publishedAt']);
        await queryInterface.addIndex('articles', ['isFeatured']);
    },

    async down(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.dropTable('articles');
    },
};
