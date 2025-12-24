'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
    async up(queryInterface) {
        await queryInterface.addColumn('pages', 'metadata', {
            type: DataTypes.TEXT,
            allowNull: true,
        });
    },

    async down(queryInterface) {
        await queryInterface.removeColumn('pages', 'metadata');
    },
};
