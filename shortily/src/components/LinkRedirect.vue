<template>
    <div></div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

onMounted(async () => {
    const shortUrl = route.params.shortUrl;
    try {
        const response = await fetch(`http://localhost:3000/api/links/${shortUrl}`);
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
