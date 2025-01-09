'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ItemCharacteristic extends Model {
    static associate(models) {
      // Relation avec Item
      this.belongsTo(models.Item, { foreignKey: 'itemId', as: 'item' });

      // Relation avec Characteristic
      this.belongsTo(models.Characteristic, { foreignKey: 'characteristicId', as: 'characteristic' });
      this.hasMany(models.ItemCharacteristic, { foreignKey: 'characteristicId', as: 'items' });

    }
  }

  ItemCharacteristic.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      from: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      to: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'ItemCharacteristic',
      tableName: 'ItemCharacteristics',
      timestamps: true,
    }
  );

  return ItemCharacteristic;
};
