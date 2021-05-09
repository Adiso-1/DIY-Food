const router = require('express').Router();
const restaurantAuth = require('../middleware/restaurntAuth');
const {
	addDish,
	editDish,
	deleteDish,
	addDishImage,
	getDishImage,
	deleteDishImage,
} = require('../controllers/menus');
const multer = require('multer');

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

router.post('/add-dish', restaurantAuth, addDish);
router.patch('/edit-dish/:id', restaurantAuth, editDish);
router.delete('/delete-dish/:id', restaurantAuth, deleteDish);
router.post(
	'/add-dish-image/:id',
	restaurantAuth,
	upload.single('dish-image'),
	addDishImage
);
router.get('/get-dish-image/:id', getDishImage);
router.delete('/delete-dish-image/:id', restaurantAuth, deleteDishImage);

module.exports = router;
