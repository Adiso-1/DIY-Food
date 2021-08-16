const redisClient = require('./init_redis');
const DEFAULT_EXPIRATION = 3600; // 1 hour

const getOrSetKey = (key, cb) => {
	return new Promise((resolve, reject) => {
		redisClient.get(key, async (error, data) => {
			if (error) reject(error);
			if (data !== null) {
				console.log('Cache Hit');
				return resolve(JSON.parse(data));
			}
			console.log('Cache Missed');
			const freshData = await cb();
			redisClient.setex(key, DEFAULT_EXPIRATION, JSON.stringify(freshData));
			resolve(freshData);
		});
	});
};
module.exports = getOrSetKey;
