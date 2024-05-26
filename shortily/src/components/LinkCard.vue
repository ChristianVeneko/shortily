<!-- src/components/LinkCard.vue -->
<template>
    <div class="card mb-3">
        <div class="card-body">
            <h5 class="card-title">{{ link.original_url }}</h5>
            <p class="card-text">Short URL: <a :href="`/r/${link.short_url}`" target="_blank">{{ link.short_url }}</a>
            </p>
            <button class="btn btn-secondary btn-sm" @click="editLink(link)">Edit</button>
            <button class="btn btn-danger btn-sm ml-2" @click="deleteLink(link.id)">Delete</button>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    link: Object,
    editLink: Function,
    deleteLink: Function,
});
</script>
