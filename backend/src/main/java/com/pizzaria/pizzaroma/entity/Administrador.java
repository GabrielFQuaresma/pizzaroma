package com.pizzaria.pizzaroma.entity;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;

@Entity @AllArgsConstructor
public class Administrador extends Usuario {
    
    public Administrador(String nome, String email, String senha, Role role){
        super(null, nome, email, senha, role);
    }
}
