const mongoose = require("mongoose");

const SchemaUser = mongoose.Schema({
  uname: String,
  latestMessage: String,
  sumTime: Number,
  from: String,
  specificUsers: [
    {
      uname: String,
      sumTime: Number,
    },
  ],
});

const UserModel = mongoose.model("user", SchemaUser);
module.exports = UserModel;
