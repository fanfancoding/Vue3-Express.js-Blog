import express from "express";
const router = express.Router();

import {
  findBannerListService,
  updateBannerListService,
} from "../service/bannerServer.js";

// 获取banner列表
router.get("/", async (req, res, next) => {
  try {
    const bannerList = await findBannerListService();
    res.send(bannerList);
  } catch (error) {
    next(error);
  }
});

// 修改banner列表
router.post("/", async (req, res, next) => {
  try {
    const bannerList = await updateBannerListService(req.body);
    res.send(bannerList);
  } catch (error) {
    next(error);
  }
});

export default router;
