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

//switch for all user input
    switch (select) {
      case "View All Departments":
        receivedRowsFromDb = await db.query("SELECT * FROM department");
        console.table(receivedRowsFromDb[0]);
        break;
//information regarding the roles
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
//information regarding the employees 
      case "View All Employees":
        receivedRowsFromDb = await db.query(`
              SELECT
                employee.id, 
                employee.first_name
                employee.last_name, 
                role.title AS title, 
                department.name AS department,
                role.salary AS salary
                CASE WHEN employee.manager_id IS NOT NULL THEN CONCAT(manager_table.first_name, ' ', manager_table.last_name) ELSE NULL END AS manager
                FROM employee
                JOIN role ON employee.role_id = role.id
                JOIN department ON role.department_id = department.id
                JOIN employee manager_table ON employee.manager_id = manager_table.id`);
        console.table(receivedRowsFromDb[0]);
        break;
//adding a department using inquirer prompt
      case "Add a Department":
        receivedOutputFromInquirer = await inquirer.prompt([
          {
            name: "department",
            message: "Enter New Department Name: ",
          },
        ]);

        try {
          receivedRowsFromDb = await db.query(
            `INSERT INTO department (name) VALUES ('${receivedOutputFromInquirer.department}');`
          );
        } catch (error) {
          console.log("Duplicate Department");
        }
        break;
//adding a role using inquirer prompt
      case "Add a Role":
        receivedOutputFromInquirer = await inquirer.prompt([
          {
            name: "roleName",
            message: "Please Enter New Role:",
          },
          {
            name: "roleSalary",
            message: "Please Enter New Role Salary:",
          },
          {
            name: "roleDepartment",
            message: "Please Enter New Role Department:",
          },
        ]);
//Destructured output from inquirer so that we can store the values.        
      const { roleName, roleSalary, roleDepartment } = receivedOutputFromInquirer;

      const returnDptId = await db.query(
        `SELECT IFNULL((SELECT id FROM department WHERE name = "${roleDepartment}"), "Department does not exist")`
      );

      const [rows] = returnDptId;
      const department_id = Object.values(rows[0])[0];

      if (department_id === "Department does not exist") {
        console.log("Enter a Role in a created department!");
        break;
      }

    }
  } catch (err) {
    console.log(err);
  }
}
