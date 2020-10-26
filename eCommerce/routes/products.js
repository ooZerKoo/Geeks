const express = require('express')
const router = express.Router()

const ProductController = require('../controllers/ProductController')
const CategoryController = require('../controllers/CategoryController')
const UserController = require('../controllers/UserController')


/* GET product's page. */
router.get('/:url', ProductController.renderProduct)

module.exports = router
