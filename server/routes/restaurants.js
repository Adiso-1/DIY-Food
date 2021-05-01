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
} = require('../controllers/restaurants.js');

router.post('/signup', signUp);
router.post('/login', login);
router.post('/logout', auth, logout);
router.post('/logoutAll', auth, logoutAll);
router.get('/profile', auth, getProfile);
router.patch('/add-dish', auth, addDish);
router.patch('/edit-dish', auth, editDish);

module.exports = router;
