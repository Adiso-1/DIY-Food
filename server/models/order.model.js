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
		type: String,
		required: true,
	},
	isCompleted: {
		type: String,
		default: false,
	},
	dateAdded: {
		type: Date,
		default: new Date(),
	},
});

orederSchema.pre('save', async function (next) {
	const order = this;
	console.log(order);
	next();
});

const Order = mongoose.model('Order', orederSchema);
module.exports = Order;
