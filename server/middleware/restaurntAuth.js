const jwt = require('jsonwebtoken');
const Restaurant = require('../models/restaurant.model');

const auth = async (req, res, next) => {
	try {
		const token = req.header('Authorization').replace('Bearer ', '');
		const decoded = jwt.verify(token, 'hashhashhash');
		// search for a restaurant by _id and token fron the restaurant's tokens array
		const restaurant = await Restaurant.findOne({
			_id: decoded._id,
			'tokens.token': token,
		});
		if (!restaurant) {
			throw new Error();
		}
		req.restaurantToken = token;
		req.restaurant = restaurant;
		next();
	} catch (error) {
		res.status(401).send({ error: 'Please Authenticate.' });
	}
};

module.exports = auth;
