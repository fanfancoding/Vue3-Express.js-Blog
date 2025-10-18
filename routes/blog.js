import express from "express";
const router = express.Router();
import {
  addBlogService,
  findBlogByPageService,
} from "../service/blogServer.js";

// 分页获取博客列表
router.get("/", async (req, res, next) => {
  try {
    res.send(await findBlogByPageService(req.query));
  } catch (error) {
    next(error);
  }
});

// 获取其中一个博客
router.get("/:id", async (req, res, next) => {});

// 添加一个博客
router.post("/", async (req, res, next) => {
  try {
    res.send(await addBlogService(req.body));
  } catch (error) {
    next(error);
  }
});

// 修改其中一个博客
router.put("/:id", async (req, res, next) => {});

// 删除其中一个博客
router.delete("/:id", async (req, res, next) => {});

export default router;
