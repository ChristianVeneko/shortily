<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const router = useRouter();
const API_URL = import.meta.env.VITE_API_URL

const register = async () => {
    const response = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.value, password: password.value })
    });

    const data = await response.json();
    if (data.success) {
        alert(data.message);
        router.push('/login');
    } else {
        alert(data.message);
    }
};
</script>

<template>
    <div class="container">
        <h1 class="mt-5">Register</h1>
        <form @submit.prevent="register">
            <div class="form-group">
                <label for="regUsername">Username</label>
                <input type="text" v-model="username" class="form-control" id="regUsername" required>
            </div>
            <div class="form-group">
                <label for="regPassword">Password</label>
                <input type="password" v-model="password" class="form-control" id="regPassword" required>
            </div>
            <button type="submit" class="btn btn-primary">Register</button>
        </form>
        <p class="mt-3">Already have an account? <router-link to="/">Login here</router-link></p>
    </div>
</template>
