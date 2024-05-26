<!-- src/components/Welcome.vue -->
<template>
    <div class="container text-center mt-5">
        <h1>Welcome to Shortily</h1>
        <p>Your easy-to-use URL shortening service. Create, manage, and share short links effortlessly.</p>
        <div class="mt-4">
            <router-link to="/login" class="btn btn-primary mx-2">Login</router-link>
            <router-link to="/register" class="btn btn-secondary mx-2">Register</router-link>
        </div>
    </div>
</template>

<script setup>
</script>

<style scoped>
h1 {
    font-size: 3rem;
}

p {
    font-size: 1.2rem;
}
</style>
