// src/main.js
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker';


import 'bootstrap/dist/css/bootstrap.min.css'   // estilos
import 'bootstrap-icons/font/bootstrap-icons.css'

import 'bootstrap/dist/js/bootstrap.bundle.min.js'
/* Popper → primero */
import * as Popper from '@popperjs/core'
window.Popper = Popper

/* Bootstrap JS (ESM) → después */
import 'bootstrap'                              // habilita carrusel, modal, etc.

import './registerServiceWorker'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
