require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middleware/error');
const connectToMongoose = require('./database/mongodb');

const publicDirectory = path.join(__dirname, '../client/build');

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(publicDirectory));

const port = process.env.PORT || 5000;
connectToMongoose();

app.use('/api/users', require('./routes/users'));
app.use('/api/restaurants', require('./routes/restaurants'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/menu', require('./routes/menus'));
app.use(errorHandler);

app.get('/*', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(port, () => {
	console.log(`Server is running on port: ${port}`);
});
