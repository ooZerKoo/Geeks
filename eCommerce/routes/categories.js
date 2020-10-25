const express = require('express')
const router = express.Router()

const ProductController = require('../controllers/ProductController')
const CategoryController = require('../controllers/CategoryController')
const UserController = require('../controllers/UserController')

router.get('/:url', CategoryController.renderMenu, UserController.renderMenu, CategoryController.getCategory, ProductController.getProductsCategory, CategoryController.renderList)

module.exports = router