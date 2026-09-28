<template>
  <div class="books-wrapper">
    <div class="wrapper">
      <div
        class="book"
        v-for="book in books"
        :key="book.bookUrl"
        @click="handleClick(book)"
      >
        <div class="cover-img">
          <img
            class="cover"
            :src="getCover(book)"
            :key="book.coverUrl"
            @error.once="proxyImage"
            alt=""
            loading="lazy"
          />
        </div>
        <div class="info">
          <div class="name">{{ book.name }}</div>
          <div class="sub">
            <div class="author">
              {{ book.author }}
            </div>
            <div class="tags" v-if="isSearch">
              <el-tag
                v-for="tag in book.kind?.split(',').slice(0, 2)"
                :key="tag"
              >
                {{ tag }}
              </el-tag>
            </div>
            <div class="update-info" v-if="!isSearch">
              <div class="dot">•</div>
              <div class="size">共{{ (book as Book).totalChapterNum }}章</div>
              <div class="dot">•</div>
              <div class="date">
                {{ dateFormat((book as Book).lastCheckTime) }}
              </div>
            </div>
          </div>
          <div class="intro" v-if="isSearch">{{ book.intro }}</div>

          <div class="dur-chapter" v-if="!isSearch">
            已读：{{ (book as Book).durChapterTitle }}
          </div>
          <div class="last-chapter">最新：{{ book.latestChapterTitle }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Book, SeachBook } from '@/book'
import { dateFormat, isLegadoUrl } from '../utils/utils'
import API from '@api'
const props = defineProps<{
  books: Array<Book | SeachBook>
  isSearch: boolean
}>()

const emit = defineEmits(['bookClick'])
const handleClick = (book: Book | SeachBook) => emit('bookClick', book)
const getCover = ({ bookUrl, coverUrl }: Book | SeachBook) => {
  if (coverUrl === undefined) return API.getProxyCoverUrl(bookUrl)
  return isLegadoUrl(coverUrl) ? API.getProxyCoverUrl(coverUrl) : coverUrl
}
const proxyImage = (evt: Event) => {
  const target = evt.target as HTMLImageElement
  target.src = API.getProxyCoverUrl(target.src)
}

const subJustify = computed(() =>
  props.isSearch ? 'space-between' : 'flex-start',
)
</script>

<style lang="scss" scoped>
.books-wrapper {
  flex: 1;
  min-height: 0;
  overflow: auto;

  .wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 12px;
    align-content: start;

    .book {
      user-select: none;
      display: flex;
      cursor: pointer;
      margin-bottom: 0;
      padding: 16px;
      width: auto;
      min-width: 0;
      box-sizing: border-box;
      flex-direction: row;
      align-items: flex-start;
      border-radius: 10px;
      border: 1px solid rgba(0, 0, 0, 0.06);
      background: #fff;

      .cover-img {
        width: 72px;
        height: 96px;
        flex: none;

        .cover {
          width: 72px;
          height: 96px;
          object-fit: cover;
          border-radius: 4px;
        }
      }

      .info {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        min-height: 96px;
        margin-left: 14px;
        flex: 1;
        min-width: 0;
        overflow: hidden;

        .name {
          max-width: 100%;
          font-size: 15px;
          font-weight: 700;
          color: #33373d;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .sub {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          align-items: baseline;
          justify-content: v-bind('subJustify');
          gap: 4px 8px;
          max-width: 100%;
          font-size: 12px;
          font-weight: 600;
          color: #6b6b6b;
          .tags {
            :deep(.el-tag) {
              margin-right: 0.5em;
            }
          }
          .update-info {
            display: flex;
            flex-wrap: wrap;
            .dot {
              margin: 0 7px;
            }
          }
        }

        .intro,
        .dur-chapter,
        .last-chapter {
          color: #969ba3;
          font-size: 13px;
          margin-top: 3px;
          font-weight: 500;
          word-wrap: break-word;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          line-clamp: 1;
          text-align: left;
          max-width: 100%;
        }
      }
    }

    .book:active {
      background: rgba(0, 0, 0, 0.06);
    }
  }
}

@media (hover: hover) {
  .books-wrapper .wrapper .book:hover {
    background: rgba(0, 0, 0, 0.06);
    transition-duration: 0.2s;
  }
}

.books-wrapper::-webkit-scrollbar {
  width: 0 !important;
}

:global(.night) .book {
  background: #222426;
  border-color: #3a3a3a;
}

:global(.night) .name {
  color: #eee;
}

:global(.night) .sub {
  color: #c5c5c5;
}

@media screen and (max-width: 768px) {
  .books-wrapper {
    .wrapper {
      display: flex;
      flex-direction: column;
      gap: 0;

      .book {
        box-sizing: border-box;
        width: 100%;
        margin-bottom: 0;
        padding: 14px 16px;
        min-height: 96px;
        border-radius: 0;
        border-left: none;
        border-right: none;
        border-top: none;

        .cover-img,
        .cover-img .cover {
          width: 64px;
          height: 86px;
        }

        .info {
          min-height: 86px;

          .name {
            font-size: 16px;
          }
        }
      }
    }
  }
}
</style>
