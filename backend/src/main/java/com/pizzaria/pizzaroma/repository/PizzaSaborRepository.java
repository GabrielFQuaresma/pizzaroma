package com.pizzaria.pizzaroma.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pizzaria.pizzaroma.entity.PizzaSabor;

@Repository
public interface PizzaSaborRepository extends JpaRepository<PizzaSabor, Long> {
    // pode adicionar métodos personalizados se quiser, como buscar por nome
    Optional<PizzaSabor> findByNome(String nome);
}
