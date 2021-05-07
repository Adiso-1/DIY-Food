const router = require('express').Router();
const auth = require('../middleware/userAuth');
const multer = require('multer');
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
	getUserImage,
	getAllRestaurants,
} = require('../controllers/users.js');

const upload = multer({
	limits: {
		fieldSize: 1000000,
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(jpg|jpeg|png)$/gi)) {
			return cb(new Error('Please upload an image'));
		}
		cb(undefined, true);
	},
});

router.get('/getAllRestaurants', getAllRestaurants);
router.get('/profile', auth, getProfile);
router.post('/signup', signUp);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resetToken', resetPassword);
router.post('/logout', auth, logout);
router.post('/logoutAll', auth, logoutAll);
router.post(
	'/profile/upload',
	auth,
	upload.single('avatar'),
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
router.get('/profile/:id', getUserImage);

module.exports = router;
