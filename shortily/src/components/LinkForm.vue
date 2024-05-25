<template>
    <div class="container">
        <h2>Create a new short link</h2>
        <form @submit.prevent="createLink">
            <div class="form-group">
                <label for="originalUrl">Original URL</label>
                <input type="text" v-model="originalUrl" class="form-control" id="originalUrl" required />
            </div>
            <button type="submit" class="btn btn-primary mt-2">Create</button>
        </form>
        <h2 class="mt-5">Your Links</h2>
        <div v-if="links.length === 0">No links created yet.</div>
        <ul class="list-group mt-3" v-else>
            <li v-for="link in links" :key="link.id"
                class="list-group-item d-flex justify-content-between align-items-center">
                <span>{{ link.original_url }} - <a :href="`/r/${link.short_url}`" target="_blank">{{ link.short_url
                        }}</a></span>
                <div>
                    <button class="btn btn-sm btn-secondary mr-2" @click="editLink(link)">Edit</button>
                    <button class="btn btn-sm btn-danger" @click="deleteLink(link.id)">Delete</button>
                </div>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const originalUrl = ref('');
const links = ref([]);
const API_URL = import.meta.env.VITE_API_URL

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

const createLink = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/links`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token,
        },
        body: JSON.stringify({ original_url: originalUrl.value }),
    });
    const data = await response.json();
    if (data.success) {
        const newLink = {
            id: data.urls.id,
            original_url: data.urls.original_url,
            short_url: data.urls.short_url,
        };
        links.value.push(newLink);
        originalUrl.value = '';
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

onMounted(fetchLinks);
</script>
