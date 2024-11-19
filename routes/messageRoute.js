import express from "express";
import Chat from "../models/chat.js";
const router = express.Router();

router.get("/chats/:userId", async (req, res) => {
  const userId = req.params.userId;
  const chats = await Chat.find({ members: userId });
  res.send(chats);
});

router.get("/chats/:userId", async (req, res) => {
  const userId = req.params.userId;
  const chats = await Chat.find({ members: userId });
  res.send(chats);
});

router.post("/chats", async (req, res) => {
  const { members } = req.body; // Array of User IDs
  const chat = new Chat({ members });
  await chat.save();
  res.status(201).send(chat);
});

router.post("/chats/:chatId/messages", async (req, res) => {
  const { chatId } = req.params;
  const { sender, text } = req.body;
  const chat = await Chat.findById(chatId);
  chat.messages.push({ sender, text });
  await chat.save();
  io.to(chatId).emit("new-message", chat);
  res.send(chat);
});
export default router;
