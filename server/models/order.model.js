const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orederSchema = new Schema({
	owner: {
		type: String,
		required: true,
	},
	resturant: {
		type: String,
		required: true,
	},
	details: {
		food: [
			{
				type: String,
				required: true,
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
	},
	timestamps: true,
});

const Order = mongoose.model('Order', orederSchema);
module.exports = Order;
