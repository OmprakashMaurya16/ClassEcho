const Feedback = require("../models/feedback.model.js");
const asyncHandler = require("../utils/async.handler.js");
const sendResponse = require("../utils/response.helper.js");
const mongoose = require("mongoose");

const getAnalytics = asyncHandler(async (req, res) => {
  const facultyId = req.user.id;

  const matchStage = {
    faculty: new mongoose.Types.ObjectId(facultyId),
  };

  const stats = await Feedback.aggregate([
    { $match: matchStage },

    {
      $group: {
        _id: null,
        avgRating: { $avg: "$avgRating" },
        total: { $sum: 1 },
        positive: {
          $sum: { $cond: [{ $eq: ["$sentiment", "Positive"] }, 1, 0] },
        },
        neutral: {
          $sum: { $cond: [{ $eq: ["$sentiment", "Neutral"] }, 1, 0] },
        },
        negative: {
          $sum: { $cond: [{ $eq: ["$sentiment", "Negative"] }, 1, 0] },
        },
      },
    },
  ]);

  const comments = await Feedback.find({
    faculty: facultyId,
    remark: { $ne: "" },
  })
    .sort({ createdAt: -1 })
    .limit(10)
    .select("remark sentiment createdAt");

  return sendResponse(res, 200, "Faculty analytics", {
    stats: stats[0] || {
      avgRating: 0,
      total: 0,
      positive: 0,
      neutral: 0,
      negative: 0,
    },
    comments,
  });
});

const getTimeline = asyncHandler(async (req, res) => {
  const facultyId = req.user.id;

  const data = await Feedback.aggregate([
    {
      $match: {
        faculty: new mongoose.Types.ObjectId(facultyId),
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt",
          },
        },
        score: { $avg: "$avgRating" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return sendResponse(res, 200, "Timeline", data);
});

const getAnalyticsById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const stats = await Feedback.aggregate([
    {
      $match: {
        faculty: new mongoose.Types.ObjectId(id),
      },
    },
    {
      $group: {
        _id: null,
        avgRating: { $avg: "$avgRating" },
        total: { $sum: 1 },
        positive: {
          $sum: { $cond: [{ $eq: ["$sentiment", "Positive"] }, 1, 0] },
        },
        neutral: {
          $sum: { $cond: [{ $eq: ["$sentiment", "Neutral"] }, 1, 0] },
        },
        negative: {
          $sum: { $cond: [{ $eq: ["$sentiment", "Negative"] }, 1, 0] },
        },
      },
    },
  ]);

  return sendResponse(res, 200, "Faculty analytics", stats[0] || {});
});

module.exports = {
  getAnalytics,
  getTimeline,
  getAnalyticsById,
};
