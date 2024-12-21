'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      // Une catégorie peut avoir plusieurs items
      this.hasMany(models.Item, { foreignKey: 'categoryId' });

      this.belongsTo(models.RootCategory, { foreignKey: 'rootCategoryId' });
    }
  }
  Category.init(
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
      rootCategoryId:{
        type: DataTypes.INTEGER,
        allowNull:true,
      }
    },
    {
      sequelize,
      modelName: 'Category',
      tableName: 'Categories',
      timestamps: false,
    }
  );
  return Category;
};
