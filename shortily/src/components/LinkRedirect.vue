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
            // Redirigir al enlace original sin agregar el prefijo de la aplicación
            window.location.href = data.data.original_url;
        } else {
            console.error(data.message);
            // Si hay un error, puedes manejar la situación aquí
        }
    } catch (error) {
        console.error(error);
        // Si hay un error, puedes manejar la situación aquí
    }
});
</script>
