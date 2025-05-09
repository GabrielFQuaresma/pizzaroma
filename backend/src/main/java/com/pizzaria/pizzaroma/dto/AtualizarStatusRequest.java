package com.pizzaria.pizzaroma.dto;

import com.pizzaria.pizzaroma.entity.StatusPedido;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AtualizarStatusRequest {
    private Long pedidoId;
    private StatusPedido novoStatus;

    // Getters e Setters
}
