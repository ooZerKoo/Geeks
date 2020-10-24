const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
    name : {
        type: String,
        required: [true, 'Nombre Necesario'],
    },
    description : {
        type: String,
    },
    price : {
        type: Number,
        required: [true, 'Precio Necesario'],
    },
    discount : Number,
    discountType: {
        type: String,
        default: 'percent',
        enum: ['percent', 'amount']
    },
    category : {
        type: String,
        default: 'home',
        required: [true, 'Categoría Necesaria']
    },
    symbol: String,
    quantity : {
        type: Number,
        required: true,
        default: 0
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

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;