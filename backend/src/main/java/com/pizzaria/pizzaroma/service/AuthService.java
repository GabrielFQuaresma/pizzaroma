package com.pizzaria.pizzaroma.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.pizzaria.pizzaroma.entity.Role;
import com.pizzaria.pizzaroma.entity.Administrador;
import com.pizzaria.pizzaroma.entity.Usuario;
import com.pizzaria.pizzaroma.entity.Funcionario;
import com.pizzaria.pizzaroma.entity.Cliente;
import com.pizzaria.pizzaroma.dto.LoginRequest;
import com.pizzaria.pizzaroma.dto.RegisterRequest;
import com.pizzaria.pizzaroma.repository.UsuarioRepository;
import com.pizzaria.pizzaroma.security.JwtService;

import io.jsonwebtoken.Jwt;

@Service
public class AuthService {
    
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, JwtService jwtService){
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public void register(RegisterRequest request){

        if (usuarioRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("E-mail já cadastrado!");
        }

        String senhaCriptografada = passwordEncoder.encode(request.getSenha());

        Usuario usuario;
        
        switch (request.getRole()) {
            case ADMIN:
                usuario = new Administrador(request.getNome(), request.getEmail(), senhaCriptografada, Role.ADMIN);
                break;
            case FUNCIONARIO:
                usuario = new Funcionario(request.getNome(), request.getEmail(), senhaCriptografada, Role.FUNCIONARIO);
                break;
            case CLIENTE:
                usuario = new Cliente(request.getNome(), request.getEmail(), request.getTelefone(), senhaCriptografada, Role.CLIENTE);
                break;
            default:
                throw new IllegalArgumentException("Role inválido");
        }

        usuarioRepository.save(usuario);
    }

    public String login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new IllegalArgumentException("Email não encontrado"));
        
        if (!passwordEncoder.matches(request.getSenha(), usuario.getSenha())){
            throw new IllegalArgumentException("Senha incorreta");
        }

        return jwtService.generateToken(usuario.getEmail(), usuario.getRole().name());
    }
}
