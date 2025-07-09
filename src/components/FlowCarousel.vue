<template>
  <div
    id="flowCarousel"
    class="carousel slide carousel-fade"
    data-bs-touch="true"
    :data-bs-interval="false"
    ref="carouselEl"
  >
    <!-- indicadores (2 dots) -->
    <div class="carousel-indicators">
      <button
        v-for="n in 2"
        :key="n"
        type="button"
        :data-bs-target="'#flowCarousel'"
        :data-bs-slide-to="n - 1"
        :class="{ active: step === n }"
      />
    </div>

    <div class="carousel-inner">
      <!-- DIAPOSITIVA 1 · PhotoCapture -->
      <div class="carousel-item" :class="{ active: step === 1 }">
        <PhotoCapture @captured="handleCaptured" />
      </div>

      <!-- DIAPOSITIVA 2 · MapView + semáforo y botón Guardar -->
      <div class="carousel-item" :class="{ active: step === 2 }">
        <transition name="fade">
          <MapView v-if="step === 2" :coords="coords" :params="params"  @ndwi-status="updateNdwiStatus" />
        </transition>

        <div class="mt-3 card p-3" v-if="step === 2">
          <h5>Estado de humedad</h5>
          <div v-if="loading" class="text-center">Calculando NDWI…</div>
          <div v-else>
            <p v-if="status" class="d-flex align-items-center gap-2">
              <span :class="`dot-${statusColor}`"></span>
              <strong>{{ status }}</strong>
              <span v-if="ndwi !== null">– NDWI: {{ ndwi.toFixed(2) }}</span>
            </p>
            <p v-else class="text-muted">No se pudo calcular NDWI</p>
          </div>
        </div>

        <div class="text-left mt-3">
          <button
            v-if="ndwi !== null"
            @click="onGuardar"
            class="btn btn-primary float-right"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Carousel } from "bootstrap";
import axios from "axios";

import PhotoCapture from "@/components/PhotoCapture.vue";
import MapView from "@/components/MapView.vue";

export default {
  name: "FlowCarousel",

  components: {
    PhotoCapture,
    MapView,
  },

  data() {
    return {
      step: 1, // 1 = PhotoCapture, 2 = MapView
      coords: null, // { latitude, longitude }
      params: null,
      ndwi: null, // valor calculado
      status: null, // 'Seco' | 'Medio' | 'Húmedo'
      loading: false, // indica cálculo en curso
      bsCarousel: null,
    };
  },

  computed: {
    statusColor() {
      switch (this.status) {
        case "Seco":
          return "red";
        case "Medio":
          return "yellow";
        case "Húmedo":
          return "green";
        default:
          return "gray";
      }
    },
    isLogged() {
      // Simplificado: consideramos sesión activa si hay token
      return !!localStorage.getItem("authToken");
    },
  },

  methods: {
    handleCaptured(payload) {
      this.coords = payload.coords;
      this.params = payload.params;
      this.loading = true;
      this.step = 2;
      this.bsCarousel.next();
    },

    updateNdwiStatus({ ndwi, status }) {
      this.ndwi = ndwi;
      this.status = status;
      this.loading = false;
    },

    async onGuardar() {
      if (!this.isLogged) {
        // No está logeado → Login
        this.$router.push({ name: "login" });
        return;
      }

      try {
        await axios.post(
          "/api/ndwi",
          { ndwi: this.ndwi },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        // Guardó exitosamente → Dashboard
        this.$router.push({ name: "Dashboard" });
      } catch (err) {
        console.error("Error guardando NDWI:", err);
        this.$bvToast.toast("Error al guardar, intenta de nuevo.", {
          title: "¡Ups!",
          variant: "danger",
          solid: true,
        });
      }
    },
  },

  mounted() {
    // Inicializa el carousel de Bootstrap
    this.bsCarousel = new Carousel(this.$refs.carouselEl, {
      touch: true,
      interval: false,
    });
  },
};
</script>
<style scoped>
.carousel-indicators {
  position: relative; /* deja de ser absolute */
  margin-top: 12px; /* lo separa de la card */
  justify-content: center; /* centra los dots */
  gap: 6px; /* espacito entre ellos */
  padding: 0; /* quita el padding default de BS */
}

/* los propios dots (ya los tenías; ajusto sólo tamaños) */
.carousel-indicators [data-bs-target] {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #adb5bd;
  border: none;
  opacity: 0.7;
}
.carousel-indicators .active {
  background: #000;
  opacity: 1;
}

[class^="dot-"] {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

.dot-red {
  background: #dc3545;
} /* rojo Bootstrap */
.dot-yellow {
  background: #ffc107;
} /* amarillo BS */
.dot-green {
  background: #28a745;
} /* verde BS   */
.dot-gray {
  background: #6c757d;
} /* fallback   */

#flowCarousel {
  width: 350px; /* fijar, no max-width */
  margin: 0 auto; /* centrar dentro del contenido */
  overflow: hidden; /* nada se asoma fuera */
}

/* el carrusel interno hereda el mismo ancho */
#flowCarousel .carousel-inner {
  width: 350px;
}

#flowCarousel .carousel-item {
  width: 350px; /* cada slide ocupa TODO el ancho del contenedor */
}
.carousel-fade .carousel-item {
  opacity: 0;
  transition-property: opacity;
}
.carousel-fade .carousel-item.active,
.carousel-fade .carousel-item-next.carousel-item-start,
.carousel-fade .carousel-item-prev.carousel-item-end {
  opacity: 1;
}
</style>
