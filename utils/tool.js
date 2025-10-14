import jwt from "jsonwebtoken";
import md5 from "md5";
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
