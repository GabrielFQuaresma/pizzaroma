package com.pizzaria.pizzaroma.controller;

import com.pizzaria.pizzaroma.entity.PizzaSabor;
import com.pizzaria.pizzaroma.service.PizzaSaborService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

//PARTE PUBLICA

@RestController
@RequestMapping("/api/sabores") // Alterado para /api/sabores para seguir um padrão
public class SaborController { // Renomeado para SaborController para clareza

    private final PizzaSaborService pizzaSaborService;

    @Autowired
    public SaborController(PizzaSaborService pizzaSaborService) {
        this.pizzaSaborService = pizzaSaborService;
    }

    @GetMapping
    public ResponseEntity<List<PizzaSabor>> listarTodos() {
        List<PizzaSabor> sabores = pizzaSaborService.findAll();
        return ResponseEntity.ok(sabores);
    }

    @GetMapping("/promocoes")
    public ResponseEntity<List<PizzaSabor>> listarPromocoes() {
        List<PizzaSabor> promocoes = pizzaSaborService.findTop3ByOrderByPrecoBaseAsc();
        return ResponseEntity.ok(promocoes);
    }
}
