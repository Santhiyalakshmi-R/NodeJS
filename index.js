const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
// create express application
var app = express();
// create bodyparser
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
// MY SQL connection
var mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345",
  database: "node_mysql_crud_db",
});

mysqlConnection.connect((err) => {
  if (err) {
    console.log("Connection failed!!!");
  } else {
    console.log("Database Connected...");
  }
});
app.get("/employees", (req, res) => {
  mysqlConnection.query("select * from employee", (error, results, fields) => {
    if (error) throw error;
    else res.send(results);
  });
});
// Retrieve user with specific id
app.get("/employees/:id", (req, res) => {
  let emp_id = req.params.id;
  if (!emp_id) {
    return res
      .status(400)
      .send({ error: true, message: "Please enter correct user id" });
  }
  mysqlConnection.query(
    "select * from employee where id=?",
    emp_id,
    (error, result, fields) => {
      if (error) throw error;
      else res.send(result[0]);
    }
  );
});
// Add new user
app.post("/employee", (req, res) => {
  let values = req.body;
  mysqlConnection.query(
    "insert into employee values (?,?,?,?,?)",
    [values.id,values.first_name,values.email,values.organization,values.designation],
    (error, results, fields) => {
      if (error) throw error;
      else res.send("New user inserted!!!");
    }
  );
});
// delete employee
app.delete("/employee", (req, res) => {
  let id = req.body.id;
  if (!id) return res.send({ error: true, message: "Id not found!!!" });
  mysqlConnection.query(
    "delete from employee where id=?",
    [id],
    (error, results, fields) => {
      if (error) throw error;
      return res.send({
        error: false,
        message: "Record deleted successfully!!!",
      });
    }
  );
});
// update employee
app.put('/employee',(req,res) => {
    let data =req.body;
    let sql = "update employee set id= ?,first_name= ?,email = ?,organization= ?,designation= ?  where id = ?";
    mysqlConnection.query(sql,[data.id,data.first_name,data.email,data.organization,data.designation,data.id],(err,results) => {
        if (!err) res.send('updated successfully..!!');
        else throw err;
    })
});
app.listen(5000, () => {
  console.log("server started...");
});
module.exports = app;
