package com.pizzaria.pizzaroma.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pizzaria.pizzaroma.entity.Pedido;
import com.pizzaria.pizzaroma.repository.PedidoRepository;
import com.pizzaria.pizzaroma.security.JwtService;

@RestController
@RequestMapping("/usuario")
public class PedidoController {

    private final PedidoRepository pedidoRepository;
    private final JwtService jwtService; 

    public PedidoController(PedidoRepository pedidoRepository, JwtService jwtService) {
        this.pedidoRepository = pedidoRepository;
        this.jwtService = jwtService;
    }

    @GetMapping("/pedidos")
    public ResponseEntity<List<Pedido>> getPedidos(@RequestHeader("Authorization") String token) {
        String email = jwtService.extractEmailFromToken(token);
        List<Pedido> pedidos = pedidoRepository.findByClienteEmail(email);
        return ResponseEntity.ok(pedidos);
    }
}
