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

const getUserOrders = async (req, res) => {
	try {
		await req.user.populate('orders').execPopulate();
		console.log(req.user);
		res.send(req.user.orders);
	} catch (error) {
		res.status(404).send();
	}
};

const getRestaurantsOrders = async (req, res) => {
	try {
		await req.restaurant.populate('orders').execPopulate();
		console.log(req.restaurant);
		res.send(req.restaurant.orders);
	} catch (error) {
		res.status(404).send();
	}
};

module.exports = { addOrder, getUserOrders, getRestaurantsOrders };
