<template>
  <div class="login-container">
    <div class="login-form">
      <h1 class="login-title">管理员登录</h1>
      <el-form :model="myForm" :rules="rules" ref="myFormModalRef" label-width="120px">
        <el-form-item label="用户名" prop="name">
          <el-input v-model="myForm.name" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="登录ID" prop="loginId">
          <el-input v-model="myForm.loginId" placeholder="请输入登录ID" />
        </el-form-item>
        <el-form-item label="密码" prop="loginPwd">
          <el-input v-model="myForm.loginPwd" placeholder="请输入密码" type="password" />
        </el-form-item>
        <el-form-item label="验证码" prop="captcha">
          <div class="captcha-container">
            <el-input 
              v-model="myForm.captcha" 
              placeholder="请输入验证码" 
              class="captcha-input"
              maxlength="4"
            />
            <div class="captcha-image" @click="refreshCaptcha">
              <img v-if="captchaUrl" :src="captchaUrl" alt="验证码" />
              <div v-else class="captcha-loading">加载中...</div>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin" :loading="loginLoading">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { defineOptions, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { encryptPassword } from '@/utils/md5'
import { useFormModal } from '@/hooks/formModal'
import { login, getCaptcha } from '@/api/manage'
import { useUserStore } from '@/stores'

defineOptions({
  name: 'LoginPage',
})

const router = useRouter()
const userStore = useUserStore()
const loginLoading = ref(false)
const captchaUrl = ref('')

const { myForm, myFormModalRef } = useFormModal({
  name: '',
  loginId: '',
  loginPwd: '',
  captcha: '',
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  loginId: [
    { required: true, message: '请输入登录ID', trigger: 'blur' },
    { min: 3, max: 20, message: '登录ID长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  loginPwd: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 4, message: '验证码长度为4位', trigger: 'blur' }
  ]
}

// 获取验证码
async function loadCaptcha() {
  try {
    const response = await getCaptcha()
    // 将blob转换为URL
    const blob = new Blob([response.data], { type: 'image/svg+xml' })
    captchaUrl.value = URL.createObjectURL(blob)
  } catch (error) {
    console.error('获取验证码失败:', error)
    ElMessage.error('获取验证码失败')
  }
}

// 刷新验证码
function refreshCaptcha() {
  // 清除旧的URL
  if (captchaUrl.value) {
    URL.revokeObjectURL(captchaUrl.value)
  }
  myForm.captcha = '' // 清空验证码输入
  loadCaptcha()
}

// 登录处理
async function handleLogin() {
  try {
    await myFormModalRef.value.validate()
    loginLoading.value = true
    
    const res = await login({
      name: myForm.name,
      loginId: myForm.loginId,
      loginPwd: encryptPassword(myForm.loginPwd),
      captcha: myForm.captcha,
    })
    
    if (res.data.code === 200) {
      // 保存用户信息和token
      const token = res.headers.authorization
      userStore.login(token, res.data.data)
      
      ElMessage.success('登录成功')
      router.push('/management')
    } else {
      ElMessage.error(res.data.msg || '登录失败')
      refreshCaptcha() // 登录失败刷新验证码
    }
  } catch (error) {
    console.error('登录失败:', error)
    ElMessage.error(error.response?.data?.msg || '登录失败')
    refreshCaptcha() // 登录失败刷新验证码
  } finally {
    loginLoading.value = false
  }
}

// 组件挂载时加载验证码
onMounted(() => {
  loadCaptcha()
})
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-form {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-title {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-size: 24px;
  font-weight: 500;
}

.captcha-container {
  display: flex;
  gap: 10px;
  align-items: center;
}

.captcha-input {
  flex: 1;
}

.captcha-image {
  width: 120px;
  height: 40px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  transition: all 0.3s;

  &:hover {
    border-color: #409eff;
    background: #ecf5ff;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.captcha-loading {
  font-size: 12px;
  color: #909399;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #606266;
}

:deep(.el-button) {
  width: 100%;
  height: 40px;
  font-size: 16px;
}
</style>
