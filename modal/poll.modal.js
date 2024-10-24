const mongoose = require("mongoose");

const pollSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  options: [
    {
      option: { type: String, required: true },
      votes: { type: Number, default: 0, required: true },
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  voters: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});
pollSchema.pre("save", function (next) {
  this.updatedAt = Date.now(); // Update updatedAt before saving
  next();
});
const PollModel = mongoose.model("Poll", pollSchema);

module.exports = {
  PollModel,
};
