const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const path = require('path');
const errorHandler = require('./middleware/error');

const publicDirectory = path.join(__dirname, '../client/build');

require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static(publicDirectory));
app.use(cors());
app.use(cookieParser());

const sign = process.env.NODE_ENV === 'production' ? '*' : '/';
app.get(sign, function (req, res) {
	res.sendFile('index.html', {
		root: path.join(__dirname, '../client/build'),
	});
});

const port = process.env.PORT || 5000;

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once('open', () => {
	console.log('MongoDB database connection established successfully');
});

app.use('/api/users', require('./routes/users'));
app.use('/api/restaurants', require('./routes/restaurants'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/menu', require('./routes/menus'));
app.use(errorHandler);

app.listen(port, () => {
	console.log(`Server is running on port: ${port}`);
});

//! Check populates
const Menu = require('./models/menu.model');
const Restaurant = require('./models/restaurant.model');

const main = async () => {
	//* This block will give us the restaurant who created this dish
	// const menu = await Menu.findById('608fe4421d19ea32c0e64f3e');
	// await menu.populate('restaurant').execPopulate();
	// console.log(menu.restaurant);
	//* This block will the the restaurant and find their menu};
	// const restaurant = await Restaurant.findById('608fdffddd19823ebcdc045a');
	// await restaurant.populate('menus').execPopulate();
	// console.log(restaurant.menus);
};
main();
