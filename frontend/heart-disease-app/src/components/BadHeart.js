import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./BadHeart.css"; 

const BadHeart = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const result = location.state?.result || "Unknown";

    return (
        <div className="bad-heart-container">
            <h1>💔 High Risk Detected!</h1>
            <p>Your heart disease risk is {result}. Consider consulting a doctor. 🙏</p>
            <button className="back-btn" onClick={() => navigate("/")}>Back to Home</button>
        </div>
    );
};

export default BadHeart;
