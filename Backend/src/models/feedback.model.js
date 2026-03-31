const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },

    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
      required: true,
    },

    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },

    studentName: {
      type: String,
      required: true,
      trim: true,
      toLowerCase: true,
    },

    rollNo: {
      type: String,
      required: true,
      trim: true,
      toLowerCase: true,
    },

    rating: {
      conceptClarity: Number,
      lectureStructure: Number,
      subjectMastery: Number,
      practicalUnderstanding: Number,
      studentEngagement: Number,
      lecturePace: Number,
      learningOutcomeImpact: Number,
    },

    remark: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

feedbackSchema.index({ session: 1, rollNo: 1 }, { unique: true });

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;
