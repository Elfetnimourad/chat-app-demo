import React, { useEffect } from "react";
import "./chatInterface.css";
import { useNavigate } from "react-router-dom";
import { SignUp } from "./SignUp";
export const ChatInterface = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  const checked = JSON.parse(sessionStorage.getItem("isLoggedIn"));
  const users = JSON.parse(localStorage.getItem("users")) || [];
  // useEffect(() => {
  //   const timeOut = setTimeout(() => {
  //     if (checked) {
  //       navigate("/chatapp");
  //     } else if (!checked && users.length > 0) {
  //       navigate("/Login.js");
  //     } else if (checked === null && users.length === 0) {
  //       navigate("/signUp");
  //     }
  //   }, 13000);
  //   return () => {
  //     clearTimeout(timeOut);
  //   };
  // }, [checked, navigate, users.length]);

  return (
    <div className="chatInterface d-flex flex-column justify-content-center align-items-center">
      <h1 className="text-white">RadiChat</h1>
      <div className="balls d-flex flex-row gap-1">
        <div className="bal bal-1 text-white"></div>
        <div className="bal bal-2 text-white"></div>
        <div className="bal bal-3 text-white"></div>
        <div className="bal bal-4 text-white"></div>
      </div>
    </div>
  );
};
