package com.pizzaria.pizzaroma.dto;

import com.pizzaria.pizzaroma.entity.PizzaSabor;

import lombok.Getter;

@Getter
public class PizzaSaborResponse {

    private Long id;
    private String nome;
    private String descricao;
    private double precoBase;
    private String imagemUrl;

    public PizzaSaborResponse(PizzaSabor sabor) {
        this.id = sabor.getId();
        this.nome = sabor.getNome();
        this.descricao = sabor.getDescricao();
        this.precoBase = sabor.getPrecoBase();
        this.imagemUrl = sabor.getImagemUrl();
    }

    // Getters
}
