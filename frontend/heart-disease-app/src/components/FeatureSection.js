import React from "react";
import { FaStethoscope, FaBrain, FaShieldAlt } from "react-icons/fa";
import "./FeatureSection.css";

const FeatureSection = () => {
    return (
        <div className="feature-section">
            <h2>Why Choose Our AI Heart Screening?</h2>
            <div className="feature-grid">
                <div className="feature-box">
                    <FaStethoscope className="feature-icon" />
                    <h3>Early Detection</h3>
                    <p>Identify heart disease risks at an early stage.</p>
                </div>

                <div className="feature-box">
                    <FaBrain className="feature-icon" />
                    <h3>AI-Powered Analysis</h3>
                    <p>Advanced AI models analyze your health parameters.</p>
                </div>

                <div className="feature-box">
                    <FaShieldAlt className="feature-icon" />
                    <h3>100% Secure</h3>
                    <p>Your medical data is safe and encrypted.</p>
                </div>
            </div>
        </div>
    );
};

export default FeatureSection;
