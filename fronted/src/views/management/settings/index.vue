<template>
  <div class="settings-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>系统设置</h2>
    </div>

    <el-tabs v-model="activeTab" class="settings-tabs">
      <!-- 基本设置 -->
      <el-tab-pane label="基本设置" name="basic">
        <el-card class="settings-card">
          <template #header>
            <div class="card-header">
              <span>网站基本信息</span>
            </div>
          </template>
          <el-form
            ref="basicFormRef"
            :model="basicForm"
            :rules="basicRules"
            label-width="120px"
          >
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="网站名称" prop="siteName">
                  <el-input
                    v-model="basicForm.siteName"
                    placeholder="请输入网站名称"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="网站域名" prop="siteUrl">
                  <el-input
                    v-model="basicForm.siteUrl"
                    placeholder="请输入网站域名"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="网站描述" prop="siteDescription">
              <el-input
                v-model="basicForm.siteDescription"
                type="textarea"
                :rows="3"
                placeholder="请输入网站描述"
              />
            </el-form-item>
            <el-form-item label="网站关键词" prop="siteKeywords">
              <el-input
                v-model="basicForm.siteKeywords"
                placeholder="请输入网站关键词，用逗号分隔"
              />
            </el-form-item>
            <el-form-item label="ICP备案号" prop="icpNumber">
              <el-input
                v-model="basicForm.icpNumber"
                placeholder="请输入ICP备案号"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleBasicSubmit">
                保存设置
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>

      <!-- 邮件设置 -->
      <el-tab-pane label="邮件设置" name="email">
        <el-card class="settings-card">
          <template #header>
            <div class="card-header">
              <span>SMTP邮件配置</span>
            </div>
          </template>
          <el-form
            ref="emailFormRef"
            :model="emailForm"
            :rules="emailRules"
            label-width="120px"
          >
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="SMTP服务器" prop="smtpHost">
                  <el-input
                    v-model="emailForm.smtpHost"
                    placeholder="请输入SMTP服务器地址"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="SMTP端口" prop="smtpPort">
                  <el-input-number
                    v-model="emailForm.smtpPort"
                    :min="1"
                    :max="65535"
                    controls-position="right"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="发件人邮箱" prop="fromEmail">
                  <el-input
                    v-model="emailForm.fromEmail"
                    placeholder="请输入发件人邮箱"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="发件人名称" prop="fromName">
                  <el-input
                    v-model="emailForm.fromName"
                    placeholder="请输入发件人名称"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="邮箱用户名" prop="username">
                  <el-input
                    v-model="emailForm.username"
                    placeholder="请输入邮箱用户名"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="邮箱密码" prop="password">
                  <el-input
                    v-model="emailForm.password"
                    type="password"
                    placeholder="请输入邮箱密码或授权码"
                    show-password
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="启用SSL" prop="ssl">
              <el-switch v-model="emailForm.ssl" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleEmailSubmit">
                保存设置
              </el-button>
              <el-button @click="handleTestEmail">
                发送测试邮件
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>

      <!-- 上传设置 -->
      <el-tab-pane label="上传设置" name="upload">
        <el-card class="settings-card">
          <template #header>
            <div class="card-header">
              <span>文件上传配置</span>
            </div>
          </template>
          <el-form
            ref="uploadFormRef"
            :model="uploadForm"
            :rules="uploadRules"
            label-width="120px"
          >
            <el-form-item label="上传方式" prop="uploadType">
              <el-radio-group v-model="uploadForm.uploadType">
                <el-radio value="local">本地存储</el-radio>
                <el-radio value="oss">阿里云OSS</el-radio>
                <el-radio value="qiniu">七牛云</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="最大文件大小" prop="maxFileSize">
              <el-input-number
                v-model="uploadForm.maxFileSize"
                :min="1"
                :max="100"
                controls-position="right"
                style="width: 200px"
              />
              <span style="margin-left: 10px">MB</span>
            </el-form-item>
            <el-form-item label="允许的文件类型" prop="allowedTypes">
              <el-checkbox-group v-model="uploadForm.allowedTypes">
                <el-checkbox value="jpg">JPG</el-checkbox>
                <el-checkbox value="png">PNG</el-checkbox>
                <el-checkbox value="gif">GIF</el-checkbox>
                <el-checkbox value="pdf">PDF</el-checkbox>
                <el-checkbox value="doc">DOC</el-checkbox>
                <el-checkbox value="docx">DOCX</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            
            <!-- OSS配置 -->
            <template v-if="uploadForm.uploadType === 'oss'">
              <el-divider content-position="left">阿里云OSS配置</el-divider>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="AccessKey ID" prop="ossAccessKeyId">
                    <el-input
                      v-model="uploadForm.ossAccessKeyId"
                      placeholder="请输入AccessKey ID"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="AccessKey Secret" prop="ossAccessKeySecret">
                    <el-input
                      v-model="uploadForm.ossAccessKeySecret"
                      type="password"
                      placeholder="请输入AccessKey Secret"
                      show-password
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="Bucket名称" prop="ossBucket">
                    <el-input
                      v-model="uploadForm.ossBucket"
                      placeholder="请输入Bucket名称"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="地域节点" prop="ossRegion">
                    <el-input
                      v-model="uploadForm.ossRegion"
                      placeholder="请输入地域节点"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </template>

            <el-form-item>
              <el-button type="primary" @click="handleUploadSubmit">
                保存设置
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>

      <!-- 安全设置 -->
      <el-tab-pane label="安全设置" name="security">
        <el-card class="settings-card">
          <template #header>
            <div class="card-header">
              <span>安全配置</span>
            </div>
          </template>
          <el-form
            ref="securityFormRef"
            :model="securityForm"
            label-width="120px"
          >
            <el-form-item label="登录验证码">
              <el-switch v-model="securityForm.enableCaptcha" />
              <span class="form-tip">开启后登录时需要输入验证码</span>
            </el-form-item>
            <el-form-item label="会话超时时间">
              <el-input-number
                v-model="securityForm.sessionTimeout"
                :min="10"
                :max="1440"
                controls-position="right"
                style="width: 200px"
              />
              <span style="margin-left: 10px">分钟</span>
            </el-form-item>
            <el-form-item label="密码复杂度">
              <el-checkbox-group v-model="securityForm.passwordRules">
                <el-checkbox value="length">至少8位字符</el-checkbox>
                <el-checkbox value="uppercase">包含大写字母</el-checkbox>
                <el-checkbox value="lowercase">包含小写字母</el-checkbox>
                <el-checkbox value="number">包含数字</el-checkbox>
                <el-checkbox value="special">包含特殊字符</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="登录失败限制">
              <el-input-number
                v-model="securityForm.maxLoginAttempts"
                :min="3"
                :max="10"
                controls-position="right"
                style="width: 200px"
              />
              <span style="margin-left: 10px">次后锁定账户</span>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSecuritySubmit">
                保存设置
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { defineOptions, ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

defineOptions({
  name: 'SettingsPage',
})

// 当前激活的标签页
const activeTab = ref('basic')

// 基本设置表单
const basicFormRef = ref()
const basicForm = reactive({
  siteName: '个人博客系统',
  siteUrl: 'https://myblog.com',
  siteDescription: '这是一个基于Vue3和Node.js开发的个人博客系统',
  siteKeywords: 'Vue3,Node.js,博客,技术分享',
  icpNumber: ''
})

const basicRules = {
  siteName: [
    { required: true, message: '请输入网站名称', trigger: 'blur' }
  ],
  siteUrl: [
    { required: true, message: '请输入网站域名', trigger: 'blur' },
    { type: 'url', message: '请输入正确的URL格式', trigger: 'blur' }
  ]
}

// 邮件设置表单
const emailFormRef = ref()
const emailForm = reactive({
  smtpHost: 'smtp.qq.com',
  smtpPort: 587,
  fromEmail: '',
  fromName: '个人博客系统',
  username: '',
  password: '',
  ssl: true
})

const emailRules = {
  smtpHost: [
    { required: true, message: '请输入SMTP服务器地址', trigger: 'blur' }
  ],
  smtpPort: [
    { required: true, message: '请输入SMTP端口', trigger: 'blur' }
  ],
  fromEmail: [
    { required: true, message: '请输入发件人邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  username: [
    { required: true, message: '请输入邮箱用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入邮箱密码', trigger: 'blur' }
  ]
}

// 上传设置表单
const uploadFormRef = ref()
const uploadForm = reactive({
  uploadType: 'local',
  maxFileSize: 10,
  allowedTypes: ['jpg', 'png', 'gif'],
  ossAccessKeyId: '',
  ossAccessKeySecret: '',
  ossBucket: '',
  ossRegion: 'oss-cn-hangzhou'
})

const uploadRules = {
  maxFileSize: [
    { required: true, message: '请设置最大文件大小', trigger: 'blur' }
  ],
  allowedTypes: [
    { required: true, message: '请选择允许的文件类型', trigger: 'change' }
  ]
}

// 安全设置表单
const securityFormRef = ref()
const securityForm = reactive({
  enableCaptcha: true,
  sessionTimeout: 120,
  passwordRules: ['length', 'number'],
  maxLoginAttempts: 5
})

// 保存基本设置
const handleBasicSubmit = async () => {
  if (!basicFormRef.value) return
  
  try {
    await basicFormRef.value.validate()
    // 这里应该调用实际的API
    ElMessage.success('基本设置保存成功')
  } catch {
    ElMessage.error('表单验证失败')
  }
}

// 保存邮件设置
const handleEmailSubmit = async () => {
  if (!emailFormRef.value) return
  
  try {
    await emailFormRef.value.validate()
    // 这里应该调用实际的API
    ElMessage.success('邮件设置保存成功')
  } catch {
    ElMessage.error('表单验证失败')
  }
}

// 发送测试邮件
const handleTestEmail = () => {
  ElMessage.info('正在发送测试邮件...')
  // 这里应该调用实际的API
  setTimeout(() => {
    ElMessage.success('测试邮件发送成功')
  }, 2000)
}

// 保存上传设置
const handleUploadSubmit = async () => {
  if (!uploadFormRef.value) return
  
  try {
    await uploadFormRef.value.validate()
    // 这里应该调用实际的API
    ElMessage.success('上传设置保存成功')
  } catch {
    ElMessage.error('表单验证失败')
  }
}

// 保存安全设置
const handleSecuritySubmit = () => {
  // 这里应该调用实际的API
  ElMessage.success('安全设置保存成功')
}
</script>

<style scoped>
.settings-container {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  color: #303133;
}

.settings-tabs {
  margin-top: 20px;
}

.settings-card {
  margin-bottom: 20px;
}

.card-header {
  font-weight: 600;
  color: #303133;
}

.form-tip {
  margin-left: 10px;
  color: #909399;
  font-size: 12px;
}

:deep(.el-tabs__content) {
  padding-top: 20px;
}
</style>