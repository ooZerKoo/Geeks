const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://root:PWsbGUdX52yxXfV@cluster0.stcd9.mongodb.net/eCommerce', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
})
    .then(() => console.log('Successfuly connected to MongoDB'))
    .catch(console.error)