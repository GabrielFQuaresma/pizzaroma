package com.pizzaria.pizzaroma.dto;

import com.pizzaria.pizzaroma.entity.Role;
import jakarta.validation.constraints.*;

import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "Nome é obrigatório")
    private String nome;

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email inválido")
    private String email;
    
    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 6, message = "Senha deve ter pelo menos 6 caracteres")
    private String senha;

    @NotNull(message = "Role é obrigatória")
    private Role role;

    private String telefone;

}
