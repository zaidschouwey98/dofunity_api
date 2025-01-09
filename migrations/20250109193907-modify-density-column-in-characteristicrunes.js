'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('CharacteristicRunes', 'density', {
      type: Sequelize.FLOAT,
      allowNull: false, // Assurez-vous que tous les enregistrements ont une valeur
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('CharacteristicRunes', 'density', {
      type: Sequelize.INTEGER, // Remettre à INTEGER (ancienne configuration)
      allowNull: false,
    });
  }
};
