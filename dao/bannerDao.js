import { BannerModal } from "./model/bannerModal.js";

// 获取banner列表Dao
export async function findBannerListDao() {
  try {
    return await BannerModal.findAll();
  } catch (error) {
    console.error("获取banner列表失败:", error);
    throw error;
  }
}

// 更新banner列表Dao
export async function updateBannerListDao(bannerList) {
  try {
    // 删除表记录
    await BannerModal.destroy({
      truncate: true,
    });
    // 重新写入
    await BannerModal.bulkCreate(bannerList);
    return BannerModal.findAll();
  } catch (error) {
    console.error("更新banner列表失败:", error);
    throw error;
  }
}
