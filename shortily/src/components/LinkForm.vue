<!-- src/components/LinkForm.vue -->
<template>
    <div class="link-form mb-5">
        <h2>Create a new short link</h2>
        <form @submit.prevent="createLink">
            <div class="form-group">
                <label for="originalUrl">Original URL</label>
                <input type="text" v-model="originalUrl" class="form-control" id="originalUrl" required>
            </div>
            <button type="submit" class="btn btn-primary mt-2">Create</button>
        </form>
    </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';
const API_URL = import.meta.env.VITE_API_URL;
const originalUrl = ref('');

// Define los eventos que este componente puede emitir
const emits = defineEmits(['link-created']);

const createLink = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/links`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token,
        },
        body: JSON.stringify({ original_url: originalUrl.value }),
    });
    const data = await response.json();
    if (data.success) {
        const newLink = {
            id: data.urls.id,
            original_url: data.urls.original_url,
            short_url: data.urls.short_url,
        };
        originalUrl.value = '';
        // Emitir el evento link-created
        emits('link-created');
    } else {
        alert(data.message);
    }
};
</script>


<style scoped>
.link-form {
    max-width: 600px;
    margin: auto;
}
</style>
