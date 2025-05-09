package com.pizzaria.pizzaroma.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pizzaria.pizzaroma.entity.PizzaSabor;

@Repository
public interface PizzaSaborRepository extends JpaRepository<PizzaSabor, Long> {
    Optional<PizzaSabor> findByNome(String nome);
}
