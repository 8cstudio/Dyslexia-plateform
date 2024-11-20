import express from "express";
import { Chat } from "../models/chat.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { getChatMessages } from "../controller/messageController.js";
const router = express.Router();

router.get("/:id", verifyToken, getChatMessages);
export default router;
