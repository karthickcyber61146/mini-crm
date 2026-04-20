import mongoose from "mongoose";
import { env } from "../config/env.js";
import { Company } from "../models/Company.js";
import { Lead } from "../models/Lead.js";
import { Task } from "../models/Task.js";
import { User } from "../models/User.js";

async function run() {
  await mongoose.connect(env.mongoUri);

  await Promise.all([
    Task.deleteMany({}),
    Lead.deleteMany({}),
    Company.deleteMany({}),
    User.deleteMany({}),
  ]);

  const [john, priya] = await User.create([
    { name: "John Mathew", email: "john@example.com", password: "password123" },
    { name: "Priya Raman", email: "priya@example.com", password: "password123" },
  ]);

  const [abc, delta] = await Company.create([
    { name: "ABC Corp", industry: "IT", location: "Chennai" },
    { name: "Delta Health", industry: "Healthcare", location: "Bengaluru" },
  ]);

  const [leadOne, leadTwo] = await Lead.create([
    {
      name: "Ravi Kumar",
      email: "ravi@mail.com",
      phone: "9876543210",
      status: "New",
      assignedTo: john._id,
      company: abc._id,
    },
    {
      name: "Anita Joseph",
      email: "anita@mail.com",
      phone: "9123456780",
      status: "Qualified",
      assignedTo: priya._id,
      company: delta._id,
    },
  ]);

  await Task.create([
    {
      title: "Call Ravi",
      dueDate: new Date(),
      status: "Pending",
      lead: leadOne._id,
      assignedTo: john._id,
      createdBy: john._id,
    },
    {
      title: "Send proposal",
      dueDate: new Date(),
      status: "Done",
      lead: leadTwo._id,
      assignedTo: priya._id,
      createdBy: priya._id,
    },
  ]);

  console.log("Seed complete");
  await mongoose.disconnect();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
