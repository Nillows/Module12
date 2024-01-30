// Import necessary modules
require(`dotenv`).config();
const inquirer = require(`inquirer`);
const mysql = require(`mysql2`);
const myFunctions = require(`./functions.js`);

// Create a single database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,       // Hostname for the database server.
    user: process.env.DB_USER,       // Username for connecting to the database.
    password: process.env.DB_PASSWORD, // Password for the database user.
    database: `employees_db`         // Default database to use once connected.
}, console.log(`Connected to employees_db database`));

// Initialize the application
const init = () => {
    inquirer.prompt([{
        type: `list`,
        message: `Select an Option`,
        name: `init`,
        choices: [
            `View All Employees`,
            `Search Employees By`,
            `Add an Employee`,
            `Update an Employee Role`,
            `Update Employee Manager`,
            `Remove an Employee`,
            `View All Roles`,
            `Add New Role`,
            `Delete Role`,
            `View All Departments`,
            `Add New Department`,
            `Remove Department`,
            `Budget Info`,
            `Save and Exit`
        ]
    }]).then((response) => {
        switch (response.init) {
            case `View All Employees`:
                selectAllEmployee();
                break;
            case `Search Employees By`:
                searchEmployeesBy();
                break;
            case `Add an Employee`:
                addEmployee();
                break;
            case `Update an Employee Role`:
                updateEmployeeRole();
                break;
            case `Update Employee Manager`:
                updateEmployeeManager();
                break;
            case `Remove an Employee`:
                removeEmployee();
                break;
            case `View All Roles`:
                selectAllRole();
                break;
            case `Add New Role`:
                addRole();
                break;
            case `Delete Role`:
                removeRole();
                break;
            case `View All Departments`:
                selectAll(`department`);
                break;
            case `Add New Department`:
                addDepartment();
                break;
            case `Remove Department`: 
                removeDepartment();
                break;
            case `Budget Info`:
                budgetInfo();
                break;
            case `Save and Exit`:
                db.end(); // Close the database connection
                process.exit(0);
        }
    }).catch((error) => {
        console.error(error);
    });
};


// Function to add a new department
function addDepartment() {
    inquirer.prompt([{
        type: `input`,
        message: `What is the name of this new department?`,
        name: `department`
    }]).then((response) => {
        myFunctions.insertDepartment(db, response.department);
        console.log(`\n${response.department} added as a new department!\n`);
        init();
    });
}

function removeDepartment() {
    db.query(`SELECT id, name FROM department`, (err, departments) => {
        if (err) {
            console.error(err);
            return;
        }

        inquirer.prompt([
            {
                type: 'list',
                name: 'departmentId',
                message: 'Which department would you like to delete?',
                choices: departments.map(dept => ({ name: dept.name, value: dept.id }))
            }
        ]).then(({ departmentId }) => {
            myFunctions.deleteDepartment(db, departmentId);
            console.log(`\nDepartment with ID ${departmentId} has been removed!\n`);
            init();
        });
    });
}




// Function to add a new employee.
function addEmployee() {
    // Fetch roles from the database
    db.query(`SELECT id, title FROM role`, (err, roles) => {
        if (err) {
            console.error(err);
            return;
        }

        // Create choices for roles
        const roleChoices = roles.map(role => ({ name: role.title, value: role.id }));

        // Fetch employees from the database to list as potential managers
        db.query(`SELECT id, first_name, last_name FROM employee`, (err, employees) => {
            if (err) {
                console.error(err);
                return;
            }

            // Create choices for managers, including an option for no manager
            const managerChoices = employees.map(emp => ({
                name: `${emp.first_name} ${emp.last_name}`,
                value: emp.id
            }));
            managerChoices.unshift({ name: "No Manager", value: null });

            // Proceed with prompting for employee details
            inquirer.prompt([
                {
                    type: `input`,
                    message: `What is the first name of our new Employee?`,
                    name: `firstName`
                },
                {
                    type: `input`,
                    message: `What is the last name of our new Employee?`,
                    name: `lastName`
                },
                {
                    type: `list`,
                    message: `What is the role of our Employee?`,
                    name: `roleId`,
                    choices: roleChoices
                },
                {
                    type: `list`,
                    message: `Who is the manager of the new Employee?`,
                    name: `managerId`,
                    choices: managerChoices
                }
            ])
            .then((response) => {
                // Insert the new employee into the database
                myFunctions.insertEmployee(db, response.firstName, response.lastName, response.roleId, response.managerId);
                console.log(`\n${response.firstName} ${response.lastName} added as a new employee!\n`);
                init();
            });
        });
    });
}

