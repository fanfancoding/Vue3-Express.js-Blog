<template>
  <div
    class="message-board-page max-w-1200px mx-auto p-20px lt-lg:max-w-100% lt-lg:p-15px lt-md:p-10px lt-sm:p-8px"
  >
    <div
      class="bg-white rounded-8px p-40px shadow-[0_2px_12px_rgba(0,0,0,0.1)] lt-md:p-24px lt-md:rounded-6px lt-sm:p-16px lt-sm:rounded-4px"
    >
      <!-- 标题 -->
      <h1
        class="text-32px font-bold text-[#82411c] mb-20px flex items-center gap-10px lt-md:text-24px lt-md:mb-16px lt-sm:text-20px lt-sm:mb-12px"
      >
        <el-icon :size="32" class="lt-md:text-24px lt-sm:text-20px">
          <ChatLineRound />
        </el-icon>
        <span>留言板</span>
      </h1>

      <!-- 留言表单 -->
      <div
        class="mb-30px p-20px bg-[#fef5f0] rounded-8px lt-md:p-16px lt-md:mb-20px lt-sm:p-12px lt-sm:mb-16px"
      >
        <h2
          class="text-20px font-semibold mb-16px text-[#82411c] flex items-center gap-8px lt-md:text-18px lt-md:mb-12px lt-sm:text-16px lt-sm:mb-10px"
        >
          <el-icon :size="20" class="lt-md:text-18px lt-sm:text-16px">
            <Message />
          </el-icon>
          <span>留下你的足迹</span>
        </h2>
        <el-form ref="formRef" :model="form" label-width="80px" class="lt-sm:label-width-60px">
          <el-form-item label="昵称" required>
            <el-input
              v-model="form.nickname"
              placeholder="怎么称呼你"
              :maxlength="50"
              show-word-limit
              clearable
              class="lt-sm:text-14px"
            />
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input
              v-model="form.email"
              placeholder="输入你的邮箱（可选）"
              type="email"
              clearable
              class="lt-sm:text-14px"
            />
          </el-form-item>
          <el-form-item label="留言内容" required>
            <el-input
              v-model="form.content"
              type="textarea"
              :rows="5"
              placeholder="请输入留言内容..."
              :maxlength="2000"
              show-word-limit
              clearable
              class="lt-sm:text-14px"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              :loading="submitting"
              class="lt-sm:text-14px submit-btn"
              style="background-color: #82411c; border-color: #82411c; color: #fff"
              @click="handleSubmit"
            >
              <el-icon style="color: #fff">
                <Message />
              </el-icon>
              <span class="ml-4px" style="color: #fff">提交留言</span>
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 留言列表 -->
      <div class="message-list">
        <h2
          class="text-24px font-semibold mb-20px text-[#82411c] lt-md:text-20px lt-md:mb-16px lt-sm:text-18px lt-sm:mb-12px"
        >
          留言列表 ({{ total }})
        </h2>

        <div v-loading="loading">
          <div
            v-if="messageList.length === 0 && !loading"
            class="empty-container p-40px lt-md:p-30px lt-sm:p-20px"
          >
            <el-empty description="暂无留言，快来成为第一个留言的人吧~" />
          </div>
          <template v-else>
            <div class="message-items">
              <el-card
                v-for="message in messageList"
                :key="message.id"
                class="message-item mb-16px"
                shadow="hover"
              >
                <div class="message-header flex items-start gap-16px lt-md:gap-12px lt-sm:gap-8px">
                  <div class="message-info flex-1 min-w-0">
                    <div
                      class="message-author flex items-center gap-8px mb-8px flex-wrap lt-sm:gap-4px lt-sm:mb-6px"
                    >
                      <span
                        class="font-semibold text-[#82411c] text-16px lt-md:text-15px lt-sm:text-14px"
                      >
                        {{ message.nickname }}
                      </span>
                      <span v-if="message.email" class="text-12px text-[#909399] lt-sm:text-11px">
                        ({{ message.email }})
                      </span>
                      <span class="text-12px text-[#c0c4cc] ml-auto lt-sm:text-11px">
                        {{ formatDate(message.createDate) }}
                      </span>
                    </div>
                    <div
                      class="message-content text-[#606266] whitespace-pre-wrap mb-12px text-15px lh-1.8 lt-md:text-14px lt-md:mb-10px lt-sm:text-13px lt-sm:mb-8px lt-sm:lh-1.6"
                    >
                      {{ message.content }}
                    </div>
                    <div
                      v-if="message.reply"
                      class="message-reply p-16px bg-[#fef5f0] rounded-6px border-l-4 border-[#82411c] lt-md:p-12px lt-sm:p-10px"
                    >
                      <div
                        class="reply-header flex items-center gap-8px mb-8px lt-sm:gap-4px lt-sm:mb-6px"
                      >
                        <el-icon class="text-[#82411c] text-16px lt-sm:text-14px">
                          <User />
                        </el-icon>
                        <span class="font-semibold text-[#82411c] text-14px lt-sm:text-13px"
                          >博主回复</span
                        >
                        <span
                          v-if="message.replyTime"
                          class="text-12px text-[#909399] ml-auto lt-sm:text-11px"
                        >
                          {{ formatDate(message.replyTime) }}
                        </span>
                      </div>
                      <div
                        class="reply-content text-[#606266] whitespace-pre-wrap text-14px lh-1.8 lt-sm:text-13px lt-sm:lh-1.6"
                      >
                        {{ message.reply }}
                      </div>
                    </div>
                  </div>
                </div>
              </el-card>
            </div>

            <!-- 分页 -->
            <div
              v-if="total > 0"
              class="pagination-container mt-20px flex justify-center lt-md:mt-16px lt-sm:mt-12px"
            >
              <el-pagination
                v-model:current-page="page"
                v-model:page-size="pageSize"
                :total="total"
                :page-sizes="[10, 20, 50]"
                layout="total, sizes, prev, pager, next"
                class="lt-sm:text-12px custom-pagination"
                @size-change="handleSizeChange"
                @current-change="handlePageChange"
              />
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Message, User, ChatLineRound } from '@element-plus/icons-vue'
import { createMessageRequest, getMessageListRequest } from '@/api/messageBoard'
import { handleResponse } from '@/utils/common'
import dayjs from 'dayjs'

