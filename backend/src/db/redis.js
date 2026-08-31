const { createClient } = require('redis');

const config = require('../config/config');

const redisClient = createClient({
  socket: {
    host: config.redis.host,
    port: config.redis.port,
    reconnectStrategy(retries) {
      if (retries > 10) {
        return new Error('Redis reconnect limit exceeded');
      }

      return Math.min(retries * 100, 3000);
    },
  },
});

redisClient.on('error', (error) => {
  console.error('Redis client error:', error);
});

redisClient.on('connect', () => {
  console.log('Redis client connecting...');
});

redisClient.on('ready', () => {
  console.log('Redis client ready.');
});

redisClient.on('reconnecting', () => {
  console.log('Redis client reconnecting...');
});

async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}

async function checkRedisConnection() {
  await connectRedis();

  const result = await redisClient.ping();

  if (result !== 'PONG') {
    throw new Error(`Unexpected Redis response: ${result}`);
  }

  return true;
}

async function isRedisReady() {
  if (!redisClient.isReady) {
    return false;
  }

  try {
    const result = await redisClient.ping();
    return result === 'PONG';
  } catch (error) {
    return false;
  }
}

async function closeRedis() {
  if (redisClient.isOpen) {
    await redisClient.quit();
  }
}

module.exports = {
  redisClient,
  connectRedis,
  checkRedisConnection,
  isRedisReady,
  closeRedis
};