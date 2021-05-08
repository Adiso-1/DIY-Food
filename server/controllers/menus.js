const Menu = require('../models/menu.model');
const sharp = require('sharp');
const ErrorResponse = require('../utils/errorResponse');

const addDish = async (req, res) => {
	try {
		const menu = new Menu({
			...req.body,
			restaurant: req.restaurant._id,
		});
		await menu.save();
		res.status(201).send(menu);
	} catch (error) {
		res.status(400).send(error);
	}
};

const editDish = async (req, res) => {
	let preDish = await Menu.findOne({ dish: req.body.dish });
	try {
		const dish = await Menu.findOneAndUpdate(
			{ dish: req.body.dish },
			{
				price: req.body.price || preDish.price,
				description: req.body.description || preDish.description,
			},
			{
				useFindAndModify: false,
				new: true,
			}
		);
		res.send(dish);
	} catch (error) {
		res.status(400).send(error);
	}
};

const deleteDish = async (req, res) => {
	try {
		const dish = await Menu.findOneAndDelete({ dish: req.body.dish });
		res.send(dish);
	} catch (error) {
		res.status(400).send(error);
	}
};

const addDishImage = async (req, res, next) => {
	try {
		const buffer = await sharp(req.file.buffer)
			.resize({ width: 250, height: 250 })
			.png()
			.toBuffer();
		const dish = await Menu.findById(req.params.id);
		dish.image = buffer;
		await dish.save();
		res.status(201).send();
	} catch (error) {
		return next(new ErrorResponse('dish not found', 404));
	}
};
const getDishImage = async (req, res, next) => {
	try {
		const dish = await Menu.findById(req.params.id);
		if (!dish || !dish.image) {
			throw new Error();
		}
		res.set('Content-Type', 'image/png');
		res.send(dish.image);
	} catch (error) {
		return next(new ErrorResponse('Image not found', 404));
	}
};
const deleteDishImage = async (req, res, next) => {
	try {
		const dish = await Menu.findById(req.params.id);
		if (!dish || !dish.image) {
			throw new Error();
		}
		dish.image = undefined;
		await dish.save();
		res.send();
	} catch (error) {
		return next(new ErrorResponse('Image not found', 404));
	}
};
module.exports = {
	addDish,
	editDish,
	deleteDish,
	addDishImage,
	getDishImage,
	deleteDishImage,
};
