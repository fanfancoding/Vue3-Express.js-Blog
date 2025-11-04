// 扩展验证规则
import validate from "validate.js";
import { BlogTypeModel } from "../dao/model/blogTypeModel.js";
import { ValidationError } from "../utils/errors.js";
import {
  incrementBlogCountDao,
  findBlogTypeByIdDao,
} from "../dao/blogTypeDao.js";
import { formatResponseData, handleArrayResponseData } from "../utils/tool.js";
import {
  addBlogDao,
  updateBlogDao,
  findBlogByPageDao,
  findBlogByIdDao,
  deleteBlogDao,
} from "../dao/blogDao.js";
import MarkdownIt from "markdown-it";

// 初始化 Markdown-it
const md = new MarkdownIt({
  html: true, // 允许 HTML 标签
  linkify: true, // 自动将 URL 转为链接
  typographer: true, // 优化排版
});

validate.validators.categoryIdIsExist = async function (value) {
  const categoryId = value;
  console.log("验证categoryId:", categoryId);
  // 检查 categoryId 是否存在于数据库中
  const category = await BlogTypeModel.findByPk(categoryId);
  console.log("查询到的分类:", category);
  return category ? null : "分类不存在";
};

// 添加博客
export async function addBlogService(blogInfo) {
  try {
    console.log("接收到的博客信息:", JSON.stringify(blogInfo, null, 2));

    // 检查 Markdown 内容是否存在
    if (!blogInfo.markdownContent || !blogInfo.markdownContent.trim()) {
      console.error("Markdown 内容为空");
      throw new ValidationError("文章内容不能为空");
    }

    // 保存原始的 markdownContent
    const originalMarkdownContent = blogInfo.markdownContent;

    // 将 Markdown 转换为 HTML
    try {
      blogInfo.htmlContent = md.render(blogInfo.markdownContent);
      console.log(
        "Markdown 转换成功，HTML 长度:",
        blogInfo.htmlContent.length,
        "内容预览:",
        blogInfo.htmlContent.substring(0, 100)
      );
    } catch (error) {
      console.error("Markdown 转换失败:", error);
      throw new ValidationError("Markdown 转换失败: " + error.message);
    }

    // 恢复 markdownContent
    blogInfo.markdownContent = originalMarkdownContent;

    // 初始化新文章的其他信息
    blogInfo.scanNumber = blogInfo.scanNumber || 0;
    blogInfo.commentNumber = blogInfo.commentNumber || 0;
    blogInfo.markdownContent = blogInfo.markdownContent || "";

    // 处理 thumb 字段：如果为空，设置默认值
    if (!blogInfo.thumb || blogInfo.thumb.trim() === "") {
      blogInfo.thumb = ""; // 设置为空字符串，数据库允许为空
    }

    // 处理 createDate 字段：如果是时间戳，转换为字符串
    // 注意：验证规则要求是整数，所以先验证，再转换
    if (blogInfo.createDate && typeof blogInfo.createDate === "number") {
      // 保持数字类型用于验证，验证后再转换
      const createDateNum = blogInfo.createDate;
      blogInfo.createDate = String(createDateNum);
    } else if (!blogInfo.createDate) {
      blogInfo.createDate = String(Date.now());
    }

    // 定义验证规则
    const blogRule = {
      title: {
        presence: {
          allowEmpty: false,
        },
        type: "string",
      },
      description: {
        presence: {
          allowEmpty: true,
        },
        type: "string",
      },
      htmlContent: {
        presence: {
          allowEmpty: false,
        },
        type: "string",
      },
      thumb: {
        presence: {
          allowEmpty: true,
        },
        type: "string",
      },
      createDate: {
        presence: {
          allowEmpty: false,
        },
        type: "string", // 修改为字符串类型，因为数据库中存储的是字符串
      },
      categoryId: {
        presence: true,
        numericality: {
          onlyInteger: true,
          greaterThan: 0,
        },
        categoryIdIsExist: true,
      },
    };

    // 验证博客信息
    console.log("开始验证博客信息，准备验证的数据:", {
      title: blogInfo.title,
      description: blogInfo.description,
      categoryId: blogInfo.categoryId,
      thumb: blogInfo.thumb,
      createDate: blogInfo.createDate,
      createDateType: typeof blogInfo.createDate,
      htmlContentLength: blogInfo.htmlContent?.length,
      markdownContentLength: blogInfo.markdownContent?.length,
    });

    // 扩展验证操作 使用异步验证
    try {
      await validate.async(blogInfo, blogRule);
      console.log("验证通过，开始添加博客");
    } catch (validationError) {
      console.error("验证失败:", validationError);
      // validate.js 返回的错误是一个对象，包含字段和错误消息
      const errorMessages = Object.entries(validationError)
        .map(([field, errors]) => `${field}: ${errors.join(", ")}`)
        .join("; ");
      throw new ValidationError(`字段验证失败: ${errorMessages}`);
    }

    // 验证通过，添加博客
    console.log("准备插入数据库的数据:", {
      title: blogInfo.title,
      description: blogInfo.description?.substring(0, 50),
      categoryId: blogInfo.categoryId,
      thumb: blogInfo.thumb,
      createDate: blogInfo.createDate,
      scanNumber: blogInfo.scanNumber,
      commentNumber: blogInfo.commentNumber,
    });

    const data = await addBlogDao(blogInfo);
    console.log("博客添加成功，返回数据:", data.id);

    // 文章新增 文章分类关联
    await incrementBlogCountDao(blogInfo.categoryId);
    return formatResponseData(200, "博客新增成功", data);
  } catch (error) {
    console.error("添加博客失败，错误类型:", error.constructor.name);
    console.error("添加博客失败，详细错误:", error);
    console.error("错误堆栈:", error.stack);

    if (error instanceof ValidationError) {
      throw error;
    }

    // 处理其他类型的错误
    const errorMessage = error.message || error.toString() || "未知错误";
    throw new ValidationError(`博客信息处理失败: ${errorMessage}`);
  }
}

