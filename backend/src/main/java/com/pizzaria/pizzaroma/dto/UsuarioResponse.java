package com.pizzaria.pizzaroma.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UsuarioResponse {
    private String nome;
    private String email;
    private String telefone;
    private String role;
}
