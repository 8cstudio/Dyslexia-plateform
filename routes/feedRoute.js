import express from "express";
import {
  deleteFeedback,
  submitFeedback,
} from "../controller/feedbackController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, submitFeedback);
router.delete("/:id", verifyToken, deleteFeedback);
export default router;
