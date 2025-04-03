import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./GoodHeart.css"; 

const GoodHeart = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const result = location.state?.result || "Unknown";

    return (
        <div className="good-heart-container">
            <h1>💚 Your Heart is Healthy!</h1>
            <p>Your heart disease risk is {result}%. Keep maintaining a healthy lifestyle! 🎉</p>
            <button className="back-btn" onClick={() => navigate("/")}>Back to Home</button>
        </div>
    );
};

export default GoodHeart;
