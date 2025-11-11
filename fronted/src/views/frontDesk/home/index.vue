<template>
  <!-- Titele -->
  <div class="flex justify-center my-[50px] text-[#82411c] font-bold">
    <h1>Welcome To Tarzan's Blog</h1>
  </div>

  <div class="w-full">
    <el-row :gutter="20" class="w-full">
      <el-col :span="19">
        <ListItem v-for="item in blogList" :key="item.id" :item="item" />
      </el-col>
      <el-col :span="5">
        <div class="bg-[white] h-[280px] shadow-md p-6 rounded-xl overflow-hidden">
          <div
            class="w-[200px] h-[150px] flex justify-center align-center items-center overflow-hidden"
          >
            <img :src="cat" alt="cat" class="w-full h-full object-contain" />
          </div>
          <h2 class="flex justify-center text-[#7a4525] mt-[-30px]">Tarzan</h2>
          <div class="text-center py-6px">你好,我是Tarzan</div>
          <div class="text-center py-6px">这里是我分享技术 文章生活点滴的地方</div>
          <div class="text-center py-6px">希望你能在这里收获知识或者好心情</div>
        </div>
        <div class="bg-[white] h-[180px] shadow-md p-6 rounded-xl overflow-hidden mt-[15px]">
          <div class="flex items-center justify-center gap-8 manuel-tag">
            <div>
              <el-tag effect="dark">17篇</el-tag>
              <div class="mt-2">技术文章</div>
            </div>
            <div>
              <el-tag effect="dark">17篇</el-tag>
              <div class="mt-2">随笔杂文</div>
            </div>
            <div>
              <el-tag effect="dark">20天</el-tag>
              <div class="mt-2">网站运行</div>
            </div>
          </div>
          <el-button class="mt-2 w-full button-aligned">了解FanFan</el-button>
          <el-button class="mt-2 w-full button-aligned">了解Tarzan</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { getBlogListRequest } from '@/api/blog'
import ListItem from '@/components/listItem.vue'
import { handleResponse } from '@/utils/common'
import cat from '@/assets/cat.gif'
defineOptions({
  name: 'HomePage',
})

const blogList = ref([])
async function getBlogList() {
  await getBlogListRequest({
    page: 1,
    limit: 10,
  }).then((res) => {
    blogList.value = handleResponse(res, false)
  })
}
onMounted(() => {
  getBlogList()
})
</script>

<style lang="scss" scoped>
.button-aligned {
  margin-left: 0 !important;
  margin-right: 0 !important;
  display: block;
  background-color: #fff;
  border-color: #82411c;
  color: #82411c;
  transition:
    background-color 0.3s,
    color 0.3s;
  &:hover {
    background-color: #82411c;
    color: #fff;
  }
}

.manuel-tag {
  :deep(.el-tag) {
    --el-tag-bg-color: #82411c !important;
    --el-tag-border-color: #82411c !important;
    --el-tag-hover-color: #82411c !important;
    background-color: #82411c !important;
    border-color: #82411c !important;
    border: none !important;
  }
}
</style>
