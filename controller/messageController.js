import { Message } from "../models/chat.js";

export const getChatMessages = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Chat ID is required" });
  }

  try {
    const messages = await Message.find({ chat: id })
      .populate("sender", "username")
      .populate("chat", "isGroupChat");

    if (!messages) {
      return res
        .status(404)
        .json({ message: "No messages found for this chat" });
    }

    return res.status(200).json(messages);
  } catch (error) {
    console.error(error); // Log error for debugging
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};
