import { startOfDay, endOfDay } from "../lib/date.js";
import { Lead } from "../models/Lead.js";
import { Task } from "../models/Task.js";

export async function getDashboard(req, res) {
  const [leadStats] = await Lead.aggregate([
    { $match: { deletedAt: null } },
    {
      $group: {
        _id: null,
        totalLeads: { $sum: 1 },
        qualifiedLeads: {
          $sum: {
            $cond: [{ $eq: ["$status", "Qualified"] }, 1, 0],
          },
        },
      },
    },
  ]);

  const [taskStats] = await Task.aggregate([
    {
      $group: {
        _id: null,
        completedTasks: {
          $sum: {
            $cond: [{ $eq: ["$status", "Done"] }, 1, 0],
          },
        },
        tasksDueToday: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $gte: ["$dueDate", startOfDay()] },
                  { $lte: ["$dueDate", endOfDay()] },
                ],
              },
              1,
              0,
            ],
          },
        },
      },
    },
  ]);

  res.json({
    totalLeads: leadStats?.totalLeads || 0,
    qualifiedLeads: leadStats?.qualifiedLeads || 0,
    tasksDueToday: taskStats?.tasksDueToday || 0,
    completedTasks: taskStats?.completedTasks || 0,
  });
}
