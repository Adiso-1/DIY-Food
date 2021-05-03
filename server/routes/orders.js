const router = require('express').Router();
const userAuth = require('../middleware/userAuth');
const restaurantAuth = require('../middleware/restaurntAuth');
const orderPrice = require('../middleware/orderPrice');
const {
	addOrder,
	getUserOrders,
	getRestaurantsOrders,
} = require('../controllers/orders.js');

router.post('/add', userAuth, orderPrice, addOrder);
router.get('/userInfo', userAuth, getUserOrders);
router.get('/restaurantInfo', restaurantAuth, getRestaurantsOrders);
module.exports = router;
