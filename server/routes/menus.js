const router = require('express').Router();
const restaurantAuth = require('../middleware/restaurntAuth');

const { addDish, editDish, deleteDish } = require('../controllers/menus');

router.patch('/add-dish', restaurantAuth, addDish);
router.patch('/edit-dish', restaurantAuth, editDish);
router.patch('/delete-dish', restaurantAuth, deleteDish);

module.exports = router;
