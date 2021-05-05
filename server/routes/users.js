const router = require('express').Router();
const auth = require('../middleware/userAuth');
const uploadImage = require('../utils/uploadImage');
const {
	signUp,
	login,
	logout,
	logoutAll,
	getProfile,
	forgotPassword,
	resetPassword,
	uploadProfileImage,
	deleteProfileImage,
	getUserPicture,
	getAllRestaurants,
} = require('../controllers/users.js');

router.get('/getAllRestaurants', getAllRestaurants);
router.get('/profile', auth, getProfile);
router.get('/profile/avatar', auth, getUserPicture);
router.post('/signup', signUp);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resetToken', resetPassword);
router.post('/logout', auth, logout);
router.post('/logoutAll', auth, logoutAll);
router.post(
	'/profile/upload',
	auth,
	uploadImage,
	uploadProfileImage,
	(error, req, res, next) => {
		res.status(400).send({ error: error.message });
	}
);
router.delete(
	'/profile/upload',
	auth,
	deleteProfileImage,
	(error, req, res, next) => {
		res.status(400).send({ error: error.message });
	}
);

module.exports = router;
