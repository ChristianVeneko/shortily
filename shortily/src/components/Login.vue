<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const router = useRouter();

const login = async () => {
    const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.value, password: password.value })
    });

    const data = await response.json();
    if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', username.value);
        router.push('/dashboard');
    } else {
        alert(data.message);
    }
};
</script>

<template>
    <div class="container">
        <h1 class="mt-5">Login</h1>
        <form @submit.prevent="login">
            <div class="form-group">
                <label for="logUsername">Username</label>
                <input type="text" v-model="username" class="form-control" id="logUsername" required>
            </div>
            <div class="form-group">
                <label for="logPassword">Password</label>
                <input type="password" v-model="password" class="form-control" id="logPassword" required>
            </div>
            <button type="submit" class="btn btn-primary">Login</button>
        </form>
        <p class="mt-3">Don't have an account? <router-link to="/register">Register here</router-link></p>
    </div>
</template>
