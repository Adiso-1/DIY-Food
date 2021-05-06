const router = require('express').Router();
const auth = require('../middleware/restaurntAuth');
const {
	signUp,
	login,
	logout,
	getProfile,
	getProfileMenu,
	logoutAll,
	deleteRestaurant,
	forgotPassword,
	resetPassword,
} = require('../controllers/restaurants.js');

router.post('/signup', signUp);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resetToken', resetPassword);
router.post('/logout', auth, logout);
router.post('/logoutAll', auth, logoutAll);
router.get('/profile', auth, getProfile);
router.get('/profile/menu', auth, getProfileMenu);
router.delete('/delete', auth, deleteRestaurant);

module.exports = router;
