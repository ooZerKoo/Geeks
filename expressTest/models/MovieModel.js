var db = require('../movies.json');

const MovieModel = {}

MovieModel.getAll = () => db;
MovieModel.create = (newMovie) => db.push(newMovie);
MovieModel.getBy = (id) => db.filter(d => d.id == id);
MovieModel.update = (id, data) => {
    let r = db.filter(d => d.id != id);
    r.push({id, ...data});
    db = r;
    return {id, ...data};
}
MovieModel.delete = (id) => {
    let r = db.filter(d => d.id != id);
    db = r;
    return db;
}

module.exports = MovieModel;
