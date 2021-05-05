const multer = require('multer');
const uploadImage = multer({
	limits: {
		fieldSize: 1000000,
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(jpg|jpeg|PNG)$/)) {
			return cb(new Error('Please upload an image'));
		}
		cb(undefined, true);
	},
});
const upload = uploadImage.single('avatar');
module.exports = upload;
