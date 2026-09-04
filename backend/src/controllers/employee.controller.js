const employeeService = require('../services/employee.service');

async function listEmployees(req, res, next) {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(
      Math.max(Number(req.query.limit) || 20, 1),
      100
    );

    const result = await employeeService.listEmployees({
      page,
      limit,
    });

    res.status(200).json({
      data: result.employees,
      pagination: {
        page,
        limit,
        total: result.total,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function createEmployee(req, res, next) {
  try {
    const {
      employee_code,
      first_name,
      last_name,
      email,
      department,
      job_title,
    } = req.body;

    const requiredFields = {
      employee_code,
      first_name,
      last_name,
      email,
      department,
      job_title,
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([, value]) => !value || typeof value !== 'string' || !value.trim())
      .map(([field]) => field);

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Required fields are missing or invalid',
          fields: missingFields,
        },
      });
    }

    const employee = await employeeService.createEmployee({
      employee_code: employee_code.trim(),
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      email: email.trim().toLowerCase(),
      department: department.trim(),
      job_title: job_title.trim(),
    });

    return res.status(201).json({
      data: employee,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listEmployees,
  createEmployee,
};