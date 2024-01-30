// Function to insert a new department into the 'department' table.
function insertDepartment(db, name) {
    db.query(`INSERT INTO department (name) VALUES ("${name}")`, (err, results) => {
        if (err) {
            console.log(err); // Log any errors that occur during the query execution.
        } else {
            console.log(`Department ${name} added successfully.`);
            // Handle successful query execution if needed.
        }
    });
}

// Function to insert a new employee into the 'employee' table.
function insertEmployee(db, firstName, lastName, roleId, managerId) {
    db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) 
              VALUES ("${firstName}", "${lastName}", ${roleId}, ${managerId})`, (err, results) => {
        if (err) {
            console.log(err); // Log any errors that occur during the query execution.
        } else {
            console.log(`Employee ${firstName} ${lastName} added successfully.`);
            // Handle successful query execution if needed.
        }
    });
}

// Function to insert a new role into the 'role' table.
function insertRole(db, title, salary, department_id) {
    db.query(`INSERT INTO role (title, salary, department_id) VALUES ("${title}", ${salary}, ${department_id})`, (err, results) => {
        if (err) {
            console.log(err); // Log any errors that occur during the query execution.
        } else {
            console.log(`Role ${title} added successfully.`);
            // Handle successful query execution if needed.
        }
    });
}

// Function to update the role of an employee in the 'employee' table.
function updateRole(db, role_id, id) {
    db.query(`UPDATE employee SET role_id=${role_id} WHERE id=${id}`, (err, results) => {
        if (err) {
            console.log(err); // Log any errors that occur during the query execution.
        } else {
            console.log(`Employee ID ${id} role updated successfully.`);
            // Handle successful query execution if needed.
        }
    });
}
//////////////////////////////////////////////////////////////////////////////
function deleteDepartment(db, departmentId) {
    db.query(`DELETE FROM department WHERE id = ?`, departmentId, (err, results) => {
        if (err) {
            console.error(err);
        } else {
            console.log(`\n\nDepartment with ID ${departmentId} deleted successfully!`);
        }
    });
}

function deleteRole(db, roleId) {
    db.query(`DELETE FROM role WHERE id = ?`, roleId, (err, results) => {
        if (err) {
            console.error(err);
        } else {
            console.log(`\n\nRole with ID ${roleId} deleted successfully!`);
        }
    });
}

function deleteEmployee(db, employeeId) {
    db.query(`DELETE FROM employee WHERE id = ?`, employeeId, (err, results) => {
        if (err) {
            console.error(`Error deleting employee: ${err.message}`);
        } else {
            console.log(`\n\nEmployee with ID ${employeeId} deleted successfully!`);
        }
    });
}

function updateEmployeeManager(db, employeeId, managerId) {
    db.query(`UPDATE employee SET manager_id = ? WHERE id = ?`, [managerId, employeeId], (err, results) => {
        if (err) {
            console.error(`Error updating employee's manager: ${err.message}`);
        } else {
            console.log(`\n\nEmployee with ID ${employeeId} had their manager updated successfully!`);
        }
    });
}

// Search Employees by Department
function searchByDepartment(db, departmentId) {
    db.query(`SELECT e.id, e.first_name, e.last_name, r.title
              FROM employee e
              JOIN role r ON e.role_id = r.id
              WHERE r.department_id = ?`, departmentId, (err, results) => {
        if (err) {
            console.error(err);
        } else {
            console.table(results);
        }
    });
}

// Search Employees by Role
function searchByRole(db, roleId) {
    db.query(`SELECT id, first_name, last_name FROM employee WHERE role_id = ?`, roleId, (err, results) => {
        if (err) {
            console.error(err);
        } else {
            console.table(results);
        }
    });
}

// Search Employees by Manager
function searchByManager(db, managerId) {
    db.query(`SELECT id, first_name, last_name FROM employee WHERE manager_id = ?`, managerId, (err, results) => {
        if (err) {
            console.error(err);
        } else {
            console.table(results);
        }
    });
}


// Export all the above functions
module.exports = {
    insertDepartment,
    insertEmployee,
    insertRole,
    updateRole,
    deleteDepartment,
    deleteRole,
    deleteEmployee,
    updateEmployeeManager,
    searchByDepartment,
    searchByRole,
    searchByManager

};