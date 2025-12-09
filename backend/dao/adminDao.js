// 该文件负责和数据库交互
import { adminModel } from "./model/adminModel.js";

// 登录Dao
export async function adminLoginDao(loginInfo) {
  const { loginId, loginPwd } = loginInfo;
  return await adminModel.findOne({
    where: {
      loginId,
      loginPwd,
    },
  });
}

// 修改账号信息Dao
export async function adminUpdateDao(updateInfo) {
  const { id, loginId, name, loginPwd } = updateInfo;

  // 如果提供了ID，通过ID更新，否则通过loginId更新
  const whereCondition = id ? { id } : { loginId };

  return await adminModel.update(updateInfo, {
    where: whereCondition,
  });
}
