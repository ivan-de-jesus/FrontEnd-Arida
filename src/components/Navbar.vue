<template>
  <nav class="navbar navbar-expand-lg navbar-arida shadow-sm px-3">
    <div class="container-fluid">
      <span class="navbar-brand mb-0 h4 text-white">ARIDA</span>

      <div class="d-flex align-items-center ms-auto">
        <!-- Icono de notificaciones -->
        <button class="btn btn-link text-white me-3 position-relative">
          <i class="bi bi-bell-fill fs-5"></i>
          <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            3
          </span>
        </button>

        <!-- Icono de perfil -->
        <button class="btn btn-link text-white">
          <i class="bi bi-person-circle fs-5"></i>
        </button>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar-arida {
  background-color: #1C2C4C;
}
</style>
