// 自定义错误 当错误发生时 抛出该错误
import { formatResponseData } from "./tool.js";

// 业务错误处理基类
export class ServerError extends Error {
  // message 错误信息 statusCode 错误状态码
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
  // 格式化返回错误信息
  toResponseJSON() {
    return formatResponseData(this.statusCode, this.message);
  }
}

// 文件上传错误
export class FileUploadError extends ServerError {
  constructor(message) {
    super(message, 413);
  }
}

// 禁止访问错误
export class ForbiddenError extends ServerError {
  constructor(message) {
    super(message, 401);
  }
}

// 验证错误
export class ValidationError extends ServerError {
  constructor(message, statusCode = 406) {
    super(message, statusCode);
  }
}

// 无资源错误
export class NotFoundError extends ServerError {
  constructor() {
    super("Not Found", 404);
  }
}

// 未知错误
export class UnknownError extends ServerError {
  constructor() {
    super("Unknown Error", 500);
  }
}
