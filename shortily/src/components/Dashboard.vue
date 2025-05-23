<template>
    <div class="dashboard">
        <div class="header mb-4">
            <h1>Dashboard</h1>
            <div class="user-info">
                <span>Welcome, {{ userName }}</span>
                <button @click="logout" class="btn btn-outline-danger btn-sm ms-3">Logout</button>
            </div>
        </div>

        <LinkForm @link-created="fetchLinks" />
        
        <div v-if="loading" class="text-center">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
        
        <div v-else-if="error" class="alert alert-danger">
            {{ error }}
        </div>
        
        <div v-else-if="links.length === 0" class="alert alert-info">
            No links found. Create your first short link!
        </div>
        
        <div v-else class="links-list">
            <LinkCard
                v-for="link in links"
                :key="link.id"
                :link="link"
                :editLink="editLink"
                :deleteLink="deleteLink"
            />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import LinkForm from './LinkForm.vue';
import LinkCard from './LinkCard.vue';

const API_URL = import.meta.env.VITE_API_URL;
const router = useRouter();
const links = ref([]);
const loading = ref(true);
const error = ref(null);

const userName = computed(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.name || 'User';
});

const fetchLinks = async () => {
    try {
        loading.value = true;
        error.value = null;
        
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch(`${API_URL}/api/links`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                // Token expirado o inválido
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                router.push('/login');
                return;
            }
            throw new Error('Failed to fetch links');
        }

        const data = await response.json();
        if (data.success && data.links) {
            links.value = data.links.map(link => ({
                ...link,
                shortUrl: `${window.location.origin}/r/${link.shortCode}`
            }));
        }
    } catch (err) {
        error.value = err.message;
    } finally {
        loading.value = false;
    }
};

const editLink = async (link) => {
    const newUrl = prompt('Enter the new URL:', link.originalUrl);
    if (!newUrl || newUrl === link.originalUrl) {
        return;
    }

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch(`${API_URL}/api/links/${link.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ originalUrl: newUrl })
        });

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                router.push('/login');
                return;
            }
            throw new Error('Failed to update link');
        }

        // Actualizar el link en la lista
        const index = links.value.findIndex(l => l.id === link.id);
        if (index !== -1) {
            links.value[index] = {
                ...links.value[index],
                originalUrl: newUrl
            };
        }
    } catch (err) {
        error.value = err.message;
    }
};

const deleteLink = async (linkId) => {
    if (!confirm('Are you sure you want to delete this link?')) {
        return;
    }

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch(`${API_URL}/api/links/${linkId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                router.push('/login');
                return;
            }
            throw new Error('Failed to delete link');
        }

        links.value = links.value.filter(link => link.id !== linkId);
    } catch (err) {
        error.value = err.message;
    }
};

const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
};

onMounted(() => {
    const token = localStorage.getItem('token');
    if (!token) {
        router.push('/login');
        return;
    }
    fetchLinks();
});
</script>

<style scoped>
.dashboard {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.user-info {
    display: flex;
    align-items: center;
}

.links-list {
    margin-top: 20px;
}
</style>
