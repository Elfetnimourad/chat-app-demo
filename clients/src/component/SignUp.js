import React, { useEffect, useState } from "react";
import { auth } from "./firebase-config";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { TextField } from "@mui/material";
import { Link } from "react-router-dom";
import { ChattApp } from "./ChattApp";
import { Login } from "./Login";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { socketContext } from "./SocketContext";
import io from "socket.io-client";
import { ChatInterface } from "./ChatInterface";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import "./SignUp.css";
import Alert from "@mui/material/Alert";

export const SignUp = () => {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [isAlert, setIsAlert] = useState(false);

  const handleLogout = () => {
    // Simulate logout functionality, set isLoggedIn to false
    setIsLoggedIn(false);
  };
  const handleSignUp = () => {
    const checkName = users.some((e) => e.name.includes(name));
    console.log(checkName);
    if (!checkName && !isAlert) {
      const userId = id;
      const newUser = { id: userId, name: name };
      setId(userId);
      // Retrieve existing users from local storage
      const existingUsers = JSON.parse(localStorage.getItem("users")) || [];

      // Add the new user to the existing list
      const updatedUsers = [...existingUsers, newUser];

      // Save the updated list of users to local storage
      localStorage.setItem("users", JSON.stringify(updatedUsers));

      // Simulate sign-up functionality, set isLoggedIn to true

      setIsLoggedIn(true);
    } else if (!isAlert) {
      setIsAlert(!isAlert);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ backgroundColor: "#04AA6D" }}
    >
      {isLoggedIn ? (
        <Card
          sx={{ width: 375, height: 450 }}
          style={{ borderRadius: "20px" }}
          className="d-flex justify-content-center align-items-center flex-column sign-card-check"
        >
          <div
            style={{
              backgroundColor: "#44c7a0",
              width: "100%",
              height: "100%",
            }}
            className="d-flex justify-content-center align-items-center flex-column"
          >
            <CheckCircleOutlineIcon
              sx={{ width: 150, height: 150 }}
              color="success"
            />
          </div>

          <div>
            <h1 className="p-2">Welcome, {name}!</h1>
            <p className="p-2 d-flex flex-row table-id">
              <h6>Your ID:</h6>
              <div
                className="ps-1 id-border"
                style={{
                  border: "1px solid black",
                  width: 300,
                  marginLeft: 2,
                }}
              >
                {id}
              </div>{" "}
            </p>
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: 100 }}
            >
              <Button
                variant="contained"
                color="success"
                style={{ marginRight: 40 }}
              >
                <Link
                  to="/Login.js"
                  style={{ color: "white", textDecoration: "none" }}
                >
                  Go
                </Link>
              </Button>
              <Button variant="contained" onClick={handleLogout} color="info">
                Logout
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="card-with-alert sm-12">
          {isAlert && (
            <div className="alert">
              <Alert
                variant="filled"
                severity="warning"
                action={
                  <Button
                    color="inherit"
                    size="small"
                    onClick={() => setIsAlert(!isAlert)}
                  >
                    UNDO
                  </Button>
                }
              >
                This username has already been taken.
              </Alert>
            </div>
          )}
          <Card
            sx={{ width: 330, height: 390 }}
            style={{ borderRadius: "20px" }}
            className="sign-card"
          >
            <h1 className="text-center">Sign Up</h1>
            <hr />
            <CardContent>
              <TextField
                required
                id="outlined-basic"
                label="First Name"
                variant="outlined"
                style={{ width: 270 }}
                value={name}
                onChange={(event) => !isAlert && setName(event.target.value)}
              />
              <br />
              <br />
              <TextField
                required
                id="outlined-basic"
                label="Your Id"
                variant="outlined"
                style={{ width: 270 }}
                value={id}
                onChange={(event) => !isAlert && setId(event.target.value)}
              />
              <br />
            </CardContent>
            <CardActions sx={{ display: "flex", justifyContent: "center" }}>
              <Button size="small" variant="contained" onClick={handleSignUp}>
                Sign Up
              </Button>
            </CardActions>
          </Card>
        </div>
      )}
      <div className="d-none">
        <ChatInterface isLoggedIn={isLoggedIn} />
      </div>
    </div>
  );
};
