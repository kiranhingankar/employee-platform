const app = require('./app');
const config = require('./config/config');

const server = app.listen(config.server.port, () => {
  console.log(
    `Employee Platform API listening on port ${config.server.port}`
  );
});

function shutdown(signal) {
  console.log(`${signal} received. Shutting down gracefully...`);

  server.close((error) => {
    if (error) {
      console.error('Error during server shutdown:', error);
      process.exit(1);
    }

    console.log('HTTP server closed.');
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
