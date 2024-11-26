import { Chat } from "../models/chat.js";

export const getAllChat = async (req, res) => {
  try {
    const chats = await Chat.find({ participants: { $in: req.user } })
      .populate("participants", "username email")
      .populate({
        path: "messages",
        options: { sort: { createdAt: -1 } },
      })
      .sort({ updatedAt: -1 }); // Sort chats by their latest activity

    return res.status(200).json(chats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

export const createChat = async (req, res) => {
  try {
    const { isGroupChat, otherUser, groupName } = req.body;

    // Validation for group chats
    if (isGroupChat && (!groupName || !otherUser || otherUser.length < 2)) {
      return res.status(400).json({
        message:
          "Group chats must have a group name and at least two other participants.",
      });
    }

    if (isGroupChat) {
      // Create a group chat
      const chat = await Chat.create({
        participants: [req.user, otherUser],
        isGroupChat: true,
        groupName,
        creator: req.user,
      });
      return res
        .status(201)
        .json({ message: "Group chat created successfully", chat });
    }

    // Check if a one-to-one chat already exists
    const existingChat = await Chat.findOne({
      isGroupChat: false,
      participants: { $all: [req.user, otherUser] },
    });

    if (existingChat) {
      return res
        .status(200)
        .json({ message: "Chat already exists", chat: existingChat });
    }

    // Create a one-to-one chat
    const chat = await Chat.create({
      participants: [req.user, otherUser],
    });

    return res.status(201).json({ message: "Chat created successfully", chat });
  } catch (error) {
    console.error("Error creating chat:", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

export const deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Ensure the user is a participant
    if (!chat.participants.includes(req.user)) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this chat" });
    }

    await chat.deleteOne();
    return res.status(200).json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.error("Error deleting chat:", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

export const getAllChatMessages = async (req, res) => {
  const messages = await Chat.find(req.params.id);

  return res.status(200).json(messages);
};
