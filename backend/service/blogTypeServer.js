import { handleArrayResponseData } from "../utils/tool.js";
import { formatResponseData } from "../utils/tool.js";
import validate from "validate.js";
import { ValidationError } from "../utils/errors.js";
import {
  addBlogTypeDao,
  findBlogTypeListDao,
  findBlogTypeByIdDao,
  updateBlogTypeDao,
  deleteBlogTypeDao,
} from "../dao/blogTypeDao.js";

// 获取博客分类列表
export async function findBlogTypeListService() {
  try {
    return formatResponseData(
      200,
      "获取博客分类列表成功",
      handleArrayResponseData(await findBlogTypeListDao()).sort(
        (a, b) => a.order - b.order
      )
    );
  } catch (error) {
    console.error("获取博客分类列表失败:", error);
    throw error;
  }
}

// 获取其中一个博客分类
export async function findBlogTypeByIdService(id) {
  try {
    return formatResponseData(
      200,
      "获取博客分类成功",
      await findBlogTypeByIdDao(id)
    );
  } catch (error) {
    console.error("获取博客分类失败:", error);
    throw error;
  }
}

// 添加博客分类
export async function addBlogTypeService(newBlogTypeInfo) {
  // 数据验证规则
  const blogTypeRule = {
    name: {
      presence: {
        allowEmpty: false,
      },
      type: "string",
    },
    order: {
      presence: {
        allowEmpty: false,
      },
      type: "integer",
    },
  };
  // 验证通过 结果为undefined
  const validateResult = validate(newBlogTypeInfo, blogTypeRule);
  console.log(validateResult, "validateResult");
  // 验证通过
  if (!validateResult) {
    console.log("come in");
    // 因为是新增博客分类 所以默认文章数量为0
    newBlogTypeInfo.articleCount = 0;
    console.log(newBlogTypeInfo, "newBlogTypeInfo");
    // 调用dao层添加博客分类
    return formatResponseData(
      200,
      "添加博客分类成功",
      await addBlogTypeDao(newBlogTypeInfo)
    );
  } else {
    throw new ValidationError("添加博客分类参数错误");
  }
}

// 修改博客分类
export async function updateBlogTypeService(id, updatedBlogTypeInfo) {
  try {
    return formatResponseData(
      200,
      "修改博客分类成功",
      await updateBlogTypeDao(id, updatedBlogTypeInfo)
    );
  } catch (error) {
    console.error("修改博客分类失败:", error);
    throw error;
  }
}

// 删除博客分类
export async function deleteBlogTypeService(id) {
  try {
    // 调用dao层删除博客分类
    await deleteBlogTypeDao(id);
    // 后续再改 o(=•ェ•=)m
    return formatResponseData(200, "删除博客分类成功", { id });
  } catch (error) {
    console.error("删除博客分类失败:", error);
    throw error;
  }
}