// 根据分页获取博客列表
export async function findBlogByPageService(pageInfo) {
  try {
    console.log("分页查询参数:", pageInfo);
    const data = await findBlogByPageDao(pageInfo);
    console.log("查询结果:", data);
    const rows = handleArrayResponseData(data.rows);
    return formatResponseData(200, "分页获取博客列表成功", {
      total: data.count,
      rows,
    });
  } catch (error) {
    console.error("分页查询博客列表失败:", error);
    throw error;
  }
}

// 根据id获取博客
export async function findBlogByIdService(id, token) {
  try {
    if (!id) {
      throw new ValidationError("博客id不能为空");
    }
    const data = await findBlogByIdDao(id);
    if (!data) {
      throw new ValidationError("博客不存在");
    }
    // 前台访问 次数+1
    if (!token) {
      data.scanNumber++;
      await data.save();
    }
    return formatResponseData(200, "根据id获取博客成功", data.dataValues);
  } catch (error) {
    console.error("根据ID查询博客失败:", error);
    throw error;
  }
}

// 更新博客
export async function updateBlogService(id, blogInfo) {
  try {
    if (!id) {
      throw new ValidationError("博客id不能为空");
    }

    console.log("更新博客，接收到的数据:", JSON.stringify(blogInfo, null, 2));

    // 检查 Markdown 内容是否存在
    if (!blogInfo.markdownContent || !blogInfo.markdownContent.trim()) {
      console.error("Markdown 内容为空");
      throw new ValidationError("文章内容不能为空");
    }

    // 保存原始的 markdownContent
    const originalMarkdownContent = blogInfo.markdownContent;

    // 将 Markdown 转换为 HTML
    try {
      blogInfo.htmlContent = md.render(blogInfo.markdownContent);
      console.log("Markdown 转换成功，HTML 长度:", blogInfo.htmlContent.length);
    } catch (error) {
      console.error("Markdown 转换失败:", error);
      throw new ValidationError("Markdown 转换失败: " + error.message);
    }

    // 恢复 markdownContent
    blogInfo.markdownContent = originalMarkdownContent;

    // 处理 thumb 字段：如果为空，设置默认值
    if (blogInfo.thumb !== undefined) {
      if (!blogInfo.thumb || blogInfo.thumb.trim() === "") {
        blogInfo.thumb = ""; // 设置为空字符串，数据库允许为空
      }
    }

    // 处理 createDate 字段：如果是时间戳，转换为字符串
    if (blogInfo.createDate !== undefined) {
      if (typeof blogInfo.createDate === "number") {
        blogInfo.createDate = String(blogInfo.createDate);
      }
    }

    // 更新博客
    const { dataValues } = await updateBlogDao(id, blogInfo);
    if (!dataValues) {
      throw new ValidationError("博客不存在");
    }
    return formatResponseData(200, "根据id更新博客成功", dataValues);
  } catch (error) {
    console.error("根据ID更新博客失败:", error);
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError("更新博客失败: " + (error.message || "未知错误"));
  }
}

// 删除博客
export async function deleteBlogService(id) {
  try {
    if (!id) {
      throw new ValidationError("博客id不能为空");
    }
    // 检查博客是否存在
    const data = await findBlogByIdDao(id);
    if (data) {
      // 需要根据该文章对应的分类, 减少文章分类关联的文章数量
      const categoryInfo = await findBlogTypeByIdDao(data.categoryId);
      if (categoryInfo) {
        categoryInfo.articleCount--;
        await categoryInfo.save();
      }
      // 删除该文章下的评论
      // await deleteCommentByBlogIdDao(id);
      // 删除文章
      await deleteBlogDao(id);
      return formatResponseData(200, "删除成功", true);
    } else {
      throw new ValidationError("博客不存在");
    }
  } catch (error) {
    console.error("根据ID删除博客失败:", error);
    throw error;
  }
}
