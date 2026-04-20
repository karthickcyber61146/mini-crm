import mongoose from "mongoose";

export const TASK_STATUSES = ["Pending", "In Progress", "Done"];

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: TASK_STATUSES, default: "Pending" },
    lead: { type: mongoose.Schema.Types.ObjectId, ref: "Lead", required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Task = mongoose.model("Task", taskSchema);
