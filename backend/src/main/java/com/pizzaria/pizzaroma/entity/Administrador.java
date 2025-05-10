package com.pizzaria.pizzaroma.entity;

import jakarta.persistence.Entity;

@Entity 
public class Administrador extends Usuario {

    public Administrador() {
        super();
    }
    
    public Administrador(String nome, String email, String senha, Role role){
        super(null, nome, email, senha, role);
    }
}
