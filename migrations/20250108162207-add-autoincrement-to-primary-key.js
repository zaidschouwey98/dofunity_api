'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('ItemRecipes', 'id', {
      type: Sequelize.INTEGER,
      autoIncrement: true, // Activer l'auto-increment
      allowNull: false, // Empêcher les valeurs nulles
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
