import md5 from "md5";
import { adminLoginDao, adminUpdateDao } from "../dao/adminDao.js";
import jwt from "jsonwebtoken";
import { ValidationError } from "../utils/errors.js";
import { formatResponseData } from "../utils/tool.js";

// 登录服务
export async function adminLoginServer(loginInfo) {
  let { loginId, loginPwd } = loginInfo;

  // 检查密码是否已经是MD5格式（32位十六进制字符串）
  const isMD5 = /^[a-f0-9]{32}$/i.test(loginPwd);
  if (!isMD5) {
    loginPwd = md5(loginPwd); // 只有当密码不是MD5格式时才加密
  }

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
  let { loginId, name, loginPwd, oldLoginPwd, currentUserId } = updateInfo;

  // 如果提供了currentUserId（通过token验证），优先使用它来验证用户身份
  if (currentUserId) {
    // 通过ID验证用户是否存在
    const { adminDao } = await import("../dao/adminDao.js");
    const userResult = await adminDao.findByPk(currentUserId);
    if (!userResult) {
      throw new ValidationError("用户不存在");
    }
    const user = userResult.dataValues;

    // 如果提供了旧密码，需要验证旧密码
    if (oldLoginPwd) {
      const isOldPwdValid = user.loginPwd === md5(oldLoginPwd);
      if (!isOldPwdValid) {
        throw new ValidationError("旧密码错误");
      }
    }

    // 更新用户信息
    const updateResult = await adminUpdateDao({
      loginPwd: loginPwd ? md5(loginPwd) : user.loginPwd, // 如果没有提供新密码，保持原密码
      name: name || user.name,
      loginId: loginId || user.loginId,
      id: currentUserId,
    });

    return updateResult
      ? formatResponseData(200, "success", {
          loginId: loginId || user.loginId,
          name: name || user.name,
          id: currentUserId,
        })
      : null;
  } else {
    // 回退到原有逻辑（通过loginId和oldLoginPwd验证）
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
}
