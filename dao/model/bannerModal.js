import { DataTypes } from "sequelize";
import { sequelize } from "../dbConnect.js";

// 定义轮播图模型
export const BannerModal = sequelize.define(
  "Banner",
  {
    midImg: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bigImg: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descrption: {
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
