const { Pool } = require('pg');

const config = require('../config/config');

const pool = new Pool({
  host: config.database.host,
  port: config.database.port,
  database: config.database.name,
  user: config.database.user,
  password: config.database.password,

  // Production-style connection settings
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (error) => {
  console.error('Unexpected PostgreSQL pool error:', error);
});

async function checkDatabaseConnection() {
  const client = await pool.connect();

  try {
    await client.query('SELECT 1');
    return true;
  } finally {
    client.release();
  }
}

module.exports = {
  pool,
  checkDatabaseConnection,
};