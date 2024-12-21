'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    static associate(models) {
      // Un item appartient à une catégorie
      this.belongsTo(models.Category, { foreignKey: 'categoryId' });
      // Un item a plusieurs prix moyens
      this.hasMany(models.ItemsAveragePrice, { foreignKey: 'itemId' });
      // Un item peut être lié à plusieurs recettes
      this.belongsToMany(models.Recipe, {
        through: models.ItemRecipe,
        foreignKey: 'itemId',
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
