const express = require("express");
const { connection } = require("./db");
const { userRouter } = require("./routes/user.routes");
const { pollRouter } = require("./routes/poll.routes");
const { commentRouter } = require("./routes/comment.routes");
const { authMiddleware } = require("./middlewares/auth.middleware");
const cors = require("cors");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
require("dotenv").config();

// Created a Socket.IO server instance
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Set up a basic Socket.IO connection
io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

app.use((req, res, next) => {
  req.io = io; // Attach io instance to req object
  next();
});
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.use("/users", userRouter);
app.use("/polls", authMiddleware, pollRouter);
app.use("/polls", authMiddleware, commentRouter);

server.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log(`server is runing on port ${process.env.PORT}`);
    console.log("connected to db");
  } catch (error) {
    console.log(error);
  }
});
