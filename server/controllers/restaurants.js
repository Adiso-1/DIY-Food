const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
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

const forgotPassword = async (req, res) => {
	const { email } = req.body;
	try {
		const restaurant = await Restaurant.findOne({ email });
		if (!restaurant) {
			res.status(400).json('Email could not be sent');
			return new Error('Email could not be sent');
		}
		const resetToken = await restaurant.getResetPasswordToken();
		await restaurant.save();

		const resetUrl = `http://localhost:3000/restaurants/resetpassword/${resetToken}`;

		const message = `
			<h1>Yow have requested a password reset</h1>
			<p>Please go to this link to reset your password</p>
			<a href=${resetUrl} clicktracking=off>${resetUrl}</a>
		`;
		try {
			await sendEmail({
				to: restaurant.email,
				subject: 'Password Reset Request',
				text: message,
			});
			res.status(200).json('Email sent');
		} catch (error) {
			restaurant.resetPasswordToken = undefined;
			restaurant.resetPasswordExpire = undefined;
			await restaurant.save();
			throw new Error('Email could not be sent');
		}
	} catch (error) {
		res.status(404).send(error);
	}
};

const resetPassword = async (req, res, next) => {
	const resetPasswordToken = crypto
		.createHash('sha256')
		.update(req.params.resetToken)
		.digest('hex');
	try {
		const restaurant = await Restaurant.findOne({
			resetPasswordToken,
			resetPasswordExpire: { $gt: Date.now() },
		});
		if (!restaurant) {
			throw new Error('Invalid Reset Token');
		}
		restaurant.password = req.body.password;
		restaurant.resetPasswordToken = undefined;
		restaurant.resetPasswordExpire = undefined;

		await restaurant.save();
		res.status(201).json('Password Reset Success');
	} catch (error) {
		res.status(400).json(error);
	}
};

const logout = async (req, res) => {
	try {
		req.restaurant.tokens = req.restaurant.tokens.filter((token) => {
			return token.token !== req.restaurantToken;
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

const getProfileMenu = async (req, res) => {
	try {
		const restaurant = await Restaurant.findById(req.restaurant._id);
		await restaurant.populate('menu').execPopulate();
		res.send(restaurant.menu);
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
	getProfileMenu,
	deleteRestaurant,
	forgotPassword,
	resetPassword,
};
