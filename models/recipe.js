'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Recipe extends Model {
    static associate(models) {
      // Une recette peut inclure plusieurs items
      this.belongsToMany(models.Item, {
        through: models.ItemRecipe,
        foreignKey: 'recipeId',
      });
    }
  }
  Recipe.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Recipe',
      tableName: 'Recipes',
      timestamps: false,
    }
  );
  return Recipe;
};
