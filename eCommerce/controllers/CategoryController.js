const Category = require('../models/Category')


const CategoryController = {
    async postCategory(req, res, next) {
        try {
            const { ...data } = req.body
            let error, success = []
            const id = data && data.id ? data.id : 0
            if (!data) {
                error.push(3001)
            } else if (data.deleteForm) {
                const deleteCategory = await Category.findByIdAndDelete(id)
                if (deleteCategory) {
                    success.push(3001)
                } else {
                    error.push(3002)
                }
            } else if (!data.name) {
                error.push(3003)
            } else if (!data.url) {
                error.push(3004)
            } else if (await Category.exists(data.url, id)){
                error.push(3005)
            } else {
                if (id !== 0) {
                    const updateCategory = await Category.findByIdAndUpdate(id,{...data})
                    if (updateCategory) {
                        success.push(3002)
                    } else {
                        error.push(3006)
                    }
                } else {
                    const Addcategory = await Category.create(data)
                    if (Addcategory) {
                        success.push(3003)
                    } else {
                        error.push(3007)
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