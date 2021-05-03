const router = require('express').Router();
const auth = require('../middleware/userAuth');
const {
	signUp,
	login,
	logout,
	logoutAll,
	getProfile,
	forgotPassword,
	resetPassword,
} = require('../controllers/users.js');

router.post('/signup', signUp);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resetToken', resetPassword);
router.post('/logout', auth, logout);
router.post('/logoutAll', auth, logoutAll);
router.get('/profile', auth, getProfile);
module.exports = router;
