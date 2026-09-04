const { pool } = require('../db/postgres');

async function listEmployees({ page = 1, limit = 20 }) {
  const offset = (page - 1) * limit;

  const countResult = await pool.query(`
    SELECT COUNT(*)::int AS total
    FROM employees;
  `);

  const employeesResult = await pool.query(
    `
    SELECT
      id,
      employee_code,
      first_name,
      last_name,
      email,
      department,
      job_title,
      status,
      created_at,
      updated_at
    FROM employees
    ORDER BY id
    LIMIT $1 OFFSET $2;
    `,
    [limit, offset]
  );

  return {
    employees: employeesResult.rows,
    total: countResult.rows[0].total,
  };
}

async function createEmployee({
  employee_code,
  first_name,
  last_name,
  email,
  department,
  job_title,
}) {
  const result = await pool.query(
    `
    INSERT INTO employees (
      employee_code,
      first_name,
      last_name,
      email,
      department,
      job_title
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING
      id,
      employee_code,
      first_name,
      last_name,
      email,
      department,
      job_title,
      status,
      created_at,
      updated_at;
    `,
    [
      employee_code,
      first_name,
      last_name,
      email,
      department,
      job_title,
    ]
  );

  return result.rows[0];
}

module.exports = {
  listEmployees,
  createEmployee,
};