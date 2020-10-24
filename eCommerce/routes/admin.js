const AdminController = require('../controllers/AdminController')
const express = require('express')
const router = express.Router()

router.get('/', AdminController.getPanel);

router.get('/login', AdminController.getLogin);
router.post('/login', AdminController.setLogin);

router.get('/logout', AdminController.logout);


module.exports = router