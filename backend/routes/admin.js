import express from "express";
const router = express.Router();

import { adminLoginServer, adminUpdateServer } from "../service/adminServer.js";
import { formatResponseData, parseToken } from "../utils/tool.js";
import { ValidationError } from "../utils/errors.js";

// 登录
router.post("/login", async (req, res, next) => {
  if(req.body.captcha.toLowerCase() !== req.session.captcha.toLowerCase()) {
    throw new ValidationError("验证码错误");
  }
  const result = await adminLoginServer(req.body);
  if (result && result.token) {
    console.log(result);
    res.setHeader("Authorization", result.token);
    delete result.token;
    res.send(formatResponseData(200, "success", result));
  }
});

// 恢复登录状态
router.post("/restore", async (req, res, next) => {
  const token = parseToken(req.get("Authorization"));
  res.send(
    formatResponseData(200, "success", {
      loginId: token.loginId,
      name: token.name,
      id: token.id,
    })
  );
});

// 修改账号信息
router.put("/", async (req, res, next) => {
  const result = await adminUpdateServer(req.body);
  if (result) {
    res.send(result);
  } else {
    res.send(formatResponseData(500, "error"));
  }
});

export default router;
