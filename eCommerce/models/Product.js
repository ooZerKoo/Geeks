const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Nombre Necesario'],
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: [true, 'Precio Necesario'],
    },
    discount: Number,
    discountType: {
        type: String,
        default: 'percent',
        enum: ['percent', 'amount']
    },
    category: {
        type: String,
        required: [true, 'Categoría Necesaria']
    },
    symbol: String,
    quantity: {
        type: Number,
        required: true,
        default: 0
    },
    url: {
        type: String,
        required: true,
        unique: true,
    }
});

ProductSchema.virtual('finalPrice').get(function(){
    let finalPrice = this.price;
    if (this.discount > 0) {
        if (this.discountType == 'amount') {
            finalPrice -= this.discount;
        } else {
            finalPrice -= this.price * (this.discount / 100);
        }
    }
    return finalPrice;
})

ProductSchema.virtual('getSymbol').get(function(){
    if (this.symbol) {
        return ' '+this.symbol;
    }
    return ' €';
})

ProductSchema.virtual('link').get(function(){
    return process.env.BASE_URL +process.env.PRODUCT_ROUTE + '/' + this.url;
})

ProductSchema.statics.getAll = async function() {
    try {
        const products = await Product.find()
        return products
    } catch (error) {
        console.error(error)
    }
}

ProductSchema.statics.exists = async function(search, id) {
    try {
        return await Product.findOne({
            url: search,
            _id: {$ne: id}
        })
    } catch (error) {
        console.error(error)
    }
}

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;