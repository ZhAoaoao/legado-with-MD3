<template>
  <div class="editor">
    <header class="editor-head">
      <div class="editor-title">{{ pageTitle }}</div>
      <app-nav variant="bar" />
    </header>
    <div v-if="isNarrow" class="panel-switch" role="tablist">
      <button
        type="button"
        role="tab"
        :aria-selected="panel === 'edit'"
        :class="{ active: panel === 'edit' }"
        @click="panel = 'edit'"
      >
        编辑
      </button>
      <button
        type="button"
        role="tab"
        :aria-selected="panel === 'actions'"
        :class="{ active: panel === 'actions' }"
        @click="panel = 'actions'"
      >
        操作
      </button>
      <button
        type="button"
        role="tab"
        :aria-selected="panel === 'tools'"
        :class="{ active: panel === 'tools' }"
        @click="panel = 'tools'"
      >
        工具
      </button>
    </div>
    <div class="editor-body">
      <source-tab-form
        v-show="!isNarrow || panel === 'edit'"
        class="panel left"
        :config="config"
      />
      <div v-show="!isNarrow || panel === 'actions'" class="panel center">
        <tool-bar />
      </div>
      <source-tab-tools
        v-show="!isNarrow || panel === 'tools'"
        class="panel right"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import bookSourceConfig from '@/config/bookSourceEditConfig'
import rssSourceConfig from '@/config/rssSourceEditConfig'
import '@/assets/sourceeditor.css'
import { useDark, useMediaQuery } from '@vueuse/core'
import type { SourceConfig } from '@/config/sourceConfig'

useDark()

const route = useRoute()
const sourceStore = useSourceStore()
const isNarrow = useMediaQuery('(max-width: 768px)')
const panel = ref<'edit' | 'actions' | 'tools'>('edit')
const isBook = computed(() => /bookSource/i.test(route.path))
const config = computed(
  () => (isBook.value ? bookSourceConfig : rssSourceConfig) as SourceConfig,
)
const pageTitle = computed(() => (isBook.value ? '书源管理' : '订阅源管理'))

watch(
  isBook,
  value => {
    sourceStore.ensureEditor(value ? 'book' : 'rss')
    document.title = value ? '书源管理' : '订阅源管理'
  },
  { immediate: true },
)
</script>
<style lang="scss" scoped>
.editor {
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  background: var(--el-bg-color, #fff);
  color: var(--el-text-color-primary, #303133);
}

.editor-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 10px 16px;
  border-bottom: 1px solid var(--el-border-color-lighter, #ebeef5);
  flex: none;
}

.editor-title {
  font-size: 18px;
  font-weight: 600;
  white-space: nowrap;
}

.panel-switch {
  display: flex;
  gap: 8px;
  padding: 8px 12px;
  flex: none;

  button {
    flex: 1;
    min-height: 44px;
    border-radius: 8px;
    border: 1px solid var(--el-border-color, #dcdfe6);
    background: transparent;
    color: inherit;
    font-size: 15px;
  }

  button.active {
    background: var(--el-color-primary, #409eff);
    border-color: var(--el-color-primary, #409eff);
    color: #fff;
  }
}

.editor-body {
  flex: 1;
  min-height: 0;
  display: flex;
  overflow: hidden;
}

.panel {
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.left {
  flex: 1.4;
  margin-left: 12px;
}

.center {
  flex: 0 0 auto;
  justify-content: center;
  overflow: auto;
  border-left: 1px solid var(--el-border-color-lighter, #eee);
  border-right: 1px solid var(--el-border-color-lighter, #eee);
}

.right {
  flex: 1;
  width: auto;
  max-width: 440px;
  margin-right: 12px;
}

@media screen and (max-width: 768px) {
  .editor-head {
    flex-direction: column;
    align-items: stretch;
    padding: 12px 12px 0;
    border-bottom: none;
  }

  .editor-title {
    font-size: 20px;
  }

  .editor-body {
    flex-direction: column;
  }

  .left,
  .center,
  .right {
    flex: 1 1 auto;
    max-width: none;
    width: 100%;
    margin: 0;
    border: none;
  }

  .center {
    justify-content: flex-start;
  }
}
</style>
