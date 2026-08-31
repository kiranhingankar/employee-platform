const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const config = require('./config/config');
const validateConfig = require('./config/validate-config');

const { isDatabaseReady } = require('./db/postgres');
const { isRedisReady } = require('./db/redis');

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
  try {
    const [postgres, redis] = await Promise.all([
      isDatabaseReady(),
      isRedisReady(),
    ]);

    const ready = postgres && redis;

    res.status(ready ? 200 : 503).json({
      status: ready ? 'READY' : 'NOT_READY',
      service: 'employee-platform-api',
      dependencies: {
        postgres: postgres ? 'UP' : 'DOWN',
        redis: redis ? 'UP' : 'DOWN',
      },
    });
  } catch (error) {
    console.error('Readiness check failed:', error.message);

    res.status(503).json({
      status: 'NOT_READY',
      service: 'employee-platform-api',
      dependencies: {
        postgres: 'UNKNOWN',
        redis: 'UNKNOWN',
      },
    });
  }
});

module.exports = app;