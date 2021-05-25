const Menu = require('../models/menu.model');
const sharp = require('sharp');
const ErrorResponse = require('../utils/errorResponse');

const addDish = async (req, res, next) => {
	try {
		const menu = new Menu({
			...req.body,
			restaurant: req.restaurant._id,
		});
		await menu.save();
		res.status(201).send(menu);
	} catch (error) {
		next(error);
	}
};

const editDish = async (req, res) => {
	let preDish = await Menu.findById(req.params.id);
	try {
		const dish = await Menu.findByIdAndUpdate(
			req.params.id,
			{
				dish: req.body.dish || preDish.dish,
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
		return next(new ErrorResponse('Error', 404));
	}
};

const deleteDish = async (req, res, next) => {
	try {
		const dish = await Menu.findByIdAndDelete(req.params.id);
		res.send(dish);
	} catch (error) {
		return next(new ErrorResponse('Error', 404));
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
		res.status(201).send(dish);
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
		res.send(dish);
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
