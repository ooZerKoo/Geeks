const express = require('express');
const bodyParser = require('body-parser');
const MovieRouter = require('./views/MovieRouter')

const app = express();

const args = process.argv.slice(2);
const PORT = args[0];

app.use(bodyParser.json())
app.use('/', MovieRouter);

app.listen(PORT, () => console.log(`Server ready on http://localhost:${PORT}`))