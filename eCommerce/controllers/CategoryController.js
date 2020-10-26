const Category = require('../models/Category')


const CategoryController = {
    async postCategory(req, res, next) {
        try {
            const { ...data } = req.body
            let error, success = []
            const id = data && data.id ? data.id : 0
            if (!data) {
                error.push('Rellena los campos')
            } else if (data.deleteForm) {
                const deleteCategory = await Category.findByIdAndDelete(id)
                if (deleteCategory) {
                    success.push('Categoría eliminada correctamente')
                } else {
                    error.push('Error al eliminar la categoría')
                }
            } else if (!data.name) {
                error.push('Rellena el nombre')
            } else if (!data.url) {
                error.push('Rellena el Enlace Amigable')
            } else if (await Category.exists(data.url, id)){
                error.push('El Enlace Amigable ya existe')
            } else {
                if (id !== 0) {
                    const updateCategory = await Category.findByIdAndUpdate(id,{...data})
                    if (updateCategory) {
                        success.push('Categoría actualizada correctamente')
                    } else {
                        error.push('No se ha podido actualizar la categoría')
                    }
                } else {
                    const Addcategory = await Category.create(data)
                    if (Addcategory) {
                        success.push('Categoría creada correctamente')
                    } else {
                        error.push('No se ha podido guardar la categoría')
                    }
                }
            }
            req.context.error = error
            req.context.success = success
            next()
        } catch (error) {
            console.error(error)
        }
    },
    async renderMenu(req) {
        try {
            const base_url = process.env.CATEGORY_ROUTE+'/'
            const categories = await Category.getAll()
            const categoriesMenu = []
            for (i in categories) {
                categoriesMenu.push({
                    name: categories[i].name,
                    url: base_url + categories[i].url
                })
            }
            return categoriesMenu
        } catch (error) {
            console.error(error)
        }
    },
    async getCategory(req, res, next) {
        try {
            const { url } = req.params
            if (url) {
                req.context.category = await Category.findOne({url: url})
            } else {
                req.context.category = null
            }
            next()
        } catch (error) {
            console.error(error)
        }
    },
    renderList(req, res) {
        res.render('pages/product', {...req.context, title: req.context.category.name})
    }

}

module.exports = CategoryController