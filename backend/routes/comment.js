import express from "express";
const router = express.Router();
import {
  addCommentService,
  getCommentsByBlogIdService,
  getAllCommentsService,
  deleteCommentsByBlogIdService,
} from "../service/commentServer.js";

// 添加评论（点击emoji）
router.post("/", async (req, res, next) => {
  try {
    const { blogId, emoji } = req.body;
    res.send(await addCommentService(blogId, emoji));
  } catch (error) {
    next(error);
  }
});

// 获取文章的所有评论统计
router.get("/blog/:blogId", async (req, res, next) => {
  try {
    const blogId = req.params.blogId;
    res.send(await getCommentsByBlogIdService(blogId));
  } catch (error) {
    next(error);
  }
});

// 获取所有文章的评论统计（后台管理用）
router.get("/all", async (req, res, next) => {
  try {
    res.send(await getAllCommentsService());
  } catch (error) {
    next(error);
  }
});

// 删除文章的所有评论
router.delete("/blog/:blogId", async (req, res, next) => {
  try {
    const blogId = req.params.blogId;
    res.send(await deleteCommentsByBlogIdService(blogId));
  } catch (error) {
    next(error);
  }
});

export default router;
