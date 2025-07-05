import mongoose from "mongoose";
import Project from '../Schemas/ProjectSchema.js'; 

export const getMonthlyJoinStats = async (projectId, year) => {
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
  ];

  const result = await Project.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(projectId) } },
    { $unwind: "$users" },
    {
      $match: {
        "users.createdAt": {
          $gte: new Date(`${year}-01-01T00:00:00.000Z`),
          $lt: new Date(`${year + 1}-01-01T00:00:00.000Z`)
        }
      }
    },
    {
      $group: {
        _id: { month: { $month: "$users.createdAt" } },
        count: { $sum: 1 }
      }
    },
    { $sort: { "_id.month": 1 } }
  ]);

  const stats = Array.from({ length: 12 }, (_, i) => ({
    month: monthNames[i],
    count: 0
  }));

  result.forEach(({ _id, count }) => {
    stats[_id.month - 1].count = count;
  });

  return stats;
};
