package com.pizzaria.pizzaroma.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pizzaria.pizzaroma.dto.CriarPedidoRequest;
import com.pizzaria.pizzaroma.dto.ItemPedidoRequest;
import com.pizzaria.pizzaroma.entity.Cliente;
import com.pizzaria.pizzaroma.entity.ItemPedido;
import com.pizzaria.pizzaroma.entity.Pedido;
import com.pizzaria.pizzaroma.entity.PizzaSabor;
import com.pizzaria.pizzaroma.entity.Cliente;
import com.pizzaria.pizzaroma.repository.PedidoRepository;
import com.pizzaria.pizzaroma.repository.PizzaSaborRepository;
import com.pizzaria.pizzaroma.security.JwtService;
import com.pizzaria.pizzaroma.repository.ClienteRepository;

@RestController
@RequestMapping("/pedido")
public class PedidoController {

    private final PedidoRepository pedidoRepository;
    private final ClienteRepository clienteRepository;
    
    @Autowired
    private final PizzaSaborRepository saborRepository;
    
    private final JwtService jwtService;


    public PedidoController(PedidoRepository pedidoRepository, ClienteRepository clienteRepository,
                            PizzaSaborRepository saborRepository, JwtService jwtService) {
        this.pedidoRepository = pedidoRepository;
        this.clienteRepository = clienteRepository;
        this.saborRepository = saborRepository;
        this.jwtService = jwtService;
    }

    @PostMapping("/criar")
    public ResponseEntity<?> criarPedido(@RequestBody CriarPedidoRequest request,
                                         @RequestHeader("Authorization") String token) {
        String email = jwtService.extractEmailFromToken(token);
        Cliente cliente = clienteRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        pedido.setData(LocalDateTime.now());

        for (ItemPedidoRequest itemDto : request.getItens()) {
            PizzaSabor sabor = saborRepository.findById(itemDto.getIdSabor())
                .orElseThrow(() -> new RuntimeException("Sabor inválido"));

            ItemPedido item = new ItemPedido();
            item.setSabor(sabor);
            item.setTamanho(itemDto.getTamanho());
            item.setBorda(itemDto.getBorda());
            item.setObservacoes(itemDto.getObservacoes());
            item.setPedido(pedido);

            pedido.getItens().add(item);
        }

        pedidoRepository.save(pedido);
        return ResponseEntity.ok("Pedido criado com sucesso!");
    }
}

