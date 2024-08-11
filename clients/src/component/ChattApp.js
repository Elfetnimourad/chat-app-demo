import {
  Avatar,
  Box,
  Card,
  Button,
  Grid,
  Stack,
  Typography,
  Collapse,
  TextField,
  Menu,
  MenuItem,
} from "@mui/material";
import Input from "@mui/material/Input";
import React, { useEffect, useRef, useState, useContext } from "react";
import VideocamIcon from "@mui/icons-material/Videocam";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ImageIcon from "@mui/icons-material/Image";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import "./ChattApp.css";
import { signInWithGoogle } from "./firebase-config";
import { logout } from "./firebase-config";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import CardContent from "@mui/material/CardContent";
import { CardActions } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import GroupsIcon from "@mui/icons-material/Groups";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import Fade from "@mui/material/Fade";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import axios from "axios";
import { parse } from "uuid";
const socket = io.connect("http://localhost:3001");

export const ChattApp = () => {
  const hours = new Date().getHours();
  const minutes = new Date().getMinutes();
  const secondes = new Date().getSeconds();

  const time =
    (hours < 10 ? "0" + hours : +hours) +
    ":" +
    (minutes < 10 ? "0" + minutes : +minutes) +
    ":" +
    (secondes < 10 ? "0" + secondes : +secondes);

  const sumTime = hours * 3600 + minutes * 60 + secondes;
  const users = JSON.parse(localStorage.getItem("users")) || [];
  // const { sendMessages } = useContext(socketContext);

  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [leavedMessage, setLeavedMessage] = useState("has left the room");
  const [chatList, setChatList] = useState([]);
  const [chatListUsers, setChatListUsers] = useState([]);

  const [logout, setLogout] = useState(true);
  const [selectedName, setSelectedName] = useState("");
  const [leavedPerson, setLeavedPerson] = useState(false);

  const [createdRoomed, setCreatedRoomed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [privateConversation, setPrivateConversation] = useState(false);
  const [avatarName, setAvatarName] = useState("");
  const [seenAndUnseen, setSeenAndUnseen] = useState("");
  const [isRoom, setIsRoom] = useState(false);
  const [logoutCard, setLogoutCard] = useState(false);
  const [messageRoom, setMessageRoom] = useState("");
  const [createdRoom, setCreatedRoom] = useState(false);
  const [createdIcon, setCreatedIcon] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isFocusedMsg, setIsFocusedMsg] = useState(false);
  const [connected, setConnected] = useState(false);
  const [open, setOpen] = useState(false);
  const [arr, setArr] = useState([]);
  const [arrOfRoom, setArrOfRoom] = useState([]);
  const [arrOfApi, setArrOfApi] = useState([]);
  const [chet, setChet] = useState([]);

  const inputRef = useRef(null);
  const navigate = useNavigate();
  const name = sessionStorage.getItem("name");
  const userId = sessionStorage.getItem("useId");

  const getUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3001/users");
      const b = res.data.filter((e) => e.uname !== name);
      console.log("this data of users", b);

      setChatList(b);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUsers();
  }, []);

  const deletePrivateConversation = () => {
    // setArrMessages(null);
  };
  useEffect(() => {
    socket.emit("storeData", { name, id: userId });
  }, []);
  const joinRoom = () => {
    if (room.trim() !== "") {
      socket.emit("join_room", room);
    }
    setIsRoom(true);
    setCreatedIcon(true);
    setCreatedRoomed(true);
  };
  const leaveRoom = () => {
    socket.emit("leave_room", room, {});
    console.log("leave the room now");
    setIsRoom(false);
    setCreatedIcon(false);
    setCreatedRoomed(false);
    setLeavedPerson(true);
  };

  const leavingRoomMessage = () => {
    leaveRoom();
    socket.emit("leave_message", leavedMessage, room);
  };
  useEffect(() => {
    socket.on("receiveLeaved_message", (data) => {
      setLeavedMessage(data.leavedMessage);
      console.log(data.leavedMessage);
    });
  }, []);
  const addMessage = (
    msg,
    sender,
    receiver,
    member,
    timeline,
    room,
    messageRoom,
    leavedMessage,
    isFocused,
    from,
    to,
    sumTime,
    selectRoomName,
    createdRoomed
  ) => {
    setArr([
      ...arr,
      {
        message: msg,
        sender: sender,
        receiver: receiver,
        member: member,
        timeline: time,
        room: room,
        messageRoom: messageRoom,
        leavedMessage: leavedMessage,
        isFocused,
        from,
        to,
        sumTime,
        selectRoomName: selectedName,
        createdRoomed: createdRoomed,
      },
    ]);
  };
  const herwego = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/createMsgs`);
      const here = response.data;
      const filteredData = here.filter(
        (e) =>
          (e.member === name && e.to === avatarName) ||
          (e.member === avatarName && e.to === name)
      );
      const filterDataRoom = here.filter(
        (e) =>
          e.room !== "" && e.room === room && e.selectRoomName === selectedName
      );
      setArrOfApi(filteredData);

      console.log(arrOfApi);
      setArrOfRoom(filterDataRoom);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };
  useEffect(() => {
    herwego();
  }, [herwego, name]);
  const createMsg = async () => {
    await axios
      .post("http://localhost:3001/createMsgs", {
        message: message,
        sender: sessionStorage.getItem("name")?.at(0).toUpperCase(),
        receiver: sessionStorage.getItem("name")?.at(0).toUpperCase(),
        member: sessionStorage.getItem("name"),
        timeline: time,
        room,
        messageRoom,
        to: avatarName,
        from: sessionStorage.getItem("name")?.at(0).toUpperCase(),
        sumTime: sumTime,
        selectRoomName: selectedName,
      })
      .then((response) => {
        console.log("the message sent to");
      });
  };

  // When sending a message, include the sender's name (you are already doing this)
  const filteredDataCheck = arrOfApi.some(
    (e) =>
      (e.member === name && e.to === avatarName) ||
      (e.member === avatarName && e.to === name)
  );
  const seenAndUnseenMessage = () => {
    setIsFocused(false);
    socket.emit("seen_message", {
      isFocused,
      room,
    });
    console.log(isFocused);
  };

  const seenPrivateMessage = (recipientId) => {
    setIsFocusedMsg(false);
    setSeenAndUnseen("seen");
    socket.emit("seen_private_message", {
      isFocusedMsg,
      to: recipientId,
    });
    console.log(isFocused);
  };
  const updateUsers = async (updateName) => {
    await axios
      .post(`http://localhost:3001/updateUsers/${updateName}`, {
        uname: updateName,
        latestMessage: message,
        sumTime: Date.now(),
        from: "name",
      })
      .then((response) => {
        console.log("the message sent to");
      });
  };
  const sendMessage = (recipientId) => {
    socket.emit("send_message", {
      message: message,
      sender: sessionStorage.getItem("name")?.at(0).toUpperCase(),
      receiver: sessionStorage.getItem("name")?.at(0).toUpperCase(),
      member: sessionStorage.getItem("name"),
      timeline: time,
      room,
      messageRoom,
      to: recipientId,
      from: sessionStorage.getItem("name")?.at(0).toUpperCase(),
      sumTime: sumTime,
      isFocusedMsg: isFocusedMsg,
    });

    addMessage(
      message,
      sessionStorage.getItem("name")?.at(0).toUpperCase(),
      "",
      sessionStorage.getItem("name"),

      "",
      room,
      messageRoom,
      "",
      isFocused,
      sessionStorage.getItem("name")?.at(0).toUpperCase(),
      avatarName,
      sumTime
    );
    console.log(arrOfApi);
    setMessageRoom("");
    setIsFocusedMsg(true);
    createMsg();
    setSeenAndUnseen("sent");
    setMessage("");
    updateUsers(recipientId);
  };
  const sendMessageRoom = () => {
    socket.emit("send_room_message", {
      message: message,
      sender: sessionStorage.getItem("name")?.at(0).toUpperCase(),
      receiver: sessionStorage.getItem("name")?.at(0).toUpperCase(),
      member: sessionStorage.getItem("name"),
      timeline: time,
      room,
      messageRoom: messageRoom,
      from: sessionStorage.getItem("name")?.at(0).toUpperCase(),
      sumTime: sumTime,
      selectRoomName: selectedName,
      createdRoomed: createdRoomed,
    });

    addMessage(
      message,
      sessionStorage.getItem("name")?.at(0).toUpperCase(),
      "",
      sessionStorage.getItem("name"),

      "",
      room,
      messageRoom,
      "",
      isFocused,
      sessionStorage.getItem("name")?.at(0).toUpperCase(),
      avatarName,
      sumTime,
      selectedName,
      createdRoomed
    );

    setMessageRoom("");
    setIsFocused(true);
    createMsg();
  };
  useEffect(() => {
    socket.on("unseen_message", (data) => {
      setIsFocused(data.isFocused);
      console.log(data.isFocused);
    });
  }, []);
  useEffect(() => {
    socket.on("unseen_private_message", (data) => {
      setIsFocusedMsg(data.isFocused);
      setSeenAndUnseen("seen");
      console.log(data.isFocused);
    });
  }, []);
  useEffect(() => {
    socket.on("receive_message", (data) => {
      addMessage(
        data.message,
        data.sender,
        sessionStorage.getItem("name")?.at(0).toUpperCase(),
        data.member,
        data.timeline,
        data.room,
        data.messageRoom,
        data.leavedMessage,
        data.isFocused,
        data.from?.at(0).toUpperCase(),
        data.to,
        data.sumTime,
        data.selectRoomName,
        data.createdRoomed
      );
    });
  }, [addMessage, arr, room]);

  useEffect(() => {
    socket.on("receive_room_message", (data) => {
      addMessage(
        data.message,
        data.sender,
        sessionStorage.getItem("name")?.at(0).toUpperCase(),
        data.member,
        data.timeline,
        data.room,
        data.messageRoom,
        data.leavedMessage,
        data.isFocused,
        data.from?.at(0).toUpperCase(),
        data.to,
        data.sumTime,
        data.selectRoomName,
        data.createdRoomed
      );
    });
  }, [addMessage, arr, room]);

  useEffect(() => {
    const nameSession = sessionStorage.getItem("name");
    if (nameSession === "") {
      deleteUsers(nameSession);
    }
  }, []);

  const deleteUsers = async (deletedUser) => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/users/${deletedUser}`,
        {
          uname: deletedUser,
        }
      );
      console.log("The message was sent to", response.data);
    } catch (error) {
      console.error("There was an error deleting the users:", error);
    }
  };
  const deleteAllUsers = async () => {
    try {
      const response = await axios.delete(`http://localhost:3001/users`);
      console.log("The message was sent to", response.data);
    } catch (error) {
      console.error("There was an error deleting the users:", error);
    }
  };
  useEffect(() => {
    socket.on("disconnect", () => {
      deleteAllUsers();
    });
  }, [deleteAllUsers]);
  const logoutFunc = (del) => {
    navigate("/Login.js");
    console.log("Logged out!");
    setLogout(false);
    setChatList([]);
    sessionStorage.removeItem("name");
    deleteUsers(del);
    return () => {
      socket.disconnect();
    };
  };

  const deleteConversation = () => {
    setArr([]);
  };
  const clickAvatar = (sele) => {
    const filteredSpecificData = arrOfApi.some(
      (e) => e.member === sele && e.to === name
    );
    setOpen(!open);
    setAvatarName(sele);
    if (filteredSpecificData) {
      seenPrivateMessage(sele);
      // setIsFocusedMsg(true);
      setSeenAndUnseen("seen");
    }
  };

  const focusMessages = (selected) => {
    const filteredSpecificData = arrOfApi.some(
      (e) => e.member === selected && e.to === name
    );
    if (filteredSpecificData) {
      seenPrivateMessage(selected);
      setSeenAndUnseen("seen");
    }
  };
  const handelSearch = (event) => {
    if (event.key === "Enter") {
      const filterArray = chatList.filter((e) => e.uname.includes(searchTerm));
      if (searchTerm !== "") {
        setChatList(filterArray);
      } else {
        getUsers();
      }
    }
  };
  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100 "
      style={{ backgroundColor: "#a8bcff" }}
    >
      <Collapse in={logoutCard}>
        <Card className="mt-5 z-999 logoutCard">
          <CardContent>
            <p>Are you sure you want to logout?</p>
            <div className="d-flex flex-row justify-content-space-around ">
              <button
                className="btn btn-danger"
                onClick={() => logoutFunc(name)}
              >
                yes
              </button>
              <button
                className="btn btn-info"
                onClick={() => setLogoutCard(false)}
              >
                Cancel
              </button>
            </div>
          </CardContent>
        </Card>
      </Collapse>

      <div className="d-flex justify-content-center align-items-center roomCardStyle">
        <Collapse in={createdRoom}>
          <Card className="mt-5 z-999 validatCardRoom ">
            <CardContent>
              <div className="d-flex flex-row">
                <div className="ms-auto">
                  <CloseIcon onClick={() => setCreatedRoom(false)} />
                </div>
              </div>
              <hr />
              <div className="column here">
                <label htmlFor="" className="label fw-bold">
                  Id:
                </label>
                <input
                  type="text"
                  value={room}
                  onChange={(event) => setRoom(event.target.value)}
                  className="rounded-2"
                  placeholder="ggg"
                />
                <label htmlFor="" className="label fw-bold">
                  Name:
                </label>
                <input
                  type="text"
                  value={selectedName}
                  onChange={(event) => setSelectedName(event.target.value)}
                  className="rounded-2"
                  placeholder="ggg"
                />
              </div>
              <CardActions>
                <Button
                  type="submit"
                  onClick={joinRoom}
                  variant="contained"
                  className="ms-auto mt-auto save"
                >
                  Save
                </Button>
              </CardActions>
            </CardContent>
          </Card>
        </Collapse>
      </div>
      <Card
        sx={{ width: 820, height: 500 }}
        style={{ borderRadius: "20px" }}
        className="theGlobal"
      >
        <Grid container>
          <Grid
            item
            lg={4.8}
            xs={12}
            className={isRoom || open ? "displayGrid" : ""}
          >
            <Grid item>
              <Box
                style={{
                  backgroundColor: "#2f2c53",
                  height: 50,
                  display: "flex",
                  flexDirection: "row",

                  alignItems: "center",
                }}
              >
                <h6 className="text-white">RadiChat</h6>
                <div className="ms-auto d-flex flex-row">
                  <Avatar
                    sx={{
                      width: 30,
                      height: 30,
                      marginRight: 0.5,
                      backgroundColor: "purple",
                    }}
                    color="primary"
                    // src={logOut && localStorage.getItem("profilePic")}
                  >
                    {/* {users[users.length - 1].name.at(0).toUpperCase()} */}
                    {sessionStorage.getItem("name")?.at(0).toUpperCase()}
                  </Avatar>
                  <div className="text-white">
                    {/* {...JSON.parse(localStorage.getItem("users")).name} */}
                    {/* {users[users.length - 1].name} */}
                    {sessionStorage.getItem("name")}
                  </div>
                  <button
                    style={{
                      width: 60,
                      height: 30,
                      marginLeft: 0.5,
                      borderRadius: 10,
                      paddingRight: 1,
                      backgroundColor: "#5e5a8b",
                      color: "white",
                    }}
                    onClick={() => setLogoutCard(true)}
                  >
                    Logout
                  </button>
                  <GroupAddIcon
                    className="text-white  ms-1 me-1 cursor-pointer"
                    titleAccess="create room"
                    onClick={() => setCreatedRoom(!createdRoom)}
                  />
                </div>
              </Box>
            </Grid>

            <Grid item>
              <Box style={{ backgroundColor: "#373557", height: 450 }}>
                <Input
                  placeholder="find a user"
                  type="search"
                  fullWidth
                  sx={{ color: "white" }}
                  onKeyDown={handelSearch}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {createdRoomed && (
                  <div className="d-flex flex-row mb-2 mt-2">
                    <Avatar
                      sx={{
                        marginRight: 0.5,
                      }}
                      onClick={() => setIsRoom(!isRoom)}
                    >
                      {createdIcon && (
                        <GroupsIcon style={{ width: 32, height: 32 }} />
                      )}
                    </Avatar>
                    <div className="column">
                      <div className="text-white">
                        {arrOfApi[arrOfApi.length - 1]?.selectRoomName ||
                          selectedName}
                      </div>
                      <div className="text-white">
                        {arrOfApi[arrOfApi.length - 1]?.sender}
                        {arrOfApi[arrOfApi.length - 1]?.messageRoom && ":"}
                        {arrOfApi[arrOfApi.length - 1]?.messageRoom}
                      </div>
                    </div>
                  </div>
                )}
                {logout &&
                  chatList
                    ?.sort((a, b) => b.sumTime - a.sumTime)
                    .map((k) => {
                      return (
                        <>
                          {k.uname && (
                            <div className="d-flex flex-row mb-2 mt-2">
                              <Avatar
                                sx={{
                                  marginRight: 0.5,
                                }}
                                onClick={() => clickAvatar(k.uname)}
                              >
                                {k.uname.at(0).toUpperCase()}
                              </Avatar>
                              {connected && <div className="online-ball"></div>}
                              <div className="column">
                                <div className="text-white ms-1" ref={inputRef}>
                                  {k.uname}
                                </div>
                                {k.uname === avatarName && (
                                  <div className="text-white">
                                    {arrOfApi[arrOfApi.length - 1]?.from ===
                                    sessionStorage
                                      .getItem("name")
                                      ?.at(0)
                                      .toUpperCase()
                                      ? "you"
                                      : k.uname}
                                    {":"}
                                    {k.uname === avatarName &&
                                      arrOfApi[arrOfApi.length - 1]?.message}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </>
                      );
                    })}
              </Box>
            </Grid>
          </Grid>
          <Grid
            item
            lg={7.2}
            xs={12}
            className={isRoom || open ? "" : "displayGrid"}
          >
            <Collapse in={isRoom}>
              <Card sx={{ width: "100%", height: 500 }}>
                <Box
                  style={{
                    backgroundColor: "#5f5b8f",
                    height: 50,
                    display: "flex",
                    flexDirection: "row",

                    alignItems: "center",
                    width: 493,
                  }}
                  className="info-bar"
                >
                  <ArrowBackIcon
                    onClick={() => setIsRoom(!isRoom)}
                    className="text-white"
                  />
                  <div className="text-white ps-1">{selectedName}</div>
                  <div className="ms-auto d-flex flex-row align-items-space-around">
                    <VideocamIcon className="cursor-pointer me-2 text-white" />
                    <PersonAddAlt1Icon className="cursor-pointer me-2 text-white" />
                    <MoreHorizIcon
                      className="cursor-pointer me-2 text-white"
                      id="fade-top"
                      aria-controls={openMenu ? "fade-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={openMenu ? "true" : undefined}
                    />
                  </div>
                </Box>

                <Box
                  style={{
                    height: 410,
                    backgroundColor: "#dddcf7",
                    overflowY: "auto",
                  }}
                >
                  {arrOfRoom.map((e, index) => {
                    return (
                      <>
                        {e.room !== "" && e.room === room && e.messageRoom && (
                          <div
                            key={index}
                            className={
                              e?.from
                                ? "d-flex flex-row ms-auto"
                                : "d-flex flex-row "
                            }
                          >
                            <Avatar
                              sx={{
                                width: 15,
                                height: 15,
                                marginRight: 0.5,
                              }}
                              className={
                                e?.from === name.at(0).toUpperCase()
                                  ? "ms-auto"
                                  : ""
                              }
                            >
                              {e?.from}
                            </Avatar>
                            <div className="column">
                              <h6
                                className={
                                  e?.from === name.at(0).toUpperCase()
                                    ? "text-white messageStyle"
                                    : " text-dark messageStyleReceived"
                                }
                                style={{
                                  width: "fit-content",

                                  marginBottom: 0.5,
                                }}
                              >
                                {e.messageRoom}
                              </h6>
                              <div className="text-center">
                                {leavedPerson &&
                                  arrOfApi[0].receiver + leavedMessage}
                              </div>

                              {/* <div style={{ fontSize: 10 }}>{e?.timeline}</div> */}
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })}
                  {arrOfRoom[arrOfRoom.length - 1]?.messageRoom &&
                    arrOfRoom?.map((e) => e?.sender)[arrOfRoom.length - 1] ===
                      sessionStorage.getItem("name")?.at(0).toUpperCase() && (
                      <div
                        dir="rtl"
                        style={{ transform: "translateY(-30%)", fontSize: 11 }}
                        className="ms-auto"
                      >
                        {isFocused ? "sent" : "seen"}
                      </div>
                    )}
                </Box>
                <form>
                  <Box
                    style={{ height: 40 }}
                    className="d-flex flex-row info-bar-messenger"
                  >
                    <TextField
                      id="standard-multiline-static"
                      multiline
                      placeholder="Type Something"
                      variant="standard"
                      minRows={1}
                      sx={{
                        width: "85%",
                        paddingTop: 1,
                      }}
                      onChange={(event) => setMessageRoom(event.target.value)}
                      onClick={seenAndUnseenMessage}
                    />

                    <AttachFileIcon
                      sx={{ width: 18, height: 18, marginRight: 0.2 }}
                    />
                    <ImageIcon sx={{ marginRight: 0.5 }} />

                    <SendIcon
                      onClick={sendMessageRoom}
                      className="cursor-pointer"
                    />
                  </Box>
                </form>
              </Card>
            </Collapse>

            <Collapse in={open}>
              <Card sx={{ width: "100%", height: 500 }}>
                <Box
                  style={{
                    backgroundColor: "#5f5b8f",
                    height: 50,
                    display: "flex",
                    flexDirection: "row",

                    alignItems: "center",
                    width: 493,
                  }}
                  className="info-bar"
                >
                  <ArrowBackIcon
                    onClick={() => setOpen(!open)}
                    className="arrowBack text-white"
                  />
                  <div className="text-white ps-1">{avatarName}</div>

                  <div className="ms-auto d-flex flex-row align-items-space-around">
                    <VideocamIcon className="cursor-pointer me-2 text-white" />
                    <PersonAddAlt1Icon className="cursor-pointer me-2 text-white" />
                    <MoreHorizIcon
                      id="fade-button"
                      aria-controls={
                        privateConversation ? "fade-menu" : undefined
                      }
                      aria-haspopup="true"
                      aria-expanded={privateConversation ? "true" : undefined}
                      className="cursor-pointer me-2 text-white"
                    />
                  </div>
                </Box>

                <Box
                  style={{
                    height: 410,
                    backgroundColor: "#dddcf7",
                    overflowY: "auto",
                  }}
                >
                  {arrOfApi?.map((e) => {
                    return (
                      <>
                        {e.message !== "" && (
                          <div
                            className={
                              e.message &&
                              e.member === sessionStorage.getItem("name")
                                ? "d-flex flex-row ms-auto"
                                : "d-flex flex-row "
                            }
                          >
                            {e.message && (
                              <Avatar
                                sx={{
                                  width: 15,
                                  height: 15,
                                  marginRight: 0.5,
                                }}
                                className={
                                  e.message &&
                                  e.member === sessionStorage.getItem("name")
                                    ? "ms-auto"
                                    : ""
                                }
                              >
                                {e?.message &&
                                e?.member === sessionStorage.getItem("name")
                                  ? e.from
                                  : e.from}
                              </Avatar>
                            )}
                            <div className="column">
                              <div
                                className={
                                  e.message &&
                                  e.member === sessionStorage.getItem("name")
                                    ? "text-white messageStyle"
                                    : "text-dark messageStyleReceived"
                                }
                                style={{
                                  width: "fit-content",

                                  marginBottom: 0.5,
                                }}
                              >
                                {e?.message}
                              </div>
                              <div style={{ fontSize: 10 }}></div>
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })}
                  {filteredDataCheck &&
                    arrOfApi[arrOfApi.length - 1]?.message &&
                    arrOfApi?.map((e) => e?.member)[arrOfApi.length - 1] ===
                      sessionStorage.getItem("name") && (
                      <div
                        dir="rtl"
                        style={{ transform: "translateY(-30%)", fontSize: 11 }}
                        className="ms-auto"
                      >
                        {seenAndUnseen}
                      </div>
                    )}
                </Box>
                <form>
                  <Box
                    style={{ height: 40 }}
                    className="d-flex flex-row info-bar-messenger"
                  >
                    <TextField
                      id="standard-multiline-static"
                      multiline
                      placeholder="Type Something"
                      variant="standard"
                      minRows={1}
                      sx={{
                        width: "85%",
                        paddingTop: 1,
                      }}
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      onFocus={() => focusMessages(avatarName)}
                    />

                    <AttachFileIcon
                      sx={{ width: 18, height: 18, marginRight: 0.2 }}
                    />
                    <ImageIcon sx={{ marginRight: 0.5 }} />

                    <SendIcon
                      onClick={() => sendMessage(avatarName)}
                      className="cursor-pointer"
                    />
                  </Box>
                </form>
              </Card>
            </Collapse>
          </Grid>
        </Grid>
      </Card>
    </div>
  );
};

// when  i click the avatar it took me to specific card ?
