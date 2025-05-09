package com.pizzaria.pizzaroma.dto;

import com.pizzaria.pizzaroma.entity.BordaRecheada;
import com.pizzaria.pizzaroma.entity.TamanhoPizza;

import lombok.Data;
import lombok.Setter;

@Data
public class ItemPedidoRequest {
    private Long idSabor;
    private TamanhoPizza tamanho;
    private BordaRecheada borda;
    private String ingredientesAdicionais;
    private String observacoes;
    private int quantidade;
    private double precoUnitario;

}