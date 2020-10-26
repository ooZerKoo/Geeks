const express = require('express')
const router = express.Router()

const ProductController = require('../controllers/ProductController')
const CategoryController = require('../controllers/CategoryController')

router.get('/:url', CategoryController.getCategory, ProductController.getProductsCategory, CategoryController.renderList)

module.exports = router