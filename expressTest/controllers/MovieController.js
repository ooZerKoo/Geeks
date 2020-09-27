const MovieModel = require('../models/MovieModel.js');
const MovieController = {};

MovieController.get = (req, res) => res.json(MovieModel.get());
MovieController.put = (req, res) => {
    let { body } = req;
    MovieModel.put(body);
    res.json(body);
}
MovieController.getBy = (req, res) => {
    let { id } = req.params;
    res.json(MovieModel.getBy(id))
}
MovieController.delete = (req, res) => {
    let { id } = req.params;
    res.json(MovieModel.delete(id))
}
MovieController.update = (req, res) => {
    let { id } = req.params;
    let { body } = req;
    res.json(MovieModel.update(id, body))
}

module.exports = MovieController;