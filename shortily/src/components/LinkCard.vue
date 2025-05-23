<!-- LinkCard.vue -->
<template>
    <div class="link-card card">
        <div class="card-content">
            <div class="url-section">
                <h3 class="original-url">{{ link.originalUrl }}</h3>
                <div class="short-url">
                    <span class="label">Short URL:</span>
                    <a :href="`/r/${link.shortCode}`" target="_blank" class="short-link">{{ link.shortUrl }}</a>
                </div>
            </div>
            
            <div class="actions">
                <button class="btn btn-secondary" @click="shareLink(link.shortCode)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="18" cy="5" r="3"></circle>
                        <circle cx="6" cy="12" r="3"></circle>
                        <circle cx="18" cy="19" r="3"></circle>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                    </svg>
                    Share
                </button>
                <button class="btn btn-secondary" @click="copyLink(link.shortCode)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    Copy
                </button>
                <button class="btn btn-primary" @click="editLink(link)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    Edit
                </button>
                <button class="btn btn-danger" @click="deleteLink(link.id)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                    Delete
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    link: {
        type: Object,
        required: true
    },
    editLink: {
        type: Function,
        required: true
    },
    deleteLink: {
        type: Function,
        required: true
    }
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
        } catch (error) {
            console.error('Error sharing:', error);
        }
    } else {
        copyLink(shortCode);
    }
};

const copyLink = (shortCode) => {
    const url = `${window.location.origin}/r/${shortCode}`;
    navigator.clipboard.writeText(url)
        .then(() => {
            alert('Link copied to clipboard!');
        })
        .catch((error) => {
            console.error('Copy failed:', error);
            alert('Copy failed. Please try again.');
        });
};
</script>

<style scoped>
.link-card {
    margin-bottom: 1rem;
    transition: all 0.3s ease;
}

.link-card:hover {
    transform: translateY(-4px);
}

.card-content {
    padding: 1.5rem;
}

.url-section {
    margin-bottom: 1.5rem;
}

.original-url {
    font-size: 1.1rem;
    font-weight: 500;
    color: var(--text-color);
    margin-bottom: 0.5rem;
    word-break: break-all;
}

.short-url {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
}

.label {
    color: #6b7280;
    font-size: 0.9rem;
}

.short-link {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;
}

.short-link:hover {
    color: var(--primary-hover);
    text-decoration: underline;
}

.actions {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
}

.btn {
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-weight: 500;
    transition: all 0.3s ease;
    cursor: pointer;
    border: none;
    font-size: 0.9rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.btn-danger {
    background-color: #ef4444;
    color: white;
}

.btn-danger:hover {
    background-color: #dc2626;
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

@media (max-width: 640px) {
    .actions {
        flex-direction: column;
    }
    
    .btn {
        width: 100%;
    }
}
</style>
