const MovieModel = require('../models/MovieModel.js');
const MovieController = {}

MovieController.getAll = (req, res) => res.json(MovieModel.getAll());
MovieController.create = (req, res) => {
    let { body } = req;
    let data = {...body};
    MovieModel.create(data);
    res.json(data);
}
MovieController.delete = (req, res) => {
    let { id } = req.params;
    res.json(MovieModel.delete(id));
}
MovieController.update = (req, res) => {
    let { id } = req.params;
    let { body } = req;
    res.json(MovieModel.update(id, body));
}
MovieController.getBy = (req, res) => {
    let { id } = req.params
    res.json(MovieModel.getBy(id));
}
module.exports = MovieController;