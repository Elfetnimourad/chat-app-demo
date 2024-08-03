import logo from "./logo.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Login } from "./component/Login";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SignUp } from "./component/SignUp";
import { ChattApp } from "./component/ChattApp";
import { ChatInterface } from "./component/ChatInterface";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<ChatInterface />} />
          <Route path="/Login.js" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/chatapp" element={<ChattApp />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
