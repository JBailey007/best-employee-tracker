USE company_db;

INSERT INTO department (name)
VALUES ("Engineering"),
       ("Finance"),
       ("Legal"),
       ("Sales");


INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 100000, 1),
       ("Lead Engineer", 150000, 2),
       ("Software Engineer", 120000, 3),
       ("Accountant", 125000, 4),
       ("Legal Team Lead", 250000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 1, 3),
       ("Nolan", "Park", 2, 1),
       ("Carter", "Matheson", 3, 3),
       ("Kyle", "Rind", 4, null),
       ("Ashley", "Bailey", 5, 2),
       ("Susan", "Styles", 2, 3),
       ("Alex", "Haubner", 4, 7),
       ("Eric", "Cooper", 4, 2);