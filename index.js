const mysql = require("mysql2/promise");
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
                employee.first_name,
                employee.last_name, 
                role.title AS title, 
                department.name AS department,
                role.salary AS salary,
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
        const { roleName, roleSalary, roleDepartment } =
          receivedOutputFromInquirer;

        const returnDptId = await db.query(
          `SELECT IFNULL((SELECT id FROM department WHERE name = "${roleDepartment}"), "Department does not exist")`
        );

        const [rows] = returnDptId;
        const department_id = Object.values(rows[0])[0];

        if (department_id === "Department does not exist") {
          console.log("Enter a Role in a created department!");
          break;
        }

        receivedRowsFromDb = await db.query(
          `INSERT INTO role (title, salary, department_id) VALUES ('${roleName}', '${roleSalary}', '${department_id}');`
        );

        break;
      //Adding an employee, inquirer and db queries
      case "Add an Employee":
        receivedOutputFromInquirer = await inquirer.prompt([
          {
            name: "first_name",
            message: "Enter Employees First Name:",
          },
          {
            name: "last_name",
            message: "Enter Employees Last Name:",
          },
          {
            name: "role",
            message: "Enter Employees Role:",
          },
          {
            name: "manager",
            message: "Enter Employees Manager:",
          },
        ]);

        const allRoles = await db.query("select * from role;");

        const allManagers = await db.query(
          "select * from employee where manager_id is null;"
        );

        const { first_name, last_name, role, manager } =
          receivedOutputFromInquirer;

        const role_data = allRoles[0].filter((r) => {
          return r.title === role;
        });

        const manager_data = allManagers[0].filter((m) => {
          return `${m.first_name} ${m.last_name}` === manager;
        });

        
        
        
        
        
        
        returnedRowsFromDb = await db.query(
          `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${first_name}', '${last_name}', ${role_data[0].id}, ${manager_data[0].id})`
        );

        break;
      //updating employee roles
      case "Update Employee Role":
        currentEmployees = await db.query(`
          SELECT id, first_name, last_name FROM employee;`);

        currentRoles = await db.query(`
          SELECT id, title FROM role;`);

        const employeeList = currentEmployees[0].map((employee) => {
          return {
            name: `${employee["first_name"]} ${employee.last_name}`,
            value: employee.id,
          };
        });

        const roleList = currentRoles[0].map((role) => {
          return {
            name: role.title,
            value: role.id,
          };
        });

        receivedOutputFromInquirer = await inquirer.prompt([
          {
            type: "list",
            name: "employeeId",
            message: "Choose an Employee to Update:",
            choices: employeeList,
          },
          {
            type: "list",
            name: "NewRole",
            message: "Please choose Employees new Role:",
            choices: roleList,
          },
        ]);

        console.log(receivedOutputFromInquirer);

        receivedRowsFromDb = await db.query(`
          UPDATE employee
          SET role_id = ${receivedOutputFromInquirer.newRole}
          WHERE employee.id = ${receivedOutputFromInquirer.employeeId};`);

        break;
    }
  } catch (err) {
    console.log(err);
  }
}

function userPrompt() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "select",
        message: "What would you like to do?",
        choices: [
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Add a Department",
          "Add a Role",
          "Add an Employee",
          "Update an Employee Role",
          "Quit",
        ],
      },
    ])
    .then(async (res) => {
      await dbConnection(res.select);
      res.select === "Quit" ? process.exit() : userPrompt();
    })
    .catch((err) => {
      if (error.isTtyError) {
      } else {
        err;
      }
    });
}

userPrompt();
