package com.pizzaria.pizzaroma.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class ItemPedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private PizzaSabor sabor;

    @Enumerated(EnumType.STRING)
    private TamanhoPizza tamanho;

    @Enumerated(EnumType.STRING)
    private BordaRecheada borda;

    private String observacoes;
    private int quantidade;
    private double precoUnitario;

    @ManyToOne
    @JsonBackReference
    private Pedido pedido;

    
}

