const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
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

const usersRouter = require('./routes/users');
const restaurantsRouter = require('./routes/restaurants');
const ordersRouter = require('./routes/orders');
const menuRouter = require('./routes/menus');

app.use('/users', usersRouter);
app.use('/restaurants', restaurantsRouter);
app.use('/orders', ordersRouter);
app.use('/menu', menuRouter);

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

const test = () => {};
test();
