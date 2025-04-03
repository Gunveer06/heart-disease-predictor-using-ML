package com.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.util.*;

@SpringBootApplication
@RestController
@RequestMapping("/api/heart-disease")
@CrossOrigin(origins = "http://localhost:3000")  // ✅ Allow React frontend to access this API
public class HeartDiseaseWebAppBackend {

    private static final String PYTHON_API_URL = "http://127.0.0.1:5000/predict"; // Flask API URL

    public static void main(String[] args) {
        SpringApplication.run(HeartDiseaseWebAppBackend.class, args);
        System.out.println("✅ Java Backend is Running on http://127.0.0.1:8080");
    }

    @PostMapping("/predict")
    public ResponseEntity<String> predictHeartDisease(@RequestBody Map<String, Object> requestBody) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            System.out.println("🔄 Sending request to Flask API: " + PYTHON_API_URL);
            System.out.println("📦 Request Body: " + requestBody);

            ResponseEntity<String> response = restTemplate.exchange(PYTHON_API_URL, HttpMethod.POST, entity, String.class);

            System.out.println("✅ Response from Flask API: " + response.getBody());
            return ResponseEntity.ok(response.getBody());

        } catch (org.springframework.web.client.HttpClientErrorException e) {
            System.err.println("❌ Error from Python API: " + e.getMessage());
            return ResponseEntity.status(e.getStatusCode()).body("Error from Python API: " + e.getMessage());

        } catch (org.springframework.web.client.ResourceAccessException e) {
            System.err.println("❌ Cannot connect to Flask API! Is it running?");
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body("Cannot connect to Flask API. Is it running?");

        } catch (Exception e) {
            System.err.println("❌ General Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error connecting to AI model: " + e.getMessage());
        }
    }
}
