const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
const MsgModel = require("./models/Messages");
const UserModel = require("./models/Users");

app.use(express.json());
mongoose
  .connect(
    "mongodb+srv://morad-tao:morad123@radi-chat-db.rjz0gdw.mongodb.net/radi-chat?retryWrites=true&w=majority&appName=radi-chat-db"
  )
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });

app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
app.post("/updateUsers/:updateName", async (req, res) => {
  try {
    const updateName = req.params.updateName;
    const result = await UserModel.updateOne(
      { uname: updateName },
      { $set: { sumTime: Date.now() } }
    );
    res.send(result);
  } catch (err) {
    res.status(300).send(err);
  }
});
app.get("/updateUsers", async (req, res) => {
  try {
    const result = await UserModel.find();
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/users", async (req, res) => {
  try {
    const result = await UserModel.find();
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
});
app.post("/users", async (req, res) => {
  try {
    const { uname, latestMessage, sumTime, specificUsers, from } = req.body;
    const newUser = new UserModel({
      uname,
      latestMessage,
      sumTime,
      specificUsers,
      from,
    });
    await newUser.save();
    res.send(newUser);
  } catch (err) {
    res.status(500).send(err);
  }
});
app.delete("/users/:deleteId", async (req, res) => {
  const deleteID = req.params.deleteId;
  try {
    const result = await UserModel.deleteOne({ uname: deleteID });
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
});
app.delete("/users", async (req, res) => {
  try {
    const result = await UserModel.deleteMany();
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
});
app.delete("/users/:deleteMsg", async (req, res) => {
  const deleteID = req.params.deleteMsg;
  try {
    const result = await MsgModel.deleteOne({ uname: deleteMsg });
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
});
app.get("/createMsgs", async (req, res) => {
  try {
    const result = await MsgModel.find();
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
});
app.post("/createMsgs", async (req, res) => {
  try {
    const msg = req.body;
    const newMsg = new MsgModel(msg);
    await newMsg.save();
    res.send(newMsg);

    console.log("Api run");
  } catch (err) {
    res.status(500).send(err);
  }
});

const users = {};
io.on("connection", (socket) => {
  socket.on("storeData", (data) => {
    socket.username = data.name;
    socket.userId = data.id;
    users[data.name] = socket.id;
    console.log(
      `Username:${socket.username} , his ID ${socket.userId},${users[data.id]}`
    );
  });

  socket.on("new_user", (name) => {
    socket.broadcast.emit("user_connected", name);
  });
  socket.on("join_room", (data) => {
    socket.join(data);
  });
  socket.on("leave_room", (data) => {
    socket.leave(data);
  });
  socket.on("leave_message", (data) => {
    socket.to(data.room).emit("receiveLeaved_message", data);
  });
  socket.on("seen_message", (data) => {
    socket.to(data.room).emit("unseen_message", data);
  });
  socket.on("send_room_message", (data) => {
    socket.to(data.room).emit("receive_room_message", data);
  });
  socket.on("seen_private_message", (data) => {
    const recipientSocketId = users[data.to];
    if (recipientSocketId) {
      socket.to(recipientSocketId).emit("unseen_private_message", {
        to: socket.username,
      });
    }
  });
  socket.on("send_message", (data) => {
    const recipientSocketId = users[data.to]; // Get the recipient's socket ID
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("receive_message", {
        from: socket.username,
        message: data.message,
        to: socket.username,
        member: socket.username,
        seenSent: data.seenSent,
      });
      console.log(
        `msg ${data.message} from ${data.from} to ${data.to} and the member is ${data.member} the data are ${data}`
      );
    }
  });
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(3001, () => {
  console.log("Server Is Running");
});
