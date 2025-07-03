<template>
    <div class="container py-4">
        <h3 class="text-primary-arida mb-4">Ubicaciones registradas</h3>

        <div class="row g-4">
            <div class="col-md-4" v-for="ubicacion in ubicaciones" :key="ubicacion.id">
                <div class="card card-ubicacion h-100 shadow-sm" @click="verDetalle(ubicacion.id)"
                    style="cursor: pointer">
                    <img :src="ubicacion.imagen" class="card-img-top" alt="Ubicación"
                        style="height: 180px; object-fit: cover" />
                    <div class="card-body">
                        <h5 class="card-title text-center">{{ ubicacion.nombre }}</h5>
                    </div>
                </div>
            </div>
        </div>

        <div class="fab-container">
            <!-- Botón: Agregar nueva ubicación -->
            <button class="btn fab-btn" @click="agregarUbicacion">
                <i class="bi bi-plus-lg"></i>
            </button>

            <!-- Botón: Regresar -->
            <button class="btn fab-btn-secondary" @click="regresar">
                <i class="bi bi-arrow-left"></i>
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Ubicaciones',
    data() {
        return {
            ubicaciones: [
                {
                    id: 1,
                    nombre: 'Invernadero Norte',
                    imagen: 'https://via.placeholder.com/300x180?text=Invernadero+Norte'
                },
                {
                    id: 2,
                    nombre: 'Huerto Sur',
                    imagen: 'https://via.placeholder.com/300x180?text=Huerto+Sur'
                }
                // Agrega más si deseas
            ]
        }
    },
    methods: {
        agregarUbicacion() {
            this.$router.push('/nueva-ubicacion')
        },
        regresar() {
            this.$router.go(-1) // o usa this.$router.push('/dashboard') si prefieres
        },
        verDetalle(id) {
            this.$router.push(`/ubicacion/${id}`)
        }
    }
}
</script>

<style scoped>
.card-ubicacion {
    border-radius: 10px;
    overflow: hidden;
    background-color: #F5F3EF;
}

.text-primary-arida {
    color: #1C2C4C;
}

.fab-container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    z-index: 1000;
}

.fab-btn {
    background-color: #3C8C60;
    color: white;
    border: none;
    border-radius: 50%;
    width: 56px;
    height: 56px;
    font-size: 1.25rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition: all 0.2s ease-in-out;
}

.fab-btn:hover {
    background-color: #2E6E4A;
}

.fab-btn-secondary {
    background-color: #1C2C4C;
    color: white;
    border: none;
    border-radius: 50%;
    width: 56px;
    height: 56px;
    font-size: 1.25rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition: all 0.2s ease-in-out;
}

.fab-btn-secondary:hover {
    background-color: #122034;
}
</style>
