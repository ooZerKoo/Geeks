const UserController = require('../controllers/UserController')
const express = require('express');
const router = express.Router();

router.get('/', UserController.getAll)
router.post('/', UserController.register)

module.exports = router;
