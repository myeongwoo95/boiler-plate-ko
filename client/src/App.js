import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from './components/views/_LandingPage/LandingPage'
import LoginPage from './components/views/LoginPage/LoginPage'
import RegisterPage from './components/views/RegisterPage/RegisterPage'
import Auth from './hoc/auth'

function App() {
  const AuthLandingPage = Auth(LandingPage, null);
  const AuthRegisterPage = Auth(RegisterPage, false);
  const AuthLoginPage = Auth(LoginPage, false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={Auth(<AuthLandingPage />)} />
        <Route path="/register" element={Auth(<AuthRegisterPage />)} />
        <Route path="/login" element={Auth(<AuthLoginPage />)} />
      </Routes>
    </Router>
  );
}
export default App;