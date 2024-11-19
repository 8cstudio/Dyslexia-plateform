import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";

import {
  deleteUser,
  getCurrentUser,
  updateUser,
  getAllUsers,
} from "../controller/userController.js";

const router = express.Router();

router.get("/", getAllUsers);
router.delete("/:id", deleteUser);
router.put("/:id", updateUser);

router.get("/me", getCurrentUser);

export default router;