function removeEmployee() {
    db.query(`SELECT id, first_name, last_name FROM employee`, (err, employees) => {
        if (err) {
            console.error(`Error fetching employees: ${err.message}`);
            return;
        }

        inquirer.prompt([
            {
                type: 'list',
                name: 'employeeId',
                message: 'Which employee would you like to delete?',
                choices: employees.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }))
            }
        ]).then(({ employeeId }) => {
            myFunctions.deleteEmployee(db, employeeId);
            init();
        }).catch(err => console.error(`Error during employee deletion: ${err.message}`));
    });
}

// Function to add a new role.
function addRole() {
    // Fetch departments from the database
    db.query(`SELECT id, name FROM department`, (err, departments) => {
        if (err) {
            console.error(err);
            return;
        }

        // Create choices for departments
        const departmentChoices = departments.map(dept => ({ name: dept.name, value: dept.id }));

        // Proceed with prompting for role details
        inquirer.prompt([
            {
                type: `input`,
                message: `What is the title of the new role?`,
                name: `title`
            },
            {
                type: `input`,
                message: `What is the yearly salary of the new role?`,
                name: `salary`
            },
            {
                type: `list`,
                message: `Which department does this role belong to?`,
                name: `departmentId`,
                choices: departmentChoices  // Display the list of departments to choose from
            }
        ])
        .then((response) => {
            // Insert the new role into the database
            myFunctions.insertRole(db, response.title, response.salary, response.departmentId);
            console.log(`\n${response.title} added as a new role in department ID ${response.departmentId}!\n`);
            init();
        });
    });
}

function removeRole() {
    db.query(`SELECT id, title FROM role`, (err, roles) => {
        if (err) {
            console.error(`Error fetching roles: ${err.message}`);
            return;
        }

        inquirer.prompt([
            {
                type: 'list',
                name: 'roleId',
                message: 'Which role would you like to delete?',
                choices: roles.map(role => ({ name: role.title, value: role.id }))
            }
        ]).then(({ roleId }) => {
            myFunctions.deleteRole(db, roleId);
            init();
        }).catch(err => console.error(`Error during role deletion: ${err.message}`));
    });
}

// Function to select all records from a given table.
function selectAll(tableName) {
    db.query(`SELECT * FROM ${tableName}`, (err, results) => {
        if (err) {
            console.error(err);
        } else {
            console.log(`\n`);
            console.table(results);
            init();
        }
    });
}

