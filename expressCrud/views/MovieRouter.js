const express = require('express');
const MovieController = require('../controllers/MovieController');
const router = express.Router();

router.get('/', MovieController.getAll);
router.post('/', MovieController.create);
router.get('/:id', MovieController.getBy);
router.put('/:id', MovieController.update);
router.delete('/:id', MovieController.delete);

module.exports = router;