defineOptions({
  name: 'MessageBoardPage',
})

const loading = ref(false)
const messageList = ref([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const submitting = ref(false)
const formRef = ref(null)

// 表单数据
const form = ref({
  nickname: '',
  email: '',
  content: '',
})

// 获取留言列表
const getMessageList = async () => {
  loading.value = true
  try {
    const res = await getMessageListRequest({
      page: page.value,
      pageSize: pageSize.value,
    })
    const data = handleResponse(res, false)
    messageList.value = data.list || []
    total.value = data.total || 0
  } catch (error) {
    ElMessage.error('获取留言列表失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 提交留言
const handleSubmit = async () => {
  if (!form.value.nickname.trim()) {
    ElMessage.warning('请输入昵称')
    return
  }
  if (!form.value.content.trim()) {
    ElMessage.warning('请输入留言内容')
    return
  }
  if (form.value.content.trim().length > 2000) {
    ElMessage.warning('留言内容不能超过2000个字符')
    return
  }
  if (form.value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    ElMessage.warning('邮箱格式不正确')
    return
  }

  submitting.value = true
  try {
    await createMessageRequest({
      nickname: form.value.nickname.trim(),
      email: form.value.email.trim() || undefined,
      content: form.value.content.trim(),
    })
    ElMessage.success('留言成功，等待审核通过后将会显示！')
    form.value = {
      nickname: '',
      email: '',
      content: '',
    }
    formRef.value?.resetFields()
    page.value = 1
    getMessageList()
  } catch (error) {
    ElMessage.error('留言失败，请稍后重试')
    console.error(error)
  } finally {
    submitting.value = false
  }
}

// 分页变化
const handlePageChange = (val) => {
  page.value = val
  getMessageList()
}

const handleSizeChange = () => {
  page.value = 1
  getMessageList()
}

// 格式化日期
const formatDate = (date) => {
  if (!date) return ''
  // Sequelize返回的日期可能是Date对象、时间戳字符串或时间戳数字
  if (date instanceof Date) {
    return dayjs(date).format('YYYY-MM-DD HH:mm')
  }
  // 如果是字符串，尝试转换为数字
  const ts = typeof date === 'string' ? Number(date) : date
  // 检查是否是有效的时间戳（大于1000000000000，即2001年之后）
  if (isNaN(ts) || ts < 1000000000000) {
    // 如果不是时间戳，尝试直接解析为日期字符串
    return dayjs(date).isValid() ? dayjs(date).format('YYYY-MM-DD HH:mm') : ''
  }
  return dayjs(ts).format('YYYY-MM-DD HH:mm')
}

onMounted(() => {
  getMessageList()
})
</script>

<style scoped>
.message-board-page .submit-btn {
  color: #fff !important;
}

.message-board-page .submit-btn .el-icon,
.message-board-page .submit-btn span {
  color: #fff !important;
}

.message-board-page .submit-btn:hover {
  background-color: #6b3517 !important;
  border-color: #6b3517 !important;
  color: #fff !important;
}

.message-board-page .submit-btn:hover .el-icon,
.message-board-page .submit-btn:hover span {
  color: #fff !important;
}

.message-board-page .submit-btn:active {
  background-color: #5a2b13 !important;
  border-color: #5a2b13 !important;
  color: #fff !important;
}

.message-board-page .submit-btn:active .el-icon,
.message-board-page .submit-btn:active span {
  color: #fff !important;
}

.message-board-page .submit-btn.is-loading {
  color: #fff !important;
}

.message-board-page .submit-btn.is-loading .el-icon {
  color: #fff !important;
}

/* 分页器样式 */
.message-board-page .custom-pagination .el-pager li.is-active {
  background-color: #82411c !important;
  color: #fff !important;
}

.message-board-page .custom-pagination .el-pager li.is-active:hover {
  color: #fff !important;
}

.message-board-page .custom-pagination .el-pager li:not(.is-active) {
  color: #606266;
}

.message-board-page .custom-pagination .el-pager li:not(.is-active):hover {
  color: #82411c !important;
}

.message-board-page .custom-pagination .el-pager li:not(.is-active):active {
  color: #82411c !important;
}

.message-board-page .custom-pagination .btn-next:hover:not(:disabled),
.message-board-page .custom-pagination .btn-prev:hover:not(:disabled) {
  color: #82411c !important;
}

.message-board-page .custom-pagination .btn-next:disabled,
.message-board-page .custom-pagination .btn-prev:disabled {
  color: #c0c4cc !important;
}

.message-board-page .custom-pagination button {
  color: #606266;
}

.message-board-page .custom-pagination button:hover:not(:disabled) {
  color: #82411c !important;
}

.message-board-page .custom-pagination .el-select {
  --el-select-input-color: #606266;
  --el-select-input-focus-border-color: #82411c;
  --el-select-border-color-hover: #82411c;
}

.message-board-page .custom-pagination .el-select .el-select__wrapper.is-focused,
.message-board-page .custom-pagination .el-select .el-select__wrapper.is-hovering {
  box-shadow: 0 0 0 1px #82411c inset !important;
  border-color: #82411c !important;
  background-color: #fff;
}

.message-board-page .custom-pagination .el-select .el-select__wrapper.is-focused.is-hovering {
  box-shadow: 0 0 0 1px #82411c inset !important;
  border-color: #82411c !important;
}

.message-board-page .custom-pagination .el-select .el-select__wrapper .el-select__caret {
  color: #606266;
}

.message-board-page .custom-pagination .el-select .el-select__wrapper.is-hovering .el-select__caret,
.message-board-page .custom-pagination .el-select .el-select__wrapper.is-focused .el-select__caret {
  color: #82411c !important;
}

.message-board-page .custom-pagination .el-select .el-input__inner:focus {
  border-color: #82411c !important;
}

.message-board-page .custom-pagination .el-select:hover .el-input__inner {
  border-color: #82411c !important;
}

.message-board-page .custom-pagination .el-select .el-input__wrapper.is-focus,
.message-board-page .custom-pagination .el-select .el-input__wrapper:hover {
  box-shadow: 0 0 0 1px #82411c inset !important;
}

.message-board-page .custom-pagination .el-select .el-input__suffix .el-select__caret {
  color: #606266;
}

.message-board-page .custom-pagination .el-select:hover .el-input__suffix .el-select__caret {
  color: #82411c !important;
}

.message-board-page .custom-pagination .el-pagination__total {
  color: #606266;
}
</style>

<style>
/* 下拉菜单样式（全局，因为下拉菜单在body下） */
.el-select-dropdown {
  --el-color-primary: #82411c;
}

.el-select-dropdown__item.selected,
.el-select-dropdown__item.is-selected {
  color: #82411c !important;
  background-color: #fef5f0 !important;
  --el-color-primary: #82411c;
}

.el-select-dropdown__item.selected span,
.el-select-dropdown__item.selected *,
.el-select-dropdown__item.is-selected span,
.el-select-dropdown__item.is-selected * {
  color: #82411c !important;
}

.el-select-dropdown__item.selected:hover,
.el-select-dropdown__item.is-selected:hover {
  color: #82411c !important;
  background-color: #fef5f0 !important;
}

.el-select-dropdown__item.selected:hover *,
.el-select-dropdown__item.is-selected:hover * {
  color: #82411c !important;
}

.el-select-dropdown__item.selected .el-icon,
.el-select-dropdown__item.is-selected .el-icon {
  color: #82411c !important;
}

.el-select-dropdown__item:hover {
  background-color: #fef5f0 !important;
  color: #82411c !important;
}
.el-pager li.is-active {
  background-color: #82411c !important;
  color: #fff !important;
}
.el-select__wrapper.is-focused {
  box-shadow: 0 0 0 1px #82411c inset !important;
  border-color: #82411c !important;
}
</style>
