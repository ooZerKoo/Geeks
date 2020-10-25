const Category = require('../models/Category')

const CategoryController = {
    async postCategory(req, res, next) {
        try {
            const { ...data } = req.body
            let error = null
            let success = null
            const id = data && data.id ? data.id : 0
            console.log(data)
            if (!data) {
                error = 'Rellena los campos'
            } else if (data.deleteForm) {
                const deleteCategory = await Category.findByIdAndDelete(id)
                if (deleteCategory) {
                    success = 'Categoría eliminada correctamente'
                } else {
                    error = 'Error al eliminar la categoría'
                }
            } else if (!data.name) {
                error = 'Rellena el nombre'
            } else if (!data.url) {
                error = 'Rellena el Enlace Amigable'
            } else if (await Category.exists(data.url, id)){
                error = 'El Enlace Amigable ya existe'
            } else {
                if (id !== 0) {
                    const updateCategory = await Category.findByIdAndUpdate(id,{...data})
                    if (updateCategory) {
                        success = 'Categoría actualizada correctamente'
                    } else {
                        error = 'No se ha podido actualizar la categoría'
                    }
                } else {
                    const Addcategory = await Category.create(data)
                    if (Addcategory) {
                        success = 'Categoría creada correctamente'
                    } else {
                        error = 'No se ha podido guardar la categoría'
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

module.exports = CategoryController