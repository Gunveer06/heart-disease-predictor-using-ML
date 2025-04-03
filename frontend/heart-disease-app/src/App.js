import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import HeartDiseasePredictor from "./components/HeartDiseasePredictor";
import ResultPage from "./components/ResultPage";
import LoginPage from "./components/LoginPage"; // Import LoginPage
import "./App.css";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />  {/* New Login Route */}
                <Route path="/predict" element={<HeartDiseasePredictor />} />
                <Route path="/result" element={<ResultPage />} />
            </Routes>
        </Router>
    );
};

export default App;
