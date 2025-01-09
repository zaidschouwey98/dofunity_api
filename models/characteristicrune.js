'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CharacteristicRune extends Model {
    static associate(models) {
      // Relier une characteristic à plusieurs runes
      this.belongsTo(models.Characteristic, {
        foreignKey: 'characteristicId',
        as: 'characteristic',
      });

      // Relier une rune (item) à une characteristic
      this.belongsTo(models.Item, {
        foreignKey: 'runeId',
        as: 'rune',
      });
    }
  }

  CharacteristicRune.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      characteristicId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      runeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      density: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'CharacteristicRune',
      tableName: 'CharacteristicRunes',
      timestamps: true,
    }
  );

  return CharacteristicRune;
};
