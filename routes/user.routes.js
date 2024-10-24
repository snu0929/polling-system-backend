const express = require("express");
const { UserModel } = require("../modal/user.modal");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { authMiddleware } = require("../middlewares/auth.middleware");
const multer = require("multer");
const { PollModel } = require("../modal/poll.modal");
require("dotenv").config();

userRouter.post("/register", async (req, res) => {
  const { userName, email, password } = req.body;
  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User Already Registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      userName,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.SECRET_KEY,
      {
        expiresIn: "1y",
      }
    );
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Login failed" });
  }
});

userRouter.get("/profile", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await UserModel.findById(userId).select("-password");
    const createdPolls = await PollModel.find({ createdBy: userId });
    const votedPolls = await PollModel.find({ voters: userId });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    res.status(200).json({ user, createdPolls, votedPolls });
  } catch (error) {
    console.log("error fetching user", error);
    res.status(500).json({ message: "SERVER ERROR" });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

userRouter.post(
  "/uploadProfilePicture",
  authMiddleware,
  upload.single("profilePicture"),
  async (req, res) => {
    const { userId } = req.user;
    const profilePicturePath = req.file.path;
    console.log(req.file);

    try {
      await UserModel.findByIdAndUpdate(userId, {
        profilePicture: profilePicturePath,
      });
      res.status(200).json({
        message: "Profile picture updated successfully",
        profilePicture: profilePicturePath,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error uploading profile picture" });
    }
  }
);

module.exports = {
  userRouter,
};
