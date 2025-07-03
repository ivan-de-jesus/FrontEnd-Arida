<template>
  <!-- ─────────── raíz única ─────────── -->
  <div id="layout" class="d-flex">

    <!-- ===== DESKTOP (≥ md) ===== -->
    <aside class="sidebar d-none d-md-flex flex-column shadow-sm">
      <div class="px-3 py-4 text-center">
        <img src="@/assets/logo.png" alt="Logo" width="32" />
      </div>

      <nav class="flex-grow-1">
        <div v-for="item in menu" :key="item.to">
          <SidebarItem v-bind="item" />
          <div v-if="item.children" class="ms-4">
            <SidebarItem
              v-for="child in item.children"
              :key="child.to"
              v-bind="child"
            />
          </div>
        </div>
      </nav>
    </aside>

    <!-- ===== MOBILE (< md)  botón ===== -->
    <button
      class="btn btn-dark position-fixed top-0 start-0 m-2 d-md-none z-3"
      @click="openOffcanvas"
      style="--bs-btn-padding-x:.6rem; --bs-btn-padding-y:.45rem;"
    >
      <i class="bi bi-list"></i>
    </button>

    <!-- ===== MOBILE (< md) off-canvas ===== -->
    <div
      :class="['offcanvas', 'offcanvas-start', 'text-bg-dark', { show: showOffcanvas }]"
      tabindex="-1"
      style="width:240px;"
      @click.self="closeOffcanvas"
    >
      <div class="offcanvas-header border-bottom">
        <h5 class="offcanvas-title mb-0">Menú</h5>
        <button
          type="button"
          class="btn-close btn-close-white"
          @click="closeOffcanvas"
        ></button>
      </div>

      <div class="offcanvas-body p-0">
        <nav>
          <div v-for="item in menu" :key="item.to + '-m'">
            <SidebarItem v-bind="item" @click.native="closeOffcanvas" />
            <div v-if="item.children" class="ms-3">
              <SidebarItem
                v-for="child in item.children"
                :key="child.to + '-m'"
                v-bind="child"
                @click.native="closeOffcanvas"
              />
            </div>
          </div>
        </nav>
      </div>
    </div>

    <!-- ─────── aquí iría tu contenido principal (router-view) ─────── -->
   

  </div>
</template>


<script>
import SidebarItem from './SidebarItem.vue'

export default {
  name: 'Sidebar',
  components: { SidebarItem },
  data () {
    return {
      showOffcanvas: false,
      /* ajusta a tus rutas reales */
      menu: [
        { to:'/',          icon:'bi-house-fill', label:'Home', exact:true },
        { to:'/dashboard', icon:'bi-bar-chart',  label:'Dashboard' },
        { to:'/store',     icon:'bi-bag',        label:'Store', children:[
            { to:'/store/products', icon:'bi-dot', label:'Products' },
            { to:'/store/orders',   icon:'bi-dot', label:'Orders'   },
            { to:'/store/subs',     icon:'bi-dot', label:'Subs'     }
        ]},
        { to:'/tasks',     icon:'bi-check2-square', label:'Tasks'  },
        { to:'/files',     icon:'bi-folder',        label:'Files'  }
      ]
    }
  },
  methods: {
    openOffcanvas () { this.showOffcanvas = true },
    closeOffcanvas () { this.showOffcanvas = false }
  }
}
</script>

<style scoped>
/* ---------- DESKTOP ---------- */
.sidebar{
  width:220px;
  min-height:100vh;
  background:#040723;
  position:fixed;
  left:0; top:0;
  color:#ced4da;
  z-index:1020;
}
body { padding-left:220px; }
@media (max-width: 767.98px){
  body { padding-left:0; }
}
</style>
