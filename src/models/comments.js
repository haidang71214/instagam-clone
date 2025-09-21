import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "comments",
    {
      comment_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "user_id",
        },
      },
      image_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "images",
          key: "image_id",
        },
      },
      comment_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      noi_dung: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "comments",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "comment_id" }],
        },
        {
          name: "user_id",
          using: "BTREE",
          fields: [{ name: "user_id" }],
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
