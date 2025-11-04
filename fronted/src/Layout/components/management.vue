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
                <el-dropdown-item>个人资料</el-dropdown-item>
                <el-dropdown-item>修改密码</el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <span>管理员</span>
        </div>
      </el-header>

      <el-main>
        <el-scrollbar>
          <router-view />
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { defineOptions, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Document, List, Folder, User, Setting } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

defineOptions({
  name: 'ManagementPage',
})

const route = useRoute()
const router = useRouter()

// 计算当前激活的菜单项
const activeMenu = computed(() => {
  return route.path
})

// 处理退出登录
const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    // 这里可以添加退出登录的逻辑，比如清除token等
    // localStorage.removeItem('token')

    ElMessage.success('退出登录成功')
    router.push('/login')
  } catch {
    // 用户取消退出
  }
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
