import mongoose from "mongoose";
const MONGO_URI = process.env.MONGO_URI;

// Function to Connect to MongoDB
export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit the process with failure
  }
};