import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="dashboard-container">
            <h1>Welcome to Your Dashboard</h1>
            <div className="history-section">
                <h2>Prediction History</h2>
                {/* Add logic to fetch and display past predictions */}
                <p>No history available yet.</p>
            </div>
            <button className="predict-btn" onClick={() => navigate("/predict")}>
                Make a Prediction
            </button>
        </div>
    );
};

export default Dashboard;
