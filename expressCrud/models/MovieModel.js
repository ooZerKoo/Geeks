var db = require('../movies.json');

MovieModel = {};

MovieModel.getAll = () => db;
MovieModel.findBy = (id) => db.find(m => m.id == id);
MovieModel.update = (newMovie) => {
    let movies = db.filter(m => m.id != newMovie.id);

    if (movies.length == db.length) {
       return false;
    } else {
        movies.push(newMovie);
        db = movies;
        return newMovie;
    }
}
MovieModel.delete = (id) => {
    let movies = db.filter(m => m.id != id);
    if (movies.length == db.length) {
        return false;
    } else {
        db = movies;
        return true;
    }
}

module.exports = MovieModel;