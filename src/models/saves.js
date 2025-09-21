import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "saves",
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "users",
          key: "user_id",
        },
      },
      image_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "images",
          key: "image_id",
        },
      },
      date_save: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "saves",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [
            { name: "user_id" },
            { name: "image_id" },
          ],
        },
        {
          name: "image_id",
          using: "BTREE",
          fields: [{ name: "image_id" }],
        },
      ],
    }
  );
};
