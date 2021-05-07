const crypto = require('crypto');
const User = require('../models/user.model');
const Restaurant = require('../models/restaurant.model');
const sendEmail = require('../utils/sendEmail');
const sharp = require('sharp');

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
		res.json({ user, token });
	} catch (error) {
		res.status(400).json('Error:' + error);
	}
};

const forgotPassword = async (req, res) => {
	const { email } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) {
			res.status(400).json('Email could not be sent');
			return new Error('Email could not be sent');
		}
		const resetToken = await user.getResetPasswordToken();
		await user.save();

		const resetUrlProd = `https://delicious-by-adi.herokuapp.com/users/resetpassword/${resetToken}`;
		const resetUrlDev = `http://localhost:3000/users/resetpassword/${resetToken}`;

		const message = `
			<h1>Yow have requested a password reset</h1>
			<p>Please go to this link to reset your password</p>
			<a href=${resetUrlDev} clicktracking=off>${resetUrlDev}</a>
		`;
		try {
			await sendEmail({
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
		res.status(404).send(error);
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
		res.status(400).json(error);
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

const getUserImage = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);

		if (!user || !user.avatar) {
			throw new Error();
		}
		res.set('Content-Type', 'image/png');
		res.send(user.avatar);
	} catch (error) {
		res.status(404).send();
	}
};

const deleteProfileImage = async (req, res) => {
	req.user.avatar = undefined;
	await req.user.save();
	res.send();
};

const getAllRestaurants = async (req, res) => {
	try {
		const restaurants = await Restaurant.find({});
		res.status(200).json(restaurants);
	} catch (error) {
		res.status(400).send();
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
};
