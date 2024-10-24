const express = require("express");
const pollRouter = express.Router();

const { PollModel } = require("../modal/poll.modal");
const { UserModel } = require("../modal/user.modal");
const { authMiddleware } = require("../middlewares/auth.middleware");

pollRouter.post("/create", authMiddleware, async (req, res) => {
  console.log("Request Body:", req.body);
  console.log("User:", req.user);

  const { title, options } = req.body;
  if (!title || !options || !options.length) {
    return res.status(400).json({ message: "title,options are required" });
  }

  try {
    const createdBy = req.user.userId;

    const newPoll = new PollModel({
      title,
      options: options.map((option) => ({ option: option.option, votes: 0 })),
      createdBy,
      voters: [],
    });
    await newPoll.save();
    res
      .status(201)
      .json({ message: "poll created successfully", poll: newPoll });
  } catch (error) {
    res.status(500).json({ message: "creating poll error", error: error });
  }
});

pollRouter.get("/all", authMiddleware, async (req, res) => {
  try {
    const polls = await PollModel.find().populate("createdBy");
    res.status(200).json(polls);
  } catch (error) {
    console.error("Error fetching polls:", error);
    res.status(500).json({ message: "error getting polls", error });
  }
});

pollRouter.get("/:pollId", authMiddleware, async (req, res) => {
  const { pollId } = req.params;
  try {
    const poll = await PollModel.findById(pollId).populate("createdBy");
    if (!poll) {
      res.status(404).json({ message: "poll not found", error });
    }
    res.status(200).json({ poll: poll });
  } catch (error) {
    res.status(500).json({ message: error.message, error });
    console.log("Error fetching poll:", error);
  }
});

pollRouter.post("/vote/:pollId", authMiddleware, async (req, res) => {
  const { pollId } = req.params;
  const { optionIndex } = req.body;
  const userId = req.user.userId;
  try {
    const poll = await PollModel.findById(pollId);
    if (!poll) {
      return res.status(404).json({ message: "poll not found" });
    }
    if (poll.voters.includes(userId)) {
      return res.status(400).json({ message: "User has already voted" });
    }
    if (optionIndex < 0 || optionIndex >= poll.options.length) {
      return res.status(400).json({ message: "Invalid option index" });
    }
    poll.options[optionIndex].votes += 1;
    poll.voters.push(userId);

    await poll.save();
    console.log("Voting successful, emitting updated poll...");

    req.io.emit("pollUpdated", poll);
    console.log("Emitting updated poll:", poll);

    return res.status(200).json({ message: "Vote cast sucessfully", poll });
  } catch (error) {
    console.error("Error casting vote:", error); // Add this line
    return res
      .status(500)
      .json({ message: "Error casting vote", error: error.message });
  }
});

module.exports = {
  pollRouter,
};
