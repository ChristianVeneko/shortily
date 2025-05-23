import express from 'express';
import { createShortLink, getLink, getUserLinksList, deleteUserLink, redirectToOriginalUrl, updateUserLink } from '../controllers/linkController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Protected routes
router.post('/links', authenticateToken, createShortLink);
router.get('/links', authenticateToken, getUserLinksList);
router.put('/links/:linkId', authenticateToken, updateUserLink);
router.delete('/links/:linkId', authenticateToken, deleteUserLink);

// Public routes
router.get('/links/:shortCode', getLink);
router.get('/r/:shortCode', redirectToOriginalUrl);

export default router;
