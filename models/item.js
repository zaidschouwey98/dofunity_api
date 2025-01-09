'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    static associate(models) {
      this.hasMany(models.ItemCharacteristic, { foreignKey: 'itemId', as: 'characteristics' });

      // Un item appartient à une catégorie
      this.belongsTo(models.Category, { foreignKey: 'categoryId', as:'category' });
      // Un item a plusieurs prix moyens
      this.hasMany(models.ItemsAveragePrice, { foreignKey: 'itemId',as: 'averagePrices' });
      this.hasMany(models.ExactPrice, { foreignKey: 'itemId', as: 'exactPrices' });
      // Un item peut être lié à plusieurs recettes
      // Un objet peut être inclus dans plusieurs recettes
      this.belongsToMany(models.Recipe, {
        through: models.ItemRecipe,
        foreignKey: 'itemId',
      });
      this.hasMany(models.CharacteristicRune, {
        foreignKey: 'runeId',
        as: 'runeCharacteristics',
      });

      // Un objet peut être le résultat d'une recette
      this.hasMany(models.Recipe, {
        as: 'ResultRecipes',
        foreignKey: 'resultId',
      });
    }
  }
  Item.init(
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
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      lvl:{
        type:DataTypes.INTEGER,
        allowNull:true,
      },
    },
    {
      sequelize,
      modelName: 'Item',
      tableName: 'Items',
      timestamps: false,
    }
  );
  return Item;
};
