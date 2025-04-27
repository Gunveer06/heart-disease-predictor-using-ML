import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ResultPage.css";

const ResultPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { result } = location.state || { result: "No result available" };

    return (
        <div className="result-container">
            <h2 className="result-title">Heart Disease Prediction Result</h2>
            <p className="result-text">
                {result === "Error in prediction. Please try again."
                    ? "⚠️ Something went wrong. Please try again."
                    : `🫀 Your heart disease risk: ${result}`}
            </p>
            <button className="home-btn" onClick={() => navigate("/dashboard")}>Back to Home</button>
        </div>
    );
};

export default ResultPage;
