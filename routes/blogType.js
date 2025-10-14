import express from "express";
const router = express.Router();
import {
  findBlogTypeListService,
  findBlogTypeByIdService,
  addBlogTypeService,
  updateBlogTypeService,
  deleteBlogTypeService,
} from "../service/blogTypeServer.js";

// 获取博客分类列表
router.get("/", async (req, res, next) => {
  try {
    res.send(await findBlogTypeListService());
  } catch (error) {
    next(error);
  }
});

// 获取其中一个博客分类
router.get("/:id", async (req, res, next) => {
  try {
    res.send(await findBlogTypeByIdService(req.params.id));
  } catch (error) {
    next(error);
  }
});

// 添加博客分类
router.post("/", async (req, res, next) => {
  try {
    res.send(await addBlogTypeService(req.body));
  } catch (error) {
    next(error);
  }
});

// 修改博客分类
router.put("/:id", async (req, res, next) => {
  try {
    res.send(await updateBlogTypeService(req.params.id, req.body));
  } catch (error) {
    next(error);
  }
});

// 删除博客分类
router.delete("/:id", async (req, res, next) => {
  try {
    res.send(await deleteBlogTypeService(req.params.id));
  } catch (error) {
    next(error);
  }
});

export default router;
