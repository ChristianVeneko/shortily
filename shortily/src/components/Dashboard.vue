<template>
    <div>
        <HeaderPage></HeaderPage>
        <div class="dashboard container mt-5">
            <LinkForm :onLinkCreated="fetchLinks" />
            <h2 class="mt-5">Your Links</h2>
            <div v-if="links.length === 0">No links created yet.</div>
            <div v-else>
                <LinkCard v-for="link in links" :key="link.id" :link="link" :edit-link="editLink"
                    :delete-link="deleteLink" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import LinkForm from '../components/LinkForm.vue';
import LinkCard from '../components/LinkCard.vue';
import HeaderPage from './HeaderPage.vue';
const API_URL = import.meta.env.VITE_API_URL

const links = ref([]);
const username = ref('');
const router = useRouter();

const fetchLinks = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/links`, {
        headers: {
            Authorization: token,
        },
    });
    const data = await response.json();
    if (data.success) {
        links.value = data.data;
    } else {
        alert(data.message);
    }
};

const editLink = async (link) => {
    const newUrl = prompt('Enter new URL:', link.original_url);
    if (newUrl) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/api/links`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
            body: JSON.stringify({ id: link.id, original_url: newUrl }),
        });
        const data = await response.json();
        if (data.success) {
            link.original_url = newUrl;
        } else {
            alert(data.message);
        }
    }
};

const deleteLink = async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/links`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token,
        },
        body: JSON.stringify({ id }), // Asegúrate de que el id se pasa aquí
    });
    const data = await response.json();
    if (data.success) {
        links.value = links.value.filter((link) => link.id !== id);
    } else {
        alert(data.message);
    }
};

onMounted(() => {
    fetchLinks()
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
