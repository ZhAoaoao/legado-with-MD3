import { defineStore } from 'pinia'
import {
  emptyBookSource,
  emptyRssSource,
  getSourceUniqueKey,
  convertSourcesToMap,
} from '@utils/souce'
import type { BookSoure, RssSource, Source } from '@/source'

const bookSourcePage = () => /bookSource/i.test(location.href)
const emptyForPage = () =>
  JSON.parse(JSON.stringify(bookSourcePage() ? emptyBookSource : emptyRssSource))

export const useSourceStore = defineStore('source', {
  state: () => {
    return {
      bookSources: shallowRef([] as BookSoure[]), // 临时存放所有书源,
      rssSources: shallowRef([] as RssSource[]), // 临时存放所有订阅源
      savedSources: [] as Source[], // 批量保存到阅读app成功的源
      currentSource: emptyForPage() as Source, // 当前编辑的源
      currentTab: localStorage.getItem('tabName') || 'editTab',
      editTabSource: {} as Source, // 生成序列化的json数据
      isDebuging: false,
    }
  },
  getters: {
    sources: (state): Source[] =>
      bookSourcePage() ? state.bookSources : state.rssSources,
    sourcesMap: function (): Map<string, Source> {
      return convertSourcesToMap(this.sources)
    },
    savedSourcesMap: (state): Map<string, Source> =>
      convertSourcesToMap(state.savedSources),
    currentSourceUrl: state =>
      bookSourcePage()
        ? (state.currentSource as BookSoure).bookSourceUrl
        : (state.currentSource as RssSource).sourceUrl,
    searchKey: (state): string =>
      bookSourcePage()
        ? (state.currentSource as BookSoure)?.ruleSearch?.checkKeyWord || '我的'
        : '',
  },
  actions: {
    startDebug() {
      this.currentTab = 'editDebug'
      this.isDebuging = true
    },
    debugFinish() {
      this.isDebuging = false
    },

    //拉取源后保存
    saveSources(data: Source[]) {
      if (bookSourcePage()) {
        this.bookSources = markRaw(data) as BookSoure[]
      } else {
        this.rssSources = markRaw(data) as RssSource[]
      }
    },
    //批量推送
    setPushReturnSources(returnSoures: Source[]) {
      this.savedSources = returnSoures
    },
    //删除源
    deleteSources(data: Source[]) {
      const sources: Source[] = bookSourcePage()
        ? this.bookSources
        : this.rssSources
      data.forEach(source => {
        const index = sources.indexOf(source)
        if (index > -1) sources.splice(index, 1)
      })
    },
    //保存当前编辑源
    saveCurrentSource() {
      const source = this.currentSource,
        map = this.sourcesMap
      map.set(getSourceUniqueKey(source), JSON.parse(JSON.stringify(source)))
      this.saveSources(Array.from(map.values()))
    },
    // 更改当前编辑的源qq
    changeCurrentSource(source: Source) {
      this.currentSource = JSON.parse(JSON.stringify(source))
    },
    // update editTab tabName and editTab info
    changeTabName(tabName: string) {
      this.currentTab = tabName
      localStorage.setItem('tabName', tabName)
    },
    changeEditTabSource(source: Source) {
      this.editTabSource = JSON.parse(JSON.stringify(source))
    },
    editHistory(history: Source) {
      let historyObj
      if (localStorage.getItem('history')) {
        historyObj = JSON.parse(localStorage.getItem('history')!)
        historyObj.new.push(history)
        if (historyObj.new.length > 50) {
          historyObj.new.shift()
        }
        if (historyObj.old.length > 50) {
          historyObj.old.shift()
        }
        localStorage.setItem('history', JSON.stringify(historyObj))
      } else {
        const arr = { new: [history], old: [] }
        localStorage.setItem('history', JSON.stringify(arr))
      }
    },
    editHistoryUndo() {
      if (localStorage.getItem('history')) {
        const historyObj = JSON.parse(localStorage.getItem('history')!)
        historyObj.old.push(this.currentSource)
        if (historyObj.new.length) {
          this.currentSource = historyObj.new.pop()
        }
        localStorage.setItem('history', JSON.stringify(historyObj))
      }
    },
    clearAllHistory() {
      localStorage.setItem('history', JSON.stringify({ new: [], old: [] }))
    },
    clearEdit() {
      this.editTabSource = {} as Source
      this.currentSource = emptyForPage()
    },
    /** 书架和书源在同一页面里切换时，补齐对应的空源结构 */
    ensureEditor(kind: 'book' | 'rss') {
      const looksBook = 'ruleSearch' in this.currentSource
      if (kind === 'book' && !looksBook) this.currentSource = JSON.parse(JSON.stringify(emptyBookSource))
      if (kind === 'rss' && looksBook) this.currentSource = JSON.parse(JSON.stringify(emptyRssSource))
    },

    // clear all source
    clearAllSource() {
      this.bookSources = []
      this.rssSources = []
      this.savedSources = []
    },
  },
})
