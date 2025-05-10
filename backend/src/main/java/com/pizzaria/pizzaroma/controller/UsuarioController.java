package com.pizzaria.pizzaroma.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pizzaria.pizzaroma.dto.UsuarioResponse;
import com.pizzaria.pizzaroma.entity.Cliente;
import com.pizzaria.pizzaroma.entity.Usuario;
import com.pizzaria.pizzaroma.repository.UsuarioRepository;
import com.pizzaria.pizzaroma.security.JwtService;

@RestController
@RequestMapping("/usuario")
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService; // injeta aqui

    public UsuarioController(UsuarioRepository usuarioRepository, JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.jwtService = jwtService;
    }

    @GetMapping("/perfil")
    public ResponseEntity<UsuarioResponse> getPerfil(@RequestHeader("Authorization") String token) {
        String email = jwtService.extractEmailFromToken(token); 
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));

        System.out.println(email);
        UsuarioResponse response = new UsuarioResponse(
                usuario.getNome(),
                usuario.getEmail(),
                (usuario instanceof Cliente cliente) ? cliente.getTelefone() : null,
                usuario.getRole().name()
        );

        return ResponseEntity.ok(response);
    }
}

