CREATE TABLE `Cliente` (
  `id_cliente` int PRIMARY KEY AUTO_INCREMENT,
  `nome` varchar(255),
  `email` varchar(255),
  `senha` varchar(255),
  `telefone` varchar(255),
  `endereco` varchar(255)
);

CREATE TABLE `Funcionario` (
  `id_funcionario` int PRIMARY KEY AUTO_INCREMENT,
  `nome` varchar(255),
  `email` varchar(255),
  `senha` varchar(255)
);

CREATE TABLE `Administrador` (
  `id_admin` int PRIMARY KEY AUTO_INCREMENT,
  `nome` varchar(255),
  `email` varchar(255),
  `senha` varchar(255)
);

CREATE TABLE `Produto` (
  `id_produto` int PRIMARY KEY AUTO_INCREMENT,
  `nome` varchar(255),
  `descricao` varchar(255),
  `preco` decimal,
  `tipo` varchar(255)
);

CREATE TABLE `Pedido` (
  `id_pedido` int PRIMARY KEY AUTO_INCREMENT,
  `id_cliente` int,
  `data_hora` datetime,
  `status` varchar(255)
);

CREATE TABLE `ItemPedido` (
  `id_item` int PRIMARY KEY AUTO_INCREMENT,
  `id_pedido` int,
  `id_produto` int,
  `quantidade` int,
  `subtotal` decimal
);

CREATE TABLE `Pagamento` (
  `id_pagamento` int PRIMARY KEY AUTO_INCREMENT,
  `id_pedido` int,
  `metodo` varchar(255),
  `status_pagamento` varchar(255),
  `valor_total` decimal
);

ALTER TABLE `Pedido` ADD FOREIGN KEY (`id_cliente`) REFERENCES `Cliente` (`id_cliente`);

ALTER TABLE `ItemPedido` ADD FOREIGN KEY (`id_pedido`) REFERENCES `Pedido` (`id_pedido`);

ALTER TABLE `ItemPedido` ADD FOREIGN KEY (`id_produto`) REFERENCES `Produto` (`id_produto`);

ALTER TABLE `Pagamento` ADD FOREIGN KEY (`id_pedido`) REFERENCES `Pedido` (`id_pedido`);
