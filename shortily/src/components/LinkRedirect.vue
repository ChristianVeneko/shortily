<template>
    <div class="redirect-container">
        <div v-if="loading" class="loading">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p>Redirecting...</p>
        </div>
        <div v-else-if="error" class="error">
            <h2>Error</h2>
            <p>{{ error }}</p>
            <router-link to="/" class="btn btn-primary">Go Home</router-link>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const API_URL = import.meta.env.VITE_API_URL;
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
    try {
        const response = await fetch(`${API_URL}/api/links/${route.params.shortUrl}`);
        if (!response.ok) throw new Error('Link not found');
        
        const { link } = await response.json();
        if (link?.originalUrl) {
            window.location.href = link.originalUrl;
        } else {
            throw new Error('Invalid link data');
        }
    } catch (err) {
        error.value = err.message;
        loading.value = false;
    }
});
</script>

<style scoped>
.redirect-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    text-align: center;
}

.loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}

.error {
    padding: 2rem;
    border-radius: 8px;
    background-color: #f8d7da;
    color: #721c24;
}
</style>
