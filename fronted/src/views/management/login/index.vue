<template>
  <div class="login-container">
    <div class="login-form">
      <h1 class="login-title">管理员登录</h1>
      <el-form :model="myForm" :rules="rules" ref="myFormModalRef" label-width="120px">
        <el-form-item label="登录ID" prop="loginId">
          <el-input v-model="myForm.loginId" placeholder="请输入登录ID" />
        </el-form-item>
        <el-form-item label="密码" prop="loginPwd">
          <el-input v-model="myForm.loginPwd" placeholder="请输入密码" type="password" />
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
import { login } from '@/api/manage'
import { useUserStore } from '@/stores'

defineOptions({
  name: 'LoginPage',
})

const router = useRouter()
const userStore = useUserStore()
const loginLoading = ref(false)

const { myForm, myFormModalRef } = useFormModal({
  loginId: '',
  loginPwd: '',
})

// 表单验证规则
const rules = {
  loginId: [
    { required: true, message: '请输入登录ID', trigger: 'blur' },
    { min: 3, max: 20, message: '登录ID长度在 3 到 20 个字符', trigger: 'blur' },
  ],
  loginPwd: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' },
  ],
}

// 登录处理
async function handleLogin() {
  try {
    await myFormModalRef.value.validate()
    loginLoading.value = true

    const res = await login({
      loginId: myForm.loginId,
      loginPwd: encryptPassword(myForm.loginPwd),
      remember: 7,
    })

    if (res.data.code === 200) {
      // 保存用户信息和token
      // 后端通过Authorization响应头返回token
      const token = res.headers.authorization || res.headers.Authorization
      if (token) {
        userStore.login(token, res.data.data)
        ElMessage.success('登录成功')
        router.push('/management')
      } else {
        ElMessage.error('登录失败：未获取到token')
        refreshCaptcha()
      }
    } else {
      ElMessage.error(res.data.msg || '登录失败')
    }
  } catch (error) {
    console.error('登录失败:', error)
    ElMessage.error(error.response?.data?.msg || '登录失败')
  } finally {
    loginLoading.value = false
  }
}
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
