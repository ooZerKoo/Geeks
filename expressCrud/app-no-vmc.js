const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const args = process.argv.slice(2);
const PORT = args[0];

const app = express();
app.use(bodyParser.json())

const DOC_JSON = 'movies.json';
const movies_file = fs.readFileSync(DOC_JSON);
const movies = JSON.parse(movies_file);

app.get('/', (req, res) => {
    res.send('Hello World');
})

app.get('/movies', (req, res) => {
    let { title, p } = req.query;
    movies_list = movies;
    if (typeof p == 'undefined') {
        p = 1;
    }
    if (typeof title != 'undefined' && title.length > 0) {
        movies_list = movies_list.filter(m => m.title == title)
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
})

app.post('/movies', (req, res) => {
    let { id, title } = req.body;
    let movie = {id, title};
    movies.push(movie);
    fs.writeFileSync(DOC_JSON, JSON.stringify(movies, '', 1));
    res.json(movie);
})


app.get('/movies/:id', (req, res) => {
    let { id } = req.params;
    let movie = movies.find(m => m.id == id)
    res.json(movie);
})

app.put('/movies/:id', (req, res) => {
    let { id } = req.params;
    let { title } = req.body;

    let movs = movies.filter(m => m.id != id);

    if (movs.length == movies.length) {
        res.statusCode = 500;
        res.statusMessage = 'Elemento no encontrado';
        res.end();
    } else {
        let movie = {"id" : parseInt(id), "title" : title};
        movs.push(movie)
        fs.writeFileSync(DOC_JSON, JSON.stringify(movs, '', 2));
        res.json(movie);
    }
})

app.delete('/movies/:id', (req, res) => {
    let { id } = req.params;
    let movs = movies.filter(m => m.id != id);
    if (movs.length == movies.length) {
        res.statusCode = 500;
        res.statusMessage = 'Elemento no encontrado';
        res.end();
    } else {
        fs.writeFileSync(DOC_JSON, JSON.stringify(movs, '', 2));
        res.json(movs);
    }
})

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));