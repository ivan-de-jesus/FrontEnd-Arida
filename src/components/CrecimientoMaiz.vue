<template>
  <div class="card-maiz mx-auto">
    <div class="contenedor mb-2">
      <img :src="`/${imagen}`" alt="Etapa del maíz" />
    </div>

    <input type="range" v-model="dia" min="1" max="130" class="w-100" />

    <div class="dias">Día {{ dia }} de 130</div>
    <div class="etapa">Etapa: {{ etapa }}</div>
  </div>
</template>

<script>
export default {
  name: 'CrecimientoMaiz',
  data() {
    return {
      dia: 1
    }
  },
  computed: {
    imagen() {
      if (this.dia <= 10) return '1.png'
      else if (this.dia <= 25) return '2.png'
      else if (this.dia <= 60) return '3.png'
      else if (this.dia <= 90) return '4.png'
      else return '5.png'
    },
    etapa() {
      if (this.dia <= 10) return 'Germinación inicial'
      else if (this.dia <= 25) return 'Plántula'
      else if (this.dia <= 60) return 'Desarrollo vegetativo'
      else if (this.dia <= 90) return 'Floración'
      else return 'Formación de mazorca'
    }
  }
}
</script>

<style scoped>
.card-maiz {
  background: #F5F3EF;
  border-radius: 10px;
  padding: 1rem;
  max-width: 320px;
  text-align: center;
  font-family: sans-serif;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.contenedor {
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.contenedor img {
  max-height: 100%;
  max-width: 100%;
  transition: opacity 0.4s ease;
}

input[type="range"] {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.etapa {
  font-weight: bold;
  margin-top: 0.5rem;
  font-size: 1.1rem;
  color: #2d8a42;
}

.dias {
  font-size: 0.95rem;
  color: #444;
}
</style>
