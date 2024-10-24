const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: String,
  email: String,
  password: String,
  profilePicture: { type: String },
});

const UserModel = mongoose.model("User", userSchema);

module.exports = {
  UserModel,
};
