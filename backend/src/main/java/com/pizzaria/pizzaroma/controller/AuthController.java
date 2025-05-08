package com.pizzaria.pizzaroma.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.stream.Collectors;
import java.util.Map; // Add this import
import java.util.HashMap; // Add this import

import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;


import jakarta.validation.Valid;

import com.pizzaria.pizzaroma.dto.RegisterRequest;
import com.pizzaria.pizzaroma.dto.LoginRequest;
import com.pizzaria.pizzaroma.service.AuthService;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    private final AuthService authService;

    public AuthController(AuthService authService){
        this.authService = authService;
    }

    
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody @Valid RegisterRequest request, BindingResult result) {
        if (result.hasErrors()) {
            String erros = result.getAllErrors().stream()
                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                .collect(Collectors.joining(", "));
            return ResponseEntity.badRequest().body("Erros: " + erros);
        }

        try {
            authService.register(request);
            return ResponseEntity.ok("Usuário registrado com sucesso!");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody @Valid LoginRequest request, BindingResult result) {
        Map<String, String> response = new HashMap<>();
        if (result.hasErrors()) {
            String erros = result.getAllErrors().stream()
                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                .collect(Collectors.joining(", "));
            response.put("error", "Erros de validação: " + erros);
            return ResponseEntity.badRequest().body(response);
        }
    
        try {
            String token = authService.login(request);
            response.put("token", token);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) { // Catch other unexpected exceptions
            // Log the exception for server-side debugging
            // e.g., log.error("Unexpected error during login for email {}: {}", request.getEmail(), e.getMessage(), e);
            response.put("error", "Ocorreu um erro inesperado no servidor. Tente novamente mais tarde.");
            System.out.println(e.getMessage());
            return ResponseEntity.status(500).body(response); // Internal Server Error
        }
    }
}
