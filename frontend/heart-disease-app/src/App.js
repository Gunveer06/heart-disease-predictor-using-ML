import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import HeartDiseasePredictor from "./components/HeartDiseasePredictor";
import ResultPage from "./components/ResultPage";
import "./App.css"

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/predict" element={<HeartDiseasePredictor />} />
                <Route path="/result" element={<ResultPage />} />
                <Route path="/" element={<LandingPage/>}/>
            </Routes>
        </Router>
    );
};

export default App;
