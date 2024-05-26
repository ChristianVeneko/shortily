<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const API_URL = import.meta.env.VITE_API_URL;

onMounted(async () => {
    const shortUrl = route.params.shortUrl;
    try {
        const response = await fetch(`${API_URL}/api/links/${shortUrl}`);
        const data = await response.json();
        if (data.success) {
            let originalUrl = data.data.original_url;

            // Verificar si el enlace original tiene un esquema válido y un dominio
            const urlRegex = /^(https?:\/\/)/;
            if (!urlRegex.test(originalUrl)) {
                // Si no tiene un esquema válido, agregar "https://"
                originalUrl = `https://${originalUrl}`;
            }

            // Redirigir al enlace original
            window.location.href = originalUrl;
        } else {
            console.error(data.message);
        }
    } catch (error) {
        console.error(error);
    }
});
</script>
