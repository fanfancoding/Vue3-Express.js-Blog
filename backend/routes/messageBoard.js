import express from "express";
const router = express.Router();
import {
  createMessageService,
  getMessageListService,
  getMessageListAdminService,
  getMessageByIdService,
  replyMessageService,
  deleteMessageService,
  batchDeleteMessageService,
  getMessageStatsService,
  approveMessageService,
  rejectMessageService,
  batchApproveMessageService,
} from "../service/messageBoardServer.js";

// 创建留言（前台）
router.post("/", async (req, res, next) => {
  try {
    const ip = req.ip || req.connection.remoteAddress || "";
    res.send(await createMessageService(req.body, ip));
  } catch (error) {
    next(error);
  }
});

// 获取留言列表（前台）
router.get("/list", async (req, res, next) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;
    res.send(
      await getMessageListService({
        page: parseInt(page),
        pageSize: parseInt(pageSize),
      })
    );
  } catch (error) {
    next(error);
  }
});

// 获取留言列表（后台管理）
router.get("/admin/list", async (req, res, next) => {
  try {
    const { page = 1, pageSize = 10, status } = req.query;
    res.send(
      await getMessageListAdminService({
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        status: status !== undefined ? parseInt(status) : undefined,
      })
    );
  } catch (error) {
    next(error);
  }
});

// 获取留言详情
router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    res.send(await getMessageByIdService(id));
  } catch (error) {
    next(error);
  }
});

// 回复留言
router.put("/:id/reply", async (req, res, next) => {
  try {
    const id = req.params.id;
    const { reply } = req.body;
    res.send(await replyMessageService(id, reply));
  } catch (error) {
    next(error);
  }
});

// 删除留言
router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    res.send(await deleteMessageService(id));
  } catch (error) {
    next(error);
  }
});

// 批量删除留言
router.delete("/batch/delete", async (req, res, next) => {
  try {
    const { ids } = req.body;
    res.send(await batchDeleteMessageService(ids));
  } catch (error) {
    next(error);
  }
});

// 审核留言（通过）
router.put("/admin/:id/approve", async (req, res, next) => {
  try {
    const id = req.params.id;
    res.send(await approveMessageService(id));
  } catch (error) {
    next(error);
  }
});

// 拒绝留言
router.put("/admin/:id/reject", async (req, res, next) => {
  try {
    const id = req.params.id;
    res.send(await rejectMessageService(id));
  } catch (error) {
    next(error);
  }
});

// 批量审核留言
router.put("/admin/batch/approve", async (req, res, next) => {
  try {
    const { ids } = req.body;
    res.send(await batchApproveMessageService(ids));
  } catch (error) {
    next(error);
  }
});

// 获取留言统计
router.get("/admin/stats", async (req, res, next) => {
  try {
    res.send(await getMessageStatsService());
  } catch (error) {
    next(error);
  }
});

export default router;

