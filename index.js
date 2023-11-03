const mysql = require("mysql2");
const inquirer = require("inquirer");
require("dotenv").config();

//dotenv variables
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

// Connection to database
async function dbConnection(select) {
  try {
    const db = await mysql.createConnection({
      host: "localhost",
      user: dbUser,
      password: dbPassword,
      database: dbName,
    });

    let receivedRowsFromDb = [];
    let receivedOutputFromInquirer = [];

    switch (select) {
      case "View All Departments":
        receivedRowsFromDb = await db.query("SELECT * FROM department");
        console.table(receivedRowsFromDb[0]);
        break;

        case "View All Roles":
          receivedRowsFromDb = await db.query(`
            SELECT
              role.id, 
              role.title,
              role.salary,
              department.name AS department
            FROM role
            JOIN department ON role.department_id = department.id`);
            console.table(receivedRowsFromDb[0]);
            break;


    }
  } catch (err) {
    console.log(err);
  }
}

