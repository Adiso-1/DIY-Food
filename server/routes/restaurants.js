const router = require('express').Router();
const auth = require('../middleware/restaurntAuth');
const {
	signUp,
	login,
	logout,
	getProfile,
	logoutAll,
	addDish,
	editDish,
	deleteDish,
	deleteRestaurant,
} = require('../controllers/restaurants.js');

router.post('/signup', signUp);
router.post('/login', login);
router.post('/logout', auth, logout);
router.post('/logoutAll', auth, logoutAll);
router.get('/profile', auth, getProfile);
router.delete('/delete', auth, deleteRestaurant);
router.patch('/add-dish', auth, addDish);
router.patch('/edit-dish', auth, editDish);
router.patch('/delete-dish', auth, deleteDish);

module.exports = router;
