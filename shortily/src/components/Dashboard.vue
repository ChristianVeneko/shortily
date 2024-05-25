<template>
    <div class="container">
        <h1 class="mt-5">Dashboard</h1>
        <p>Welcome, {{ username }}</p>
        <button @click="logout" class="btn btn-secondary">Logout</button>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const username = ref('');
const router = useRouter();

onMounted(() => {
    const storedUsername = localStorage.getItem('username');
    if (!storedUsername) {
        router.push('/');
    } else {
        username.value = storedUsername;
    }
});

const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    router.push('/');
};
</script>
