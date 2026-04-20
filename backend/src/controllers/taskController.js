import { AppError } from "../lib/errors.js";
import { Lead } from "../models/Lead.js";
import { Task, TASK_STATUSES } from "../models/Task.js";
import { User } from "../models/User.js";

export async function createTask(req, res) {
  const { title, dueDate, lead, assignedTo } = req.body;

  if (!title || !dueDate || !lead || !assignedTo) {
    throw new AppError(400, "All task fields are required");
  }

  const [leadRecord, user] = await Promise.all([
    Lead.findOne({ _id: lead, deletedAt: null }),
    User.findById(assignedTo),
  ]);

  if (!leadRecord) {
    throw new AppError(400, "Lead not found");
  }

  if (!user) {
    throw new AppError(400, "Assigned user not found");
  }

  const task = await Task.create({
    title,
    dueDate,
    lead,
    assignedTo,
    createdBy: req.user._id,
  });

  const populatedTask = await Task.findById(task._id)
    .populate("lead", "name email")
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email");

  res.status(201).json(populatedTask);
}

export async function listTasks(_req, res) {
  const tasks = await Task.find()
    .populate("lead", "name email")
    .populate("assignedTo", "name email")
    .sort({ dueDate: 1, createdAt: -1 });

  res.json({ items: tasks, statuses: TASK_STATUSES });
}

export async function updateTaskStatus(req, res) {
  const { status } = req.body;

  if (!TASK_STATUSES.includes(status)) {
    throw new AppError(400, "Invalid task status");
  }

  const task = await Task.findById(req.params.id);

  if (!task) {
    throw new AppError(404, "Task not found");
  }

  if (task.assignedTo.toString() !== req.user._id.toString()) {
    throw new AppError(403, "Only the assigned user can update this task");
  }

  task.status = status;
  await task.save();

  const updatedTask = await Task.findById(task._id)
    .populate("lead", "name email")
    .populate("assignedTo", "name email");

  res.json(updatedTask);
}
