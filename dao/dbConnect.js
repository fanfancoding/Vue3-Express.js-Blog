// 数据库连接模块
import Sequelize from "sequelize";

// 创建数据库连接 三个参数 数据库名称 用户名 密码
export const sequelize = new Sequelize(
  process.env.DB_NAME || "mysite",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "fanfanxx",
  {
    host: process.env.DB_HOST || "localhost",
    // 数据库类型
    dialect: "mysql",
    logging: false,
  }
);

// 测试数据库连接
export async function testDbConnection() {
  try {
    await sequelize.authenticate();
    console.log("db connect success");
  } catch (error) {
    console.error("数据库连接失败:", error);
  }
}
