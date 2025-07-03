import Vue from 'vue'
import VueRouter from 'vue-router'
import LandingView from '@/views/LandingView.vue'
import AboutView from '@/views/AboutView.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import DashboardView from '@/views/Dashboard.vue'  // crea este componente
import Ubicaciones from '@/views/Ubicaciones.vue'
import UbicacionDetalle from '@/views/UbicacionDetalle.vue'




Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'landing', component: LandingView },
  { path: '/about', name: 'about', component: AboutView },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { hideNavbar: true }
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: { hideNavbar: true }
  },
  { path: '/ubicaciones', name: 'Ubicaciones', component: Ubicaciones },

  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: false }
  },
  {
    path: '/ubicacion/:id',
    name: 'UbicacionDetalle',
    component: UbicacionDetalle,
    meta: { requiresAuth: false }
  },
  // redirigir rutas no definidas
  { path: '*', redirect: '/' }
]

const router = new VueRouter({
  mode: 'history',   // elimina el '#' de la URL
  routes
})

// Guard global: comprueba meta.requiresAuth
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('authToken')
  if (to.matched.some(record => record.meta.requiresAuth) && !token) {
    // si la ruta requiere auth y no hay token, va a Login
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
