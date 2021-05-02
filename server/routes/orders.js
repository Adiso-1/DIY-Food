const router = require('express').Router();
const userAuth = require('../middleware/userAuth');
const restaurantAuth = require('../middleware/restaurntAuth');
const {
	addOrder,
	getUserOrders,
	getRestaurantsOrders,
} = require('../controllers/orders.js');

router.get('/userInfo', userAuth, getUserOrders);
router.get('/restaurantInfo', restaurantAuth, getRestaurantsOrders);
router.post('/add', userAuth, addOrder);
module.exports = router;
