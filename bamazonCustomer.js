
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

// get all product IDs, names, and prices from mysql database and log to console as a table
function startApp() {
    var queryString = 'SELECT * FROM products';
    con.query(queryString, function(err, rows) {
        if (err) throw err;
        var data = rows;
        var t = new table
        data.forEach(function(product) {
            t.cell('Product ID', product.item_id);
            t.cell('Product Name', product.product_name);
            t.cell('Product Price', product.price);
            t.newRow()
        });
        console.log(t.toString());
        menu();
    });
};

// prompt user input for product ID and quantity to purhcase
function menu() {
    inquirer.prompt([
        {
            name: 'inputID',
            type: 'input',
            message: 'Enter the ID of the product you would like to buy:',
        },
        {
            name: 'inputQuantity',
            type: 'input',
            message: 'Enter the quantity you would like to buy:'
        }
    ]).then(function(answers) {
        checkStock(parseInt(answers.inputID), parseInt(answers.inputQuantity));
    });
};

// check user-selected product stock in mysql database
function checkStock(id, quantity) {
    var queryString2 = `SELECT stock_quantity FROM products WHERE item_id = ?`;
    con.query(queryString2, [id], function(err, rows) {
        if (err) throw err;
        else if (rows[0].stock_quantity >= quantity) {
            updateStock(id, quantity);
        }
        else {
            console.log('Sorry, that item is out of stock.')
        }
    });
};

// update product stock in mysql database and log total purchase price to the console
function updateStock(id, purchase) {
    var queryString3 = `UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?;
                        SELECT price FROM products WHERE item_id = ?;
                        UPDATE products SET product_sales = product_sales + price * ? WHERE item_id = ?`;
    con.query(queryString3, [purchase, id, id, purchase, id], function(err, rows) {
        if (err) throw err;
        var cost = purchase * rows[1][0].price;
        console.log('Price: ' + cost);
    });
};