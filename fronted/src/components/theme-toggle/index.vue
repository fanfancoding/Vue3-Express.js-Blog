<template>
  <div class="theme-toggle ignore">
    <el-switch
      v-model="isDark"
      :active-icon="Moon"
      :inactive-icon="Sunny"
      @change="handleThemeToggle"
      class="theme-switch"
      size="medium"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, defineOptions } from 'vue'
import { Sunny, Moon } from '@element-plus/icons-vue'

defineOptions({
  name: 'ThemeToggleComponent',
})

// 主题状态
const isDark = ref(false)

// 主题切换处理函数
const handleThemeToggle = () => {
  const theme = isDark.value ? 'dark' : 'light'
  applyTheme(theme)
  localStorage.setItem('theme', theme)
}

// 应用主题
const applyTheme = (theme) => {
  const root = document.documentElement

  if (theme === 'dark') {
    // 深色主题
    root.style.setProperty('--bg-primary', '#1a1a1a')
    root.style.setProperty('--bg-secondary', '#2a2a2a')
    root.style.setProperty('--text-primary', '#ffffff')
    root.style.setProperty('--text-secondary', '#cccccc')
    root.style.setProperty('--accent-color', '#cccccc')
    root.style.setProperty('--border-color', '#404040')
    root.style.setProperty('--hover-bg', '#404040')
    root.style.setProperty('--dropdown-bg', '#2a2a2a')
    root.style.setProperty('--footer-bg', '#1a1a1a')
  } else {
    // 浅色主题
    root.style.setProperty('--bg-primary', '#eef0f3')
    root.style.setProperty('--bg-secondary', '#ffffff')
    root.style.setProperty('--text-primary', '#82411c')
    root.style.setProperty('--text-secondary', '#666666')
    root.style.setProperty('--accent-color', '#82411c')
    root.style.setProperty('--border-color', '#d3d3d3')
    root.style.setProperty('--hover-bg', '#82411c')
    root.style.setProperty('--dropdown-bg', '#ebeef1')
    root.style.setProperty('--footer-bg', '#eef0f3')
  }
}

// 初始化主题
onMounted(() => {
  const savedTheme = localStorage.getItem('theme') || 'light'
  isDark.value = savedTheme === 'dark'
  applyTheme(savedTheme)
})
</script>

<style scoped lang="scss">
.theme-toggle {
  display: flex;
  align-items: center;
  line-height: 1;

  .theme-switch {
    display: flex;
    align-items: center;

    :deep(.el-switch__core) {
      background: linear-gradient(135deg, #c1b2a3 0%, #913301 100%);
      border-color: transparent;

      &::after {
        background-color: #ffffff;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }
    }

    :deep(.el-switch__label.is-active) {
      color: var(--text-primary);
    }
    :deep(.el-switch__label) {
      color: var(--text-primary);
    }

    :deep(.el-switch.is-checked .el-switch__core) {
      background: linear-gradient(135deg, #a15d33 0%, #82411c 100%);
      border-color: transparent;

      &::after {
        background-color: #ffffff;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }
    }

    @media (max-width: 768px) {
      display: none;
    }
  }
}
</style>
