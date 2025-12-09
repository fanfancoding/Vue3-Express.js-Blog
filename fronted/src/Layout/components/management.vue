<template>
  <el-container class="layout-container-demo" style="height: 100vh">
    <el-aside width="200px">
      <el-scrollbar>
        <el-menu
          :default-active="activeMenu"
          router
          background-color="#f5f7fa"
          text-color="#303133"
          active-text-color="#409eff"
        >
          <el-sub-menu index="1">
            <template #title>
              <el-icon><Document /></el-icon>
              <span>文章管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/management/article">
                <el-icon><List /></el-icon>
                <span>文章列表</span>
              </el-menu-item>
              <el-menu-item index="/management/category">
                <el-icon><Folder /></el-icon>
                <span>文章分类</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
          <el-menu-item index="/management/message-board">
            <el-icon><ChatLineRound /></el-icon>
            <span>留言板管理</span>
          </el-menu-item>
          <el-menu-item index="/management/user">
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </el-menu-item>
          <el-menu-item index="/management/settings">
            <el-icon><Setting /></el-icon>
            <span>系统设置</span>
          </el-menu-item>
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <div class="toolbar">
          <el-dropdown>
            <el-icon style="margin-right: 8px; margin-top: 1px">
              <setting />
            </el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleUpdateInfo">修改信息</el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <span>{{ userStore.userInfo.name }}</span>
        </div>
      </el-header>

      <el-main>
        <el-scrollbar>
          <router-view />
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
  <el-dialog
    v-model="updateInfoDialogVisible"
    title="修改信息"
    width="30%"
    @close="handleDialogClose"
  >
    <el-form :model="updateInfoForm" :rules="rules" ref="updateInfoFormRef" label-width="120px">
      <el-form-item label="登录ID" prop="loginId">
        <el-input v-model="updateInfoForm.loginId" placeholder="请输入登录ID" />
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="updateInfoForm.name" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="旧密码" prop="oldLoginPwd">
        <el-input
          v-model="updateInfoForm.oldLoginPwd"
          type="password"
          placeholder="请输入旧密码"
          show-password
        />
      </el-form-item>
      <el-form-item label="新密码" prop="loginPwd">
        <el-input
          v-model="updateInfoForm.loginPwd"
          type="password"
          placeholder="不修改密码请留空"
          show-password
        />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input
          v-model="updateInfoForm.confirmPassword"
          type="password"
          placeholder="请再次输入新密码"
          show-password
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="updateInfoDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmitUpdateInfo" :loading="submitLoading"
        >确定</el-button
      >
    </template>
  </el-dialog>
</template>

<script setup>
import { defineOptions, computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Document, List, Folder, Setting, ChatLineRound, User } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { updateAdminInfoRequest } from '@/api/manage'
import { useUserStore } from '@/stores'

defineOptions({
  name: 'ManagementPage',
})

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 组件挂载时检查认证状态
onMounted(() => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录后再访问管理后台')
    router.push('/login')
  }
})

// 计算当前激活的菜单项
const activeMenu = computed(() => {
  return route.path
})

// 修改信息相关状态
const updateInfoDialogVisible = ref(false)
const updateInfoFormRef = ref(null)
const submitLoading = ref(false)
const updateInfoForm = ref({
  loginId: '',
  name: '',
  oldLoginPwd: '',
  loginPwd: '',
  confirmPassword: '',
})

// 自定义验证规则
const validateConfirmPassword = (rule, value, callback) => {
  if (updateInfoForm.value.loginPwd && !value) {
    callback(new Error('请再次输入新密码'))
  } else if (value && value !== updateInfoForm.value.loginPwd) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

// 表单验证规则
const rules = {
  loginId: [
    { required: true, message: '请输入登录ID', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
  ],
  oldLoginPwd: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
  loginPwd: [{ min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }],
  confirmPassword: [{ validator: validateConfirmPassword, trigger: 'blur' }],
}

// 处理退出登录
const handleLogout = async () => {
  await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })

  // 清除用户信息和token
  userStore.logout()
  ElMessage.success('退出登录成功')
  router.push('/login')
}

// 打开修改信息对话框
const handleUpdateInfo = () => {
  // 从 store 中获取当前用户信息并填充表单
  const currentUser = userStore.userInfo
  updateInfoForm.value = {
    loginId: currentUser.loginId || '',
    name: currentUser.name || '',
    oldLoginPwd: '',
    loginPwd: '',
    confirmPassword: '',
  }
  updateInfoDialogVisible.value = true
}

// 关闭对话框时重置表单
const handleDialogClose = () => {
  updateInfoFormRef.value?.resetFields()
}

// 提交修改信息
const handleSubmitUpdateInfo = async () => {
  if (!updateInfoFormRef.value) return

  // 验证表单
  await updateInfoFormRef.value.validate()

  submitLoading.value = true

  // 准备提交数据
  const submitData = {
    loginId: updateInfoForm.value.loginId,
    name: updateInfoForm.value.name,
    oldLoginPwd: updateInfoForm.value.oldLoginPwd,
  }

  // 如果填写了新密码，才添加到提交数据中
  if (updateInfoForm.value.loginPwd) {
    submitData.loginPwd = updateInfoForm.value.loginPwd
  }

  // 调用接口
  const res = await updateAdminInfoRequest(submitData)
  if (res.data.code === 200) {
    ElMessage.success('修改信息成功')
    // 更新 store 中的用户信息
    userStore.setUserInfo({
      ...userStore.userInfo,
      loginId: updateInfoForm.value.loginId,
      name: updateInfoForm.value.name,
    })
    submitLoading.value = false
  } else {
    ElMessage.error(res.data.msg)
  }

  // 关
}
</script>

<style scoped>
.layout-container-demo .el-header {
  position: relative;
  background-color: #dee0e2;
  color: var(--el-text-color-primary);
}
.layout-container-demo .el-aside {
  color: var(--el-text-color-primary);
  background: #f4f6f9;
}
.layout-container-demo .el-menu {
  border-right: none;
}
.layout-container-demo .el-main {
  padding: 0;
}
.layout-container-demo .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}
</style>
