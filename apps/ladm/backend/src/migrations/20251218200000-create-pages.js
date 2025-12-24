'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
    async up(queryInterface) {
        await queryInterface.createTable('pages', {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            slug: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true,
            },
            title: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
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

        await queryInterface.addIndex('pages', ['slug']);
    },

    async down(queryInterface) {
        await queryInterface.dropTable('pages');
    },
};
