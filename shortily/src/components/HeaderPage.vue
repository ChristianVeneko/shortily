<!-- Header.vue -->
<template>
    <header class="header">
        <h1>{{ pageTitle }}</h1>
        <div class="user-info">
            <p>Welcome, {{ username }}</p>
            <button @click="logout">Logout</button>
        </div>
    </header>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const pageTitle = ref('');
const username = ref('');
const router = useRouter();

const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    router.push('/');
};

// Update page title and retrieve username from localStorage
onMounted(() => {
    pageTitle.value = 'Shortily Dashboard'; // Set page title
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
        username.value = storedUsername;
    }
});
</script>

<style scoped>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background-color: #f0f0f0;
    border-bottom: 1px solid #ccc;
}

.user-info p {
    margin: 0;
}

button {
    background-color: #dc3545;
    color: #fff;
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;
    border-radius: 4px;
}

button:hover {
    background-color: #c82333;
}
</style>
