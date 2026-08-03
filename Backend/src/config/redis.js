const { createClient } = require('redis');

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
   socket: {
        host: 'offer-secure-range-41938.db.redis.io',
        port: 15667
    }
});

module.exports = redisClient;





