const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const menuSchema = new Schema({
	restaurant: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'Restaurant',
	},
	dish: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	image: {
		type: Buffer,
	},
	tags: {
		type: Array,
	},
	dateAdded: {
		type: Date,
		default: new Date(),
	},
});

menuSchema.virtual('orders', {
	ref: 'Order',
	localField: '_id',
	foreignField: 'orderDetails',
});

const Menu = mongoose.model('Menu', menuSchema);
module.exports = Menu;
