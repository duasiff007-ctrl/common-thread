
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true
        },

        category: {
            type: String,
            required: true,
            enum: ["tops", "bottoms", "purses", "sunglasses"]
        },

        gender: {
            type: String,
            required: true,
            enum: ["women", "men", "unisex"]
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        color: {
            type: String,
            required: true
        },

        image: {
            type: String,
            default: ""
        },

        stock: {
            type: Number,
            default: 0,
            min: 0
        },

        isFeatured: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
