import express from "express";
const router = express.Router();

import { getCaptchaServer } from "../service/captchaServer.js";

router.get("/", async (req, res, next) => {
  // 生成验证码
  const captcha = await getCaptchaServer();
  req.session.captcha = captcha.text;
  // 响应验证码图片
  res.setHeader("Content-Type", "image/svg+xml");
  res.send(captcha.data);
});
export default router;
