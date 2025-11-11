import { DataTypes } from "sequelize";
import { sequelize } from "../dbConnect.js";

// 定义评论模型 - 存储每个文章每个emoji的评论数量
export const CommentModel = sequelize.define(
  "Comment",
  {
    blogId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Blog",
        key: "id",
      },
    },
    emoji: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "emoji表情，如：👍, ❤️, 😂, 😮, 😢, 😡",
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "该emoji的评论数量",
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
