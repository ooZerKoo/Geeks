const MovieModel = {};
const express = require('express');
const MovieController = require('../controllers/MovieController');
const router = express.Router();

router.get('/', MovieController.getAll);
router.put('/', MovieController.create);

router.post('/:id', MovieController.update);
router.delete('/:id', MovieController.delete);
router.get('/:id', MovieController.getBy);


module.exports = router;