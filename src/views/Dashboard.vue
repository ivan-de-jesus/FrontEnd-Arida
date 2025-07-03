<template>
    <div class="container py-5">

        <div class="row g-4">
            <!-- Tarjeta: Ubicaciones -->
            <router-link to="/ubicaciones" class="col-md-6 text-decoration-none">
                <div class="card shadow-sm card-arida text-center p-3 h-100">
                    <div class="icon-container mb-3">
                        <i class="bi bi-geo-alt-fill icon-arida"></i>
                    </div>
                    <h5 class="title-arida">Ubicaciones</h5>
                    <p class="subtitle-arida">Gestiona puntos de monitoreo</p>
                </div>
            </router-link>

            <!-- Tarjeta: Dispositivos -->
            <div class="col-md-6">
                <div class="card shadow-sm card-arida text-center p-3">
                    <div class="icon-container mb-3">
                        <i class="bi bi-cpu-fill icon-arida"></i>
                    </div>
                    <h5 class="title-arida">Dispositivos</h5>
                    <p class="subtitle-arida">Administra tus sensores y nodos</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card-arida {
    background-color: #F5F3EF;
    border: none;
    border-radius: 10px;
    transition: transform 0.2s ease-in-out;
}

.card-arida:hover {
    transform: translateY(-5px);
}

.icon-container {
    font-size: 2.5rem;
    color: #3C8C60;
}

.title-arida {
    color: #1C2C4C;
    font-weight: 600;
    margin-bottom: 0.3rem;
}

.subtitle-arida {
    color: #4A4A4A;
    font-size: 0.95rem;
}

.text-primary-arida {
    color: #1C2C4C;
}
</style>
