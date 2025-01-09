'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Characteristic extends Model {
    static associate(models) {
      // Définir les relations ici si nécessaire
      this.hasMany(models.CharacteristicRune, {
        foreignKey: 'characteristicId',
        as: 'runes',
      });
    }
  }

  Characteristic.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      scaleFormulaId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      upgradable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Characteristic',
      tableName: 'Characteristics',
      timestamps: true,
    }
  );

  return Characteristic;
};
