import { BlogModel } from "./model/blogModel.js";
import { BlogTypeModel } from "./model/blogTypeModel.js";
import { Op } from "sequelize";

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
  console.log("DAO层：分页查询参数", pageInfo);
  
  // 构建查询条件数组
  const whereConditions = [];
  
  // 如果有分类筛选，添加分类条件
  if (pageInfo.categoryId) {
    whereConditions.push({
      categoryId: pageInfo.categoryId * 1,
    });
  }
  
  // 如果有关键字搜索，添加搜索条件
  if (pageInfo.keyword && pageInfo.keyword.trim()) {
    whereConditions.push({
      [Op.or]: [
        {
          title: {
            [Op.like]: `%${pageInfo.keyword.trim()}%`,
          },
        },
        {
          description: {
            [Op.like]: `%${pageInfo.keyword.trim()}%`,
          },
        },
      ],
    });
  }
  
  // 组合所有条件
  const whereCondition =
    whereConditions.length > 0 ? { [Op.and]: whereConditions } : {};
  
  // 构建查询选项
  const queryOptions = {
    where: whereCondition,
    include: [
      {
        model: BlogTypeModel,
        as: "blogType",
      },
    ],
    offset: (pageInfo.page * 1 - 1) * pageInfo.limit,
    limit: pageInfo.limit * 1,
    order: [["createDate", "DESC"]], // 按创建时间降序排列
  };
  
  console.log("DAO层：查询选项", JSON.stringify(queryOptions, null, 2));
  
  const result = await BlogModel.findAndCountAll(queryOptions);
  console.log("DAO层：查询结果数量", result.count);
  
  return result;
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
