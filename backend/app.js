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
import {
  ForbiddenError,
  ServerError,
  UnknownError,
  ValidationError,
} from "./utils/errors.js";

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
import blogRouter from "./routes/blog.js";
import commentRouter from "./routes/comment.js";

// 在 ES 模块中获取 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 创建服务器实例
var app = express();

// 配置session中间件
app.use(
  session({
    secret: md5(process.env.SESSION_SECRET), // md5加密后的密钥
    resave: false, // 不强制保存未修改的session
    saveUninitialized: false, // 不保存未初始化的session
    cookie: {
      secure: false, // 在开发环境中设为false，生产环境中应设为true（需要HTTPS）
      httpOnly: false, // 允许客户端JavaScript访问cookie（为了兼容性）
      maxAge: 24 * 60 * 60 * 1000, // 24小时过期
      sameSite: "lax", // 允许跨站请求携带cookie
    },
    name: "sessionId", // 自定义session cookie名称
  })
);

// 测试数据库连接
await testDbConnection();
// 初始化数据库
await initDb();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// CORS 配置
app.use((req, res, next) => {
  // 支持多个前端端口
  const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, Authorization_Token, X-Request-Source"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  // 暴露Authorization响应头，让前端可以访问
  res.header("Access-Control-Expose-Headers", "Authorization");

  // 处理预检请求
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// 中间件
app.use(logger("dev"));
// 增加 body parser 大小限制以支持长文章（50MB）
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// 验证token中间件
const jwtMiddleware = expressjwt({
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
    {
      url: "/api/blog",
      methods: ["GET"],
    },
    {
      url: /^\/api\/blog\/\d+$/,
      methods: ["GET"],
    },
    {
      url: "/api/blogType",
      methods: ["GET"],
    },
    {
      url: "/api/banner",
      methods: ["GET"],
    },
    {
      url: /^\/api\/comment\/blog\/\d+$/,
      methods: ["GET"],
    },
    {
      url: "/api/comment",
      methods: ["POST"],
    },
  ],
});

app.use(jwtMiddleware);

// 使用路由中间件
app.use("/api/admin", adminRouter);
app.use("/api/captcha", captchaRouter);
app.use("/api/banner", bannerRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/blogType", blogTypeRouter);
app.use("/api/blog", blogRouter);
app.use("/api/comment", commentRouter);
app.use("/api/comment", commentRouter);

// 404 路由处理
app.use(function (req, res, next) {
  next(createError(404));
});

// 全局错误处理
app.use(function (err, req, res, next) {
  // 打印详细错误信息用于调试
  console.error("=== 全局错误处理 ===");
  console.error("错误名称:", err.name);
  console.error("错误信息:", err.message);
  console.error("错误堆栈:", err.stack);
  console.error("==================");

  // token验证错误
  if (err.name === "UnauthorizedError") {
    // 添加详细的错误日志
    console.error("Token验证失败:", {
      message: err.message,
      code: err.code,
      inner: err.inner?.message,
    });

    // 根据错误类型返回不同的错误信息
    let errorMsg = "token 无效";
    if (err.message === "jwt expired") {
      errorMsg = "token 已过期，请重新登录";
    } else if (err.message === "invalid token") {
      errorMsg = "token 格式错误";
    } else if (err.message === "jwt malformed") {
      errorMsg = "token 格式不正确";
    } else if (err.message === "invalid signature") {
      errorMsg = "token 签名无效";
    }

    return res.send(new ForbiddenError(errorMsg).toResponseJSON());
  }

  // 业务错误（包括 ValidationError）
  if (err instanceof ServerError) {
    return res.send(err.toResponseJSON());
  }

  // Sequelize 数据库错误
  if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError"
  ) {
    const messages =
      err.errors?.map((e) => e.message).join(", ") || err.message;
    return res.send(
      new ValidationError(`数据验证失败: ${messages}`).toResponseJSON()
    );
  }

  // Sequelize 数据库连接错误
  if (
    err.name === "SequelizeDatabaseError" ||
    err.name === "SequelizeConnectionError"
  ) {
    console.error("数据库错误:", err);
    return res.send({
      code: 500,
      msg:
        process.env.NODE_ENV === "development" ? err.message : "数据库操作失败",
    });
  }

  // 其他未知错误
  console.error("未处理的错误类型:", err.constructor.name);
  res.send({
    code: 500,
    msg:
      process.env.NODE_ENV === "development" ? err.message : "服务器内部错误",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

export default app;
