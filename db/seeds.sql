USE employees_db;

-- Inserting department names: "Greenhouse" and "Trees and Shrubs"
INSERT INTO department (name)
VALUES  ("Greenhouse"),
        ("Trees and Shrubs");

-- Inserting roles for the garden center
INSERT INTO role (title, salary, department_id)
VALUES  ("Flower Dept", 25000, 1),
        ("Annuals Dept", 25000, 1),
        ("Perennials Dept", 25000, 2),
        ("Cashier Dept", 25000, 1),
        ("Bobcat Driver", 30000, 2);

-- Inserting employees with names from my fav movie "Reservoir Dogs"
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  
    ("Mr.", "Pink", 4, null),     -- Mr. Pink does not report to anyone
    ("Mr.", "Orange", 2, 1),      -- Mr. Orange reports to Mr. White
    ("Mr.", "Blonde", 3, 1),      -- Mr. Blonde reports to Mr. White
    ("Mr.", "Blue", 5, 2),        -- Mr. Blue reports to Mr. Orange
    ("Mr.", "Brown", 5, 3),       -- Mr. Brown reports to Mr. Blonde
    ("Mr.", "White", 1, 4);       -- Mr. White reports to Mr. Pink

