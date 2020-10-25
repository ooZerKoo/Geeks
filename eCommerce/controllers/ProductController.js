const Product = require('../models/Product');

const ProductController = {

    async getAll(req, res){
        try {
            const data = await Product.getAll()
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
    async postProduct(req, res, next) {
        try {
            const { ...data } = req.body
            let error = null
            let success = null
            const id = data && data.id ? data.id : 0
            console.log(data)
            if (!data) {
                error = 'Rellena los campos'
            } else if (data.deleteForm) {
                const deleteProduct = await Product.findByIdAndDelete(id)
                if (deleteProduct) {
                    success = 'Producto eliminada correctamente'
                } else {
                    error = 'Error al eliminar el Producto'
                }
            } else if (!data.name) {
                error = 'Rellena el nombre'
            } else if (!data.url) {
                error = 'Rellena el Enlace Amigable'
            } else if (await Product.exists(data.url, id)){
                error = 'El Enlace Amigable ya existe'
            } else if(!data.price) {
                error = 'El Precio es necesario'
            } else if(!data.category) {
                error = 'La Categoría es necesaria'
            } else if(!data.quantity) {
                error = 'La cantidad es necesaria'
            } else {
                if (id !== 0) {
                    const updateProduct = await Product.findByIdAndUpdate(id,{...data})
                    if (updateProduct) {
                        success = 'Producto actualizado correctamente'
                    } else {
                        error = 'No se ha podido actualizar el Producto'
                    }
                } else {
                    data.Category = data.category
                    const AddProduct = await Product.create(data)
                    if (AddProduct) {
                        success = 'Producto creado correctamente'
                    } else {
                        error = 'No se ha podido guardar el Producto'
                    }
                }
            }
            req.admin_vars.error = error
            req.admin_vars.success = success
            next()
        } catch (error) {
            console.error(error)
        }
    }
}

module.exports = ProductController;