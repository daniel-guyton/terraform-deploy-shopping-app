INSERT INTO `mydb`.`products` (`name`, `price`, `desc`, `img_src`)
VALUES ('blue shirt', 50, 'a basic blue shirt', 'https://images.teemill.com/ajyua0xhzystvpg3lufrlf0pwu0wtvixe3jwtkwrcqqzwtq0.png.png?w=1080&h=auto');

INSERT INTO `mydb`.`products` (`name`, `price`, `desc`, `img_src`)
VALUES ('black shirt', 50, 'a basic white shirt', 'http://cdn.shopify.com/s/files/1/2554/7850/products/TBT2152-LT_Let-There-Be-Rock-T-Shirt_BACK_grande.png?v=1638751877');

INSERT INTO `mydb`.`cart` (`user_id`)
VALUES (2);

INSERT INTO `mydb`.`users` (`id`)
VALUES (2);

INSERT INTO `mydb`.`cart_item` (`cart_id`, `product_id`, `qty`)
VALUES (1, 1, 1);

INSERT INTO `mydb`.`cart_item` (`cart_id`, `product_id`, `qty`)
VALUES (1, 2, 2);
