package com.pizzaria.pizzaroma.service;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.userdetails.UserDetails;

import com.pizzaria.pizzaroma.entity.Usuario;
import com.pizzaria.pizzaroma.repository.UsuarioRepository;
import java.util.List;
import org.springframework.security.core.userdetails.User;

public class CustomUserDetailsService implements UserDetailsService{
    
    private final UsuarioRepository repository;

    public CustomUserDetailsService(UsuarioRepository repository){
        this.repository = repository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException{
        Usuario usuario = repository.findbyEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("Usuario não encontrado"));

        return new User(
        usuario.getEmail(), 
        usuario.getSenha(), 
        List.of(new SimpleGrantedAuthority("ROLE_" + usuario.getRole()))
        );
    }
}
