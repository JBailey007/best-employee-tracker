INSERT INTO department (department_name)
VALUES ("Engineering"),
        ("Finance"),
        ("Interconnected"),
        ("Sales"),
        ("Legal");


INSERT INTO role (title, salary, department_id)
VALUES ("Engineering Manager", 120000, 1),
        ("Engineering Lead", 100000, 1),
        ("Staff Engineer", 80000, 1),
        ("Finance Manager", 85000, 2),
        ("Accountant", 70000, 2),
        ("Brand Advocate Manager", 95000, 3),
        ("Brand Advocate Sr. Analyst", 82000, 3),
        ("Brand Advocate Analyst", 70000, 3),
        ("Sales Manager", 75000, 4),
        ("Salesperson", 65000, 4),
        ("Legal Manager", 110000, 5),
        ("Lawyer", 95000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("Molly", "Say",  1, NULL),
        ("Carry", "Doe",  2, 1),
        ("Janet", "Doe",  3, 1), 
        ("Jennifer", "Doe",  4, NULL), 
        ("Julia", "Doe",  5, 4),
        ("Jaya", "Dane",  6, NULL), 
        ("Hally", "Dave",  7, 6), 
        ("Juniper", "Daze",  8, 6), 
        ("Jin", "Dai",  9, NULL), 
        ("Jopeoeun", "Dai",  10, 9), 
        ("Jocelyn", "Days",  11, NULL), 
        ("Jalia", "Daos",  12, 11);