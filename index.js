import express from "express";
import { createServer } from "http"; // Import HTTP to attach Socket.io
import { Server } from "socket.io"; // Import Socket.io
import { connectDB } from "./config/database.js";
import dotenv from "dotenv";
import authRoute from "./routes/authRoute.js";
import userRoutes from "./routes/userRoute.js";
import chatRoute from "./routes/chatRoute.js";
import cors from "cors";
import { verifyToken } from "./middleware/verifyToken.js";
import { Message, Chat } from "./models/chat.js";
const app = express();
dotenv.config();

// Middleware for parsing JSON
app.use(express.json());

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

// Create an HTTP server to attach Socket.io
const httpServer = createServer(app);

// Initialize Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow all origins
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Join rooms (one-to-one or group chats)
  socket.on("joinChat", ({ chatId }) => {
    socket.join(chatId);
    console.log(`User joined chat: ${chatId}`);
  });

  // Handle sending messages
  socket.on("sendMessage", async ({ sender, chatId, content, isGroupChat }) => {
    const newMessage = {
      sender,
      content,
      chat: chatId,
      timestamp: new Date(),
    };

    try {
      // Save the message to the database
      const message = await Message.create(newMessage);

      // Emit the message to the appropriate room
      io.to(chatId).emit("receiveMessage", message);

      console.log(
        `Message sent to ${isGroupChat ? "group" : "user"} chat ${chatId}:`,
        message
      );
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
