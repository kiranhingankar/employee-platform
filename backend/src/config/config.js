const path = require('path');
const dotenv = require('dotenv');

// Load project-level .env
dotenv.config({
  path: path.resolve(__dirname, '../../../.env'),
});

const config = {
  nodeEnv: process.env.NODE_ENV || 'development',

  server: {
    port: Number(process.env.PORT) || 3000,
  },

  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number(process.env.DATABASE_PORT) || 5432,
    name: process.env.DATABASE_NAME || 'employee_platform',
    user: process.env.DATABASE_USER || 'employee_app',
    password: process.env.DATABASE_PASSWORD || '',
  },

  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
  },

  localstack: {
    endpoint:
      process.env.LOCALSTACK_ENDPOINT || 'http://localhost:4566',
    region:
      process.env.AWS_DEFAULT_REGION || 'ap-south-1',
  },
};

module.exports = config;