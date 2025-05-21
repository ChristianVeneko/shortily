<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);
const router = useRouter();
const API_URL = import.meta.env.VITE_API_URL;

const login = async () => {
    try {
        loading.value = true;
        error.value = '';

        const response = await fetch(`${API_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email.value, password: password.value })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || data.error || 'Login failed');
        }

        if (data.token) {
            // Guardar el token en localStorage
            localStorage.setItem('token', data.token);
            
            // Guardar información del usuario
            if (data.user) {
                localStorage.setItem('user', JSON.stringify({
                    id: data.user.id,
                    email: data.user.email,
                    name: data.user.name
                }));
            }

            // Redirigir al dashboard
            router.push('/dashboard');
        } else {
            throw new Error('No token received');
        }
    } catch (err) {
        error.value = err.message;
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="container">
        <h1 class="mt-5">Login</h1>
        <form @submit.prevent="login">
            <div class="form-group">
                <label for="logEmail">Email</label>
                <input type="email" v-model="email" class="form-control" id="logEmail" required>
            </div>
            <div class="form-group">
                <label for="logPassword">Password</label>
                <input type="password" v-model="password" class="form-control" id="logPassword" required>
            </div>
            <div v-if="error" class="alert alert-danger mt-3">
                {{ error }}
            </div>
            <button type="submit" class="btn btn-primary" :disabled="loading">
                {{ loading ? 'Logging in...' : 'Login' }}
            </button>
        </form>
        <p class="mt-3">Don't have an account? <router-link to="/register">Register here</router-link></p>
    </div>
</template>

<style scoped>
.form-group {
    margin-bottom: 1rem;
}

.alert {
    margin-bottom: 1rem;
}
</style>
