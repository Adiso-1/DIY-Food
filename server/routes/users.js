const router = require('express').Router();
const { getUsers, addUser } = require('../controllers/users.js');

router.get('/', getUsers);
router.post('/add', addUser);
module.exports = router;
