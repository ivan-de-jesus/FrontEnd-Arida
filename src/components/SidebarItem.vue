<template>
  <router-link
    :to="to"
    class="sidebar-link d-flex align-items-center gap-2 px-3 py-2 rounded"
    :class="{ active: isActive }"
    exact-active-class="active"
  >
    <i :class="`bi ${icon}`"></i>
    <span class="flex-grow-1">{{ label }}</span>
  </router-link>
</template>

<script>
export default {
  name: 'SidebarItem',
  props: {
    to   : { type: [String, Object], required: true },
    icon : { type: String,            default: 'bi-circle' },
    label: { type: String,            required: true }
  },
  computed: {
    isActive () {
      const target = typeof this.to === 'string' ? this.to : this.to.path
      return this.$route.path === target
    }
  }
}
</script>

<style scoped>
.sidebar-link {
  color:#adb5bd;
  text-decoration:none;
  font-size:.95rem;
}
.sidebar-link:hover,
.sidebar-link.active {
  background:#242c37;
  color:#fff;
}
</style>
