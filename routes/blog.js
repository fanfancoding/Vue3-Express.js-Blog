import express from "express";
const router = express.Router();

// 分页获取博客列表
router.get("/", async (req, res, next) => {});

// 获取其中一个博客
router.get("/:id", async (req, res, next) => {});

// 发布博客
router.post("/", async (req, res, next) => {});

// 修改其中一个博客
router.put("/:id", async (req, res, next) => {});

// 删除其中一个博客
router.delete("/:id", async (req, res, next) => {});

export default router;
