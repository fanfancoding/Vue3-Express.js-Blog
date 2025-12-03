import { DataTypes } from "sequelize";
import { sequelize } from "../dbConnect.js";

// 定义留言板模型
export const MessageBoardModel = sequelize.define(
  "MessageBoard",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nickname: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "昵称",
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "邮箱（可选）",
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "留言内容",
    },
    avatar: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "",
      comment: "头像URL（可选）",
    },
    ip: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "IP地址",
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: "状态：0-已删除，1-待审核，2-已发布（审核通过）",
    },
    reply: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "管理员回复",
    },
    replyTime: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "回复时间",
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: "createDate",
    updatedAt: "updateDate",
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
  }
);
