const Product = require('../models/Product');

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
                    success.push('Producto eliminada correctamente')
                } else {
                    error.push('Error al eliminar el Producto')
                }
            } else if (!data.name) {
                error.push('Rellena el nombre')
            } else if (!data.url) {
                error.push('Rellena el Enlace Amigable')
            } else if (await Product.exists(data.url, id)){
                error.push('El Enlace Amigable ya existe')
            } else if(!data.price) {
                error.push('El Precio es necesario')
            } else if(!data.category) {
                error.push('La Categoría es necesaria')
            } else if(!data.quantity) {
                error.push('La cantidad es necesaria')
            } else {
                if (id !== 0) {
                    const updateProduct = await Product.findByIdAndUpdate(id,{...data})
                    if (updateProduct) {
                        success.push('Producto actualizado correctamente')
                    } else {
                        error.push('No se ha podido actualizar el Producto')
                    }
                } else {
                    data.Category = data.category
                    const AddProduct = await Product.create(data)
                    if (AddProduct) {
                        success.push('Producto creado correctamente')
                    } else {
                        error.push('No se ha podido guardar el Producto')
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
    async getProduct(req) {
        try {
            const { url } = req.params
            req.context.product = await Product.findOne({url: url})
            return
        } catch (error) {
            console.error(error)
        }
    },
    async renderProduct(req, res, next) {
        try {
            await ProductController.getProduct(req)
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
    }
}

module.exports = ProductController;