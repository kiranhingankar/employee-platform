const app = require('./app');
const config = require('./config/config');

const { checkDatabaseConnection, pool } = require('./db/postgres');
const { checkRedisConnection, closeRedis } = require('./db/redis');

let server;

async function startServer() {
  try {
    console.log('Starting Employee Platform API...');

    console.log('Checking PostgreSQL connectivity...');
    await checkDatabaseConnection();
    console.log('PostgreSQL connectivity: OK');

    console.log('Checking Redis connectivity...');
    await checkRedisConnection();
    console.log('Redis connectivity: OK');

    server = app.listen(config.server.port, () => {
      console.log(
        `Employee Platform API listening on port ${config.server.port}`
      );
    });
  } catch (error) {
    console.error('Application startup failed:', error.message);

    await pool.end().catch(() => {});

    await closeRedis().catch(() => {});

    process.exit(1);
  }
}

async function shutdown(signal) {
  console.log(`${signal} received. Shutting down gracefully...`);

  if (!server) {
    await pool.end().catch(() => {});
    await closeRedis().catch(() => {});
    process.exit(0);
  }

  server.close(async (error) => {
    if (error) {
      console.error('Error during server shutdown:', error);
      process.exit(1);
    }

    console.log('HTTP server closed.');

    try {
      await pool.end();
      console.log('PostgreSQL pool closed.');

      await closeRedis();
      console.log('Redis connection closed.');

      console.log('Graceful shutdown completed.');

      process.exit(0);
    } catch (shutdownError) {
      console.error(
        'Error while closing application dependencies:',
        shutdownError.message
      );

      process.exit(1);
    }
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

startServer();