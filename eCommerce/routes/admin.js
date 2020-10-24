const express = require('express')
const router = express.Router()

const AdminController = require('../controllers/AdminController')
const UserController = require('../controllers/UserController')
const User = require('../models/User')

router.get('/', User.isNotLoggedAdmin, UserController.renderLogin)
router.post('/', User.isNotLoggedAdmin, AdminController.setLogin)

router.get('/panel', User.isLoggedAdmin, AdminController.renderPanel)

router.get('/logout', User.isLoggedAdmin, User.logout)


module.exports = router