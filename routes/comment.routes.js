const express = require("express");
const commentRouter = express.Router();
const { CommentModel } = require("../modal/comment.model");
const { authMiddleware } = require("../middlewares/auth.middleware");

commentRouter.post("/:pollId/comments", authMiddleware, async (req, res) => {
  const { pollId } = req.params;
  const { text } = req.body;
  try {
    const newComment = new CommentModel({
      pollId,
      userId: req.user.userId,
      text,
    });
    await newComment.save();
    // Emit the new comment to all connected clients
    req.io.emit("newComment", newComment);
    res.status(201).send(newComment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ message: "Error creating comment", error: error });
  }
});
commentRouter.get("/:pollId/comments", authMiddleware, async (req, res) => {
  const { pollId } = req.params;

  try {
    const comments = await CommentModel.find({ pollId }).populate(
      "userId",
      "username"
    ); // Adjust according to your User model
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching comments", error });
  }
});

module.exports = {
  commentRouter,
};
