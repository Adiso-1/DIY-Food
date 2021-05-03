const { findOneAndDelete } = require('../models/menu.model');
const Menu = require('../models/menu.model');

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
module.exports = { addDish, editDish, deleteDish };
