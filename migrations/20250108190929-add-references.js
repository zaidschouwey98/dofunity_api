'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('ItemRecipes', {
      fields: ['itemId'], // Nom de la colonne
      type: 'foreign key',
      name: 'ItemRecipes_itemId_fkey', // Nom de la contrainte
      references: {
        table: 'Items', // Nouvelle table cible
        field: 'id', // Colonne cible
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
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
