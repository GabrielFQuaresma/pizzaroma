package com.pizzaria.pizzaroma.service;

import com.pizzaria.pizzaroma.entity.PizzaSabor;
import com.pizzaria.pizzaroma.repository.PizzaSaborRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PizzaSaborService {

    private final PizzaSaborRepository pizzaSaborRepository;

    @Autowired
    public PizzaSaborService(PizzaSaborRepository pizzaSaborRepository) {
        this.pizzaSaborRepository = pizzaSaborRepository;
    }

    public List<PizzaSabor> findAll() {
        return pizzaSaborRepository.findAll();
    }

    public List<PizzaSabor> findTop3ByOrderByPrecoBaseAsc() {
        return pizzaSaborRepository.findTop3ByOrderByPrecoBaseAsc();
    }

}
