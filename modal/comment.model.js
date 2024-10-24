const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
  pollId: { type: mongoose.Schema.Types.ObjectId, ref: "Poll" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: {
    type: String, // Ensure this is String
    required: true,
  },
  createdAt: { type: String, default: Date.now },
});

const CommentModel = mongoose.model("Comment", commentSchema);

module.exports = {
  CommentModel,
};
