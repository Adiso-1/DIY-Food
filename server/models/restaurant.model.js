const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Order = require('../models/order.model');
const dotenv = require('dotenv').config();

const Schema = mongoose.Schema;

const restaurantSchema = new Schema({
	name: {
		type: String,
		required: [true, 'Please provide username'],
		trim: true,
		unique: true,
	},
	email: {
		type: String,
		required: [true, 'Please provide email address'],
		unique: true,
		match: [
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			'Please provide a valid email',
		],
	},
	phone: {
		type: String,
		required: [true, 'Please provide a phone number'],
		trim: true,
		unique: true,
	},
	password: {
		type: String,
		required: [true, 'Please add a password'],
		minlength: 6,
	},
	address: {
		type: String,
		required: [true, 'Please provide address'],
		trim: true,
	},
	category: {
		type: String,
		required: [true, 'Please pick a category'],
		trim: true,
	},
	resetPasswordToken: String,
	resetPasswordExpire: Date,
	tokens: [
		{
			token: {
				type: String,
				required: true,
			},
		},
	],
	logo: {
		type: Buffer,
	},
	coverPhoto: {
		type: Buffer,
	},
});

restaurantSchema.virtual('orders', {
	ref: 'Order',
	localField: '_id',
	foreignField: 'restaurant',
});

restaurantSchema.virtual('menu', {
	ref: 'Menu',
	localField: '_id',
	foreignField: 'restaurant',
});

restaurantSchema.pre('save', async function (next) {
	const restaurant = this;
	if (restaurant.isModified('password')) {
		restaurant.password = await bcrypt.hash(restaurant.password, 8);
	}
	next();
});

restaurantSchema.statics.findByCredentials = async (email, password) => {
	const restaurant = await Restaurant.findOne({ email });
	if (!restaurant) {
		throw new Error('Unable to login');
	}
	const isMatch = await bcrypt.compare(password, restaurant.password);
	if (!isMatch) {
		throw new Error('Unable to login');
	}
	return restaurant;
};

restaurantSchema.methods.generateAuthToken = async function () {
	const restaurant = this;
	const token = jwt.sign(
		{ _id: restaurant._id.toString() },
		process.env.JWT_SECRET,
		{ expiresIn: process.env.JWT_EXPIRE }
	);
	restaurant.tokens = [...restaurant.tokens, { token }];
	await restaurant.save();
	return token;
};

restaurantSchema.methods.getResetPasswordToken = function () {
	const resetToken = crypto.randomBytes(20).toString('hex');
	this.resetPasswordToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex');
	this.resetPasswordExpire = Date.now() + 10 * (60 * 1000);
	return resetToken;
};

restaurantSchema.methods.toJSON = function () {
	const restaurant = this;
	const restaurantObject = restaurant.toObject();

	delete restaurantObject.password;
	delete restaurantObject.tokens;
	delete restaurantObject.resetPasswordToken;
	delete restaurantObject.resetPasswordExpire;

	return restaurantObject;
};

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
module.exports = Restaurant;
