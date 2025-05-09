package com.pizzaria.pizzaroma.dto;

import com.pizzaria.pizzaroma.entity.BordaRecheada;
import com.pizzaria.pizzaroma.entity.TamanhoPizza;

import lombok.Data;

@Data
public class ItemPedidoRequest {
    private Long idSabor;
    private TamanhoPizza tamanho;
    private BordaRecheada borda;
    private String ingredientesAdicionais;
    private String observacoes;
}