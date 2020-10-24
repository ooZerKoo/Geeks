const UserController = require('../controllers/UserController');
const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', UserController.getUser);
router.post('/', UserController.updatePassword);
router.get('/logout', UserController.logout);

module.exports = router;
