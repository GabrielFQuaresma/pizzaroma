package com.pizzaria.pizzaroma.repository;

import com.pizzaria.pizzaroma.entity.Usuario;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;


public interface UsuarioRepository extends JpaRepository<Usuario, Long>{
    Optional<Usuario> findbyEmail(String email);    
}