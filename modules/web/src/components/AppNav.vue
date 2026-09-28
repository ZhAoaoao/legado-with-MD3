<template>
  <nav class="app-nav" :class="variant" aria-label="主导航">
    <router-link
      v-for="item in links"
      :key="item.to"
      :to="item.to"
      custom
      v-slot="{ href, navigate }"
    >
      <a
        :href="href"
        class="app-nav__link"
        :class="{ 'is-active': isActive(item.to) }"
        @click="navigate"
      >
        {{ item.label }}
      </a>
    </router-link>
  </nav>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ variant?: 'rail' | 'bar' }>(), {
  variant: 'rail',
})

const route = useRoute()
const links = [
  { to: '/', label: '书架' },
  { to: '/bookSource', label: '书源' },
  { to: '/rssSource', label: '订阅源' },
]

const isActive = (to: string) => {
  if (to === '/') return route.path === '/' || route.path === '/chapter'
  return route.path === to
}
</script>

<style lang="scss" scoped>
.app-nav {
  display: flex;
  gap: 6px;
}

.app-nav.rail {
  flex-direction: column;
  margin-top: 20px;
}

.app-nav.bar {
  flex-direction: row;
  align-items: center;
}

.app-nav__link {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 36px;
  padding: 6px 12px;
  border-radius: 8px;
  text-decoration: none;
  color: var(--el-text-color-primary, #2c3e50);
  font-size: 14px;
  line-height: 1.2;
}

.app-nav.rail .app-nav__link {
  justify-content: flex-start;
}

.app-nav__link.is-active {
  background: var(--el-color-primary-light-9, rgba(64, 158, 255, 0.12));
  color: var(--el-color-primary, #409eff);
  font-weight: 600;
}

@media screen and (max-width: 768px) {
  .app-nav.rail,
  .app-nav.bar {
    flex-direction: row;
    margin-top: 12px;
  }

  .app-nav__link {
    flex: 1;
    justify-content: center;
    min-height: 44px;
    font-size: 15px;
  }
}
</style>
