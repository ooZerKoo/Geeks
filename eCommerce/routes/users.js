const express = require('express')
const ContextController = require('../controllers/ContextController')
const router = express.Router()

const UserController = require('../controllers/UserController')

/* GET users listing. */
router.get('/', UserController.isNotLoggedUser, UserController.renderForm)
router.post('/', UserController.isNotLoggedUser, ContextController.getPostData, UserController.setLogin, ContextController.getExtraVars, UserController.goPanel)

router.get('/register', UserController.renderRegister, UserController.isNotLoggedUser, UserController.renderForm)
router.post('/register', UserController.renderRegister, UserController.isNotLoggedUser, ContextController.getPostData, UserController.setRegister, ContextController.getExtraVars, UserController.goPanel)

router.get('/panel', UserController.isLoggedUser, UserController.renderPanel)
router.post('/panel', UserController.isLoggedUser, ContextController.getPostData, UserController.postUser, ContextController.getExtraVars, UserController.goPanel)

router.get('/logout', UserController.isLoggedUser, UserController.logout)

module.exports = router
