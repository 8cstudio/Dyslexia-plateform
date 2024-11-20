import { Message } from "../models/chat.js";

export const getChatMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.id });
    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({ message: "something went wrong", error });
  }
};
