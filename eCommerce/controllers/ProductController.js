const Product = require('../models/Product')

const ProductController = {
    async postProduct(req, res, next) {
        try {
            const { ...data } = req.body
            let error, success = []
            const id = data && data.id ? data.id : 0
            if (!data) {
                error.push('Rellena los campos')
            } else if (data.deleteForm) {
                const deleteProduct = await Product.findByIdAndDelete(id)
                if (deleteProduct) {
                    success.push(2001)
                } else {
                    error.push(2002)
                }
            } else if (!data.name) {
                error.push(2003)
            } else if (!data.url) {
                error.push(2004)
            } else if (await Product.exists(data.url, id)){
                error.push(2005)
            } else if(!data.price) {
                error.push(2006)
            } else if(!data.category) {
                error.push(2007)
            } else if(!data.quantity) {
                error.push(2008)
            } else {
                if (id !== 0) {
                    const updateProduct = await Product.findByIdAndUpdate(id,{...data})
                    if (updateProduct) {
                        success.push(2001)
                    } else {
                        error.push(2002)
                    }
                } else {
                    data.Category = data.category
                    const AddProduct = await Product.create(data)
                    if (AddProduct) {
                        success.push(2003)
                    } else {
                        error.push(2004)
                    }
                }
            }
            req.context.post.error = error
            req.context.post.success = success
            next()
        } catch (error) {
            console.error(error)
        }
    },
    async getProduct(req, res, next) {
        try {
            const { url } = req.params
            if (url) req.context.product = await Product.findOne({url: url})
            next()
        } catch (error) {
            console.error(error)
        }
    },
    async renderProduct(req, res, next) {
        try {
            res.render('pages/product', {...req.context, title: req.context.product.name})
        } catch (error) {
            console.error(error)
        }
    },
    async getProductsCategory(req, res, next) {
        try {
            const category = req.context.category
            req.context.products = category ? await Product.find({category: category._id}) : null
            next()
        } catch (error) {
            console.error(error)
        }
    },
    async redirectProduct(req, res, next) {
        try {
            const context = req.context
            if (context) {
                const product = req.context.product
                res.redirect(product.link)
            }
        } catch (error) {
            console.error(error)
        }
    }
}

module.exports = ProductController;