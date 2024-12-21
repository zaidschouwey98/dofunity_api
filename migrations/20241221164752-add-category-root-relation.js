'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Categories','rootCategoryId', {
        type: Sequelize.INTEGER,
        references: {
          model: 'RootCategories', // Relation avec Categories
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropColumn('rootCategoryId');
  }
};
