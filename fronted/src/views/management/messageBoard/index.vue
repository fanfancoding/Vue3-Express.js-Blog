<template>
  <div class="message-board-management">
    <!-- 页面标题和统计 -->
    <div class="page-header">
      <h2>留言板管理</h2>
      <div class="stats-container">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-label">总留言数</div>
            <div class="stat-value text-primary">{{ stats.total || 0 }}</div>
          </div>
        </el-card>
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-label">待审核</div>
            <div class="stat-value text-warning">{{ stats.pending || 0 }}</div>
          </div>
        </el-card>
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-label">已发布</div>
            <div class="stat-value text-success">{{ stats.approved || 0 }}</div>
          </div>
        </el-card>
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-label">已回复</div>
            <div class="stat-value text-info">{{ stats.replied || 0 }}</div>
          </div>
        </el-card>
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-label">未回复</div>
            <div class="stat-value text-gray">{{ stats.unreplied || 0 }}</div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 搜索区域 -->
    <div class="search-container">
      <el-form ref="searchFormRef" :model="searchForm" inline>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="全部" clearable style="width: 150px">
            <el-option label="待审核" :value="1" />
            <el-option label="已发布" :value="2" />
            <el-option label="已删除" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 操作栏 -->
    <div class="action-bar">
      <el-button type="success" :disabled="selectedIds.length === 0" @click="handleBatchApprove">
        批量审核通过
      </el-button>
      <el-button type="danger" :disabled="selectedIds.length === 0" @click="handleBatchDelete">
        批量删除
      </el-button>
    </div>

    <!-- 留言表格 -->
    <div class="table-container">
      <el-table
        v-loading="loading"
        :data="messageList"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="留言者" width="150">
          <template #default="{ row }">
            <div>
              <div class="font-semibold">{{ row.nickname }}</div>
              <div v-if="row.email" class="text-xs text-gray-500">{{ row.email }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="留言内容" min-width="300" show-overflow-tooltip />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 2 ? 'success' : row.status === 1 ? 'warning' : 'info'">
              {{ row.status === 2 ? '已发布' : row.status === 1 ? '待审核' : '已删除' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="回复状态" width="120">
          <template #default="{ row }">
            <el-tag :type="row.reply ? 'success' : 'warning'">
              {{ row.reply ? '已回复' : '未回复' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="留言时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createDate) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="{ row }">
            <el-button
              v-if="row.status === 1"
              size="small"
              type="success"
              @click="handleApprove(row)"
            >
              审核通过
            </el-button>
            <el-button
              v-if="row.status === 1"
              size="small"
              type="warning"
              @click="handleReject(row)"
            >
              拒绝
            </el-button>
            <el-button
              v-if="!row.reply && row.status === 2"
              size="small"
              type="primary"
              @click="handleReply(row)"
            >
              回复
            </el-button>
            <el-button
              v-if="row.reply && row.status === 2"
              size="small"
              type="info"
              @click="handleReply(row)"
            >
              修改回复
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="pagination.currentPage"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 回复对话框 -->
    <el-dialog
      v-model="replyDialogVisible"
      :title="currentMessage?.reply ? '修改回复' : '回复留言'"
      width="600px"
    >
      <div class="message-preview mb-4 p-4 bg-gray-50 rounded">
        <div class="flex items-center gap-2 mb-2">
          <div>
            <div class="font-semibold">{{ currentMessage?.nickname }}</div>
            <div class="text-xs text-gray-500">{{ formatDate(currentMessage?.createDate) }}</div>
          </div>
        </div>
        <div class="text-gray-700 whitespace-pre-wrap">{{ currentMessage?.content }}</div>
      </div>
      <el-form :model="replyForm" label-width="80px">
        <el-form-item label="回复内容" required>
          <el-input
            v-model="replyForm.reply"
            type="textarea"
            :rows="5"
            placeholder="请输入回复内容..."
            maxlength="2000"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="replyDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitReply" :loading="replyLoading">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getMessageListAdminRequest,
  replyMessageRequest,
  deleteMessageRequest,
  batchDeleteMessageRequest,
  getMessageStatsRequest,
  approveMessageRequest,
  rejectMessageRequest,
  batchApproveMessageRequest,
} from '@/api/messageBoard'
import { handleResponse } from '@/utils/common'
import dayjs from 'dayjs'

defineOptions({
  name: 'MessageBoardManagement',
})

const loading = ref(false)
const messageList = ref([])
const stats = ref({})
const selectedIds = ref([])

// 搜索表单
const searchForm = ref({
  status: undefined,
})
const searchFormRef = ref(null)

// 分页
const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0,
})

// 回复对话框
const replyDialogVisible = ref(false)
const replyLoading = ref(false)
const currentMessage = ref(null)
const replyForm = ref({
  reply: '',
})

// 获取留言列表
const getMessageList = async () => {
  loading.value = true
  try {
    const res = await getMessageListAdminRequest({
      page: pagination.value.currentPage,
      pageSize: pagination.value.pageSize,
      status: searchForm.value.status,
    })
    const data = handleResponse(res, false)
    messageList.value = data.list || []
    pagination.value.total = data.total || 0
  } catch (error) {
    ElMessage.error('获取留言列表失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 获取统计信息
const getStats = async () => {
  try {
    const res = await getMessageStatsRequest()
    stats.value = handleResponse(res, false) || {}
  } catch (error) {
    console.error('获取统计信息失败:', error)
  }
}

// 搜索
const handleSearch = () => {
  pagination.value.currentPage = 1
  getMessageList()
}

// 重置
const handleReset = () => {
  searchForm.value = {
    status: undefined,
  }
  searchFormRef.value?.resetFields()
  handleSearch()
}

// 分页变化
const handleSizeChange = () => {
  pagination.value.currentPage = 1
  getMessageList()
}

const handleCurrentChange = () => {
  getMessageList()
}

// 选择变化
const handleSelectionChange = (selection) => {
  selectedIds.value = selection.map((item) => item.id)
}

// 回复留言
const handleReply = (message) => {
  currentMessage.value = message
  replyForm.value.reply = message.reply || ''
  replyDialogVisible.value = true
}

// 提交回复
const handleSubmitReply = async () => {
  if (!replyForm.value.reply.trim()) {
    ElMessage.warning('请输入回复内容')
    return
  }

  replyLoading.value = true
  try {
    await replyMessageRequest(currentMessage.value.id, replyForm.value.reply)
    ElMessage.success('回复成功')
    replyDialogVisible.value = false
    getMessageList()
    getStats()
  } catch (error) {
    ElMessage.error('回复失败')
    console.error(error)
  } finally {
    replyLoading.value = false
  }
}

// 删除留言
const handleDelete = async (message) => {
  try {
    await ElMessageBox.confirm('确定要删除这条留言吗？', '提示', {
      type: 'warning',
    })
    await deleteMessageRequest(message.id)
    ElMessage.success('删除成功')
    getMessageList()
    getStats()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
      console.error(error)
    }
  }
}

// 审核通过
const handleApprove = async (message) => {
  try {
    await ElMessageBox.confirm('确定要通过这条留言吗？', '提示', {
      type: 'warning',
    })
    await approveMessageRequest(message.id)
    ElMessage.success('审核通过')
    getMessageList()
    getStats()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('审核失败')
      console.error(error)
    }
  }
}

// 拒绝留言
const handleReject = async (message) => {
  try {
    await ElMessageBox.confirm('确定要拒绝这条留言吗？', '提示', {
      type: 'warning',
    })
    await rejectMessageRequest(message.id)
    ElMessage.success('已拒绝')
    getMessageList()
    getStats()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('拒绝失败')
      console.error(error)
    }
  }
}

// 批量审核通过
const handleBatchApprove = async () => {
  try {
    await ElMessageBox.confirm(`确定要通过选中的 ${selectedIds.value.length} 条留言吗？`, '提示', {
      type: 'warning',
    })
    await batchApproveMessageRequest(selectedIds.value)
    ElMessage.success('批量审核通过')
    selectedIds.value = []
    getMessageList()
    getStats()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('批量审核失败')
      console.error(error)
    }
  }
}

// 批量删除
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 条留言吗？`, '提示', {
      type: 'warning',
    })
    await batchDeleteMessageRequest(selectedIds.value)
    ElMessage.success('批量删除成功')
    selectedIds.value = []
    getMessageList()
    getStats()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('批量删除失败')
      console.error(error)
    }
  }
}

// 格式化日期
const formatDate = (date) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

onMounted(() => {
  getMessageList()
  getStats()
})
</script>

<style lang="scss" scoped>
.message-board-management {
  .page-header {
    margin-bottom: 20px;

    h2 {
      margin-bottom: 20px;
      font-size: 24px;
      font-weight: 600;
    }

    .stats-container {
      display: flex;
      gap: 16px;
      margin-bottom: 20px;

      @media (max-width: 768px) {
        flex-direction: column;
      }

      .stat-card {
        flex: 1;

        .stat-item {
          text-align: center;

          .stat-label {
            font-size: 14px;
            color: #909399;
            margin-bottom: 8px;
          }

          .stat-value {
            font-size: 24px;
            font-weight: 600;
          }
        }
      }
    }
  }

  .search-container {
    margin-bottom: 20px;
    padding: 20px;
    background: #fff;
    border-radius: 8px;
  }

  .action-bar {
    margin-bottom: 20px;
  }

  .table-container {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
  }

  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }

  .message-preview {
    max-height: 200px;
    overflow-y: auto;
  }
}
</style>
