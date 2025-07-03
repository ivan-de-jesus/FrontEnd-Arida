<!-- src/components/Register.vue -->
<template>
  <div class="d-flex justify-content-center align-items-center min-vh-100 bg-light">
    <div class="card w-100 mx-3" style="max-width: 400px;">
      <div class="card-body">
        <h4 class="card-title text-center mb-4">Registrarse</h4>

        <div v-if="error" class="alert alert-danger py-2" role="alert">
          {{ error }}
        </div>

        <form @submit.prevent="onSubmit">
          <div class="mb-3">
            <label for="email" class="form-label">Correo electrónico</label>
            <input
              id="email"
              type="email"
              v-model.trim="form.email"
              class="form-control"
              placeholder="tú@correo.com"
              required
            />
          </div>

          <div class="mb-3">
            <label for="password" class="form-label">Contraseña</label>
            <input
              id="password"
              type="password"
              v-model="form.password"
              class="form-control"
              placeholder="••••••••"
              required
            />
          </div>

          <div class="mb-3">
            <label for="state" class="form-label">Estado de residencia</label>
            <select
              id="state"
              v-model="form.state"
              class="form-select"
              required
            >
              <option value="" disabled>Selecciona un estado</option>
              <option v-for="s in states" :key="s" :value="s">{{ s }}</option>
            </select>
          </div>

          <button
            type="submit"
            class="btn btn-success w-100"
            :disabled="!isFormValid"
          >
            Crear cuenta
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Register',

  data() {
    return {
      form: {
        email: '',
        password: '',
        state: ''
      },
      error: '',
      // Podrías poblar esto dinámicamente vía API
      states: [
        'Aguascalientes','Baja California','Baja California Sur','Campeche',
        'Chiapas','Chihuahua','Ciudad de México','Coahuila','Colima',
        'Durango','Guanajuato','Guerrero','Hidalgo','Jalisco','México',
        'Michoacán','Morelos','Nayarit','Nuevo León','Oaxaca','Puebla',
        'Querétaro','Quintana Roo','San Luis Potosí','Sinaloa','Sonora',
        'Tabasco','Tamaulipas','Tlaxcala','Veracruz','Yucatán','Zacatecas'
      ]
    }
  },

  computed: {
    isFormValid() {
      return (
        this.form.email &&
        this.form.password &&
        this.form.state
      )
    }
  },

  methods: {
     async onSubmit() {
    this.error = ''
    try {
      // ¡IMPORTANTE! URL completa a tu API
      await axios.post('http://localhost:3000/api/register', this.form)
      this.$router.push({ name: 'Login' })
    } catch (err) {
      this.error =
        (err.response && err.response.data.message) ||
        'Error al registrar, intenta de nuevo.'
    }
  }
  }
}
</script>

<style scoped>
.bg-light { background-color: #f8f9fa !important; }
.card-body { display: flex; flex-direction: column; }
</style>
