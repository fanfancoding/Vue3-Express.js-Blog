import { BlogModel } from "./model/blogModel.js";
import { BlogTypeModel } from "./model/blogTypeModel.js";

// 添加博客
export async function addBlogDao(blogInfo) {
  const { dataValues } = await BlogModel.create(blogInfo);
  return dataValues;
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
