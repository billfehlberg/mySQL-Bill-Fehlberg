var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Karla*001",  
  database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

// function which prompts the user for what action they should take
function start()    {
  connection.query("SELECT item_id,product_name,price FROM products", function(err, results)   {
     if (err) throw err;   
      console.table(results);

      inquirer
          .prompt([
            {
              name: "product",
              type: "input",
              message: "Please input item_ID:"
            },
          {
            name: "quantity",
            type: "input",
            message: "Please input quantity to purchase:"
          }        
        ])
        .then(function(answer) {
          var quantity = parseInt(answer.quantity);
          console.log(quantity);
          connection.query("SELECT item_id,price,stock_quantity,product_name FROM products WHERE ?", [
            {item_id: answer.product}
          ], function(err, res)   {
            if (err) {
              throw err;
            }
            console.log(res);
            console.log(parseInt(res[0].stock_quantity));
            if (parseInt(res[0].stock_quantity) >= quantity) {
            connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: (res[0].stock_quantity - quantity)}, 
               {item_id: res[0].item_id}
             ], function (err, result) {
              if (err) {
                throw err;
              }
              {
              console.log("Your purchase of" + res[0].product_name + "for $" + quantity * res[0].price + "has processed"); 
            }
             {
               else {
                 console.log("Sorry, item out of stock");
               }
              }
              start();
            })
          }
        })
      })
    })
  }
