<template>
  <el-tabs id="source-edit" class="source-form">
    <el-tab-pane
      v-for="{ name, children } in Object.values(config)"
      :label="name"
      :key="name"
    >
      <el-form :label-position="isNarrow ? 'top' : 'right'" label-width="auto">
        <el-form-item
          v-for="{
            type,
            title,
            namespace,
            id,
            array,
            hint,
            required = false,
          } in children"
          :label="title"
          :key="title"
          :required="required"
        >
          <el-input
            v-if="type == 'String' && typeof namespace == 'undefined'"
            type="textarea"
            v-model="currentSource[id]"
            :placeholder="hint"
            autosize
          />
          <el-input
            v-if="type == 'String' && typeof namespace != 'undefined'"
            type="textarea"
            v-model="currentSource[namespace][id]"
            :placeholder="hint"
            autosize
          />

          <el-switch
            v-if="(type as string) === 'Boolean'"
            v-model="currentSource[id]"
          />

          <el-input-number
            v-if="(type as string) === 'Number'"
            v-model="currentSource[id]"
            :min="0"
          />

          <el-select
            v-if="(type as string) === 'Array'"
            v-model="currentSource[id]"
          >
            <el-option
              v-for="(optionName, index) in array"
              :value="index"
              :key="optionName"
              :label="optionName"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import type { SourceConfig } from '@/config/sourceConfig'
import { useMediaQuery } from '@vueuse/core'

const store = useSourceStore()
defineProps<{ config: SourceConfig }>()
const isNarrow = useMediaQuery('(max-width: 768px)')

const currentSource = computed(() => store.currentSource)
/* 
修改currentSource的属性 没有直接修改本身
const { currentSource } = storeToRefs(store);
 */
</script>

<style lang="scss" scoped>
.source-form {
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
}
:deep(.el-tabs__header) {
  margin: 0;
  flex: none;
}
:deep(.el-tabs__content) {
  flex: 1;
  min-height: 0;
  overflow: auto;
}
:deep(.el-tab-pane) {
  height: auto;
  padding: 15px 8px 24px 0;
}

@media screen and (max-width: 768px) {
  .source-form {
    padding: 0 12px 16px;
    box-sizing: border-box;
  }

  :deep(.el-tabs__item) {
    height: 44px;
    line-height: 44px;
  }

  :deep(.el-form-item__label) {
    font-size: 14px;
    line-height: 1.4;
    margin-bottom: 4px;
  }

  :deep(.el-input__wrapper),
  :deep(.el-textarea__inner),
  :deep(.el-select__wrapper) {
    font-size: 16px;
  }
}
</style>