// Function to select all employee records with additional details.
function selectAllEmployee() {
    const query = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
                   FROM employee e
                   LEFT JOIN role r ON e.role_id = r.id
                   LEFT JOIN department d ON r.department_id = d.id
                   LEFT JOIN employee m ON e.manager_id = m.id`;

    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
        } else {
            console.log(`\n`);
            console.table(results);
            init();
        }
    });
}

// Function to select all role records with department details.
function selectAllRole() {
    const query = `SELECT r.id, r.title, r.salary, d.name AS department
                   FROM role r
                   LEFT JOIN department d ON r.department_id = d.id`;

    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
        } else {
            console.log(`\n`);
            console.table(results);
            init();
        }
    });
}

// Function to update an employee's role.
function updateEmployeeRole() {
    // First, get a list of employees
    db.query(`SELECT id, first_name, last_name FROM employee`, (err, employees) => {
        if (err) {
            console.error(err);
            return;
        }
        const employeeChoices = employees.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }));

        // Then, get a list of roles
        db.query(`SELECT id, title FROM role`, (err, roles) => {
            if (err) {
                console.error(err);
                return;
            }
            const roleChoices = roles.map(role => ({ name: role.title, value: role.id }));

            // Ask the user to choose an employee and a new role
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employeeId',
                    message: 'Which employee\'s role do you want to update?',
                    choices: employeeChoices
                },
                {
                    type: 'list',
                    name: 'roleId',
                    message: 'Which role do you want to assign to the selected employee?',
                    choices: roleChoices
                }
            ]).then(answers => {
                // Update the employee's role
                myFunctions.updateRole(db, answers.roleId, answers.employeeId);
                console.log('Employee role updated successfully.');
                init();
            });
        });
    });
}

function updateEmployeeManager() {
    db.query(`SELECT id, first_name, last_name FROM employee`, (err, employees) => {
        if (err) {
            console.error(`Error fetching employees: ${err.message}`);
            return;
        }

        const userChoices = employees.map(emp => ({
            name: `${emp.first_name} ${emp.last_name}`,
            value: emp.id
        }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'employeeId',
                message: 'Select the employee whose manager you want to update:',
                choices: userChoices
            },
            {
                type: 'list',
                name: 'managerId',
                message: 'Select the new manager for the employee:',
                choices: userChoices
            }
        ]).then(({ employeeId, managerId }) => {
            if (employeeId === managerId) {
                console.log("An employee cannot be their own manager.");
                init();
                return;
            }
            myFunctions.updateEmployeeManager(db, employeeId, managerId);
            init();
        }).catch(err => console.error(`Error during employee manager update: ${err.message}`));
    });
}

function searchEmployeesBy() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'searchBy',
            message: 'Search employees by:',
            choices: ['Department', 'Role', 'Manager']
        }
    ]).then(({ searchBy }) => {
        switch (searchBy) {
            case 'Department':
                searchEmployeesByDepartment();
                break;
            case 'Role':
                searchEmployeesByRole();
                break;
            case 'Manager':
                searchEmployeesByManager();
                break;
        }
    });
}

function searchEmployeesByDepartment() {
    db.query(`SELECT id, name FROM department`, (err, departments) => {
        if (err) {
            console.error(err);
            return;
        }
        inquirer.prompt([
            {
                type: 'list',
                name: 'departmentId',
                message: 'Select a department:',
                choices: departments.map(dept => ({ name: dept.name, value: dept.id }))
            }
        ]).then(({ departmentId }) => {
            myFunctions.searchByDepartment(db, departmentId);
            init();
        });
    });
}

function searchEmployeesByRole() {
    db.query(`SELECT id, title FROM role`, (err, roles) => {
        if (err) {
            console.error(err);
            return;
        }
        inquirer.prompt([
            {
                type: 'list',
                name: 'roleId',
                message: 'Select a role:',
                choices: roles.map(role => ({ name: role.title, value: role.id }))
            }
        ]).then(({ roleId }) => {
            myFunctions.searchByRole(db, roleId);
            init();
        });
    });
}

function searchEmployeesByManager() {
    db.query(`SELECT id, first_name, last_name FROM employee`, (err, managers) => {
        if (err) {
            console.error(err);
            return;
        }
        inquirer.prompt([
            {
                type: 'list',
                name: 'managerId',
                message: 'Select a manager:',
                choices: managers.map(manager => ({ name: `${manager.first_name} ${manager.last_name}`, value: manager.id }))
            }
        ]).then(({ managerId }) => {
            myFunctions.searchByManager(db, managerId);
            init();
        });
    });
}

function budgetInfo() {
    // Fetch the list of departments
    db.query(`SELECT id, name FROM department`, (err, departments) => {
        if (err) {
            console.error(err);
            return;
        }

        // Prompt user to select a department
        inquirer.prompt([
            {
                type: 'list',
                name: 'departmentId',
                message: 'Select a department to view its budget:',
                choices: departments.map(dept => ({ name: dept.name, value: dept.id }))
            }
        ]).then(({ departmentId }) => {
            // Calculate the total budget for the selected department
            const query = `SELECT d.name as department_name, COUNT(e.id) as num_employees, SUM(r.salary) as total_salary
                           FROM employee e
                           JOIN role r ON e.role_id = r.id
                           JOIN department d ON r.department_id = d.id
                           WHERE d.id = ?
                           GROUP BY d.name`;
            db.query(query, departmentId, (err, results) => {
                if (err) {
                    console.error(err);
                } else if (results.length > 0) {
                    const departmentBudget = results[0];
                    console.log(`\n\nThe ${departmentBudget.department_name} total budget is $${departmentBudget.total_salary.toLocaleString()} across ${departmentBudget.num_employees} employees!\n\n`);
                } else {
                    console.log('No employees found in this department.');
                }
                init();
            });
        });
    });
}

init(); // Initialize the application.
