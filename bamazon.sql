CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	item_id int NOT NULL auto_increment,
    primary key (item_id),
	product_name varchar(255) NOT NULL,
    department_name varchar(255) NOT NULL,
    price varchar(255) NOT NULL,
	stock_quantity int NOT NULL
);

INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES 
('Healing Potion', 'Alchemist', 1, 10),
('Mana Potion', 'Alchemist', 1, 10),
('Precision Longbow', 'Woodworker', 24, 1),
('20 Adamantine Arrows', 'Fletcher', 2, 5),
('Humming Longsword', 'Blacksmith', 15, 1),
('Radiant Shield', 'Blacksmith', 12, 1),
('Whispering Dagger', 'Blacksmith', 13, 2),
('Quaking Greataxe', 'Blacksmith', 26, 1),
('Scroll of Warding', 'Enchanter', 5, 2),
('Scroll of Flamestrike', 'Enchanter', 4, 3);

CREATE TABLE departments (
	department_id int NOT NULL auto_increment,
    primary key (department_id),
    department_name varchar(255) NOT NULL,
    overhead_cost varchar(255) NOT NULL
);

INSERT INTO departments (department_name, overhead_cost) VALUES 
('Alchemist', 10),
('Woodworker', 11),
('Fletcher', 12),
('Blacksmith', 13),
('Enchanter', 14);

ALTER TABLE products ADD product_sales int NOT NULL;