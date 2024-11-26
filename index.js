import express from "express";
import { createServer } from "http"; // Import HTTP to attach Socket.io
import { Server } from "socket.io"; // Import Socket.io
import { connectDB } from "./config/database.js";
import dotenv from "dotenv";
import authRoute from "./routes/authRoute.js";
import userRoutes from "./routes/userRoute.js";
import chatRoute from "./routes/chatRoute.js";
import chatMessages from "./routes/messageRoute.js";
import feedRoute from "./routes/feedRoute.js";
import taskRoute from "./routes/taskRoute.js";
import cors from "cors";
import { verifyToken } from "./middleware/verifyToken.js";
import { Message, Chat } from "./models/chat.js";

const app = express();
dotenv.config();
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// Middleware for parsing JSON
app.use(express.json());
// URL Example for uploaded files
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Serve static files from the "uploads" folder
//app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static("public"));
app.use(
  cors({
    origin: "*",
  })
);

// Connect to the database
connectDB();

// Define routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", verifyToken, userRoutes);
app.use("/api/v1/chat", verifyToken, chatRoute);
app.use("/api/v1/message", chatMessages);
app.use("/api/v1/feedback", feedRoute);
app.use("/api/v1/task", verifyToken, taskRoute);
// Create an HTTP server to attach Socket.io
const httpServer = createServer(app);
console.log(process.env.PORT);
// Initialize Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow all origins
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("joinChat", ({ chatId }) => {
    socket.join(chatId);
    console.log(`User joined chat: ${chatId}`);
  });

  socket.on("leaveRoom", (chatId) => {
    socket.leave(chatId);
    console.log(`User left chat: ${chatId}`);
  });

  socket.on("sendMessage", async ({ sender, chat, content, isGroupChat }) => {
    const newMessage = {
      isGroupChat,
      sender,
      content,
      chat,
    };

    try {
      const savedMessage = await Message.create(newMessage);
      console.log("message sent to chat", savedMessage);
      io.to(chat).emit("receiveMessage", savedMessage);
      addMessageToChat(chat, savedMessage);
    } catch (error) {
      console.error("Error saving or emitting message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

export const addMessageToChat = async (chatId, savedMessage) => {
  try {
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: {
          messages: savedMessage,
        },
      },
      { new: true } // Return the updated document
    );

    return updatedChat;
  } catch (error) {
    console.error("Error updating chat:", error);
    throw error; // Re-throw the error for higher-level handling
  }
};

// Start the server
const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
