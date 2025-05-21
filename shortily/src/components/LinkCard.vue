<!-- LinkCard.vue -->
<template>
    <div class="card mb-3">
        <div class="card-body">
            <h5 class="card-title">{{ link.originalUrl }}</h5>
            <p class="card-text">
                Short URL: <a :href="`/r/${link.shortCode}`" target="_blank">{{ link.shortUrl }}</a>
            </p>
            <p class="card-text">
                <small class="text-muted">Clicks: {{ link.clicks || 0 }}</small>
            </p>
            <div class="d-flex justify-content-between align-items-center">
                <div class="mr-2">
                    <button class="btn btn-secondary btn-sm" @click="shareLink(link.shortCode)">Share</button>
                </div>
                <div class="mr-2">
                    <button class="btn btn-secondary btn-sm" @click="copyLink(link.shortCode)">Copy</button>
                </div>
                <div class="mr-2">
                    <button class="btn btn-primary btn-sm" @click="editLink(link)">Edit</button>
                </div>
                <button class="btn btn-danger btn-sm" @click="deleteLink(link.id)">Delete</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';
const API_URL = import.meta.env.VITE_API_URL;
const props = defineProps({
    link: Object,
    editLink: Function,
    deleteLink: Function,
});

const shareLink = async (shortCode) => {
    const url = `${window.location.origin}/r/${shortCode}`;
    if (navigator.share) {
        try {
            await navigator.share({
                title: 'Check out this link',
                text: 'I found this link and wanted to share it with you',
                url: url,
            });
            console.log('Shared successfully');
        } catch (error) {
            console.error('Error sharing:', error);
        }
    } else {
        console.log('Web Share API is not supported in this browser');
        // Implement fallback behavior for browsers that do not support Web Share API
    }
};

const copyLink = (shortCode) => {
    const url = `${window.location.origin}/r/${shortCode}`;
    navigator.clipboard.writeText(url)
        .then(() => {
            console.log('Link copied to clipboard');
            alert('Link copied to clipboard');
        })
        .catch((error) => {
            console.error('Copy failed:', error);
            alert('Copy failed. Please try again.');
        });
};
</script>
