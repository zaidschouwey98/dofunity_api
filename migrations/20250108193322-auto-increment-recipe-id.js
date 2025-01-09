'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Supprimer la contrainte de clé étrangère
    await queryInterface.removeConstraint('ItemRecipes', 'ItemRecipes_itemId_fkey');

    // Modifier la colonne 'id' pour ajouter AUTO_INCREMENT
    await queryInterface.changeColumn('Recipes', 'id', {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
    });

    // Restaurer la contrainte de clé étrangère
    await queryInterface.addConstraint('ItemRecipes', {
      fields: ['recipeId'],
      type: 'foreign key',
      name: 'ItemRecipes_Recipe_fkey',
      references: {
        table: 'Recipes',
        field: 'id',
      },
      onDelete: 'CASCADE',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Recipes', 'id', {
      type: Sequelize.INTEGER,
      allowNull: false,

    });
  }
};
