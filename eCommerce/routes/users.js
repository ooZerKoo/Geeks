const UserController = require('../controllers/UserController')
const User = require('../models/User')
const express = require('express')
const router = express.Router()

/* GET users listing. */
router.get('/', User.isNotLoggedUser, UserController.renderLogin)
router.post('/', User.isNotLoggedUser, UserController.setLogin)

router.get('/register', User.isNotLoggedUser, UserController.renderRegister)
router.post('/register', User.isNotLoggedUser, UserController.setRegister)

router.get('/panel', User.isLoggedUser, UserController.renderPanel)
router.post('/panel', User.isLoggedUser, UserController.updatePassword)

router.get('/logout', User.isLoggedUser, UserController.logout)

module.exports = router
