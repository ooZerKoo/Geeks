const UserController = require('../controllers/UserController')
const User = require('../models/User')
const express = require('express')
const ContextController = require('../controllers/ContextController')
const router = express.Router()

/* GET users listing. */
router.get('/', User.isNotLoggedUser, UserController.renderForm)
router.post('/', User.isNotLoggedUser, ContextController.getPostData, UserController.setLogin, User.isLoggedUser, User.goPanel)

router.get('/register', UserController.renderRegister, User.isNotLoggedUser, UserController.renderForm)
router.post('/register', UserController.renderRegister, User.isNotLoggedUser, ContextController.getPostData, UserController.setRegister, User.isLoggedUser, User.goPanel)

router.get('/panel', User.isLoggedUser, UserController.renderPanel)
router.post('/panel', User.isLoggedUser, UserController.postUser, User.goPanel)

router.get('/logout', User.isLoggedUser, User.logout)

module.exports = router
