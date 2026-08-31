const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const config = require('./config/config');
const validateConfig = require('./config/validate-config');

const { checkDatabaseConnection } = require('./db/postgres');
const { checkRedisConnection } = require('./db/redis');

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

app.get('/ready', async (req, res) => {
  const dependencies = {
    postgres: 'DOWN',
    redis: 'DOWN',
  };

  try {
    await checkDatabaseConnection();
    dependencies.postgres = 'UP';
  } catch (error) {
    console.error('PostgreSQL readiness check failed:', error.message);
  }

  try {
    await checkRedisConnection();
    dependencies.redis = 'UP';
  } catch (error) {
    console.error('Redis readiness check failed:', error.message);
  }

  const ready =
    dependencies.postgres === 'UP' &&
    dependencies.redis === 'UP';

  res.status(ready ? 200 : 503).json({
    status: ready ? 'READY' : 'NOT_READY',
    service: 'employee-platform-api',
    dependencies,
  });
});

module.exports = app;