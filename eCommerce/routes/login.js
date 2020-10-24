const UserController = require('../controllers/UserController');
const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', UserController.getLogin);
router.post('/', UserController.setLogin);

router.get('/new', UserController.getRegister);
router.post('/new', UserController.setRegister);

module.exports = router;
