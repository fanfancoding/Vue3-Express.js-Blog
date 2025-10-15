import { DataTypes } from "sequelize";
import { sequelize } from "../dbConnect.js";

// 定义博客模型
export const BlogModel = sequelize.define(
  "Blog",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    toc: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    htmlContent: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    thumb: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    scanNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    commentNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "BlogType",
        key: "id",
      },
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
