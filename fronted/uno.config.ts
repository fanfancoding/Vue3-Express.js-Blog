import { defineConfig } from 'unocss'
import presetUno from '@unocss/preset-uno'
import presetAttributify from '@unocss/preset-attributify'
import presetIcons from '@unocss/preset-icons'

export default defineConfig({
  presets: [presetUno(), presetAttributify(), presetIcons()],
  theme: {
    colors: {
      primary: {
        50: '#f0f4ff',
        100: '#e0e9ff',
        200: '#c7d7fe',
        300: '#a4b8fc',
        400: '#8194f8',
        500: '#667eea',
        600: '#5a67d8',
        700: '#4c51bf',
        800: '#434190',
        900: '#3c366b',
      },
      purple: {
        50: '#faf5ff',
        100: '#f3e8ff',
        200: '#e9d5ff',
        300: '#d8b4fe',
        400: '#c084fc',
        500: '#a855f7',
        600: '#9333ea',
        700: '#7e22ce',
        800: '#6b21a8',
        900: '#581c87',
      },
    },
  },
  shortcuts: {
    'gradient-primary': 'bg-gradient-to-br from-primary-500 to-purple-600',
    'text-gradient':
      'bg-gradient-to-r from-primary-500 to-purple-600 bg-clip-text text-transparent',
  },
  rules: [
    // 修复行高规则 - lh-数字 应该生成 line-height: 数字（无单位）
    [
      /^lh-(\d+\.?\d*)$/,
      ([, d]) => ({ 'line-height': d }),
    ],
    [
      /^animate-fadeInUp$/,
      () => ({
        animation: 'fadeInUp 0.8s ease',
      }),
    ],
    [
      /^animate-fadeIn$/,
      () => ({
        animation: 'fadeIn 0.5s ease',
      }),
    ],
  ],
  safelist: ['filter-tab', 'filter-tab.active'],
})
