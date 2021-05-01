const User = require('../models/user.model');

const getUsers = async (req, res) => {
	try {
		const users = await User.find();
		res.status(200).json(users);
	} catch (error) {
		res.status(404).json('Error:' + error);
	}
};

const addUser = async (req, res) => {
	const user = new User(req.body);
	try {
		await user.save();
		res.status(201).json(user);
	} catch (error) {
		res.status(400).json('Error:' + error);
	}
};

module.exports = { getUsers, addUser };
