// 该文件负责对数据库进行初始化操作
import { sequelize } from "./dbConnect.js";
import { adminModel } from "./model/adminModel.js";
import { bannerModel } from "./model/bannerModel.js";
import { BlogTypeModel } from "./model/BlogTypeModel.js";
import { BlogModel } from "./model/blogModel.js";

import md5 from "md5";

// 初始化数据库
export async function initDb() {
  try {
    // 同步数据库模型
    await sequelize.sync({ alert: true });
    console.log("sql init success");
    // 初始化管理员账号
    (await adminModel.count())
      ? () => {}
      : await adminModel.create({
          name: "admin",
          loginId: "admin",
          loginPwd: md5("123456"),
        });
    // 初始化轮播图
    (await bannerModel.count())
      ? () => {}
      : await bannerModel.bulkCreate([
          {
            midImg:
              "https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png",
            bigImg:
              "https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png",
            title: "banner1",
            descrption: "banner1描述",
          },
        ]);
    // 初始化博客分类
    (await BlogTypeModel.count())
      ? () => {}
      : await BlogTypeModel.bulkCreate([
          {
            name: "前端",
            description: "前端相关博客",
          },
          {
            name: "后端",
            description: "后端相关博客",
          },
          {
            name: "数据库",
            description: "数据库相关博客",
          },
        ]);
  } catch (error) {
    console.error("数据库初始化失败:", error);
  }
}
