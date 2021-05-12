const router = require('express').Router();
const userAuth = require('../middleware/userAuth');
const restaurantAuth = require('../middleware/restaurntAuth');
const {
	addOrder,
	getUserOrders,
	getRestaurantsOrders,
	markAsCompleted,
} = require('../controllers/orders.js');

router.post('/add', userAuth, addOrder);
router.patch('/markAsCompleted/:id', restaurantAuth, markAsCompleted);
router.get('/userInfo', userAuth, getUserOrders);
router.get('/restaurantInfo', restaurantAuth, getRestaurantsOrders);
module.exports = router;
