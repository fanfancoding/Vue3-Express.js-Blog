import { findBannerListDao, updateBannerListDao } from "../dao/bannerDao.js";
import { handleArrayResponseData } from "../utils/tool.js";
import { formatResponseData } from "../utils/tool.js";

export async function findBannerListService() {
  try {
    return formatResponseData(
      200,
      "获取banner列表成功",
      handleArrayResponseData(await findBannerListDao())
    );
  } catch (error) {
    console.error("获取banner列表失败:", error);
    throw error;
  }
}

// 更新banner列表Service
export async function updateBannerListService(bannerList) {
  try {
    return formatResponseData(
      200,
      "更新banner列表成功",
      handleArrayResponseData(await updateBannerListDao(bannerList))
    );
  } catch (error) {
    console.error("更新banner列表失败:", error);
    throw error;
  }
}
