<template>
  <div class="login-bg d-flex justify-content-center align-items-center min-vh-100">
    <div class="card login-card shadow p-4 w-100 mx-3" style="max-width: 420px;">
      <!-- Logo ARIDA -->
      <div class="text-center mb-4">
        <img src="@/assets/logo-arida.png" alt="ARIDA Logo" class="logo-img" />
        <h5 class="text-brand fw-bold mt-2">Iniciar Sesión</h5>
      </div>

      <div v-if="error" class="alert alert-danger py-2 text-center" role="alert">
        {{ error }}
      </div>

      <form @submit.prevent="onSubmit">
        <div class="mb-3">
          <label for="email" class="form-label text-dark">Correo electrónico</label>
          <input
            id="email"
            type="email"
            v-model.trim="email"
            class="form-control"
            placeholder="tú@correo.com"
            required
          />
        </div>

        <div class="mb-3">
          <label for="password" class="form-label text-dark">Contraseña</label>
          <input
            id="password"
            type="password"
            v-model="password"
            class="form-control"
            placeholder="••••••••"
            required
          />
        </div>

        <div class="form-check mb-3">
          <input id="remember" type="checkbox" v-model="remember" class="form-check-input" />
          <label for="remember" class="form-check-label text-dark">Recuérdame</label>
        </div>

        <button
          type="submit"
          class="btn btn-brand w-100 mb-3"
          :disabled="!isFormValid"
        >
          Entrar
        </button>

        <p class="text-center small">
          ¿No tienes cuenta?
          <router-link to="/register" class="text-brand">Regístrate aquí</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      remember: false,
      error: ''
    }
  },
  computed: {
    isFormValid() {
      return this.email !== '' && this.password !== ''
    }
  },
  methods: {
    async onSubmit() {
      this.error = ''
      try {
        const res = await axios.post('http://localhost:3000/api/login', {
          email: this.email,
          password: this.password
        })
        localStorage.setItem('authToken', res.data.token)
        this.$router.push({ name: 'dashboard' })
      } catch (err) {
        this.error = (err.response && err.response.data.message) || 'No se pudo iniciar sesión'
      }
    }
  }
}
</script>

<style scoped>
.login-bg {
  position: relative;
  min-height: 100vh;
  background: url('@/assets/maiz2.jpg') no-repeat center center fixed;
  background-size: cover;
  overflow: hidden;
}

.login-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.35); /* oscurecido suave */
  backdrop-filter: blur(4px);
  z-index: 1;
}

.login-card {
  position: relative;
  z-index: 2;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.75); /* ✅ más translúcido */
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.logo-img {
  width: 80px;
  height: auto;
}

.text-brand {
  color: #1C2C4C;
}

.btn-brand {
  background-color: #3C8C60;
  color: white;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.btn-brand:hover {
  background-color: #2E6E4A;
}


</style>
