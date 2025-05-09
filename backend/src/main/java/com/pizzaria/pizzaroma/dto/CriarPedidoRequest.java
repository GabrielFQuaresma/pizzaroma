package com.pizzaria.pizzaroma.dto;

import java.util.List;

import lombok.Data;

@Data
public class CriarPedidoRequest {
    private List<ItemPedidoRequest> itens;
}