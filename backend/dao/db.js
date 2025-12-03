// 该文件负责对数据库进行初始化操作
import { sequelize } from "./dbConnect.js";
import { adminModel } from "./model/adminModel.js";
import { bannerModel } from "./model/bannerModel.js";
import { BlogTypeModel } from "./model/blogTypeModel.js";
import { BlogModel } from "./model/blogModel.js";
import { CommentModel } from "./model/commentModel.js";
import { MessageBoardModel } from "./model/messageBoardModel.js";

import md5 from "md5";

// 初始化数据库
export async function initDb() {
  try {
    // 一对多关系：一个博客分类可以有多篇博客
    BlogTypeModel.hasMany(BlogModel, {
      foreignKey: "categoryId",
      targetKey: "id",
    });

    // 多对一关系：一篇博客属于一个博客分类
    BlogModel.belongsTo(BlogTypeModel, {
      foreignKey: "categoryId",
      targetKey: "id",
      as: "blogType",
    });

    // 一对多关系：一篇博客可以有多个评论（不同emoji）
    BlogModel.hasMany(CommentModel, {
      foreignKey: "blogId",
      targetKey: "id",
      as: "comments",
    });

    // 多对一关系：一个评论属于一篇博客
    CommentModel.belongsTo(BlogModel, {
      foreignKey: "blogId",
      targetKey: "id",
      as: "blog",
    });

    // 同步数据库模型
    await sequelize.sync({ alter: true });
    console.log("sql init success");

    // 强制将评论表转换为支持 emoji 的字符集和排序规则
    try {
      await sequelize.query(
        "ALTER TABLE `Comment` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
      );
    } catch (err) {
      // 如果表已是 utf8mb4 或不支持转换，记录警告并继续
      console.warn("Comment 表字符集/排序规则转换跳过:", err?.message || err);
    }

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
            articleCount: 0,
            order: 1,
          },
          {
            name: "后端",
            articleCount: 0,
            order: 2,
          },
          {
            name: "数据库",
            articleCount: 0,
            order: 3,
          },
        ]);
  } catch (error) {
    console.error("数据库初始化失败:", error);
  }
}
