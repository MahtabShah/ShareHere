const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Post", // <-- Use "Post" or your actual post model name, not "User"
  },
  reason: {
    type: String,
    required: true,
    enum: ["abuse", "hate", "nudity", "violence", "spam", "other"], // optional: restrict reasons
  },
  details: {
    type: String,
    default: "",
  },
  reportedAt: {
    type: Date,
    default: Date.now,
  },
});

const Report = mongoose.model("Report", ReportSchema);
module.exports = Report;
