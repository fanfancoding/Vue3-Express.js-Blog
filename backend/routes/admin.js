import express from "express";
const router = express.Router();

import { adminLoginServer, adminUpdateServer } from "../service/adminServer.js";
import { formatResponseData, parseToken } from "../utils/tool.js";
import { ValidationError } from "../utils/errors.js";

// 登录
router.post("/login", async (req, res, next) => {
  try {
    // console.log(req.session, "req.session");
    // 验证码验证
    // console.log("Session during login:", req.session);
    // console.log("Session captcha:", req.session.captcha);
    console.log("User input captcha:", req.body.captcha);

    // if (!req.session.captcha) {
    //   return res.send(formatResponseData(400, "验证码已过期，请刷新"));
    // }

    if (!req.body.captcha) {
      return res.send(formatResponseData(400, "请输入验证码"));
    }

    // if (req.body.captcha.toLowerCase() !== req.session.captcha.toLowerCase()) {
    //   return res.send(formatResponseData(400, "验证码错误"));
    // }

    const result = await adminLoginServer(req.body);
    if (result && result.token) {
      console.log(result);
      res.setHeader("Authorization", result.token);
      delete result.token;
      res.send(formatResponseData(200, "success", result));
    } else {
      res.send(formatResponseData(400, "用户名或密码错误"));
    }
  } catch (error) {
    console.error("Login error:", error);
    if (error instanceof ValidationError) {
      res.send(formatResponseData(400, error.message));
    } else {
      res.send(formatResponseData(500, "登录失败，请稍后重试"));
    }
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
  try {
    // 从JWT中间件中获取用户信息
    if (!req.auth || !req.auth.id) {
      return res.send(formatResponseData(401, "未授权访问"));
    }

    // 将当前用户ID添加到请求体中，确保只能修改自己的信息
    const updateData = { ...req.body, currentUserId: req.auth.id };
    const result = await adminUpdateServer(updateData);
    if (result) {
      res.send(result);
    } else {
      res.send(formatResponseData(500, "修改失败"));
    }
  } catch (error) {
    console.error("Admin update error:", error);
    if (error instanceof ValidationError) {
      res.send(formatResponseData(400, error.message));
    } else {
      res.send(formatResponseData(500, "修改账号信息失败"));
    }
  }
});

export default router;
