const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orederSchema = new Schema({
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User',
	},
	restaurant: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'Restaurant',
	},
	cart: [
		{
			dish_id: {
				type: mongoose.Schema.Types.ObjectId,
				required: true,
				ref: 'Menu',
			},
			dishName: {
				type: String,
				required: true,
			},
			amount: {
				type: Number,
				required: true,
			},
		},
	],
	payment: {
		cardOwner: { type: String, required: true },
		cardNumber: { type: String, required: true },
		CVV: { type: String, required: true },
	},
	price: {
		type: Number,
		required: true,
	},
	deliveryAddress: {
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
	isCompleted: {
		type: String,
		default: false,
	},
	dateAdded: {
		type: Date,
		default: Date.now(),
	},
});

orederSchema.pre('save', async function (next) {
	const order = this;
	console.log(order);
	next();
});

const Order = mongoose.model('Order', orederSchema);
module.exports = Order;
