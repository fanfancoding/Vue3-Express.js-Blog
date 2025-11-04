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
      allowNull: true, // 允许为空
      defaultValue: "",
    },
    htmlContent: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    markdownContent: {
      type: DataTypes.TEXT,
      allowNull: true, // 允许为空，因为旧文章可能没有 Markdown
      defaultValue: "",
    },
    thumb: {
      type: DataTypes.STRING,
      allowNull: true, // 允许为空
      defaultValue: "", // 默认值为空字符串
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
