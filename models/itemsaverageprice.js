'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ItemsAveragePrice extends Model {
    static associate(models) {
      // Un prix moyen appartient à un item
      this.belongsTo(models.Item, { foreignKey: 'itemId' });
    }
  }
  ItemsAveragePrice.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement:true,
        allowNull: false,
      },
      averagePrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      itemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'ItemsAveragePrice',
      tableName: 'ItemsAveragePrice',
      timestamps: true,
    }
  );
  return ItemsAveragePrice;
};
