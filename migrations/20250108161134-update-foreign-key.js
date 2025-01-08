'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Supprimer l'ancienne clé étrangère
    await queryInterface.removeConstraint('ItemRecipes', 'ItemRecipes_ibfk_2');

    // Ajouter la nouvelle clé étrangère
    await queryInterface.addConstraint('ItemRecipes', {
      fields: ['resultItem'], // Nom de la colonne
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
