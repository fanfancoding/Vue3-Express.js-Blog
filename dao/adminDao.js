// 该文件负责和数据库交互
import { AdminModal } from "./model/adminModal.js";

// 登录Dao
export async function adminLoginDao(loginInfo) {
  const { loginId, loginPwd } = loginInfo;
  return await AdminModal.findOne({
    where: {
      loginId,
      loginPwd,
    },
  });
}

// 修改账号信息Dao
export async function adminUpdateDao(updateInfo) {
  const { loginId, name, loginPwd } = updateInfo;
  return await AdminModal.update(updateInfo, {
    where: {
      loginId,
    },
  });
}
