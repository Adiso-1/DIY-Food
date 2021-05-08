const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Order = require('../models/order.model');
const dotenv = require('dotenv').config();

const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			trim: true,
		},
		phone: {
			type: String,
			required: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
			trim: true,
		},
		address: {
			type: String,
			required: true,
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
	const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE,
	});
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
	// delete userObject.avatar;

	return userObject;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
