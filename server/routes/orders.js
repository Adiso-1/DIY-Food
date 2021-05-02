const router = require('express').Router();
const userAuth = require('../middleware/userAuth');
const restaurantAuth = require('../middleware/restaurntAuth');
const { addOrder } = require('../controllers/orders.js');

// router.get('/info', auth, getOrders);
router.post('/add', userAuth, addOrder);
module.exports = router;
