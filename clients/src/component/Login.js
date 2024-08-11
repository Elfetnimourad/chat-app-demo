import React, { useEffect, useRef, useState } from "react";
import "./Login.css";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import axios from "axios";
import { ChattApp } from "./ChattApp";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import io from "socket.io-client";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";

const socket = io.connect("http://localhost:3001");
export const Login = () => {
  const getUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3001/users");
      const b = res.data.filter((e) => e.uname !== name);
      console.log("this data of users", b);
      setChats(b);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUsers();
  }, []);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [chats, setChats] = useState("");

  const [isAlerted, setIsAlerted] = useState(false);
  const [isSecondAlerted, setIsSecondAlerted] = useState(false);

  const [isEmpty, setIsEmpty] = useState(false);
  const navigate = useNavigate();
  const InputRef = useRef();
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

  const handleLogin = async () => {
    // Simulate login functionality, set isLoggedIn to true
    const username = localStorage.getItem("name");
    const userId = localStorage.getItem("id");
    const users = JSON.parse(localStorage.getItem("users")) || [];

    if ((name === "" || id === "") && !isEmpty) {
      setIsEmpty(true);
    } else {
      const userExists = users.some(
        (user) => user.name === name && user.id === id
      );
      const chechedChats = chats.some((e) => e.uname === name);
      if (userExists && !isAlerted) {
        setIsAlerted(true);
        setIsLoggedIn(true);

        setName(name);
        sessionStorage.setItem("name", name);
        sessionStorage.setItem("useId", id);
        sessionStorage.setItem("isLoggedIn", isLoggedIn);
        socket.emit("identify_user", id);
        if (!chechedChats) {
          await axios
            .post("http://localhost:3001/users", {
              uname: name,
              latestMessage: "here we go",
              sumTime: Date.now(),
              from: "",
              specificUsers: [
                {
                  uname: name,
                  sumTime: Date.now(),
                },
              ],
            })
            .then((response) => {
              console.log("the message sent to");
            });
        }
      } else if (!userExists && !isSecondAlerted) {
        setIsSecondAlerted(true);
      }
    }

    setIsLoggedIn(true);
  };
  const handelChangeName = (e) => {
    if (!isAlerted && isSecondAlerted && isEmpty) {
      setName(e.target.value);
    } else if (isAlerted && !isSecondAlerted && isEmpty) {
      setName(e.target.value);
    } else if (isAlerted && isSecondAlerted && !isEmpty) {
      setName(e.target.value);
    } else if (
      isAlerted === false &&
      isSecondAlerted === false &&
      isEmpty === false
    ) {
      setName(e.target.value);
    }
  };
  const handelChangeId = (e) => {
    if (!isAlerted && isSecondAlerted && isEmpty) {
      setId(e.target.value);
    } else if (isAlerted && !isSecondAlerted && isEmpty) {
      setId(e.target.value);
    } else if (isAlerted && isSecondAlerted && !isEmpty) {
      setId(e.target.value);
    } else if (
      isAlerted === false &&
      isSecondAlerted === false &&
      isEmpty === false
    ) {
      setId(e.target.value);
    }
  };
  const handleLogout = () => {
    // Simulate logout functionality, set isLoggedIn to false
    setIsLoggedIn(false);
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100 flex-column"
      style={{ backgroundColor: "#04AA6D" }}
    >
      {isEmpty && (
        <Alert
          variant="filled"
          className="alert-check mb-4"
          severity="info"
          action={
            <Button
              color="inherit"
              style={{ border: "1px solid white" }}
              size="small"
              onClick={() => setIsEmpty(false)}
            >
              Ok
            </Button>
          }
        >
          Please enter both name and ID.
        </Alert>
      )}

      {isAlerted && (
        <Alert
          variant="filled"
          style={{ width: 370 }}
          className="alert-check mb-4 "
          severity="success"
          action={
            <Button
              color="inherit"
              style={{ border: "1px solid white" }}
              size="small"
              onClick={() => navigate("/chatapp")}
            >
              Ok
            </Button>
          }
        >
          You are now logged in.
        </Alert>
      )}
      {isSecondAlerted && (
        <Alert
          style={{ width: 370 }}
          variant="filled"
          className="alert-check mb-4"
          severity="error"
          action={
            <Button
              color="inherit"
              style={{ border: "1px solid white" }}
              size="small"
              onClick={() => setIsSecondAlerted(false)}
            >
              Ok
            </Button>
          }
        >
          Incorrect username or ID.
        </Alert>
      )}
      <Card
        sx={{ width: 330, height: 390 }}
        style={{ borderRadius: "20px" }}
        className="login-Card"
      >
        <h1 className="text-center">Login</h1>
        <hr />
        <CardContent>
          <TextField
            id="outlined-basic"
            label="Email"
            variant="outlined"
            style={{ width: 270 }}
            ref={InputRef}
            value={name}
            onChange={handelChangeName}
          />

          <br />
          <br />
          <TextField
            type="text"
            id="outlined-basic"
            label="Password"
            variant="outlined"
            style={{ width: 270 }}
            value={id}
            onChange={handelChangeId}
          />
        </CardContent>
        <CardActions
          className="CardActions"
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            color="success"
            onClick={handleLogin}
            sx={{ marginBottom: 1, marginLeft: 1, width: "80%" }}
          >
            {/* <Link to={"/chatapp"}></Link> */}
            Login
          </Button>

          {/* <Button
              sx={{ marginBottom: 1, width: "80%" }}
              size="small"
              variant="contained"
              onClick={handleSignUp}
              fullWidth
            >
              Sign Up
            </Button> */}
        </CardActions>
        <div className="d-none">
          <ChattApp className="cc" name={name} isLoggedIn={isLoggedIn} />
        </div>
      </Card>
    </div>
  );
};
