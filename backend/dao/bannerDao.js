import { bannerModel } from "./model/bannerModel.js";

// 获取banner列表Dao
export async function findBannerListDao() {
  try {
    return await bannerModel.findAll();
  } catch (error) {
    console.error("获取banner列表失败:", error);
    throw error;
  }
}

// 更新banner列表Dao
export async function updateBannerListDao(bannerList) {
  try {
    // 删除表记录
    await bannerModel.destroy({
      truncate: true,
    });
    // 重新写入
    await bannerModel.bulkCreate(bannerList);
    return bannerModel.findAll();
  } catch (error) {
    console.error("更新banner列表失败:", error);
    throw error;
  }
}
