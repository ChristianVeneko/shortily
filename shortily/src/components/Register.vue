<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const name = ref('');
const router = useRouter();
const API_URL = import.meta.env.VITE_API_URL

const register = async () => {
    try {
        const response = await fetch(`${API_URL}/api/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                email: email.value, 
                password: password.value,
                name: name.value 
            })
        });

        const data = await response.json();
        if (data.token) {
            alert('Registration successful! Please login.');
            router.push('/login');
        } else {
            alert(data.error || 'Registration failed');
        }
    } catch (error) {
        alert('An error occurred during registration');
    }
};
</script>

<template>
    <div class="container">
        <h1 class="mt-5">Register</h1>
        <form @submit.prevent="register">
            <div class="form-group">
                <label for="regName">Name</label>
                <input type="text" v-model="name" class="form-control" id="regName" required>
            </div>
            <div class="form-group">
                <label for="regEmail">Email</label>
                <input type="email" v-model="email" class="form-control" id="regEmail" required>
            </div>
            <div class="form-group">
                <label for="regPassword">Password</label>
                <input type="password" v-model="password" class="form-control" id="regPassword" required>
            </div>
            <button type="submit" class="btn btn-primary">Register</button>
        </form>
        <p class="mt-3">Already have an account? <router-link to="/login">Login here</router-link></p>
    </div>
</template>
