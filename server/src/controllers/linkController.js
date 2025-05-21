import { createLink, getLinkByShortCode, getUserLinks, deleteLink } from '../services/firebaseService.js';
import * as admin from 'firebase-admin';

export const createShortLink = async (req, res) => {
    try {
        const { originalUrl } = req.body;
        const userId = req.user.uid;

        if (!userId) return res.status(401).json({ error: 'User not authenticated' });
        if (!originalUrl) return res.status(400).json({ error: 'URL is required' });

        const link = await createLink(originalUrl, userId);
        res.status(201).json({ 
            success: true, 
            link: {
                id: link.id,
                originalUrl: link.originalUrl,
                shortCode: link.shortCode,
                shortUrl: `${process.env.BASE_URL}/r/${link.shortCode}`,
                clicks: link.clicks || 0,
                createdAt: link.createdAt,
                updatedAt: link.updatedAt
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create short link' });
    }
};

export const getLink = async (req, res) => {
    try {
        const link = await getLinkByShortCode(req.params.shortCode);
        if (!link) return res.status(404).json({ error: 'Link not found' });

        res.json({
            success: true,
            link: {
                id: link.id,
                originalUrl: link.originalUrl,
                shortCode: link.shortCode,
                shortUrl: `${process.env.BASE_URL}/r/${link.shortCode}`,
                clicks: link.clicks || 0
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get link' });
    }
};

export const getUserLinksList = async (req, res) => {
    try {
        const userId = req.user.uid;
        if (!userId) return res.status(401).json({ error: 'User not authenticated' });

        const links = await getUserLinks(userId);
        const formattedLinks = links.map(link => ({
            id: link.id,
            originalUrl: link.originalUrl,
            shortCode: link.shortCode,
            shortUrl: `${process.env.BASE_URL}/r/${link.shortCode}`,
            clicks: link.clicks || 0,
            createdAt: link.createdAt,
            updatedAt: link.updatedAt
        }));

        res.json({ success: true, links: formattedLinks });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get user links' });
    }
};

export const deleteUserLink = async (req, res) => {
    try {
        const { linkId } = req.params;
        const userId = req.user.uid;

        if (!userId) return res.status(401).json({ error: 'User not authenticated' });

        const link = await getLinkByShortCode(linkId);
        if (!link) return res.status(404).json({ error: 'Link not found' });
        if (link.userId !== userId) return res.status(403).json({ error: 'Not authorized to delete this link' });

        await deleteLink(linkId);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete link' });
    }
};

export const redirectToOriginalUrl = async (req, res) => {
    try {
        const { shortCode } = req.params;
        if (!shortCode) return res.status(400).json({ error: 'Short code is required' });

        const link = await getLinkByShortCode(shortCode);
        if (!link) return res.status(404).json({ error: 'Link not found' });
        if (!link.originalUrl) return res.status(400).json({ error: 'Invalid link: missing original URL' });

        let redirectUrl = link.originalUrl;
        if (!redirectUrl.startsWith('http://') && !redirectUrl.startsWith('https://')) {
            redirectUrl = 'https://' + redirectUrl;
        }

        await link.ref.update({
            clicks: admin.firestore.FieldValue.increment(1),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        res.redirect(redirectUrl);
    } catch (error) {
        res.status(500).json({ error: 'Failed to redirect' });
    }
};
