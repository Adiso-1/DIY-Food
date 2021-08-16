const crypto = require('crypto');
const User = require('../models/user.model');
const Restaurant = require('../models/restaurant.model');
const Order = require('../models/order.model');
const sendEmail = require('../utils/sendEmail');
const sharp = require('sharp');
const ErrorResponse = require('../utils/errorResponse');
const getOrSetKey = require('../utils/getOrSetKey');

const signUp = async (req, res, next) => {
	const user = new User(req.body);
	try {
		await user.save();
		res.status(201).json(user);
	} catch (error) {
		next(error);
	}
};

const login = async (req, res, next) => {
	try {
		const user = await User.findByCredentials(
			req.body.email,
			req.body.password
		);
		const token = await user.generateAuthToken();
		res.json({ user, token });
	} catch (error) {
		return next(new ErrorResponse('Invalid credential', 401));
	}
};

const forgotPassword = async (req, res) => {
	const { email } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) {
			return new Error('Email could not be sent');
		}
		const resetToken = await user.getResetPasswordToken();
		await user.save();

		const RESET_URL = `${process.env.RESET_URL}${resetToken}`;

		const message = `
			<h1>Yow have requested a password reset</h1>
			<p>Please go to this link to reset your password</p>
			<a href=${RESET_URL} clicktracking=off>${RESET_URL}</a>
		`;
		try {
			sendEmail({
				to: user.email,
				subject: 'Password Reset Request',
				text: message,
			});
			res.status(200).json('Email sent');
		} catch (error) {
			user.resetPasswordToken = undefined;
			user.resetPasswordExpire = undefined;
			await user.save();
			throw new Error('Email could not be sent');
		}
	} catch (error) {
		next(error);
	}
};

const resetPassword = async (req, res, next) => {
	const resetPasswordToken = crypto
		.createHash('sha256')
		.update(req.params.resetToken)
		.digest('hex');
	try {
		const user = await User.findOne({
			resetPasswordToken,
			resetPasswordExpire: { $gt: Date.now() },
		});
		if (!user) {
			throw new Error('Invalid Reset Token');
		}
		user.password = req.body.password;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpire = undefined;

		await user.save();
		res.status(201).json('Password Reset Success');
	} catch (error) {
		return next(new ErrorResponse('Token Expired', 404));
	}
};

const logout = async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter((token) => {
			return token.token !== req.userToken;
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

const uploadProfileImage = async (req, res) => {
	const buffer = await sharp(req.file.buffer)
		.resize({ width: 250, height: 250 })
		.png()
		.toBuffer();
	req.user.avatar = buffer;
	await req.user.save();
	res.status(201).send();
};

const getUserImage = async (req, res, next) => {
	try {
		const user = await User.findById(req.params.id);

		if (!user || !user.avatar) {
			throw new Error();
		}
		res.set('Content-Type', 'image/png');
		res.send(user.avatar);
	} catch (error) {
		next(error);
	}
};

const deleteProfileImage = async (req, res) => {
	req.user.avatar = undefined;
	await req.user.save();
	res.send();
};

const getAllRestaurants = async (req, res) => {
	const allRestaurants = await getOrSetKey('allRestaurants', async () => {
		try {
			const data = await Restaurant.find({});
			return data;
		} catch (error) {
			res.status(400).send();
		}
	});
	res.status(200).json(allRestaurants);
};

const getRestaurant = async (req, res) => {
	try {
		const restaurant = await Restaurant.findById(req.params.id);
		res.status(200).json(restaurant);
	} catch (error) {
		res.status(400).send();
	}
};
const addRating = async (req, res, next) => {
	try {
		const order = await Order.findById(req.params.id);
		order.rating = req.query.rating;
		const restaurant = await Restaurant.findById(order.restaurant);
		restaurant.rating.push({
			owner: order.owner,
			rate: req.query.rating,
		});
		await restaurant.save();
		await order.save();
		res.send(order);
	} catch (error) {
		next(error);
	}
};

const updateProfile = async (req, res, next) => {
	try {
		const user = await User.findByIdAndUpdate(
			req.user._id,
			{ ...req.user.toObject(), ...req.body },
			{ new: true }
		);
		res.send(user);
	} catch (error) {
		return next(new ErrorResponse('User not found', 404));
	}
};

module.exports = {
	signUp,
	login,
	logout,
	logoutAll,
	getProfile,
	forgotPassword,
	resetPassword,
	uploadProfileImage,
	deleteProfileImage,
	getUserImage,
	getAllRestaurants,
	getRestaurant,
	addRating,
	updateProfile,
};
