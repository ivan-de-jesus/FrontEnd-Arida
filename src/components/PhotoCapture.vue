<!-- src/components/PhotoCapture.vue -->
<template>
  <div class="d-flex flex-column align-items-center">
    <!-- CARD: miniatura o placeholder. Al hacer clic abre el file input oculto -->
   <!-- CARD contenedora cuadrada con sombra -->
<div
  v-if="!manualMode"
  class="card shadow photo-box mb-3"
  style="width:320px; height:320px;"  
>
  <label
    class="d-block w-100 h-100 upload-card m-0"
    style="cursor:pointer;"
  >
    <input
      type="file"
      accept="image/*;capture=camera"
      class="d-none"
      @change="handleFile"
      :disabled="manualMode" 
    />

    <!-- Cuadrado interno que se adapta al 100 % de la card -->
    <div class="w-100 h-100 position-relative">
      <!-- PREVIEW -->
      <img
        v-if="preview"
        :src="preview"
        class="w-100 h-100 object-fit-cover rounded"
      />

      <!-- PLACEHOLDER -->
      <div
        v-else
        class="placeholder-icon d-flex flex-column
               justify-content-center align-items-center
               text-secondary w-100 h-100"
      >
        <i class="bi bi-upload" style="font-size:4rem;"></i>
        <p class="mt-2 mb-0">Subir imagen de la<br />ubicación</p>
      </div>
    </div>
  </label>
</div>

<!-- OPCIÓN: marcar para ingresar manual -->
<div class="form-check mb-3" style="max-width: 320px; width: 100%;">
  <input
    class="form-check-input"
    type="checkbox"
    id="manualMode"
    v-model="manualMode"
  />
  <label class="form-check-label" for="manualMode">
    Ingresar coordenadas manualmente
  </label>
</div>

<div v-if="manualMode" class="card mb-3 w-100" style="max-width: 320px;">
  <div class="card-body py-2">
    <div class="mb-2">
      <label class="form-label">Latitud:</label>
      <input
        type="number"
        step="0.000001"
        class="form-control"
        v-model.number="manualLat"
        placeholder="Ej. 19.432608"
      />
    </div>
    <div>
      <label class="form-label">Longitud:</label>
      <input
        type="number"
        step="0.000001"
        class="form-control"
        v-model.number="manualLng"
        placeholder="Ej. -99.133209"
      />
    </div>
  </div>
</div>


    <!-- CARD: coordenadas -->
   <div v-if="ready" class="card mb-3 w-100" style="max-width: 320px">
  <div class="card-body py-2">
    <strong>Coordenadas:</strong><br />
    <span v-if="manualMode">
      {{ manualLat.toFixed(6) }}, {{ manualLng.toFixed(6) }}
    </span>
    <span v-else>
      {{ coords.latitude.toFixed(6) }}, {{ coords.longitude.toFixed(6) }}
    </span>
  </div>
</div>

     <!-- SLIDERS PARA PARÁMETROS DE BUSQUEDA LANDSAT -->
   <div v-if="(preview && !manualMode) || (manualMode && ready)" class="card mb-3 w-100 p-3" style="max-width: 320px; ">
      <!-- Radio -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <label class="mb-0 text-start" style="flex: 1;">Radio (km): {{ radiusKm }}</label>
        <input
          type="range"
          v-model.number="radiusKm"
          :min="1"
          :max="100"
          class="form-range ms-3"
          style="flex: 1;"
        />
      </div>
      <!-- Días atrás -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <label class="mb-0 text-start" style="flex: 1;">Días atrás: {{ daysBack }}</label>
        <input
          type="range"
          v-model.number="daysBack"
          :min="1"
          :max="90"
          class="form-range ms-3"
          style="flex: 1;"
        />
      </div>
      <!-- Nubes -->
      <div class="d-flex justify-content-between align-items-center">
        <label class="mb-0 text-start" style="flex: 1;">Nubes Max(%): {{ cloudMax }}</label>
        <input
          type="range"
          v-model.number="cloudMax"
          :min="0"
          :max="100"
          class="form-range ms-3"
          style="flex: 1;"
        />
      </div>

    </div>
    <!-- BOTÓN -->
    <button
  class="btn w-100 d-flex justify-content-center align-items-center gap-2"
  :class="ready ? 'btn-success' : 'btn-upload'"
  style="max-width: 320px"
  @click="ready ? emitirCoords() : openSelector()"
>
  <i :class="ready ? 'bi bi-geo-alt-fill' : 'bi bi-upload'"></i>
  <span>{{ ready ? "Ver mapa" : "Subir" }}</span>
</button>
    <!-- ERROR -->
    <div
      v-if="error"
      class="alert alert-warning mt-3 w-100"
      style="max-width: 320px"
    >
      {{ error }}
    </div>
  </div>
</template>

<script>
import * as exifr from "exifr";

export default {
  name: "PhotoCapture",
  data() {
    return {
      preview: null, // URL.createObjectURL
      coords: null, // { latitude, longitude }
      error: null,
        radiusKm: 15,
      daysBack: 30,
      cloudMax: 15,
       manualMode: false,        // 👈 NUEVO
    manualLat: null,          // 👈 NUEVO
    manualLng: null 
    };
  },
  computed: {
  ready() {
  if (this.manualMode) {
    return (
      Number.isFinite(this.manualLat) &&
      Number.isFinite(this.manualLng)
    );
  } else {
    return (
      this.coords &&
      Number.isFinite(this.coords.latitude) &&
      Number.isFinite(this.coords.longitude)
    );
  }
},
  },
  methods: {
    /** abre el selector si el usuario pulsa el botón antes de elegir archivo */
    openSelector() {
      this.$el.querySelector("input[type=file]").click();
    },

    async handleFile(ev) {
      this.error = null;
      this.coords = null;
      const file = ev.target.files[0];
      if (!file) return;

      /* miniatura */
      this.preview && URL.revokeObjectURL(this.preview);
      this.preview = URL.createObjectURL(file);

      /* metadatos EXIF */
      try {
        const gps = await exifr.gps(file);
        if (gps?.latitude && gps?.longitude) {
          this.coords = {
            latitude: Number(gps.latitude),
            longitude: Number(gps.longitude),
          };
        } else {
          this.error = "La imagen no contiene metadatos GPS.";
        }
      } catch (err) {
        console.error(err);
        this.error = "Error al leer metadatos EXIF.";
      }
    },

   emitirCoords() {
  const coords = this.manualMode
    ? { latitude: this.manualLat, longitude: this.manualLng }
    : this.coords;

  this.$emit('captured', {
    coords,
    params: {
      radiusKm: this.radiusKm,
      daysBack: this.daysBack,
      cloudMax: this.cloudMax
    }
  });
},

  },
  beforeUnmount() {
    /* libera la URL de la miniatura */
    if (this.preview) URL.revokeObjectURL(this.preview);
  },
};
</script>

<style scoped>
.photo-box {             /* 320 × 320 con sombra de Bootstrap */
  overflow: hidden;      /* evita que la imagen sobresalga */
}

.upload-card {           /* borde punteado interno */
  border: 2px dashed #ced4da;
}

.placeholder-icon { user-select: none; }
.photo-box img { object-fit: cover; }  /* llena el cuadrado sin deformar */

.btn-upload {
  background-color: #0c153f !important;
  color: #fff !important;
  border: none;
}

.btn-upload:hover,
.btn-upload:focus {
  background-color: #0c153f !important; /* un tono un poco más claro para hover/focus */
  color: #fff !important;
}
.upload-card {
  border: 2px dashed #ced4da;
}
.placeholder-icon {
  user-select: none;
}
</style>
