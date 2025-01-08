'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Recipe extends Model {
    static associate(models) {
      // Une recette peut inclure plusieurs objets
      this.belongsToMany(models.Item, {
        through: models.ItemRecipe,
        foreignKey: 'recipeId',
      });
      
      this.belongsTo(models.Item, {
        as: 'Result',
        foreignKey: 'resultId',
      });
      this.hasMany(models.ItemRecipe, { foreignKey: 'recipeId', as: 'Ingredients' });

    }
  }
  Recipe.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      resultId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Items',
          key: 'id',
        },
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
