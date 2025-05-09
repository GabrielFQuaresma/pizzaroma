package com.pizzaria.pizzaroma.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pizzaria.pizzaroma.repository.PedidoRepository;
import com.pizzaria.pizzaroma.dto.AtualizarStatusRequest;
import com.pizzaria.pizzaroma.entity.Pedido;
import com.pizzaria.pizzaroma.entity.StatusPedido;

import java.util.List;

@RestController
@RequestMapping("/gerenciar-pedidos")
@PreAuthorize("hasAnyRole('FUNCIONARIO', 'ADMIN')")
public class GerenciarPedidoController {

    private final PedidoRepository pedidoRepository;

    public GerenciarPedidoController(PedidoRepository pedidoRepository) {
        this.pedidoRepository = pedidoRepository;
    }

    @GetMapping("/ativos")
    public ResponseEntity<List<Pedido>> listarPedidosAtivos() {
        List<Pedido> pedidos = pedidoRepository.findByStatusIn(
            List.of(StatusPedido.PREPARANDO, StatusPedido.SAIU_PARA_ENTREGA)
        );
        return ResponseEntity.ok(pedidos);
    }

    @PutMapping("/atualizar-status")
    public ResponseEntity<?> atualizarStatus(@RequestBody AtualizarStatusRequest request) {
        Pedido pedido = pedidoRepository.findById(request.getPedidoId())
            .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        pedido.setStatus(request.getNovoStatus());
        pedidoRepository.save(pedido);

        return ResponseEntity.ok("Status atualizado com sucesso!");
    }
}

