import { DataTypes } from "sequelize";
import initChat from "./chat.js";
import initComments from "./comments.js";
import initImages from "./images.js";
import initSaves from "./saves.js";
import initUsers from "./users.js";

function initModels(sequelize) {
  const chat = initChat(sequelize, DataTypes);
  const comments = initComments(sequelize, DataTypes);
  const images = initImages(sequelize, DataTypes);
  const saves = initSaves(sequelize, DataTypes);
  const users = initUsers(sequelize, DataTypes);

  // Define relationships
  images.belongsToMany(users, { as: 'user_id_users', through: saves, foreignKey: "image_id", otherKey: "user_id" });
  users.belongsToMany(images, { as: 'image_id_images', through: saves, foreignKey: "user_id", otherKey: "image_id" });

  comments.belongsTo(images, { as: "image", foreignKey: "image_id" });
  images.hasMany(comments, { as: "comments", foreignKey: "image_id" });

  saves.belongsTo(images, { as: "image", foreignKey: "image_id" });
  images.hasMany(saves, { as: "saves", foreignKey: "image_id" });

  comments.belongsTo(users, { as: "user", foreignKey: "user_id" });
  users.hasMany(comments, { as: "comments", foreignKey: "user_id" });

  images.belongsTo(users, { as: "user", foreignKey: "user_id" });
  users.hasMany(images, { as: "images", foreignKey: "user_id" });

  saves.belongsTo(users, { as: "user", foreignKey: "user_id" });
  users.hasMany(saves, { as: "saves", foreignKey: "user_id" });

  return {
    chat,
    comments,
    images,
    saves,
    users,
  };
}

// Export ES6 module
export default initModels;
