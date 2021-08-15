const Redis = require('redis');

const redisClient = Redis.createClient({
	port: 6379,
	host:
		process.env.NODE_ENV === 'production'
			? 'https://delicious-by-adi.herokuapp.com/'
			: '127.0.0.1',
});

redisClient.on('connect', () => {
	console.log('redisClient connected to redis');
});

redisClient.on('ready', () => {
	console.log('redisClient connected to redis abnd ready to use');
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
