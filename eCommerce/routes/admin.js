const express = require('express')
const router = express.Router()

const AdminController = require('../controllers/AdminController')
const CategoryController = require('../controllers/CategoryController')
const ProductController = require('../controllers/ProductController')
const UserController = require('../controllers/UserController')
const User = require('../models/User')

router.get('/', User.isNotLoggedAdmin, UserController.renderForm)
router.post('/', User.isNotLoggedAdmin, AdminController.setLogin)
router.get('/logout', User.isLoggedAdmin, AdminController.renderMenus, User.logout)

router.get('/panel', User.isLoggedAdmin, AdminController.renderMenus, AdminController.renderPanel)

router.get('/panel/products', User.isLoggedAdmin, AdminController.renderMenus, AdminController.renderProducts)
router.post('/panel/products', User.isLoggedAdmin, AdminController.renderMenus, ProductController.postProduct, AdminController.renderProducts)

router.get('/panel/orders', User.isLoggedAdmin, AdminController.renderMenus, AdminController.renderOrders)

router.get('/panel/categories', User.isLoggedAdmin, AdminController.renderMenus, AdminController.renderCategories)
router.post('/panel/categories', User.isLoggedAdmin, AdminController.renderMenus, CategoryController.postCategory, AdminController.renderCategories)

router.get('/panel/customers', User.isLoggedAdmin, AdminController.renderMenus, AdminController.renderCustomers)
router.post('/panel/customers', User.isLoggedAdmin, AdminController.renderMenus, UserController.postUser, AdminController.renderCustomers)

module.exports = router