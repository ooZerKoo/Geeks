const UserController = require('../controllers/UserController')
const User = require('../models/User')
const express = require('express')
const router = express.Router()

/* GET users listing. */
router.get('/', UserController.getPostData, User.isNotLoggedUser, UserController.renderForm)
router.post('/', UserController.getPostData, User.isNotLoggedUser, UserController.getPostData, UserController.setLogin, User.isLoggedUser, User.goPanel)

router.get('/register', UserController.getPostData, UserController.renderRegister, User.isNotLoggedUser, UserController.renderForm)
router.post('/register', UserController.getPostData, UserController.renderRegister, User.isNotLoggedUser, UserController.getPostData, UserController.setRegister, User.isLoggedUser, User.goPanel)

router.get('/panel', User.isLoggedUser, User.getLogged, UserController.renderPanel)
router.post('/panel', User.isLoggedUser, User.getLogged, UserController.postUser, User.getLogged, UserController.renderPanel)

router.get('/logout', User.isLoggedUser, User.getLogged, User.logout)

module.exports = router
