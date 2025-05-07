package com.pizzaria.pizzaroma.dto;

import com.pizzaria.pizzaroma.entity.Role;
import jakarta.validation.constraints.*;

import lombok.Data;

@Data
public class RegisterRequest {
    @notBlank
    private String nome;
    private String email;
    private String senha;
    private Role role;
    private String telefone;

}
