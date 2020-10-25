const express = require('express')
const router = express.Router()

const ProductController = require('../controllers/ProductController')
const CategoryController = require('../controllers/CategoryController')
const UserController = require('../controllers/UserController')


/* GET product's page. */
router.get('/:url', CategoryController.renderMenu, UserController.renderMenu, ProductController.getProduct, ProductController.renderProduct)

module.exports = router
