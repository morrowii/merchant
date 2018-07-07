
// require node modules
var mysql = require('mysql');
var inquirer = require('inquirer');
var table = require('easy-table');

// create and store mysql connection object
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: 'bamazon',
  multipleStatements: true
});

// connect to mysql database
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

startApp();

// prompt user to select menu option
function startApp() {
    inquirer.prompt([
        {
            name: 'menu',
            type: 'list',
            message: 'What would you like to do?',
            choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
        }
    ]).then(function(answers) {
        if (answers.menu === 'View Products for Sale') {
            viewProducts();
        }
        else if (answers.menu === 'View Low Inventory') {
            lowInventory();
        }
        else if (answers.menu === 'Add to Inventory') {
            addInventory();
        }
        else if (answers.menu === 'Add New Product') {
            addProduct();
        }
    });
};

// get all product IDs, names, prices, and stock from mysql database and log to console as a table
function viewProducts() {
    var queryString = 'SELECT * FROM products';
    con.query(queryString, function(err, rows) {
        if (err) throw err;
        var data = rows;
        var t = new table
        data.forEach(function(product) {
            t.cell('Product ID', product.item_id);
            t.cell('Product Name', product.product_name);
            t.cell('Product Price', product.price);
            t.cell('Product Stock', product.stock_quantity);
            t.newRow()
        });
        console.log(t.toString());
    });
};

// get all low-stock product IDs, names, and stock, then log to console as table
function lowInventory() {
    var queryString = 'SELECT * FROM products WHERE stock_quantity < 5';
    con.query(queryString, function(err, rows) {
        if (err) throw err;
        var data = rows;
        var t = new table
        data.forEach(function(product) {
            t.cell('Product ID', product.item_id);
            t.cell('Product Name', product.product_name);
            t.cell('Product Price', product.price);
            t.cell('Product Stock', product.stock_quantity);
            t.newRow()
        });
        console.log(t.toString());
    });
};

// prompt user input for product ID and quantity to add to inventory
// update mysql database
function addInventory() {
    inquirer.prompt([
        {
            name: 'id',
            type: 'input',
            message: 'Enter the ID of the product you want to stock:'
        },
        {
            name: 'quantity',
            type: 'input',
            message: 'Enter the quantity of the product you want to stock:'
        }
    ]).then(function(answers) {
        var queryString = `UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ${answers.id}`;
        con.query(queryString, [parseInt(answers.quantity)], function(err, rows) {
            if (err) throw err;
            console.log(`Added ${answers.quantity} to product ${answers.id} inventory.`);
        });
    });
};

// prompt user input for new product name, department, price, and initial quantity
// add to mysql database
function addProduct() {
    inquirer.prompt([
        {
            name: 'name',
            type: 'input',
            message: 'Enter the name of the product you want to add:'
        },
        {
            name: 'department',
            type: 'input',
            message: 'Enter the department of the product you want to add:'
        },
        {
            name: 'price',
            type: 'input',
            message: 'Enter the price of the product you want to add:'
        },
        {
            name: 'quantity',
            type: 'input',
            message: 'Enter the quantity of the product you want to add:'
        }
    ]).then(function(answers) {
        var queryString = `INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)`;
        con.query(queryString, [answers.name, answers.department, parseInt(answers.price), parseInt(answers.quantity)], function(err, rows) {
            if (err) throw err;
            console.log(`Added new product: ${answers.name}.`);
        });
    });
};