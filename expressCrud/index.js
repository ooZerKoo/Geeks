const express = require('express');
const bodyParser = require('body-parser');
const MovieRouter = require('./views/MovieRouter')

const args = process.argv.slice(2);
const PORT = args[0];

const app = express();

app.use(bodyParser.json())

app.get('/', (req, res) => res.redirect('/movies'));
app.use('/movies', MovieRouter)

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));