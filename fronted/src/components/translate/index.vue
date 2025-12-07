<template>
  <div class="LanguageSelect ignore">
    <!-- 使用作用域插槽，将组件内部的数据和方法传递给父组件 -->
    <slot
      :LanguageSelectLanguageList="LanguageSelectLanguageList"
      :LanguageSelectOnChange="LanguageSelectOnChange"
    >
      <!-- el-popover 实现 -->
      <el-popover v-model:visible="popoverVisible" placement="bottom" :width="120" trigger="click">
        <template #reference>
          <div class="lang-selector ignore">
            <div class="whitespace-nowrap flex items-center gap-2">
              <img :src="i18n" alt="i18n" class="w-6 h-6 lt-md:w-4 lt-md:h-4" />
              <div class="i18n-text">{{ currentLanguageName }}</div>
            </div>
          </div>
        </template>
        <div class="lang-options">
          <div
            v-for="option in LanguageSelectLanguageList"
            :key="option.id"
            class="lang-option ignore"
            :class="{ active: language === option.id }"
            @click="handleLanguageClick(option.id)"
          >
            {{ option.name }}
          </div>
        </div>
      </el-popover>
    </slot>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, defineOptions } from 'vue'
// @ts-ignore: 静态资源声明
import i18n from '@/assets/i18n.png'

defineOptions({
  name: 'TranslateComponent',
})

// translate 全局对象
const translate = window.translate

// 选中的语言ID（双向绑定值）
const language = ref(null)

// 语言选项列表
const LanguageSelectLanguageList = ref([])

// popover 显示状态
const popoverVisible = ref(false)

// 计算当前语言名称
const currentLanguageName = computed(() => {
  const current = LanguageSelectLanguageList.value.find((item) => item.id === language.value)
  return current ? current.name : 'Language'
})

// 处理语言选择变化
const LanguageSelectOnChange = (event) => {
  // 从事件对象中获取选中的值
  const target = event.target
  const value = target.value

  language.value = value
  translate.selectLanguageTag.selectOnChange({
    target: {
      value: value,
    },
  })
}

// 处理点击语言选项
const handleLanguageClick = (langId) => {
  if (langId !== language.value) {
    language.value = langId

    // 映射 translate 语言 ID 到 Vue i18n 的 locale
    const langMap = {
      zh: 'zh-cn',
      chinese_simplified: 'zh-cn',
      chinese_traditional: 'zh-cn',
      en: 'en',
      english: 'en',
      ja: 'ja',
      japanese: 'ja',
      es: 'es',
      spanish: 'es',
    }

    const i18nLocale = langMap[langId.toLowerCase()] || langId

    // 更新 localStorage，供 Vue i18n 使用
    localStorage.setItem('language', i18nLocale)

    // 触发自定义事件，通知其他组件语言已更改
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { locale: i18nLocale } }))

    // 调用 translate 系统的语言切换
    translate.selectLanguageTag.selectOnChange({
      target: {
        value: langId,
      },
    })
  }
  // 关闭 popover
  popoverVisible.value = false
}

onMounted(() => {
  // 保留原有的初始化逻辑
  if (
    typeof translate == 'object' &&
    typeof translate.vue3 == 'object' &&
    typeof translate.vue3.isUse == 'boolean' &&
    translate.vue3.isUse == true
  ) {
    // 正常，需要的，需要加载多语言切换Select
  } else {
    // 不需要显示
    return
  }

  translate.time.log(translate.vue3.isUse)

  // 重写渲染语言下拉列表出现时的函数
  translate.selectLanguageTag.render = function () {
    if (translate.selectLanguageTag.alreadyRender) {
      return
    }
    translate.selectLanguageTag.alreadyRender = true

    // 判断如果不显示select选择语言，直接就隐藏掉
    if (!translate.selectLanguageTag.show) {
      return
    }

    // 从服务器加载支持的语言库
    if (
      typeof translate.request.api.language == 'string' &&
      translate.request.api.language.length > 0
    ) {
      // 从接口加载语种
      translate.request.post(
        translate.request.api.language,
        {},
        function (data) {
          if (data.result == 0) {
            console.log('load language list error : ' + data.info)
            return
          }
          translate.request.api.language = data.list // 进行缓存
          translate.selectLanguageTag.customUI(data.list)
        },
        null,
      )
    } else if (typeof translate.request.api.language == 'object') {
      // 无网络环境下，自定义显示语种
      translate.selectLanguageTag.customUI(translate.request.api.language)
    }

    // 显示切换语言
    const TranslateJsSelectLanguages = document.getElementsByClassName('LanguageSelect')
    for (let li = 0; li < TranslateJsSelectLanguages.length; li++) {
      const el = TranslateJsSelectLanguages[li]
      el.style.display = 'block'
    }
  }

  // 处理语言列表数据
  translate.selectLanguageTag.customUI = function (externalLanguageList) {
    // 整理允许显示的语种
    const allowLanguageList = []

    // 判断 selectLanguageTag.languages 中允许使用哪些
    if (translate.selectLanguageTag.languages.length > 0) {
      // 设置了自定义显示的语言
      // 都转小写判断
      const langs_indexof = (',' + translate.selectLanguageTag.languages + ',').toLowerCase()

      for (let i = 0; i < externalLanguageList.length; i++) {
        if (langs_indexof.indexOf(',' + externalLanguageList[i].id.toLowerCase() + ',') < 0) {
          // 没发现，那不显示这个语种，调出
          continue
        }
        allowLanguageList.push(externalLanguageList[i])
      }
    } else {
      // 显示所有
      allowLanguageList.push(...externalLanguageList)
    }
    // 赋予带渲染到界面的语言列表数据
    LanguageSelectLanguageList.value = allowLanguageList

    // 显示上一次切换后的语种
    language.value = translate.language.getCurrent()
  }

  // 渲染语言下拉列表出现
  translate.selectLanguageTag.refreshRender()
})
</script>

<style scoped lang="scss">
/* 避免被遮挡无法操作，设置z-index较高 */
.LanguageSelect {
  z-index: 2147483583;
  display: none;
}

.lang-selector {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.3s;
  color: var(--text-primary);
  background-color: var(--bg-secondary);
}

.lang-selector:hover {
  background-color: var(--hover-bg);
  color: #fff;
}

.lang-options {
  padding: 4px 0;
  background-color: var(--bg-secondary);
  color: var(--text-secondary);
  border-radius: 6px;
}

.lang-option {
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  border-radius: 4px;
}

.lang-option:hover {
  background-color: var(--hover-bg);
  color: #fff;
}

.lang-option.active {
  font-weight: 500;
}
.i18n-text {
  font-size: 16px;
  @media (max-width: 768px) {
    display: none;
  }
}

// Popover 被 teleport 到 body，使用全局选择器才能生效
:global(.el-popover.el-popper) {
  padding: 0 !important;
}
</style>
