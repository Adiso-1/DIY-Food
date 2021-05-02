const Restaurant = require('../models/restaurant.model');

const signUp = async (req, res) => {
	const restaurant = new Restaurant(req.body);
	try {
		await restaurant.save();
		res.status(201).json(restaurant);
	} catch (error) {
		res.status(400).json('Error:' + error);
	}
};

const login = async (req, res) => {
	try {
		const restaurant = await Restaurant.findByCredentials(
			req.body.email,
			req.body.password
		);
		const token = await restaurant.generateAuthToken();
		res.send({ restaurant, token });
	} catch (error) {
		res.status(400).json('Error:' + error);
	}
};

const logout = async (req, res) => {
	try {
		req.restaurant.tokens = req.restaurant.tokens.filter((token) => {
			return token.token !== req.token;
		});
		await req.restaurant.save();
		res.send();
	} catch (error) {
		res.status(500).send();
	}
};

const logoutAll = async (req, res) => {
	try {
		req.restaurant.tokens = [];
		await req.restaurant.save();
		res.send();
	} catch (error) {
		res.status(500).send();
	}
};

const getProfile = (req, res) => {
	res.send(req.restaurant);
};

const addDish = async (req, res) => {
	try {
		req.restaurant.menu = [...req.restaurant.menu, req.body];
		await req.restaurant.save();
		res.send(req.restaurant.menu);
	} catch (error) {
		res.status(400).send(error);
	}
};
const editDish = async (req, res) => {
	try {
		const index = req.restaurant.menu.findIndex((restaurant) => {
			return restaurant.dish === req.body.dish;
		});
		req.restaurant.menu[index] = {
			...req.restaurant.menu[index].toObject(),
			...req.body,
		};
		await req.restaurant.save();
		res.send(req.restaurant.menu);
	} catch (error) {
		res.status(400).send(error);
	}
};
const deleteDish = async (req, res) => {
	try {
		req.restaurant.menu = req.restaurant.menu.filter((rest) => {
			return rest.dish !== req.body.dish;
		});
		await req.restaurant.save();
		res.send(req.restaurant.menu);
	} catch (error) {
		res.status(400).send(error);
	}
};
const deleteRestaurant = async (req, res) => {
	try {
		const restaurnat = await Restaurant.findByIdAndDelete(req.restaurant._id);
		res.send(restaurnat);
	} catch (error) {
		res.status(400).send(error);
	}
};

module.exports = {
	signUp,
	login,
	logout,
	logoutAll,
	getProfile,
	addDish,
	editDish,
	deleteDish,
	deleteRestaurant,
};
