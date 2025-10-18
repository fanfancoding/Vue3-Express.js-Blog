// 扩展验证规则
import { validate } from "validate.js";
import { BlogTypeModel } from "../dao/model/blogTypeModel.js";
import { ValidationError } from "../utils/errors.js";
import { incrementBlogCountDao } from "../dao/blogTypeDao.js";
import { formatResponseData, handleArrayResponseData } from "../utils/tool.js";
import { addBlogDao, findBlogByPageDao } from "../dao/blogDao.js";
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
  // 处理 toc 字段
  blogInfo.toc = JSON.stringify(blogInfo.toc || []);
  // 初始化新文章的其他信息
  blogInfo.scanNumber = blogInfo.scanNumber || 0;
  blogInfo.commentNumber = blogInfo.commentNumber || 0;

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
    toc: {
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
      type: "integer",
    },
    categoryId: {
      presence: true,
      type: "integer",
      categoryIdIsExist: true,
    },
  };

  // 验证博客信息
  try {
    console.log("开始验证博客信息:", blogInfo);
    // 扩展验证操作 使用异步验证
    await validate.async(blogInfo, blogRule);
    console.log("验证通过，开始添加博客");
    // 验证通过，添加博客
    const data = await addBlogDao(blogInfo);
    // 文章新增 文章分类关联
    await incrementBlogCountDao(blogInfo.categoryId);
    return formatResponseData(200, "博客新增成功", data);
  } catch (errors) {
    console.error("验证失败，详细错误:", errors);
    throw new ValidationError("博客信息验证失败");
  }
}

// 根据分页获取博客列表
export async function findBlogByPageService(pageInfo) {
  try {
    console.log("分页查询参数:", pageInfo);
    const data = await findBlogByPageDao(pageInfo);
    console.log("查询结果:", data);
    const rows = handleArrayResponseData(data.rows);
    // 针对 TOC 做 JSON 解析
    rows.forEach((item) => {
      item.toc = JSON.parse(item.toc || "[]");
    });
    return formatResponseData(200, "分页获取博客列表成功", {
      total: data.count,
      rows,
    });
  } catch (error) {
    console.error("分页查询博客列表失败:", error);
    throw error;
  }
}
