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
	orderDetails: [
		{
			dish: {
				type: mongoose.Schema.Types.ObjectId,
				required: true,
				ref: 'Menu',
			},
		},
	],
	price: {
		type: Number,
		required: true,
	},
	dateAdded: {
		type: Date,
		default: new Date(),
	},
});

const Order = mongoose.model('Order', orederSchema);
module.exports = Order;
