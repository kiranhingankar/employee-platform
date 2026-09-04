const request = require('supertest');

const app = require('../src/app');

test('creates a valid employee', async () => {
  const uniqueId = Date.now();

  const employee = {
    employee_code: `TEST${uniqueId}`,
    first_name: 'Test',
    last_name: 'Employee',
    email: `test.employee.${uniqueId}@example.com`,
    department: 'Engineering',
    job_title: 'Platform Engineer',
  };

  const response = await request(app)
    .post('/api/v1/employees')
    .send(employee);

  expect(response.statusCode).toBe(201);

  expect(response.body.data).toMatchObject({
    employee_code: employee.employee_code,
    first_name: employee.first_name,
    last_name: employee.last_name,
    email: employee.email,
    department: employee.department,
    job_title: employee.job_title,
    status: 'ACTIVE',
  });

  expect(response.body.data).toHaveProperty('id');
  expect(response.body.data).toHaveProperty('created_at');
  expect(response.body.data).toHaveProperty('updated_at');
});