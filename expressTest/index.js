const express = require('express');
const bodyParser = require('body-parser');
const MovieRoute = require('./views/MovieRoute.js')

const app = express();

app.use(bodyParser.json())

app.use('/', MovieRoute);
app.listen(3000, () => console.log('ok, http://localhost:3000'));