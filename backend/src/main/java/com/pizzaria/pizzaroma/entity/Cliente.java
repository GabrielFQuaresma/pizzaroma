package com.pizzaria.pizzaroma.entity;

import jakarta.persistence.Entity;

@Entity
public class Cliente extends Usuario{
    private String telefone;

    public Cliente() {
        super();
    }    

    public Cliente(String nome, String email, String telefone, String senha, Role role){
        super(null, nome, email, senha, role);
        this.telefone = telefone;
    }
}