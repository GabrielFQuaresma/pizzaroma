package com.pizzaria.pizzaroma.entity;

import jakarta.persistence.Entity;

@Entity
public class Funcionario extends Usuario {
    
    public Funcionario(String nome, String email, String senha, Role role){
        super(null, nome, email, senha, role);
    }
}
