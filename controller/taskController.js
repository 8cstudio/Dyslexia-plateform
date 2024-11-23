import Task from "../models/task.js";

export const createTask = async (req, res) => {
  try {
    const { title, progress, status, deadline } = req.body;
    const task = await Task.create({
      title,

      deadline,

      user: req.user, // Assuming `req.user` is set by authentication middleware
    });

    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Failed to create task", error });
  }
};

export const getUserTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user }).sort({
      createdAt: -1,
    });
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tasks", error });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      "user",
      "name email"
    ); // Populates user info
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch task", error });
  }
};

export const updateTask = async (req, res) => {
  try {
    const updates = req.body;
    const task = await Task.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task updated successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Failed to update task", error });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete task", error });
  }
};

export const markTaskAsCompleted = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.progress = 100;
    task.status = "Completed";
    await task.save();

    res.status(200).json({ message: "Task marked as completed", task });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to mark task as completed", error });
  }
};

export const getOverdueTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user,
      deadline: { $lt: new Date() },
      status: { $ne: "Completed" },
    });

    res.status(200).json({ overdueTasks: tasks });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch overdue tasks", error });
  }
};
