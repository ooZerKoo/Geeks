const mongoose = require('mongoose')

const CategorySchema = mongoose.Schema({
    name: String,
    description: String,
    url: {
        type: String,
        unique: true,
        required: true
    }
})

CategorySchema.statics.getAll = async function() {
    try {
        const categories = await Category.find()
        return categories
    } catch (error) {
        console.error(error)
    }
}

CategorySchema.statics.exists = async function(search, id) {
    try {
        return await Category.findOne({
            url: search,
            _id: {$ne: id}
        })
    } catch (error) {
        console.error(error)
    }
}

const Category = mongoose.model('Category', CategorySchema)

module.exports = Category