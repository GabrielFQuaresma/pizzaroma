package com.pizzaria.pizzaroma.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pizzaria.pizzaroma.dto.CriarPizzaSaborRequest;
import com.pizzaria.pizzaroma.dto.PizzaSaborResponse;
import com.pizzaria.pizzaroma.entity.PizzaSabor;
import com.pizzaria.pizzaroma.repository.PizzaSaborRepository;
import com.pizzaria.pizzaroma.security.JwtService;


//POSTERIORMENTE FAZER UM SERVICE E UM CONTROLLER
@RestController
@RequestMapping("/admin/sabores")
public class PizzaSaborController {

    private final PizzaSaborRepository saborRepository;
    private final JwtService jwtService;

    public PizzaSaborController(PizzaSaborRepository saborRepository, JwtService jwtService) {
        this.saborRepository = saborRepository;
        this.jwtService = jwtService;
    }

    @PostMapping("/adicionar")
    public ResponseEntity<?> adicionarSabor(@RequestBody CriarPizzaSaborRequest request,
                                            @RequestHeader("Authorization") String authorizationHeader) {

        String token = null;
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            token = authorizationHeader.substring(7);
        } else {
            // Handle case where token is not in the correct format or missing
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token de autorização ausente ou mal formatado.");
        }

        String role = jwtService.extractRole(token);
        if (!"ADMIN".equalsIgnoreCase(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Acesso negado");
        }

        if (saborRepository.findByNome(request.getNome()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Sabor já existe.");
        }

        PizzaSabor sabor = new PizzaSabor();
        sabor.setNome(request.getNome());
        sabor.setDescricao(request.getDescricao());
        sabor.setPrecoBase(request.getPrecoBase());
        sabor.setImagemUrl(request.getImagemUrl());

        saborRepository.save(sabor);

        return ResponseEntity.ok("Sabor adicionado com sucesso.");
    }

    @GetMapping
    public ResponseEntity<List<PizzaSaborResponse>> listarSabores() {
        List<PizzaSabor> sabores = saborRepository.findAll();
        List<PizzaSaborResponse> response = sabores.stream()
            .map(PizzaSaborResponse::new)
            .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
}

