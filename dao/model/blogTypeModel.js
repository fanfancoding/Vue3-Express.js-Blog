import { DataTypes } from "sequelize";
import { sequelize } from "../dbConnect.js";

// 定义博客分类模型
export const BlogTypeModel = sequelize.define(
  "BlogType",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    articleCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    order: {
      type: DataTypes.INTEGER,
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
