import { BlogModel } from "./model/blogModel.js";
import { BlogTypeModel } from "./model/blogTypeModel.js";

// 添加博客
export async function addBlogDao(blogInfo) {
  try {
    console.log("DAO层：准备插入博客数据");
    const { dataValues } = await BlogModel.create(blogInfo);
    console.log("DAO层：博客插入成功，ID:", dataValues.id);
    return dataValues;
  } catch (error) {
    console.error("DAO层：博客插入失败，错误类型:", error.name);
    console.error("DAO层：错误信息:", error.message);
    console.error("DAO层：错误详情:", error);
    throw error;
  }
}

// 根据分页获取博客列表
export async function findBlogByPageDao(pageInfo) {
  if (pageInfo.categoryId) {
    // 根据分类信息进行分页查询
    return await BlogModel.findAndCountAll({
      include: [
        {
          model: BlogTypeModel,
          as: "blogType",
          where: {
            id: pageInfo.categoryId * 1,
          },
        },
      ],
      offset: (pageInfo.page * 1 - 1) * pageInfo.limit,
      limit: pageInfo.limit * 1,
    });
  } else {
    // 根据所有博客分页来查询
    return await BlogModel.findAndCountAll({
      include: [
        {
          model: BlogTypeModel,
          as: "blogType",
        },
      ],
      offset: (pageInfo.page * 1 - 1) * pageInfo.limit,
      limit: pageInfo.limit * 1,
    });
  }
}

// 根据id获取博客
export async function findBlogByIdDao(id) {
  return await BlogModel.findByPk(id, {
    include: [
      {
        model: BlogTypeModel,
        as: "blogType",
      },
    ],
  });
}

// 更新博客
export async function updateBlogDao(id, blogInfo) {
  await BlogModel.update(blogInfo, {
    where: {
      id,
    },
  });
  return await findBlogByIdDao(id);
}

// 删除博客
export async function deleteBlogDao(id) {
  return await BlogModel.destroy({
    where: {
      id,
    },
  });
}
