import { BlogTypeModel } from "./model/BlogTypeModel.js";

// 添加博客分类
export async function addBlogTypeDao(newBlogTypeInfo) {
  try {
    const { dataValues } = await BlogTypeModel.create(newBlogTypeInfo);
    return dataValues;
  } catch (error) {
    console.error("添加博客分类失败:", error);
    throw error;
  }
}

// 获取所有的博客分类
export async function findBlogTypeListDao() {
  try {
    return await BlogTypeModel.findAll();
  } catch (error) {
    console.error("获取所有的博客分类失败:", error);
    throw error;
  }
}

// 获取其中一个博客分类
export async function findBlogTypeByIdDao(id) {
  try {
    return await BlogTypeModel.findByPk(id);
  } catch (error) {
    console.error("获取其中一个博客分类失败:", error);
    throw error;
  }
}

// 更新博客分类
export async function updateBlogTypeDao(id, updatedBlogTypeInfo) {
  try {
    await BlogTypeModel.update(updatedBlogTypeInfo, {
      where: {
        id,
      },
    });
    const result = await findBlogTypeByIdDao(id);
    if (!result) {
      throw new Error(`博客分类ID ${id} 不存在`);
    }
    return result.dataValues;
  } catch (error) {
    console.error("更新博客分类失败:", error);
    throw error;
  }
}

// 删除博客分类
export async function deleteBlogTypeDao(id) {
  try {
    await BlogTypeModel.destroy({
      where: {
        id,
      },
    });
    return { id };
  } catch (error) {
    console.error("删除博客分类失败:", error);
    throw error;
  }
}
