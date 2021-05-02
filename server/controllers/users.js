const User = require('../models/user.model');

const signUp = async (req, res) => {
	const user = new User(req.body);
	try {
		await user.save();
		res.status(201).json(user);
	} catch (error) {
		res.status(400).json('Error:' + error);
	}
};

const login = async (req, res) => {
	try {
		const user = await User.findByCredentials(
			req.body.email,
			req.body.password
		);
		const token = await user.generateAuthToken();
		res.send({ user, token });
	} catch (error) {
		res.status(400).json('Error:' + error);
	}
};

const logout = async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter((token) => {
			return token.token !== req.token;
		});
		await req.user.save();
		res.send();
	} catch (error) {
		res.status(500).send();
	}
};

const logoutAll = async (req, res) => {
	try {
		req.user.tokens = [];
		await req.user.save();
		res.send();
	} catch (error) {
		res.status(500).send();
	}
};
const getProfile = (req, res) => {
	res.send(req.user);
};
module.exports = { signUp, login, logout, logoutAll, getProfile };
