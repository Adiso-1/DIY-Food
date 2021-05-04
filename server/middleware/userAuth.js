const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const dotenv = require('dotenv').config();

const auth = async (req, res, next) => {
	try {
		const token = req.header('Authorization').replace('Bearer ', '');
		console.log(token);
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// search for a user by _id and token fron the user's tokens array
		const user = await User.findOne({
			_id: decoded._id,
			'tokens.token': token,
		});
		if (!user) {
			throw new Error();
		}
		req.userToken = token;
		req.user = user;
		next();
	} catch (error) {
		res.status(401).send({ error: 'Please Authenticate.', test: error });
	}
};

module.exports = auth;
