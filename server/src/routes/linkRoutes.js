import { Router } from "express";
import {
  status,
  createLink,
  getLinks,
  updateLink,
  deleteLink,
  getLinkByShortUrl,
  mantainDatabase
} from "../controllers/linkController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/status", status)
router.post("/links", authMiddleware, createLink);
router.get("/links", authMiddleware, getLinks);
router.get("/links/:shortUrl", getLinkByShortUrl);
router.put("/links", authMiddleware, updateLink);
router.delete("/links", authMiddleware, deleteLink);
router.get("/test", mantainDatabase)

export default router;
