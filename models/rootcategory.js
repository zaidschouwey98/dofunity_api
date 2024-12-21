'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RootCategory extends Model {
    static associate(models) {
      // Une root catégorie peut avoir plusieurs catégories
      this.hasMany(models.Category, { foreignKey: 'rootCategoryId' });
    }
  }
  RootCategory.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'RootCategory',
      tableName: 'RootCategories',
      timestamps: false,
    }
  );
  return RootCategory;
};
