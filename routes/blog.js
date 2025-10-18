import express from "express";
const router = express.Router();
import {
  addBlogService,
  findBlogByPageService,
  findBlogByIdService,
  updateBlogService,
  deleteBlogService,
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
router.get("/:id", async (req, res, next) => {
  try {
    const reqHeader = req.headers;
    res.send(await findBlogByIdService(req.params.id, reqHeader.authorization));
  } catch (error) {
    next(error);
  }
});

// 添加一个博客
router.post("/", async (req, res, next) => {
  try {
    res.send(await addBlogService(req.body));
  } catch (error) {
    next(error);
  }
});

// 修改其中一个博客
router.put("/:id", async (req, res, next) => {
  try {
    res.send(await updateBlogService(req.params.id, req.body));
  } catch (error) {
    next(error);
  }
});

// 删除其中一个博客
router.delete("/:id", async (req, res, next) => {
  try {
    res.send(await deleteBlogService(req.params.id));
  } catch (error) {
    next(error);
  }
});

export default router;
