import { DataTypes } from "sequelize";
import { sequelize } from "../dbConnect.js";

// 定义管理员模型
export const adminModel = sequelize.define(
  "Admin",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    loginId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    loginPwd: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    // 禁用 Sequelize 自动添加的表名后缀
    freezeTableName: true,
    // 禁用 Sequelize 自动添加的 createdAt 和 updatedAt 字段
    createdAt: false,
    updatedAt: false,
  }
);
