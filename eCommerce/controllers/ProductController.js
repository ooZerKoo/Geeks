const Product = require('../models/Product');

const ProductController = {

    async getAll(req, res){
        try {
            const data = await Product.find()
            res.render('product', { products: data})
        } catch (error) {
            console.error(error)
        }
    },
    async getByCategory(req, res) {
        try {
            const { category } = req.params;
            const { ...filters } = req.query;
            
            let query = {};

            query.category = category;
            
            if (filters.hasOwnProperty('price')) {
                let p = filters.price.split('-')
                query.price = {$gte: p[0], $lte: p[1]}
            }

            if (filters.hasOwnProperty('discount')) {
                query.discount = {$gt: 0}
            }

            const data = await Product.find(query);
            res.render('product', { products: data })
        } catch (error) {
            console.error(error)
        }
    },
    async addProduct(req, res) {
        try {
            const { data } = req.body;
            const infoProduct = { ...data }
            infoProduct.category = infoProduct.category.toLowerCase()
            const newProduct = await Product.create(infoProduct)
            res.render('product', { product: newProduct})
        } catch (error) {
            console.error(error)
        }
    }
}

module.exports = ProductController;