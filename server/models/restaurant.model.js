const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema;

const menuSchema = new Schema({
	dish: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
});

const restaurantSchema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
		trim: true,
		unique: true,
	},
	phone: {
		type: String,
		required: true,
		trim: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
		trim: true,
	},
	category: {
		type: String,
		required: true,
		trim: true,
	},
	menu: [menuSchema],
	tokens: [
		{
			token: {
				type: String,
				required: true,
			},
		},
	],
});

menuSchema.virtual('orders', {
	ref: 'Order',
	localField: '_id',
	foreignField: 'menu',
});

restaurantSchema.virtual('orders', {
	ref: 'Order',
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
	const token = jwt.sign({ _id: restaurant._id.toString() }, 'hashhashhash');
	restaurant.tokens = [...restaurant.tokens, { token }];
	await restaurant.save();
	return token;
};

restaurantSchema.methods.toJSON = function () {
	const restaurant = this;
	const restaurantObject = restaurant.toObject();

	delete restaurantObject.password;
	delete restaurantObject.tokens;

	return restaurantObject;
};

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
module.exports = Restaurant;
