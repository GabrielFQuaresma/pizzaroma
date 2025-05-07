package com.pizzaria.pizzaroma.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;

import com.pizzaria.pizzaroma.service.AuthService;
import com.pizzaria.pizzaroma.dto.RegisterRequest;

@RestController
@RequestMapping("/auth")
public class AuthController {
    
    private final AuthService authService;

    public AuthController(AuthService authService){
        this.authService = authService;
    }

    public ResponseEntity<String> register(@RequestBody RegisterRequest request){
        try{
            authService.Register(request);
            return ResponseEntity.ok("Usuário registrado com sucesso");
        } catch(IllegalArgumentException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
