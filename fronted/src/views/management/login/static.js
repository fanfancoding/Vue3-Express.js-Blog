export const rules = {
  loginId: [
    { required: true, message: '请输入登录ID', trigger: 'blur' },
    { min: 3, max: 20, message: '登录ID长度在 3 到 20 个字符', trigger: 'blur' },
  ],
  loginPwd: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' },
  ],
}
