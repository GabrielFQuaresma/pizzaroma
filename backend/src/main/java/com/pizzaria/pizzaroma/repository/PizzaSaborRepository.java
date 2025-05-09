package com.pizzaria.pizzaroma.repository;

import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pizzaria.pizzaroma.entity.PizzaSabor;

@Repository
public interface PizzaSaborRepository extends JpaRepository<PizzaSabor, Long> {
    Optional<PizzaSabor> findByNome(String nome);

    // Busca as N pizzas mais baratas. Spring Data JPA infere a query.
    List<PizzaSabor> findTop3ByOrderByPrecoBaseAsc();
}
