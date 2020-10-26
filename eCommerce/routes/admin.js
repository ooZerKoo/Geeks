const express = require('express')
const router = express.Router()

const AdminController = require('../controllers/AdminController')
const CategoryController = require('../controllers/CategoryController')
const ContextController = require('../controllers/ContextController')
const ProductController = require('../controllers/ProductController')
const UserController = require('../controllers/UserController')

router.get('/', UserController.isNotLoggedAdmin, UserController.renderForm)
router.post('/', UserController.isNotLoggedAdmin, ContextController.getPostData, AdminController.setLogin, UserController.isLoggedAdmin, UserController.goPanel)

router.get('/logout', UserController.isLoggedAdmin, UserController.logout)

router.get('/panel', UserController.isLoggedAdmin, AdminController.renderPanel)

router.get('/panel/products', UserController.isLoggedAdmin, AdminController.renderProducts)
router.post('/panel/products', UserController.isLoggedAdmin, ProductController.postProduct, AdminController.renderProducts)

router.get('/panel/orders', UserController.isLoggedAdmin, AdminController.renderOrders)

router.get('/panel/categories', UserController.isLoggedAdmin, AdminController.renderCategories)
router.post('/panel/categories', UserController.isLoggedAdmin, CategoryController.postCategory, AdminController.renderCategories)

router.get('/panel/customers', UserController.isLoggedAdmin, AdminController.renderCustomers)
router.post('/panel/customers', UserController.isLoggedAdmin, UserController.postUser, AdminController.renderCustomers)

module.exports = router