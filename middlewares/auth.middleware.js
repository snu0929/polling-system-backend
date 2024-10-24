const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    } else {
      return res.status(500).json({ message: "Server error" });
    }
  }
};

module.exports = { authMiddleware };
