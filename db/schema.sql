-- Drop the existing database if it exists to start fresh
DROP DATABASE IF EXISTS employees_db;

-- Create a new database for storing employee information
CREATE DATABASE employees_db;

-- Select the newly created database for subsequent operations
USE employees_db;

-- Create a table to store department information
-- Each department has a unique ID and a name
CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,  -- Unique identifier for each department
    name VARCHAR(30)                            -- Name of the department
);

-- Create a table to store role information
-- Each role has a unique ID, title, salary, and is associated with a department
CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,  -- Unique identifier for each role
    title VARCHAR(30),                          -- Title of the role
    salary DECIMAL(10, 2) DEFAULT NULL,          -- Salary for the role
    department_id INT,                          -- Reference to associated department
    FOREIGN KEY (department_id) REFERENCES department(id)  -- Foreign key to department table
    ON DELETE SET NULL                          -- Set to NULL if the referenced department is deleted
);

-- Create a table to store employee information
-- Each employee has an ID, first name, last name, role, and an optional manager
CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,  -- Unique identifier for each employee
    first_name VARCHAR(30),                      -- First name of the employee
    last_name VARCHAR(30),                       -- Last name of the employee
    role_id INT,                                 -- Reference to the employee's role
    manager_id INT DEFAULT NULL,                 -- Reference to the employee's manager (optional)
    FOREIGN KEY (role_id) REFERENCES role(id)    -- Foreign key to role table
    ON DELETE SET NULL,                          -- Set to NULL if the referenced role is deleted
    FOREIGN KEY (manager_id) REFERENCES employee(id)  -- Foreign key to another employee who is the manager
    ON DELETE SET NULL                           -- Set to NULL if the referenced manager is deleted
);
