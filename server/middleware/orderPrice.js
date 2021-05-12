// const Menu = require('../models/menu.model');

// const orderPrice = async (req, res, next) => {
// 	let price = 0;
// 	try {
// 		const dishes = await Menu.find({ _id: req.body.orderDetails });
// 		dishes.forEach((dish) => (price += dish.price));
// 		req.price = price;
// 		next();
// 	} catch (error) {
// 		res.status(404).send(error);
// 	}
// };
// module.exports = orderPrice;
