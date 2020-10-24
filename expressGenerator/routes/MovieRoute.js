const MovieController = require('../controllers/MovieController.js');
const express = require('express');
const router = express.Router();

router.get('/', MovieController.get)
router.put('/', MovieController.put)
router.get('/:id', MovieController.getBy)
router.delete('/:id', MovieController.delete)
router.post('/:id', MovieController.update)

module.exports = router;