<template>
  <div class="debug-page">
    <el-input
      v-if="isBookSource"
      id="debug-key"
      v-model="searchKey"
      placeholder="搜索书名、作者"
      :prefix-icon="Search"
      @keydown.enter="startDebug"
    />
    <el-input
      id="debug-text"
      v-model="printDebug"
      type="textarea"
      readonly
      placeholder="这里用于输出调试信息"
    />
  </div>
</template>

<script setup lang="ts">
import API from '@api'
import { Search } from '@element-plus/icons-vue'

const store = useSourceStore()

const printDebug = ref('')
const searchKey = ref('')

watch(
  () => store.isDebuging,
  () => {
    if (store.isDebuging) startDebug()
  },
)

const appendDebugMsg = (msg: string) => {
  const debugDom = document.querySelector('#debug-text')
  debugDom!.scrollTop = debugDom!.scrollHeight
  printDebug.value += msg + '\n'
}
const startDebug = async () => {
  printDebug.value = ''
  try {
    await API.saveSource(store.currentSource)
  } catch (e) {
    store.debugFinish()
    throw e
  }
  API.debug(
    store.currentSourceUrl,
    searchKey.value || store.searchKey,
    appendDebugMsg,
    store.debugFinish,
  )
}

const route = useRoute()
const isBookSource = computed(() => /bookSource/i.test(route.path))
</script>

<style lang="scss" scoped>
.debug-page {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-sizing: border-box;
}

.debug-page > :deep(.el-textarea) {
  flex: 1;
  min-height: 0;
}

:deep(#debug-text) {
  height: 100%;
  min-height: 160px;
}

@media screen and (max-width: 768px) {
  #debug-key :deep(.el-input__wrapper) {
    min-height: 44px;
  }
}
</style>
