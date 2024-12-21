'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ItemRecipe extends Model {
    static associate(models) {
      // Table de jointure entre Item et Recipe
      this.belongsTo(models.Item, { foreignKey: 'itemId' });
      this.belongsTo(models.Recipe, { foreignKey: 'recipeId' });
    }
  }
  ItemRecipe.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      itemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      recipeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'ItemRecipe',
      tableName: 'ItemRecipes',
      timestamps: true,
    }
  );
  return ItemRecipe;
};
