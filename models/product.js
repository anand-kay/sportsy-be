const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    quantityleft: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    seller: {
        type: String,
        required: true
    },
    reviews: [{
        _userid: {
            type: String,
            required: true
        },
        star: {
            type: Number,
            required: true
        },
        review: {
            type: String,
            required: true
        },
        epoch: {
            type: Number,
            required: true,
            default: Date.now
        }
    }],
    rating: {
        type: Number,
        required: true,
        default: 0
    },
    category: {
        type: String,
        required: true
    },
    subcategory: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Product', ProductSchema);