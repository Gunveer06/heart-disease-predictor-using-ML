package com.example;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
@RestController
@RequestMapping("/api/heart-disease")
@CrossOrigin(origins = "http://localhost:3000")
public class HeartDiseaseWebAppBackend {

    private static final String PYTHON_API_URL = "http://127.0.0.1:5002/predict"; // Flask API URL

    // Database Connection Details
    private static final String JDBC_URL = "jdbc:mysql://localhost:3306/heart_disease_db";
    private static final String JDBC_USER = "root";
    private static final String JDBC_PASSWORD = "Gunveer@240506";

    public static void main(String[] args) {
        SpringApplication.run(HeartDiseaseWebAppBackend.class, args);
        System.out.println("✅ Java Backend is Running on http://127.0.0.1:8080");
    }

    @PostMapping("/predict")
    public ResponseEntity<String> predictHeartDisease(@RequestBody Map<String, Object> requestBody) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // 1. Extract and encode features for the Flask API
        List<Object> features = new ArrayList<>();

        // Age (int)
        features.add(requestBody.get("age"));

        // Gender: male=1, female=0 (encode String to int)
        String gender = ((String) requestBody.get("gender")).toLowerCase();
        features.add(gender.equals("male") ? 1 : 0);

        // Chest Pain Type (int)
        features.add(requestBody.get("chestPain"));

        // Blood Pressure (int)
        features.add(requestBody.get("bp"));

        // Cholesterol (int)
        features.add(requestBody.get("cholesterol"));

        // Sugar Level (int)
        features.add(requestBody.get("sugarLevel"));

        // ECG Issues (int)
        features.add(requestBody.get("ecgIssues"));

        // Max Heart Rate (int)
        features.add(requestBody.get("maxHr"));

        // Oldpeak (double)
        features.add(Double.parseDouble(requestBody.get("oldpeak").toString()));

        // ST Slope (int)
        features.add(requestBody.get("stSlope"));

        // Exercise Angina: yes=1, no=0 (encode String to int)
        String exerciseAngina = ((String) requestBody.get("exerciseAngina")).toLowerCase();
        features.add(exerciseAngina.equals("yes") ? 1 : 0);

        // 2. Build payload for Flask API
        Map<String, Object> flaskPayload = new HashMap<>();
        flaskPayload.put("features", features);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(flaskPayload, headers);

        try {
            System.out.println("🔄 Sending request to Flask API: " + PYTHON_API_URL);
            System.out.println("📦 Request Body: " + flaskPayload);

            ResponseEntity<String> response = restTemplate.exchange(
                    PYTHON_API_URL, HttpMethod.POST, entity, String.class
            );

            System.out.println("✅ Response from Flask API: " + response.getBody());
            insertOrUpdateDatabase(requestBody, response.getBody());
            return ResponseEntity.ok(response.getBody());

        } catch (Exception e) {
            System.err.println("❌ General Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing request: " + e.getMessage());
        }
    }


    private void insertOrUpdateDatabase(Map<String, Object> requestBody, String predictionResult) {
        String checkSql = "SELECT COUNT(*) FROM heart_disease_data WHERE user_id = ?";
        String insertSql = "INSERT INTO heart_disease_data (user_id, name, age, gender, chest_pain, bp, cholesterol, sugar_level, ecg_issues, " +
                "max_hr, exercise_angina, oldpeak, st_slope, prediction_result) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        String updateSql = "UPDATE heart_disease_data SET name=?, age=?, gender=?, chest_pain=?, bp=?, cholesterol=?, sugar_level=?, " +
                "ecg_issues=?, max_hr=?, exercise_angina=?, oldpeak=?, st_slope=?, prediction_result=? WHERE user_id=?";

        try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD);
             PreparedStatement checkStmt = conn.prepareStatement(checkSql)) {

            int userId = (int) requestBody.get("userId");
            checkStmt.setInt(1, userId);
            ResultSet rs = checkStmt.executeQuery();

            if (rs.next() && rs.getInt(1) > 0) {
                try (PreparedStatement updateStmt = conn.prepareStatement(updateSql)) {
                    updateStmt.setString(1, (String) requestBody.get("name"));
                    updateStmt.setInt(2, (int) requestBody.get("age"));
                    updateStmt.setString(3, (String) requestBody.get("gender"));
                    updateStmt.setInt(4, (int) requestBody.get("chestPain"));
                    updateStmt.setInt(5, (int) requestBody.get("bp"));
                    updateStmt.setInt(6, (int) requestBody.get("cholesterol"));
                    updateStmt.setInt(7, (int) requestBody.get("sugarLevel"));
                    updateStmt.setInt(8, (int) requestBody.get("ecgIssues"));
                    updateStmt.setInt(9, (int) requestBody.get("maxHr"));
                    updateStmt.setString(10, (String) requestBody.get("exerciseAngina"));
                    updateStmt.setDouble(11, Double.parseDouble(requestBody.get("oldpeak").toString()));
                    updateStmt.setInt(12, (int) requestBody.get("stSlope"));
                    updateStmt.setString(13, predictionResult);
                    updateStmt.setInt(14, userId);
                    updateStmt.executeUpdate();
                    System.out.println("🔄 Existing user updated in database: User ID " + userId);
                }
            } else {
                try (PreparedStatement insertStmt = conn.prepareStatement(insertSql)) {
                    insertStmt.setInt(1, userId);
                    insertStmt.setString(2, (String) requestBody.get("name"));
                    insertStmt.setInt(3, (int) requestBody.get("age"));
                    insertStmt.setString(4, (String) requestBody.get("gender"));
                    insertStmt.setInt(5, (int) requestBody.get("chestPain"));
                    insertStmt.setInt(6, (int) requestBody.get("bp"));
                    insertStmt.setInt(7, (int) requestBody.get("cholesterol"));
                    insertStmt.setInt(8, (int) requestBody.get("sugarLevel"));
                    insertStmt.setInt(9, (int) requestBody.get("ecgIssues"));
                    insertStmt.setInt(10, (int) requestBody.get("maxHr"));
                    insertStmt.setString(11, (String) requestBody.get("exerciseAngina"));
                    insertStmt.setDouble(12, Double.parseDouble(requestBody.get("oldpeak").toString()));
                    insertStmt.setInt(13, (int) requestBody.get("stSlope"));
                    insertStmt.setString(14, predictionResult);
                    insertStmt.executeUpdate();
                    System.out.println("✅ New user inserted into database: User ID " + userId);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            System.err.println("❌ Error inserting or updating database: " + e.getMessage());
        }
    }
}   