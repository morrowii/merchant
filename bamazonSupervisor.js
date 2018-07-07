
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
            choices: ['View Product Sales by Department', 'Create New Department']
        }
    ]).then(function(answers) {
        if (answers.menu === 'View Product Sales by Department') {
            viewDepartmentSales();
        }
        else if (answers.menu === 'Create New Department') {
            createDepartment();
        }
    });
};

// get summarized department sales information from mysql database and log to console as table
function viewDepartmentSales() {
    var queryString = 'SELECT departments.department_id, departments.department_name, departments.overhead_cost, SUM(products.product_sales) AS product_sales, SUM(products.product_sales) - departments.overhead_cost AS total_profit FROM products RIGHT JOIN departments ON products.department_name = departments.department_name GROUP BY department_name';
    con.query(queryString, function(err, rows) {
        if (err) throw err;
        var data = rows;
        var t = new table
        data.forEach(function(product) {
            t.cell('Department ID', product.department_id);
            t.cell('Department Name', product.department_name);
            t.cell('Overhead Cost', product.overhead_cost);
            t.cell('Product Sales', product.product_sales);
            t.cell('Total Profit', product.total_profit);
            t.newRow()
        });
        console.log(t.toString());
    });
};

// prompt user input for new department name and overhead cost
// add to mysql database
function createDepartment() {
    inquirer.prompt([
        {
            name: 'depName',
            type: 'input',
            message: 'Enter the name of the new department:',
        },
        {
            name: 'depOverhead',
            type: 'input',
            message: 'Enter the overhead cost of the new department:'
        }
    ]).then(function(answers) {
        var queryString = 'INSERT INTO departments (department_name, overhead_cost) VALUES (?, ?)';
        con.query(queryString, [answers.depName, answers.depOverhead], function(err, rows) {
            if (err) throw err;
            console.log(`${answers.depName} department added.`);
        });
    });
};