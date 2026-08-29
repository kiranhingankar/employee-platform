const config = require('./config');

function validateConfig() {
  const required = [
    ['DATABASE_HOST', config.database.host],
    ['DATABASE_NAME', config.database.name],
    ['DATABASE_USER', config.database.user],
    ['DATABASE_PASSWORD', config.database.password],
    ['REDIS_HOST', config.redis.host],
  ];

  const missing = required
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}

module.exports = validateConfig;
