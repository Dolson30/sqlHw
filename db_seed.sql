create database greatbay;
 use greatbay;
create table products
(
	item_id integer auto_increment not null primary key,
    product_name varchar(30) not null,
    department_name varchar(30) not null,
    price integer not null,
    stock_quantity integer not null
    
    
);