const Redis = require('redis');

const redisClient = Redis.createClient({
	url: `redis://${process.env.REDIS_URL}`,
	auth_pass: process.env.REDIS_PASS,
});

redisClient.on('connect', () => {
	console.log('redisClient connected to redis');
});

redisClient.on('ready', () => {
	console.log('redisClient connected to redis and ready to use');
});

redisClient.on('error', (err) => {
	console.log(err.message);
});

redisClient.on('end', () => {
	console.log('redisClient disconnected from redis');
});

process.on('SIGINT', () => {
	redisClient.quit();
});

module.exports = redisClient;
