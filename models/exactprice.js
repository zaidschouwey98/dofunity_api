'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ExactPrice extends Model {
    static associate(models) {
      // Relation avec Item
      this.belongsTo(models.Item, { foreignKey: 'itemId', as: 'item' });
    }
  }

  ExactPrice.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      itemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      exactPrice: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'ExactPrice',
      tableName: 'ExactPrices',
      timestamps: true,
    }
  );

  return ExactPrice;
};