const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Order = require('../models/order.model');
const dotenv = require('dotenv').config();

const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, 'Please provide username'],
			trim: true,
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
		},
		password: {
			type: String,
			required: [true, 'Please add a password'],
			minlength: 6,
		},
		address: {
			city: {
				type: String,
				required: [true, 'Please add a city'],
			},
			street: {
				type: String,
				required: [true, 'Please add a street'],
			},
			number: {
				type: String,
				required: [true, 'Please add a number'],
			},
			apartment: {
				type: String,
				required: [true, 'Please add an apartment'],
			},
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
		avatar: {
			type: Buffer,
		},
	},
	{ toJSON: { virtuals: true } }
);

userSchema.virtual('orders', {
	ref: 'Order',
	localField: '_id',
	foreignField: 'owner',
});

userSchema.pre('save', async function (next) {
	const user = this;
	if (user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, 8);
	}
	next();
});

userSchema.statics.findByCredentials = async (email, password) => {
	const user = await User.findOne({ email });
	if (!user) {
		throw new Error('Unable to login');
	}
	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) {
		throw new Error('Unable to login');
	}
	return user;
};

userSchema.methods.generateAuthToken = async function () {
	const user = this;
	const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
	user.tokens = [...user.tokens, { token }];
	await user.save();
	return token;
};

userSchema.methods.getResetPasswordToken = function () {
	const resetToken = crypto.randomBytes(20).toString('hex');
	this.resetPasswordToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex');
	this.resetPasswordExpire = Date.now() + 10 * (60 * 1000);
	return resetToken;
};

userSchema.methods.toJSON = function () {
	const user = this;
	const userObject = user.toObject();

	delete userObject.password;
	delete userObject.tokens;
	delete userObject.resetPasswordToken;
	delete userObject.resetPasswordExpire;

	return userObject;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
