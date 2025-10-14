// 该文件负责对数据库进行初始化操作
import { sequelize } from "./dbConnect.js";
import { AdminModal } from "./model/adminModal.js";
import { BannerModal } from "./model/bannerModal.js";
import md5 from "md5";

// 初始化数据库
export async function initDb() {
  try {
    // 同步数据库模型
    await sequelize.sync({ alert: true });
    console.log("sql init success");
    (await AdminModal.count())
      ? () => {}
      : await AdminModal.create({
          name: "admin",
          loginId: "admin",
          loginPwd: md5("123456"),
        });
    (await BannerModal.count())
      ? () => {}
      : await BannerModal.bulkCreate([
          {
            midImg:
              "https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png",
            bigImg:
              "https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png",
            title: "banner1",
            descrption: "banner1描述",
          },
        ]);
  } catch (error) {
    console.error("数据库初始化失败:", error);
  }
}
