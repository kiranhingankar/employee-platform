const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const config = require('./config/config');
const validateConfig = require('./config/validate-config');

validateConfig();

const app = express();

app.disable('x-powered-by');

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    service: 'employee-platform-api',
  });
});

app.get('/ready', (req, res) => {
  res.status(200).json({
    status: 'READY',
    service: 'employee-platform-api',
  });
});

module.exports = app;
