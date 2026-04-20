import { Router } from "express";
import { createTask, listTasks, updateTaskStatus } from "../controllers/taskController.js";
import { asyncHandler } from "../lib/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(listTasks));
router.post("/", asyncHandler(createTask));
router.patch("/:id/status", asyncHandler(updateTaskStatus));

export default router;
