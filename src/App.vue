<template>
  <div id="app" class="d-flex">
    <Sidebar v-if="!$route.meta.hideNavbar" />

    <div class="flex-grow-1 d-flex flex-column">
      <Navbar v-if="!$route.meta.hideNavbar" />
      <router-view class="flex-grow-1" />
    </div>
  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar.vue'
import Navbar from '@/components/Navbar.vue'

export default {
  components: {
    Sidebar,
    Navbar
  }
}
</script>
