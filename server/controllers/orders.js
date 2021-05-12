const Order = require('../models/order.model');
const Restaurant = require('../models/restaurant.model');
const User = require('../models/user.model');

const addOrder = async (req, res, next) => {
	const order = new Order({
		...req.body,
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

		const newArr = await Promise.all(
			req.user.orders.map(async (el) => {
				const restaurant = await Restaurant.findById(el.restaurant);
				return { ...el.toObject(), restaurant: restaurant.name };
			})
		);

		res.send(newArr);
	} catch (error) {
		next(error);
	}
};

const getRestaurantsOrders = async (req, res) => {
	try {
		await req.restaurant.populate('orders').execPopulate();

		const newArr = await Promise.all(
			req.restaurant.orders.map(async (el) => {
				const user = await User.findById(el.owner);
				return { ...el.toObject(), owner: user.name, userPhone: user.phone };
			})
		);
		res.send(newArr);
	} catch (error) {
		res.status(404).send();
	}
};

const markAsCompleted = async (req, res, next) => {
	try {
		const order = await Order.findByIdAndUpdate(
			req.params.id,
			{
				isCompleted: 'true',
			},
			{ new: true }
		);
		res.send(order);
	} catch (error) {
		next(error);
	}
};

module.exports = {
	addOrder,
	getUserOrders,
	getRestaurantsOrders,
	markAsCompleted,
};
