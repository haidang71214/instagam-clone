import { DataTypes } from 'sequelize';

export default function(sequelize) {
  const User = sequelize.define('users', {
    user_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    pass_word: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    full_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    avartar: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    refresh_token: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    expried_code: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    face_app_id: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'users',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });

  // Định nghĩa phương thức getAll để lấy tất cả người dùng
  User.getAll = async function() {
    try {
      return await User.findAll(); // Sử dụng phương thức findAll để lấy tất cả người dùng
    } catch (error) {
      throw new Error('Error fetching users');
    }
  };

  return User;
}
