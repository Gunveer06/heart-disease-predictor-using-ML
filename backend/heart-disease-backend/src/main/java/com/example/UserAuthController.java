package com.example;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class UserAuthController {

    private static final String JDBC_URL = "jdbc:mysql://localhost:3306/heart_disease_db";
    private static final String JDBC_USER = "root";
    private static final String JDBC_PASSWORD = "#Notaga1n";

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody Map<String, Object> requestBody) {
        String loginQuery = "SELECT COUNT(*) FROM users WHERE username = ? AND password = ?";

        try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD);
             PreparedStatement stmt = conn.prepareStatement(loginQuery)) {

            stmt.setString(1, (String) requestBody.get("username"));
            stmt.setString(2, (String) requestBody.get("password"));

            ResultSet rs = stmt.executeQuery();

            if (rs.next() && rs.getInt(1) > 0) {
                return ResponseEntity.ok("1");  // Login successful
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("0");  // Invalid credentials
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Database error");
        }
    }


    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody Map<String, Object> requestBody) {
        String checkUserExists = "SELECT COUNT(*) FROM users WHERE email = ? OR username = ?";
        String insertUserSql = "INSERT INTO users (email, username, password) VALUES (?, ?, ?)";

        try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD);
             PreparedStatement checkStmt = conn.prepareStatement(checkUserExists);
             PreparedStatement insertStmt = conn.prepareStatement(insertUserSql)) {

            String email = (String) requestBody.get("email");
            String username = (String) requestBody.get("username");
            String password = (String) requestBody.get("password");

            // Check if email or username already exists
            checkStmt.setString(1, email);
            checkStmt.setString(2, username);
            ResultSet rs = checkStmt.executeQuery();
            if (rs.next() && rs.getInt(1) > 0) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email or Username already taken");
            }

            // Insert new user
            insertStmt.setString(1, email);
            insertStmt.setString(2, username);
            insertStmt.setString(3, password);
            insertStmt.executeUpdate();

            return ResponseEntity.ok("User registered successfully");
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error registering user");
        }
    }
}