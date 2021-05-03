const Menu = require('../models/menu.model');

const addDish = async (req, res) => {
	try {
		const menu = new Menu({
			...req.body,
			restaurant: req.restaurant._id,
		});
		await menu.save();
		res.status(201).send(menu);
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
module.exports = { addDish, editDish, deleteDish };
