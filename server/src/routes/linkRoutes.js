import { Router } from "express";
import {
  createLink,
  getLinks,
  updateLink,
  deleteLink,
  getLinkByShortUrl,
} from "../controllers/linkController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/links", authMiddleware, createLink);
router.get("/links", authMiddleware, getLinks);
router.get("/links/:shortUrl", getLinkByShortUrl);
router.put("/links", authMiddleware, updateLink);
router.delete("/links", authMiddleware, deleteLink);

export default router;
