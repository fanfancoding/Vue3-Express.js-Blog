import md5 from "md5";
import { adminLoginDao, adminUpdateDao } from "../dao/adminDao.js";
import jwt from "jsonwebtoken";
import { ValidationError } from "../utils/errors.js";
import { formatResponseData } from "../utils/tool.js";

// 登录服务
export async function adminLoginServer(loginInfo) {
  let { loginId, loginPwd } = loginInfo;
  loginPwd = md5(loginPwd); // 加密

  let result = await adminLoginDao({ loginId, loginPwd });
  if (result && result.dataValues) {
    result = result.dataValues;
    let tokenExprieTime = loginInfo.remember ? Number(loginInfo.remember) : 1;
    const token = jwt.sign(
      {
        id: result.id,
        loginId: result.loginId,
        name: result.name,
      },
      md5(process.env.JWT_SECRET),
      {
        expiresIn: tokenExprieTime * 60 * 60 * 24,
      }
    );
    result.token = token;
    delete result.loginPwd;
  }
  return result;
}

// 修改账号信息服务
export async function adminUpdateServer(updateInfo) {
  let { loginId, name, loginPwd, oldLoginPwd } = updateInfo;
  let result = await adminLoginDao({
    loginId,
    loginPwd: md5(oldLoginPwd),
  });
  if (result && result.dataValues) {
    const updateResult = await adminUpdateDao({
      loginPwd: md5(loginPwd),
      name,
      loginId,
    });
    return updateResult
      ? formatResponseData(200, "success", {
          loginId,
          name,
          id: result.dataValues.id,
        })
      : null;
  } else {
    throw new ValidationError("密码错误");
  }
}
