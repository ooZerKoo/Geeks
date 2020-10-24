const MovieModel = require('../models/MovieModel.js');
const MovieController = {};

MovieController.get = (req, res) => res.render('movie', MovieModel.get());
MovieController.put = (req, res) => {
    let { body } = req;
    MovieModel.put(body);
    res.render('movie', body);
}
MovieController.getBy = (req, res) => {
    let { id } = req.params;
    res.render('movie', MovieModel.getBy(id))
}
MovieController.delete = (req, res) => {
    let { id } = req.params;
    res.render('movie', MovieModel.delete(id))
}
MovieController.update = (req, res) => {
    let { id } = req.params;
    let { body } = req;
    res.render('movie', MovieModel.update(id, body))
}

module.exports = MovieController;