'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BreakAttempt extends Model {
    static associate(models) {
      this.belongsTo(models.Item, { foreignKey: 'itemId', as: 'item' });
    }
  }

  BreakAttempt.init(
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
        unique: true,
      },
      itemBroken: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      attemptedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      observedCoeff: {
        type: DataTypes.DECIMAL(10, 2),
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
      modelName: 'BreakAttempt',
      tableName: 'BreakAttempts',
      timestamps: true,
    }
  );

  return BreakAttempt;
};
