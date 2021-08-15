const Redis = require('redis');
const redisClient = Redis.createClient();
const DEFAULT_EXPIRATION = 3600; // 1 hour

const getOrSetKey = (key, cb) => {
	return new Promise((resolve, reject) => {
		redisClient.get(key, async (error, data) => {
			if (error) reject(error);
			if (data !== null) return resolve(JSON.parse(data));
			console.log('Cache Missed');
			const freshData = await cb();
			redisClient.setex(key, DEFAULT_EXPIRATION, JSON.stringify(freshData));
			resolve(freshData);
		});
	});
};
module.exports = getOrSetKey;
