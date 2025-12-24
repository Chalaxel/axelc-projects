import { QueryInterface } from 'sequelize';

module.exports = {
    async up(queryInterface: QueryInterface) {
        // Ajouter la valeur par défaut UUID pour les catégories
        await queryInterface.sequelize.query(`
            ALTER TABLE categories 
            ALTER COLUMN id SET DEFAULT gen_random_uuid();
        `);

        // Ajouter la valeur par défaut UUID pour les produits
        await queryInterface.sequelize.query(`
            ALTER TABLE products 
            ALTER COLUMN id SET DEFAULT gen_random_uuid();
        `);

        // ProductVariants a déjà la valeur par défaut, mais on peut la vérifier/ajouter
        await queryInterface.sequelize.query(`
            ALTER TABLE product_variants 
            ALTER COLUMN id SET DEFAULT gen_random_uuid();
        `);
    },

    async down(queryInterface: QueryInterface) {
        // Retirer les valeurs par défaut
        await queryInterface.sequelize.query(`
            ALTER TABLE categories 
            ALTER COLUMN id DROP DEFAULT;
        `);

        await queryInterface.sequelize.query(`
            ALTER TABLE products 
            ALTER COLUMN id DROP DEFAULT;
        `);

        await queryInterface.sequelize.query(`
            ALTER TABLE product_variants 
            ALTER COLUMN id DROP DEFAULT;
        `);
    },
};
