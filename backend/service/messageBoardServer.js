import { ValidationError } from "../utils/errors.js";
import { formatResponseData } from "../utils/tool.js";
import {
  createMessageDao,
  getMessageListDao,
  getMessageByIdDao,
  updateMessageDao,
  deleteMessageDao,
  batchDeleteMessageDao,
  replyMessageDao,
  getMessageStatsDao,
  approveMessageDao,
  rejectMessageDao,
  batchApproveMessageDao,
} from "../dao/messageBoardDao.js";

// 创建留言
export async function createMessageService(data, ip) {
  try {
    const { nickname, email, content, avatar } = data;

    if (!nickname || nickname.trim() === "") {
      throw new ValidationError("昵称不能为空");
    }
    if (nickname.length > 50) {
      throw new ValidationError("昵称长度不能超过50个字符");
    }
    if (!content || content.trim() === "") {
      throw new ValidationError("留言内容不能为空");
    }
    if (content.length > 2000) {
      throw new ValidationError("留言内容不能超过2000个字符");
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new ValidationError("邮箱格式不正确");
    }

    const message = await createMessageDao({
      nickname: nickname.trim(),
      email: email ? email.trim() : null,
      content: content.trim(),
      avatar: "", // 不再使用头像功能
      ip: ip || "",
      status: 1, // 1-待审核
    });

    return formatResponseData(200, "留言成功，等待审核", message);
  } catch (error) {
    console.error("创建留言失败:", error);
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError("创建留言失败: " + (error.message || "未知错误"));
  }
}

// 获取留言列表（前台）
export async function getMessageListService(params) {
  try {
    // 前台只显示已发布（审核通过）的留言，status=2
    const result = await getMessageListDao({
      ...params,
      status: 2,
    });

    return formatResponseData(200, "获取留言列表成功", result);
  } catch (error) {
    console.error("获取留言列表失败:", error);
    throw new ValidationError(
      "获取留言列表失败: " + (error.message || "未知错误")
    );
  }
}

// 获取留言列表（后台管理）
export async function getMessageListAdminService(params) {
  try {
    const result = await getMessageListDao(params);
    return formatResponseData(200, "获取留言列表成功", result);
  } catch (error) {
    console.error("获取留言列表失败:", error);
    throw new ValidationError(
      "获取留言列表失败: " + (error.message || "未知错误")
    );
  }
}

// 获取留言详情
export async function getMessageByIdService(id) {
  try {
    if (!id) {
      throw new ValidationError("留言ID不能为空");
    }

    const message = await getMessageByIdDao(id);
    if (!message) {
      throw new ValidationError("留言不存在");
    }

    return formatResponseData(200, "获取留言详情成功", message.dataValues);
  } catch (error) {
    console.error("获取留言详情失败:", error);
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      "获取留言详情失败: " + (error.message || "未知错误")
    );
  }
}

// 回复留言
export async function replyMessageService(id, reply) {
  try {
    if (!id) {
      throw new ValidationError("留言ID不能为空");
    }
    if (!reply || reply.trim() === "") {
      throw new ValidationError("回复内容不能为空");
    }
    if (reply.length > 2000) {
      throw new ValidationError("回复内容不能超过2000个字符");
    }

    const message = await replyMessageDao(id, reply.trim());
    if (!message) {
      throw new ValidationError("留言不存在");
    }

    return formatResponseData(200, "回复成功", message);
  } catch (error) {
    console.error("回复留言失败:", error);
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError("回复留言失败: " + (error.message || "未知错误"));
  }
}

// 删除留言
export async function deleteMessageService(id) {
  try {
    if (!id) {
      throw new ValidationError("留言ID不能为空");
    }

    const success = await deleteMessageDao(id);
    if (!success) {
      throw new ValidationError("留言不存在");
    }

    return formatResponseData(200, "删除成功", true);
  } catch (error) {
    console.error("删除留言失败:", error);
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError("删除留言失败: " + (error.message || "未知错误"));
  }
}

// 批量删除留言
export async function batchDeleteMessageService(ids) {
  try {
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      throw new ValidationError("请选择要删除的留言");
    }

    await batchDeleteMessageDao(ids);
    return formatResponseData(200, "批量删除成功", true);
  } catch (error) {
    console.error("批量删除留言失败:", error);
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      "批量删除留言失败: " + (error.message || "未知错误")
    );
  }
}

// 审核留言（通过）
export async function approveMessageService(id) {
  try {
    if (!id) {
      throw new ValidationError("留言ID不能为空");
    }

    const message = await approveMessageDao(id);
    if (!message) {
      throw new ValidationError("留言不存在");
    }

    return formatResponseData(200, "审核通过", message);
  } catch (error) {
    console.error("审核留言失败:", error);
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError("审核留言失败: " + (error.message || "未知错误"));
  }
}

// 拒绝留言
export async function rejectMessageService(id) {
  try {
    if (!id) {
      throw new ValidationError("留言ID不能为空");
    }

    const message = await rejectMessageDao(id);
    if (!message) {
      throw new ValidationError("留言不存在");
    }

    return formatResponseData(200, "已拒绝", message);
  } catch (error) {
    console.error("拒绝留言失败:", error);
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError("拒绝留言失败: " + (error.message || "未知错误"));
  }
}

// 批量审核留言
export async function batchApproveMessageService(ids) {
  try {
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      throw new ValidationError("请选择要审核的留言");
    }

    await batchApproveMessageDao(ids);
    return formatResponseData(200, "批量审核成功", true);
  } catch (error) {
    console.error("批量审核留言失败:", error);
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      "批量审核留言失败: " + (error.message || "未知错误")
    );
  }
}

// 获取留言统计
export async function getMessageStatsService() {
  try {
    const stats = await getMessageStatsDao();
    return formatResponseData(200, "获取统计成功", stats);
  } catch (error) {
    console.error("获取留言统计失败:", error);
    throw new ValidationError(
      "获取留言统计失败: " + (error.message || "未知错误")
    );
  }
}
