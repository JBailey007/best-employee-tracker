const mysql = require("mysql2");
const inquirer = require("inquirer");
require("dotenv").config();

//dotenv variables
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

// Connection to database
const db = mysql.createConnection(
  {
    host: "localhost",
    user: dbUser,
    password: dbPassword,
    database: dbName,
  },
  console.log(`Connected to the ${dbName} database.`)
);