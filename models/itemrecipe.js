'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ItemRecipe extends Model {
    static associate(models) {
      // Relation avec Items (en tant qu'ingrédient)
      this.belongsTo(models.Item, { as: 'Ingredient', foreignKey: 'itemId' });

      // Relation avec Recipes (l'objet lié à une recette)
      this.belongsTo(models.Recipe, { foreignKey: 'recipeId' });
    }
  }
  ItemRecipe.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      recipeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Recipes',
          key: 'id',
        },
      },
      itemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Items',
          key: 'id',
        },
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
