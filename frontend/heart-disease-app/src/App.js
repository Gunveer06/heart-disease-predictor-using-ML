import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import Dashboard from "./components/Dashboard"; // ✅ Import Dashboard
import HeartDiseasePredictor from "./components/HeartDiseasePredictor";
import ResultPage from "./components/ResultPage";
import LearnMore from "./components/Learnmore";
import "./App.css";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard" element={<Dashboard />} /> {/* ✅ Ensure Dashboard Route Exists */}
                <Route path="/predict" element={<HeartDiseasePredictor />} />
                <Route path="/result" element={<ResultPage />} />
                <Route path="/learnmore" element={<LearnMore />} />
            </Routes>
        </Router>
    );
};

export default App;