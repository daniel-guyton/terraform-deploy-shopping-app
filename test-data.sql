INSERT INTO `mydb`.`products` (`name`, `price`, `desc`)
VALUES ('blue shirt', 50, 'a basic blue shirt');

INSERT INTO `mydb`.`products` (`name`, `price`, `desc`)
VALUES ('white', 50, 'a basic white shirt');

INSERT INTO `mydb`.`cart` (`user_id`)
VALUES (2);

INSERT INTO `mydb`.`users` (`id`)
VALUES (2);

INSERT INTO `mydb`.`cart_item` (`cart_id`, `product_id`, `qty`)
VALUES (1, 1, 1);

INSERT INTO `mydb`.`cart_item` (`cart_id`, `product_id`, `qty`)
VALUES (1, 2, 2);
