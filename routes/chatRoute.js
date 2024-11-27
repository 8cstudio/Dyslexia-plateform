import express from "express";
import {
  ADD_USER_TO_GROUP,
  createChat,
  deleteChat,
  getAllChat,
} from "../controller/chatController.js";

const router = express.Router();

router.post("/create", createChat);
router.get("/chats", getAllChat);

router.delete("/:id", deleteChat);
router.put("/add/user/:id", ADD_USER_TO_GROUP);
export default router;
