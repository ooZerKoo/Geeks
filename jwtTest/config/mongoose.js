const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/jwtTest', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
})
    .then(() => console.log('Successfuly connected to MongoDB'))
    .catch(console.error)