<!-- LinkCard.vue -->
<template>
    <div class="card mb-3">
        <div class="card-body">
            <h5 class="card-title">{{ link.original_url }}</h5>
            <p class="card-text">
                Short URL: <a :href="`/r/${link.short_url}`" target="_blank">{{ link.short_url }}</a>
            </p>
            <div class="d-flex justify-content-between align-items-center">
                <div class="mr-2">
                    <button class="btn btn-secondary btn-sm" @click="shareLink(link.short_url)">Share</button>
                </div>
                <div class="mr-2">
                    <button class="btn btn-secondary btn-sm" @click="copyLink(link.short_url)">Copy</button>
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
const ORIGIN_URL = import.meta.env.VITE_ORIGIN_URL;
const props = defineProps({
    link: Object,
    editLink: Function,
    deleteLink: Function,
});

const shareLink = async (shortUrl) => {
    const url = `${ORIGIN_URL}/r/${shortUrl}`
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

const copyLink = (shortUrl) => {
    const url = `${ORIGIN_URL}/r/${shortUrl}`
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
