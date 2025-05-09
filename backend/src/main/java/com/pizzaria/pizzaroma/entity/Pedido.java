package com.pizzaria.pizzaroma.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.Transient;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Setter
@Getter
@NoArgsConstructor
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Usuario cliente;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<ItemPedido> itens = new ArrayList<>();

    // Endereço de entrega
    private String cep;
    private String rua;
    private String numero;
    private String complemento;
    private String bairro;
    private String cidade;

    private Double valorParaTroco;

    @Enumerated(EnumType.STRING)
    private StatusPedido status = StatusPedido.PREPARANDO;

    private LocalDateTime dataHora = LocalDateTime.now();

    @Transient
    public Double getValorTotal() {
        if (this.itens == null) {
            return 0.0;
        }
        return this.itens.stream()
                         .mapToDouble(item -> item.getPrecoUnitario() * item.getQuantidade())
                         .sum();
    }

    @Transient
    public String getEnderecoEntrega() {
        StringBuilder sb = new StringBuilder();
        boolean hasPreviousField = false;

        if (rua != null && !rua.trim().isEmpty()) {
            sb.append(rua.trim());
            hasPreviousField = true;
        }
        if (numero != null && !numero.trim().isEmpty()) {
            if (hasPreviousField) sb.append(", ");
            sb.append(numero.trim());
            hasPreviousField = true;
        }
        if (complemento != null && !complemento.trim().isEmpty()) {
            if (hasPreviousField) sb.append(" - ");
            sb.append(complemento.trim());
            hasPreviousField = true;
        }
        if (bairro != null && !bairro.trim().isEmpty()) {
            if (hasPreviousField) sb.append(", ");
            sb.append(bairro.trim());
            hasPreviousField = true;
        }
        if (cidade != null && !cidade.trim().isEmpty()) {
            if (hasPreviousField) sb.append(" - ");
            sb.append(cidade.trim());
            hasPreviousField = true;
        }
        if (cep != null && !cep.trim().isEmpty()) {
            if (hasPreviousField) sb.append(", CEP: ");
            else sb.append("CEP: ");
            sb.append(cep.trim());
            hasPreviousField = true;
        }
        
        return sb.length() > 0 ? sb.toString() : null;
    }
}



