<!-- Header.vue -->
<template>
    <header class="header">
        <h1>{{ pageTitle }}</h1>
        <div v-if="username" class="user-info">
            <p>Welcome, {{ username }}</p>
            <button @click="logout">Logout</button>
        </div>
    </header>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

const pageTitle = ref('Shortily'); // Simplified title
const router = useRouter();

const username = computed(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.name || ''; // Get name from the user object
});

const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // Remove the user object
    // localStorage.removeItem('username'); // Remove if this was used previously, otherwise can remove
    router.push('/login');
};

// Update page title on mounted (optional, title is now static)
onMounted(() => {
    // pageTitle.value = 'Shortily Dashboard'; // Static title set above
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
