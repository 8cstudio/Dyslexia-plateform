import express from "express";
import {
  createChat,
  deleteChat,
  getAllChat,
} from "../controller/chatController.js";

const router = express.Router();

router.post("/create", createChat);
router.get("/chats", getAllChat);

router.delete("/:id", deleteChat);
export default router;
