'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Recipes','resultId', {
      type: Sequelize.INTEGER,
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
    await queryInterface.changeColumn('Recipes','resultId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Items', 
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
    await queryInterface.renameColumn('ItemRecipes', 'resultItem', 'recipeId');


    // Supprimer l'ancienne clé étrangère

    // Ajouter la nouvelle clé étrangère
    await queryInterface.addConstraint('ItemRecipes', {
      fields: ['recipeId'], // Nom de la colonne
      type: 'foreign key',
      name: 'ItemRecipes_recipe_fkey', // Nom de la contrainte
      references: {
        table: 'Recipes', // Nouvelle table cible
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
