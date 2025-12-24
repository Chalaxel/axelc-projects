const { DataTypes } = require('sequelize');

const PRODUCT_VARIANTS = 'product_variants';
const PRODUCT_VARIANT_IMAGES = 'product_variant_images';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Créer la nouvelle table
    await queryInterface.createTable(PRODUCT_VARIANT_IMAGES, {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      variantId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true, // Relation 1:1
        references: {
          model: PRODUCT_VARIANTS,
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      imageBase64: {
        type: DataTypes.TEXT,
        allowNull: true,
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

    // 2. Déplacer les données existantes
    await queryInterface.sequelize.query(`
            INSERT INTO ${PRODUCT_VARIANT_IMAGES} ("id", "variantId", "imageBase64", "createdAt", "updatedAt")
            SELECT 
                gen_random_uuid(), 
                id, 
                "imageBase64", 
                now(), 
                now()
            FROM ${PRODUCT_VARIANTS}
            WHERE "imageBase64" IS NOT NULL
        `);

    // 3. Supprimer la colonne de la table originale
    await queryInterface.removeColumn(PRODUCT_VARIANTS, 'imageBase64');
  },

  async down(queryInterface, Sequelize) {
    // 1. Rajouter la colonne
    await queryInterface.addColumn(PRODUCT_VARIANTS, 'imageBase64', {
      type: DataTypes.TEXT,
      allowNull: true,
    });

    // 2. Remettre les données
    await queryInterface.sequelize.query(`
            UPDATE ${PRODUCT_VARIANTS}
            SET "imageBase64" = i."imageBase64"
            FROM ${PRODUCT_VARIANT_IMAGES} i
            WHERE ${PRODUCT_VARIANTS}.id = i."variantId"
        `);

    // 3. Supprimer la nouvelle table
    await queryInterface.dropTable(PRODUCT_VARIANT_IMAGES);
  },
};
