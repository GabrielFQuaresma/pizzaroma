package com.pizzaria.pizzaroma.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pizzaria.pizzaroma.entity.Pedido;
import com.pizzaria.pizzaroma.entity.StatusPedido;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByClienteEmail(String email);
    List<Pedido> findByStatusIn(List<StatusPedido> status);
}
