var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
  host: "localhost",


  port: 3306,


  user: "root",

  password: "548237",
  database: "greatbay"
});


connection.connect(function(err) {
  if (err) throw err;
  start();
});


function start()
{
  inquirer
    .prompt({
      name: "choice",
      type: "list",
      message: "What would you like to do?",
      choices: ["View All Products", "View Low Inventory Products", "Add Items to Inventory","Add a New Product","Exit"]
    })
    .then(function(answer) {
      
      if (answer.choice === "View All Products") {
        view();
      }
      else if(answer.choice === "View Low Inventory Products") {
        lowInv();
      } 
      else if(answer.choice === "Add Items to Inventory") {
        addStock();
      }
      else if(answer.choice === "Add a New Product")
      {
        addProd();
      }
      else{
        connection.end();
      }
    });
}

function view() {
  connection.query("SELECT * FROM products", function(err, results) 
  {
      if(err) throw err;
          for(let a of results)
          {
              console.log("___________________________________________");
              console.log("Item ID: "+a.item_id);
              console.log("Product Name: "+a.product_name);
              console.log("Department: "+a.department_name);
              console.log("Price: "+a.price);
              console.log("Quantity: "+a.stock_quantity);
              console.log("___________________________________________");
          }
          start();

  });

}

function lowInv()
{
  connection.query("SELECT * FROM products where stock_quantity < 5", function(err, results) 
  {
      if(err) throw err;
          if(results.length === 0)
          {
            console.log("All Items Above 5 in Stock!");
          }
          else{
            for(let a of results)
            {
                console.log("___________________________________________");
                console.log("Item ID: "+a.item_id);
                console.log("Product Name: "+a.product_name);
                console.log("Department: "+a.department_name);
                console.log("Price: "+a.price);
                console.log("Quantity: "+a.stock_quantity);
                console.log("___________________________________________");
            }
        }
          start();

  });
}


function addStock()
{
  inquirer.prompt([
    {
      name: "id",
      type: "prompt",
      message: "Which item ID would you like to add inventory to?"
    },{
      name: "num",
      type: "prompt",
      message: "How Many would you like to add?"
    }
  ]).then(function(answer) {
   var itemID = parseInt(answer.id);
    connection.query(
      "UPDATE products SET stock_quantity = stock_quantity+"+parseInt(answer.num)+" WHERE ?",
      [
        {
          item_id: itemID
        }
      ],
      function(error) {
        if (error) throw error;
        console.log("Order placed successfully!");
        start();
      }
    );
  });
}

  function addProd()
  {
    inquirer.prompt([
      {
        name: "name",
        type: "prompt",
        message: "What is the name of the product?"
      },{
        name: "dept",
        type: "prompt",
        message: "What is the department name?"
      },{
        name: "price",
        type: "prompt",
        message: "What is the price per unit?"
      },{
        name: "stock",
        type: "prompt",
        message: "How many should we stock?"
      }
    ]).then(function(answer) {
        var name = answer.name;
        var dept = answer.dept;
        var price = answer.price;
        var stock = answer.stock;
        connection.query(
          "INSERT INTO products SET ?",
            {
              product_name:name,department_name:dept,price:price,stock_quantity:stock
            },
          function(error) {
            if (error) throw error;
            console.log("Item added successfully!");
            start();
          }
        );
    });
  }
