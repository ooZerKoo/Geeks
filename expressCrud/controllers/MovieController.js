const MovieModel = require('../models/MovieModel');
const MovieController = {};

MovieController.getAll = (req, res) => {
    let { title, p } = req.query;
    movies_list = MovieModel.getAll();
    if (typeof p == 'undefined') {
        p = 1;
    }
    if (typeof title != 'undefined' && title.length > 0) {
        movies_list = movies_list.filter(m => m.title.includes(title))
    }
    let r = [];
    if (movies_list.length >= 20) {
        for (let i = ((p - 1) * 20); i < (20 * p); i++) {
            r.push(movies_list[i]);
        }
    } else {
        r = movies_list;
    }
    res.json(r);
}

MovieController.create = (req, res) => {
    let { id, title } = req.body;
    let movie = {id, title};
    movies = MovieModel.getAll();
    movies.push(movie);
    res.json(movie);
}

MovieController.getBy = (req, res) => {
    let { id } = req.params;
    res.json(MovieModel.findBy(id));
}

MovieController.update = (req, res) => {
    let { id } = req.params;
    let { body } = req;

    let data = {id, ...body};
    let newMovie = MovieModel.update(data);
    if (!newMovie) {
        res.statusCode = 500;
        res.statusMessage = 'Elemento no encontrado';
        res.end();
    } else {
        res.json(newMovie)
    }
}

MovieController.delete = (req, res) => {
    let { id } = req.params;
    let del = MovieModel.delete(id);
    if (!del) {
        res.statusCode = 500;
        res.statusMessage = 'Elemento no encontrado';
        res.end();
    } else {
        res.json(MovieModel.getAll());
    }
}

module.exports = MovieController;