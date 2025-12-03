import { Op } from "sequelize";
import { MessageBoardModel } from "./model/messageBoardModel.js";

// 创建留言
export async function createMessageDao(data) {
  const { dataValues } = await MessageBoardModel.create(data);
  return dataValues;
}

// 获取留言列表（分页）
export async function getMessageListDao(params) {
  const { page = 1, pageSize = 10, status } = params;
  const offset = (page - 1) * pageSize;

  const where = {};
  if (status !== undefined) {
    where.status = status;
  }

  const { count, rows } = await MessageBoardModel.findAndCountAll({
    where,
    order: [["createDate", "DESC"]],
    limit: pageSize,
    offset,
  });

  return {
    list: rows,
    total: count,
    page,
    pageSize,
  };
}

// 根据ID获取留言
export async function getMessageByIdDao(id) {
  return await MessageBoardModel.findByPk(id);
}

// 更新留言
export async function updateMessageDao(id, data) {
  const message = await MessageBoardModel.findByPk(id);
  if (!message) {
    return null;
  }
  await message.update(data);
  return message.dataValues;
}

// 删除留言（软删除）
export async function deleteMessageDao(id) {
  const message = await MessageBoardModel.findByPk(id);
  if (!message) {
    return false;
  }
  await message.update({ status: 0 });
  return true;
}

// 批量删除留言
export async function batchDeleteMessageDao(ids) {
  return await MessageBoardModel.update(
    { status: 0 },
    {
      where: {
        id: ids,
      },
    }
  );
}

// 回复留言
export async function replyMessageDao(id, reply) {
  const message = await MessageBoardModel.findByPk(id);
  if (!message) {
    return null;
  }
  await message.update({
    reply,
    replyTime: new Date(),
  });
  return message.dataValues;
}

// 审核留言（通过）
export async function approveMessageDao(id) {
  const message = await MessageBoardModel.findByPk(id);
  if (!message) {
    return null;
  }
  await message.update({ status: 2 }); // 2-已发布（审核通过）
  return message.dataValues;
}

// 拒绝留言（删除或标记为已删除）
export async function rejectMessageDao(id) {
  const message = await MessageBoardModel.findByPk(id);
  if (!message) {
    return null;
  }
  await message.update({ status: 0 }); // 0-已删除
  return message.dataValues;
}

// 批量审核留言
export async function batchApproveMessageDao(ids) {
  return await MessageBoardModel.update(
    { status: 2 },
    {
      where: {
        id: ids,
        status: 1, // 只审核待审核状态的留言
      },
    }
  );
}

// 获取留言统计
export async function getMessageStatsDao() {
  const total = await MessageBoardModel.count({
    where: { status: { [Op.in]: [1, 2] } }, // 待审核 + 已发布
  });

  const pending = await MessageBoardModel.count({
    where: { status: 1 }, // 待审核
  });

  const approved = await MessageBoardModel.count({
    where: { status: 2 }, // 已发布
  });

  const replied = await MessageBoardModel.count({
    where: { status: 2, reply: { [Op.ne]: null } }, // 已发布且有回复
  });

  const unreplied = approved - replied;

  return {
    total,
    pending,
    approved,
    replied,
    unreplied,
  };
}
