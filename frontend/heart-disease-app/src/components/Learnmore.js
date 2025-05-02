import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { FaArrowLeft, FaHeartbeat, FaRegChartBar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Learnmore.css";

const featureData = [
  {
    title: "Age",
    description:
      "Older individuals are at higher risk for heart disease due to aging arteries and increased exposure to risk factors.",
    icon: <FaRegChartBar />,
  },
  {
    title: "Gender",
    description:
      "Heart disease can present differently in men and women. Risk levels may vary based on sex-specific factors.",
    icon: <FaRegChartBar />,
  },
  {
    title: "Chest Pain Type",
    description:
      "Certain types of chest pain (like angina) are strong indicators of underlying heart conditions.",
    icon: <FaRegChartBar />,
  },
  {
    title: "Blood Pressure",
    description:
      "High blood pressure forces the heart to work harder and is a key risk factor for heart disease.",
    icon: <FaRegChartBar />,
  },
  {
    title: "Cholesterol Level",
    description:
      "Excessive cholesterol can lead to plaque buildup in arteries, reducing blood flow to the heart.",
    icon: <FaRegChartBar />,
  },
  {
    title: "Sugar Level",
    description:
      "High blood sugar damages blood vessels and increases the risk of cardiovascular issues.",
    icon: <FaRegChartBar />,
  },
  {
    title: "ECG Results",
    description:
      "Abnormal ECG readings can indicate heart abnormalities, contributing to diagnosis.",
    icon: <FaRegChartBar />,
  },
  {
    title: "Maximum Heart Rate",
    description:
      "Lower maximum heart rate during exercise may signal poor cardiovascular fitness.",
    icon: <FaRegChartBar />,
  },
  {
    title: "Exercise Induced Angina",
    description:
      "Angina triggered by exercise can be a strong symptom of underlying heart disease.",
    icon: <FaRegChartBar />,
  },
  {
    title: "Oldpeak (ST Depression)",
    description:
      "Depression of the ST segment during exercise is a clinical indicator of ischemia.",
    icon: <FaRegChartBar />,
  },
  {
    title: "Slope of ST Segment",
    description:
      "ST segment slope helps assess the severity of heart stress during exertion.",
    icon: <FaRegChartBar />,
  },
];

const LearnMore = () => {
  const navigate = useNavigate();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="learnmore-container">
      <motion.div
        className="learnmore-header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>
          <FaHeartbeat className="icon" /> Understanding Prediction Factors
        </h1>
        <p>Explore how each input contributes to your heart disease risk prediction.</p>
        <button className="back-btn" onClick={() => navigate("/")}>
          <FaArrowLeft /> Back to Home
        </button>
      </motion.div>

      <div className="feature-grid">
        {featureData.map((feature, index) => (
          <motion.div
            className="feature-card"
            key={index}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LearnMore;
