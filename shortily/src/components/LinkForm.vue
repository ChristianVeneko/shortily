<!-- src/components/LinkForm.vue -->
<template>
    <div class="link-form card">
        <h2 class="form-title">Create a new short link</h2>
        <form @submit.prevent="createLink" class="form">
            <div class="form-group">
                <label for="originalUrl">Original URL</label>
                <input 
                    type="text" 
                    v-model="originalUrl" 
                    class="input" 
                    id="originalUrl" 
                    placeholder="Enter your URL here..."
                    required
                >
            </div>
            <button type="submit" class="btn btn-primary">
                <span>Create Short Link</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
            </button>
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
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login to create links');
            return;
        }

        const response = await fetch(`${API_URL}/api/links`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ originalUrl: originalUrl.value })
        });

        const data = await response.json();
        if (data.link) {
            originalUrl.value = '';
            // Emitir el evento link-created
            emits('link-created');
        } else {
            throw new Error(data.error || 'Failed to create link');
        }
    } catch (error) {
        alert(error.message);
    }
};
</script>

<style scoped>
.link-form {
    max-width: 600px;
    margin: 2rem auto;
    animation: slideUp 0.5s ease-out;
}

.form-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-color);
    margin-bottom: 1.5rem;
    text-align: center;
}

.form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.form-group label {
    font-weight: 500;
    color: var(--text-color);
}

.input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 0.5rem;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.btn {
    width: 100%;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 500;
    transition: all 0.3s ease;
    cursor: pointer;
    border: none;
    font-size: 1rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
