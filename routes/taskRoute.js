import express from "express";
import {
  createTask,
  deleteTask,
  getOverdueTasks,
  getUserTasks,
  markTaskAsCompleted,
  updateTask,
} from "../controller/taskController.js";

const router = express.Router();

router.post("/", createTask);
router.put("/:id", updateTask);
router.put("/:id/complete", markTaskAsCompleted);
router.delete("/:id", deleteTask);

router.get("/", getUserTasks);
router.get("/overdue", getOverdueTasks);

export default router;
