const Order = require('../models/order.model');

const addOrder = async (req, res, next) => {
	const order = new Order({
		...req.body,
		// price: req.price,
		owner: req.user._id,
	});
	try {
		await order.save();
		res.status(201).send(order);
	} catch (error) {
		next(error);
	}
};

const getUserOrders = async (req, res, next) => {
	try {
		await req.user.populate('orders').execPopulate();
		res.send(req.user.orders);
	} catch (error) {
		next(error);
	}
};

const getRestaurantsOrders = async (req, res) => {
	try {
		await req.restaurant.populate('orders').execPopulate();
		res.send(req.restaurant.orders);
	} catch (error) {
		res.status(404).send();
	}
};

module.exports = { addOrder, getUserOrders, getRestaurantsOrders };
