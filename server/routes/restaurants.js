const router = require('express').Router();
const auth = require('../middleware/restaurntAuth');
const multer = require('multer');
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
	uploadLogoImage,
	getRestaurantLogo,
	deleteLogoImage,
} = require('../controllers/restaurants.js');

const upload = multer({
	limits: {
		fieldSize: 5000000,
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(jpg|jpeg|png)$/gi)) {
			return cb(new Error('Please upload an image'));
		}
		cb(undefined, true);
	},
});

router.post('/signup', signUp);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resetToken', resetPassword);
router.post('/logout', auth, logout);
router.post('/logoutAll', auth, logoutAll);
router.get('/profile', auth, getProfile);
router.get('/profile/menu', auth, getProfileMenu);
router.delete('/delete', auth, deleteRestaurant);
router.post(
	'/profile/upload',
	auth,
	upload.single('logo'),
	uploadLogoImage,
	(error, req, res, next) => {
		res.status(400).send({ error: error.message });
	}
);
router.delete(
	'/profile/upload',
	auth,
	deleteLogoImage,
	(error, req, res, next) => {
		res.status(400).send({ error: error.message });
	}
);
router.get('/profile/:id', getRestaurantLogo);
module.exports = router;
