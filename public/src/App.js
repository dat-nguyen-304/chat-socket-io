import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import SetAvatar from "./pages/setAvatar";

function App () {
  return (
    <Router>
      <Routes>
        <Route exact path="/register" element={ <Register /> } />
        <Route exact path="/login" element={ <Login /> } />
        <Route exact path="/set-avatar" element={ <SetAvatar /> } />
        <Route exact path="/" element={ <Chat /> } />
      </Routes>
    </Router>
  );
}

export default App;
