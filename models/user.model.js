const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  dob: { type: Date, required: true },
  bio: { type: String, required: true },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const Usermodel = mongoose.model("User", userSchema);

module.exports = {
  Usermodel,
};
