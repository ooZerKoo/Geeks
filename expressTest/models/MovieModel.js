var db = require('../movies.json');

const MovieModel = {}

MovieModel.get = () => db;
MovieModel.put = (data) => {
    db.push(data);
    return db;
}
MovieModel.getBy = (id) =>  db.filter(d => d.id == id);
MovieModel.delete = (id) => {
    let r = db.filter(d => d.id != id)
    db = r;
    return db;
}
MovieModel.update = (id, data) => {
    let r = db.filter(d => d.id != id);
    let d = {id, ...data}
    r.push(d);
    return d;
}

module.exports = MovieModel;