const Redis = require('redis');

const redisClient = Redis.createClient({
	host: process.env.REDIS_HOST,
	password: process.env.REDIS_PASS,
	port: process.env.REDIS_PORT,
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
