var mysql = require("mysql");
var inquirer = require("inquirer");
var id;
var num;
var connection = mysql.createConnection({
  host: "localhost",


  port: 3306,


  user: "root",

  password: "548237Dho",
  database: "bamazon"
});


connection.connect(function(err) {
  if (err) throw err;
  start();
});

function start() {
    connection.query("SELECT * FROM products", function(err, results) 
    {
        if(err) throw err;
            for(let a of results)
            {
                console.log("Item ID: "+a.item_id);
                console.log("Product Name: "+a.product_name);
                console.log("Department: "+a.department_name);
                console.log("Price: "+a.price);
                console.log("Quantity: "+a.stock_quantity);
                console.log("___________________________________________");
            }
            prompter();

    });

}

function prompter()
{
  inquirer.prompt([
    {
      name: "id",
      type: "prompt",
      message: "Which item ID would you like to buy?"
    },{
      name: "num",
      type: "prompt",
      message: "How Many would you like to buy?"
    }
  ]).then(function(answer) {
      id = answer.id;
      num = answer.num;
      buyItem();
  });
}

function buyItem() {
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    var chosenItem;
    for (let a of results) 
        {
            if (a.item_id = id) 
            {
                chosenItem = a;
            }
        }

        if (chosenItem.stock_quantity >= num) 
        {
          var final = chosenItem.stock_quantity - num;
          console.log("item count: " + chosenItem.stock_quantity);
          console.log("User choice: "+num);
          console.log(final);
          connection.query(
            "UPDATE products SET ? WHERE ?",
            [
              {
                stock_quantity: final
              },
              {
                item_id: id
              }
            ],
            function(error) {
              if (error) throw err;
              console.log("Order placed successfully!");
              console.log("Total Cost: " +chosenItem.price * num);
              start();
            }
          );
        }
        else {
          console.log("You tried to buy too many. Try again...");
          start();
        }
      });
  };

