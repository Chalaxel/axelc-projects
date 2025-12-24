'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
    async up(queryInterface) {
        await queryInterface.changeColumn('articles', 'imageUrl', {
            type: DataTypes.TEXT,
            allowNull: true,
        });
    },

    async down(queryInterface) {
        await queryInterface.changeColumn('articles', 'imageUrl', {
            type: DataTypes.STRING(500),
            allowNull: true,
        });
    },
};
