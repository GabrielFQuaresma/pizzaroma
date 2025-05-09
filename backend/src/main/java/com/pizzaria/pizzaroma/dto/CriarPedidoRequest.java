package com.pizzaria.pizzaroma.dto;

import java.util.List;

import lombok.Data;

@Data
public class CriarPedidoRequest {
    private List<ItemPedidoRequest> itens;

    private String cep;
    private String rua;
    private String numero;
    private String complemento;
    private String bairro;
    private String cidade;

    // Troco
    private Double valorParaTroco;
}