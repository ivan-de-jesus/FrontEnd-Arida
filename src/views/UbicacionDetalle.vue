<template>
  <div class="container py-4">
    <h4 class="text-primary-arida mb-4">Ubicación: {{ nombreUbicacion }}</h4>

    <!-- Tarjetas de parámetros -->
    <div class="row g-3 mb-4">
      <div class="col-6 col-md-3" v-for="dato in datos" :key="dato.nombre">
        <div class="card text-center p-3 dato-card">
          <div :style="{ color: dato.color }">
            <i :class="dato.icono" class="fs-3"></i>
          </div>
          <div class="mt-2 fw-bold">{{ dato.valor }}</div>
          <small class="text-muted">{{ dato.nombre }}</small>
        </div>
      </div>
    </div>
   <crecimiento-maiz />
    <!-- Aquí podrías agregar más secciones: crecimiento, control, etc. -->
  </div>
</template>

<script>
import CrecimientoMaiz from '@/components/CrecimientoMaiz.vue'

export default {
  name: 'UbicacionDetalle',
  components: {
    CrecimientoMaiz
  },
  data() {
    return {
      nombreUbicacion: 'Invernadero Norte',
      datos: [
        { nombre: 'pH', valor: '6.5', color: '#2ecc71', icono: 'bi bi-droplet' },
        { nombre: 'EC', valor: '1.2 mS', color: '#f1c40f', icono: 'bi bi-lightning' },
        { nombre: 'Temp.', valor: '24°C', color: '#e74c3c', icono: 'bi bi-thermometer' },
        { nombre: 'Humedad', valor: '55%', color: '#3498db', icono: 'bi bi-moisture' }
      ]
    }
  }
}
</script>

<style scoped>
.dato-card {
  background-color: #F5F3EF;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
.text-primary-arida {
  color: #1C2C4C;
}
</style>
