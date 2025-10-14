import jwt from "jsonwebtoken";
import md5 from "md5";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// 在 ES 模块中获取 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 格式化要响应的数据
export function formatResponseData(code, msg, data) {
  return {
    code,
    msg,
    data,
  };
}

// 解析token
export function parseToken(token) {
  try {
    return jwt.verify(token.split(" ")[1], md5(process.env.JWT_SECRET));
  } catch (err) {
    return null;
  }
}

// 处理数组类型相应数据
export function handleArrayResponseData(data) {
  return data.map((item) => item.dataValues);
}

// 上传multer的引擎
const storage = multer.diskStorage({
  // 文件存储的目录
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "/../public/static/uploads"));
  },
  // 处理上传到服务器的文件名
  filename: function (req, file, cb) {
    // 获取文件名
    const baseName = path.basename(
      file.originalname,
      path.extname(file.originalname)
    );
    // 获取文件扩展名
    const extName = path.extname(file.originalname);
    // 构建新的文件名
    const newFileName =
      baseName +
      "-" +
      Date.now() +
      "-" +
      Math.floor(Math.random() * 9000 + 1000) +
      extName;
    cb(null, newFileName);
  },
});

// 上传multer的实例
export function uploadMulter() {
  return multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 2, files: 1 },
  });
}
