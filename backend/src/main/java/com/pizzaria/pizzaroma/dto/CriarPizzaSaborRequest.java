package com.pizzaria.pizzaroma.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CriarPizzaSaborRequest {
    private String nome;
    private String descricao;
    private double precoBase;
    private String imagemUrl; // Ex: https://...imagem-do-sabor.jpg

}
