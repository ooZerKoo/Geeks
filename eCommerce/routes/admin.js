const express = require('express')
const router = express.Router()

const AdminController = require('../controllers/AdminController')
const CategoryController = require('../controllers/CategoryController')
const ContextController = require('../controllers/ContextController')
const ProductController = require('../controllers/ProductController')
const UserController = require('../controllers/UserController')
const User = require('../models/User')

router.get('/', User.isNotLoggedAdmin, UserController.renderForm)
router.post('/', User.isNotLoggedAdmin, ContextController.getPostData, AdminController.setLogin, User.isLoggedAdmin, User.goPanel)

router.get('/logout', User.isLoggedAdmin, User.logout)

router.get('/panel', User.isLoggedAdmin, AdminController.renderPanel)

router.get('/panel/products', User.isLoggedAdmin, AdminController.renderProducts)
router.post('/panel/products', User.isLoggedAdmin, ProductController.postProduct, AdminController.renderProducts)

router.get('/panel/orders', User.isLoggedAdmin, AdminController.renderOrders)

router.get('/panel/categories', User.isLoggedAdmin, AdminController.renderCategories)
router.post('/panel/categories', User.isLoggedAdmin, CategoryController.postCategory, AdminController.renderCategories)

router.get('/panel/customers', User.isLoggedAdmin, AdminController.renderCustomers)
router.post('/panel/customers', User.isLoggedAdmin, UserController.postUser, AdminController.renderCustomers)

module.exports = router