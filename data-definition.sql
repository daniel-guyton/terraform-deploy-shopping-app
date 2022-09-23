DROP TABLE IF EXISTS `mydb`.`cart`;
DROP TABLE IF EXISTS `mydb`.`products`;
DROP TABLE IF EXISTS `mydb`.`cart_item`;
DROP TABLE IF EXISTS `mydb`.`users`;

CREATE TABLE `mydb`.`users`(
`id` INT
);

CREATE TABLE `mydb`.`cart` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `mydb`.`products` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `img_src` TEXT,
  `name` VARCHAR(45) NULL,
  `desc` TEXT NULL,
  `price` INT NULL,
  `created_at` DATETIME,
  PRIMARY KEY (`id`)
);

CREATE TABLE `mydb`.`cart_item`(
  `product_id` INT NOT NULL,
  `cart_id` INT,
  `qty` INT,
  PRIMARY KEY (`product_id`)
);

