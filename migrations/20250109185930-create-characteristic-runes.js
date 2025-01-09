'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('CharacteristicRunes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      characteristicId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Characteristics', // Nom de la table des characteristics
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      runeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Items', // Nom de la table des items (runes)
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      density: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('CharacteristicRunes');

  }
};
