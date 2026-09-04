const express = require('express');

const employeeController = require('../controllers/employee.controller');

const router = express.Router();

router.get('/', employeeController.listEmployees);
router.post('/', employeeController.createEmployee);

module.exports = router;