const express = require('express');
const pageController = require('../controllers/pageController.js');
const router = express.Router();

/* GET home page. */
router.get('/', pageController.get);
router.put('/', pageController.post);
router.post('/:id', pageController.post);
router.delete('/:id', pageController.delete);

module.exports = router;
