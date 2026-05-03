'use strict';

/** @param {import('sequelize').QueryInterface} queryInterface */
/** @param {import('sequelize').Sequelize} Sequelize */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Items', 'xpPerUnit', {
      type: Sequelize.DECIMAL(24, 12),
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Items', 'xpPerUnit');
  },
};
