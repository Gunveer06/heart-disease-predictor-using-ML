package com.example;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:3000")
public class DashboardController {

    private static final String JDBC_URL = "jdbc:mysql://localhost:3306/your_database";
    private static final String JDBC_USER = "your_username";
    private static final String JDBC_PASSWORD = "Raghav#2930";

    @GetMapping("/features/{username}")
    public ResponseEntity<Map<String, Object>> getUserFeatures(@PathVariable String username) {
        String query = "SELECT * FROM user_predictions WHERE username = ?";

        try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD);
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, username);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                Map<String, Object> userFeatures = new HashMap<>();
                userFeatures.put("username", rs.getString("username"));
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

                return ResponseEntity.ok(userFeatures);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("message", "User not found"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("error", "Database error"));
        }
    }
}