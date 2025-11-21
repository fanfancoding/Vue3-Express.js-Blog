import { CommentModel } from "./model/commentModel.js";
import { BlogModel } from "./model/blogModel.js";

// 根据文章ID和emoji获取评论
export async function findCommentByBlogIdAndEmojiDao(blogId, emoji) {
  // 先获取该 blogId 的所有评论，然后在内存中精确匹配 emoji
  // 这样可以避免数据库字符集/排序规则导致的匹配问题
  const allComments = await CommentModel.findAll({
    where: { blogId },
  });

  // 在内存中精确匹配 emoji（使用严格相等比较）
  const comment = allComments.find((c) => c.emoji === emoji);

  return comment || null;
}

// 创建评论记录
export async function createCommentDao(blogId, emoji) {
  const { dataValues } = await CommentModel.create({
    blogId,
    emoji,
    count: 1,
  });
  return dataValues;
}

// 增加评论数量
export async function incrementCommentCountDao(blogId, emoji) {
  // 先获取该 blogId 的所有评论
  const allComments = await CommentModel.findAll({
    where: { blogId },
  });

  // 在内存中精确匹配 emoji（使用严格相等比较）
  const comment = allComments.find((c) => c.emoji === emoji);

  if (comment) {
    // 如果找到，增加计数
    comment.count++;
    await comment.save();
    return comment.dataValues;
  } else {
    // 如果没找到，创建新记录
    return await createCommentDao(blogId, emoji);
  }
}

// 根据文章ID获取所有评论统计
export async function findCommentsByBlogIdDao(blogId) {
  return await CommentModel.findAll({
    where: {
      blogId,
    },
    order: [["count", "DESC"]],
  });
}

// 根据文章ID删除所有评论
export async function deleteCommentsByBlogIdDao(blogId) {
  return await CommentModel.destroy({
    where: {
      blogId,
    },
  });
}

// 获取所有文章的评论统计（用于后台管理）
export async function findAllCommentsDao() {
  return await CommentModel.findAll({
    include: [
      {
        model: BlogModel,
        as: "blog",
        attributes: ["id", "title"],
      },
    ],
    order: [
      ["blogId", "ASC"],
      ["count", "DESC"],
    ],
  });
}

// 根据文章ID获取评论总数
export async function getTotalCommentCountByBlogIdDao(blogId) {
  const comments = await CommentModel.findAll({
    where: {
      blogId,
    },
  });
  return comments.reduce((sum, item) => sum + item.count, 0);
}
