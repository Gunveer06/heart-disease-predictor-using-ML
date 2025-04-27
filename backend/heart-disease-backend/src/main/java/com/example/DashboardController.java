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

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class DashboardController {

    private static final String JDBC_URL = "jdbc:mysql://localhost:3306/heart_disease_db";
    private static final String JDBC_USER = "root";
    private static final String JDBC_PASSWORD = "Gunveer@240506";

    @GetMapping("/api/dashboard/features/{user_id}")
    public ResponseEntity<Map<String, Object>> getUserFeatures(@PathVariable("user_id") String user_id) {
        String query = "SELECT * FROM heart_disease_data WHERE user_id = ?";  // Query to fetch history for user

        try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD);
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, user_id);
            ResultSet rs = stmt.executeQuery();

            List<Map<String, Object>> userHistory = new ArrayList<>();

            while (rs.next()) {
                Map<String, Object> userFeatures = new HashMap<>();
                userFeatures.put("userId", rs.getInt("user_id"));
                userFeatures.put("name", rs.getString("name"));
                userFeatures.put("age", rs.getInt("age"));
                userFeatures.put("gender", rs.getString("gender"));
                userFeatures.put("chest_pain", rs.getInt("chest_pain"));
                userFeatures.put("bp", rs.getInt("bp"));
                userFeatures.put("cholesterol", rs.getInt("cholesterol"));
                userFeatures.put("sugar_level", rs.getInt("sugar_level"));
                userFeatures.put("ecg_issues", rs.getInt("ecg_issues"));
                userFeatures.put("max_hr", rs.getInt("max_hr"));
                userFeatures.put("exercise_angina", rs.getString("exercise_angina"));
                userFeatures.put("oldpeak", rs.getDouble("oldpeak"));
                userFeatures.put("st_slope", rs.getInt("st_slope"));
                userFeatures.put("prediction_result", rs.getString("prediction_result"));
                userHistory.add(userFeatures);
            }

            if (userHistory.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "No history found for this user"));
            } else {
                return ResponseEntity.ok(Map.of("history", userHistory));
            }

        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Database error"));
        }
    }
}
