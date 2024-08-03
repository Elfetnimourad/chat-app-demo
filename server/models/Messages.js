const mongoose = require("mongoose");

const Schema = mongoose.Schema({
  message: String,
  sender: String,
  receiver: String,
  member: String,
  timeline: String,
  room: String,
  messageRoom: String,
  to: String,
  from: String,
  userId: String,
  sumTime: Number,
  selectRoomName: String,
  createdRoomed: Boolean,
  seenSent: String,
});

const MsgModel = mongoose.model("message", Schema);
module.exports = MsgModel;
