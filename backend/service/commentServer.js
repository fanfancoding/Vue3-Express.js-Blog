import { ValidationError } from "../utils/errors.js";
import { formatResponseData } from "../utils/tool.js";
import {
  incrementCommentCountDao,
  findCommentsByBlogIdDao,
  deleteCommentsByBlogIdDao,
  findAllCommentsDao,
} from "../dao/commentDao.js";
import { findBlogByIdDao } from "../dao/blogDao.js";

// 定义6个emoji表情
export const EMOJI_LIST = ["👍", "❤️", "😂", "😮", "😢", "😡"];

// 添加评论（点击emoji）
export async function addCommentService(blogId, emoji) {
  try {
    if (!blogId) {
      throw new ValidationError("文章ID不能为空");
    }
    if (!emoji) {
      throw new ValidationError("表情不能为空");
    }
    if (!EMOJI_LIST.includes(emoji)) {
      throw new ValidationError("不支持的表情");
    }

    // 检查文章是否存在
    const blog = await findBlogByIdDao(blogId);
    if (!blog) {
      throw new ValidationError("文章不存在");
    }

    // 增加评论数量
    const comment = await incrementCommentCountDao(blogId, emoji);

    // 更新文章的评论总数
    const totalCount = await findCommentsByBlogIdDao(blogId);
    const sum = totalCount.reduce((acc, item) => acc + item.count, 0);
    blog.commentNumber = sum;
    await blog.save();

    return formatResponseData(200, "评论成功", comment);
  } catch (error) {
    console.error("添加评论失败:", error);
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError("添加评论失败: " + (error.message || "未知错误"));
  }
}

// 获取文章的所有评论统计
export async function getCommentsByBlogIdService(blogId) {
  try {
    if (!blogId) {
      throw new ValidationError("文章ID不能为空");
    }

    const comments = await findCommentsByBlogIdDao(blogId);

    // 确保所有6个emoji都有数据，没有的返回0
    const commentMap = {};
    comments.forEach((item) => {
      commentMap[item.emoji] = item.count;
    });

    const result = EMOJI_LIST.map((emoji) => ({
      emoji,
      count: commentMap[emoji] || 0,
    }));

    return formatResponseData(200, "获取评论统计成功", result);
  } catch (error) {
    console.error("获取评论统计失败:", error);
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      "获取评论统计失败: " + (error.message || "未知错误")
    );
  }
}

// 获取所有文章的评论统计（后台管理用）
export async function getAllCommentsService() {
  try {
    const comments = await findAllCommentsDao();
    return formatResponseData(200, "获取所有评论统计成功", comments);
  } catch (error) {
    console.error("获取所有评论统计失败:", error);
    throw new ValidationError(
      "获取所有评论统计失败: " + (error.message || "未知错误")
    );
  }
}

// 删除文章的所有评论
export async function deleteCommentsByBlogIdService(blogId) {
  try {
    if (!blogId) {
      throw new ValidationError("文章ID不能为空");
    }
    await deleteCommentsByBlogIdDao(blogId);
    return formatResponseData(200, "删除评论成功", true);
  } catch (error) {
    console.error("删除评论失败:", error);
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError("删除评论失败: " + (error.message || "未知错误"));
  }
}
