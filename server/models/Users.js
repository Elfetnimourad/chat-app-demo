const mongoose = require("mongoose");

const SchemaUser = mongoose.Schema({
  uname: String,
  latestMessage: String,
  sumTime: Number,
});

const UserModel = mongoose.model("user", SchemaUser);
module.exports = UserModel;
