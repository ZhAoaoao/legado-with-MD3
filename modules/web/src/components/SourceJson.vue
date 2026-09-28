<template>
  <div class="json-page">
    <el-input
      id="source-json"
      v-model="sourceString"
      type="textarea"
      placeholder="这里输出序列化的JSON数据,可直接导入'阅读'APP"
      @change="update"
    ></el-input>
  </div>
</template>
<script setup lang="ts">
import { useSourceStore } from '@/store'

const store = useSourceStore()
const sourceString = ref('')
const update = async (string: string) => {
  try {
    store.changeEditTabSource(JSON.parse(string))
  } catch {
    ElMessage({
      message: '粘贴的源格式错误',
      type: 'error',
    })
  }
}

watchEffect(async () => {
  const source = store.editTabSource
  if (Object.keys(source).length > 0) {
    sourceString.value = JSON.stringify(source, null, 4)
  } else {
    sourceString.value = ''
  }
})
</script>
<style lang="scss" scoped>
.json-page {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.json-page > :deep(.el-textarea) {
  flex: 1;
  min-height: 0;
}

:deep(.el-input) {
  width: 100%;
}
:deep(#source-json) {
  height: 100%;
  min-height: 180px;
}
</style>
