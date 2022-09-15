DROP TABLE IF EXISTS `mydb`.`cart`;
DROP TABLE IF EXISTS `mydb`.`products`;

CREATE TABLE `mydb`.`cart` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `product_id` INT NULL,
  `quantity` INT NULL,
  `created_at` DATETIME,
  PRIMARY KEY(`id`));

CREATE TABLE `mydb`.`products` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  `desc` TEXT NULL,
  `price` INT NULL,
  `created_at` DATETIME,
PRIMARY KEY (`id`));



