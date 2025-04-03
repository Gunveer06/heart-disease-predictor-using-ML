import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // ✅ Use useNavigate()
import { FaHeartbeat, FaRobot, FaAngleDown } from "react-icons/fa";
import { ReactTyped } from "react-typed"; 
import FeatureSection from "./FeatureSection";
import AnimationWave from "./AnimationWave";
import "./LandingPage.css"; 

const LandingPage = () => {
    const navigate = useNavigate(); // ✅ Navigation Hook

    return (
        <div className="landing-container">
            <div className="overlay"></div>

            {/* Title with Heart Icon */}
            <motion.h1 
                className="title"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            >
                <FaHeartbeat className="icon" /> AI-Powered Heart Health Screening
            </motion.h1>

            {/* Animated Typing Effect */}
            <ReactTyped 
                className="typed-text"
                strings={[
                    "Detect Early, Live Healthy", 
                    "AI-Powered Heart Risk Detection", 
                    "Stay Informed, Stay Healthy"
                ]}
                typeSpeed={50}
                backSpeed={30}
                loop
            />

            {/* Buttons with Motion Effect */}
            <motion.div 
                className="buttons-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
            >
                {/* ✅ Navigate to "/login" on button click (lowercase) */}
                <button className="neon-btn" onClick={() => navigate("/login")}>
                    Get Started <FaRobot />
                </button>

                <a href="#features">
                    <button className="outline-btn">
                        Learn More <FaAngleDown />
                    </button>
                </a>
            </motion.div>

            {/* Feature Section */}
            <FeatureSection />

            {/* 🔥 Wave Animation at Bottom */}
            <AnimationWave />
        </div>
    );
};

export default LandingPage;
