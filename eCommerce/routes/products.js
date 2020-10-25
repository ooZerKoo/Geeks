const ProductController = require('../controllers/ProductController');
const express = require('express');
const router = express.Router();

/* GET product's page. */
router.get('/', ProductController.getAll);
router.get('/:category', ProductController.getByCategory);

module.exports = router;
