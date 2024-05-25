<template>
    <div></div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const API_URL = import.meta.env.VITE_API_URL

onMounted(async () => {
    const shortUrl = route.params.shortUrl;
    try {
        const response = await fetch(`${API_URL}/api/links/${shortUrl}`);
        const data = await response.json();
        if (data.success) {
            window.location.href = data.data.original_url;
        } else {
            console.error(data.message);
            router.push('/');
        }
    } catch (error) {
        console.error(error);
        router.push('/');
    }
});
</script>
