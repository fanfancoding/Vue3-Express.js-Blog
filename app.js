// 引入环境变量模块 - 必须在最顶部
import dotenv from "dotenv";
dotenv.config();

import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { fileURLToPath } from "url";
import { expressjwt } from "express-jwt";
import md5 from "md5";
import "express-async-errors";
import session from "express-session";
import { ForbiddenError, ServerError, UnknownError } from "./utils/errors.js";

// 引入数据库连接模块
import { testDbConnection } from "./dao/dbConnect.js";
// 引入数据库初始化模块
import { initDb } from "./dao/db.js";
// 引入路由模块
import adminRouter from "./routes/admin.js";
import captchaRouter from "./routes/captcha.js";
import bannerRouter from "./routes/banner.js";
import uploadRouter from "./routes/upload.js";
import blogTypeRouter from "./routes/blogType.js";

// 在 ES 模块中获取 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 创建服务器实例
var app = express();

// 配置session中间件
app.use(
  session({
    secret: md5(process.env.SESSION_SECRET), // md5加密后的密钥
    resave: true,
    saveUninitialized: true,
  })
);

// 测试数据库连接
await testDbConnection();
// 初始化数据库
await initDb();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// 中间件
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// 验证token中间件
app.use(
  expressjwt({
    secret: md5(process.env.JWT_SECRET), // md5加密后的密钥
    algorithms: ["HS256"], // 加密算法
    requestProperty: "auth", // 验证通过后 将token信息挂载到req.auth上
  }).unless({
    path: [
      {
        url: "/api/admin/login",
        methods: ["POST"],
      },
      {
        url: "/api/captcha",
        methods: ["GET"],
      },
    ],
  })
);

// 使用路由中间件
app.use("/api/admin", adminRouter);
app.use("/api/captcha", captchaRouter);
app.use("/api/banner", bannerRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/blogType", blogTypeRouter);

// 404 路由处理
app.use(function (req, res, next) {
  next(createError(404));
});

// 全局错误处理
app.use(function (err, req, res, next) {
  // token验证错误
  if (err.name === "UnauthorizedError") {
    res.send(new ForbiddenError("token 无效").toResponseJSON());
  } else if (err instanceof ServerError) {
    res.send(err.toResponseJSON());
  } else {
    res.send(new UnknownError().toResponseJSON());
  }
});

export default app;
